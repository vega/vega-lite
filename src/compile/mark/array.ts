import {VgEncodeEntry, VgPostEncodingTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
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
      field: 'datum',
    };

    if (encoding.color) {
      const scaleName = model.scaleName(COLOR);
      if (scaleName) {
        // With minField/maxField set (see domain.ts), the color scale's domain is the real,
        // data-driven [min, max] of this grid (or - under a shared color resolve - the union
        // across grids), so the raw value maps correctly without renormalizing here: the legend
        // reflects genuine data values instead of an internal 0-1 ratio, and shared vs.
        // independent color resolve becomes visibly meaningful across facets. Without those
        // fields, fall back to normalizing by the grid's own max, since a fixed [0, 1] domain is
        // the only safe default when we don't know the data's real range.
        const {minField, maxField} = model.markDef;
        const valueExpr = minField && maxField ? 'datum.$value' : 'datum.$value / datum.$max';
        transform['color'] = {expr: `scale('${scaleName}', ${valueExpr})`};
        transform['opacity'] = 1;
      }
    }

    return [transform as unknown as VgPostEncodingTransform];
  },
};
