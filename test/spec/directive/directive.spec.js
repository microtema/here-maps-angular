describe('A Directive Service Spec', function() {
    var $compile, $rootScope;

    beforeEach(angular.mock.module('here-maps-angular-directives'));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('visitor', {});
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element restrict:E with the appropriate content', function() {
        var element = $compile("<data-here-maps />")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toBe("<div>Nokia Here Map</div>");
    });

    it('Replaces the element restrict:A with the appropriate content', function() {
        var element = $compile("<div data-here-maps />")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toBe("<div>Nokia Here Map</div>");
    });

    it('Replaces the element restrict:C with the appropriate content', function() {
        var element = $compile("<div class='data-here-maps' />")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toBe("<div>Nokia Here Map</div>");
    });
});