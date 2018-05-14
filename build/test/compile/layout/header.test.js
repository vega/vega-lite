import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { getHeaderGroups, getTitleGroup, labelAlign, labelBaseline } from '../../../src/compile/layout/header';
import { parseFacetModel } from '../../util';
describe('compile/layout/header', function () {
    describe('label aligns correctly according to angle', function () {
        assert.deepEqual(labelAlign(23), { align: { value: 'right' } });
        assert.deepEqual(labelAlign(135), { align: { value: 'left' } });
        assert.deepEqual(labelAlign(50), { align: { value: 'right' } });
    });
    describe('label baseline adjusted according to angle', function () {
        assert.deepEqual(labelBaseline(10), {});
        assert.deepEqual(labelBaseline(90), { baseline: { value: 'top' } });
    });
    describe('getHeaderGroups', function () {
        var model = parseFacetModel({
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
        var rowHeaderGroups = getHeaderGroups(model, 'row');
        var columnHeaderGroups = getHeaderGroups(model, 'column');
        it('should correctly process sort', function () {
            assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
            assert.equal(columnHeaderGroups[0].sort.order, 'descending');
        });
    });
    describe('getTitleGroup', function () {
        var model = parseFacetModel({
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
            var columnLabelGroup = getTitleGroup(model, 'column');
            var marks = columnLabelGroup.marks, columnTitleGroupTopLevelProps = tslib_1.__rest(columnLabelGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, and from.', function () {
                assert.deepEqual(columnTitleGroupTopLevelProps, {
                    name: 'column_title',
                    type: 'group',
                    role: 'column-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                assert.equal(marks.length, 1);
                assert.deepEqual(textMark, {
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
            var rowTitleGroup = getTitleGroup(model, 'row');
            var marks = rowTitleGroup.marks, rowTitleGroupTopLevelProps = tslib_1.__rest(rowTitleGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, from, and encode.', function () {
                assert.deepEqual(rowTitleGroupTopLevelProps, {
                    name: 'row_title',
                    type: 'group',
                    role: 'row-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                assert.equal(marks.length, 1);
                assert.deepEqual(textMark, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGF5b3V0L2hlYWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUU3RyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTNDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsMkNBQTJDLEVBQUU7UUFDcEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxFQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsNENBQTRDLEVBQUU7UUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUMsQ0FB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R0FBRyxFQUFDOzRCQUNsQixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDOzRCQUNuQixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDO3lCQUN6QjtxQkFDRjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Z2V0SGVhZGVyR3JvdXBzLCBnZXRUaXRsZUdyb3VwLCBsYWJlbEFsaWduLCBsYWJlbEJhc2VsaW5lfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7VmdNYXJrR3JvdXB9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xheW91dC9oZWFkZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdsYWJlbCBhbGlnbnMgY29ycmVjdGx5IGFjY29yZGluZyB0byBhbmdsZScsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQWxpZ24oMjMpLCB7YWxpZ246IHt2YWx1ZTogJ3JpZ2h0J319KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQWxpZ24oMTM1KSwge2FsaWduOiB7dmFsdWU6ICdsZWZ0J319KTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQWxpZ24oNTApLCB7YWxpZ246IHt2YWx1ZTogJ3JpZ2h0J319KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xhYmVsIGJhc2VsaW5lIGFkanVzdGVkIGFjY29yZGluZyB0byBhbmdsZScsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQmFzZWxpbmUoMTApLCB7fSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDkwKSwge2Jhc2VsaW5lOiB7dmFsdWU6ICd0b3AnfX0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZ2V0SGVhZGVyR3JvdXBzJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgIGZhY2V0OiB7XG4gICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDogJ2FzY2VuZGluZyd9LFxuICAgICAgICBjb2x1bW46IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNvcnQ6ICdkZXNjZW5kaW5nJ31cbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBjb25zdCByb3dIZWFkZXJHcm91cHMgPSBnZXRIZWFkZXJHcm91cHMobW9kZWwsICdyb3cnKTtcbiAgICBjb25zdCBjb2x1bW5IZWFkZXJHcm91cHMgPSBnZXRIZWFkZXJHcm91cHMobW9kZWwsICdjb2x1bW4nKTtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBwcm9jZXNzIHNvcnQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwocm93SGVhZGVyR3JvdXBzWzBdLnNvcnQub3JkZXIsICdhc2NlbmRpbmcnKTtcbiAgICAgIGFzc2VydC5lcXVhbChjb2x1bW5IZWFkZXJHcm91cHNbMF0uc29ydC5vcmRlciwgJ2Rlc2NlbmRpbmcnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFRpdGxlR3JvdXAnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgZmFjZXQ6IHtcbiAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcbiAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgIGRlc2NyaWJlKCdmb3IgY29sdW1uJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uTGFiZWxHcm91cCA9IGdldFRpdGxlR3JvdXAobW9kZWwsICdjb2x1bW4nKTtcbiAgICAgIGNvbnN0IHttYXJrcywgLi4uY29sdW1uVGl0bGVHcm91cFRvcExldmVsUHJvcHN9ID0gY29sdW1uTGFiZWxHcm91cDtcbiAgICAgIGl0KCdyZXR1cm5zIGEgaGVhZGVyIGdyb3VwIG1hcmsgd2l0aCBjb3JyZWN0IG5hbWUsIHJvbGUsIHR5cGUsIGFuZCBmcm9tLicsICgpID0+IHtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGNvbHVtblRpdGxlR3JvdXBUb3BMZXZlbFByb3BzLCB7XG4gICAgICAgICAgbmFtZTogJ2NvbHVtbl90aXRsZScsXG4gICAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgICByb2xlOiAnY29sdW1uLXRpdGxlJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGV4dE1hcmsgPSBtYXJrc1swXTtcblxuICAgICAgaXQoJ2NvbnRhaW5zIGEgY29ycmVjdCB0ZXh0IG1hcmsgd2l0aCB0aGUgY29ycmVjdCByb2xlIGFuZCBlbmNvZGUgYXMgdGhlIG9ubHkgaXRlbSBpbiBtYXJrcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtzLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdNYXJrR3JvdXA+KHRleHRNYXJrLCB7XG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIHJvbGU6ICdjb2x1bW4tdGl0bGUtdGV4dCcsXG4gICAgICAgICAgc3R5bGU6ICdndWlkZS10aXRsZScsXG4gICAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgdGV4dDoge3ZhbHVlOiAnYSd9LFxuICAgICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZm9yIHJvdycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJvd1RpdGxlR3JvdXAgPSBnZXRUaXRsZUdyb3VwKG1vZGVsLCAncm93Jyk7XG4gICAgICBjb25zdCB7bWFya3MsIC4uLnJvd1RpdGxlR3JvdXBUb3BMZXZlbFByb3BzfSA9IHJvd1RpdGxlR3JvdXA7XG4gICAgICBpdCgncmV0dXJucyBhIGhlYWRlciBncm91cCBtYXJrIHdpdGggY29ycmVjdCBuYW1lLCByb2xlLCB0eXBlLCBmcm9tLCBhbmQgZW5jb2RlLicsICgpID0+IHtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJvd1RpdGxlR3JvdXBUb3BMZXZlbFByb3BzLCB7XG4gICAgICAgICAgbmFtZTogJ3Jvd190aXRsZScsXG4gICAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgICByb2xlOiAncm93LXRpdGxlJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdGV4dE1hcmsgPSBtYXJrc1swXTtcblxuICAgICAgaXQoJ2NvbnRhaW5zIGEgY29ycmVjdCB0ZXh0IG1hcmsgd2l0aCB0aGUgY29ycmVjdCByb2xlIGFuZCBlbmNvZGUgYXMgdGhlIG9ubHkgaXRlbSBpbiBtYXJrcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtzLmxlbmd0aCwgMSk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdNYXJrR3JvdXA+KHRleHRNYXJrLCB7XG4gICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgIHJvbGU6ICdyb3ctdGl0bGUtdGV4dCcsXG4gICAgICAgICAgc3R5bGU6ICdndWlkZS10aXRsZScsXG4gICAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgICB1cGRhdGU6IHtcbiAgICAgICAgICAgICAgdGV4dDoge3ZhbHVlOiAnYSd9LFxuICAgICAgICAgICAgICBhbmdsZToge3ZhbHVlOiAyNzB9LFxuICAgICAgICAgICAgICBhbGlnbjoge3ZhbHVlOiAnY2VudGVyJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=