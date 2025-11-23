import {describe, expect, it} from 'vitest';
import {
  circleRegion,
  clearRegion,
  embed,
  polygonRegion,
  getSpec,
  hits as hitsMaster,
  expectMatchFileSnapshot,
} from './util.js';
import {SelectionType, SELECTION_ID} from '../src/selection.js';

describe('region selections at runtime', () => {
  const type: SelectionType = 'region';
  const hits = hitsMaster.region;

  it('should add values to the store for circle regions', async () => {
    for (const [i, hit] of hits.circle.entries()) {
      const view = await embed(getSpec('unit', 0, {type}));
      const store = await circleRegion(view, hit.id);
      expect(store).toHaveLength(hit.count);
      for (const t of store) {
        expect(t).toHaveProperty(SELECTION_ID);
      }
      await expectMatchFileSnapshot(view, `region/unit/circle_${i}`);
    }
  });

  it('should add values to the store for complex polygons', async () => {
    for (const [i, hit] of hits.polygon.entries()) {
      const view = await embed(getSpec('unit', 0, {type}));
      const store = await polygonRegion(view, hit.id, hit.coords);

      expect(store).toHaveLength(hit.count);
      for (const t of store) {
        expect(t).toHaveProperty(SELECTION_ID);
      }
      await expectMatchFileSnapshot(view, `region/unit/polygon_${i}`);
    }
  });

  it('should clear out stored extents', async () => {
    const view = await embed(getSpec('unit', 0, {type}));
    const hit = hits.circle[0];

    let store = await circleRegion(view, hit.id);
    expect(store).toHaveLength(hit.count);

    store = await clearRegion(view, hits.circle_clear[0].id);
    expect(store).toHaveLength(0);

    await expectMatchFileSnapshot(view, `region/unit/clear_0`);
  });
});
