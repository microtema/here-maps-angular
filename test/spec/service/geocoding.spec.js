describe('A Platform Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var sut, hereMapsConfig;

    beforeEach(module(function ($provide) {
        $provide.value('hereMapsConfig', {});
    }));

    beforeEach(inject(function (_Geocoding_) {
        sut = _Geocoding_;
    }));

});