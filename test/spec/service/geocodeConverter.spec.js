describe('A GeocodeConverter Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var sut;

    beforeEach(inject(function (_GeocodeConverter_) {
        sut = _GeocodeConverter_;
    }));

    it("should get service", function () {
        expect(sut).toBeDefined();
    });

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

    it("should not convert to Address service", function () {
        expect(sut.toAddress).toBeDefined();
        expect(sut.toAddress(null)).toBe(null);
    });

    it("should convert to Address service", function () {
        expect(sut.toAddress({
            Response: {
                View: [{
                    Result: [{
                        Location: {
                            DisplayPosition: {
                                Latitude: 1.1,
                                Longitude: 2.2
                            }
                        }
                    }]
                }]
            }
        })).toEqual({
            lat: 1.1,
            lng: 2.2
        });
    });

    it("should not convert to Geo Position service", function () {
        expect(sut.toPosition).toBeDefined();
        expect(sut.toPosition(null)).toBe(null);
    });

    it("should convert to Geo Position service", function () {
        expect(sut.toPosition({
            Response: {
                View: [{
                    Result: [{
                        Location: {
                            Address: {
                                Street: "Gottesauerstr.",
                                HouseNumber: 18,
                                City: "Karlsruhe",
                                PostalCode: 76131
                            }
                        }
                    }]
                }]
            }
        })).toEqual({city: "Karlsruhe", street: "Gottesauerstr. 18", zip: 76131});
    });
});