import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { bound, brush, compositeTypes, embedFn, parentSelector, spec, testRenderFn, tuples, unbound } from './util';
const hits = {
    zoom: [9, 23],
    bins: [8, 2]
};
function zoom(key, idx, direction, parent, targetBrush) {
    const delta = direction === 'out' ? 200 : -200;
    return `zoom(${hits[key][idx]}, ${delta}, ${parent}, ${targetBrush})`;
}
const cmp = (a, b) => a - b;
for (const bind of [bound, unbound]) {
    describe(`Zoom ${bind} interval selections at runtime`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield page.goto('http://0.0.0.0:8000/test-runtime/');
        }));
        const type = 'interval';
        const embed = embedFn(page);
        const testRender = testRenderFn(page, `interval/zoom/${bind}`);
        const binding = bind === bound ? { bind: 'scales' } : {};
        const assertExtent = {
            in: ['isAtLeast', 'isAtMost'],
            out: ['isAtMost', 'isAtLeast']
        };
        function setup(brushKey, idx, encodings, parent) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const inOut = idx % 2 ? 'out' : 'in';
                let xold;
                let yold;
                if (bind === unbound) {
                    const drag = (yield page.evaluate(brush(brushKey, idx, parent)))[0];
                    xold = drag.values[0].sort(cmp);
                    yold = encodings.indexOf('y') >= 0 ? drag.values[encodings.indexOf('x') + 1].sort(cmp) : null;
                }
                else {
                    xold = JSON.parse(yield page.evaluate('JSON.stringify(view._runtime.scales.x.value.domain())'));
                    yold = yield page.evaluate('view._runtime.scales.y.value.domain()');
                }
                return { inOut, xold, yold };
            });
        }
        it('should zoom in and out', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.zoom.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding)));
                const { inOut, xold, yold } = yield setup('drag', i, ['x', 'y']);
                yield testRender(`${inOut}-0`);
                const zoomed = (yield page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
                const xnew = zoomed.values[0].sort(cmp);
                const ynew = zoomed.values[1].sort(cmp);
                yield testRender(`${inOut}-1`);
                assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
            }
        }));
        it('should work with binned domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.bins.length; i++) {
                const encodings = ['y'];
                yield embed(spec('unit', 1, Object.assign({ type }, binding, { encodings }), {
                    x: { aggregate: 'count', type: 'quantitative' },
                    y: { bin: true },
                    color: { value: 'steelblue', field: null, type: null }
                }));
                const { inOut, yold } = yield setup('bins', i, encodings);
                yield testRender(`bins_${inOut}-0`);
                const zoomed = (yield page.evaluate(zoom('bins', i, inOut, null, bind === unbound)))[0];
                const ynew = zoomed.values[0].sort(cmp);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                yield testRender(`bins_${inOut}-1`);
            }
        }));
        it('should work with temporal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const values = tuples.map(d => (Object.assign({}, d, { a: new Date(2017, d.a) })));
            const encodings = ['x'];
            for (let i = 0; i < hits.zoom.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding, { encodings }), { values, x: { type: 'temporal' } }));
                const { inOut, xold } = yield setup('drag', i, encodings);
                yield testRender(`temporal_${inOut}-0`);
                const zoomed = (yield page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
                const xnew = zoomed.values[0].sort(cmp);
                assert[assertExtent[inOut][0]](+xnew[0], +new Date(xold[0]));
                assert[assertExtent[inOut][1]](+xnew[1], +new Date(xold[1]));
                yield testRender(`temporal_${inOut}-1`);
            }
        }));
        it('should work with log/pow scales', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.zoom.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding), {
                    x: { scale: { type: 'pow', exponent: 1.5 } },
                    y: { scale: { type: 'log' } }
                }));
                const { inOut, xold, yold } = yield setup('drag', i, ['x', 'y']);
                yield testRender(`logpow_${inOut}-0`);
                const zoomed = (yield page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
                const xnew = zoomed.values[0].sort(cmp);
                const ynew = zoomed.values[1].sort(cmp);
                assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                yield testRender(`logpow_${inOut}-1`);
            }
        }));
        if (bind === unbound) {
            it('should work with ordinal/nominal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < hits.zoom.length; i++) {
                    yield embed(spec('unit', i, Object.assign({ type }, binding), {
                        x: { type: 'ordinal' },
                        y: { type: 'nominal' }
                    }));
                    const { inOut, xold, yold } = yield setup('drag', i, ['x', 'y']);
                    yield testRender(`ord_${inOut}-0`);
                    const zoomed = (yield page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
                    const xnew = zoomed.values[0].sort(cmp);
                    const ynew = zoomed.values[1].sort(cmp);
                    if (inOut === 'in') {
                        expect(xnew.length).toBeLessThanOrEqual(xold.length);
                        expect(ynew.length).toBeLessThanOrEqual(yold.length);
                    }
                    else {
                        expect(xnew.length).toBeGreaterThanOrEqual(xold.length);
                        expect(ynew.length).toBeGreaterThanOrEqual(yold.length);
                    }
                    yield testRender(`ord_${inOut}-1`);
                }
            }));
        }
        else {
            for (const specType of compositeTypes) {
                it(`should work with shared scales in ${specType} views`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < hits.bins.length; i++) {
                        yield embed(spec(specType, 0, Object.assign({ type }, binding), { resolve: { scale: { x: 'shared', y: 'shared' } } }));
                        const parent = parentSelector(specType, i);
                        const { inOut, xold, yold } = yield setup(specType, i, ['x', 'y'], parent);
                        const zoomed = (yield page.evaluate(zoom('bins', i, inOut, null, bind === unbound)))[0];
                        const xnew = zoomed.values[0].sort(cmp);
                        const ynew = zoomed.values[1].sort(cmp);
                        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
                        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
                        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
                        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
                        yield testRender(`${specType}_${inOut}`);
                    }
                }));
            }
        }
    }));
}
//# sourceMappingURL=zoom.test.js.map