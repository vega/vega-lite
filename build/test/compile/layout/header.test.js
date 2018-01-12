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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGF5b3V0L2hlYWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBQzVCLDZEQUFpRTtBQUVqRSxtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBTSxLQUFLLEdBQUcsc0JBQWUsQ0FBQztZQUM1QixLQUFLLEVBQUU7Z0JBQ0wsR0FBRyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2dCQUNsQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7YUFDdEM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQztvQkFDckMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2lCQUN0QzthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUUzQixRQUFRLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQU0sZ0JBQWdCLEdBQUcsc0JBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDakQsSUFBQSw4QkFBSyxFQUFFLG1FQUFnQyxDQUFxQjtZQUNuRSxFQUFFLENBQUMsc0VBQXNFLEVBQUU7Z0JBRXpFLGFBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLEVBQUU7b0JBQzlDLElBQUksRUFBRSxjQUFjO29CQUNwQixJQUFJLEVBQUUsT0FBTztvQkFDYixJQUFJLEVBQUUsY0FBYztpQkFDckIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUIsRUFBRSxDQUFDLHlGQUF5RixFQUFFO2dCQUM1RixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLGFBQU0sQ0FBQyxTQUFTLENBQWMsUUFBUSxFQUFFO29CQUN0QyxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsbUJBQW1CO29CQUN6QixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsTUFBTSxFQUFFO3dCQUNOLE1BQU0sRUFBRTs0QkFDTixJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDOzRCQUNsQixLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDO3lCQUN6QjtxQkFDRjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFNLGFBQWEsR0FBRyxzQkFBYSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxJQUFBLDJCQUFLLEVBQUUsNkRBQTZCLENBQWtCO1lBQzdELEVBQUUsQ0FBQyw4RUFBOEUsRUFBRTtnQkFFakYsYUFBTSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsRUFBRTtvQkFDM0MsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLElBQUksRUFBRSxPQUFPO29CQUNiLElBQUksRUFBRSxXQUFXO2lCQUNsQixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxQixFQUFFLENBQUMseUZBQXlGLEVBQUU7Z0JBQzVGLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDOUIsYUFBTSxDQUFDLFNBQVMsQ0FBYyxRQUFRLEVBQUU7b0JBQ3RDLElBQUksRUFBRSxNQUFNO29CQUNaLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLEtBQUssRUFBRSxhQUFhO29CQUNwQixNQUFNLEVBQUU7d0JBQ04sTUFBTSxFQUFFOzRCQUNOLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7NEJBQ2xCLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUM7NEJBQ25CLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUM7eUJBQ3pCO3FCQUNGO2lCQUNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtnZXRUaXRsZUdyb3VwfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7VmdNYXJrR3JvdXB9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2xheW91dC9oZWFkZXInLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZXRUaXRsZUdyb3VwJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgIGZhY2V0OiB7XG4gICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBkZXNjcmliZSgnZm9yIGNvbHVtbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbkxhYmVsR3JvdXAgPSBnZXRUaXRsZUdyb3VwKG1vZGVsLCAnY29sdW1uJyk7XG4gICAgICBjb25zdCB7bWFya3MsIC4uLmNvbHVtblRpdGxlR3JvdXBUb3BMZXZlbFByb3BzfSA9IGNvbHVtbkxhYmVsR3JvdXA7XG4gICAgICBpdCgncmV0dXJucyBhIGhlYWRlciBncm91cCBtYXJrIHdpdGggY29ycmVjdCBuYW1lLCByb2xlLCB0eXBlLCBhbmQgZnJvbS4nLCAoKSA9PiB7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2x1bW5UaXRsZUdyb3VwVG9wTGV2ZWxQcm9wcywge1xuICAgICAgICAgIG5hbWU6ICdjb2x1bW5fdGl0bGUnLFxuICAgICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgICAgcm9sZTogJ2NvbHVtbi10aXRsZSdcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRleHRNYXJrID0gbWFya3NbMF07XG5cbiAgICAgIGl0KCdjb250YWlucyBhIGNvcnJlY3QgdGV4dCBtYXJrIHdpdGggdGhlIGNvcnJlY3Qgcm9sZSBhbmQgZW5jb2RlIGFzIHRoZSBvbmx5IGl0ZW0gaW4gbWFya3MnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTWFya0dyb3VwPih0ZXh0TWFyaywge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByb2xlOiAnY29sdW1uLXRpdGxlLXRleHQnLFxuICAgICAgICAgIHN0eWxlOiAnZ3VpZGUtdGl0bGUnLFxuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIHRleHQ6IHt2YWx1ZTogJ2EnfSxcbiAgICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciByb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCByb3dUaXRsZUdyb3VwID0gZ2V0VGl0bGVHcm91cChtb2RlbCwgJ3JvdycpO1xuICAgICAgY29uc3Qge21hcmtzLCAuLi5yb3dUaXRsZUdyb3VwVG9wTGV2ZWxQcm9wc30gPSByb3dUaXRsZUdyb3VwO1xuICAgICAgaXQoJ3JldHVybnMgYSBoZWFkZXIgZ3JvdXAgbWFyayB3aXRoIGNvcnJlY3QgbmFtZSwgcm9sZSwgdHlwZSwgZnJvbSwgYW5kIGVuY29kZS4nLCAoKSA9PiB7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyb3dUaXRsZUdyb3VwVG9wTGV2ZWxQcm9wcywge1xuICAgICAgICAgIG5hbWU6ICdyb3dfdGl0bGUnLFxuICAgICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgICAgcm9sZTogJ3Jvdy10aXRsZSdcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRleHRNYXJrID0gbWFya3NbMF07XG5cbiAgICAgIGl0KCdjb250YWlucyBhIGNvcnJlY3QgdGV4dCBtYXJrIHdpdGggdGhlIGNvcnJlY3Qgcm9sZSBhbmQgZW5jb2RlIGFzIHRoZSBvbmx5IGl0ZW0gaW4gbWFya3MnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTWFya0dyb3VwPih0ZXh0TWFyaywge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByb2xlOiAncm93LXRpdGxlLXRleHQnLFxuICAgICAgICAgIHN0eWxlOiAnZ3VpZGUtdGl0bGUnLFxuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIHRleHQ6IHt2YWx1ZTogJ2EnfSxcbiAgICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19