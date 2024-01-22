import {TopLevelSpec} from '../src';
import {embedFn, getDataset, getSignal, sleep, testRenderFn} from './util';
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

  it('renders a frame that matches the anim value', async () => {
    await embed(gapminderSpec);

    await sleep(1000);

    const curr_dataset = (await page.evaluate(getDataset('source_0_curr'))) as object[];
    const anim_value = await page.evaluate(getSignal('anim_value'));

    const time_field = gapminderSpec.encoding.time.field as string;

    const filteredDataset = curr_dataset.filter(d => d[time_field] === anim_value);

    expect(filteredDataset).toHaveLength(curr_dataset.length);
    await testRender(`gapminder_${anim_value}`);
  });
});
