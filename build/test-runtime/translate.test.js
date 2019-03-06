import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { bound, brush, compositeTypes, embedFn, hits as hitsMaster, parentSelector, spec, testRenderFn, tuples, unbound } from './util';
// declare const jestPuppeteer: any;
for (const bind of [bound, unbound]) {
    describe(`Translate ${bind} interval selections at runtime`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield page.goto('http://0.0.0.0:8000/test-runtime/');
        }));
        const type = 'interval';
        const hits = hitsMaster.interval;
        const embed = embedFn(page);
        const testRender = testRenderFn(page, `interval/translate/${bind}`);
        const binding = bind === bound ? { bind: 'scales' } : {};
        const assertExtent = {
            [unbound]: {
                x: ['isAbove', 'isBelow'],
                y: ['isBelow', 'isAbove']
            },
            [bound]: {
                x: ['isBelow', 'isAbove'],
                y: ['isAbove', 'isBelow']
            }
        };
        it('should move back-and-forth', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.translate.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding)));
                const drag = (yield page.evaluate(brush('drag', i)))[0];
                yield testRender(`${i}-0`);
                const translate = (yield page.evaluate(brush('translate', i, null, bind === unbound)))[0];
                assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
                assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
                assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
                assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
                yield testRender(`${i}-1`);
            }
        }));
        it('should work with binned domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.bins.length; i++) {
                yield embed(spec('unit', 1, Object.assign({ type }, binding, { encodings: ['y'] }), {
                    x: { aggregate: 'count', type: 'quantitative' },
                    y: { bin: true },
                    color: { value: 'steelblue', field: null, type: null }
                }));
                const drag = (yield page.evaluate(brush('bins', i)))[0];
                yield testRender(`bins_${i}-0`);
                const translate = (yield page.evaluate(brush('bins_translate', i, null, bind === unbound)))[0];
                assert[assertExtent[bind].y[i]](translate.values[0][0], drag.values[0][0]);
                assert[assertExtent[bind].y[i]](translate.values[0][1], drag.values[0][1]);
                yield testRender(`bins_${i}-1`);
            }
        }));
        it('should work with temporal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // await jestPuppeteer.debug();
            const values = tuples.map(d => (Object.assign({}, d, { a: new Date(2017, d.a) })));
            const toNumber = (a) => a[0].values[0].map((d) => +d);
            for (let i = 0; i < hits.translate.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding, { encodings: ['x'] }), { values, x: { type: 'temporal' } }));
                const drag = toNumber(yield page.evaluate(brush('drag', i)));
                yield testRender(`temporal_${i}-0`);
                const translate = toNumber(yield page.evaluate(brush('translate', i, null, bind === unbound)));
                assert[assertExtent[bind].x[i]](translate[0], drag[0]);
                assert[assertExtent[bind].x[i]](translate[1], drag[1]);
                yield testRender(`temporal_${i}-1`);
            }
        }));
        it('should work with log/pow scales', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.translate.length; i++) {
                yield embed(spec('unit', i, Object.assign({ type }, binding), {
                    x: { scale: { type: 'pow', exponent: 1.5 } },
                    y: { scale: { type: 'log' } }
                }));
                const drag = (yield page.evaluate(brush('drag', i)))[0];
                yield testRender(`logpow_${i}-0`);
                const translate = (yield page.evaluate(brush('translate', i, null, bind === unbound)))[0];
                assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
                assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
                assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
                assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
                yield testRender(`logpow_${i}-1`);
            }
        }));
        if (bind === unbound) {
            it('should work with ordinal/nominal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < hits.translate.length; i++) {
                    yield embed(spec('unit', i, Object.assign({ type }, binding), {
                        x: { type: 'ordinal' },
                        y: { type: 'nominal' }
                    }));
                    const drag = (yield page.evaluate(brush('drag', i)))[0];
                    yield testRender(`ord_${i}-0`);
                    const translate = (yield page.evaluate(brush('translate', i, null, true)))[0];
                    assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
                    assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
                    assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
                    assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
                    yield testRender(`ord_${i}-1`);
                }
            }));
        }
        else {
            compositeTypes.forEach(specType => {
                const assertExtents = {
                    repeat: {
                        x: ['isBelow', 'isBelow', 'isBelow'],
                        y: ['isAbove', 'isAbove', 'isAbove']
                    },
                    facet: {
                        x: ['isBelow', 'isBelow', 'isBelow'],
                        y: ['isBelow', 'isAbove', 'isBelow']
                    }
                };
                it(`should work with shared scales in ${specType} views`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    for (let i = 0; i < hits[specType].length; i++) {
                        yield embed(spec(specType, 0, Object.assign({ type }, binding), { resolve: { scale: { x: 'shared', y: 'shared' } } }));
                        const parent = parentSelector(specType, i);
                        const xscale = yield page.evaluate('view._runtime.scales.x.value.domain()');
                        const yscale = yield page.evaluate('view._runtime.scales.y.value.domain()');
                        const drag = (yield page.evaluate(brush(specType, i, parent)))[0];
                        assert[assertExtents[specType].x[i]](drag.values[0][0], xscale[0], `iter: ${i}`);
                        assert[assertExtents[specType].x[i]](drag.values[0][1], xscale[1], `iter: ${i}`);
                        assert[assertExtents[specType].y[i]](drag.values[1][0], yscale[0], `iter: ${i}`);
                        assert[assertExtents[specType].y[i]](drag.values[1][1], yscale[1], `iter: ${i}`);
                        yield testRender(`${specType}_${i}`);
                    }
                }));
            });
        }
    }));
}
//# sourceMappingURL=translate.test.js.map