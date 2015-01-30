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
            service.platform = new H.service.Platform({
                'app_id': hereMapsConfig.App_Id,
                'app_code': hereMapsConfig.App_Code,
                'useHTTPS': true
            });

            service.deferred.resolve(service.platform);
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
        describePosition: function (address) {
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
            return deferred.promise;
        },
        applyGeocode: function (address, deferred) {
            if (("lat" in address) && ("lng" in address)) {
                return service.reverseGeocode.apply(service, arguments);
            }
            return service._geocode.apply(service, arguments);
        },
        _geocode: function (address, deferred) {
            Platform.create().then(function (platform) {
                platform.getGeocodingService().geocode({searchText: GeocodeConverter.describeAddress(address)}, service.resolveGeocodeProxie(deferred), deferred.reject);
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
            if (("zip" in address) && ("city" in address)) {
                //delegate to geocode service
                return deferred.resolve(address);
            }
            Platform.create().then(function (platform) {
                platform.getGeocodingService().reverseGeocode({
                    prox: GeocodeConverter.describePosition(address),
                    mode: 'retrieveAddresses',
                    maxresults: '1'
                }, service.resolvePositionProxie(deferred), deferred.reject);
            });
        }
    };
    return service;
});
app.service("HereMapsRouting", function () {

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
            return angular.element('<tr />').append(tmpl.createContainerTD());
        },
        createContainerTD: function () {
            return angular.element('<td class="tbody" valign="" />').append(tmpl.createContainerList());
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
                .append('<span data-ng-click="zoomIn(row)" class="zoom-in">Zoom in</span>')
                .append('<span data-ng-click="getDirection(row)" class="get-direction">Get Direction</span>');
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
            return angular.element('<tr />').append(angular.element('<td class="tfoot" />')
                .append('<span data-ng-click="pagedList.prevPage()" data-ng-show="pagedList.currentPage > 0" ><b>&lt;</b></span>')
                .append('<span data-ng-click="pagedList.currentPage = page" data-ng-repeat="page in pagedList.totalPages" data-ng-class="{selected : page == pagedList.currentPage}" > {{page+1}} </span>')
                .append('<span data-ng-click="pagedList.nextPage()" data-ng-show="pagedList.currentPage+1 < pagedList.pageCount" ><b>&gt;</b></span>'));
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
app.directive("hereMaps", function (hereMapsConfig, Platform, Template, Geocoding, $compile, $timeout, $q) {
    return {
        restrict: 'EAC',
        scope: {},
        controller: HereMapsController,
        replace: false,
        link: function (scope, element, attr) {
            var startTime = new Date().getTime();
            console.info("start render here-map-angular...", new Date());
            //apply attributes to scope and config
            angular.extend(hereMapsConfig, angular.fromJson(attr.appToken));
            scope.setAllRows(angular.fromJson(element.text() || "[]"));
            scope.zoomLevel = angular.fromJson(attr.zoomLevel) || hereMapsConfig.zoomLevel;

            //replace body with Template
            var template = $compile(Template.create())(scope);
            element.empty().append(template);

            //TODO find another to get element without jquery
            var mapContainer = $(element).find(".heremap").get(0);
            var map = null;
            var defaultLayers = null;
            //default UI components
            var ui = null;
            var group = null;

            function renderPlatform(platform) {

                console.info("start render platform...", {zoom: scope.zoomLevel});
                defaultLayers = platform.createDefaultLayers();
                scope.map = map = new H.Map(mapContainer, defaultLayers.normal.map, {zoom: scope.zoomLevel});
                group = new H.map.Group();
                map.addObject(group);

                // MapEvents enables the event system
                // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
                var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

                // Create the default UI components
                ui = H.ui.UI.createDefault(map, defaultLayers, hereMapsConfig.defaultLanguage);

                // add 'tap' event listener, that opens info bubble, to the group
                group.addEventListener('tap', tapEventListener, false);

                //set controllers alignment
                ui.getControl('mapsettings').setAlignment('bottom-right');
                ui.getControl('zoom').setAlignment('bottom-right');
                ui.getControl('scalebar').setAlignment('bottom-right');

                //try to geocode / reverseGeocode
                var promises = geocodePromises();

                $q.all(promises).then(setViewBounds);

            }

            function setViewBounds(addresses){
                map.setViewBounds(group.getBounds());
                var objects = group.getObjects();
                if (objects.length == 1) {
                    var data = objects[0].getData();
                    scope.zoomIn({zoom: scope.zoomLevel, lat: data.lat, lng: data.lng});
                }
                console.info("render here-map-angular done and took: ", new Date().getTime()-startTime);
            }

            function tapEventListener(evt) {
                // event target is the marker itself, group is a parent event target
                // for all objects that it contains
                var bubble = new H.ui.InfoBubble(evt.target.getPosition(), {
                    // read custom data
                    content: createInfoBubbleContent(evt.target.getData(), scope.$id)
                });
                scope.setSelected(evt.target.getData());
                // show info bubble
                ui.addBubble(bubble);
            }

            function geocodePromises() {
                var promises = [];
                for (var index = 0; index < scope.pagedList.rows.length; index++) {
                    var address = scope.pagedList.rows[index];
                    var promise = Geocoding.geocode(address).then(function extendAddress(data) {
                       console.log(data);
                        angular.extend(address, data);
                        //create marker for this position
                        var marker = createMarker(address);
                        angular.extend(address, {marker: marker});

                        group.addObject(marker);
                        return address;
                    });
                    promises.push(promise);
                }
                return promises;
            }



            $timeout(function () {
                Platform.create().then(renderPlatform);
            }, 1);
        }
    };

    function createMarker(address) {
        var svgMarkup = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#e9144b" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">' + (address.index + 1) + '</text></svg>';
        var icon = new H.map.Icon(svgMarkup);
        var marker = new H.map.Marker({lat: address.lat, lng: address.lng}, {icon: icon});
        marker.setData(address);
        return marker;
    }

    function createInfoBubbleContent(address, scopeId) {
        var html = '<div id="info-bubble-{{scopeId}}" data-index="{{index}}" class="info-bubble-content"><b>{{row.name}}</b><p>{{row.street}}<br>{{row.zip}} {{row.city}}</p><span class="link info-bubble-action"><span class="pull-left zoom-in">Zoom in</span><span class="pull-right get-direction" >Get Direction</span></span></div>';
        html = $interpolate(html)({row: address, scopeId: scopeId});
        return html;
    }
})
;
function HereMapsController($scope, $element, $window, $timeout, HereMapsRouting, hereMapsConfig) {

    $scope.loading = false;
    $scope.displaySpaces = true;
    $scope.heremapPlacesHeight = "100%";
    $scope.zIndex = 0;
    $scope.pagedList = {
        rows: [],
        maxRows: 5,
        currentPage: 0,
        totalPages: [],//handle as array for ng-repeat
        pageCount: 0,
        totalCount: 0,

        prevPage: function HereMapsController_pagedList_prevPage() {
            this.currentPage--;
        },
        nextPage: function HereMapsController_pagedList_nextPage() {
            this.currentPage++;
        },
        setAllRows: function HereMapsController_pagedList_setAllRows(rows) {
            this.rows = rows;
            angular.forEach(this.rows, function (it, i) {
                it.index = i
            });
            this.totalCount = this.rows.length;
            this.pageCount = Math.ceil(this.totalCount / this.maxRows);
            this.totalPages = $scope.range(this.pageCount);
            $scope.zIndex = this.totalCount;
        },
        getRows: function HereMapsController_pagedList_getRows() {
            this.offset = this.currentPage * this.maxRows;
            this.offsetTop = Math.min(this.offset + this.maxRows, this.totalCount);
            return this.rows.slice(this.offset, this.offsetTop);
        }
    };

    $scope.range = function (size) {
        var range = [];
        while (range.length < size) {
            range.push(range.length);
        }
        return range;
    };

    $($window.document)
        .on("click", "div#info-bubble-" + $scope.$id + " .info-bubble-action span", function liveDomEvent(e) {
            e.preventDefault();
            var elem = $(e.target);
            if (elem.hasClass("zoom-in")) {
                $scope.zoomIn($scope.selected);
            } else if (elem.hasClass("get-direction")) {
                $scope.getDirection($scope.selected);
            }
        });

    $scope.getDirection = function HereMapsController_getDirection(address) {
        if ($scope.loading == true) {
            return; //fast clicker go home
        }
        $scope.loading = true;
        HereMapsRouting.direction([address.lat, address.lng]).then($scope.releaseLoading, $scope.releaseLoading);
    };

    $scope.zoomIn = function HereMapsController_zoomIn(address) {
        $scope.map.setZoom(address.zoom || hereMapsConfig.addressZoomLevel);
        $scope.map.setCenter({lat: address.lat, lng: address.lng});
    };

    $scope.releaseLoading = function HereMapsController_releaseLoading() {
        $scope.loading = false;
    };

    $scope.toggleSpaces = function HereMapsController_releaseLoading() {
        $scope.displaySpaces = !$scope.displaySpaces;
        $scope.heremapPlacesHeight = $scope.displaySpaces ? "100%" : "27px";
    };

    $scope.setAllRows = function HereMapsController_setAllRows(rows) {
        $scope.pagedList.setAllRows(rows);
    };

    $scope.setSelected = function HereMapsController_setSelected(address) {
        $scope.selected = address;
        $scope.selected.marker.setZIndex($scope.zIndex++);
    };

    $scope.renderMap = function () {
        console.log("start render map...");
    };

    $scope.resizeContainer = function HereMapsController_resizeContainer() {
        var elem = $element.find(".container-list ul").hide();
        var parentElem = elem.parent();
        elem.height(parentElem.height()).show();
    };

    $scope.delayTimeMillis = 250;

    $scope.resizeContainerWithDelay = function HereMapsController_resizeContainerWithDelay() {
        if ($scope.delayTimer) {
            $timeout.cancel($scope.delayTimer);
        }
        $scope.delayTimer = $timeout($scope.resizeContainerWithDelay, $scope.delayTimeMillis);
    };

    // on window resize we will redraw in delay 250 ms
    // to prevent multiple draw in short time
    $($window).resize($scope.resizeContainerWithDelay);
}
