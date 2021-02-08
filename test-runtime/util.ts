import * as fs from 'fs';
import {sync as mkdirp} from 'mkdirp';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';
import {promisify} from 'util';
import {stringValue} from 'vega-util';
import {SelectionResolution, SelectionType} from '../src/selection';
import {NormalizedLayerSpec, NormalizedUnitSpec, TopLevelSpec} from '../src/spec';

const generate = process.env.VL_GENERATE_TESTS;
const output = 'test-runtime/resources';

export type ComposeType = 'unit' | 'repeat' | 'facet';
export const selectionTypes: SelectionType[] = ['point', 'interval'];
export const compositeTypes: ComposeType[] = ['repeat', 'facet'];
export const resolutions: SelectionResolution[] = ['union', 'intersect'];

export const bound = 'bound';
export const unbound = 'unbound';

export const tuples = [
  {a: 0, b: 28, c: 0},
  {a: 0, b: 55, c: 1},
  {a: 0, b: 23, c: 2},
  {a: 1, b: 43, c: 0},
  {a: 1, b: 91, c: 1},
  {a: 1, b: 54, c: 2},
  {a: 2, b: 81, c: 0},
  {a: 2, b: 53, c: 1},
  {a: 2, b: 76, c: 2},
  {a: 3, b: 19, c: 0},
  {a: 3, b: 87, c: 1},
  {a: 3, b: 12, c: 2},
  {a: 4, b: 52, c: 0},
  {a: 4, b: 48, c: 1},
  {a: 4, b: 35, c: 2},
  {a: 5, b: 24, c: 0},
  {a: 5, b: 49, c: 1},
  {a: 5, b: 48, c: 2},
  {a: 6, b: 87, c: 0},
  {a: 6, b: 66, c: 1},
  {a: 6, b: 23, c: 2},
  {a: 7, b: 17, c: 0},
  {a: 7, b: 27, c: 1},
  {a: 7, b: 39, c: 2},
  {a: 8, b: 68, c: 0},
  {a: 8, b: 16, c: 1},
  {a: 8, b: 67, c: 2},
  {a: 9, b: 49, c: 0},
  {a: 9, b: 15, c: 1},
  {a: 9, b: 48, c: 2}
];

const UNIT_NAMES = {
  repeat: ['child__row_d', 'child__row_e', 'child__row_f'],
  facet: ['child__facet_row_0', 'child__facet_row_1', 'child__facet_row_2']
};

export const hits = {
  discrete: {
    qq: [8, 19],
    qq_clear: [5, 16],

    bins: [4, 29],
    bins_clear: [18, 7],

    repeat: [5, 10, 17],
    repeat_clear: [13, 14, 2],

    facet: [2, 6, 9],
    facet_clear: [3, 4, 8]
  },

  interval: {
    drag: [
      [5, 14],
      [18, 26]
    ],
    drag_clear: [[5], [16]],
    translate: [
      [6, 16],
      [24, 8]
    ],

    bins: [
      [4, 8],
      [2, 7]
    ],
    bins_clear: [[5], [9]],
    bins_translate: [
      [5, 7],
      [1, 8]
    ],

    repeat: [
      [8, 29],
      [11, 26],
      [7, 21]
    ],
    repeat_clear: [[8], [11], [17]],

    facet: [
      [1, 9],
      [2, 8],
      [4, 10]
    ],
    facet_clear: [[3], [5], [7]]
  }
};

function base(iter: number, selDef: any, opts: any = {}): NormalizedUnitSpec | NormalizedLayerSpec {
  const data = {values: opts.values ?? tuples};
  const x = {field: 'a', type: 'quantitative', ...opts.x};
  const y = {field: 'b', type: 'quantitative', ...opts.y};
  const color = {field: 'c', type: 'nominal', ...opts.color};
  const size = {value: 100, ...opts.size};
  const {bind, ...select} = selDef;
  const params = [{name: 'sel', select, bind}];
  const mark = 'circle';

  if (iter % 2 === 0) {
    return {
      data,
      params,
      mark,
      encoding: {
        x,
        y,
        size,
        color: {
          condition: {param: 'sel', ...color},
          value: 'grey'
        }
      }
    };
  } else {
    return {
      data,
      layer: [
        {
          params,
          mark,
          encoding: {
            x,
            y,
            size,
            color,
            opacity: {value: 0.25}
          }
        },
        {
          transform: [{filter: {param: 'sel'}}],
          mark,
          encoding: {x, y, size, color}
        }
      ]
    };
  }
}

export function spec(compose: ComposeType, iter: number, sel: any, opts: any = {}): TopLevelSpec {
  const {data, ...specification} = base(iter, sel, opts);
  const resolve = opts.resolve;
  const config = {
    // reduce changes in generated SVGs
    aria: false,

    // A lot of magic numbers in this file use the old step = 21
    view: {discreteWidth: {step: 21}, discreteHeight: {step: 21}}
  };
  switch (compose) {
    case 'unit':
      return {data, ...specification, config} as TopLevelSpec;
    case 'facet':
      return {
        data,
        facet: {row: {field: 'c', type: 'nominal'}},
        spec: specification,
        resolve,
        config
      } as TopLevelSpec;
    case 'repeat':
      return {
        data,
        repeat: {row: ['d', 'e', 'f']},
        spec: specification,
        resolve,
        config
      } as TopLevelSpec;
  }
}

export function unitNameRegex(specType: ComposeType, idx: number) {
  const name = UNIT_NAMES[specType][idx].replace('child_', '');
  return new RegExp(`child(.*?)_${name}`);
}

export function parentSelector(compositeType: ComposeType, index: number) {
  return compositeType === 'facet' ? `cell > g:nth-child(${index + 1})` : `${UNIT_NAMES.repeat[index]}_group`;
}

export function brush(key: string, idx: number, parent?: string, targetBrush?: boolean) {
  const fn = key.match('_clear') ? 'clear' : 'brush';
  return `${fn}(${hits.interval[key][idx].join(', ')}, ${stringValue(parent)}, ${!!targetBrush})`;
}

export function pt(key: string, idx: number, parent?: string) {
  const fn = key.match('_clear') ? 'clear' : 'pt';
  return `${fn}(${hits.discrete[key][idx]}, ${stringValue(parent)})`;
}

export function embedFn(page: Page) {
  return async (specification: TopLevelSpec) => {
    await page.evaluate(
      (_: any) => window['embed'](_),
      // specification is serializable even if the types don't agree
      specification as any
    );
  };
}

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export async function svg(page: Page, path: string, filename: string) {
  const svgString = (await page.evaluate(
    `(async () => { vega.resetSVGClipId(); await view.runAsync(); return await view.toSVG() })()`
  )) as string;

  if (generate) {
    mkdirp((path = `${output}/${path}`));
    await writeFileAsync(`${path}/${filename}.svg`, svgString);
  }

  return svgString;
}

export function testRenderFn(page: Page, path: string) {
  return async (filename: string) => {
    const render = await svg(page, path, filename);
    const file = await readFileAsync(`${output}/${path}/${filename}.svg`);
    expect(render).toBe(file.toString());
  };
}

export function fill<T>(val: T, len: number) {
  const arr = new Array<T>(len);
  for (let i = 0; i < len; ++i) {
    arr[i] = val;
  }
  return arr;
}
