'use strict';

/**
 * Main module of the element.
 */
var app = angular.module('here-maps-angular', ["here-maps-angular-services", "here-maps-angular-directives"]);

app.constant('hereMapsConfig', {
    app_id: "b1EnEFoJUlM7DxbOUluz",
    app_code: "9l73AMb88mO7U-udRkrIUQ",
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
                'app_id': hereMapsConfig.app_id,
                'app_code': hereMapsConfig.app_code,
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
                geocoder.geocode({serchText: service.describeAddress(address)}, service.resolveGeocodeProxie(deferred), deferred.reject);
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
                    prox: service.describePosition(address),
                    mode: 'retrieveAddresses',
                    maxresults: '1'
                }, service.resolvePositionProxie(deferred), defer.reject);
            });
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
    };
    return service;
});

app = angular.module('here-maps-angular-directives', []);
app.directive("hereMaps", function () {
    return {
        restrict: 'EAC',
        scope: {addresses: '@', zoomLevel: '@'},
        controller: HereMapsController,
        template: '<div>Nokia Here Map</div>',
        link: function (scope, element, attr) {
            //element.html("ready...");
        }
    };
});

function HereMapsController($scope) {
    $scope.entries = [];
}