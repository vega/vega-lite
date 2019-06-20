"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../../src/log"));
var compile_1 = require("../../src/compile/compile");
describe('compile/compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
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
            "data": { "url": "foo.csv" },
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
            "data": { "url": "foo.csv" },
            "mark": "point",
            "encoding": {}
        }).spec;
        chai_1.assert.deepEqual(spec.autosize, { type: 'fit', contains: 'content' });
    });
    it('should set autosize to fit if requested', function () {
        var spec = compile_1.compile({
            "autosize": "fit",
            "data": { "url": "foo.csv" },
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
            data: { url: "foo.csv" },
            encoding: {}
        }, { config: {
                background: "blue"
            } }).spec;
        chai_1.assert.equal(spec.config.background, "blue");
    });
    it('should merge spec and provided config.', function () {
        var spec = compile_1.compile({
            mark: "point",
            data: { url: "foo.csv" },
            encoding: {},
            config: {
                background: "red"
            }
        }, { config: {
                background: "blue"
            } }).spec;
        chai_1.assert.equal(spec.config.background, "red");
    });
    it('should return a spec with projections (implicit)', function () {
        var spec = compile_1.compile({
            "mark": "geoshape",
            "data": {
                "url": "data/us-10m.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "encoding": {}
        }).spec;
        chai_1.assert.isDefined(spec.projections);
    });
    it('should return a spec with projections (explicit)', function () {
        var spec = compile_1.compile({
            "mark": "geoshape",
            "projection": {
                "type": "albersUsa"
            },
            "data": {
                "url": "data/us-10m.json",
                "format": {
                    "type": "topojson",
                    "feature": "states"
                }
            },
            "encoding": {}
        }).spec;
        chai_1.assert.isDefined(spec.projections);
    });
});
//# sourceMappingURL=compile.test.js.map