import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';
import {describe, expect, it} from 'vitest';

// @ts-expect-error ts doesn't support ?url
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
  it.skip('renders a frame for each anim_value', async () => {
    const view = await embed(gapminderSpec, false);
    await view.runAsync(); // Ensure initial initialization is complete

    await view.signal('is_playing', false).runAsync();
    expect(view.signal('is_playing')).toBe(false);

    const domain = [1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005];

    for (let i = 0; i < domain.length; i++) {
      await view.signal('anim_clock', i * 500).runAsync();

      const anim_value = view.signal('anim_value');
      expect(anim_value).toBe(domain[i]);

      const curr_dataset = view.data('source_0_curr');
      const time_field = gapminderSpec.encoding.time.field as string;
      const filteredDataset = curr_dataset.filter((d) => d[time_field] === anim_value);

      // expect the current dataset to only contain data for the current frame
      expect(curr_dataset).toHaveLength(filteredDataset.length);

      await expect(await view.toSVG()).toMatchFileSnapshot(`./resources/animation/gapminder_${anim_value}.svg`);
    }
  });
});
