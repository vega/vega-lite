import {describe, expect, it} from 'vitest';
import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';

describe('ARIA guides', () => {
  it('uses axis description as the rendered aria-label', async () => {
    const spec: TopLevelSpec = {
      data: {
        values: [
          {a: 'A', b: 28},
          {a: 'B', b: 55},
        ],
      },
      mark: 'bar',
      encoding: {
        x: {
          field: 'a',
          type: 'nominal',
          axis: {description: 'Custom x-axis label'},
        },
        y: {field: 'b', type: 'quantitative'},
      },
    };

    const view = await embed(spec);
    const svg = await view.toSVG();

    expect(svg).toContain('aria-label="Custom x-axis label"');
    expect(svg).not.toContain('aria-label="X-axis titled');
  });
});
