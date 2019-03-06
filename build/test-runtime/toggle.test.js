import * as tslib_1 from "tslib";
import { stringValue } from 'vega-util';
import { compositeTypes, embedFn, parentSelector, spec, testRenderFn } from './util';
const hits = {
    qq: [8, 19, 13, 21],
    qq_clear: [5, 16],
    bins: [4, 29, 16, 9],
    bins_clear: [18, 7],
    composite: [1, 3, 5, 7, 8, 9]
};
function toggle(key, idx, shiftKey, parent) {
    const fn = key.match('_clear') ? 'clear' : 'pt';
    return `${fn}(${hits[key][idx]}, ${stringValue(parent)}, ${!!shiftKey})`;
}
describe('Toggle multi selections at runtime', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    beforeAll(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield page.goto('http://0.0.0.0:8000/test-runtime/');
    }));
    const type = 'multi';
    const embed = embedFn(page);
    const testRender = testRenderFn(page, 'multi/toggle');
    it('should toggle values into/out of the store', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield embed(spec('unit', 0, { type }));
        yield page.evaluate(toggle('qq', 0, false));
        yield page.evaluate(toggle('qq', 1, true));
        let store = yield page.evaluate(toggle('qq', 2, true));
        expect(store).toHaveLength(3);
        yield testRender('click_0');
        store = yield page.evaluate(toggle('qq', 2, true));
        expect(store).toHaveLength(2);
        yield testRender('click_1');
        store = yield page.evaluate(toggle('qq', 3, false));
        expect(store).toHaveLength(1);
        yield testRender('click_2');
    }));
    it('should clear out the store w/o shiftKey', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield embed(spec('unit', 1, { type }));
        yield page.evaluate(toggle('qq', 0, false));
        yield page.evaluate(toggle('qq', 1, true));
        yield page.evaluate(toggle('qq', 2, true));
        yield page.evaluate(toggle('qq', 3, true));
        yield testRender(`clear_0`);
        let store = yield page.evaluate(toggle('qq_clear', 0, true));
        expect(store).toHaveLength(4);
        yield testRender(`clear_1`);
        store = yield page.evaluate(toggle('qq_clear', 1, false));
        expect(store).toHaveLength(0);
        yield testRender(`clear_2`);
    }));
    it('should toggle binned fields', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield embed(spec('unit', 0, { type, encodings: ['x', 'y'] }, { x: { bin: true }, y: { bin: true } }));
        yield page.evaluate(toggle('bins', 0, false));
        yield page.evaluate(toggle('bins', 1, true));
        let store = yield page.evaluate(toggle('bins', 2, true));
        expect(store).toHaveLength(3);
        yield testRender('bins_0');
        store = yield page.evaluate(toggle('bins', 2, true));
        expect(store).toHaveLength(2);
        yield testRender('bins_1');
        store = yield page.evaluate(toggle('bins', 3, false));
        expect(store).toHaveLength(1);
        yield testRender('bins_2');
    }));
    compositeTypes.forEach((specType, idx) => {
        it(`should toggle in ${specType} views`, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield embed(spec(specType, idx, { type, resolve: 'union' }));
            let length = 0;
            for (let i = 0; i < hits.composite.length; i++) {
                const parent = parentSelector(specType, i % 3);
                const store = yield page.evaluate(toggle('composite', i, true, parent));
                expect((length = store.length)).toEqual(i + 1);
                if (i % 3 === 2) {
                    yield testRender(`${specType}_${i}`);
                }
            }
            for (let i = 0; i < hits.composite.length; i++) {
                const even = i % 2 === 0;
                const parent = parentSelector(specType, ~~(i / 2));
                const store = yield page.evaluate(toggle('qq_clear', 0, even, parent));
                expect(store).toHaveLength(even ? length : (length = length - 2));
                if (!even) {
                    yield testRender(`${specType}_clear_${i}`);
                }
            }
        }));
    });
}));
//# sourceMappingURL=toggle.test.js.map