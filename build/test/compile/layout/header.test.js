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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvbGF5b3V0L2hlYWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBQzVCLDZEQUE2RztBQUU3RyxtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQywyQ0FBMkMsRUFBRTtRQUNwRCxhQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzVELGFBQU0sQ0FBQyxTQUFTLENBQUMsbUJBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDNUQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyw0Q0FBNEMsRUFBRTtRQUNyRCxhQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxFQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFNLEtBQUssR0FBRyxzQkFBZSxDQUFDO1lBQzVCLEtBQUssRUFBRTtnQkFDTCxHQUFHLEVBQUUsRUFB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QkFDekI7cUJBQ0Y7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2dldEhlYWRlckdyb3VwcywgZ2V0VGl0bGVHcm91cCwgbGFiZWxBbGlnbiwgbGFiZWxCYXNlbGluZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbGF5b3V0L2hlYWRlcic7XG5pbXBvcnQge1ZnTWFya0dyb3VwfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sYXlvdXQvaGVhZGVyJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbGFiZWwgYWxpZ25zIGNvcnJlY3RseSBhY2NvcmRpbmcgdG8gYW5nbGUnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEFsaWduKDIzKSwge2FsaWduOiB7dmFsdWU6ICdyaWdodCd9fSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEFsaWduKDEzNSksIHthbGlnbjoge3ZhbHVlOiAnbGVmdCd9fSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEFsaWduKDUwKSwge2FsaWduOiB7dmFsdWU6ICdyaWdodCd9fSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdsYWJlbCBiYXNlbGluZSBhZGp1c3RlZCBhY2NvcmRpbmcgdG8gYW5nbGUnLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDEwKSwge30pO1xuICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSg5MCksIHtiYXNlbGluZToge3ZhbHVlOiAndG9wJ319KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldEhlYWRlckdyb3VwcycsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICBmYWNldDoge1xuICAgICAgICByb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNvcnQ6ICdhc2NlbmRpbmcnfSxcbiAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBzb3J0OiAnZGVzY2VuZGluZyd9XG4gICAgICB9LFxuICAgICAgc3BlYzoge1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgY29uc3Qgcm93SGVhZGVyR3JvdXBzID0gZ2V0SGVhZGVyR3JvdXBzKG1vZGVsLCAncm93Jyk7XG4gICAgY29uc3QgY29sdW1uSGVhZGVyR3JvdXBzID0gZ2V0SGVhZGVyR3JvdXBzKG1vZGVsLCAnY29sdW1uJyk7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgcHJvY2VzcyBzb3J0JywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJvd0hlYWRlckdyb3Vwc1swXS5zb3J0Lm9yZGVyLCAnYXNjZW5kaW5nJyk7XG4gICAgICBhc3NlcnQuZXF1YWwoY29sdW1uSGVhZGVyR3JvdXBzWzBdLnNvcnQub3JkZXIsICdkZXNjZW5kaW5nJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRUaXRsZUdyb3VwJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgIGZhY2V0OiB7XG4gICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgIH0sXG4gICAgICBzcGVjOiB7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VMYXlvdXRTaXplKCk7XG4gICAgbW9kZWwucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG5cbiAgICBkZXNjcmliZSgnZm9yIGNvbHVtbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbkxhYmVsR3JvdXAgPSBnZXRUaXRsZUdyb3VwKG1vZGVsLCAnY29sdW1uJyk7XG4gICAgICBjb25zdCB7bWFya3MsIC4uLmNvbHVtblRpdGxlR3JvdXBUb3BMZXZlbFByb3BzfSA9IGNvbHVtbkxhYmVsR3JvdXA7XG4gICAgICBpdCgncmV0dXJucyBhIGhlYWRlciBncm91cCBtYXJrIHdpdGggY29ycmVjdCBuYW1lLCByb2xlLCB0eXBlLCBhbmQgZnJvbS4nLCAoKSA9PiB7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChjb2x1bW5UaXRsZUdyb3VwVG9wTGV2ZWxQcm9wcywge1xuICAgICAgICAgIG5hbWU6ICdjb2x1bW5fdGl0bGUnLFxuICAgICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgICAgcm9sZTogJ2NvbHVtbi10aXRsZSdcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRleHRNYXJrID0gbWFya3NbMF07XG5cbiAgICAgIGl0KCdjb250YWlucyBhIGNvcnJlY3QgdGV4dCBtYXJrIHdpdGggdGhlIGNvcnJlY3Qgcm9sZSBhbmQgZW5jb2RlIGFzIHRoZSBvbmx5IGl0ZW0gaW4gbWFya3MnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTWFya0dyb3VwPih0ZXh0TWFyaywge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByb2xlOiAnY29sdW1uLXRpdGxlLXRleHQnLFxuICAgICAgICAgIHN0eWxlOiAnZ3VpZGUtdGl0bGUnLFxuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIHRleHQ6IHt2YWx1ZTogJ2EnfSxcbiAgICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2ZvciByb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCByb3dUaXRsZUdyb3VwID0gZ2V0VGl0bGVHcm91cChtb2RlbCwgJ3JvdycpO1xuICAgICAgY29uc3Qge21hcmtzLCAuLi5yb3dUaXRsZUdyb3VwVG9wTGV2ZWxQcm9wc30gPSByb3dUaXRsZUdyb3VwO1xuICAgICAgaXQoJ3JldHVybnMgYSBoZWFkZXIgZ3JvdXAgbWFyayB3aXRoIGNvcnJlY3QgbmFtZSwgcm9sZSwgdHlwZSwgZnJvbSwgYW5kIGVuY29kZS4nLCAoKSA9PiB7XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyb3dUaXRsZUdyb3VwVG9wTGV2ZWxQcm9wcywge1xuICAgICAgICAgIG5hbWU6ICdyb3dfdGl0bGUnLFxuICAgICAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAgICAgcm9sZTogJ3Jvdy10aXRsZSdcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHRleHRNYXJrID0gbWFya3NbMF07XG5cbiAgICAgIGl0KCdjb250YWlucyBhIGNvcnJlY3QgdGV4dCBtYXJrIHdpdGggdGhlIGNvcnJlY3Qgcm9sZSBhbmQgZW5jb2RlIGFzIHRoZSBvbmx5IGl0ZW0gaW4gbWFya3MnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrcy5sZW5ndGgsIDEpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTWFya0dyb3VwPih0ZXh0TWFyaywge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByb2xlOiAncm93LXRpdGxlLXRleHQnLFxuICAgICAgICAgIHN0eWxlOiAnZ3VpZGUtdGl0bGUnLFxuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIHRleHQ6IHt2YWx1ZTogJ2EnfSxcbiAgICAgICAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgICAgICAgYWxpZ246IHt2YWx1ZTogJ2NlbnRlcid9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19