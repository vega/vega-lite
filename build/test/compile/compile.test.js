/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../util");
var log = require("../../src/log");
var compile_1 = require("../../src/compile/compile");
describe('Compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
    describe('compile', function () {
        it('should return a spec with basic top-level properties, size signals, data and marks', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 5);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "data('layout')[0].width"
                },
                {
                    name: 'height',
                    update: "data('layout')[0].height"
                },
                {
                    name: 'unit',
                    value: {},
                    on: [{ events: 'mousemove', update: 'group()._id ? group() : unit' }]
                }
            ]);
            chai_1.assert.equal(spec.data.length, 2); // just source and layout
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
    });
    describe('assembleRootGroup()', function () {
        it('produce correct from and size.', function () {
            var model = util_1.parseUnitModel({
                "description": "A simple bar chart with embedded data.",
                "data": {
                    "values": [
                        { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
                        { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
                        { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
                    ]
                },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            var rootGroup = compile_1.assembleRootGroup(model);
            chai_1.assert.deepEqual(rootGroup.from, { "data": "layout" });
            chai_1.assert.deepEqual(rootGroup.encode.update.width, { field: "width" });
            chai_1.assert.deepEqual(rootGroup.encode.update.height, { field: "height" });
        });
        it('produce correct from and size when a chart name is provided.', function () {
            var model = util_1.parseUnitModel({
                "name": "chart",
                "description": "A simple bar chart with embedded data.",
                "data": {
                    "values": [
                        { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
                        { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
                        { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
                    ]
                },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            });
            var rootGroup = compile_1.assembleRootGroup(model);
            chai_1.assert.deepEqual(rootGroup.from, { "data": "chart_layout" });
            chai_1.assert.deepEqual(rootGroup.encode.update.width, { field: "chart_width" });
            chai_1.assert.deepEqual(rootGroup.encode.update.height, { field: "chart_height" });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsZ0NBQXVDO0FBRXZDLG1DQUFxQztBQUVyQyxxREFBcUU7QUFHckUsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsYUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNaLGlCQUFPLENBQUMsRUFBUyxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsb0ZBQW9GLEVBQUU7WUFDdkYsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7aUJBQy9CO2dCQUNELE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUVSLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUM3QjtvQkFDRSxJQUFJLEVBQUUsT0FBTztvQkFDYixNQUFNLEVBQUUseUJBQXlCO2lCQUNsQztnQkFDRDtvQkFDRSxJQUFJLEVBQUUsUUFBUTtvQkFDZCxNQUFNLEVB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