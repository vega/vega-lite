"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var log = tslib_1.__importStar(require("../../src/log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9mYWNldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsNkNBQTZDO0FBSTdDLHlEQUFxQztBQUNyQyx1Q0FBdUM7QUFFdkMsZ0NBQWtFO0FBRWxFLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDNUUsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFLENBQUM7b0JBQ04sS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUMxQyxDQUF5QjtnQkFDMUIsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxPQUFPO29CQUNiLFFBQVEsRUFBRSxFQUFFO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGVBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixFQUFFLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDeEYsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztnQkFDNUIsS0FBSyxFQUFFO29CQUNMLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ3ZC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O1lBRWQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRXBDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO2dCQUM5QyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2IsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge1JPVywgU0hBUEV9IGZyb20gJy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7RmFjZXRNb2RlbH0gZnJvbSAnLi4vLi4vc3JjL2NvbXBpbGUvZmFjZXQnO1xuaW1wb3J0IHtGYWNldE1hcHBpbmd9IGZyb20gJy4uLy4uL3NyYy9mYWNldCc7XG5pbXBvcnQge1Bvc2l0aW9uRmllbGREZWZ9IGZyb20gJy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge09SRElOQUx9IGZyb20gJy4uLy4uL3NyYy90eXBlJztcbmltcG9ydCB7VmdMYXlvdXR9IGZyb20gJy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ0ZhY2V0TW9kZWwnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2luaXRGYWNldCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbCBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6ICh7XG4gICAgICAgICAgc2hhcGU6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSkgYXMgRmFjZXRNYXBwaW5nPHN0cmluZz4sIC8vIENhc3QgdG8gYWxsb3cgaW52YWxpZCBmYWNldCB0eXBlIGZvciB0ZXN0XG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5mYWNldFsnc2hhcGUnXSwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuaW5jb21wYXRpYmxlQ2hhbm5lbChTSEFQRSwgJ2ZhY2V0JykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBjaGFubmVsIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge3R5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmZhY2V0LnJvdywgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZW1wdHlGaWVsZERlZih7dHlwZTogT1JESU5BTH0sIFJPVykpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBjaGFubmVsIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFBvc2l0aW9uRmllbGREZWY8c3RyaW5nPj4obW9kZWwuZmFjZXQucm93LCB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuZmFjZXRDaGFubmVsU2hvdWxkQmVEaXNjcmV0ZShST1cpKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZUF4aXNBbmRIZWFkZXInLCAoKSA9PiB7XG4gICAgLy8gVE9ETzogYWRkIG1vcmUgdGVzdHNcbiAgICAvLyAtIGNvcnJlY3RseSBqb2luIHRpdGxlIGZvciBuZXN0ZWQgZmFjZXRcbiAgICAvLyAtIGNvcnJlY3RseSBnZW5lcmF0ZSBoZWFkZXJzIHdpdGggcmlnaHQgbGFiZWxzIGFuZCBheGVzXG5cblxuICAgIGl0KCdhcHBsaWVzIHRleHQgZm9ybWF0IHRvIHRoZSBmaWVsZHJlZiBvZiBhIHRlbXBvcmFsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge3RpbWVVbml0Oid5ZWFyJywgZmllbGQ6ICdkYXRlJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG4gICAgICBjb25zdCBoZWFkZXJNYXJrcyA9IG1vZGVsLmFzc2VtYmxlSGVhZGVyTWFya3MoKTtcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlciA9IGhlYWRlck1hcmtzLmZpbHRlcihkID0+IHtcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gXCJjb2x1bW5faGVhZGVyXCI7XG4gICAgICB9KVswXTtcblxuICAgICAgYXNzZXJ0KGNvbHVtbkhlYWRlci50aXRsZS50ZXh0LnNpZ25hbCwgXCJ0aW1lRm9ybWF0KHBhcmVudFtcXFwieWVhcl9kYXRlXFxcIl0sICclWScpXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2FwcGxpZXMgbnVtYmVyIGZvcm1hdCBmb3IgZmllbGRyZWYgb2YgYSBxdWFudGl0YXRpdmUgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIGZvcm1hdDogJ2QnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG4gICAgICBjb25zdCBoZWFkZXJNYXJrcyA9IG1vZGVsLmFzc2VtYmxlSGVhZGVyTWFya3MoKTtcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlciA9IGhlYWRlck1hcmtzLmZpbHRlcihkID0+IHtcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gXCJjb2x1bW5faGVhZGVyXCI7XG4gICAgICB9KVswXTtcblxuICAgICAgYXNzZXJ0KGNvbHVtbkhlYWRlci50aXRsZS50ZXh0LnNpZ25hbCwgXCJmb3JtYXQocGFyZW50W1xcXCJhXFxcIl0sICdkJylcIik7XG4gICAgfSk7XG5cbiAgICBpdCgnaWdub3JlcyBudW1iZXIgZm9ybWF0IGZvciBmaWVsZHJlZiBvZiBhIGJpbm5lZCBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtiaW46IHRydWUsIGZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG4gICAgICBjb25zdCBoZWFkZXJNYXJrcyA9IG1vZGVsLmFzc2VtYmxlSGVhZGVyTWFya3MoKTtcbiAgICAgIGNvbnN0IGNvbHVtbkhlYWRlciA9IGhlYWRlck1hcmtzLmZpbHRlcihkID0+IHtcbiAgICAgICAgcmV0dXJuIGQubmFtZSA9PT0gXCJjb2x1bW5faGVhZGVyXCI7XG4gICAgICB9KVswXTtcblxuICAgICAgYXNzZXJ0KGNvbHVtbkhlYWRlci50aXRsZS50ZXh0LnNpZ25hbCwgXCJwYXJlbnRbXFxcImFcXFwiXVwiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgc2V0IHNjYWxlIGNvbXBvbmVudCBmb3IgYSBtb2RlbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIGFzc2VydChtb2RlbC5jb21wb25lbnQuc2NhbGVzWyd4J10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgaW5kZXBlbmRlbnQgc2NhbGVzIGlmIHJlc29sdmUgaXMgc2V0IHRvIGluZGVwZW5kZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgICB4OiAnaW5kZXBlbmRlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0KCFtb2RlbC5jb21wb25lbnQuc2NhbGVzWyd4J10pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVIZWFkZXJNYXJrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNvcnQgaGVhZGVycyBpbiBhc2NlbmRpbmcgb3JkZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIGZvcm1hdDogJ2QnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICAgIGNvbnN0IGhlYWRlck1hcmtzID0gbW9kZWwuYXNzZW1ibGVIZWFkZXJNYXJrcygpO1xuICAgICAgY29uc3QgY29sdW1uSGVhZGVyID0gaGVhZGVyTWFya3MuZmlsdGVyKGQgPT4ge1xuICAgICAgICByZXR1cm4gZC5uYW1lID09PSBcImNvbHVtbl9oZWFkZXJcIjtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbHVtbkhlYWRlci5zb3J0LCB7ZmllbGQ6ICdkYXR1bVtcImFcIl0nLCBvcmRlcjogJ2FzY2VuZGluZyd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlR3JvdXAnLCAoKSA9PiB7XG4gICAgaXQoJ2luY2x1ZGVzIGEgY29sdW1ucyBmaWVsZHMgaW4gdGhlIGVuY29kZSBibG9jayBmb3IgZmFjZXQgd2l0aCBjb2x1bW4gdGhhdCBwYXJlbnQgaXMgYWxzbyBhIGZhY2V0LicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIFwiYW55XCIgb25jZSB3ZSBzdXBwb3J0IGFsbCBmYWNldCBsaXN0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzYwXG4gICAgICB9IGFzIGFueSk7XG4gICAgICBtb2RlbC5wYXJzZURhdGEoKTtcbiAgICAgIGNvbnN0IGdyb3VwID0gbW9kZWwuY2hpbGQuYXNzZW1ibGVHcm91cChbXSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdyb3VwLmVuY29kZS51cGRhdGUuY29sdW1ucywge2ZpZWxkOiAnZGlzdGluY3RfYyd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlTGF5b3V0JywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGEgbGF5b3V0IHdpdGggYSBjb2x1bW4gc2lnbmFsIGZvciBmYWNldCB3aXRoIGNvbHVtbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGF5b3V0ID0gbW9kZWwuYXNzZW1ibGVMYXlvdXQoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdMYXlvdXQ+KGxheW91dCwge1xuICAgICAgICBwYWRkaW5nOiB7cm93OiAxMCwgY29sdW1uOiAxMH0sXG4gICAgICAgIG9mZnNldDogMTAsXG4gICAgICAgIGNvbHVtbnM6IHtcbiAgICAgICAgICBzaWduYWw6IFwibGVuZ3RoKGRhdGEoJ2NvbHVtbl9kb21haW4nKSlcIlxuICAgICAgICB9LFxuICAgICAgICBib3VuZHM6ICdmdWxsJyxcbiAgICAgICAgYWxpZ246ICdhbGwnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgbGF5b3V0IHdpdGhvdXQgYSBjb2x1bW4gc2lnbmFsIGZvciBmYWNldCB3aXRoIGNvbHVtbiB0aGF0IHBhcmVudCBpcyBhbHNvIGEgZmFjZXQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgXCJhbnlcIiBvbmNlIHdlIHN1cHBvcnQgYWxsIGZhY2V0IGxpc3RlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NjBcbiAgICAgIH0gYXMgYW55KTtcbiAgICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmNoaWxkLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxheW91dC5jb2x1bW5zLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgYSBsYXlvdXQgd2l0aCBoZWFkZXIgYmFuZCBpZiBjaGlsZCBzcGVjIGlzIGFsc28gYSBmYWNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCIkc2NoZW1hXCI6IFwiaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb25cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgICBcImZhY2V0XCI6IHtcInJvd1wiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgICBcInNwZWNcIjoge1xuICAgICAgICAgIFwiZmFjZXRcIjoge1wicm93XCI6IHtcImZpZWxkXCI6IFwiQ3lsaW5kZXJzXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifX0sXG4gICAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBcImFueVwiIG9uY2Ugd2Ugc3VwcG9ydCBhbGwgZmFjZXQgbGlzdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc2MFxuICAgICAgfSBhcyBhbnkpO1xuICAgICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcbiAgICAgIGNvbnN0IGxheW91dCA9IG1vZGVsLmFzc2VtYmxlTGF5b3V0KCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxheW91dC5oZWFkZXJCYW5kLCB7cm93OiAwLjV9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlTWFya3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhZGQgY3Jvc3MgYW5kIHNvcnQgaWYgd2UgZmFjZXQgYnkgbXVsdGlwbGUgZGltZW5zaW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsOiBGYWNldE1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcblxuICAgICAgY29uc3QgbWFya3MgPSBtb2RlbC5hc3NlbWJsZU1hcmtzKCk7XG5cbiAgICAgIGFzc2VydChtYXJrc1swXS5mcm9tLmZhY2V0LmFnZ3JlZ2F0ZS5jcm9zcyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtzWzBdLnNvcnQsIHtcbiAgICAgICAgZmllbGQ6IFtcbiAgICAgICAgICAnZGF0dW1bXCJhXCJdJyxcbiAgICAgICAgICAnZGF0dW1bXCJiXCJdJ1xuICAgICAgICBdLFxuICAgICAgICBvcmRlcjogW1xuICAgICAgICAgICdhc2NlbmRpbmcnLFxuICAgICAgICAgICdhc2NlbmRpbmcnXG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgY2FsY3VsYXRlIGNhcmRpbmFsaXR5IGZvciBpbmRlcGVuZGVudCBzY2FsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbDogRmFjZXRNb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3JlY3QnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ25vbWluYWwnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgIHg6ICdpbmRlcGVuZGVudCcsXG4gICAgICAgICAgICB5OiAnaW5kZXBlbmRlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAgIGNvbnN0IG1hcmtzID0gbW9kZWwuYXNzZW1ibGVNYXJrcygpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtzWzBdLmZyb20uZmFjZXQuYWdncmVnYXRlLCB7XG4gICAgICAgIGZpZWxkczogWydiJywgJ2MnXSxcbiAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0JywgJ2Rpc3RpbmN0J11cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgY2FsY3VsYXRlIGNhcmRpbmFsaXR5IGZvciBjaGlsZCBjb2x1bW4gZmFjZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbDogRmFjZXRNb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBcImFueVwiIG9uY2Ugd2Ugc3VwcG9ydCBhbGwgZmFjZXQgbGlzdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc2MFxuICAgICAgfSBhcyBhbnkpO1xuICAgICAgbW9kZWwucGFyc2UoKTtcblxuICAgICAgY29uc3QgbWFya3MgPSBtb2RlbC5hc3NlbWJsZU1hcmtzKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya3NbMF0uZnJvbS5mYWNldC5hZ2dyZWdhdGUsIHtcbiAgICAgICAgZmllbGRzOiBbJ2MnXSxcbiAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19