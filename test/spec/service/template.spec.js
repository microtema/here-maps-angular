describe('A Platform Service Spec', function () {

    beforeEach(module('here-maps-angular-services'));

    var sut;

    beforeEach(inject(function (_Template_) {
        sut = _Template_;
    }));

    it("should get instance", function () {
        expect(sut).toBeDefined();
    });

    it("should create heremap div container", function () {
        var element = $(sut.create());

        expect(element.hasClass("heremap-wrapper")).toBe(true);

        var outerContainer = element.find("div.heremap-outer-container");
        expect(outerContainer.hasClass("heremap-outer-container")).toBe(true);
        expect(outerContainer.children().length).toBe(2);

    });

    it("should create heremap-places div container", function () {
        var element = $(sut.createPlaces());

        expect(element.hasClass("heremap-places")).toBe(true);
        expect(element.attr("data-ng-style")).toBe("{height:heremapPlacesHeight}");

        var table = element.find("table");
        expect(table.length).toBe(1);

    });

    it("should create heremap-places table div container", function () {
        var element = $(sut.createPlacesTable());

        expect(element.length).toBe(1);

        var row = element.find("tr");
        expect(row.length).toBe(3);

    });

    it("should create heremap-places table header container", function () {
        var element = $(sut.createPlacesTableHeader());

        expect(element.length).toBe(1);

        var td = element.find("td");
        expect(td.length).toBe(1);

    });

    it("should create heremap-places table header container", function () {
        var element = $(sut.createPlacesTableHeaderTD());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBe("thead");
        expect(element.attr("data-ng-click")).toBe("toggleSpaces()");

        expect(element.find("span").length).toBe(1);
        expect(element.find("span").html()).toBe("{{pagedList.offset+1}} to {{pagedList.offsetTop}} of {{pagedList.totalCount}}");
        expect(element.find("i").length).toBe(1);
    });

    it("should create heremap-places table body container", function () {
        var element = $(sut.createPlacesTableBody());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBe("tbody");

        expect(element.find("div.container-list").length).toBe(1);
    });

    it("should create heremap-places container-list container", function () {
        var element = $(sut.createContainerList());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBe("container-list");

        expect(element.find("ul.list").length).toBe(1);
    });

    it("should create heremap-places ul container", function () {
        var element = $(sut.createUList());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBe("list");

        expect(element.find("li").length).toBe(1);
    });

    it("should create heremap-places list item container", function () {
        var element = $(sut.createListItem());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBeUndefined();
        expect(element.attr("data-ng-repeat")).toBe("row in pagedList.getRows()");
        expect(element.attr("data-ng-click")).toBe("setSelected(row)");
        expect(element.attr("data-ng-class")).toBe("{selected : selected.index == row.index}");

        expect(element.find("svg").length).toBe(1);
        expect(element.find("b").length).toBe(1);
        expect(element.find("p").length).toBe(1);
        expect(element.find("span").length).toBe(5);
    });

    it("should create heremap-places SWG element", function () {
        var element = $(sut.createSwg());
        expect(element.length).toBe(1);

        expect(element.attr("width")).toBe('16');
        expect(element.attr("height")).toBe('16');
        expect(element.attr("xmlns")).toBe('http://www.w3.org/2000/svg');

        expect(element.html()).toBe('<rect stroke="white" fill="#e9144b" x="1" y="1" width="15" height="15" /><text x="8" y="12" font-size="8pt" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">{{row.index+1}}</text>');

    });

    it("should create heremap-places Name Label element", function () {
        var element = $(sut.createNameLabel());

        expect(element.length).toBe(1);
        expect(element.html()).toBe('{{row.name}}');
    });

    it("should create heremap-places Address Label element", function () {
        var element = $(sut.createAddressLabel());

        expect(element.length).toBe(1);
        expect(element.find("span.street").html()).toBe('{{row.street}}');
        expect(element.find("br").length).toBe(1);
        expect(element.find("br").attr("data-ng-show")).toBe("row.street");
        expect(element.find("span.zip-city").html()).toBe('{{row.zip}} {{row.city}}');
    });


    it("should create heremap-places Address Link element", function () {
        var element = $(sut.createAddressLink());

        expect(element.length).toBe(1);
        expect(element.find("span[data-ng-click='zoomIn(row)']").html()).toBe('Zoom in');
        expect(element.find("span[data-ng-click='getDirection(row)']").html()).toBe('Get Direction');
    });

    it("should create table foot element", function () {
        var element = $(sut.createPlacesTableFoot());

        expect(element.length).toBe(1);
        expect(element.attr("class")).toBe("tfoot");
        expect(element.find("span").length).toBe(3);

        var span = element.find("span[data-ng-click='pagedList.prevPage()']");
        expect(span.html()).toBe('<b>&lt;</b>');
        expect(span.attr("data-ng-show")).toBe('pagedList.currentPage > 0');

        span = element.find("span[data-ng-click='pagedList.currentPage = page']");
        expect(span.html()).toBe(' {{page+1}} ');
        expect(span.attr("data-ng-repeat")).toBe('page in pagedList.totalPages');
        expect(span.attr("data-ng-class")).toBe('{selected : page == pagedList.currentPage}');

        span = element.find("span[data-ng-click='pagedList.nextPage()']");
        expect(span.html()).toBe('<b>&gt;</b>');
        expect(span.attr("data-ng-show")).toBe('pagedList.currentPage+1 < pagedList.pageCount');

    });

    it("should create heremap div container", function () {
        var element = $(sut.createHereMap());

        expect(element.hasClass("heremap")).toBe(true);
        expect(element.html()).toBe("");
    });

});