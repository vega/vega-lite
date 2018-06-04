"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../src/channel");
var log = tslib_1.__importStar(require("../../src/log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL3VuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIsNkNBQW1EO0FBRW5ELHlEQUFxQztBQUNyQyx1Q0FBbUM7QUFDbkMsdUNBQTRDO0FBQzVDLGdDQUF1QztBQUV2QyxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQzFFLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQzFDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM5QyxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFLLEVBQUUsVUFBRyxDQUFDLENBQUMsQ0FBQztRQUNsRixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRU4sRUFBRSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1lBQ3RFLElBQU0sTUFBTSxHQUFHLHFCQUFjLENBQUM7Z0JBQzVCLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRTtvQkFDUixFQUFFLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUMzQjthQUNLLENBQUMsQ0FBQyxDQUFDLHdFQUF3RTtZQUNuRixhQUFNLENB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LElBQUksRUFBRSxTQUFTLEVBQUM7aUJBQ2pDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0RFVEFJTCwgU0hBUEUsIFh9IGZyb20gJy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge0JBUn0gZnJvbSAnLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3NyYy90eXBlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnVW5pdE1vZGVsJywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdpbml0RW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkcm9wIHVuc3VwcG9ydGVkIGNoYW5uZWwgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBzaGFwZToge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5lbmNvZGluZy5zaGFwZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKFNIQVBFLCBCQVIpKTtcbiAgICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgZHJvcCBpbnZhbGlkIGNoYW5uZWwgYW5kIHRocm93cyB3YXJuaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICAgIGNvbnN0IF9tb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgX3k6IHt0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0gYXMgYW55KTsgLy8gVG8gbWFrZSBwYXJzZVVuaXRNb2RlbCBhY2NlcHQgdGhlIG1vZGVsIHdpdGggaW52YWxpZCBlbmNvZGluZyBjaGFubmVsXG4gICAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuaW52YWxpZEVuY29kaW5nQ2hhbm5lbCgnX3knKSk7XG4gICAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgY2hhbm5lbCB3aXRob3V0IGZpZWxkIGFuZCB2YWx1ZSBhbmQgdGhyb3dzIHdhcm5pbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHt0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobW9kZWwuZW5jb2RpbmcueCwgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5lbXB0eUZpZWxkRGVmKHt0eXBlOiBRVUFOVElUQVRJVkV9LCBYKSk7XG4gICAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgYSBmaWVsZERlZiB3aXRob3V0IGZpZWxkIGFuZCB2YWx1ZSBmcm9tIHRoZSBjaGFubmVsIGRlZiBsaXN0IGFuZCB0aHJvd3Mgd2FybmluZycsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgZGV0YWlsOiBbXG4gICAgICAgICAgICAgIHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICAgICB7dHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxGaWVsZERlZjxzdHJpbmc+IHwgRmllbGREZWY8c3RyaW5nPltdPihtb2RlbC5lbmNvZGluZy5kZXRhaWwsIFtcbiAgICAgICAgICB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICBdKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5lbXB0eUZpZWxkRGVmKHt0eXBlOiBRVUFOVElUQVRJVkV9LCBERVRBSUwpKTtcbiAgICAgIH0pKTtcblxuICB9KTtcblxuICBkZXNjcmliZSgnaW5pdEF4ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgaW5jbHVkZSBwcm9wZXJ0aWVzIG9mIG5vbi1WbE9ubHlBeGlzQ29uZmlnIGluIGNvbmZpZy5heGlzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7YXhpczoge2RvbWFpbldpZHRoOiAxMjN9fVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5heGlzKFgpWydkb21haW5XaWR0aCddLCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IHNob3VsZCBoYXZlIGF4aXMub2Zmc2V0ID0gZW5jb2RlLnguYXhpcy5vZmZzZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBheGlzOiB7b2Zmc2V0OiAzNDV9fSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmF4aXMoWCkub2Zmc2V0LCAzNDUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19