import {stringValue} from 'vega-util';
import {TopLevelSpec} from '../src';
import {SelectionType} from '../src/selection';
import {compositeTypes, embedFn, parentSelector, spec, testRenderFn} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';

const hits = {
  qq: [8, 19, 13, 21],
  qq_clear: [5, 16],
  bins: [4, 29, 16, 9],
  bins_clear: [18, 7],
  composite: [1, 3, 5, 7, 8, 9]
};

function toggle(key: string, idx: number, shiftKey: boolean, parent?: string) {
  const fn = key.match('_clear') ? 'clear' : 'pt';
  return `${fn}(${hits[key][idx]}, ${stringValue(parent)}, ${!!shiftKey})`;
}

describe('Toggle point selections at runtime', () => {
  let page: Page;
  let embed: (specification: TopLevelSpec) => Promise<void>;
  let testRender: (filename: string) => Promise<void>;

  beforeAll(async () => {
    page = await (global as any).__BROWSER__.newPage();
    embed = embedFn(page);
    testRender = testRenderFn(page, 'point/toggle');
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  afterAll(async () => {
    await page.close();
  });

  const type: SelectionType = 'point';

  it('should toggle values into/out of the store', async () => {
    await embed(spec('unit', 0, {type}));
    await page.evaluate(toggle('qq', 0, false));
    await page.evaluate(toggle('qq', 1, true));
    let store = await page.evaluate(toggle('qq', 2, true));
    expect(store).toHaveLength(3);
    await testRender('click_0');

    store = await page.evaluate(toggle('qq', 2, true));
    expect(store).toHaveLength(2);
    await testRender('click_1');

    store = await page.evaluate(toggle('qq', 3, false));
    expect(store).toHaveLength(1);
    await testRender('click_2');
  });

  it('should clear out the store w/o shiftKey', async () => {
    await embed(spec('unit', 1, {type}));
    await page.evaluate(toggle('qq', 0, false));
    await page.evaluate(toggle('qq', 1, true));
    await page.evaluate(toggle('qq', 2, true));
    await page.evaluate(toggle('qq', 3, true));
    await testRender(`clear_0`);

    let store = await page.evaluate(toggle('qq_clear', 0, true));
    expect(store).toHaveLength(4);
    await testRender(`clear_1`);

    store = await page.evaluate(toggle('qq_clear', 1, false));
    expect(store).toHaveLength(0);
    await testRender(`clear_2`);
  });

  it('should toggle binned fields', async () => {
    await embed(spec('unit', 0, {type, encodings: ['x', 'y']}, {x: {bin: true}, y: {bin: true}}));

    await page.evaluate(toggle('bins', 0, false));
    await page.evaluate(toggle('bins', 1, true));
    let store = await page.evaluate(toggle('bins', 2, true));
    expect(store).toHaveLength(3);
    await testRender('bins_0');

    store = await page.evaluate(toggle('bins', 2, true));
    expect(store).toHaveLength(2);
    await testRender('bins_1');

    store = await page.evaluate(toggle('bins', 3, false));
    expect(store).toHaveLength(1);
    await testRender('bins_2');
  });

  compositeTypes.forEach((specType, idx) => {
    it(`should toggle in ${specType} views`, async () => {
      await embed(spec(specType, idx, {type, resolve: 'union'}));
      let length = 0;
      for (let i = 0; i < hits.composite.length; i++) {
        const parent = parentSelector(specType, i % 3);
        const store = (await page.evaluate(toggle('composite', i, true, parent))) as string;
        expect((length = store.length)).toEqual(i + 1);
        if (i % 3 === 2) {
          await testRender(`${specType}_${i}`);
        }
      }

      for (let i = 0; i < hits.composite.length; i++) {
        const even = i % 2 === 0;
        const parent = parentSelector(specType, ~~(i / 2));
        const store = await page.evaluate(toggle('qq_clear', 0, even, parent));
        expect(store).toHaveLength(even ? length : (length = length - 2));
        if (!even) {
          await testRender(`${specType}_clear_${i}`);
        }
      }
    });
  });
});
