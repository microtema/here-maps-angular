'use strict';

/**
 * Main module of the element.
 */
var module = angular.module('here-maps-angular', []);
module.directive("hereMaps", function () {
    return {
        restrict: 'E',
        template: '<div>Nokia Here Map</div>',
        link: function (scope, element, attr) {

        }
    };
});