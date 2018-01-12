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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQU8sQ0FBQyxFQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyw4RkFBOEYsRUFBRTtZQUNqRyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztnQkFDekIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDN0IsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlCLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1lBRTdDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjO1lBQ2pELGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7UUFDNUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0ZBQXdGLEVBQUU7WUFDM0YsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsU0FBUyxFQUFFLEdBQUc7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7aUJBQy9CO2dCQUNELE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUVSLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoQyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkMsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztZQUU5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZTtZQUNsRCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCO1FBQzVELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBQztnQkFDeEMsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDdEMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUM1QzthQUNGLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFUixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsS0FBSyxFQUFFLEVBQUU7aUJBQ1YsRUFBRTtvQkFDRCxJQUFJLEVBQUUsT0FBTztvQkFDYixNQUFNLEVBQUUsbURBQW1EO2lCQUM1RCxDQUFDLENBQUMsQ0FBQztZQUNKLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7WUFDNUQsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsVUFBVSxFQUFFO29CQUNWLE1BQU0sRUFBRSxLQUFLO29CQUNiLFVBQVUsRUFBRSxTQUFTO2lCQUN0QjtnQkFDRCxNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFUixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFUixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDekUsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFDO2dCQUN4QyxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUUsS0FBSztnQkFDakIsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDdEMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUM1QzthQUNGLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDUixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1lBQy9FLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5QixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUM3RCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUM7Z0JBQ3hDLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZixDQUFDO2FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNSLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9ELGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDO2dCQUN6QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZixDQUFDO2FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ3JELElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsTUFBTTtnQkFDZixPQUFPLEVBQUUsQ0FBQzt3QkFDUixNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZixDQUFDO2FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO1lBQzdFLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQzt3QkFDUixPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDO3dCQUN6QixNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZixDQUFDO2FBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNSLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtJQUErSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQ3ZLLElBQU0sSUFBSSxHQUFHLGlCQUFPLENBQUM7Z0JBQ25CLE1BQU0sRUFBRTtvQkFDTixRQUFRLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDO2dCQUN6QixTQUFTLEVBQUUsQ0FBQzt3QkFDVixNQUFNLEVBQUUsT0FBTzt3QkFDZixVQUFVLEVBQUUsRUFBRTtxQkFDZixDQUFDO2dCQUNGLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsRUFBQzthQUMxQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ1IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMzQixJQUFJLEVBQUUsTUFBTTtnQkFDWixNQUFNLEVBQUUsT0FBTyxDQUFDLDZDQUE2QzthQUM5RCxDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixFQUFFLENBQUMsZ0pBQWdKLEVBQUU7WUFDbkosSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7aUJBQy9CO2dCQUNELE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUM7Z0JBQ3pCLFNBQVMsRUFBRSxDQUFDO3dCQUNWLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFVBQVUsRUFBRSxFQUFFO3FCQUNmLENBQUM7Z0JBQ0YsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxFQUFDO2FBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDUixhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQzNCLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU0sRUFBRSxPQUFPO2dCQUNmLE1BQU0sRUFBRSxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUM7aUJBQy9CO2dCQUNELFNBQVMsRUFBRSxDQUFDO3dCQUNWLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFVBQVUsRUFBRSxFQUFFO3FCQUNmLENBQUM7Z0JBQ0YsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLENBQUMsRUFBQyxFQUFDO2FBQ25DLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDUixhQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtZQUNoQyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsRUFBRTthQUNiLEVBQUUsRUFBQyxNQUFNLEVBQUU7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNULGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQztnQkFDbkIsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osTUFBTSxFQUFFO29CQUNOLFVBQVUsRUFBRSxLQUFLO2lCQUNsQjthQUNGLEVBQUUsRUFBQyxNQUFNLEVBQUU7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNULGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL3NyYy9sb2cnO1xuXG5pbXBvcnQge2NvbXBpbGV9IGZyb20gJy4uLy4uL3NyYy9jb21waWxlL2NvbXBpbGUnO1xuXG5cbmRlc2NyaWJlKCdDb21waWxlJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgdGhyb3cgZXJyb3IgZm9yIGludmFsaWQgc3BlYycsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIGNvbXBpbGUoe30gYXMgYW55KTtcbiAgICB9LCBFcnJvciwgbG9nLm1lc3NhZ2UuSU5WQUxJRF9TUEVDKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbXBpbGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSBzcGVjIHdpdGggZGVmYXVsdCB0b3AtbGV2ZWwgcHJvcGVydGllcywgc2l6ZSBzaWduYWxzLCBkYXRhLCBtYXJrcywgYW5kIHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICAgIH0sXG4gICAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pLnNwZWM7XG5cbiAgICAgIGFzc2VydC5lcXVhbChzcGVjLnBhZGRpbmcsIDUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsICdwYWQnKTtcbiAgICAgIGFzc2VydC5lcXVhbChzcGVjLndpZHRoLCAyMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIxKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5kYXRhLmxlbmd0aCwgMSk7IC8vIGp1c3Qgc291cmNlXG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5tYXJrcy5sZW5ndGgsIDEpOyAvLyBqdXN0IHRoZSByb290IGdyb3VwXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBhIHNwZWMgd2l0aCBzcGVjaWZpZWQgdG9wLWxldmVsIHByb3BlcnRpZXMsIHNpemUgc2lnbmFscywgZGF0YSBhbmQgbWFya3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICAgIFwicGFkZGluZ1wiOiAxMjMsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfSkuc3BlYztcblxuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMucGFkZGluZywgMTIzKTtcbiAgICAgIGFzc2VydC5lcXVhbChzcGVjLmF1dG9zaXplLCAncGFkJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy53aWR0aCwgMjEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChzcGVjLmRhdGEubGVuZ3RoLCAxKTsgLy8ganVzdCBzb3VyY2UuXG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5tYXJrcy5sZW5ndGgsIDEpOyAvLyBqdXN0IHRoZSByb290IGdyb3VwXG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzaXplIHNpZ25hbCBmb3IgYmFyIGNoYXJ0IHdpZHRoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBcImRhdGFcIjoge1widmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KS5zcGVjO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMuc2lnbmFscywgW3tcbiAgICAgICAgbmFtZTogJ3hfc3RlcCcsXG4gICAgICAgIHZhbHVlOiAyMVxuICAgICAgfSwge1xuICAgICAgICBuYW1lOiAnd2lkdGgnLFxuICAgICAgICB1cGRhdGU6IGBiYW5kc3BhY2UoZG9tYWluKCd4JykubGVuZ3RoLCAwLjEsIDAuMDUpICogeF9zdGVwYFxuICAgICAgfV0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMuaGVpZ2h0LCAyMDApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgcmVzaXplIHRvIHRydWUgaWYgcmVxdWVzdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBcImF1dG9zaXplXCI6IHtcbiAgICAgICAgICBcInJlc2l6ZVwiOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pLnNwZWM7XG5cbiAgICAgIGFzc2VydChzcGVjLmF1dG9zaXplLnJlc2l6ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNldCBhdXRvc2l6ZSB0byBmaXQgYW5kIGNvbnRhaW5tZW50IGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJhdXRvc2l6ZVwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiZml0XCIsXG4gICAgICAgICAgXCJjb250YWluc1wiOiBcImNvbnRlbnRcIlxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9KS5zcGVjO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMuYXV0b3NpemUsIHt0eXBlOiAnZml0JywgY29udGFpbnM6ICdjb250ZW50J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzZXQgYXV0b3NpemUgdG8gZml0IGlmIHJlcXVlc3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJhdXRvc2l6ZVwiOiBcImZpdFwiLFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9KS5zcGVjO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5hdXRvc2l6ZSwgXCJmaXRcIik7XG4gICAgfSk7XG5cbiAgICBpdCgnd2FybiBpZiBzaXplIGlzIGRhdGEgZHJpdmVuIGFuZCBhdXRvc2l6ZSBpcyBmaXQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XX0sXG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KS5zcGVjO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5DQU5OT1RfRklYX1JBTkdFX1NURVBfV0lUSF9GSVQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMud2lkdGgsIDIwMCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5oZWlnaHQsIDIwMCk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3dhcm4gaWYgdHJ5aW5nIHRvIGZpdCBjb21wb3NlZCBzcGVjJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV19LFxuICAgICAgICBcImF1dG9zaXplXCI6IFwiZml0XCIsXG4gICAgICAgIFwidmNvbmNhdFwiOiBbe1xuICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICB9XVxuICAgICAgfSkuc3BlYztcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuRklUX05PTl9TSU5HTEUpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNwZWMuYXV0b3NpemUsICdwYWQnKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0aXRsZSBmb3IgYSBsYXllcmVkIHNwZWMuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidmFsdWVzXCI6IFt7XCJhXCI6IFwiQVwiLFwiYlwiOiAyOH1dXG4gICAgICAgIH0sXG4gICAgICAgIFwidGl0bGVcIjoge1widGV4dFwiOiBcInRlc3RcIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW3tcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgfV1cbiAgICAgIH0pLnNwZWM7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRpdGxlIChzdHJpbmcpIGZvciBhIGxheWVyZWQgc3BlYy4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0aXRsZVwiOiBcInRlc3RcIixcbiAgICAgICAgXCJsYXllclwiOiBbe1xuICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICB9XVxuICAgICAgfSkuc3BlYztcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3BlYy50aXRsZSwge3RleHQ6ICd0ZXN0J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGl0bGUgZnJvbSBhIGNoaWxkIG9mIGEgbGF5ZXIgc3BlYyBpZiBwYXJlbnQgaGFzIG5vIHRpdGxlLicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgICB9LFxuICAgICAgICBcImxheWVyXCI6IFt7XG4gICAgICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgfV1cbiAgICAgIH0pLnNwZWM7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHt0ZXh0OiAndGVzdCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGEgdGl0bGUgZm9yIGEgY29uY2F0IHNwZWMsIHRocm93IHdhcm5pbmcgaWYgYW5jaG9yIGlzIHNldCB0byBvdGhlciB2YWx1ZXMgdGhhbiBcInN0YXJ0XCIgYW5kIGF1dG9tYXRpY2FsbHkgc2V0IGFuY2hvciB0byBcInN0YXJ0XCIuJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBzcGVjID0gY29tcGlsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ2YWx1ZXNcIjogW3tcImFcIjogXCJBXCIsXCJiXCI6IDI4fV1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0aXRsZVwiOiB7XCJ0ZXh0XCI6IFwidGVzdFwifSxcbiAgICAgICAgXCJoY29uY2F0XCI6IFt7XG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgIH1dLFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJ0aXRsZVwiOiB7XCJhbmNob3JcIjogXCJtaWRkbGVcIn19XG4gICAgICB9KS5zcGVjO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzcGVjLnRpdGxlLCB7XG4gICAgICAgIHRleHQ6ICd0ZXN0JyxcbiAgICAgICAgYW5jaG9yOiAnc3RhcnQnIC8vIFdlIG9ubHkgc3VwcG9ydCBhbmNob3IgYXMgc3RhcnQgZm9yIGNvbmNhdFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmNhbm5vdFNldFRpdGxlQW5jaG9yKCdjb25jYXQnKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYSB0aXRsZSBmb3IgYSBjb25jYXQgc3BlYywgYXV0b21hdGljYWxseSBzZXQgYW5jaG9yIHRvIFwic3RhcnRcIiwgYW5kIGF1Z21lbnQgdGhlIHRpdGxlIHdpdGggbm9uLW1hcmsgdGl0bGUgY29uZmlnIChlLmcuLCBvZmZzZXQpLicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgICB9LFxuICAgICAgICBcInRpdGxlXCI6IHtcInRleHRcIjogXCJ0ZXN0XCJ9LFxuICAgICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgfV0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcIm9mZnNldFwiOiA1fX1cbiAgICAgIH0pLnNwZWM7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNwZWMudGl0bGUsIHtcbiAgICAgICAgdGV4dDogJ3Rlc3QnLFxuICAgICAgICBhbmNob3I6ICdzdGFydCcsXG4gICAgICAgIG9mZnNldDogNVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBoYXZlIHRpdGxlIGlmIHRoZXJlIGlzIG5vIHRpdGxlLicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWMgPSBjb21waWxlKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInZhbHVlc1wiOiBbe1wiYVwiOiBcIkFcIixcImJcIjogMjh9XVxuICAgICAgICB9LFxuICAgICAgICBcImhjb25jYXRcIjogW3tcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgfV0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcInRpdGxlXCI6IHtcIm9mZnNldFwiOiA1fX1cbiAgICAgIH0pLnNwZWM7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoc3BlYy50aXRsZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBwcm92aWRlZCBjb25maWcuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgfSwge2NvbmZpZzoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBcImJsdWVcIlxuICAgICAgfX0pLnNwZWM7XG4gICAgICBhc3NlcnQuZXF1YWwoc3BlYy5jb25maWcuYmFja2dyb3VuZCwgXCJibHVlXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBzcGVjIGFuZCBwcm92aWRlZCBjb25maWcuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYyA9IGNvbXBpbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7fSxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgYmFja2dyb3VuZDogXCJyZWRcIlxuICAgICAgICB9XG4gICAgICB9LCB7Y29uZmlnOiB7XG4gICAgICAgIGJhY2tncm91bmQ6IFwiYmx1ZVwiXG4gICAgICB9fSkuc3BlYztcbiAgICAgIGFzc2VydC5lcXVhbChzcGVjLmNvbmZpZy5iYWNrZ3JvdW5kLCBcInJlZFwiKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==