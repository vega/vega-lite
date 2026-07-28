import {TopLevelSpec} from '../src/index.js';
import {embed} from './util.js';
import {describe, expect, it} from 'vitest';

// @ts-expect-error ts doesn't support ?url
import gapminderData from '../examples/specs/data/gapminder.json?url';

const gapminderSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
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

  it('moves marks continuously between keyframes when given a key', async () => {
    const view = await embed(
      {
        ...gapminderSpec,
        width: 200,
        height: 200,
        encoding: {
          ...gapminderSpec.encoding,
          time: {...gapminderSpec.encoding.time, key: {field: 'country'}},
        },
      } as TopLevelSpec,
      false,
    );
    await view.runAsync();
    await view.signal('is_playing', false).runAsync();

    const firstMark = () => {
      const symbols = view.scenegraph().root.items[0].items.find((i: any) => i.marktype === 'symbol');
      return {x: symbols.items[0].x, y: symbols.items[0].y};
    };

    const at = async (clock: number) => {
      await view.signal('anim_clock', clock).runAsync();
      return {tween: view.signal('anim_tween'), value: view.signal('anim_value'), ...firstMark()};
    };

    // one keyframe spans 500ms at the default frame rate
    const start = await at(0);
    const quarter = await at(125);
    const half = await at(250);
    const end = await at(499);
    const nextFrame = await at(500);

    expect(start.tween).toBe(0);
    expect(half.tween).toBeCloseTo(0.5, 2);

    // the mark travels monotonically across the gap rather than jumping at the
    // frame boundary
    const ys = [start.y, quarter.y, half.y, end.y];
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]).not.toBe(ys[i - 1]);
    }
    expect(ys.every((y, i) => i === 0 || y < ys[i - 1])).toBe(true);

    // and arrives where the next keyframe starts, so there is no visible seam
    expect(nextFrame.value).toBe(1960);
    expect(nextFrame.tween).toBe(0);
    expect(nextFrame.y).toBeCloseTo(end.y, 1);
  });
});
