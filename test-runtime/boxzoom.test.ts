import {View} from 'vega';
import {describe, expect, it} from 'vitest';
import {
  brush,
  coords,
  embed,
  getGeoSpec,
  getMark,
  getSpec,
  hits as hitsMaster,
  parentSelector,
  pointerEvt,
  resolutions,
} from './util.js';

const hits = hitsMaster.interval;

function scaleDomain(view: View, name: string) {
  return ((view as any)._runtime.scales[name].value as any).domain();
}

async function dblclick(view: View, id: number, parent?: string) {
  const el = getMark(id, parent);
  const [clientX, clientY] = coords(el);
  pointerEvt('dblclick', el, {clientX, clientY});
  return view.runAsync();
}

describe('Box zoom interval selections at runtime', () => {
  const type = 'interval';

  it('narrows the x/y scale domains on drag-release and clears the brush', async () => {
    for (let i = 0; i < hits.drag.length; i++) {
      const view = await embed(getSpec('unit', i, {type, boxZoom: true}));
      const xold = scaleDomain(view, 'x');
      const yold = scaleDomain(view, 'y');

      const store = (await brush(view, 'drag', i)) as [any];
      // The brush auto-clears itself right after committing the zoom.
      expect(store).toHaveLength(0);

      const xnew = scaleDomain(view, 'x');
      const ynew = scaleDomain(view, 'y');
      expect(xnew[1] - xnew[0]).toBeLessThan(xold[1] - xold[0]);
      expect(ynew[1] - ynew[0]).toBeLessThan(yold[1] - yold[0]);

      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/boxzoom/unit_${i}.svg`);
    }
  });

  it('respects channel projections (x-only box zoom leaves y untouched)', async () => {
    const view = await embed(getSpec('unit', 0, {type, boxZoom: true, encodings: ['x']}));
    const xold = scaleDomain(view, 'x');
    const yold = scaleDomain(view, 'y');

    await brush(view, 'drag', 0);

    const xnew = scaleDomain(view, 'x');
    const ynew = scaleDomain(view, 'y');
    expect(xnew).not.toEqual(xold);
    expect(ynew).toEqual(yold);
  });

  it('composes across repeated drags (zooming in twice narrows further)', async () => {
    const view = await embed(getSpec('unit', 0, {type, boxZoom: true}));

    await brush(view, 'drag', 0);
    const xafter1 = scaleDomain(view, 'x');
    const width1 = xafter1[1] - xafter1[0];

    await brush(view, 'drag', 1);
    const xafter2 = scaleDomain(view, 'x');
    const width2 = xafter2[1] - xafter2[0];

    expect(width2).toBeLessThan(width1);
  });

  it('resets to the original domain on double-click', async () => {
    const view = await embed(getSpec('unit', 0, {type, boxZoom: true}));
    const xold = scaleDomain(view, 'x');
    const yold = scaleDomain(view, 'y');

    await brush(view, 'drag', 0);
    expect(scaleDomain(view, 'x')).not.toEqual(xold);

    await dblclick(view, hits.drag[0][0]);
    expect(scaleDomain(view, 'x')).toEqual(xold);
    expect(scaleDomain(view, 'y')).toEqual(yold);
  });

  it('warns and falls back to plain interval-selection behavior for geographic views', async () => {
    // boxZoom has no effect on a projected (longitude/latitude) selection --
    // it should behave exactly like a regular interval brush: populate the
    // store, no scale mutation attempted.
    const view = await embed(getGeoSpec({boxZoom: true}));
    const store: any = await brush(view, 'drag', 1);
    expect(store.length).toBeGreaterThan(0);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/boxzoom/geo.svg`);
  });

  for (const resolve of resolutions) {
    it(`warns and falls back to plain interval-selection behavior when resolve is "${resolve}"`, async () => {
      const view = await embed(getSpec('unit', 0, {type, resolve, boxZoom: true}));
      const xold = scaleDomain(view, 'x');
      const store = (await brush(view, 'drag', 0)) as [any];
      // Falls back to being a normal (non-zooming) brush: the store gets an
      // extent, but the scale itself is left alone.
      expect(store).toHaveLength(1);
      expect(scaleDomain(view, 'x')).toEqual(xold);
    });
  }

  // `getSpec`'s repeat/facet helper reuses the same fields ('a'/'b') across
  // every cell (unlike a real repeat spec, which typically varies the field
  // per cell via `{repeat: 'row'}`) -- since the box zoom commit signal is
  // keyed by field, cells sharing a field also legitimately share one commit
  // signal, so all cells zoom together here. This matches how the selection
  // itself already behaves under the default `resolve: "global"` (see
  // resolve.test.ts) -- it's the *different*-field case (a real repeat/SPLOM
  // varying fields per cell) that must stay independent, which is covered at
  // the compile level in test/compile/selection/boxzoom.test.ts.
  it('facet: shares the default (already-shared) x/y scales across cells', async () => {
    const view = await embed(getSpec('facet', 0, {type, boxZoom: true}));
    const parent0 = parentSelector('facet', 0);
    const xold = scaleDomain(view, 'x');

    await brush(view, 'facet', 0, parent0);

    const xnew = scaleDomain(view, 'x');
    expect(xnew[1] - xnew[0]).toBeLessThan(xold[1] - xold[0]);
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/boxzoom/facet.svg`);
  });

  it('repeat: cells sharing a field zoom together via the shared commit signal', async () => {
    const view = await embed(getSpec('repeat', 0, {type, boxZoom: true}));
    const cell0 = 'child__row_d_x';
    const cell1 = 'child__row_e_x';
    const xold = scaleDomain(view, cell0);

    await brush(view, 'repeat', 0, parentSelector('repeat', 0));

    const x0new = scaleDomain(view, cell0);
    const x1new = scaleDomain(view, cell1);
    expect(x0new[1] - x0new[0]).toBeLessThan(xold[1] - xold[0]);
    expect(x1new).toEqual(x0new); // same field ('a') -> shared commit signal
    await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/interval/boxzoom/repeat.svg`);
  });
});
