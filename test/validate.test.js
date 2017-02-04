"use strict";
var chai_1 = require("chai");
var validate_1 = require("../src/validate");
var mark_1 = require("../src/mark");
describe('vl.validate', function () {
    describe('getEncodingMappingError()', function () {
        it('should return no error for valid specs', function () {
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    x: { field: 'a' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b' },
                    y: { field: 'a' }
                }
            }));
            chai_1.assert.isNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    x: { field: 'a' },
                    y: { field: 'b' }
                }
            }));
        });
        it('should return error for invalid specs', function () {
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    x: { field: 'b' } // missing y
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    y: { field: 'b' } // missing x
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.TEXT,
                encoding: {
                    y: { field: 'b' } // missing text
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.LINE,
                encoding: {
                    shape: { field: 'b' } // using shape with line
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.AREA,
                encoding: {
                    shape: { field: 'b' } // using shape with area
                }
            }));
            chai_1.assert.isNotNull(validate_1.getEncodingMappingError({
                mark: mark_1.BAR,
                encoding: {
                    shape: { field: 'b' } // using shape with bar
                }
            }));
        });
    });
});
//# sourceMappingURL=validate.test.js.map