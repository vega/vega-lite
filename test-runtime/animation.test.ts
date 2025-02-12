import {Datum} from 'vega';
import {TopLevelSpec} from '../src/index.js';
import {embed, getSignal, getState, setSignal, sleep} from './util.js';
import {describe, expect, it} from 'vitest';

import gapminderData from './gapminder.json' with {type: 'json'};

const gapminderSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: gapminderData,
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
    },
  },
};

describe('time encoding animations', () => {
  it('renders a frame for each anim_value', async () => {
    const view = await embed(gapminderSpec);

    expect(await getSignal(view, 'is_playing')).toBe(false);

    const domain = [1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005];

    for (let i = 0; i < domain.length; i++) {
      await setSignal(view, 'anim_clock', i * 500);
      await sleep(100);

      const anim_clock = await getState(view, ['anim_value'], ['source_0_curr']);
      const anim_value = anim_clock.signals['anim_value'];

      expect(anim_value).toBe(domain[i]);

      const curr_dataset = anim_clock.data['source_0_curr'] as Datum[];
      const time_field = gapminderSpec.encoding.time.field as string;
      const filteredDataset = curr_dataset.filter((d) => d[time_field] === anim_value);

      expect(filteredDataset).toHaveLength(curr_dataset.length);

      await expect(await view.toSVG()).toMatchFileSnapshot(`./snapshots/gapminder_${anim_value}.svg`);
    }
  }, 10000);

  it('anim_clock makes forward progress', async () => {
    const view = await embed(gapminderSpec);

    let anim_clock = (await getSignal(view, 'anim_clock')) as number;
    let prev_anim_clock = anim_clock;

    for (let i = 0; i < 10; i++) {
      await sleep(100);
      anim_clock = (await getSignal(view, 'anim_clock')) as number;
      expect(anim_clock).toBeGreaterThan(prev_anim_clock);
      prev_anim_clock = anim_clock;
    }
  }, 10000);

  it('anim_clock loops', async () => {
    const view = await embed(gapminderSpec);

    const max_range_extent = (await getSignal(view, 'max_range_extent')) as number;

    await sleep(max_range_extent);

    const anim_clock = (await getSignal(view, 'anim_clock')) as number;

    expect(anim_clock).toBeLessThanOrEqual(max_range_extent);
  }, 10000);
});
