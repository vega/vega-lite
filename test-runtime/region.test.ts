import {SELECTION_ID, SelectionType} from '../src/selection.js';
import {clearRegion, embed, circleRegion, polygonRegion, getSpec, hits as hitsMaster} from './util.js';
import {describe, expect, it} from 'vitest';

describe('region selections at runtime in unit views', () => {
  const type: SelectionType = 'region';
  const hits = hitsMaster.region;

  it('should add values to the store for circle regions', async () => {
    for (const [i, hit] of hits.circle.entries()) {
      const view = await embed(getSpec('unit', 0, {type}));
      const store = await view.getState().data['sel_store'];

      circleRegion(hit.id);
      expect(store).toHaveLength(hit.count);
      expect(store[0].fields).toBeUndefined();
      expect(store[0].values).toBeUndefined();
      for (const t of store) {
        expect(t).toHaveProperty(SELECTION_ID);
      }

      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/${type}/unit/circle_${i}.svg`);
    }
  });

  it('should add values to the store for complex polygons', async () => {
    for (const [i, hit] of hits.polygon.entries()) {
      const view = await embed(getSpec('unit', 0, {type}));
      const store = await view.getState().data['sel_store'];

      polygonRegion(hit.id, hit.coords);
      expect(store).toHaveLength(hit.count);
      expect(store[0].fields).toBeUndefined();
      expect(store[0].values).toBeUndefined();
      for (const t of store) {
        expect(t).toHaveProperty(SELECTION_ID);
      }

      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/${type}/unit/polygon_${i}.svg`);
    }
  });

  it('should clear out stored extents', async () => {
    const view = await embed(getSpec('unit', 0, {type}));
    const store = await view.getState().data['sel_store'];

    const hit = hits.circle[0];
    circleRegion(hit.id);
    expect(store).toHaveLength(hit.count);

    clearRegion(hits.circle_clear[0].id);
    expect(store).toHaveLength(0);

    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/${type}/unit/clear_0.svg`);
  });
});
