import {View} from 'vega';
import {describe, expect, it} from 'vitest';
import {TopLevelSpec} from '../src/index.js';
import {coords, embed, pointerEvt} from './util.js';

function legendSpec(toggle?: 'true'): TopLevelSpec {
  return {
    data: {
      values: [
        {x: 1, y: 1, first: 'A', second: 'X'},
        {x: 2, y: 2, first: 'B', second: 'Y'},
      ],
    },
    params: ['first', 'second'].map((field) => ({
      name: `${field}_selection`,
      select: {type: 'point' as const, fields: [field], ...(toggle === undefined ? {} : {toggle})},
      bind: 'legend' as const,
    })),
    mark: 'point',
    encoding: {
      x: {field: 'x', type: 'quantitative'},
      y: {field: 'y', type: 'quantitative'},
      color: {field: 'first', type: 'nominal'},
      shape: {field: 'second', type: 'nominal'},
    },
  };
}

async function clickLegend(view: View, legend: number, entry: number, shiftKey = false, labels = false) {
  const group = document.querySelectorAll('g.role-legend')[legend];
  const element = group.querySelectorAll<HTMLElement>(
    labels ? 'g.role-legend-label text' : 'g.role-legend-symbol path',
  )[entry];
  expect(element).toBeDefined();
  const [clientX, clientY] = coords(element);
  const event = {clientX, clientY, shiftKey};
  pointerEvt('click', element, event);
  await view.runAsync();
}

function selected(view: View, field: 'first' | 'second') {
  return view.data(`${field}_selection_store`).map((tuple) => tuple.values);
}

describe('Independent legend selections at runtime', () => {
  it('toggles only the clicked legend, including repeated clicks on the same entry', async () => {
    const view = await embed(legendSpec('true'));
    try {
      await clickLegend(view, 0, 0);
      expect(selected(view, 'first')).toEqual([['A']]);

      await clickLegend(view, 1, 0);
      expect(selected(view, 'first')).toEqual([['A']]);
      expect(selected(view, 'second')).toEqual([['X']]);

      await clickLegend(view, 1, 0);
      expect(selected(view, 'first')).toEqual([['A']]);
      expect(selected(view, 'second')).toEqual([]);

      await clickLegend(view, 0, 1);
      expect(selected(view, 'first')).toEqual([['A'], ['B']]);
      expect(selected(view, 'second')).toEqual([]);

      await clickLegend(view, 0, 0);
      expect(selected(view, 'first')).toEqual([['B']]);
    } finally {
      view.finalize();
    }
  });

  it('preserves Shift toggling and background clearing across legends', async () => {
    const view = await embed(legendSpec());
    try {
      await clickLegend(view, 0, 0, false, true);
      await clickLegend(view, 0, 1, true, true);
      expect(selected(view, 'first')).toEqual([['A'], ['B']]);

      await clickLegend(view, 1, 0, false, true);
      expect(selected(view, 'first')).toEqual([['A'], ['B']]);
      expect(selected(view, 'second')).toEqual([['X']]);

      await clickLegend(view, 1, 1, true, true);
      expect(selected(view, 'first')).toEqual([['A'], ['B']]);
      expect(selected(view, 'second')).toEqual([['X'], ['Y']]);

      pointerEvt('click', document.querySelector('svg'), {clientX: 0, clientY: 0});
      await view.runAsync();
      expect(selected(view, 'first')).toEqual([]);
      expect(selected(view, 'second')).toEqual([]);
    } finally {
      view.finalize();
    }
  });
});
