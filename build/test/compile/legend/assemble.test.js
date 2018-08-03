"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
describe('legend/assemble', function () {
    it('merges legend of the same field with the default type.', function () {
        var model = util_1.parseUnitModelWithScale({
            $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
            description: 'A scatterplot showing horsepower and miles per gallons.',
            data: { url: 'data/cars.json' },
            mark: 'point',
            encoding: {
                x: { field: 'Horsepower', type: 'quantitative' },
                y: { field: 'Miles_per_Gallon', type: 'quantitative' },
                color: { field: 'Origin', type: 'nominal' },
                shape: { field: 'Origin', type: 'nominal' }
            }
        });
        model.parseLegend();
        var legends = model.assembleLegends();
        chai_1.assert.equal(legends.length, 1);
        chai_1.assert.equal(legends[0].title, 'Origin');
        chai_1.assert.equal(legends[0].stroke, 'color');
        chai_1.assert.equal(legends[0].shape, 'shape');
    });
    it('merges legend of the same field and favor symbol legend over gradient', function () {
        var model = util_1.parseUnitModelWithScale({
            data: { values: [{ a: 'A', b: 28 }, { a: 'B', b: 55 }] },
            mark: 'bar',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { field: 'b', type: 'quantitative' },
                color: { field: 'b', type: 'quantitative' },
                size: { field: 'b', type: 'quantitative' }
            }
        });
        model.parseLegend();
        var legends = model.assembleLegends();
        chai_1.assert.equal(legends.length, 1);
        chai_1.assert.equal(legends[0].title, 'b');
        chai_1.assert.equal(legends[0].fill, 'color');
        chai_1.assert.equal(legends[0].size, 'size');
    });
});
//# sourceMappingURL=assemble.test.js.map