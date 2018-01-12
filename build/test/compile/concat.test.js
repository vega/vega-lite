"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var util_1 = require("../util");
describe('Concat', function () {
    describe('merge scale domains', function () {
        it('should instantiate all children in vconcat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            chai_1.assert(model.isVConcat);
        });
        it('should instantiate all children in hconcat', function () {
            var model = util_1.parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            chai_1.assert(!model.isVConcat);
        });
        it('should create correct layout for vconcat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            chai_1.assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                offset: 10,
                columns: 1,
                bounds: 'full',
                align: 'each'
            });
        });
        it('should create correct layout for hconcat', function () {
            var model = util_1.parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            chai_1.assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                offset: 10,
                bounds: 'full',
                align: 'each'
            });
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            util_1.parseConcatModel({
                hconcat: [],
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            chai_1.assert.equal(localLogger.warns[0], log.message.CONCAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29uY2F0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsbUNBQXFDO0FBRXJDLGdDQUF5QztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzs0QkFDaEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLHVCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3lCQUNqQztxQkFDRixFQUFDO3dCQUNBLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7NEJBQ2hDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzt5QkFDdEM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsYUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLElBQU0sS0FBSyxHQUFHLHVCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUUsRUFDVDtxQkFDRixFQUFDO3dCQUNBLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEsRUFBRSxFQUNUO3FCQUNGLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFXLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDakQsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUM5QixNQUFNLEVBQUUsRUFBRTtnQkFDVixPQUFPLEVBQUUsQ0FBQztnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsTUFBTTthQUNkLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLElBQU0sS0FBSyxHQUFHLHVCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUUsRUFDVDtxQkFDRixFQUFDO3dCQUNBLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEsRUFBRSxFQUNUO3FCQUNGLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFXLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDakQsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUM5QixNQUFNLEVBQUUsRUFBRTtnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsTUFBTTthQUNkLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztZQUMzQyx1QkFBZ0IsQ0FBQztnQkFDZixPQUFPLEVBQUUsRUFBRTtnQkFDWCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFO3dCQUNKLENBQUMsRUFBRSxRQUFRO3FCQUNaO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7VmdMYXlvdXR9IGZyb20gJy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlQ29uY2F0TW9kZWx9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnQ29uY2F0JywgKCkgPT4ge1xuICBkZXNjcmliZSgnbWVyZ2Ugc2NhbGUgZG9tYWlucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluc3RhbnRpYXRlIGFsbCBjaGlsZHJlbiBpbiB2Y29uY2F0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgICAgdmNvbmNhdDogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY2hpbGRyZW4ubGVuZ3RoLCAyKTtcbiAgICAgIGFzc2VydChtb2RlbC5pc1ZDb25jYXQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbnN0YW50aWF0ZSBhbGwgY2hpbGRyZW4gaW4gaGNvbmNhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICAgIGhjb25jYXQ6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0se1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCwgMik7XG4gICAgICBhc3NlcnQoIW1vZGVsLmlzVkNvbmNhdCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBjb3JyZWN0IGxheW91dCBmb3IgdmNvbmNhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICAgIHZjb25jYXQ6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0xheW91dD4obW9kZWwuYXNzZW1ibGVMYXlvdXQoKSwge1xuICAgICAgICBwYWRkaW5nOiB7cm93OiAxMCwgY29sdW1uOiAxMH0sXG4gICAgICAgIG9mZnNldDogMTAsXG4gICAgICAgIGNvbHVtbnM6IDEsXG4gICAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgICBhbGlnbjogJ2VhY2gnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIGNvcnJlY3QgbGF5b3V0IGZvciBoY29uY2F0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgICAgaGNvbmNhdDogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgfVxuICAgICAgICB9LHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTGF5b3V0Pihtb2RlbC5hc3NlbWJsZUxheW91dCgpLCB7XG4gICAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgICAgb2Zmc2V0OiAxMCxcbiAgICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICAgIGFsaWduOiAnZWFjaCdcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVzb2x2ZScsICgpID0+IHtcbiAgICBpdCgnY2Fubm90IHNoYXJlIGF4ZXMnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIHBhcnNlQ29uY2F0TW9kZWwoe1xuICAgICAgICBoY29uY2F0OiBbXSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIGF4aXM6IHtcbiAgICAgICAgICAgIHg6ICdzaGFyZWQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuQ09OQ0FUX0NBTk5PVF9TSEFSRV9BWElTKTtcbiAgICB9KSk7XG4gIH0pO1xufSk7XG4iXX0=