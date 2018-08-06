"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var encoding_1 = require("../src/encoding");
var log = tslib_1.__importStar(require("../src/log"));
describe('encoding', function () {
    describe('normalizeEncoding', function () {
        it('should drop color channel if fill is specified', log.wrap(function (logger) {
            var encoding = encoding_1.normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                fill: { field: 'b', type: 'quantitative' }
            }, 'rule');
            chai_1.assert.deepEqual(encoding, {
                fill: { field: 'b', type: 'quantitative' }
            });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { fill: true }));
        }));
        it('should drop color channel if stroke is specified', log.wrap(function (logger) {
            var encoding = encoding_1.normalizeEncoding({
                color: { field: 'a', type: 'quantitative' },
                stroke: { field: 'b', type: 'quantitative' }
            }, 'rule');
            chai_1.assert.deepEqual(encoding, {
                stroke: { field: 'b', type: 'quantitative' }
            });
            chai_1.assert.equal(logger.warns[0], log.message.droppingColor('encoding', { stroke: true }));
        }));
    });
});
//# sourceMappingURL=encoding.test.js.map