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
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "21"
                },
                {
                    name: 'height',
                    update: "21"
                }
            ]);
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
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "21"
                },
                {
                    name: 'height',
                    update: "21"
                }
            ]);
            chai_1.assert.equal(spec.data.length, 1); // just source.
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
        it('should set resize to true if requested', function () {
            var spec = compile_1.compile({
                "autoResize": true,
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert(spec.autosize.resize);
        });
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
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQU8sQ0FBQyxFQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtZQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztnQkFDekIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzdCO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNFLElB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