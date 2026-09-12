import {describe, expect, it} from 'vitest';
import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';

describe('ARIA guides', () => {
  it('uses legend description as the rendered aria-label', async () => {
    const spec: TopLevelSpec = {
      data: {
        values: [
          {category: 'A', value: 28},
          {category: 'B', value: 55},
        ],
      },
      mark: 'point',
      encoding: {
        x: {field: 'value', type: 'quantitative'},
        y: {field: 'category', type: 'nominal'},
        color: {
          field: 'category',
          type: 'nominal',
          legend: {description: 'Custom color legend'},
        },
      },
    };

    const view = await embed(spec);
    const svg = await view.toSVG();

    expect(svg).toContain('aria-label="Custom color legend"');
    expect(svg).not.toContain('aria-label="Symbol legend');
  });
});
