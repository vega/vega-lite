"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var header_1 = require("../../../src/compile/layout/header");
var util_1 = require("../../util");
describe('compile/layout/header', function () {
    describe('label aligns correctly according to angle', function () {
        chai_1.assert.deepEqual(header_1.labelAlign(23), { align: { value: 'right' } });
        chai_1.assert.deepEqual(header_1.labelAlign(135), { align: { value: 'left' } });
        chai_1.assert.deepEqual(header_1.labelAlign(50), { align: { value: 'right' } });
    });
    describe('label baseline adjusted according to angle', function () {
        chai_1.assert.deepEqual(header_1.labelBaseline(10), {});
        chai_1.assert.deepEqual(header_1.labelBaseline(90), { baseline: { value: 'top' } });
    });
    describe('getHeaderGroups', function () {
        var model = util_1.parseFacetModel({
            facet: {
                row: { field: 'a', type: 'ordinal', sort: 'ascending' },
                column: { field: 'a', type: 'ordinal', sort: 'descending' }
            },
            spec: {
                mark: 'point',
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' }
                }
            }
        });
        model.parseScale();
        model.parseLayoutSize();
        model.parseAxisAndHeader();
        var rowHeaderGroups = header_1.getHeaderGroups(model, 'row');
        var columnHeaderGroups = header_1.getHeaderGroups(model, 'column');
        it('should correctly process sort', function () {
            chai_1.assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
            chai_1.assert.equal(columnHeaderGroups[0].sort.order, 'descending');
        });
    });
    describe('getTitleGroup', function () {
        var model = util_1.parseFacetModel({
            facet: {
                row: { field: 'a', type: 'ordinal' },
                column: { field: 'a', type: 'ordinal' }
            },
            spec: {
                mark: 'point',
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' }
                }
            }
        });
        model.parseScale();
        model.parseLayoutSize();
        model.parseAxisAndHeader();
        describe('for column', function () {
            var columnLabelGroup = header_1.getTitleGroup(model, 'column');
            var marks = columnLabelGroup.marks, columnTitleGroupTopLevelProps = tslib_1.__rest(columnLabelGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, and from.', function () {
                chai_1.assert.deepEqual(columnTitleGroupTopLevelProps, {
                    name: 'column_title',
                    type: 'group',
                    role: 'column-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                chai_1.assert.equal(marks.length, 1);
                chai_1.assert.deepEqual(textMark, {
                    type: 'text',
                    role: 'column-title-text',
                    style: 'guide-title',
                    encode: {
                        update: {
                            text: { value: 'a' },
                            align: { value: 'center' }
                        }
                    }
                });
            });
        });
        describe('for row', function () {
            var rowTitleGroup = header_1.getTitleGroup(model, 'row');
            var marks = rowTitleGroup.marks, rowTitleGroupTopLevelProps = tslib_1.__rest(rowTitleGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, from, and encode.', function () {
                chai_1.assert.deepEqual(rowTitleGroupTopLevelProps, {
                    name: 'row_title',
                    type: 'group',
                    role: 'row-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                chai_1.assert.equal(marks.length, 1);
                chai_1.assert.deepEqual(textMark, {
                    type: 'text',
                    role: 'row-title-text',
                    style: 'guide-title',
                    encode: {
                        update: {
                            text: { value: 'a' },
                            angle: { value: 270 },
                            align: { value: 'center' }
                        }
                    }
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGF5b3V0L2hlYWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE0QjtBQUM1Qiw2REFBNkc7QUFFN0csbUNBQTJDO0FBRTNDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsMkNBQTJDLEVBQUU7UUFDcEQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFDLENBQUMsQ0FBQztRQUM1RCxhQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVELGFBQU0sQ0FBQyxTQUFTLENBQUMsbUJBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsNENBQTRDLEVBQUU7UUFDckQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLGFBQU0sQ0FBQyxTQUFTLENBQUMsc0JBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztZQUM1QixLQUFLLEVBQUU7Z0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxF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QUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtnZXRIZWFkZXJHcm91cHMsIGdldFRpdGxlR3JvdXAsIGxhYmVsQWxpZ24sIGxhYmVsQmFzZWxpbmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2xheW91dC9oZWFkZXInO1xuaW1wb3J0IHtWZ01hcmtHcm91cH0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VGYWNldE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvbGF5b3V0L2hlYWRlcicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2xhYmVsIGFsaWducyBjb3JyZWN0bHkgYWNjb3JkaW5nIHRvIGFuZ2xlJywgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxBbGlnbigyMyksIHthbGlnbjoge3ZhbHVlOiAncmlnaHQnfX0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxBbGlnbigxMzUpLCB7YWxpZ246IHt2YWx1ZTogJ2xlZnQnfX0pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxBbGlnbig1MCksIHthbGlnbjoge3ZhbHVlOiAncmlnaHQnfX0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbGFiZWwgYmFzZWxpbmUgYWRqdXN0ZWQgYWNjb3JkaW5nIHRvIGFuZ2xlJywgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgxMCksIHt9KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQmFzZWxpbmUoOTApLCB7YmFzZWxpbmU6IHt2YWx1ZTogJ3RvcCd9fSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRIZWFkZXJHcm91cHMnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgZmFjZXQ6IHtcbiAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBzb3J0OiAnYXNjZW5kaW5nJ30sXG4gICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDogJ2Rlc2NlbmRpbmcnfVxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcbiAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGNvbnN0IHJvd0hlYWRlckdyb3VwcyA9IGdldEhlYWRlckdyb3Vwcyhtb2RlbCwgJ3JvdycpO1xuICAgIGNvbnN0IGNvbHVtbkhlYWRlckdyb3VwcyA9IGdldEhlYWRlckdyb3Vwcyhtb2RlbCwgJ2NvbHVtbicpO1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IHByb2Nlc3Mgc29ydCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChyb3dIZWFkZXJHcm91cHNbMF0uc29ydC5vcmRlciwgJ2FzY2VuZGluZycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGNvbHVtbkhlYWRlckdyb3Vwc1swXS5zb3J0Lm9yZGVyLCAnZGVzY2VuZGluZycpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0VGl0bGVHcm91cCcsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICBmYWNldDoge1xuICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICB9LFxuICAgICAgc3BlYzoge1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciBjb2x1bW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2x1bW5MYWJlbEdyb3VwID0gZ2V0VGl0bGVHcm91cChtb2RlbCwgJ2NvbHVtbicpO1xuICAgICAgY29uc3Qge21hcmtzLCAuLi5jb2x1bW5UaXRsZUdyb3VwVG9wTGV2ZWxQcm9wc30gPSBjb2x1bW5MYWJlbEdyb3VwO1xuICAgICAgaXQoJ3JldHVybnMgYSBoZWFkZXIgZ3JvdXAgbWFyayB3aXRoIGNvcnJlY3QgbmFtZSwgcm9sZSwgdHlwZSwgYW5kIGZyb20uJywgKCkgPT4ge1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoY29sdW1uVGl0bGVHcm91cFRvcExldmVsUHJvcHMsIHtcbiAgICAgICAgICBuYW1lOiAnY29sdW1uX3RpdGxlJyxcbiAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICAgIHJvbGU6ICdjb2x1bW4tdGl0bGUnXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBjb25zdCB0ZXh0TWFyayA9IG1hcmtzWzBdO1xuXG4gICAgICBpdCgnY29udGFpbnMgYSBjb3JyZWN0IHRleHQgbWFyayB3aXRoIHRoZSBjb3JyZWN0IHJvbGUgYW5kIGVuY29kZSBhcyB0aGUgb25seSBpdGVtIGluIG1hcmtzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya3MubGVuZ3RoLCAxKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ01hcmtHcm91cD4odGV4dE1hcmssIHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgcm9sZTogJ2NvbHVtbi10aXRsZS10ZXh0JyxcbiAgICAgICAgICBzdHlsZTogJ2d1aWRlLXRpdGxlJyxcbiAgICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgICAgICB0ZXh0OiB7dmFsdWU6ICdhJ30sXG4gICAgICAgICAgICAgIGFsaWduOiB7dmFsdWU6ICdjZW50ZXInfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdmb3Igcm93JywgKCkgPT4ge1xuICAgICAgY29uc3Qgcm93VGl0bGVHcm91cCA9IGdldFRpdGxlR3JvdXAobW9kZWwsICdyb3cnKTtcbiAgICAgIGNvbnN0IHttYXJrcywgLi4ucm93VGl0bGVHcm91cFRvcExldmVsUHJvcHN9ID0gcm93VGl0bGVHcm91cDtcbiAgICAgIGl0KCdyZXR1cm5zIGEgaGVhZGVyIGdyb3VwIG1hcmsgd2l0aCBjb3JyZWN0IG5hbWUsIHJvbGUsIHR5cGUsIGZyb20sIGFuZCBlbmNvZGUuJywgKCkgPT4ge1xuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocm93VGl0bGVHcm91cFRvcExldmVsUHJvcHMsIHtcbiAgICAgICAgICBuYW1lOiAncm93X3RpdGxlJyxcbiAgICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICAgIHJvbGU6ICdyb3ctdGl0bGUnXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBjb25zdCB0ZXh0TWFyayA9IG1hcmtzWzBdO1xuXG4gICAgICBpdCgnY29udGFpbnMgYSBjb3JyZWN0IHRleHQgbWFyayB3aXRoIHRoZSBjb3JyZWN0IHJvbGUgYW5kIGVuY29kZSBhcyB0aGUgb25seSBpdGVtIGluIG1hcmtzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya3MubGVuZ3RoLCAxKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ01hcmtHcm91cD4odGV4dE1hcmssIHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgcm9sZTogJ3Jvdy10aXRsZS10ZXh0JyxcbiAgICAgICAgICBzdHlsZTogJ2d1aWRlLXRpdGxlJyxcbiAgICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgICAgICB0ZXh0OiB7dmFsdWU6ICdhJ30sXG4gICAgICAgICAgICAgIGFuZ2xlOiB7dmFsdWU6IDI3MH0sXG4gICAgICAgICAgICAgIGFsaWduOiB7dmFsdWU6ICdjZW50ZXInfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==