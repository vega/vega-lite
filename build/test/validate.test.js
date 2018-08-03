"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mark_1 = require("../src/mark");
var validate_1 = require("../src/validate");
describe('vl.validate', function () {
    describe('getEncodingMappingError()', function () {
        it('should return no error for valid specs', function () {
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'a', type: 'quantitative' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                }
            }));
        });
        it('should return error for invalid specs', function () {
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b', type: 'quantitative' } // missing y
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing x
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.TEXT,
                encoding: {
                    y: { field: 'b', type: 'quantitative' } // missing text
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with line
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with area
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    shape: { field: 'b', type: 'quantitative' } // using shape with bar
                }
            }));
        });
    });
});
//# sourceMappingURL=validate.test.js.map