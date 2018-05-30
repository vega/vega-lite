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
        it('should drop invalid channel and throws warning', log.wrap(function (localLogger) {
            var _model = util_1.parseUnitModel({
                mark: 'bar',
                encoding: {
                    _y: { type: 'quantitative' }
                }
            }); // To make parseUnitModel accept the model with invalid encoding channel
            chai_1.assert.equal(localLogger.warns[0], log.message.invalidEncodingChannel('_y'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3VuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1Qiw2Q0FBbUQ7QUFFbkQsbUNBQXFDO0FBQ3JDLHVDQUFtQztBQUNuQyx1Q0FBNEM7QUFDNUMsZ0NBQXVDO0FBRXZDLFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDMUUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztpQkFDMUM7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLGVBQUssRUFBRSxVQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDdEUsSUFBTSxNQUFNLEdBQUcscUJBQWMsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzNCO2FBQ0ssQ0FBQyxDQUFDLENBQUMsd0VBQXdFO1lBQ25GLGFBQU0sQ0FB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SUFBSSxFQUFFLFNBQVMsRUFBQztpQkFDakM7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7REVUQUlMLCBTSEFQRSwgWH0gZnJvbSAnLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7QkFSfSBmcm9tICcuLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vc3JjL3R5cGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdVbml0TW9kZWwnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2luaXRFbmNvZGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbCBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHNoYXBlOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmVuY29kaW5nLnNoYXBlLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmluY29tcGF0aWJsZUNoYW5uZWwoU0hBUEUsIEJBUikpO1xuICAgICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGludmFsaWQgY2hhbm5lbCBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgX21vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBfeToge3R5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBhcyBhbnkpOyAvLyBUbyBtYWtlIHBhcnNlVW5pdE1vZGVsIGFjY2VwdCB0aGUgbW9kZWwgd2l0aCBpbnZhbGlkIGVuY29kaW5nIGNoYW5uZWxcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5pbnZhbGlkRW5jb2RpbmdDaGFubmVsKCdfeScpKTtcbiAgICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBjaGFubmVsIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge3R5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5lbmNvZGluZy54LCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5RmllbGREZWYoe3R5cGU6IFFVQU5USVRBVElWRX0sIFgpKTtcbiAgICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBhIGZpZWxkRGVmIHdpdGhvdXQgZmllbGQgYW5kIHZhbHVlIGZyb20gdGhlIGNoYW5uZWwgZGVmIGxpc3QgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBkZXRhaWw6IFtcbiAgICAgICAgICAgICAge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgICAgIHt0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPEZpZWxkRGVmPHN0cmluZz4gfCBGaWVsZERlZjxzdHJpbmc+W10+KG1vZGVsLmVuY29kaW5nLmRldGFpbCwgW1xuICAgICAgICAgIHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIF0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLmVtcHR5RmllbGREZWYoe3R5cGU6IFFVQU5USVRBVElWRX0sIERFVEFJTCkpO1xuICAgICAgfSkpO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbml0QXhlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIHByb3BlcnRpZXMgb2Ygbm9uLVZsT25seUF4aXNDb25maWcgaW4gY29uZmlnLmF4aXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHtheGlzOiB7ZG9tYWluV2lkdGg6IDEyM319XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmF4aXMoWClbJ2RvbWFpbldpZHRoJ10sIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXQgc2hvdWxkIGhhdmUgYXhpcy5vZmZzZXQgPSBlbmNvZGUueC5heGlzLm9mZnNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIGF4aXM6IHtvZmZzZXQ6IDM0NX19LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuYXhpcyhYKS5vZmZzZXQsIDM0NSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=