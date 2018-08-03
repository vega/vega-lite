"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
function runStreamingExample(eleId) {
    var vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        data: { name: 'table' },
        autosize: {
            resize: true
        },
        width: 400,
        mark: 'line',
        encoding: {
            x: { field: 'x', type: 'quantitative', scale: { zero: false } },
            y: { field: 'y', type: 'quantitative' },
            color: { field: 'category', type: 'nominal' }
        }
    };
    var view = _1.embedExample(eleId, vlSpec, false, false);
    /**
     * Generates a new tuple with random walk.
     */
    function newGenerator() {
        var counter = -1;
        var previousY = [5, 5, 5, 5];
        return function () {
            counter++;
            var newVals = previousY.map(function (v, category) { return ({
                x: counter,
                y: v + Math.round(Math.random() * 10 - category * 3),
                category: category
            }); });
            previousY = newVals.map(function (v) { return v.y; });
            return newVals;
        };
    }
    var valueGenerator = newGenerator();
    var minimumX = -100;
    window.setInterval(function () {
        minimumX++;
        var changeSet = view.changeset()
            .insert(valueGenerator())
            .remove(function (t) { return t.x < minimumX; });
        view.change('table', changeSet).run();
    }, 1000);
}
exports.runStreamingExample = runStreamingExample;
//# sourceMappingURL=streaming.js.map