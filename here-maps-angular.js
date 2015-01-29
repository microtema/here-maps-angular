'use strict';

/**
 * Main module of the element.
 */
var module = angular.module('here-maps-angular', ["here-maps-angular-services", "here-maps-angular-directives"]);

module.constant('hereMapsConfig', {
    app_id: "b1EnEFoJUlM7DxbOUluz",
    app_code: "9l73AMb88mO7U-udRkrIUQ",
    zoomLevel: 10,
    addressZoomLevel: 18,
    defaultLanguage: "en-US"
});

module = angular.module('here-maps-angular-services', []);
module.factory("Platform", function () {
    return {}
});

module = angular.module('here-maps-angular-directives', []);
module.directive("hereMaps", function () {
    return {
        restrict: 'EA',
        template: '<div>Nokia Here Map</div>',
        link: function (scope, element, attr) {

        }
    };
});