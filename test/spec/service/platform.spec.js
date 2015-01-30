'use strict';
describe('A Platform Service Spec', function () {
    it("should not be loaded on default", function () {
        expect(window.H).not.toBeDefined();
    });
});
describe('A Platform Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var platform, hereMapsConfig;

    beforeEach(module(function ($provide) {
        $provide.value('hereMapsConfig', {});
    }));

    beforeEach(inject(function (_Platform_) {
        platform = _Platform_;
        platform.create();
    }));

    beforeEach(function (done) {
        setTimeout(function () {
            done();
        }, 250);
    });

    it("should not be loaded on demand", function (done) {
        expect(window.H).toBeDefined();
        done();
    });

});
