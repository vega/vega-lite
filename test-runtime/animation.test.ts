import {TopLevelSpec} from '../src';
import {embedFn, getSignal, getState, sleep, testRenderFn} from './util';
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
    page = await (global as any).__BROWSER__.newPage();
    embed = embedFn(page);
    testRender = testRenderFn(page, 'animation');
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  afterAll(async () => {
    await page.close();
  });

  it('renders a frame that matches each anim value', async () => {
    await embed(gapminderSpec);

    for (let i = 1955; i <= 2005; i += 5) {
      await sleep(500);

      const state = (await page.evaluate(getState(['anim_value'], ['source_0_curr']))) as {signals: any; data: any};
      const anim_value = state.signals['anim_value'];
      const curr_dataset = state.data['source_0_curr'] as object[];
      await testRender(`gapminder_${anim_value}`);

      const time_field = gapminderSpec.encoding.time.field as string;

      const filteredDataset = curr_dataset.filter(d => d[time_field] === anim_value);

      expect(filteredDataset).toHaveLength(curr_dataset.length);
    }
  }, 10000);

  it('anim_clock makes forward progress', async () => {
    await embed(gapminderSpec);

    let anim_clock = (await page.evaluate(getSignal('anim_clock'))) as number;
    let prev_anim_clock = anim_clock;

    for (let i = 0; i < 10; i++) {
      await sleep(500);
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

    expect(anim_clock).toBeLessThan(max_range_extent);
  }, 10000);
});
