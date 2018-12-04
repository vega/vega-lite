import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { bound, brush, compositeTypes, embedFn, parentSelector, spec, testRenderFn, tuples, unbound } from './util';
var hits = {
    zoom: [9, 23],
    bins: [8, 2]
};
function zoom(key, idx, direction, parent, targetBrush) {
    var delta = direction === 'out' ? 200 : -200;
    return "return zoom(" + hits[key][idx] + ", " + delta + ", " + parent + ", " + targetBrush + ")";
}
var cmp = function (a, b) { return a - b; };
[bound, unbound].forEach(function (bind) {
    describe("Zoom " + bind + " interval selections at runtime", function () {
        var type = 'interval';
        var embed = embedFn(browser);
        var testRender = testRenderFn(browser, "interval/zoom/" + bind);
        var binding = bind === bound ? { bind: 'scales' } : {};
        var assertExtent = {
            in: ['isAtLeast', 'isAtMost'],
            out: ['isAtMost', 'isAtLeast']
        };
        function setup(brushKey, idx, encodings, parent) {
            var inOut = idx % 2 ? 'out' : 'in';
            var xold;
            var yold;
            if (bind === unbound) {
                var drag = browser.execute(brush(brushKey, idx, parent)).value[0];
                xold = drag.values[0].sort(cmp);
                yold = encodings.indexOf('y') >= 0 ? drag.values[encodings.indexOf('x') + 1].sort(cmp) : null;
            }
            else {
                xold = JSON.parse(browser.execute('return JSON.stringify(view._runtime.scales.x.value.domain())').value);
                yold = browser.execute('return view._runtime.scales.y.value.domain()').value;
            }
            return { inOut: inOut, xold: xold, yold: yold };
        }
        it('should zoom in and out', function () {
            for (var i = 0; i < hits.zoom.length; i++) {
                embed(spec('unit', i, tslib_1.__assign({ type: type }, binding)));
                var _a = setup('drag', i, ['x', 'y']), inOut = _a.inOut, xold = _a.xold, yold = _a.yold;
                testRender(inOut + "-0");
                var zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
                var xnew = zoomed.values[0].sort(cmp);
                var ynew = zoomed.values[1].sort(cmp);
                testRender(inOut + "-1");
                assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
            }
        });
        it('should work with binned domains', function () {
            for (var i = 0; i < hits.bins.length; i++) {
                var encodings = ['y'];
                embed(spec('unit', 1, tslib_1.__assign({ type: type }, binding, { encodings: encodings }), {
                    x: { aggregate: 'count', field: '*', type: 'quantitative' },
                    y: { bin: true },
                    color: { value: 'steelblue', field: null, type: null }
                }));
                var _a = setup('bins', i, encodings), inOut = _a.inOut, yold = _a.yold;
                testRender("bins_" + inOut + "-0");
                var zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound)).value[0];
                var ynew = zoomed.values[0].sort(cmp);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                testRender("bins_" + inOut + "-1");
            }
        });
        it('should work with temporal domains', function () {
            var values = tuples.map(function (d) { return (tslib_1.__assign({}, d, { a: new Date(2017, d.a) })); });
            var encodings = ['x'];
            for (var i = 0; i < hits.zoom.length; i++) {
                embed(spec('unit', i, tslib_1.__assign({ type: type }, binding, { encodings: encodings }), { values: values, x: { type: 'temporal' } }));
                var _a = setup('drag', i, encodings), inOut = _a.inOut, xold = _a.xold;
                testRender("temporal_" + inOut + "-0");
                var zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
                var xnew = zoomed.values[0].sort(cmp);
                assert[assertExtent[inOut][0]](+xnew[0], +new Date(xold[0]));
                assert[assertExtent[inOut][1]](+xnew[1], +new Date(xold[1]));
                testRender("temporal_" + inOut + "-1");
            }
        });
        it('should work with log/pow scales', function () {
            for (var i = 0; i < hits.zoom.length; i++) {
                embed(spec('unit', i, tslib_1.__assign({ type: type }, binding), {
                    x: { scale: { type: 'pow', exponent: 1.5 } },
                    y: { scale: { type: 'log' } }
                }));
                var _a = setup('drag', i, ['x', 'y']), inOut = _a.inOut, xold = _a.xold, yold = _a.yold;
                testRender("logpow_" + inOut + "-0");
                var zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
                var xnew = zoomed.values[0].sort(cmp);
                var ynew = zoomed.values[1].sort(cmp);
                assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                testRender("logpow_" + inOut + "-1");
            }
        });
        if (bind === unbound) {
            it('should work with ordinal/nominal domains', function () {
                for (var i = 0; i < hits.zoom.length; i++) {
                    embed(spec('unit', i, tslib_1.__assign({ type: type }, binding), {
                        x: { type: 'ordinal' },
                        y: { type: 'nominal' }
                    }));
                    var _a = setup('drag', i, ['x', 'y']), inOut = _a.inOut, xold = _a.xold, yold = _a.yold;
                    testRender("ord_" + inOut + "-0");
                    var zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
                    var xnew = zoomed.values[0].sort(cmp);
                    var ynew = zoomed.values[1].sort(cmp);
                    if (inOut === 'in') {
                        assert.isAtMost(xnew.length, xold.length);
                        assert.isAtMost(ynew.length, yold.length);
                    }
                    else {
                        assert.isAtLeast(xnew.length, xold.length);
                        assert.isAtLeast(ynew.length, yold.length);
                    }
                    testRender("ord_" + inOut + "-1");
                }
            });
        }
        else {
            compositeTypes.forEach(function (specType) {
                it("should work with shared scales in " + specType + " views", function () {
                    for (var i = 0; i < hits.bins.length; i++) {
                        embed(spec(specType, 0, tslib_1.__assign({ type: type }, binding), { resolve: { scale: { x: 'shared', y: 'shared' } } }));
                        var parent_1 = parentSelector(specType, i);
                        var _a = setup(specType, i, ['x', 'y'], parent_1), inOut = _a.inOut, xold = _a.xold, yold = _a.yold;
                        var zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound)).value[0];
                        var xnew = zoomed.values[0].sort(cmp);
                        var ynew = zoomed.values[1].sort(cmp);
                        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                        testRender(specType + "_" + inOut);
                    }
                });
            });
        }
    });
});
//# sourceMappingURL=zoom.test.js.map