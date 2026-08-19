import {VgEncodeEntry, VgPostEncodingTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../common.js';
import {ARRAY_GRID_FIELD, arrayColorFieldDef} from '../data/array.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

// Position and size the image from the scaled extent given by x/x2 (or y/y2), or fill the view
// when the grid's extent is not encoded.
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
    const transform: Record<string, unknown> = {
      type: 'heatmap',
      // This runs on scenegraph items, so reach through to the grid built on the datum.
      field: `datum.${ARRAY_GRID_FIELD}`,
    };

    // The scale's domain is the grid's own value range (see parseArrayData), so each cell's value
    // maps straight through it. Without a color field the transform shades by opacity alone.
    const scaleName = arrayColorFieldDef(model) && model.scaleName(COLOR);
    if (scaleName) {
      transform['color'] = {expr: `scale('${scaleName}', datum.$value)`};
      transform['opacity'] = 1;
    }

    return [transform as unknown as VgPostEncodingTransform];
  },
};
