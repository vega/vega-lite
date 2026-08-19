import {VgEncodeEntry, VgPostEncodingTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
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
      aspect: {value: false},
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
        // When the grid's real [min, max] is derived into scalar fields (see parseArrayExtent),
        // the color scale's domain reflects genuine data values - the union across grids, or each
        // grid's own range under an independent facet resolve - so the raw value maps correctly
        // and the legend shows real numbers. Otherwise (a color datum/value def, with no field to
        // take an extent of) normalize by the grid's own max against the fixed [0, 1] domain
        // domain.ts falls back to.
        const valueExpr = arrayColorFieldDef(model) ? 'datum.$value' : 'datum.$value / datum.$max';
        transform['color'] = {expr: `scale('${scaleName}', ${valueExpr})`};
        transform['opacity'] = 1;
      }
    }

    return [transform as unknown as VgPostEncodingTransform];
  },
};
