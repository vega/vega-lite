import * as tslib_1 from "tslib";
import { SELECTION_ID } from '../src/selection';
import { fill } from '../src/util';
import { embedFn, hits as hitsMaster, pt, spec, testRenderFn } from './util';
for (const type of ['single', 'multi']) {
    describe(`${type} selections at runtime in unit views`, () => {
        beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield page.goto('http://0.0.0.0:8000/test-runtime/');
        }));
        const hits = hitsMaster.discrete;
        const embed = embedFn(page);
        const testRender = testRenderFn(page, `${type}/unit`);
        it('should add values to the store', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.qq.length; i++) {
                yield embed(spec('unit', i, { type }));
                const store = yield page.evaluate(pt('qq', i));
                expect(store).toHaveLength(1);
                expect(store[0].fields).toHaveLength(1);
                expect(store[0].values).toHaveLength(1);
                expect(store[0].fields[0].field).toEqual(SELECTION_ID);
                expect(store[0].fields[0].type).toEqual('E');
                yield testRender(`click_${i}`);
            }
        }));
        it('should respect projections', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let values = [];
            let encodings = [];
            let fields = [];
            const test = (emb) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < hits.qq.length; i++) {
                    emb(i);
                    const store = yield page.evaluate(pt('qq', i));
                    expect(store).toHaveLength(1);
                    expect(store[0].fields).toHaveLength(fields.length);
                    expect(store[0].values).toHaveLength(fields.length);
                    expect(store[0].fields.map((f) => f.field)).toEqual(fields);
                    expect(store[0].fields.map((f) => f.type)).toEqual(fill('E', fields.length));
                    expect(store[0].values).toEqual(values[i]);
                    yield testRender(`${encodings}_${fields}_${i}`);
                }
            });
            encodings = ['x', 'color'];
            fields = ['a', 'c'];
            values = [[2, 1], [6, 0]];
            yield test((i) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield embed(spec('unit', i, { type, encodings })); }));
            encodings = [];
            fields = ['c', 'a', 'b'];
            values = [[1, 2, 53], [0, 6, 87]];
            yield test((i) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield embed(spec('unit', i, { type, fields })); }));
        }));
        it('should clear out the store', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < hits.qq_clear.length; i++) {
                yield embed(spec('unit', i, { type }));
                let store = yield page.evaluate(pt('qq', i));
                expect(store).toHaveLength(1);
                store = yield page.evaluate(pt('qq_clear', i));
                expect(store).toHaveLength(0);
                yield testRender(`clear_${i}`);
            }
        }));
        it('should support selecting bins', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const encodings = ['x', 'color', 'y'];
            const fields = ['a', 'c', 'b'];
            const types = ['R-RE', 'E', 'R-RE'];
            const values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];
            for (let i = 0; i < hits.bins.length; i++) {
                yield embed(spec('unit', i, { type, encodings }, { x: { bin: true }, y: { bin: true } }));
                const store = yield page.evaluate(pt('bins', i));
                expect(store).toHaveLength(1);
                expect(store[0].fields).toHaveLength(fields.length);
                expect(store[0].values).toHaveLength(fields.length);
                expect(store[0].fields.map((f) => f.field)).toEqual(fields);
                expect(store[0].fields.map((f) => f.type)).toEqual(types);
                expect(store[0].values).toEqual(values[i]);
                yield testRender(`bins_${i}`);
            }
        }));
    });
}
//# sourceMappingURL=discrete.test.js.map