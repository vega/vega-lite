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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLHlEQUFxQztBQUVyQyxxREFBa0Q7QUFHbEQsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQU8sQ0FBQyxFQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEZBQThGLEVBQUU7UUFDakcsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztZQUNuQixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQzthQUMvQjtZQUNELE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUM7WUFDekIsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFUixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUIsYUFBTSxDQUFDLFNBQVMs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QUFDO1lBQ25CLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFlBQVksRUFBRTtnQkFDWixNQUFNLEVBQUUsV0FBVzthQUNwQjtZQUNELE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFNBQVMsRUFBRSxRQUFRO2lCQUNwQjthQUNGO1lBQ0QsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcblxuaW1wb3J0IHtjb21waWxlfSBmcm9tICcuLi8uLi9zcmMvY29tcGlsZS9jb21waWxlJztcblxuXG5kZXNjcmliZSgnY29tcGlsZS9jb21waWxlJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgZm9yIGludmFsaWQgc3BlYycsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIGNvbXBpbGUoe30gYXMgYW55KTtcbiAgICB9LCBFcnJvciwgbG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggZGVmYXVsdCB0b3AtbGV2ZWwgcHJvcGVydGllcywgc2l6ZSBzaWduYWxzLCBkYXRhLCBtYXJrcywgYW5kIHRpdGxlJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLnBhZGRpbmcsIDUpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIxKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIxKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLmRhdGEubGVuZ3RoLCAxKTsgLy8ganVzdCBzb3VyY2VcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5tYXJrcy5sZW5ndGgsIDEpOyAvLyBqdXN0IHRoZSByb290IGdyb3VwXG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgc3BlYyB3aXRoIHNwZWNpZmllZCB0b3AtbGV2ZWwgcHJvcGVydGllcywgc2l6ZSBzaWduYWxzLCBkYXRhIGFuZCBtYXJrcycsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcInBhZGRpbmdcIjogMTIzLFxuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5wYWRkaW5nLCAxMjMpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIxKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIxKTtcblxuICAgIGFzc2VydC5lcXVhbChzcGVjLmRhdGEubGVuZ3RoLCAxKTsgLy8ganVzdCBzb3VyY2UuXG4gICAgYXNzZXJ0LmVxdWFsKHNwZWMubWFya3MubGVuZ3RoLCAxKTsgLy8ganVzdCB0aGUgcm9vdCBncm91cFxuICB9KTtcblxuICBpdCgnc2hvdWxkIHVzZSBzaXplIHNpZ25hbCBmb3IgYmFyIGNoYXJ0IHdpZHRoJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMuc2lnbmFscywgW3tcbiAgICAgIG5hbWU6ICd4X3N0ZXAnLFxuICAgICAgdmFsdWU6IDIxXG4gICAgfSwge1xuICAgICAgbmFtZTogJ3dpZHRoJyxcbiAgICAgIHVwZGF0ZTogYGJhbmRzcGFjZShkb21haW4oJ3gnKS5sZW5ndGgsIDAuMSwgMC4wNSkgKiB4X3N0ZXBgXG4gICAgfV0pO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjAwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgcmVzaXplIHRvIHRydWUgaWYgcmVxdWVzdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiYXV0b3NpemVcIjoge1xuICAgICAgICBcInJlc2l6ZVwiOiB0cnVlXG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImZvby5jc3ZcIn0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQoc3BlYy5hdXRvc2l6ZS5yZXNpemUpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNldCBhdXRvc2l6ZSB0byBmaXQgYW5kIGNvbnRhaW5tZW50IGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImF1dG9zaXplXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiZml0XCIsXG4gICAgICAgIFwiY29udGFpbnNcIjogXCJjb250ZW50XCJcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZm9vLmNzdlwifSxcbiAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcblxuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy5hdXRvc2l6ZSwge3R5cGU6ICdmaXQnLCBjb250YWluczogJ2NvbnRlbnQnfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgc2V0IGF1dG9zaXplIHRvIGZpdCBpZiByZXF1ZXN0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImZvby5jc3ZcIn0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG5cbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgXCJmaXRcIik7XG4gIH0pO1xuXG4gIGl0KCd3YXJuIGlmIHNpemUgaXMgZGF0YSBkcml2ZW4gYW5kIGF1dG9zaXplIGlzIGZpdCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5DQU5OT1RfRklYX1JBTkdFX1NURVBfV0lUSF9GSVQpO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLndpZHRoLCAyMDApO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmhlaWdodCwgMjAwKTtcbiAgfSkpO1xuXG4gIGl0KCd3YXJuIGlmIHRyeWluZyB0byBmaXQgY29tcG9zZWQgc3BlYycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgXCJ2Y29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLkZJVF9OT05fU0lOR0xFKTtcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgJ3BhZCcpO1xuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgZm9yIGEgbGF5ZXJlZCBzcGVjLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgKHN0cmluZykgZm9yIGEgbGF5ZXJlZCBzcGVjLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwidGl0bGVcIjogXCJ0ZXN0XCIsXG4gICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dXG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgZnJvbSBhIGNoaWxkIG9mIGEgbGF5ZXIgc3BlYyBpZiBwYXJlbnQgaGFzIG5vIHRpdGxlLicsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcImRhdGFcIjoge1xuICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgfSxcbiAgICAgIFwibGF5ZXJcIjogW3tcbiAgICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHRpdGxlIGZvciBhIGNvbmNhdCBzcGVjLCB0aHJvdyB3YXJuaW5nIGlmIGFuY2hvciBpcyBzZXQgdG8gb3RoZXIgdmFsdWVzIHRoYW4gXCJzdGFydFwiIGFuZCBhdXRvbWF0aWNhbGx5IHNldCBhbmNob3IgdG8gXCJzdGFydFwiLicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICB9LFxuICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgIFwiaGNvbmNhdFwiOiBbe1xuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9XSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcImFuY2hvclwiOiBcIm1pZGRsZVwifX1cbiAgICB9KS5zcGVjO1xuICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge1xuICAgICAgdGV4dDogJ3Rlc3QnLFxuICAgICAgYW5jaG9yOiAnc3RhcnQnIC8vIFdlIG9ubHkgc3VwcG9ydCBhbmNob3IgYXMgc3RhcnQgZm9yIGNvbmNhdFxuICAgIH0pO1xuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuY2Fubm90U2V0VGl0bGVBbmNob3IoJ2NvbmNhdCcpKTtcbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdGl0bGUgZm9yIGEgY29uY2F0IHNwZWMsIGF1dG9tYXRpY2FsbHkgc2V0IGFuY2hvciB0byBcInN0YXJ0XCIsIGFuZCBhdWdtZW50IHRoZSB0aXRsZSB3aXRoIG5vbi1tYXJrIHRpdGxlIGNvbmZpZyAoZS5nLiwgb2Zmc2V0KS4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgXCJoY29uY2F0XCI6IFt7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH1dLFxuICAgICAgXCJjb25maWdcIjoge1widGl0bGVcIjoge1wib2Zmc2V0XCI6IDV9fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7XG4gICAgICB0ZXh0OiAndGVzdCcsXG4gICAgICBhbmNob3I6ICdzdGFydCcsXG4gICAgICBvZmZzZXQ6IDVcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBub3QgaGF2ZSB0aXRsZSBpZiB0aGVyZSBpcyBubyB0aXRsZS4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgIH0sXG4gICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfV0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJ0aXRsZVwiOiB7XCJvZmZzZXRcIjogNX19XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuaXNVbmRlZmluZWQoc3BlYy50aXRsZSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdXNlIHByb3ZpZGVkIGNvbmZpZy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZGF0YToge3VybDogXCJmb28uY3N2XCJ9LFxuICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgfSwge2NvbmZpZzoge1xuICAgICAgYmFja2dyb3VuZDogXCJibHVlXCJcbiAgICB9fSkuc3BlYztcbiAgICBhc3NlcnQuZXF1YWwoc3BlYy5jb25maWcuYmFja2dyb3VuZCwgXCJibHVlXCIpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG1lcmdlIHNwZWMgYW5kIHByb3ZpZGVkIGNvbmZpZy4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgZGF0YToge3VybDogXCJmb28uY3N2XCJ9LFxuICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IFwicmVkXCJcbiAgICAgIH1cbiAgICB9LCB7Y29uZmlnOiB7XG4gICAgICBiYWNrZ3JvdW5kOiBcImJsdWVcIlxuICAgIH19KS5zcGVjO1xuICAgIGFzc2VydC5lcXVhbChzcGVjLmNvbmZpZy5iYWNrZ3JvdW5kLCBcInJlZFwiKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggcHJvamVjdGlvbnMgKGltcGxpY2l0KScsICgpID0+IHtcbiAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgfSkuc3BlYztcbiAgICBhc3NlcnQuaXNEZWZpbmVkKHNwZWMucHJvamVjdGlvbnMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBwcm9qZWN0aW9ucyAoZXhwbGljaXQpJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgIH0pLnNwZWM7XG4gICAgYXNzZXJ0LmlzRGVmaW5lZChzcGVjLnByb2plY3Rpb25zKTtcbiAgfSk7XG59KTtcbiJdfQ==