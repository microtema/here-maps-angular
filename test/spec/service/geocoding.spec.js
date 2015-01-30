describe('A Platform Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var sut, hereMapsConfig;

    beforeEach(module(function ($provide) {
        $provide.value('hereMapsConfig', {});
    }));

    beforeEach(inject(function (_Geocoding_) {
        sut = _Geocoding_;
    }));

    it("should describe Address", function () {
        expect(sut).toBeDefined();
        expect(sut.describeAddress).toBeDefined();
    });

    it("should return empty string on empty Address", function () {
        expect(sut.describeAddress({})).toBe("");
        expect(sut.describeAddress({street: null, city: null, zip: null})).toBe("");
    });

    it("should return street on given Address", function () {
        expect(sut.describeAddress({street: "Gottesaurstr.18"})).toBe("Gottesaurstr.18");
        expect(sut.describeAddress({street: "Gottesaurstr.18", city: null})).toBe("Gottesaurstr.18");
    });

    it("should return city on given Address", function () {
        expect(sut.describeAddress({city: "Karlsruhe"})).toBe("Karlsruhe");
        expect(sut.describeAddress({street: null, city: "Karlsruhe"})).toBe("Karlsruhe");
    });

    it("should return street, city on given Address", function () {
        expect(sut.describeAddress({street: "Gottesaurstr.18", city: "Karlsruhe"})).toBe("Gottesaurstr.18,Karlsruhe");
        expect(sut.describeAddress({street: "Gottesaurstr.18", city: "Karlsruhe"})).toBe("Gottesaurstr.18,Karlsruhe");
    });

    it("should return street, city, zip on given Address", function () {
        expect(sut.describeAddress({street: "Gottesaurstr.18", city: "Karlsruhe", zip:76131})).toBe("Gottesaurstr.18,76131,Karlsruhe");
        expect(sut.describeAddress({street: "Gottesaurstr.18", city: "Karlsruhe", zip:76131})).toBe("Gottesaurstr.18,76131,Karlsruhe");
    });

});