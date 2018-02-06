"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var log = require("../../src/log");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('FacetModel', function () {
    describe('initFacet', function () {
        it('should drop unsupported channel and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseFacetModel({
                facet: ({
                    shape: { field: 'a', type: 'quantitative' }
                }),
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            chai_1.assert.equal(model.facet['shape'], undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SHAPE, 'facet'));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            chai_1.assert.equal(model.facet.row, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.ORDINAL }, channel_1.ROW));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            chai_1.assert.deepEqual(model.facet.row, { field: 'a', type: 'quantitative' });
            chai_1.assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(channel_1.ROW));
        }));
    });
    describe('parseAxisAndHeader', function () {
        // TODO: add more tests
        // - correctly join title for nested facet
        // - correctly generate headers with right labels and axes
        it('applies text format to the fieldref of a temporal field', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { timeUnit: 'year', field: 'date', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseAxisAndHeader();
            var headerMarks = model.assembleHeaderMarks();
            var columnHeader = headerMarks.filter(function (d) {
                return d.name === "column_header";
            })[0];
            chai_1.assert(columnHeader.title.text.signal, "timeFormat(parent[\"year_date\"], '%Y')");
        });
        it('applies number format for fieldref of a quantitative field', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative', format: 'd' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseAxisAndHeader();
            var headerMarks = model.assembleHeaderMarks();
            var columnHeader = headerMarks.filter(function (d) {
                return d.name === "column_header";
            })[0];
            chai_1.assert(columnHeader.title.text.signal, "format(parent[\"a\"], 'd')");
        });
        it('ignores number format for fieldref of a binned field', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { bin: true, field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseAxisAndHeader();
            var headerMarks = model.assembleHeaderMarks();
            var columnHeader = headerMarks.filter(function (d) {
                return d.name === "column_header";
            })[0];
            chai_1.assert(columnHeader.title.text.signal, "parent[\"a\"]");
        });
    });
    describe('parseScale', function () {
        it('should correctly set scale component for a model', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert(model.component.scales['x']);
        });
        it('should create independent scales if resolve is set to independent', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' }
                    }
                },
                resolve: {
                    scale: {
                        x: 'independent'
                    }
                }
            });
            chai_1.assert(!model.component.scales['x']);
        });
    });
    describe('assembleHeaderMarks', function () {
        it('should sort headers in ascending order', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative', format: 'd' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseAxisAndHeader();
            var headerMarks = model.assembleHeaderMarks();
            var columnHeader = headerMarks.filter(function (d) {
                return d.name === "column_header";
            })[0];
            chai_1.assert.deepEqual(columnHeader.sort, { field: 'datum["a"]', order: 'ascending' });
        });
    });
    describe('assembleGroup', function () {
        it('includes a columns fields in the encode block for facet with column that parent is also a facet.', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    facet: {
                        column: { field: 'c', type: 'quantitative' }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' }
                        }
                    }
                }
                // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
            });
            model.parseData();
            var group = model.child.assembleGroup([]);
            chai_1.assert.deepEqual(group.encode.update.columns, { field: 'distinct_c' });
        });
    });
    describe('assembleLayout', function () {
        it('returns a layout with a column signal for facet with column', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' }
                    }
                }
            });
            var layout = model.assembleLayout();
            chai_1.assert.deepEqual(layout, {
                padding: { row: 10, column: 10 },
                offset: 10,
                columns: {
                    signal: "length(data('column_domain'))"
                },
                bounds: 'full',
                align: 'all'
            });
        });
        it('returns a layout without a column signal for facet with column that parent is also a facet.', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    facet: {
                        column: { field: 'c', type: 'quantitative' }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' }
                        }
                    }
                }
                // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
            });
            var layout = model.child.assembleLayout();
            chai_1.assert.deepEqual(layout.columns, undefined);
        });
        it('returns a layout with header band if child spec is also a facet', function () {
            var model = util_1.parseFacetModelWithScale({
                "$schema": "https://vega.github.io/schema/vega-lite/v2.json",
                "data": { "url": "data/cars.json" },
                "facet": { "row": { "field": "Origin", "type": "ordinal" } },
                "spec": {
                    "facet": { "row": { "field": "Cylinders", "type": "ordinal" } },
                    "spec": {
                        "mark": "point",
                        "encoding": {
                            "x": { "field": "Horsepower", "type": "quantitative" },
                            "y": { "field": "Acceleration", "type": "quantitative" }
                        }
                    }
                }
                // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
            });
            model.parseLayoutSize();
            model.parseAxisAndHeader();
            var layout = model.assembleLayout();
            chai_1.assert.deepEqual(layout.headerBand, { row: 0.5 });
        });
    });
    describe('assembleMarks', function () {
        it('should add cross and sort if we facet by multiple dimensions', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'ordinal' },
                    column: { field: 'b', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parse();
            var marks = model.assembleMarks();
            chai_1.assert(marks[0].from.facet.aggregate.cross);
            chai_1.assert.deepEqual(marks[0].sort, {
                field: [
                    'datum["a"]',
                    'datum["b"]'
                ],
                order: [
                    'ascending',
                    'ascending'
                ]
            });
        });
        it('should add calculate cardinality for independent scales', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'rect',
                    encoding: {
                        x: { field: 'b', type: 'nominal' },
                        y: { field: 'c', type: 'nominal' }
                    }
                },
                resolve: {
                    scale: {
                        x: 'independent',
                        y: 'independent'
                    }
                }
            });
            model.parse();
            var marks = model.assembleMarks();
            chai_1.assert.deepEqual(marks[0].from.facet.aggregate, {
                fields: ['b', 'c'],
                ops: ['distinct', 'distinct']
            });
        });
        it('should add calculate cardinality for child column facet', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    facet: {
                        column: { field: 'c', type: 'quantitative' }
                    },
                    spec: {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' }
                        }
                    }
                }
                // TODO: remove "any" once we support all facet listed in https://github.com/vega/vega-lite/issues/2760
            });
            model.parse();
            var marks = model.assembleMarks();
            chai_1.assert.deepEqual(marks[0].from.facet.aggregate, {
                fields: ['c'],
                ops: ['distinct']
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9mYWNldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1Qiw2Q0FBNkM7QUFJN0MsbUNBQXFDO0FBQ3JDLHVDQUF1QztBQUV2QyxnQ0FBa0U7QUFFbEUsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUM1RSxJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUUsQ0FBQztvQkFDTixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFDLENBQXlCO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFLEVBQUU7aUJBQ2I7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsZUFBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUN4RixJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO2dCQUM1QixLQUFLLEVBQUU7b0JBQ0wsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDdkI7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Q0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVkLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVwQyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtnQkFDOUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDO2dCQUNiLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUNsQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtST1csIFNIQVBFfSBmcm9tICcuLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge0ZhY2V0TW9kZWx9IGZyb20gJy4uLy4uL3NyYy9jb21waWxlL2ZhY2V0JztcbmltcG9ydCB7RmFjZXRNYXBwaW5nfSBmcm9tICcuLi8uLi9zcmMvZmFjZXQnO1xuaW1wb3J0IHtQb3NpdGlvbkZpZWxkRGVmfSBmcm9tICcuLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtPUkRJTkFMfSBmcm9tICcuLi8uLi9zcmMvdHlwZSc7XG5pbXBvcnQge1ZnTGF5b3V0fSBmcm9tICcuLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdGYWNldE1vZGVsJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdpbml0RmFjZXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkcm9wIHVuc3VwcG9ydGVkIGNoYW5uZWwgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGZhY2V0OiAoe1xuICAgICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0pIGFzIEZhY2V0TWFwcGluZzxzdHJpbmc+LCAvLyBDYXN0IHRvIGFsbG93IGludmFsaWQgZmFjZXQgdHlwZSBmb3IgdGVzdFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZmFjZXRbJ3NoYXBlJ10sIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoU0hBUEUsICdmYWNldCcpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgY2hhbm5lbCB3aXRob3V0IGZpZWxkIGFuZCB2YWx1ZSBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHt0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5mYWNldC5yb3csIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5RmllbGREZWYoe3R5cGU6IE9SRElOQUx9LCBST1cpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgY2hhbm5lbCB3aXRob3V0IGZpZWxkIGFuZCB2YWx1ZSBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxQb3NpdGlvbkZpZWxkRGVmPHN0cmluZz4+KG1vZGVsLmZhY2V0LnJvdywge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmZhY2V0Q2hhbm5lbFNob3VsZEJlRGlzY3JldGUoUk9XKSk7XG4gICAgfSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VBeGlzQW5kSGVhZGVyJywgKCkgPT4ge1xuICAgIC8vIFRPRE86IGFkZCBtb3JlIHRlc3RzXG4gICAgLy8gLSBjb3JyZWN0bHkgam9pbiB0aXRsZSBmb3IgbmVzdGVkIGZhY2V0XG4gICAgLy8gLSBjb3JyZWN0bHkgZ2VuZXJhdGUgaGVhZGVycyB3aXRoIHJpZ2h0IGxhYmVscyBhbmQgYXhlc1xuXG5cbiAgICBpdCgnYXBwbGllcyB0ZXh0IGZvcm1hdCB0byB0aGUgZmllbGRyZWYgb2YgYSB0ZW1wb3JhbCBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHt0aW1lVW5pdDoneWVhcicsIGZpZWxkOiAnZGF0ZScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuICAgICAgY29uc3QgaGVhZGVyTWFya3MgPSBtb2RlbC5hc3NlbWJsZUhlYWRlck1hcmtzKCk7XG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXIgPSBoZWFkZXJNYXJrcy5maWx0ZXIoZCA9PiB7XG4gICAgICAgIHJldHVybiBkLm5hbWUgPT09IFwiY29sdW1uX2hlYWRlclwiO1xuICAgICAgfSlbMF07XG5cbiAgICAgIGFzc2VydChjb2x1bW5IZWFkZXIudGl0bGUudGV4dC5zaWduYWwsIFwidGltZUZvcm1hdChwYXJlbnRbXFxcInllYXJfZGF0ZVxcXCJdLCAnJVknKVwiKTtcbiAgICB9KTtcblxuICAgIGl0KCdhcHBsaWVzIG51bWJlciBmb3JtYXQgZm9yIGZpZWxkcmVmIG9mIGEgcXVhbnRpdGF0aXZlIGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBmb3JtYXQ6ICdkJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuICAgICAgY29uc3QgaGVhZGVyTWFya3MgPSBtb2RlbC5hc3NlbWJsZUhlYWRlck1hcmtzKCk7XG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXIgPSBoZWFkZXJNYXJrcy5maWx0ZXIoZCA9PiB7XG4gICAgICAgIHJldHVybiBkLm5hbWUgPT09IFwiY29sdW1uX2hlYWRlclwiO1xuICAgICAgfSlbMF07XG5cbiAgICAgIGFzc2VydChjb2x1bW5IZWFkZXIudGl0bGUudGV4dC5zaWduYWwsIFwiZm9ybWF0KHBhcmVudFtcXFwiYVxcXCJdLCAnZCcpXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lnbm9yZXMgbnVtYmVyIGZvcm1hdCBmb3IgZmllbGRyZWYgb2YgYSBiaW5uZWQgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7YmluOiB0cnVlLCBmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuICAgICAgY29uc3QgaGVhZGVyTWFya3MgPSBtb2RlbC5hc3NlbWJsZUhlYWRlck1hcmtzKCk7XG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXIgPSBoZWFkZXJNYXJrcy5maWx0ZXIoZCA9PiB7XG4gICAgICAgIHJldHVybiBkLm5hbWUgPT09IFwiY29sdW1uX2hlYWRlclwiO1xuICAgICAgfSlbMF07XG5cbiAgICAgIGFzc2VydChjb2x1bW5IZWFkZXIudGl0bGUudGV4dC5zaWduYWwsIFwicGFyZW50W1xcXCJhXFxcIl1cIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZVNjYWxlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IHNldCBzY2FsZSBjb21wb25lbnQgZm9yIGEgbW9kZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICBhc3NlcnQobW9kZWwuY29tcG9uZW50LnNjYWxlc1sneCddKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIGluZGVwZW5kZW50IHNjYWxlcyBpZiByZXNvbHZlIGlzIHNldCB0byBpbmRlcGVuZGVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgeDogJ2luZGVwZW5kZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydCghbW9kZWwuY29tcG9uZW50LnNjYWxlc1sneCddKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlSGVhZGVyTWFya3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzb3J0IGhlYWRlcnMgaW4gYXNjZW5kaW5nIG9yZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBmb3JtYXQ6ICdkJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgICBjb25zdCBoZWFkZXJNYXJrcyA9IG1vZGVsLmFzc2VtYmxlSGVhZGVyTWFya3MoKTtcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlciA9IGhlYWRlck1hcmtzLmZpbHRlcihkID0+IHtcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gXCJjb2x1bW5faGVhZGVyXCI7XG4gICAgICB9KVswXTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2x1bW5IZWFkZXIuc29ydCwge2ZpZWxkOiAnZGF0dW1bXCJhXCJdJywgb3JkZXI6ICdhc2NlbmRpbmcnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZUdyb3VwJywgKCkgPT4ge1xuICAgIGl0KCdpbmNsdWRlcyBhIGNvbHVtbnMgZmllbGRzIGluIHRoZSBlbmNvZGUgYmxvY2sgZm9yIGZhY2V0IHdpdGggY29sdW1uIHRoYXQgcGFyZW50IGlzIGFsc28gYSBmYWNldC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBcImFueVwiIG9uY2Ugd2Ugc3VwcG9ydCBhbGwgZmFjZXQgbGlzdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc2MFxuICAgICAgfSBhcyBhbnkpO1xuICAgICAgbW9kZWwucGFyc2VEYXRhKCk7XG4gICAgICBjb25zdCBncm91cCA9IG1vZGVsLmNoaWxkLmFzc2VtYmxlR3JvdXAoW10pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChncm91cC5lbmNvZGUudXBkYXRlLmNvbHVtbnMsIHtmaWVsZDogJ2Rpc3RpbmN0X2MnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZUxheW91dCcsICgpID0+IHtcbiAgICBpdCgncmV0dXJucyBhIGxheW91dCB3aXRoIGEgY29sdW1uIHNpZ25hbCBmb3IgZmFjZXQgd2l0aCBjb2x1bW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTGF5b3V0PihsYXlvdXQsIHtcbiAgICAgICAgcGFkZGluZzoge3JvdzogMTAsIGNvbHVtbjogMTB9LFxuICAgICAgICBvZmZzZXQ6IDEwLFxuICAgICAgICBjb2x1bW5zOiB7XG4gICAgICAgICAgc2lnbmFsOiBcImxlbmd0aChkYXRhKCdjb2x1bW5fZG9tYWluJykpXCJcbiAgICAgICAgfSxcbiAgICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICAgIGFsaWduOiAnYWxsJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBhIGxheW91dCB3aXRob3V0IGEgY29sdW1uIHNpZ25hbCBmb3IgZmFjZXQgd2l0aCBjb2x1bW4gdGhhdCBwYXJlbnQgaXMgYWxzbyBhIGZhY2V0LicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIFwiYW55XCIgb25jZSB3ZSBzdXBwb3J0IGFsbCBmYWNldCBsaXN0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzYwXG4gICAgICB9IGFzIGFueSk7XG4gICAgICBjb25zdCBsYXlvdXQgPSBtb2RlbC5jaGlsZC5hc3NlbWJsZUxheW91dCgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYXlvdXQuY29sdW1ucywgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgbGF5b3V0IHdpdGggaGVhZGVyIGJhbmQgaWYgY2hpbGQgc3BlYyBpcyBhbHNvIGEgZmFjZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiJHNjaGVtYVwiOiBcImh0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2NhcnMuanNvblwifSxcbiAgICAgICAgXCJmYWNldFwiOiB7XCJyb3dcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICBcImZhY2V0XCI6IHtcInJvd1wiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgICAgIFwic3BlY1wiOiB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIkFjY2VsZXJhdGlvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgXCJhbnlcIiBvbmNlIHdlIHN1cHBvcnQgYWxsIGZhY2V0IGxpc3RlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NjBcbiAgICAgIH0gYXMgYW55KTtcbiAgICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG4gICAgICBjb25zdCBsYXlvdXQgPSBtb2RlbC5hc3NlbWJsZUxheW91dCgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYXlvdXQuaGVhZGVyQmFuZCwge3JvdzogMC41fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZU1hcmtzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWRkIGNyb3NzIGFuZCBzb3J0IGlmIHdlIGZhY2V0IGJ5IG11bHRpcGxlIGRpbWVuc2lvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbDogRmFjZXRNb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAgIGNvbnN0IG1hcmtzID0gbW9kZWwuYXNzZW1ibGVNYXJrcygpO1xuXG4gICAgICBhc3NlcnQobWFya3NbMF0uZnJvbS5mYWNldC5hZ2dyZWdhdGUuY3Jvc3MpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXJrc1swXS5zb3J0LCB7XG4gICAgICAgIGZpZWxkOiBbXG4gICAgICAgICAgJ2RhdHVtW1wiYVwiXScsXG4gICAgICAgICAgJ2RhdHVtW1wiYlwiXSdcbiAgICAgICAgXSxcbiAgICAgICAgb3JkZXI6IFtcbiAgICAgICAgICAnYXNjZW5kaW5nJyxcbiAgICAgICAgICAnYXNjZW5kaW5nJ1xuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGNhbGN1bGF0ZSBjYXJkaW5hbGl0eSBmb3IgaW5kZXBlbmRlbnQgc2NhbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWw6IEZhY2V0TW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdyZWN0JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdub21pbmFsJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgICB4OiAnaW5kZXBlbmRlbnQnLFxuICAgICAgICAgICAgeTogJ2luZGVwZW5kZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgICBjb25zdCBtYXJrcyA9IG1vZGVsLmFzc2VtYmxlTWFya3MoKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXJrc1swXS5mcm9tLmZhY2V0LmFnZ3JlZ2F0ZSwge1xuICAgICAgICBmaWVsZHM6IFsnYicsICdjJ10sXG4gICAgICAgIG9wczogWydkaXN0aW5jdCcsICdkaXN0aW5jdCddXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGNhbGN1bGF0ZSBjYXJkaW5hbGl0eSBmb3IgY2hpbGQgY29sdW1uIGZhY2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWw6IEZhY2V0TW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgXCJhbnlcIiBvbmNlIHdlIHN1cHBvcnQgYWxsIGZhY2V0IGxpc3RlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NjBcbiAgICAgIH0gYXMgYW55KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAgIGNvbnN0IG1hcmtzID0gbW9kZWwuYXNzZW1ibGVNYXJrcygpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtzWzBdLmZyb20uZmFjZXQuYWdncmVnYXRlLCB7XG4gICAgICAgIGZpZWxkczogWydjJ10sXG4gICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==