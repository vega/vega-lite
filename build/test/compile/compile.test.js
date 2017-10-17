"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var compile_1 = require("../../src/compile/compile");
describe('Compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
    describe('compile', function () {
        it('should return a spec with default top-level properties, size signals, data, marks, and title', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "title": { "text": "test" },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 5);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.equal(spec.width, 21);
            chai_1.assert.equal(spec.height, 21);
            chai_1.assert.deepEqual(spec.title, { text: 'test' });
            chai_1.assert.equal(spec.data.length, 1); // just source
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
        it('should return a spec with specified top-level properties, size signals, data and marks', function () {
            var spec = compile_1.compile({
                "padding": 123,
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 123);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.equal(spec.width, 21);
            chai_1.assert.equal(spec.height, 21);
            chai_1.assert.equal(spec.data.length, 1); // just source.
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
        it('should use size signal for bar chart width', function () {
            var spec = compile_1.compile({
                "data": { "values": [{ "a": "A", "b": 28 }] },
                "mark": "bar",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            }).spec;
            chai_1.assert.deepEqual(spec.signals, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: "bandspace(domain('x').length, 0.1, 0.05) * x_step"
                }]);
            chai_1.assert.equal(spec.height, 200);
        });
        it('should set resize to true if requested', function () {
            var spec = compile_1.compile({
                "autosize": {
                    "resize": true
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert(spec.autosize.resize);
        });
        it('should set autosize to fit and containment if requested', function () {
            var spec = compile_1.compile({
                "autosize": {
                    "type": "fit",
                    "contains": "content"
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.deepEqual(spec.autosize, { type: 'fit', contains: 'content' });
        });
        it('should set autosize to fit if requested', function () {
            var spec = compile_1.compile({
                "autosize": "fit",
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.autosize, "fit");
        });
        it('warn if size is data driven and autosize is fit', log.wrap(function (localLogger) {
            var spec = compile_1.compile({
                "data": { "values": [{ "a": "A", "b": 28 }] },
                "mark": "bar",
                "autosize": "fit",
                "encoding": {
                    "x": { "field": "a", "type": "ordinal" },
                    "y": { "field": "b", "type": "quantitative" }
                }
            }).spec;
            chai_1.assert.equal(localLogger.warns[0], log.message.CANNOT_FIX_RANGE_STEP_WITH_FIT);
            chai_1.assert.equal(spec.width, 200);
            chai_1.assert.equal(spec.height, 200);
        }));
        it('warn if trying to fit composed spec', log.wrap(function (localLogger) {
            var spec = compile_1.compile({
                "data": { "values": [{ "a": "A", "b": 28 }] },
                "autosize": "fit",
                "vconcat": [{
                        "mark": "point",
                        "encoding": {}
                    }]
            }).spec;
            chai_1.assert.equal(localLogger.warns[0], log.message.FIT_NON_SINGLE);
            chai_1.assert.equal(spec.autosize, 'pad');
        }));
        it('should return title for a layered spec.', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "title": { "text": "test" },
                "layer": [{
                        "mark": "point",
                        "encoding": {}
                    }]
            }).spec;
            chai_1.assert.deepEqual(spec.title, { text: 'test' });
        });
        it('should return title (string) for a layered spec.', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "title": "test",
                "layer": [{
                        "mark": "point",
                        "encoding": {}
                    }]
            }).spec;
            chai_1.assert.deepEqual(spec.title, { text: 'test' });
        });
        it('should return title from a child of a layer spec if parent has no title.', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "layer": [{
                        "title": { "text": "test" },
                        "mark": "point",
                        "encoding": {}
                    }]
            }).spec;
            chai_1.assert.deepEqual(spec.title, { text: 'test' });
        });
        it('should return a title for a concat spec, throw warning if anchor is set to other values than "start" and automatically set anchor to "start".', log.wrap(function (localLogger) {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "title": { "text": "test" },
                "hconcat": [{
                        "mark": "point",
                        "encoding": {}
                    }],
                "config": { "title": { "anchor": "middle" } }
            }).spec;
            chai_1.assert.deepEqual(spec.title, {
                text: 'test',
                anchor: 'start' // We only support anchor as start for concat
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.cannotSetTitleAnchor('concat'));
        }));
        it('should return a title for a concat spec, automatically set anchor to "start", and augment the title with non-mark title config (e.g., offset).', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "title": { "text": "test" },
                "hconcat": [{
                        "mark": "point",
                        "encoding": {}
                    }],
                "config": { "title": { "offset": 5 } }
            }).spec;
            chai_1.assert.deepEqual(spec.title, {
                text: 'test',
                anchor: 'start',
                offset: 5
            });
        });
        it('should not have title if there is no title.', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "hconcat": [{
                        "mark": "point",
                        "encoding": {}
                    }],
                "config": { "title": { "offset": 5 } }
            }).spec;
            chai_1.assert.isUndefined(spec.title);
        });
        it('should use provided config.', function () {
            var spec = compile_1.compile({
                mark: "point",
                encoding: {}
            }, { config: {
                    background: "blue"
                } }).spec;
            chai_1.assert.equal(spec.config.background, "blue");
        });
        it('should merge spec and provided config.', function () {
            var spec = compile_1.compile({
                mark: "point",
                encoding: {},
                config: {
                    background: "red"
                }
            }, { config: {
                    background: "blue"
                } }).spec;
            chai_1.assert.equal(spec.config.background, "red");
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQU8sQ0FBQyxFQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtZQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztnQkFDekIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FB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