"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../src/log"));
var transform_1 = require("../src/transform");
describe('normalizeTransform()', function () {
    it('replaces filter with timeUnit=yearmonthday with yearmonthdate and throws the right warning', log.wrap(function (localLogger) {
        var filter = {
            and: [
                { not: { timeUnit: 'yearmonthday', field: 'd', equal: { year: 2008 } } },
                { or: [{ field: 'a', equal: 5 }] }
            ]
        };
        var transform = [
            { filter: filter }
        ];
        chai_1.assert.deepEqual(transform_1.normalizeTransform(transform), [{
                filter: {
                    and: [
                        { not: { timeUnit: 'yearmonthdate', field: 'd', equal: { year: 2008 } } },
                        { or: [{ field: 'a', equal: 5 }] }
                    ]
                }
            }]);
        chai_1.assert.equal(localLogger.warns[0], log.message.dayReplacedWithDate('yearmonthday'));
    }));
});
//# sourceMappingURL=transform.test.js.map