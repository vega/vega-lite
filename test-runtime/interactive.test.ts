import {parse, View} from 'vega';
import {describe, expect, it} from 'vitest';
import {compile} from '../src/compile/compile.js';
import {TopLevelSpec} from '../src/spec/index.js';

describe.each(['svg', 'canvas'] as const)('mark interactivity with the %s renderer', (renderer) => {
  it.each([undefined, false, true])('routes events over a label with interactive=%s', async (interactive) => {
    const spec: TopLevelSpec = {
      width: 100,
      height: 100,
      padding: 0,
      data: {values: [{x: 'A', y: 'B', value: 25}]},
      encoding: {
        x: {field: 'x', type: 'ordinal', axis: null},
        y: {field: 'y', type: 'ordinal', axis: null},
      },
      layer: [
        {mark: 'rect', encoding: {tooltip: {field: 'value', type: 'quantitative'}}},
        {
          mark: {type: 'text', fontSize: 30, ...(interactive === undefined ? {} : {interactive})},
          encoding: {text: {field: 'value', type: 'quantitative'}},
        },
      ],
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    const view = new View(parse(compile(spec).spec), {container, renderer});

    try {
      await view.runAsync();
      let hovered: string;
      let clicked: string;
      view.addEventListener('pointermove', (_event, item) => (hovered = item?.mark.marktype));
      view.addEventListener('click', (_event, item) => (clicked = item?.mark.marktype));

      const bounds = container.querySelector(renderer).getBoundingClientRect();
      const clientX = bounds.left + bounds.width / 2;
      const clientY = bounds.top + bounds.height / 2;
      const target = document.elementFromPoint(clientX, clientY);
      target.dispatchEvent(new PointerEvent('pointermove', {clientX, clientY, bubbles: true}));
      // Canvas only fires a click when the press and release target the same item.
      target.dispatchEvent(new PointerEvent('pointerdown', {clientX, clientY, bubbles: true, buttons: 1}));
      target.dispatchEvent(new MouseEvent('mousedown', {clientX, clientY, bubbles: true, buttons: 1}));
      target.dispatchEvent(new PointerEvent('pointerup', {clientX, clientY, bubbles: true}));
      target.dispatchEvent(new MouseEvent('mouseup', {clientX, clientY, bubbles: true}));
      target.dispatchEvent(new MouseEvent('click', {clientX, clientY, bubbles: true}));

      const expected = interactive === false ? 'rect' : 'text';
      expect(hovered).toBe(expected);
      expect(clicked).toBe(expected);
    } finally {
      view.finalize();
      container.remove();
    }
  });
});
