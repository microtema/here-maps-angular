describe('A GeocodeConverter Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var sut;

    beforeEach(inject(function (_GeocodeConverter_) {
        sut = _GeocodeConverter_;
    }));

    it("should get service", function () {
        expect(sut).toBeDefined();
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