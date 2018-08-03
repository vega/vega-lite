"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("./util");
[util_1.bound, util_1.unbound].forEach(function (bind, idx) {
    describe("Translate " + bind + " interval selections at runtime", function () {
        var _a;
        var type = 'interval';
        var hits = util_1.hits.interval;
        var embed = util_1.embedFn(browser);
        var testRender = util_1.testRenderFn(browser, "interval/translate/" + bind);
        var binding = bind === util_1.bound ? { bind: 'scales' } : {};
        var assertExtent = (_a = {},
            _a[util_1.unbound] = {
                x: ['isAbove', 'isBelow'],
                y: ['isBelow', 'isAbove']
            },
            _a[util_1.bound] = {
                x: ['isBelow', 'isAbove'],
                y: ['isAbove', 'isBelow']
            },
            _a);
        it('should move back-and-forth', function () {
            for (var i = 0; i < hits.translate.length; i++) {
                embed(util_1.spec('unit', i, tslib_1.__assign({ type: type }, binding)));
                var drag = browser.execute(util_1.brush('drag', i)).value[0];
                testRender(i + "-0");
                var translate = browser.execute(util_1.brush('translate', i, null, bind === util_1.unbound)).value[0];
                chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
                chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
                testRender(i + "-1");
            }
        });
        it('should work with binned domains', function () {
            for (var i = 0; i < hits.bins.length; i++) {
                embed(util_1.spec('unit', 1, tslib_1.__assign({ type: type }, binding, { encodings: ['y'] }), {
                    x: { aggregate: 'count', field: '*', type: 'quantitative' },
                    y: { bin: true },
                    color: { value: 'steelblue', field: null, type: null }
                }));
                var drag = browser.execute(util_1.brush('bins', i)).value[0];
                testRender("bins_" + i + "-0");
                var translate = browser.execute(util_1.brush('bins_translate', i, null, bind === util_1.unbound)).value[0];
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
                testRender("bins_" + i + "-1");
            }
        });
        it('should work with temporal domains', function () {
            var values = util_1.tuples.map(function (d) { return (tslib_1.__assign({}, d, { a: new Date(2017, d.a) })); });
            var toNumber = '[0].intervals[0].extent.map((d) => +d)';
            for (var i = 0; i < hits.translate.length; i++) {
                embed(util_1.spec('unit', i, tslib_1.__assign({ type: type }, binding, { encodings: ['x'] }), { values: values, x: { type: 'temporal' } }));
                var drag = browser.execute(util_1.brush('drag', i) + toNumber).value;
                testRender("temporal_" + i + "-0");
                var translate = browser.execute(util_1.brush('translate', i, null, bind === util_1.unbound) + toNumber).value;
                chai_1.assert[assertExtent[bind].x[i]](translate[0], drag[0]);
                chai_1.assert[assertExtent[bind].x[i]](translate[1], drag[1]);
                testRender("temporal_" + i + "-1");
            }
        });
        it('should work with log/pow scales', function () {
            for (var i = 0; i < hits.translate.length; i++) {
                embed(util_1.spec('unit', i, tslib_1.__assign({ type: type }, binding), {
                    x: { scale: { type: 'pow', exponent: 1.5 } },
                    y: { scale: { type: 'log' } }
                }));
                var drag = browser.execute(util_1.brush('drag', i)).value[0];
                testRender("logpow_" + i + "-0");
                var translate = browser.execute(util_1.brush('translate', i, null, bind === util_1.unbound)).value[0];
                chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
                chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
                chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
                testRender("logpow_" + i + "-1");
            }
        });
        if (bind === util_1.unbound) {
            it('should work with ordinal/nominal domains', function () {
                for (var i = 0; i < hits.translate.length; i++) {
                    embed(util_1.spec('unit', i, tslib_1.__assign({ type: type }, binding), {
                        x: { type: 'ordinal' },
                        y: { type: 'nominal' }
                    }));
                    var drag = browser.execute(util_1.brush('drag', i)).value[0];
                    testRender("ord_" + i + "-0");
                    var translate = browser.execute(util_1.brush('translate', i, null, true)).value[0];
                    chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
                    chai_1.assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
                    chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
                    chai_1.assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
                    testRender("ord_" + i + "-1");
                }
            });
        }
        else {
            util_1.compositeTypes.forEach(function (specType) {
                var assertExtents = {
                    repeat: {
                        x: ['isBelow', 'isBelow', 'isBelow'],
                        y: ['isAbove', 'isAbove', 'isAbove']
                    },
                    facet: {
                        x: ['isBelow', 'isBelow', 'isBelow'],
                        y: ['isBelow', 'isAbove', 'isBelow']
                    }
                };
                it("should work with shared scales in " + specType + " views", function () {
                    for (var i = 0; i < hits[specType].length; i++) {
                        embed(util_1.spec(specType, 0, tslib_1.__assign({ type: type }, binding), { resolve: { scale: { x: 'shared', y: 'shared' } } }));
                        var parent_1 = util_1.parentSelector(specType, i);
                        var xscale = browser.execute('return view._runtime.scales.x.value.domain()').value;
                        var yscale = browser.execute('return view._runtime.scales.y.value.domain()').value;
                        var drag = browser.execute(util_1.brush(specType, i, parent_1)).value[0];
                        chai_1.assert[assertExtents[specType].x[i]](drag.intervals[0].extent[0], xscale[0], "iter: " + i);
                        chai_1.assert[assertExtents[specType].x[i]](drag.intervals[0].extent[1], xscale[1], "iter: " + i);
                        chai_1.assert[assertExtents[specType].y[i]](drag.intervals[1].extent[0], yscale[0], "iter: " + i);
                        chai_1.assert[assertExtents[specType].y[i]](drag.intervals[1].extent[1], yscale[1], "iter: " + i);
                        testRender(specType + "_" + i);
                    }
                });
            });
        }
    });
});
//# sourceMappingURL=translate.test.js.map