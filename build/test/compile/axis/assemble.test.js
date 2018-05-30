"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/axis/assemble");
var component_1 = require("../../../src/compile/axis/component");
var config_1 = require("../../../src/config");
describe('compile/axis/assemble', function () {
    describe('assembleAxis()', function () {
        it('outputs grid axis with only grid encode blocks', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                grid: true,
                encode: {
                    grid: { update: { stroke: { value: 'red' } } },
                    labels: { update: { fill: { value: 'red' } } }
                }
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'grid', config_1.defaultConfig);
            chai_1.assert.isUndefined(axis.encode.labels);
        });
        it('outputs grid axis with custom zindex', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                grid: true,
                zindex: 3
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'grid', config_1.defaultConfig);
            chai_1.assert.equal(axis.zindex, 3);
        });
        it('outputs main axis without grid encode blocks', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                encode: {
                    grid: { update: { stroke: { value: 'red' } } },
                    labels: { update: { fill: { value: 'red' } } }
                }
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'main', config_1.defaultConfig);
            chai_1.assert.isUndefined(axis.encode.grid);
        });
        it('correctly assemble title fieldDefs', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                title: [{ aggregate: 'max', field: 'a' }, { aggregate: 'min', field: 'b' }]
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'main', config_1.defaultConfig);
            chai_1.assert.equal(axis.title, 'Max of a, Min of b');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUNoRSxpRUFBa0U7QUFDbEUsOENBQWtEO0FBSWxELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sUUFBUSxHQUFHLElBQUkseUJBQWEsQ0FBQztnQkFDakMsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxFQUFDO29CQUN4QyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQUMsRUFBQztpQkFDekM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLElBQUksR0FBRyx1QkFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsc0JBQWEsQ0FBQyxDQUFDO1lBQzNELGFBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxJQUFNLFFBQVEsR0FBRyxJQUFJLHlCQUFhLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxJQUFJO2dCQUNWLE1BQU0sRUFBRSxDQUFDO2FBQ1YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHNCQUFhLENBQUMsQ0FBQztZQUMzRCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBYSxDQUFDO2dCQUNqQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxFQUFDLEVBQUM7b0JBQ3hDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxFQUFDO2lCQUN6QzthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sSUFBSSxHQUFHLHVCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxzQkFBYSxDQUFDLENBQUM7WUFDM0QsYUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO1lBQ3ZDLElBQU0sUUFBUSxHQUFHLElBQUkseUJBQWEsQ0FBQztnQkFDakMsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsS0FBSyxFQUFFLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDO2FBQ3hFLENBQUMsQ0FBQztZQUNILElBQU0sSUFBSSxHQUFHLHVCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxzQkFBYSxDQUFDLENBQUM7WUFDM0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXNzZW1ibGVBeGlzfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlJztcbmltcG9ydCB7QXhpc0NvbXBvbmVudH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9jb21wb25lbnQnO1xuaW1wb3J0IHtkZWZhdWx0Q29uZmlnfSBmcm9tICcuLi8uLi8uLi9zcmMvY29uZmlnJztcblxuXG5cbmRlc2NyaWJlKCdjb21waWxlL2F4aXMvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZUF4aXMoKScsICgpID0+IHtcbiAgICBpdCgnb3V0cHV0cyBncmlkIGF4aXMgd2l0aCBvbmx5IGdyaWQgZW5jb2RlIGJsb2NrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDbXB0ID0gbmV3IEF4aXNDb21wb25lbnQoe1xuICAgICAgICBvcmllbnQ6ICdsZWZ0JyxcbiAgICAgICAgZ3JpZDogdHJ1ZSxcbiAgICAgICAgZW5jb2RlOiB7XG4gICAgICAgICAgZ3JpZDoge3VwZGF0ZToge3N0cm9rZToge3ZhbHVlOiAncmVkJ319fSxcbiAgICAgICAgICBsYWJlbHM6IHt1cGRhdGU6IHtmaWxsOiB7dmFsdWU6ICdyZWQnfX19XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpcyA9IGFzc2VtYmxlQXhpcyhheGlzQ21wdCwgJ2dyaWQnLCBkZWZhdWx0Q29uZmlnKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChheGlzLmVuY29kZS5sYWJlbHMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ291dHB1dHMgZ3JpZCBheGlzIHdpdGggY3VzdG9tIHppbmRleCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDbXB0ID0gbmV3IEF4aXNDb21wb25lbnQoe1xuICAgICAgICBvcmllbnQ6ICdsZWZ0JyxcbiAgICAgICAgZ3JpZDogdHJ1ZSxcbiAgICAgICAgemluZGV4OiAzXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXMgPSBhc3NlbWJsZUF4aXMoYXhpc0NtcHQsICdncmlkJywgZGVmYXVsdENvbmZpZyk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpcy56aW5kZXgsIDMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ291dHB1dHMgbWFpbiBheGlzIHdpdGhvdXQgZ3JpZCBlbmNvZGUgYmxvY2tzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXhpc0NtcHQgPSBuZXcgQXhpc0NvbXBvbmVudCh7XG4gICAgICAgIG9yaWVudDogJ2xlZnQnLFxuICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICBncmlkOiB7dXBkYXRlOiB7c3Ryb2tlOiB7dmFsdWU6ICdyZWQnfX19LFxuICAgICAgICAgIGxhYmVsczoge3VwZGF0ZToge2ZpbGw6IHt2YWx1ZTogJ3JlZCd9fX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzID0gYXNzZW1ibGVBeGlzKGF4aXNDbXB0LCAnbWFpbicsIGRlZmF1bHRDb25maWcpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF4aXMuZW5jb2RlLmdyaWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBhc3NlbWJsZSB0aXRsZSBmaWVsZERlZnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ21wdCA9IG5ldyBBeGlzQ29tcG9uZW50KHtcbiAgICAgICAgb3JpZW50OiAnbGVmdCcsXG4gICAgICAgIHRpdGxlOiBbe2FnZ3JlZ2F0ZTogJ21heCcsIGZpZWxkOiAnYSd9LCB7YWdncmVnYXRlOiAnbWluJywgZmllbGQ6ICdiJ31dXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXMgPSBhc3NlbWJsZUF4aXMoYXhpc0NtcHQsICdtYWluJywgZGVmYXVsdENvbmZpZyk7XG4gICAgICBhc3NlcnQuZXF1YWwoYXhpcy50aXRsZSwgJ01heCBvZiBhLCBNaW4gb2YgYicpO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iXX0=