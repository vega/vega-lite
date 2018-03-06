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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLGFBQU0sQ0FBQyxNQUFNLENBQUM7WUFDWixpQkFBTyxDQUFDLEVBQVMsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtRQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO1lBQ25CLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztZQUN6QixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVSLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QixhQUFNLENBQUMsU0FBUyxD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QyxDQUFDLElBQUksQ0FBQztRQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5cbmltcG9ydCB7Y29tcGlsZX0gZnJvbSAnLi4vLi4vc3JjL2NvbXBpbGUvY29tcGlsZSc7XG5cblxuZGVzY3JpYmUoJ2NvbXBpbGUvY29tcGlsZScsIGZ1bmN0aW9uKCkge1xuICBpdCgnc2hvdWxkIHRocm93IGVycm9yIGZvciBpbnZhbGlkIHNwZWMnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICBjb21waWxlKHt9IGFzIGFueSk7XG4gICAgfSwgRXJyb3IsIGxvZy5tZXNzYWdlLklOVkFMSURfU1BFQyk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgc3BlYyB3aXRoIGRlZmF1bHQgdG9wLWxldmVsIHByb3BlcnRpZXMsIHNpemUgc2lnbmFscywgZGF0YSwgbWFya3MsIGFuZCB0aXRsZScsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5wYWRkaW5nLCA1KTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgJ3BhZCcpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLndpZHRoLCAyMSk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7dGV4dDogJ3Rlc3QnfSk7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5kYXRhLmxlbmd0aCwgMSk7IC8vIGp1c3Qgc291cmNlXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMubWFya3MubGVuZ3RoLCAxKTsgLy8ganVzdCB0aGUgcm9vdCBncm91cFxuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBzcGVjaWZpZWQgdG9wLWxldmVsIHByb3BlcnRpZXMsIHNpemUgc2lnbmFscywgZGF0YSBhbmQgbWFya3MnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJwYWRkaW5nXCI6IDEyMyxcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMucGFkZGluZywgMTIzKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgJ3BhZCcpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLndpZHRoLCAyMSk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMSk7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5kYXRhLmxlbmd0aCwgMSk7IC8vIGp1c3Qgc291cmNlLlxuICAgIGFzc2VydC5lcXVhbChzcGVjLm1hcmtzLmxlbmd0aCwgMSk7IC8vIGp1c3QgdGhlIHJvb3QgZ3JvdXBcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2Ugc2l6ZSBzaWduYWwgZm9yIGJhciBjaGFydCB3aWR0aCcsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1widmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnNpZ25hbHMsIFt7XG4gICAgICBuYW1lOiAneF9zdGVwJyxcbiAgICAgIHZhbHVlOiAyMVxuICAgIH0sIHtcbiAgICAgIG5hbWU6ICd3aWR0aCcsXG4gICAgICB1cGRhdGU6IGBiYW5kc3BhY2UoZG9tYWluKCd4JykubGVuZ3RoLCAwLjEsIDAuMDUpICogeF9zdGVwYFxuICAgIH1dKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIwMCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IHJlc2l6ZSB0byB0cnVlIGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImF1dG9zaXplXCI6IHtcbiAgICAgICAgXCJyZXNpemVcIjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydChzcGVjLmF1dG9zaXplLnJlc2l6ZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IGF1dG9zaXplIHRvIGZpdCBhbmQgY29udGFpbm1lbnQgaWYgcmVxdWVzdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiYXV0b3NpemVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJmaXRcIixcbiAgICAgICAgXCJjb250YWluc1wiOiBcImNvbnRlbnRcIlxuICAgICAgfSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy5hdXRvc2l6ZSwge3R5cGU6ICdmaXQnLCBjb250YWluczogJ2NvbnRlbnQnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IGF1dG9zaXplIHRvIGZpdCBpZiByZXF1ZXN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsIFwiZml0XCIpO1xuICB9KTtcblxuICBpdCgnd2FybiBpZiBzaXplIGlzIGRhdGEgZHJpdmVuIGFuZCBhdXRvc2l6ZSBpcyBmaXQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1widmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dfSxcbiAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuQ0FOTk9UX0ZJWF9SQU5HRV9TVEVQX1dJVEhfRklUKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy53aWR0aCwgMjAwKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIwMCk7XG4gIH0pKTtcblxuICBpdCgnd2FybiBpZiB0cnlpbmcgdG8gZml0IGNvbXBvc2VkIHNwZWMnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1widmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dfSxcbiAgICAgIFwiYXV0b3NpemVcIjogXCJmaXRcIixcbiAgICAgIFwidmNvbmNhdFwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5GSVRfTk9OX1NJTkdMRSk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsICdwYWQnKTtcbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRpdGxlIGZvciBhIGxheWVyZWQgc3BlYy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgXCJsYXllclwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7dGV4dDogJ3Rlc3QnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRpdGxlIChzdHJpbmcpIGZvciBhIGxheWVyZWQgc3BlYy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IFwidGVzdFwiLFxuICAgICAgXCJsYXllclwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7dGV4dDogJ3Rlc3QnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHRpdGxlIGZyb20gYSBjaGlsZCBvZiBhIGxheWVyIHNwZWMgaWYgcGFyZW50IGhhcyBubyB0aXRsZS4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSB0aXRsZSBmb3IgYSBjb25jYXQgc3BlYywgdGhyb3cgd2FybmluZyBpZiBhbmNob3IgaXMgc2V0IHRvIG90aGVyIHZhbHVlcyB0aGFuIFwic3RhcnRcIiBhbmQgYXV0b21hdGljYWxseSBzZXQgYW5jaG9yIHRvIFwic3RhcnRcIi4nLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJ0aXRsZVwiOiB7XCJhbmNob3JcIjogXCJtaWRkbGVcIn19XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHtcbiAgICAgIHRleHQ6ICd0ZXN0JyxcbiAgICAgIGFuY2hvcjogJ3N0YXJ0JyAvLyBXZSBvbmx5IHN1cHBvcnQgYW5jaG9yIGFzIHN0YXJ0IGZvciBjb25jYXRcbiAgICB9KTtcbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmNhbm5vdFNldFRpdGxlQW5jaG9yKCdjb25jYXQnKSk7XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHRpdGxlIGZvciBhIGNvbmNhdCBzcGVjLCBhdXRvbWF0aWNhbGx5IHNldCBhbmNob3IgdG8gXCJzdGFydFwiLCBhbmQgYXVnbWVudCB0aGUgdGl0bGUgd2l0aCBub24tbWFyayB0aXRsZSBjb25maWcgKGUuZy4sIG9mZnNldCkuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwiaGNvbmNhdFwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcIm9mZnNldFwiOiA1fX1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge1xuICAgICAgdGV4dDogJ3Rlc3QnLFxuICAgICAgYW5jaG9yOiAnc3RhcnQnLFxuICAgICAgb2Zmc2V0OiA1XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGhhdmUgdGl0bGUgaWYgdGhlcmUgaXMgbm8gdGl0bGUuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJoY29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dLFxuICAgICAgXCJjb25maWdcIjoge1widGl0bGVcIjoge1wib2Zmc2V0XCI6IDV9fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmlzVW5kZWZpbmVkKHNwZWMudGl0bGUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSBwcm92aWRlZCBjb25maWcuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgIGVuY29kaW5nOiB7fVxuICAgIH0sIHtjb25maWc6IHtcbiAgICAgIGJhY2tncm91bmQ6IFwiYmx1ZVwiXG4gICAgfX0pLnNwZWM7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMuY29uZmlnLmJhY2tncm91bmQsIFwiYmx1ZVwiKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBtZXJnZSBzcGVjIGFuZCBwcm92aWRlZCBjb25maWcuJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgIGVuY29kaW5nOiB7fSxcbiAgICAgIGNvbmZpZzoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBcInJlZFwiXG4gICAgICB9XG4gICAgfSwge2NvbmZpZzoge1xuICAgICAgYmFja2dyb3VuZDogXCJibHVlXCJcbiAgICB9fSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5jb25maWcuYmFja2dyb3VuZCwgXCJyZWRcIik7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgc3BlYyB3aXRoIHByb2plY3Rpb25zIChpbXBsaWNpdCknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmlzRGVmaW5lZChzcGVjLnByb2plY3Rpb25zKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggcHJvamVjdGlvbnMgKGV4cGxpY2l0KScsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5pc0RlZmluZWQoc3BlYy5wcm9qZWN0aW9ucyk7XG4gIH0pO1xufSk7XG4iXX0=