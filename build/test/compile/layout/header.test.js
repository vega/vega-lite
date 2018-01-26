"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var header_1 = require("../../../src/compile/layout/header");
var util_1 = require("../../util");
describe('compile/layout/header', function () {
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
            var marks = columnLabelGroup.marks, columnTitleGroupTopLevelProps = __rest(columnLabelGroup, ["marks"]);
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
            var marks = rowTitleGroup.marks, rowTitleGroupTopLevelProps = __rest(rowTitleGroup, ["marks"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGF5b3V0L2hlYWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBQzVCLDZEQUFrRjtBQUVsRixtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO1lBQzVCLEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztnQkFDckQsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUM7YUFDMUQ7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUzQixJQUFNLGVBQWUsR0FBRyx3QkFBZSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFNLGtCQUFrQixHQUFHLHdCQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVELEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZ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LEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixhQUFNLENBQUMsU0FBUyxDQUFjLFFBQVEsRUFBRTtvQkFDdEMsSUFBSSxFQUFFLE1BQU07b0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLE1BQU0sRUFBRTt3QkFDTixNQUFNLEVBQUU7NEJBQ04sSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQzs0QkFDbEIsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQzs0QkFDbkIsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQzt5QkFDekI7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2dldEhlYWRlckdyb3VwcywgZ2V0VGl0bGVHcm91cH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge1ZnTWFya0dyb3VwfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sYXlvdXQvaGVhZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZ2V0SGVhZGVyR3JvdXBzJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgIGZhY2V0OiB7XG4gICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDogJ2FzY2VuZGluZyd9LFxuICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNvcnQ6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBjb25zdCByb3dIZWFkZXJHcm91cHMgPSBnZXRIZWFkZXJHcm91cHMobW9kZWwsICdyb3cnKTtcbiAgICBjb25zdCBjb2x1bW5IZWFkZXJHcm91cHMgPSBnZXRIZWFkZXJHcm91cHMobW9kZWwsICdjb2x1bW4nKTtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBwcm9jZXNzIHNvcnQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocm93SGVhZGVyR3JvdXBzWzBdLnNvcnQub3JkZXIsICdhc2NlbmRpbmcnKTtcbiAgICAgIGFzc2VydC5lcXVhbChjb2x1bW5IZWFkZXJHcm91cHNbMF0uc29ydC5vcmRlciwgJ2Rlc2NlbmRpbmcnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFRpdGxlR3JvdXAnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgZmFjZXQ6IHtcbiAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcbiAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGRlc2NyaWJlKCdmb3IgY29sdW1uJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uTGFiZWxHcm91cCA9IGdldFRpdGxlR3JvdXAobW9kZWwsICdjb2x1bW4nKTtcbiAgICAgIGNvbnN0IHttYXJrcywgLi4uY29sdW1uVGl0bGVHcm91cFRvcExldmVsUHJvcHN9ID0gY29sdW1uTGFiZWxHcm91cDtcbiAgICAgIGl0KCdyZXR1cm5zIGEgaGVhZGVyIGdyb3VwIG1hcmsgd2l0aCBjb3JyZWN0IG5hbWUsIHJvbGUsIHR5cGUsIGFuZCBmcm9tLicsICgpID0+IHtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbHVtblRpdGxlR3JvdXBUb3BMZXZlbFByb3BzLCB7XG4gICAgICAgICAgbmFtZTogJ2NvbHVtbl90aXRsZScsXG4gICAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgICByb2xlOiAnY29sdW1uLXRpdGxlJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGV4dE1hcmsgPSBtYXJrc1swXTtcblxuICAgICAgaXQoJ2NvbnRhaW5zIGEgY29ycmVjdCB0ZXh0IG1hcmsgd2l0aCB0aGUgY29ycmVjdCByb2xlIGFuZCBlbmNvZGUgYXMgdGhlIG9ubHkgaXRlbSBpbiBtYXJrcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtzLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdNYXJrR3JvdXA+KHRleHRNYXJrLCB7XG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIHJvbGU6ICdjb2x1bW4tdGl0bGUtdGV4dCcsXG4gICAgICAgICAgc3R5bGU6ICdndWlkZS10aXRsZScsXG4gICAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgdGV4dDoge3ZhbHVlOiAnYSd9LFxuICAgICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIHJvdycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvd1RpdGxlR3JvdXAgPSBnZXRUaXRsZUdyb3VwKG1vZGVsLCAncm93Jyk7XG4gICAgICBjb25zdCB7bWFya3MsIC4uLnJvd1RpdGxlR3JvdXBUb3BMZXZlbFByb3BzfSA9IHJvd1RpdGxlR3JvdXA7XG4gICAgICBpdCgncmV0dXJucyBhIGhlYWRlciBncm91cCBtYXJrIHdpdGggY29ycmVjdCBuYW1lLCByb2xlLCB0eXBlLCBmcm9tLCBhbmQgZW5jb2RlLicsICgpID0+IHtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJvd1RpdGxlR3JvdXBUb3BMZXZlbFByb3BzLCB7XG4gICAgICAgICAgbmFtZTogJ3Jvd190aXRsZScsXG4gICAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgICByb2xlOiAncm93LXRpdGxlJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGV4dE1hcmsgPSBtYXJrc1swXTtcblxuICAgICAgaXQoJ2NvbnRhaW5zIGEgY29ycmVjdCB0ZXh0IG1hcmsgd2l0aCB0aGUgY29ycmVjdCByb2xlIGFuZCBlbmNvZGUgYXMgdGhlIG9ubHkgaXRlbSBpbiBtYXJrcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtzLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdNYXJrR3JvdXA+KHRleHRNYXJrLCB7XG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIHJvbGU6ICdyb3ctdGl0bGUtdGV4dCcsXG4gICAgICAgICAgc3R5bGU6ICdndWlkZS10aXRsZScsXG4gICAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgdGV4dDoge3ZhbHVlOiAnYSd9LFxuICAgICAgICAgICAgICBhbmdsZToge3ZhbHVlOiAyNzB9LFxuICAgICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=