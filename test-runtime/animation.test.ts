import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';
import {describe, expect, it} from 'vitest';

import gapminderData from '../examples/specs/data/gapminder.json?url';

const gapminderSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    url: gapminderData,
  },
  mark: 'point',
  params: [
    {
      name: 'avl',
      select: {
        type: 'point',
        fields: ['year'],
        on: 'timer',
      },
    },
  ],
  transform: [
    {
      filter: {
        param: 'avl',
      },
    },
  ],
  encoding: {
    color: {
      field: 'country',
    },
    x: {
      field: 'fertility',
      type: 'quantitative',
    },
    y: {
      field: 'life_expect',
      type: 'quantitative',
    },
    time: {
      field: 'year',
      sort: 'ascending',
    },
  },
};

describe('time encoding animations', () => {
  it('renders a frame for each anim_value', async () => {
    const view = await embed(gapminderSpec, false);
    await view.runAsync(); // Ensure initial initialization is complete
    view.signal('is_playing', false);
    await view.runAsync();
    expect(view.signal('is_playing')).toBe(false);
    console.log('nice');

    const domain = [1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005];

    for (let i = 0; i < domain.length; i++) {
      view.signal('anim_clock', i * 500);
      await view.runAsync();

      const anim_value = view.signal('anim_value');
      expect(anim_value).toBe(domain[i]);

      const curr_dataset = view.data('source_0_curr');
      const time_field = gapminderSpec.encoding.time.field as string;
      const filteredDataset = curr_dataset.filter((d) => d[time_field] === anim_value);

      expect(filteredDataset).toHaveLength(curr_dataset.length);

      await expect(await view.toSVG()).toMatchFileSnapshot(`./resources/animation/gapminder_${anim_value}.svg`);
    }
  });
});
