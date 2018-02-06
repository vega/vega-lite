"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
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
        console.log(spec);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUM7WUFDWixpQkFBTyxDQUFDLEVBQVMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtRQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztZQUN6QixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVSLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUU3QyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYztRQUNqRCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO0lBQzVELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdGQUF3RixFQUFFO1FBQzNGLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsU0FBUyxFQUFFLEdBQUc7WUFDZCxNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQzthQUMvQjtZQUNELE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuQyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlO1FBQ2xELGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7UUFDL0MsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7WUFDeEMsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUN0QyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7YUFDNUM7U0FDRixDQUFDLENBQUMsSUFBSSxDQUFDO1FBRVIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzlCLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxFQUFFO2FBQ1YsRUFBRTtnQkFDRCxJQUFJLEVBQUUsT0FBTztnQkFDYixNQUFNLEVBQUUsbURBQW1EO2FBQzVELENBQUMsQ0FBQyxDQUFDO1FBQ0osYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQzNDLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7WUFDRCxNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVSLGFBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1FBQzVELElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsVUFBVSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRSxTQUFTO2FBQ3RCO1lBQ0QsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFUixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1FBQzVDLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsVUFBVSxFQUFFLEtBQUs7WUFDakIsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFUixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7UUFDekUsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7WUFDeEMsTUFBTSxFQUFFLEtBQUs7WUFDYixVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUN0QyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7YUFDNUM7U0FDRixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUMvRSxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFSixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7UUFDN0QsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7WUFDeEMsVUFBVSxFQUFFLEtBQUs7WUFDakIsU0FBUyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxFQUFFLE9BQU87b0JBQ2YsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQztTQUNILENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDUixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVKLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtRQUM1QyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztZQUN6QixPQUFPLEVBQUUsQ0FBQztvQkFDUixNQUFNLEVBQUUsT0FBTztvQkFDZixVQUFVLEVBQUUsRUFBRTtpQkFDZixDQUFDO1NBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1FBQ3JELElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7YUFDL0I7WUFDRCxPQUFPLEVBQUUsTUFBTTtZQUNmLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxPQUFPO29CQUNmLFVBQVUsRUFBRSxFQUFFO2lCQUNmLENBQUM7U0FDSCxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7UUFDN0UsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQzthQUMvQjtZQUNELE9BQU8sRUFBRSxDQUFDO29CQUNSLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUM7b0JBQ3pCLE1BQU0sRUFBRSxPQUFPO29CQUNmLFVBQVUsRUFBRSxFQUFFO2lCQUNmLENBQUM7U0FDSCxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0lBQStJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7UUFDdkssSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQzthQUMvQjtZQUNELE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUM7WUFDekIsU0FBUyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxFQUFFLE9BQU87b0JBQ2YsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQztZQUNGLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsRUFBQztTQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzNCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLE9BQU8sQ0FBQyw2Q0FBNkM7U0FDOUQsQ0FBQyxDQUFDO1FBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNqRixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRUosRUFBRSxDQUFDLGdKQUFnSixFQUFFO1FBQ25KLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7YUFDL0I7WUFDRCxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDO1lBQ3pCLFNBQVMsRUFBRSxDQUFDO29CQUNWLE1BQU0sRUFBRSxPQUFPO29CQUNmLFVBQVUsRUFBRSxFQUFFO2lCQUNmLENBQUM7WUFDRixRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLEVBQUM7U0FDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMzQixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtRQUNoRCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQy9CO1lBQ0QsU0FBUyxFQUFFLENBQUM7b0JBQ1YsTUFBTSxFQUFFLE9BQU87b0JBQ2YsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQztZQUNGLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsRUFBQztTQUNuQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7UUFDaEMsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRSxFQUFFO1NBQ2IsRUFBRSxFQUFDLE1BQU0sRUFBRTtnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQixFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDVCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQzNDLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7WUFDbkIsSUFBSSxFQUFFLE9BQU87WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLE1BQU0sRUFBRTtnQkFDTixVQUFVLEVBQUUsS0FBSzthQUNsQjtTQUNGLEVBQUUsRUFBQyxNQUFNLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1QsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtRQUNyRCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFNBQVMsRUFBRSxRQUFRO2lCQUNwQjthQUNGO1lBQ0QsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtRQUNyRCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsV0FBVzthQUNwQjtZQUNELE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFNBQVMsRUFBRSxRQUFRO2lCQUNwQjthQUNGO1lBQ0QsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcblxuaW1wb3J0IHtjb21waWxlfSBmcm9tICcuLi8uLi9zcmMvY29tcGlsZS9jb21waWxlJztcblxuXG5kZXNjcmliZSgnY29tcGlsZS9jb21waWxlJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgZm9yIGludmFsaWQgc3BlYycsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIGNvbXBpbGUoe30gYXMgYW55KTtcbiAgICB9LCBFcnJvciwgbG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggZGVmYXVsdCB0b3AtbGV2ZWwgcHJvcGVydGllcywgc2l6ZSBzaWduYWxzLCBkYXRhLCBtYXJrcywgYW5kIHRpdGxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLnBhZGRpbmcsIDUpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIxKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIxKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLmRhdGEubGVuZ3RoLCAxKTsgLy8ganVzdCBzb3VyY2VcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5tYXJrcy5sZW5ndGgsIDEpOyAvLyBqdXN0IHRoZSByb290IGdyb3VwXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgc3BlYyB3aXRoIHNwZWNpZmllZCB0b3AtbGV2ZWwgcHJvcGVydGllcywgc2l6ZSBzaWduYWxzLCBkYXRhIGFuZCBtYXJrcycsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcInBhZGRpbmdcIjogMTIzLFxuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5wYWRkaW5nLCAxMjMpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIxKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIxKTtcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLmRhdGEubGVuZ3RoLCAxKTsgLy8ganVzdCBzb3VyY2UuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMubWFya3MubGVuZ3RoLCAxKTsgLy8ganVzdCB0aGUgcm9vdCBncm91cFxuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSBzaXplIHNpZ25hbCBmb3IgYmFyIGNoYXJ0IHdpZHRoJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMuc2lnbmFscywgW3tcbiAgICAgIG5hbWU6ICd4X3N0ZXAnLFxuICAgICAgdmFsdWU6IDIxXG4gICAgfSwge1xuICAgICAgbmFtZTogJ3dpZHRoJyxcbiAgICAgIHVwZGF0ZTogYGJhbmRzcGFjZShkb21haW4oJ3gnKS5sZW5ndGgsIDAuMSwgMC4wNSkgKiB4X3N0ZXBgXG4gICAgfV0pO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjAwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgcmVzaXplIHRvIHRydWUgaWYgcmVxdWVzdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiYXV0b3NpemVcIjoge1xuICAgICAgICBcInJlc2l6ZVwiOiB0cnVlXG4gICAgICB9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0KHNwZWMuYXV0b3NpemUucmVzaXplKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgYXV0b3NpemUgdG8gZml0IGFuZCBjb250YWlubWVudCBpZiByZXF1ZXN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJhdXRvc2l6ZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImZpdFwiLFxuICAgICAgICBcImNvbnRhaW5zXCI6IFwiY29udGVudFwiXG4gICAgICB9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLmF1dG9zaXplLCB7dHlwZTogJ2ZpdCcsIGNvbnRhaW5zOiAnY29udGVudCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgYXV0b3NpemUgdG8gZml0IGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgXCJmaXRcIik7XG4gIH0pO1xuXG4gIGl0KCd3YXJuIGlmIHNpemUgaXMgZGF0YSBkcml2ZW4gYW5kIGF1dG9zaXplIGlzIGZpdCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5DQU5OT1RfRklYX1JBTkdFX1NURVBfV0lUSF9GSVQpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLndpZHRoLCAyMDApO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjAwKTtcbiAgfSkpO1xuXG4gIGl0KCd3YXJuIGlmIHRyeWluZyB0byBmaXQgY29tcG9zZWQgc3BlYycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgXCJ2Y29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLkZJVF9OT05fU0lOR0xFKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgJ3BhZCcpO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgZm9yIGEgbGF5ZXJlZCBzcGVjLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgKHN0cmluZykgZm9yIGEgbGF5ZXJlZCBzcGVjLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjogXCJ0ZXN0XCIsXG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgZnJvbSBhIGNoaWxkIG9mIGEgbGF5ZXIgc3BlYyBpZiBwYXJlbnQgaGFzIG5vIHRpdGxlLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwibGF5ZXJcIjogW3tcbiAgICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHRpdGxlIGZvciBhIGNvbmNhdCBzcGVjLCB0aHJvdyB3YXJuaW5nIGlmIGFuY2hvciBpcyBzZXQgdG8gb3RoZXIgdmFsdWVzIHRoYW4gXCJzdGFydFwiIGFuZCBhdXRvbWF0aWNhbGx5IHNldCBhbmNob3IgdG8gXCJzdGFydFwiLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwiaGNvbmNhdFwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcImFuY2hvclwiOiBcIm1pZGRsZVwifX1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge1xuICAgICAgdGV4dDogJ3Rlc3QnLFxuICAgICAgYW5jaG9yOiAnc3RhcnQnIC8vIFdlIG9ubHkgc3VwcG9ydCBhbmNob3IgYXMgc3RhcnQgZm9yIGNvbmNhdFxuICAgIH0pO1xuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuY2Fubm90U2V0VGl0bGVBbmNob3IoJ2NvbmNhdCcpKTtcbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdGl0bGUgZm9yIGEgY29uY2F0IHNwZWMsIGF1dG9tYXRpY2FsbHkgc2V0IGFuY2hvciB0byBcInN0YXJ0XCIsIGFuZCBhdWdtZW50IHRoZSB0aXRsZSB3aXRoIG5vbi1tYXJrIHRpdGxlIGNvbmZpZyAoZS5nLiwgb2Zmc2V0KS4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgXCJoY29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dLFxuICAgICAgXCJjb25maWdcIjoge1widGl0bGVcIjoge1wib2Zmc2V0XCI6IDV9fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7XG4gICAgICB0ZXh0OiAndGVzdCcsXG4gICAgICBhbmNob3I6ICdzdGFydCcsXG4gICAgICBvZmZzZXQ6IDVcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBub3QgaGF2ZSB0aXRsZSBpZiB0aGVyZSBpcyBubyB0aXRsZS4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJ0aXRsZVwiOiB7XCJvZmZzZXRcIjogNX19XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoc3BlYy50aXRsZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdXNlIHByb3ZpZGVkIGNvbmZpZy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgfSwge2NvbmZpZzoge1xuICAgICAgYmFja2dyb3VuZDogXCJibHVlXCJcbiAgICB9fSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5jb25maWcuYmFja2dyb3VuZCwgXCJibHVlXCIpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG1lcmdlIHNwZWMgYW5kIHByb3ZpZGVkIGNvbmZpZy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IFwicmVkXCJcbiAgICAgIH1cbiAgICB9LCB7Y29uZmlnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBcImJsdWVcIlxuICAgIH19KS5zcGVjO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmNvbmZpZy5iYWNrZ3JvdW5kLCBcInJlZFwiKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggcHJvamVjdGlvbnMgKGltcGxpY2l0KScsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcbiAgICBjb25zb2xlLmxvZyhzcGVjKTtcbiAgICBhc3NlcnQuaXNEZWZpbmVkKHNwZWMucHJvamVjdGlvbnMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBwcm9qZWN0aW9ucyAoZXhwbGljaXQpJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmlzRGVmaW5lZChzcGVjLnByb2plY3Rpb25zKTtcbiAgfSk7XG59KTtcbiJdfQ==