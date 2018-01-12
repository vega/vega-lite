"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var log = require("../../src/log");
var mark_1 = require("../../src/mark");
var type_1 = require("../../src/type");
var util_1 = require("../util");
describe('UnitModel', function () {
    describe('initEncoding', function () {
        it('should drop unsupported channel and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    shape: { field: 'a', type: 'quantitative' }
                }
            });
            chai_1.assert.equal(model.encoding.shape, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.incompatibleChannel(channel_1.SHAPE, mark_1.BAR));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { type: 'quantitative' }
                }
            });
            chai_1.assert.equal(model.encoding.x, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.X));
        }));
        it('should drop a fieldDef without field and value from the channel def list and throws warning', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    detail: [
                        { field: 'a', type: 'ordinal' },
                        { type: 'quantitative' }
                    ]
                }
            });
            chai_1.assert.deepEqual(model.encoding.detail, [
                { field: 'a', type: 'ordinal' }
            ]);
            chai_1.assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: type_1.QUANTITATIVE }, channel_1.DETAIL));
        }));
    });
    describe('initAxes', function () {
        it('should not include properties of non-VlOnlyAxisConfig in config.axis', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { axis: { domainWidth: 123 } }
            });
            chai_1.assert.equal(model.axis(channel_1.X)['domainWidth'], undefined);
        });
        it('it should have axis.offset = encode.x.axis.offset', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', axis: { offset: 345 } },
                    y: { field: 'b', type: 'ordinal' }
                }
            });
            chai_1.assert.equal(model.axis(channel_1.X).offset, 345);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3VuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw2Q0FBbUQ7QUFFbkQsbUNBQXFDO0FBQ3JDLHVDQUFtQztBQUNuQyx1Q0FBNEM7QUFDNUMsZ0NBQXVDO0FBRXZDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDMUUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUM7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGVBQUssRUFBRSxVQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTixFQUFFLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDdEYsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsbUJBQVksRUFBQyxFQUFFLFdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekYsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVOLEVBQUUsQ0FBQyw2RkFBNkYsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUNuSCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFO3dCQUNOLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3dCQUM3QixFQUFDLElBQUksRUFBRSxjQUFjLEVBQUM7cUJBQ3ZCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLFNBQVMsQ0FBd0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQzdFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2FBQzlCLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxtQkFBWSxFQUFDLEVBQUUsZ0JBQU0sQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVSLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztvQkFDaEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNqQztnQkFDRCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxXQUFXLEVBQUUsR0FBRyxFQUFDLEVBQUM7YUFDbkMsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFO1lBQ3RELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxFQUFDO29CQUNyRCxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ2pDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0RFVEFJTCwgU0hBUEUsIFh9IGZyb20gJy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge0JBUn0gZnJvbSAnLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3NyYy90eXBlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnVW5pdE1vZGVsJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdpbml0RW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkcm9wIHVuc3VwcG9ydGVkIGNoYW5uZWwgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBzaGFwZToge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5lbmNvZGluZy5zaGFwZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKFNIQVBFLCBCQVIpKTtcbiAgICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBjaGFubmVsIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge3R5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5lbmNvZGluZy54LCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5RmllbGREZWYoe3R5cGU6IFFVQU5USVRBVElWRX0sIFgpKTtcbiAgICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBhIGZpZWxkRGVmIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGZyb20gdGhlIGNoYW5uZWwgZGVmIGxpc3QgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBkZXRhaWw6IFtcbiAgICAgICAgICAgICAge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgICAgIHt0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPEZpZWxkRGVmPHN0cmluZz4gfCBGaWVsZERlZjxzdHJpbmc+W10+KG1vZGVsLmVuY29kaW5nLmRldGFpbCwgW1xuICAgICAgICAgIHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIF0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5RmllbGREZWYoe3R5cGU6IFFVQU5USVRBVElWRX0sIERFVEFJTCkpO1xuICAgICAgfSkpO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbml0QXhlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIHByb3BlcnRpZXMgb2Ygbm9uLVZsT25seUF4aXNDb25maWcgaW4gY29uZmlnLmF4aXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtheGlzOiB7ZG9tYWluV2lkdGg6IDEyM319XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmF4aXMoWClbJ2RvbWFpbldpZHRoJ10sIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXQgc2hvdWxkIGhhdmUgYXhpcy5vZmZzZXQgPSBlbmNvZGUueC5heGlzLm9mZnNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIGF4aXM6IHtvZmZzZXQ6IDM0NX19LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuYXhpcyhYKS5vZmZzZXQsIDM0NSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=