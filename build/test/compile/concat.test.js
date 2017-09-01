"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29uY2F0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsZ0NBQXlDO0FBRXpDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyx1QkFBZ0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDakM7cUJBQ0YsRUFBQzt3QkFDQSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDOzRCQUNoQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7eUJBQ3RDO3FCQUNGLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzs0QkFDaEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxhQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRSxFQUNUO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFLEVBQ1Q7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQVcsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUNqRCxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQzlCLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRSxFQUNUO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFLEVBQ1Q7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQVcsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUNqRCxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQzlCLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxNQUFNO2dCQUNkLEtBQUssRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=