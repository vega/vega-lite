/* tslint:disable:quotemark */
import { assert } from 'chai';
import { normalize } from '../../src/compositemark/index';
import { defaultConfig } from '../../src/config';
describe("normalizeCallout", function () {
    var inputSpec = {
        description: "A scatterplot showing horsepower and miles per gallons for various cars.",
        data: {
            url: "data/cars.json"
        },
        transform: [
            { filter: "datum.Horsepower == 132" }
        ],
        mark: {
            type: "callout"
        },
        encoding: {
            x: {
                field: "Horsepower",
                type: "quantitative"
            },
            y: {
                field: "Miles_per_Gallon",
                type: "quantitative"
            },
            text: {
                field: "Name",
                type: "nominal"
            }
        }
    };
    var normalizedSpec = normalize(inputSpec, defaultConfig);
    it("should produce two layers, one for label and one for line", function () {
        assert.equal(normalizedSpec.layer.length, 2);
    });
    it("description should stay the same", function () {
        assert.equal(normalizedSpec.description, inputSpec.description);
    });
    it("data should stay the same ", function () {
        assert.equal(normalizedSpec.data, inputSpec.data);
    });
    it("transform should be the same", function () {
        assert.equal(normalizedSpec.transform, inputSpec.transform);
    });
    it("callout line should have correct xOffset", function () {
        assert.approximately(normalizedSpec.layer[0].mark.xOffset, 0, 0.001);
    });
    it("callout line should have correct x2Offset", function () {
        // default line length = 30
        assert.approximately(normalizedSpec.layer[0].mark.x2Offset, Math.sqrt(450), 0.001);
    });
    it("callout line should have correct yOffset", function () {
        assert.approximately(normalizedSpec.layer[0].mark.yOffset, 0, 0.001);
    });
    it("callout line should have correct y2Offset", function () {
        assert.approximately(normalizedSpec.layer[0].mark.y2Offset, -Math.sqrt(450), 0.001);
    });
    it("callout label should have correct xOffset", function () {
        // default line length = 30, label offset = 2
        assert.approximately(normalizedSpec.layer[1].mark.xOffset, Math.sqrt(512), 0.001);
    });
    it("callout label should have correct yOffset", function () {
        assert.approximately(normalizedSpec.layer[1].mark.yOffset, -Math.sqrt(512), 0.001);
    });
    it("callout label encoding should stay the same", function () {
        assert.deepEqual(normalizedSpec.layer[1].encoding, inputSpec.encoding);
    });
    it("callout line encoding should have x2 and y2 channel", function () {
        assert.deepEqual(normalizedSpec.layer[0].encoding.x, inputSpec.encoding.x);
        assert.deepEqual(normalizedSpec.layer[0].encoding.x2, inputSpec.encoding.x);
        assert.deepEqual(normalizedSpec.layer[0].encoding.y, inputSpec.encoding.y);
        assert.deepEqual(normalizedSpec.layer[0].encoding.y2, inputSpec.encoding.y);
    });
    it("callout line should have style callout-line", function () {
        assert.equal(normalizedSpec.layer[0].mark.style, "callout-line");
    });
    it("callout label should have style callout-label", function () {
        assert.equal(normalizedSpec.layer[1].mark.style, "callout-label");
    });
});
//# sourceMappingURL=callout.test.js.map