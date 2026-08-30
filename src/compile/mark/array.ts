import {VgEncodeEntry, VgHeatmapTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../common.js';
import {ARRAY_GRID_FIELD, arrayColorFieldDef} from '../data/array.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

/** Place the image across the extent given by x/x2 (or y/y2), or across the whole view. */
function rangeEncodeEntry(
  model: UnitModel,
  channel: 'x' | 'y',
  channel2: 'x2' | 'y2',
  sizeChannel: 'width' | 'height',
): VgEncodeEntry {
  const {encoding} = model;
  const fieldDef = encoding[channel];
  const fieldDef2 = encoding[channel2];
  const scaleName = model.scaleName(channel);

  if (scaleName && isFieldDef(fieldDef) && isFieldDef(fieldDef2)) {
    const start = `scale('${scaleName}', ${vgField(fieldDef, {expr: 'datum'})})`;
    const end = `scale('${scaleName}', ${vgField(fieldDef2, {expr: 'datum'})})`;
    return {
      [channel]: {signal: `min(${start}, ${end})`},
      [sizeChannel]: {signal: `abs((${end}) - (${start}))`},
    };
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
      aspect: signalOrValueRef(getMarkPropOrConfig('aspect', model.markDef, model.config) ?? false),
    };
  },

  postEncodingTransform: (model: UnitModel): VgHeatmapTransform[] => {
    const transform: VgHeatmapTransform = {
      type: 'heatmap',
      // A post-encoding transform sees scenegraph items, so reach through to the grid on the datum.
      field: `datum.${ARRAY_GRID_FIELD}`,
    };

    // The color scale's domain is in the grid's own units (see parseArrayData), so a cell's value
    // maps straight through it. Without one, the transform shades by opacity alone, which already
    // leaves a cell without a value transparent.
    const scaleName = arrayColorFieldDef(model) && model.scaleName(COLOR);
    if (scaleName) {
      transform.color = {expr: `scale('${scaleName}', datum.$value)`};
      transform.opacity = {expr: 'isValid(datum.$value) ? 1 : 0'};
    }

    return [transform];
  },
};
