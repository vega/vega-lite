import {SelectionType} from '../src/selection.js';
import {compositeTypes, embed, parentSelector, getSpec, clear, _pt} from './util.js';
import {describe, expect, it} from 'vitest';
import {View} from 'vega';

const hits = {
  qq: [8, 19, 13, 21],
  qq_clear: [5, 16],
  bins: [4, 29, 16, 9],
  bins_clear: [18, 7],
  composite: [1, 3, 5, 7, 8, 9],
} as const;

function toggle(view: View, key: keyof typeof hits, idx: number, shiftKey: boolean, parent?: string) {
  const fn = key.match('_clear') ? clear : _pt;
  return fn(view, hits[key][idx], parent, !!shiftKey);
}

describe('Toggle point selections at runtime', () => {
  const type: SelectionType = 'point';

  it('should toggle values into/out of the store', async () => {
    const view = await embed(getSpec('unit', 0, {type}));
    await toggle(view, 'qq', 0, false);
    await toggle(view, 'qq', 1, true);
    let store = await toggle(view, 'qq', 2, true);
    expect(store).toHaveLength(3);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/click_0.svg');

    store = await toggle(view, 'qq', 2, true);
    expect(store).toHaveLength(2);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/click_1.svg');

    store = await toggle(view, 'qq', 3, false);
    expect(store).toHaveLength(1);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/click_2.svg');
  });

  it('should clear out the store w/o shiftKey', async () => {
    const view = await embed(getSpec('unit', 1, {type}));
    await toggle(view, 'qq', 0, false);
    await toggle(view, 'qq', 1, true);
    await toggle(view, 'qq', 2, true);
    await toggle(view, 'qq', 3, true);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/point/toggle/clear_0.svg`);

    let store = await toggle(view, 'qq_clear', 0, true);
    expect(store).toHaveLength(4);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/point/toggle/clear_1.svg`);

    store = await toggle(view, 'qq_clear', 1, false);
    expect(store).toHaveLength(0);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/point/toggle/clear_2.svg`);
  });

  it('should toggle binned fields', async () => {
    const view = await embed(getSpec('unit', 0, {type, encodings: ['x', 'y']}, {x: {bin: true}, y: {bin: true}}));

    await toggle(view, 'bins', 0, false);
    await toggle(view, 'bins', 1, true);
    let store = await toggle(view, 'bins', 2, true);
    expect(store).toHaveLength(3);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/bins_0.svg');

    store = await toggle(view, 'bins', 2, true);
    expect(store).toHaveLength(2);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/bins_1.svg');

    store = await toggle(view, 'bins', 3, false);
    expect(store).toHaveLength(1);
    await expect(await view.toSVG()).toMatchFileSnapshot('./snapshots/point/toggle/bins_2.svg');
  });

  compositeTypes.forEach((specType, idx) => {
    it(`should toggle in ${specType} views`, async () => {
      const view = await embed(getSpec(specType, idx, {type, resolve: 'union'}));
      let length = 0;
      for (let i = 0; i < hits.composite.length; i++) {
        const parent = parentSelector(specType, i % 3);
        const store = await toggle(view, 'composite', i, true, parent);
        expect((length = store.length)).toEqual(i + 1);
        if (i % 3 === 2) {
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/point/toggle/${specType}_${i}.svg`);
        }
      }

      for (let i = 0; i < hits.composite.length; i++) {
        const even = i % 2 === 0;
        const parent = parentSelector(specType, ~~(i / 2));
        const store = await toggle(view, 'qq_clear', 0, even, parent);
        expect(store).toHaveLength(even ? length : (length -= 2));
        if (!even) {
          await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/point/toggle/${specType}_clear_${i}.svg`);
        }
      }
    });
  });
});
