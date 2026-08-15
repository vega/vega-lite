import {VgPostEncodingTransform} from '../../vega.schema.js';
import {COLOR} from '../../channel.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

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
      x: {value: 0},
      y: {value: 0},
      image: {field: 'image'},
      width: model.getSizeSignalRef('width'),
      height: model.getSizeSignalRef('height'),
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
        transform['color'] = {expr: `scale('${scaleName}', datum.$value / datum.$max)`};
        transform['opacity'] = 1;
      }
    }

    return [transform as unknown as VgPostEncodingTransform];
  },
};
