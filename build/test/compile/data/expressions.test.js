"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expressions_1 = require("../../../src/compile/data/expressions");
describe('compile/data/expressions', function () {
    describe('getDependentFields', function () {
        it('calcuates right dependent fields for simple expression', function () {
            expect(expressions_1.getDependentFields('datum.x + datum.y')).toEqual({ x: true, y: true });
        });
        it('calcuates right dependent fields for compres expression', function () {
            expect(expressions_1.getDependentFields('toString(datum.x) + 12')).toEqual({ x: true });
        });
        it('calculates right dependent fields for nested field', function () {
            expect(expressions_1.getDependentFields('datum.x.y')).toEqual({ x: true, 'x.y': true });
            expect(expressions_1.getDependentFields('datum["x.y"]')).toEqual({ 'x.y': true });
        });
    });
});
//# sourceMappingURL=expressions.test.js.map