'use strict';

/**
 * Main module of the element.
 */
var app = angular.module('here-maps-angular', ["here-maps-angular-services", "here-maps-angular-directives"]);

app.constant('hereMapsConfig', {
    App_Id: "b1EnEFoJUlM7DxbOUluz",
    App_Code: "9l73AMb88mO7U-udRkrIUQ",
    zoomLevel: 10,
    addressZoomLevel: 18,
    defaultLanguage: "en-US"
});

app = angular.module('here-maps-angular-services', []);
app.service("Platform", function (hereMapsConfig, $q) {

    var service = {
        create: function () {
            return service.deferred.promise;
        },
        init: function () {
            service.deferred.resolve(new H.service.Platform({
                'app_id': hereMapsConfig.App_Id,
                'app_code': hereMapsConfig.App_Code,
                'useHTTPS': true
            }));
        },
        deferred: $q.defer()
    };
    head.load("/mapsjs/mapsjs-core.js", "/mapsjs/mapsjs-service.js", "/mapsjs/mapsjs-mapevents.js", "/mapsjs/mapsjs-ui.js", "/mapsjs/mapsjs-ui.css", service.init);

    return service;
});

app.service("GeocodeConverter", function () {
    return {
        toAddress: function (result) {
            if (!result) {
                return null;
            }
            var position = result.Response.View[0].Result[0].Location.DisplayPosition;
            return {lat: position.Latitude, lng: position.Longitude};
        },
        toPosition: function (result) {
            if (!result) {
                return null;
            }
            var locationAddress = result.Response.View[0].Result[0].Location.Address;
            var streetWithHouseNumber = this.buildStreetWithHouseNumber(locationAddress.Street, locationAddress.HouseNumber);
            return {zip: locationAddress.PostalCode, city: locationAddress.City, street: streetWithHouseNumber};
        },
        buildStreetWithHouseNumber: function (street, houseNumber) {
            if (typeof street == "undefined") {
                return null;
            }

            if (typeof houseNumber == "undefined") {
                return street;
            }

            return street + " " + houseNumber;
        },
        describeAddress: function (address) {
            var params = [];
            if (address.street) {
                params.push(address.street);
            }
            if (address.zip) {
                params.push(address.zip);
            }
            if (address.city) {
                params.push(address.city);
            }
            return params.join(',');
        },
        describePosition: function () {
            var radius = 150; //using a 150 meter radius
            return [address.lat, address.lng, radius].join(",");
        }
    }
});

app.service("Geocoding", function (Platform, GeocodeConverter, $q) {
    var service = {
        geocode: function (address) {
            var deferred = $q.defer();
            service.applyGeocode(address, deferred);
            return deferred.resolve;
        },
        applyGeocode: function (address, deferred) {
            if (("zip" in address) && ("city" in address)) {
                return service.reverseGeocode.apply(service, arguments);
            }
            return service._geocode.apply(service, arguments);
        },
        _geocode: function (address, deferred) {
            Platform.create().then(function (platform) {
                var geocoder = platform.getGeocodingService();
                geocoder.geocode({serchText: GeocodeConverter.describeAddress(address)}, service.resolveGeocodeProxie(deferred), deferred.reject);
            });
        },
        resolveGeocodeProxie: function (deferred) {
            return function (result) {
                deferred.resolve(GeocodeConverter.toAddress(result));
            }
        },
        resolvePositionProxie: function (deferred) {
            return function (result) {
                deferred.resolve(GeocodeConverter.toPosition(result));
            }
        },
        reverseGeocode: function (address, deferred) {
            Platform.create().then(function (platform) {
                var geocoder = platform.getGeocodingService();
                geocoder.reverseGeocode({
                    prox: GeocodeConverter.describePosition(address),
                    mode: 'retrieveAddresses',
                    maxresults: '1'
                }, service.resolvePositionProxie(deferred), defer.reject);
            });
        }
    };
    return service;
});
app.service("Template", function () {
    var tmpl = {
        create: function () {
            return angular.element('<div class="heremap-wrapper" />').append(tmpl.createContainer());
        },
        createPlaces: function () {
            return angular.element('<div class="heremap-places" data-ng-style="{height:heremapPlacesHeight}" />').append(tmpl.createPlacesTable());
        },
        createPlacesTable: function () {
            return angular.element('<table />')
                .append(tmpl.createPlacesTableHeader())
                .append(tmpl.createPlacesTableBody())
                .append(tmpl.createPlacesTableFoot());
        },
        createPlacesTableHeader: function () {
            return angular.element('<tr />').append(tmpl.createPlacesTableHeaderTD());
        },
        createPlacesTableHeaderTD: function () {
            return angular.element('<td class="thead" data-ng-click="toggleSpaces()" />').append("<span>{{pagedList.offset+1}} to {{pagedList.offsetTop}} of {{pagedList.totalCount}}</span><i></i>");
        },
        createPlacesTableBody: function () {
            return angular.element('<tr class="tbody" />').append(tmpl.createContainerList());
        },
        createContainerList: function () {
            return angular.element('<div class="container-list" />').append(tmpl.createUList());
        },
        createUList: function () {
            return angular.element('<ul class="list" />').append(tmpl.createListItem());
        },
        createListItem: function () {
            var element = angular.element('<li data-ng-repeat="row in pagedList.getRows()" data-ng-click="setSelected(row)" data-ng-class="{selected : selected.index == row.index}" />');
            element.append(tmpl.createSwg());
            element.append(tmpl.createNameLabel());
            element.append(tmpl.createAddressLabel());
            element.append(tmpl.createAddressLink());
            return element;
        },
        createAddressLink: function () {
            return angular.element('<span class="link" />')
                .append('<span data-ng-click="zoomIn(row)">Zoom in</span>')
                .append('<span data-ng-click="getDirection(row)">Get Direction</span>');
        },
        createNameLabel: function () {
            return angular.element('<b>{{row.name}}</b>');
        },
        createSwg: function () {
            return angular.element('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" />')
                .html('<rect stroke="white" fill="#e9144b" x="1" y="1" width="15" height="15" /><text x="8" y="12" font-size="8pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">{{row.index+1}}</text>');
        },
        createAddressLabel: function () {
            return angular.element('<p />')
                .append('<span class="street" >{{row.street}}</span>')
                .append('<br data-ng-show="row.street">')
                .append('<span class="zip-city" >{{row.zip}} {{row.city}}</span>');
        },
        createPlacesTableFoot: function () {
            return angular.element('<tr class="tfoot"/>')
                .append('<span data-ng-click="pagedList.prevPage()" data-ng-show="pagedList.currentPage > 0" ><b>&lt;</b></span>')
                .append('<span data-ng-click="pagedList.currentPage = page" data-ng-repeat="page in pagedList.totalPages" data-ng-class="{selected : page == pagedList.currentPage}" > {{page+1}} </span>')
                .append('<span data-ng-click="pagedList.nextPage()" data-ng-show="pagedList.currentPage+1 < pagedList.pageCount" ><b>&gt;</b></span>');
        },
        createContainer: function () {
            return angular.element('<div class="heremap-outer-container" />').append(tmpl.createPlaces()).append(tmpl.createHereMap());
        },
        createHereMap: function () {
            return angular.element('<div class="heremap" />');
        }
    };

    return tmpl;
});
app = angular.module('here-maps-angular-directives', []);
app.directive("hereMaps", function (hereMapsConfig, Platform, Template) {
    return {
        restrict: 'EAC',
        scope: {},
        controller: HereMapsController,
        replace: false,
        link: function (scope, element, attr) {
            //apply attributes to scope and config
            angular.extend(hereMapsConfig, angular.fromJson(attr.appToken));
            scope.setAllRows(angular.fromJson(element.text() || "[]"));
            scope.zoomLevel = angular.fromJson(attr.zoomLevel);

            var tmpl = Template.create();
            element.empty().append(tmpl);
        }
    };
});

function HereMapsController($scope) {
    $scope.places = [];
    $scope.heremapPlacesHeight = "100%";

    $scope.setAllRows = function (places) {
        $scope.places = places;
    }
}