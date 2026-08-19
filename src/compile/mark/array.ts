import {VgEncodeEntry, VgPostEncodingTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../common.js';
import {ARRAY_GRID_FIELD, arrayColorFieldDef} from '../data/array.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

// If both a position channel (x/y) and its range partner (x2/y2) are field-encoded, position and
// size the image from their scaled extent (e.g. a grid's geographic bounding box). Otherwise fall
// back to filling the full view, as plain (non-axis) array-mark specs already rely on.
function rangeEncodeEntry(
  model: UnitModel,
  channel: 'x' | 'y',
  channel2: 'x2' | 'y2',
  sizeChannel: 'width' | 'height',
): VgEncodeEntry {
  const {encoding} = model;
  const fieldDef = encoding[channel];
  const fieldDef2 = encoding[channel2];

  if (isFieldDef(fieldDef) && isFieldDef(fieldDef2)) {
    const scaleName = model.scaleName(channel);
    if (scaleName) {
      const start = `scale('${scaleName}', ${vgField(fieldDef, {expr: 'datum'})})`;
      const end = `scale('${scaleName}', ${vgField(fieldDef2, {expr: 'datum'})})`;
      return {
        [channel]: {signal: `min(${start}, ${end})`},
        [sizeChannel]: {signal: `abs((${end}) - (${start}))`},
      };
    }
  }

  return {
    [channel]: {value: 0},
    [sizeChannel]: model.getSizeSignalRef(sizeChannel),
  };
}

export const array: MarkCompiler = {
  vgMark: 'image',

  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'ignore',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...rangeEncodeEntry(model, 'x', 'x2', 'width'),
      ...rangeEncodeEntry(model, 'y', 'y2', 'height'),
      image: {field: 'image'},
      // Stretch the raster to fill the view unless asked otherwise. `aspect: true` fits it inside
      // the view instead, preserving the grid's own proportions so that its cells stay square.
      aspect: signalOrValueRef(getMarkPropOrConfig('aspect', model.markDef, model.config) ?? false),
    };
  },

  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding} = model;

    const transform: Record<string, unknown> = {
      type: 'heatmap',
      // A post-encoding transform runs on scenegraph items, so reach through to the sanitized grid
      // built on the datum (see parseArrayData) rather than handing over the whole tuple.
      field: `datum.${ARRAY_GRID_FIELD}`,
    };

    if (encoding.color) {
      const scaleName = model.scaleName(COLOR);
      if (scaleName) {
        // When the grid's real [min, max] is derived into scalar fields (see parseArrayData), the
        // color scale's domain reflects genuine data values: the union across grids, or each
        // grid's own range under an independent facet resolve. The raw value then maps correctly
        // and the legend shows real numbers.
        //
        // Otherwise the color channel is a datum or value def, with no field to take an extent of,
        // so normalize by the grid's own maximum to match the fixed [0, 1] domain that domain.ts
        // falls back to.
        const valueExpr = arrayColorFieldDef(model) ? 'datum.$value' : 'datum.$value / datum.$max';
        transform['color'] = {expr: `scale('${scaleName}', ${valueExpr})`};
        transform['opacity'] = 1;
      }
    }

    return [transform as unknown as VgPostEncodingTransform];
  },
};
