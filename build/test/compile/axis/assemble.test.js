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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLCtEQUFnRTtBQUNoRSxpRUFBa0U7QUFDbEUsOENBQWtEO0FBSWxELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sUUFBUSxHQUFHLElBQUkseUJBQWEsQ0FBQztnQkFDakMsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxFQUFDO29CQUN4QyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQUMsRUFBQztpQkFDekM7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLElBQUksR0FBRyx1QkFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsc0JBQWEsQ0FBQyxDQUFDO1lBQzNELGFBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxJQUFNLFFBQVEsR0FBRyxJQUFJLHlCQUFhLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLEVBQUMsRUFBQztvQkFDeEMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxFQUFDLEVBQUM7aUJBQ3pDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHNCQUFhLENBQUMsQ0FBQztZQUMzRCxhQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsSUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBYSxDQUFDO2dCQUNqQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxLQUFLLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFDLENBQUM7YUFDeEUsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxJQUFJLEdBQUcsdUJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHNCQUFhLENBQUMsQ0FBQztZQUMzRCxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHthc3NlbWJsZUF4aXN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvYXNzZW1ibGUnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50fSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2NvbXBvbmVudCc7XG5pbXBvcnQge2RlZmF1bHRDb25maWd9IGZyb20gJy4uLy4uLy4uL3NyYy9jb25maWcnO1xuXG5cblxuZGVzY3JpYmUoJ2NvbXBpbGUvYXhpcy9hc3NlbWJsZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlQXhpcygpJywgKCkgPT4ge1xuICAgIGl0KCdvdXRwdXRzIGdyaWQgYXhpcyB3aXRoIG9ubHkgZ3JpZCBlbmNvZGUgYmxvY2tzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXhpc0NtcHQgPSBuZXcgQXhpc0NvbXBvbmVudCh7XG4gICAgICAgIG9yaWVudDogJ2xlZnQnLFxuICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICBncmlkOiB7dXBkYXRlOiB7c3Ryb2tlOiB7dmFsdWU6ICdyZWQnfX19LFxuICAgICAgICAgIGxhYmVsczoge3VwZGF0ZToge2ZpbGw6IHt2YWx1ZTogJ3JlZCd9fX1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBheGlzID0gYXNzZW1ibGVBeGlzKGF4aXNDbXB0LCAnZ3JpZCcsIGRlZmF1bHRDb25maWcpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGF4aXMuZW5jb2RlLmxhYmVscyk7XG4gICAgfSk7XG5cbiAgICBpdCgnb3V0cHV0cyBtYWluIGF4aXMgd2l0aG91dCBncmlkIGVuY29kZSBibG9ja3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBheGlzQ21wdCA9IG5ldyBBeGlzQ29tcG9uZW50KHtcbiAgICAgICAgb3JpZW50OiAnbGVmdCcsXG4gICAgICAgIGVuY29kZToge1xuICAgICAgICAgIGdyaWQ6IHt1cGRhdGU6IHtzdHJva2U6IHt2YWx1ZTogJ3JlZCd9fX0sXG4gICAgICAgICAgbGFiZWxzOiB7dXBkYXRlOiB7ZmlsbDoge3ZhbHVlOiAncmVkJ319fVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGF4aXMgPSBhc3NlbWJsZUF4aXMoYXhpc0NtcHQsICdtYWluJywgZGVmYXVsdENvbmZpZyk7XG4gICAgICBhc3NlcnQuaXNVbmRlZmluZWQoYXhpcy5lbmNvZGUuZ3JpZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IGFzc2VtYmxlIHRpdGxlIGZpZWxkRGVmcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF4aXNDbXB0ID0gbmV3IEF4aXNDb21wb25lbnQoe1xuICAgICAgICBvcmllbnQ6ICdsZWZ0JyxcbiAgICAgICAgdGl0bGU6IFt7YWdncmVnYXRlOiAnbWF4JywgZmllbGQ6ICdhJ30sIHthZ2dyZWdhdGU6ICdtaW4nLCBmaWVsZDogJ2InfV1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXhpcyA9IGFzc2VtYmxlQXhpcyhheGlzQ21wdCwgJ21haW4nLCBkZWZhdWx0Q29uZmlnKTtcbiAgICAgIGFzc2VydC5lcXVhbChheGlzLnRpdGxlLCAnTWF4IG9mIGEsIE1pbiBvZiBiJyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==