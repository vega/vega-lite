"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var repeater_1 = require("../../src/compile/repeater");
var log = tslib_1.__importStar(require("../../src/log"));
var util_1 = require("../../src/util");
var util_2 = require("../util");
describe('Repeat', function () {
    describe('resolveRepeat', function () {
        it('should resolve repeated fields', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                x: { field: 'foo', type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            });
        });
        it('should show warning if repeat in field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                y: { field: 'bar', type: 'quantitative' }
            });
        }));
        it('should support arrays fo field defs', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                detail: [
                    { field: { repeat: 'row' }, type: 'quantitative' },
                    { field: 'bar', type: 'quantitative' }
                ]
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                detail: [{ field: 'foo', type: 'quantitative' }, { field: 'bar', type: 'quantitative' }]
            });
        });
        it('should replace fields in sort', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                x: { field: 'bar', type: 'quantitative', sort: { field: { repeat: 'row' }, op: 'min' } }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                x: { field: 'bar', type: 'quantitative', sort: { field: 'foo', op: 'min' } }
            });
        });
        it('should replace fields in conditionals', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', field: 'foo', type: 'quantitative' },
                    value: 'red'
                }
            });
        });
        it('should replace fields in reveresed conditionals', function () {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { row: 'foo' });
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: 'foo', type: 'quantitative'
                }
            });
        });
        it('should show warning if repeat in conditional cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                color: { value: 'red' }
            });
        }));
        it('should show warning if repeat in a condition field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = repeater_1.replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { column: 'foo' });
            chai_1.assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            chai_1.assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' }
                }
            });
        }));
    });
    describe('initialize children', function () {
        it('should create a model per repeated value', function () {
            var model = util_2.parseRepeatModel({
                repeat: {
                    row: ['Acceleration', 'Horsepower']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' }
                    }
                }
            });
            chai_1.assert.equal(model.children.length, 2);
        });
        it('should create n*m models if row and column are specified', function () {
            var model = util_2.parseRepeatModel({
                repeat: {
                    row: ['Acceleration', 'Horsepower', 'Displacement'],
                    column: ['Origin', 'NumCylinders']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        y: { field: { repeat: 'column' }, type: 'ordinal' }
                    }
                }
            });
            chai_1.assert.equal(model.children.length, 6);
        });
        it('should union color scales and legends', function () {
            var model = util_2.parseRepeatModel({
                repeat: {
                    row: ['foo', 'bar'],
                    column: ['foo', 'bar']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' },
                        y: { field: { repeat: 'column' }, type: 'ordinal' },
                        color: { field: 'baz', type: 'nominal' }
                    }
                }
            });
            model.parseScale();
            var colorScale = model.component.scales['color'];
            chai_1.assert.deepEqual(colorScale.domains.length, 4);
            model.parseLegend();
            chai_1.assert.equal(util_1.keys(model.component.legends).length, 1);
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            util_2.parseRepeatModel({
                repeat: {},
                spec: {
                    mark: 'point',
                    encoding: {}
                },
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.REPEAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvcmVwZWF0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBRTVCLHVEQUFxRTtBQUVyRSx5REFBcUM7QUFDckMsdUNBQW9DO0FBQ3BDLGdDQUF5QztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1lBQ25DLElBQU0sUUFBUSxHQUFHLG9DQUF5QixDQUFDO2dCQUN6QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDakQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2FBQ3hDLEVBQUUsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUVqQixhQUFNLENBQUMsU0FBUyxDQUFtQixRQUFRLEVBQUU7Z0JBQzNDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDdkMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2FBQ3hDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQ3ZGLElBQU0sUUFBUSxHQUFHLG9DQUF5QixDQUFDO2dCQUN6QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztnQkFDakQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtB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ICdjaGFpJztcblxuaW1wb3J0IHtyZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nfSBmcm9tICcuLi8uLi9zcmMvY29tcGlsZS9yZXBlYXRlcic7XG5pbXBvcnQge0VuY29kaW5nfSBmcm9tICcuLi8uLi9zcmMvZW5jb2RpbmcnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge3BhcnNlUmVwZWF0TW9kZWx9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnUmVwZWF0JywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdyZXNvbHZlUmVwZWF0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVzb2x2ZSByZXBlYXRlZCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoe1xuICAgICAgICB4OiB7ZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICB5OiB7ZmllbGQ6ICdiYXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgIH0sIHtyb3c6ICdmb28nfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8RW5jb2Rpbmc8c3RyaW5nPj4ocmVzb2x2ZWQsIHtcbiAgICAgICAgeDoge2ZpZWxkOiAnZm9vJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICB5OiB7ZmllbGQ6ICdiYXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgaWYgcmVwZWF0IGluIGZpZWxkIGRlZiBjYW5ub3QgYmUgcmVzb2x2ZWQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyh7XG4gICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgIHk6IHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSwge2NvbHVtbjogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5ub1N1Y2hSZXBlYXRlZFZhbHVlKCdyb3cnKSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc29sdmVkLCB7XG4gICAgICAgIHk6IHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGFycmF5cyBmbyBmaWVsZCBkZWZzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgZGV0YWlsOiBbXG4gICAgICAgICAge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB7ZmllbGQ6ICdiYXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgXVxuICAgICAgfSwge3JvdzogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxFbmNvZGluZzxzdHJpbmc+PihyZXNvbHZlZCwge1xuICAgICAgICBkZXRhaWw6IFt7ZmllbGQ6ICdmb28nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sIHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfV1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIGZpZWxkcyBpbiBzb3J0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgeDoge2ZpZWxkOiAnYmFyJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIHNvcnQ6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCBvcDogJ21pbid9fVxuICAgICAgfSwge3JvdzogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxFbmNvZGluZzxzdHJpbmc+PihyZXNvbHZlZCwge1xuICAgICAgICB4OiB7ZmllbGQ6ICdiYXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgc29ydDoge2ZpZWxkOiAnZm9vJywgb3A6ICdtaW4nfX1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIGZpZWxkcyBpbiBjb25kaXRpb25hbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoe1xuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogJ3Rlc3QnLCBmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgdmFsdWU6ICdyZWQnXG4gICAgICAgIH1cbiAgICAgIH0sIHtyb3c6ICdmb28nfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8RW5jb2Rpbmc8c3RyaW5nPj4ocmVzb2x2ZWQsIHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgZmllbGQ6ICdmb28nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgdmFsdWU6ICdyZWQnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIGZpZWxkcyBpbiByZXZlcmVzZWQgY29uZGl0aW9uYWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgdmFsdWU6ICdyZWQnfSxcbiAgICAgICAgICBmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9XG4gICAgICB9LCB7cm93OiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPEVuY29kaW5nPHN0cmluZz4+KHJlc29sdmVkLCB7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAndGVzdCcsIHZhbHVlOiAncmVkJ30sXG4gICAgICAgICAgZmllbGQ6ICdmb28nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIGlmIHJlcGVhdCBpbiBjb25kaXRpb25hbCBjYW5ub3QgYmUgcmVzb2x2ZWQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyh7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAndGVzdCcsIGZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB2YWx1ZTogJ3JlZCdcbiAgICAgICAgfVxuICAgICAgfSwge2NvbHVtbjogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5ub1N1Y2hSZXBlYXRlZFZhbHVlKCdyb3cnKSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc29sdmVkLCB7XG4gICAgICAgIGNvbG9yOiB7dmFsdWU6ICdyZWQnfVxuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgaWYgcmVwZWF0IGluIGEgY29uZGl0aW9uIGZpZWxkIGRlZiBjYW5ub3QgYmUgcmVzb2x2ZWQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyh7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAndGVzdCcsIHZhbHVlOiAncmVkJ30sXG4gICAgICAgICAgZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgfVxuICAgICAgfSwge2NvbHVtbjogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5ub1N1Y2hSZXBlYXRlZFZhbHVlKCdyb3cnKSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlc29sdmVkLCB7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAndGVzdCcsIHZhbHVlOiAncmVkJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW5pdGlhbGl6ZSBjaGlsZHJlbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG1vZGVsIHBlciByZXBlYXRlZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VSZXBlYXRNb2RlbCh7XG4gICAgICAgIHJlcGVhdDoge1xuICAgICAgICAgIHJvdzogWydBY2NlbGVyYXRpb24nLCAnSG9yc2Vwb3dlciddXG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCwgMik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBuKm0gbW9kZWxzIGlmIHJvdyBhbmQgY29sdW1uIGFyZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlUmVwZWF0TW9kZWwoe1xuICAgICAgICByZXBlYXQ6IHtcbiAgICAgICAgICByb3c6IFsnQWNjZWxlcmF0aW9uJywgJ0hvcnNlcG93ZXInLCAnRGlzcGxhY2VtZW50J10sXG4gICAgICAgICAgY29sdW1uOiBbJ09yaWdpbicsICdOdW1DeWxpbmRlcnMnXVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDoge3JlcGVhdDogJ2NvbHVtbid9LCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCwgNik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVuaW9uIGNvbG9yIHNjYWxlcyBhbmQgbGVnZW5kcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VSZXBlYXRNb2RlbCh7XG4gICAgICAgIHJlcGVhdDoge1xuICAgICAgICAgIHJvdzogWydmb28nLCAnYmFyJ10sXG4gICAgICAgICAgY29sdW1uOiBbJ2ZvbycsICdiYXInXVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDoge3JlcGVhdDogJ2NvbHVtbid9LCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ2JheicsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBjb25zdCBjb2xvclNjYWxlID0gbW9kZWwuY29tcG9uZW50LnNjYWxlc1snY29sb3InXTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2xvclNjYWxlLmRvbWFpbnMubGVuZ3RoLCA0KTtcblxuICAgICAgbW9kZWwucGFyc2VMZWdlbmQoKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGtleXMobW9kZWwuY29tcG9uZW50LmxlZ2VuZHMpLmxlbmd0aCwgMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyZXNvbHZlJywgKCkgPT4ge1xuICAgIGl0KCdjYW5ub3Qgc2hhcmUgYXhlcycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgcGFyc2VSZXBlYXRNb2RlbCh7XG4gICAgICAgIHJlcGVhdDoge30sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgYXhpczoge1xuICAgICAgICAgICAgeDogJ3NoYXJlZCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5SRVBFQVRfQ0FOTk9UX1NIQVJFX0FYSVMpO1xuICAgIH0pKTtcbiAgfSk7XG59KTtcbiJdfQ==