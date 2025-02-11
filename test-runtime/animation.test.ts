import {Datum} from 'vega';
import {TopLevelSpec} from '../src';
import {embedFn, getSignal, getState, setSignal, sleep, testRenderFn} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';

const gapminderSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    url: 'gapminder.json'
  },
  mark: 'point',
  params: [
    {
      name: 'avl',
      select: {
        type: 'point',
        fields: ['year'],
        on: 'timer'
      }
    }
  ],
  transform: [
    {
      filter: {
        param: 'avl'
      }
    }
  ],
  encoding: {
    color: {
      field: 'country'
    },
    x: {
      field: 'fertility',
      type: 'quantitative'
    },
    y: {
      field: 'life_expect',
      type: 'quantitative'
    },
    time: {
      field: 'year'
    }
  }
};

describe('time encoding animations', () => {
  let page: Page;
  let embed: (specification: TopLevelSpec) => Promise<void>;
  let testRender: (filename: string) => Promise<void>;

  beforeAll(async () => {
    page = await (global as any).__BROWSER_GLOBAL__.newPage();
    embed = embedFn(page);
    testRender = testRenderFn(page, 'animation');
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  afterAll(async () => {
    await page.close();
  });

  it('renders a frame for each anim_value', async () => {
    await embed(gapminderSpec);

    await page.evaluate(setSignal('is_playing', false));

    const domain = [1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005];

    for (let i = 0; i < domain.length; i++) {
      await page.evaluate(setSignal('anim_clock', i * 500));
      await sleep(100);

      const state = (await page.evaluate(getState(['anim_value'], ['source_0_curr']))) as {signals: any; data: any};
      const anim_value = state.signals['anim_value'];

      expect(anim_value).toBe(domain[i]);

      const curr_dataset = state.data['source_0_curr'] as Datum[];
      const time_field = gapminderSpec.encoding.time.field as string;
      const filteredDataset = curr_dataset.filter(d => d[time_field] === anim_value);

      expect(filteredDataset).toHaveLength(curr_dataset.length);

      await testRender(`gapminder_${anim_value}`);
    }
  }, 10000);

  it('anim_clock makes forward progress', async () => {
    await embed(gapminderSpec);

    let anim_clock = (await page.evaluate(getSignal('anim_clock'))) as number;
    let prev_anim_clock = anim_clock;

    for (let i = 0; i < 10; i++) {
      await sleep(100);
      anim_clock = (await page.evaluate(getSignal('anim_clock'))) as number;
      expect(anim_clock).toBeGreaterThan(prev_anim_clock);
      prev_anim_clock = anim_clock;
    }
  }, 10000);

  it('anim_clock loops', async () => {
    await embed(gapminderSpec);

    const max_range_extent = (await page.evaluate(getSignal('max_range_extent'))) as number;

    await sleep(max_range_extent);

    const anim_clock = await page.evaluate(getSignal('anim_clock'));

    expect(anim_clock).toBeLessThanOrEqual(max_range_extent);
  }, 10000);
});
