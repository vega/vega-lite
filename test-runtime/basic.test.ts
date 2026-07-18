import {describe, expect, it} from 'vitest';
import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';

describe('Basic', () => {
  it('should render a chart', async () => {
    const spec: TopLevelSpec = {
      mark: 'bar',
      data: {
        values: [
          {a: 'A', b: 28},
          {a: 'B', b: 55},
          {a: 'C', b: 43},
          {a: 'D', b: 91},
          {a: 'E', b: 81},
          {a: 'F', b: 53},
          {a: 'G', b: 19},
          {a: 'H', b: 87},
          {a: 'I', b: 52},
        ],
      },
      encoding: {
        x: {field: 'a'},
        y: {field: 'b', type: 'quantitative'},
      },
    };

    const view = await embed(spec);

    const svg = await view.toSVG();

    await expect(svg).toMatchFileSnapshot('./snapshots/basic.svg');
  });
});
