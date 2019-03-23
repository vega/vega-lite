import * as tslib_1 from "tslib";
import { brush, embedFn, hits as hitsMaster, spec, testRenderFn, tuples } from './util';
describe('interval selections at runtime in unit views', () => {
    beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield page.goto('http://0.0.0.0:8000/test-runtime/');
    }));
    const type = 'interval';
    const hits = hitsMaster.interval;
    const embed = embedFn(page);
    const testRender = testRenderFn(page, `${type}/unit`);
    it('should add extents to the store', (done) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < hits.drag.length; i++) {
            yield embed(spec('unit', i, { type }));
            const store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(2);
            expect(store[0].values).toHaveLength(2);
            expect(store[0].fields[0].channel).toBe('x');
            expect(store[0].fields[0].field).toBe('a');
            expect(store[0].fields[0].type).toBe('R');
            expect(store[0].fields[1].channel).toBe('y');
            expect(store[0].fields[1].field).toBe('b');
            expect(store[0].fields[1].type).toBe('R');
            expect(store[0].values[0]).toHaveLength(2);
            expect(store[0].values[1]).toHaveLength(2);
            yield testRender(`drag_${i}`);
        }
        done();
    }));
    it('should respect projections', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield embed(spec('unit', 0, { type, encodings: ['x'] }));
        for (let i = 0; i < hits.drag.length; i++) {
            const store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(1);
            expect(store[0].values).toHaveLength(1);
            expect(store[0].fields[0].channel).toBe('x');
            expect(store[0].fields[0].field).toBe('a');
            expect(store[0].fields[0].type).toBe('R');
            expect(store[0].values[0]).toHaveLength(2);
            yield testRender(`x_${i}`);
        }
        yield embed(spec('unit', 1, { type, encodings: ['y'] }));
        for (let i = 0; i < hits.drag.length; i++) {
            const store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(1);
            expect(store[0].values).toHaveLength(1);
            expect(store[0].fields[0].channel).toBe('y');
            expect(store[0].fields[0].field).toBe('b');
            expect(store[0].fields[0].type).toBe('R');
            expect(store[0].values[0]).toHaveLength(2);
            yield testRender(`y_${i}`);
        }
    }));
    it('should clear out stored extents', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < hits.drag_clear.length; i++) {
            yield embed(spec('unit', i, { type }));
            let store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            store = yield page.evaluate(brush('drag_clear', i));
            expect(store).toHaveLength(0);
            yield testRender(`clear_${i}`);
        }
    }));
    it('should brush over binned domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield embed(spec('unit', 1, { type, encodings: ['y'] }, {
            x: { aggregate: 'count', type: 'quantitative' },
            y: { bin: true },
            color: { value: 'steelblue', field: null, type: null }
        }));
        for (let i = 0; i < hits.bins.length; i++) {
            const store = yield page.evaluate(brush('bins', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(1);
            expect(store[0].values).toHaveLength(1);
            expect(store[0].fields[0].channel).toBe('y');
            expect(store[0].fields[0].field).toBe('b');
            expect(store[0].fields[0].type).toBe('R');
            expect(store[0].values[0]).toHaveLength(2);
            yield testRender(`bins_${i}`);
        }
        const store = yield page.evaluate(brush('bins_clear', 0));
        expect(store).toHaveLength(0);
    }));
    it('should brush over ordinal/nominal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const xextents = [[2, 3, 4], [6, 7, 8]];
        const yextents = [[49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87, 91], [17, 19, 23, 24, 27, 28, 35, 39, 43, 48]];
        for (let i = 0; i < hits.drag.length; i++) {
            yield embed(spec('unit', i, { type }, { x: { type: 'ordinal' }, y: { type: 'nominal' } }));
            const store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(2);
            expect(store[0].values).toHaveLength(2);
            expect(store[0].fields[0].channel).toBe('x');
            expect(store[0].fields[0].field).toBe('a');
            expect(store[0].fields[0].type).toBe('E');
            expect(store[0].fields[1].channel).toBe('y');
            expect(store[0].fields[1].field).toBe('b');
            expect(store[0].fields[1].type).toBe('E');
            expect(store[0].values[0]).toEqual(expect.arrayContaining(xextents[i]));
            expect(store[0].values[1]).toEqual(expect.arrayContaining(yextents[i]));
            yield testRender(`ord_${i}`);
        }
        const store = yield page.evaluate(brush('drag_clear', 0));
        expect(store).toHaveLength(0);
    }));
    it('should brush over temporal domains', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const values = tuples.map(d => (Object.assign({}, d, { a: new Date(2017, d.a) })));
        const toNumber = (a) => a[0].values[0].map((d) => +d);
        yield embed(spec('unit', 0, { type, encodings: ['x'] }, { values, x: { type: 'temporal' } }));
        let extents = [[1485969714000, 1493634384000], [1496346498000, 1504364922000]];
        for (let i = 0; i < hits.drag.length; i++) {
            const store = toNumber(yield page.evaluate(brush('drag', i)));
            expect(store).toEqual(expect.arrayContaining(extents[i]));
            yield testRender(`temporal_${i}`);
        }
        let cleared = yield page.evaluate(brush('drag_clear', 0));
        expect(cleared).toHaveLength(0);
        yield embed(spec('unit', 1, { type, encodings: ['x'] }, { values, x: { type: 'temporal', timeUnit: 'day' } }));
        extents = [[1136190528000, 1136361600000], [1136449728000, 1136535264000]];
        for (let i = 0; i < hits.drag.length; i++) {
            const store = toNumber(yield page.evaluate(brush('drag', i)));
            expect(store).toEqual(expect.arrayContaining(extents[i]));
            yield testRender(`dayTimeUnit_${i}`);
        }
        cleared = yield page.evaluate(brush('drag_clear', 0));
        expect(cleared).toHaveLength(0);
    }));
    it('should brush over log/pow scales', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < hits.drag.length; i++) {
            yield embed(spec('unit', i, { type }, {
                x: { scale: { type: 'pow', exponent: 1.5 } },
                y: { scale: { type: 'log' } }
            }));
            const store = yield page.evaluate(brush('drag', i));
            expect(store).toHaveLength(1);
            expect(store[0].fields).toHaveLength(2);
            expect(store[0].values).toHaveLength(2);
            expect(store[0].values[0]).toHaveLength(2);
            expect(store[0].values[1]).toHaveLength(2);
            yield testRender(`logpow_${i}`);
        }
    }));
});
//# sourceMappingURL=interval.test.js.map