import {isString} from 'vega-util';

import {InlineDataset} from './data';
import * as log from './log';
import {Dict} from './util';

/**
 * @minimum 0
 */
export type Padding = number | {top?: number, bottom?: number, left?: number, right?: number};

export type Datasets = Dict<InlineDataset>;

export interface TopLevelProperties {
  /**
   * CSS color property to use as the background of visualization.
   *
   * __Default value:__ none (transparent)
   */
  background?: string;

  /**
   * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle.  If a number, specifies padding for all sides.
   * If an object, the value should have the format `{"left": 5, "top": 5, "right": 5, "bottom": 5}` to specify padding for each side of the visualization.
   *
   * __Default value__: `5`
   */
  padding?: Padding;

  /**
   * Sets how the visualization size should be determined. If a string, should be one of `"pad"`, `"fit"` or `"none"`.
   * Object values can additionally specify parameters for content sizing and automatic resizing.
   * `"fit"` is only supported for single and layered views that don't use `rangeStep`.
   *
   * __Default value__: `pad`
   */
  autosize?: AutosizeType | AutoSizeParams;

  /**
   * A global data store for named datasets. This is a mapping from names to inline datasets.
   * This can be an array of objects or primitive values or a string. Arrays of primitive values are ingested as objects with a `data` property.
   */
  datasets?: Datasets;
}

export type AutosizeType = 'pad' | 'fit' | 'none';

export interface AutoSizeParams {
  /**
   * The sizing format type. One of `"pad"`, `"fit"` or `"none"`. See the [autosize type](https://vega.github.io/vega-lite/docs/size.html#autosize) documentation for descriptions of each.
   *
   * __Default value__: `"pad"`
   */
  type?: AutosizeType;

  /**
   * A boolean flag indicating if autosize layout should be re-calculated on every view update.
   *
   * __Default value__: `false`
   */
  resize?: boolean;

  /**
   * Determines how size calculation should be performed, one of `"content"` or `"padding"`. The default setting (`"content"`) interprets the width and height settings as the data rectangle (plotting) dimensions, to which padding is then added. In contrast, the `"padding"` setting includes the padding within the view size calculations, such that the width and height settings indicate the **total** intended size of the view.
   *
   * __Default value__: `"content"`
   */
  contains?: 'content' | 'padding';
}

function _normalizeAutoSize(autosize: AutosizeType | AutoSizeParams) {
  return isString(autosize) ? {type: autosize} : autosize || {};
}

export function normalizeAutoSize(topLevelAutosize: AutosizeType | AutoSizeParams, configAutosize: AutosizeType | AutoSizeParams, isUnitOrLayer: boolean = true): AutoSizeParams {
  const autosize: AutoSizeParams = {
    type: 'pad',
    ..._normalizeAutoSize(configAutosize),
    ..._normalizeAutoSize(topLevelAutosize)
  };

  if (autosize.type === 'fit') {
    if (!isUnitOrLayer) {
      log.warn(log.message.FIT_NON_SINGLE);
      autosize.type = 'pad';
    }
  }

  return autosize;
}

const TOP_LEVEL_PROPERTIES: (keyof TopLevelProperties)[] = [
  'background', 'padding', 'datasets'
  // We do not include "autosize" here as it is supported by only unit and layer specs and thus need to be normalized
];

export function extractTopLevelProperties<T extends TopLevelProperties>(t: T) {
  return TOP_LEVEL_PROPERTIES.reduce((o, p) => {
    if (t && t[p] !== undefined) {
      o[p] = t[p];
    }
    return o;
  }, {});
}
