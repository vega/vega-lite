/* tslint:disable quotemark */
import { assert } from 'chai';
import { ROW, SHAPE } from '../../src/channel';
import * as log from '../../src/log';
import { ORDINAL } from '../../src/type';
import { parseFacetModel, parseFacetModelWithScale } from '../util';
describe('FacetModel', function () {
    describe('initFacet', function () {
        it('should drop unsupported channel and throws warning', log.wrap(function (localLogger) {
            var model = parseFacetModel({
                facet: ({
                    shape: { field: 'a', type: 'quantitative' }
                }),
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            assert.equal(model.facet['shape'], undefined);
            assert.equal(localLogger.warns[0], log.message.incompatibleChannel(SHAPE, 'facet'));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = parseFacetModel({
                facet: {
                    row: { type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            assert.equal(model.facet.row, undefined);
            assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: ORDINAL }, ROW));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'quantitative' }
                },
                spec: {
                    mark: 'point',
                    encoding: {}
                }
            });
            assert.deepEqual(model.facet.row, { field: 'a', type: 'quantitative' });
            assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(ROW));
        }));
    });
    describe('parseAxisAndHeader', function () {
        // TODO: add more tests
        // - correctly join title for nested facet
        // - correctly generate headers with right labels and axes
        it('applies text format to the fieldref of a temporal field', function () {
            var model = parseFacetModelWithScale({
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
            assert(columnHeader.title.text.signal, "timeFormat(parent[\"year_date\"], '%Y')");
        });
        it('applies number format for fieldref of a quantitative field', function () {
            var model = parseFacetModelWithScale({
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
            assert(columnHeader.title.text.signal, "format(parent[\"a\"], 'd')");
        });
        it('ignores number format for fieldref of a binned field', function () {
            var model = parseFacetModelWithScale({
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
            assert(columnHeader.title.text.signal, "parent[\"a\"]");
        });
    });
    describe('parseScale', function () {
        it('should correctly set scale component for a model', function () {
            var model = parseFacetModelWithScale({
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
            assert(model.component.scales['x']);
        });
        it('should create independent scales if resolve is set to independent', function () {
            var model = parseFacetModelWithScale({
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
            assert(!model.component.scales['x']);
        });
    });
    describe('assembleHeaderMarks', function () {
        it('should sort headers in ascending order', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(columnHeader.sort, { field: 'datum["a"]', order: 'ascending' });
        });
    });
    describe('assembleGroup', function () {
        it('includes a columns fields in the encode block for facet with column that parent is also a facet.', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(group.encode.update.columns, { field: 'distinct_c' });
        });
    });
    describe('assembleLayout', function () {
        it('returns a layout with a column signal for facet with column', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(layout, {
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
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(layout.columns, undefined);
        });
        it('returns a layout with header band if child spec is also a facet', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(layout.headerBand, { row: 0.5 });
        });
    });
    describe('assembleMarks', function () {
        it('should add cross and sort if we facet by multiple dimensions', function () {
            var model = parseFacetModelWithScale({
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
            assert(marks[0].from.facet.aggregate.cross);
            assert.deepEqual(marks[0].sort, {
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
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(marks[0].from.facet.aggregate, {
                fields: ['b', 'c'],
                ops: ['distinct', 'distinct']
            });
        });
        it('should add calculate cardinality for child column facet', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(marks[0].from.facet.aggregate, {
                fields: ['c'],
                ops: ['distinct']
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9mYWNldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFJN0MsT0FBTyxLQUFLLEdBQUcsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXZDLE9BQU8sRUFBQyxlQUFlLEVBQUUsd0JBQXdCLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFbEUsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNyQixRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUM1RSxJQUFNLEtBQUssR0FBRyxlQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO29CQUNOLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUMsQ0FBeUI7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsRUFBRTtpQkFDYjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQyxD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O3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7eUJBQ3RDO3FCQUNGO2lCQUNGO2dCQUNELHVHQUF1RzthQUNqRyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFZCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFcEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7Z0JBQzlDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQztnQkFDYixHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Uk9XLCBTSEFQRX0gZnJvbSAnLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtGYWNldE1vZGVsfSBmcm9tICcuLi8uLi9zcmMvY29tcGlsZS9mYWNldCc7XG5pbXBvcnQge0ZhY2V0TWFwcGluZ30gZnJvbSAnLi4vLi4vc3JjL2ZhY2V0JztcbmltcG9ydCB7UG9zaXRpb25GaWVsZERlZn0gZnJvbSAnLi4vLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7T1JESU5BTH0gZnJvbSAnLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtWZ0xheW91dH0gZnJvbSAnLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VGYWNldE1vZGVsLCBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnRmFjZXRNb2RlbCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnaW5pdEZhY2V0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZHJvcCB1bnN1cHBvcnRlZCBjaGFubmVsIGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDogKHtcbiAgICAgICAgICBzaGFwZToge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9KSBhcyBGYWNldE1hcHBpbmc8c3RyaW5nPiwgLy8gQ2FzdCB0byBhbGxvdyBpbnZhbGlkIGZhY2V0IHR5cGUgZm9yIHRlc3RcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmZhY2V0WydzaGFwZSddLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKFNIQVBFLCAnZmFjZXQnKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGNoYW5uZWwgd2l0aG91dCBmaWVsZCBhbmQgdmFsdWUgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7dHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZmFjZXQucm93LCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5lbXB0eUZpZWxkRGVmKHt0eXBlOiBPUkRJTkFMfSwgUk9XKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGNoYW5uZWwgd2l0aG91dCBmaWVsZCBhbmQgdmFsdWUgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8UG9zaXRpb25GaWVsZERlZjxzdHJpbmc+Pihtb2RlbC5mYWNldC5yb3csIHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5mYWNldENoYW5uZWxTaG91bGRCZURpc2NyZXRlKFJPVykpO1xuICAgIH0pKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlQXhpc0FuZEhlYWRlcicsICgpID0+IHtcbiAgICAvLyBUT0RPOiBhZGQgbW9yZSB0ZXN0c1xuICAgIC8vIC0gY29ycmVjdGx5IGpvaW4gdGl0bGUgZm9yIG5lc3RlZCBmYWNldFxuICAgIC8vIC0gY29ycmVjdGx5IGdlbmVyYXRlIGhlYWRlcnMgd2l0aCByaWdodCBsYWJlbHMgYW5kIGF4ZXNcblxuXG4gICAgaXQoJ2FwcGxpZXMgdGV4dCBmb3JtYXQgdG8gdGhlIGZpZWxkcmVmIG9mIGEgdGVtcG9yYWwgZmllbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7dGltZVVuaXQ6J3llYXInLCBmaWVsZDogJ2RhdGUnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcbiAgICAgIGNvbnN0IGhlYWRlck1hcmtzID0gbW9kZWwuYXNzZW1ibGVIZWFkZXJNYXJrcygpO1xuICAgICAgY29uc3QgY29sdW1uSGVhZGVyID0gaGVhZGVyTWFya3MuZmlsdGVyKGQgPT4ge1xuICAgICAgICByZXR1cm4gZC5uYW1lID09PSBcImNvbHVtbl9oZWFkZXJcIjtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBhc3NlcnQoY29sdW1uSGVhZGVyLnRpdGxlLnRleHQuc2lnbmFsLCBcInRpbWVGb3JtYXQocGFyZW50W1xcXCJ5ZWFyX2RhdGVcXFwiXSwgJyVZJylcIik7XG4gICAgfSk7XG5cbiAgICBpdCgnYXBwbGllcyBudW1iZXIgZm9ybWF0IGZvciBmaWVsZHJlZiBvZiBhIHF1YW50aXRhdGl2ZSBmaWVsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgZm9ybWF0OiAnZCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcbiAgICAgIGNvbnN0IGhlYWRlck1hcmtzID0gbW9kZWwuYXNzZW1ibGVIZWFkZXJNYXJrcygpO1xuICAgICAgY29uc3QgY29sdW1uSGVhZGVyID0gaGVhZGVyTWFya3MuZmlsdGVyKGQgPT4ge1xuICAgICAgICByZXR1cm4gZC5uYW1lID09PSBcImNvbHVtbl9oZWFkZXJcIjtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBhc3NlcnQoY29sdW1uSGVhZGVyLnRpdGxlLnRleHQuc2lnbmFsLCBcImZvcm1hdChwYXJlbnRbXFxcImFcXFwiXSwgJ2QnKVwiKTtcbiAgICB9KTtcblxuICAgIGl0KCdpZ25vcmVzIG51bWJlciBmb3JtYXQgZm9yIGZpZWxkcmVmIG9mIGEgYmlubmVkIGZpZWxkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2JpbjogdHJ1ZSwgZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcbiAgICAgIGNvbnN0IGhlYWRlck1hcmtzID0gbW9kZWwuYXNzZW1ibGVIZWFkZXJNYXJrcygpO1xuICAgICAgY29uc3QgY29sdW1uSGVhZGVyID0gaGVhZGVyTWFya3MuZmlsdGVyKGQgPT4ge1xuICAgICAgICByZXR1cm4gZC5uYW1lID09PSBcImNvbHVtbl9oZWFkZXJcIjtcbiAgICAgIH0pWzBdO1xuXG4gICAgICBhc3NlcnQoY29sdW1uSGVhZGVyLnRpdGxlLnRleHQuc2lnbmFsLCBcInBhcmVudFtcXFwiYVxcXCJdXCIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFyc2VTY2FsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBzZXQgc2NhbGUgY29tcG9uZW50IGZvciBhIG1vZGVsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgYXNzZXJ0KG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbJ3gnXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBpbmRlcGVuZGVudCBzY2FsZXMgaWYgcmVzb2x2ZSBpcyBzZXQgdG8gaW5kZXBlbmRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgIHg6ICdpbmRlcGVuZGVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQoIW1vZGVsLmNvbXBvbmVudC5zY2FsZXNbJ3gnXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZUhlYWRlck1hcmtzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc29ydCBoZWFkZXJzIGluIGFzY2VuZGluZyBvcmRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgZm9ybWF0OiAnZCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgICAgY29uc3QgaGVhZGVyTWFya3MgPSBtb2RlbC5hc3NlbWJsZUhlYWRlck1hcmtzKCk7XG4gICAgICBjb25zdCBjb2x1bW5IZWFkZXIgPSBoZWFkZXJNYXJrcy5maWx0ZXIoZCA9PiB7XG4gICAgICAgIHJldHVybiBkLm5hbWUgPT09IFwiY29sdW1uX2hlYWRlclwiO1xuICAgICAgfSlbMF07XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sdW1uSGVhZGVyLnNvcnQsIHtmaWVsZDogJ2RhdHVtW1wiYVwiXScsIG9yZGVyOiAnYXNjZW5kaW5nJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVHcm91cCcsICgpID0+IHtcbiAgICBpdCgnaW5jbHVkZXMgYSBjb2x1bW5zIGZpZWxkcyBpbiB0aGUgZW5jb2RlIGJsb2NrIGZvciBmYWNldCB3aXRoIGNvbHVtbiB0aGF0IHBhcmVudCBpcyBhbHNvIGEgZmFjZXQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgXCJhbnlcIiBvbmNlIHdlIHN1cHBvcnQgYWxsIGZhY2V0IGxpc3RlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI3NjBcbiAgICAgIH0gYXMgYW55KTtcbiAgICAgIG1vZGVsLnBhcnNlRGF0YSgpO1xuICAgICAgY29uc3QgZ3JvdXAgPSBtb2RlbC5jaGlsZC5hc3NlbWJsZUdyb3VwKFtdKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZ3JvdXAuZW5jb2RlLnVwZGF0ZS5jb2x1bW5zLCB7ZmllbGQ6ICdkaXN0aW5jdF9jJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVMYXlvdXQnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgYSBsYXlvdXQgd2l0aCBhIGNvbHVtbiBzaWduYWwgZm9yIGZhY2V0IHdpdGggY29sdW1uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBsYXlvdXQgPSBtb2RlbC5hc3NlbWJsZUxheW91dCgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0xheW91dD4obGF5b3V0LCB7XG4gICAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgICAgb2Zmc2V0OiAxMCxcbiAgICAgICAgY29sdW1uczoge1xuICAgICAgICAgIHNpZ25hbDogXCJsZW5ndGgoZGF0YSgnY29sdW1uX2RvbWFpbicpKVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgICBhbGlnbjogJ2FsbCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JldHVybnMgYSBsYXlvdXQgd2l0aG91dCBhIGNvbHVtbiBzaWduYWwgZm9yIGZhY2V0IHdpdGggY29sdW1uIHRoYXQgcGFyZW50IGlzIGFsc28gYSBmYWNldC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHNwZWM6IHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBcImFueVwiIG9uY2Ugd2Ugc3VwcG9ydCBhbGwgZmFjZXQgbGlzdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc2MFxuICAgICAgfSBhcyBhbnkpO1xuICAgICAgY29uc3QgbGF5b3V0ID0gbW9kZWwuY2hpbGQuYXNzZW1ibGVMYXlvdXQoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGF5b3V0LmNvbHVtbnMsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBhIGxheW91dCB3aXRoIGhlYWRlciBiYW5kIGlmIGNoaWxkIHNwZWMgaXMgYWxzbyBhIGZhY2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBcIiRzY2hlbWFcIjogXCJodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvblwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICAgIFwiZmFjZXRcIjoge1wicm93XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifX0sXG4gICAgICAgIFwic3BlY1wiOiB7XG4gICAgICAgICAgXCJmYWNldFwiOiB7XCJyb3dcIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgICAgICBcInNwZWNcIjoge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIFwiYW55XCIgb25jZSB3ZSBzdXBwb3J0IGFsbCBmYWNldCBsaXN0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzYwXG4gICAgICB9IGFzIGFueSk7XG4gICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuICAgICAgY29uc3QgbGF5b3V0ID0gbW9kZWwuYXNzZW1ibGVMYXlvdXQoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGF5b3V0LmhlYWRlckJhbmQsIHtyb3c6IDAuNX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVNYXJrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFkZCBjcm9zcyBhbmQgc29ydCBpZiB3ZSBmYWNldCBieSBtdWx0aXBsZSBkaW1lbnNpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWw6IEZhY2V0TW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgICBjb25zdCBtYXJrcyA9IG1vZGVsLmFzc2VtYmxlTWFya3MoKTtcblxuICAgICAgYXNzZXJ0KG1hcmtzWzBdLmZyb20uZmFjZXQuYWdncmVnYXRlLmNyb3NzKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya3NbMF0uc29ydCwge1xuICAgICAgICBmaWVsZDogW1xuICAgICAgICAgICdkYXR1bVtcImFcIl0nLFxuICAgICAgICAgICdkYXR1bVtcImJcIl0nXG4gICAgICAgIF0sXG4gICAgICAgIG9yZGVyOiBbXG4gICAgICAgICAgJ2FzY2VuZGluZycsXG4gICAgICAgICAgJ2FzY2VuZGluZydcbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBjYWxjdWxhdGUgY2FyZGluYWxpdHkgZm9yIGluZGVwZW5kZW50IHNjYWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsOiBGYWNldE1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncmVjdCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgeDogJ2luZGVwZW5kZW50JyxcbiAgICAgICAgICAgIHk6ICdpbmRlcGVuZGVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcblxuICAgICAgY29uc3QgbWFya3MgPSBtb2RlbC5hc3NlbWJsZU1hcmtzKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobWFya3NbMF0uZnJvbS5mYWNldC5hZ2dyZWdhdGUsIHtcbiAgICAgICAgZmllbGRzOiBbJ2InLCAnYyddLFxuICAgICAgICBvcHM6IFsnZGlzdGluY3QnLCAnZGlzdGluY3QnXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBjYWxjdWxhdGUgY2FyZGluYWxpdHkgZm9yIGNoaWxkIGNvbHVtbiBmYWNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsOiBGYWNldE1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIFwiYW55XCIgb25jZSB3ZSBzdXBwb3J0IGFsbCBmYWNldCBsaXN0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzYwXG4gICAgICB9IGFzIGFueSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgICBjb25zdCBtYXJrcyA9IG1vZGVsLmFzc2VtYmxlTWFya3MoKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtYXJrc1swXS5mcm9tLmZhY2V0LmFnZ3JlZ2F0ZSwge1xuICAgICAgICBmaWVsZHM6IFsnYyddLFxuICAgICAgICBvcHM6IFsnZGlzdGluY3QnXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=