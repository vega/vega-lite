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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29uY2F0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsbUNBQXFDO0FBRXJDLGdDQUF5QztBQUV6QyxRQUFRLENBQUMsUUFBUSxFQUFFO0lBQ2pCLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzs0QkFDaEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLHVCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcs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