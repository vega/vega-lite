import { assert } from 'chai';
import { replaceRepeaterInEncoding } from '../../src/compile/repeater';
import * as log from '../../src/log';
import { keys } from '../../src/util';
import { parseRepeatModel } from '../util';
describe('Repeat', function () {
    describe('resolveRepeat', function () {
        it('should resolve repeated fields', function () {
            var resolved = replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { row: 'foo' });
            assert.deepEqual(resolved, {
                x: { field: 'foo', type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            });
        });
        it('should show warning if repeat in field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = replaceRepeaterInEncoding({
                x: { field: { repeat: 'row' }, type: 'quantitative' },
                y: { field: 'bar', type: 'quantitative' }
            }, { column: 'foo' });
            assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            assert.deepEqual(resolved, {
                y: { field: 'bar', type: 'quantitative' }
            });
        }));
        it('should support arrays fo field defs', function () {
            var resolved = replaceRepeaterInEncoding({
                detail: [
                    { field: { repeat: 'row' }, type: 'quantitative' },
                    { field: 'bar', type: 'quantitative' }
                ]
            }, { row: 'foo' });
            assert.deepEqual(resolved, {
                detail: [{ field: 'foo', type: 'quantitative' }, { field: 'bar', type: 'quantitative' }]
            });
        });
        it('should replace fields in sort', function () {
            var resolved = replaceRepeaterInEncoding({
                x: { field: 'bar', type: 'quantitative', sort: { field: { repeat: 'row' }, op: 'min' } }
            }, { row: 'foo' });
            assert.deepEqual(resolved, {
                x: { field: 'bar', type: 'quantitative', sort: { field: 'foo', op: 'min' } }
            });
        });
        it('should replace fields in conditionals', function () {
            var resolved = replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { row: 'foo' });
            assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', field: 'foo', type: 'quantitative' },
                    value: 'red'
                }
            });
        });
        it('should replace fields in reveresed conditionals', function () {
            var resolved = replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { row: 'foo' });
            assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: 'foo', type: 'quantitative'
                }
            });
        });
        it('should show warning if repeat in conditional cannot be resolved', log.wrap(function (localLogger) {
            var resolved = replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', field: { repeat: 'row' }, type: 'quantitative' },
                    value: 'red'
                }
            }, { column: 'foo' });
            assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            assert.deepEqual(resolved, {
                color: { value: 'red' }
            });
        }));
        it('should show warning if repeat in a condition field def cannot be resolved', log.wrap(function (localLogger) {
            var resolved = replaceRepeaterInEncoding({
                color: {
                    condition: { selection: 'test', value: 'red' },
                    field: { repeat: 'row' }, type: 'quantitative'
                }
            }, { column: 'foo' });
            assert.equal(localLogger.warns[0], log.message.noSuchRepeatedValue('row'));
            assert.deepEqual(resolved, {
                color: {
                    condition: { selection: 'test', value: 'red' }
                }
            });
        }));
    });
    describe('initialize children', function () {
        it('should create a model per repeated value', function () {
            var model = parseRepeatModel({
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
            assert.equal(model.children.length, 2);
        });
        it('should create n*m models if row and column are specified', function () {
            var model = parseRepeatModel({
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
            assert.equal(model.children.length, 6);
        });
        it('should union color scales and legends', function () {
            var model = parseRepeatModel({
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
            assert.deepEqual(colorScale.domains.length, 4);
            model.parseLegend();
            assert.equal(keys(model.component.legends).length, 1);
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            parseRepeatModel({
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
            assert.equal(localLogger.warns[0], log.message.REPEAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvcmVwZWF0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUVyRSxPQUFPLEtBQUssR0FBRyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRXpDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxRQUFRLEdBQUcseUJBQXlCLENBQUM7Z0JBQ3pDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUNqRCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBRWpCLE1BQU0sQ0FBQyxTQUFTLENBQW1CLFFBQVEsRUFBRTtnQkFDM0MsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2dCQUN2QyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7YUFDeEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDdkYsSUFB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RyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge3JlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmd9IGZyb20gJy4uLy4uL3NyYy9jb21waWxlL3JlcGVhdGVyJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uLy4uL3NyYy9lbmNvZGluZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3NyYy91dGlsJztcbmltcG9ydCB7cGFyc2VSZXBlYXRNb2RlbH0gZnJvbSAnLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdSZXBlYXQnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3Jlc29sdmVSZXBlYXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXNvbHZlIHJlcGVhdGVkIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyh7XG4gICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgIHk6IHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSwge3JvdzogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxFbmNvZGluZzxzdHJpbmc+PihyZXNvbHZlZCwge1xuICAgICAgICB4OiB7ZmllbGQ6ICdmb28nLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgIHk6IHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgd2FybmluZyBpZiByZXBlYXQgaW4gZmllbGQgZGVmIGNhbm5vdCBiZSByZXNvbHZlZCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgeDoge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgeToge2ZpZWxkOiAnYmFyJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICB9LCB7Y29sdW1uOiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vU3VjaFJlcGVhdGVkVmFsdWUoJ3JvdycpKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzb2x2ZWQsIHtcbiAgICAgICAgeToge2ZpZWxkOiAnYmFyJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgYXJyYXlzIGZvIGZpZWxkIGRlZnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoe1xuICAgICAgICBkZXRhaWw6IFtcbiAgICAgICAgICB7ZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICBdXG4gICAgICB9LCB7cm93OiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPEVuY29kaW5nPHN0cmluZz4+KHJlc29sdmVkLCB7XG4gICAgICAgIGRldGFpbDogW3tmaWVsZDogJ2ZvbycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSwge2ZpZWxkOiAnYmFyJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgZmllbGRzIGluIHNvcnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoe1xuICAgICAgICB4OiB7ZmllbGQ6ICdiYXInLCB0eXBlOiAncXVhbnRpdGF0aXZlJywgc29ydDoge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIG9wOiAnbWluJ319XG4gICAgICB9LCB7cm93OiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPEVuY29kaW5nPHN0cmluZz4+KHJlc29sdmVkLCB7XG4gICAgICAgIHg6IHtmaWVsZDogJ2JhcicsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBzb3J0OiB7ZmllbGQ6ICdmb28nLCBvcDogJ21pbid9fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgZmllbGRzIGluIGNvbmRpdGlvbmFscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVwbGFjZVJlcGVhdGVySW5FbmNvZGluZyh7XG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgY29uZGl0aW9uOiB7c2VsZWN0aW9uOiAndGVzdCcsIGZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB2YWx1ZTogJ3JlZCdcbiAgICAgICAgfVxuICAgICAgfSwge3JvdzogJ2Zvbyd9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxFbmNvZGluZzxzdHJpbmc+PihyZXNvbHZlZCwge1xuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogJ3Rlc3QnLCBmaWVsZDogJ2ZvbycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB2YWx1ZTogJ3JlZCdcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgZmllbGRzIGluIHJldmVyZXNlZCBjb25kaXRpb25hbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXNvbHZlZCA9IHJlcGxhY2VSZXBlYXRlckluRW5jb2Rpbmcoe1xuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgIGNvbmRpdGlvbjoge3NlbGVjdGlvbjogJ3Rlc3QnLCB2YWx1ZTogJ3JlZCd9LFxuICAgICAgICAgIGZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH1cbiAgICAgIH0sIHtyb3c6ICdmb28nfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8RW5jb2Rpbmc8c3RyaW5nPj4ocmVzb2x2ZWQsIHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgdmFsdWU6ICdyZWQnfSxcbiAgICAgICAgICBmaWVsZDogJ2ZvbycsIHR5cGU6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgaWYgcmVwZWF0IGluIGNvbmRpdGlvbmFsIGNhbm5vdCBiZSByZXNvbHZlZCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIHZhbHVlOiAncmVkJ1xuICAgICAgICB9XG4gICAgICB9LCB7Y29sdW1uOiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vU3VjaFJlcGVhdGVkVmFsdWUoJ3JvdycpKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzb2x2ZWQsIHtcbiAgICAgICAgY29sb3I6IHt2YWx1ZTogJ3JlZCd9XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHNob3cgd2FybmluZyBpZiByZXBlYXQgaW4gYSBjb25kaXRpb24gZmllbGQgZGVmIGNhbm5vdCBiZSByZXNvbHZlZCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXBsYWNlUmVwZWF0ZXJJbkVuY29kaW5nKHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgdmFsdWU6ICdyZWQnfSxcbiAgICAgICAgICBmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ1xuICAgICAgICB9XG4gICAgICB9LCB7Y29sdW1uOiAnZm9vJ30pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLm5vU3VjaFJlcGVhdGVkVmFsdWUoJ3JvdycpKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVzb2x2ZWQsIHtcbiAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICBjb25kaXRpb246IHtzZWxlY3Rpb246ICd0ZXN0JywgdmFsdWU6ICdyZWQnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbml0aWFsaXplIGNoaWxkcmVuJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgbW9kZWwgcGVyIHJlcGVhdGVkIHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVJlcGVhdE1vZGVsKHtcbiAgICAgICAgcmVwZWF0OiB7XG4gICAgICAgICAgcm93OiBbJ0FjY2VsZXJhdGlvbicsICdIb3JzZXBvd2VyJ11cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY2hpbGRyZW4ubGVuZ3RoLCAyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIG4qbSBtb2RlbHMgaWYgcm93IGFuZCBjb2x1bW4gYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VSZXBlYXRNb2RlbCh7XG4gICAgICAgIHJlcGVhdDoge1xuICAgICAgICAgIHJvdzogWydBY2NlbGVyYXRpb24nLCAnSG9yc2Vwb3dlcicsICdEaXNwbGFjZW1lbnQnXSxcbiAgICAgICAgICBjb2x1bW46IFsnT3JpZ2luJywgJ051bUN5bGluZGVycyddXG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiB7cmVwZWF0OiAnY29sdW1uJ30sIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY2hpbGRyZW4ubGVuZ3RoLCA2KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdW5pb24gY29sb3Igc2NhbGVzIGFuZCBsZWdlbmRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVJlcGVhdE1vZGVsKHtcbiAgICAgICAgcmVwZWF0OiB7XG4gICAgICAgICAgcm93OiBbJ2ZvbycsICdiYXInXSxcbiAgICAgICAgICBjb2x1bW46IFsnZm9vJywgJ2JhciddXG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IHtyZXBlYXQ6ICdyb3cnfSwgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiB7cmVwZWF0OiAnY29sdW1uJ30sIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAnYmF6JywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIGNvbnN0IGNvbG9yU2NhbGUgPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzWydjb2xvciddO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbG9yU2NhbGUuZG9tYWlucy5sZW5ndGgsIDQpO1xuXG4gICAgICBtb2RlbC5wYXJzZUxlZ2VuZCgpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwoa2V5cyhtb2RlbC5jb21wb25lbnQubGVnZW5kcykubGVuZ3RoLCAxKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Jlc29sdmUnLCAoKSA9PiB7XG4gICAgaXQoJ2Nhbm5vdCBzaGFyZSBheGVzJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBwYXJzZVJlcGVhdE1vZGVsKHtcbiAgICAgICAgcmVwZWF0OiB7fSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBheGlzOiB7XG4gICAgICAgICAgICB4OiAnc2hhcmVkJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLlJFUEVBVF9DQU5OT1RfU0hBUkVfQVhJUyk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIl19