describe('A Directive Service Spec', function () {
    var $compile, scope;
    var hereMapsConfig = {};
    var Platform = {};
    var Template = {
        create: function () {
        }
    };

    beforeEach(module('here-maps-angular-directives'));
    beforeEach(module('here-maps-angular-services'));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('hereMapsConfig', hereMapsConfig);
    }));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('Platform', Platform);
    }));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('Template', Template);
    }));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        scope = _$rootScope_;
    }));

    it('Replaces the element restrict:E with the appropriate content', function () {
        var element = $compile("<data-here-maps >[]</data-here-maps>")(scope);
        scope.$digest();
        expect(element.html()).toBe("");
    });

    it('Replaces the element restrict:A with the appropriate content', function () {
        var element = $compile("<div data-here-maps />")(scope);
        scope.$digest();
        expect(element.html()).toBe("");
    });

    it('Replaces the element restrict:C with the appropriate content', function () {
        var element = $compile("<div class='data-here-maps' >[{}]</div>")(scope);
        scope.$digest();
        expect(element.html()).toBe("");
    });

    it('hereMapsConfig should contain appToken', function () {
        $compile('<div data-here-maps data-app-token=\'{"App_Id":"b1EnEFoJUlM7DxbOUluz", "App_Code": "9l73AMb88mO7U-udRkrIUQ"}\' />')(scope);
        scope.$digest();
        expect(hereMapsConfig.App_Id).toEqual('b1EnEFoJUlM7DxbOUluz');
        expect(hereMapsConfig.App_Code).toEqual('9l73AMb88mO7U-udRkrIUQ');
    });

    it('isolateScope should contain addresses', function () {
        var element = $compile('<div data-here-maps >[{"city":"Karlsruhe", "zip": "76131"}, {"city":"Berlin", "zip": "10115"}]</div>')(scope);
        scope.$digest();
        var isolateScope = element.isolateScope();
        expect(isolateScope.places.length).toEqual(2);
        expect(isolateScope.places[0]).toEqual({"city": "Karlsruhe", "zip": "76131"});
        expect(isolateScope.places[1]).toEqual({"city": "Berlin", "zip": "10115"});

        expect(element.html()).toEqual("");
    });

    it('isolateScope should contain zoomLevel', function () {
        var element = $compile('<div data-here-maps data-zoom-level="10" />')(scope);
        scope.$digest();
        var isolateScope = element.isolateScope();
        expect(isolateScope.zoomLevel).toEqual(10);
    });
});