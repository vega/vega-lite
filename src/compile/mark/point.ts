import {Config} from '../../config';
import {VgEncodeEntry} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config, width, height} = model;

  return {
    ...mixins.pointPosition('x', model, ref.mid(width)),
    ...mixins.pointPosition('y', model, ref.mid(height)),

    ...mixins.color(model),
    ...mixins.text(model, 'tooltip'),
    ...mixins.nonPosition('size', model),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model),
  };
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square'): VgEncodeEntry {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return mixins.nonPosition('shape', model, {defaultValue: getMarkConfig('shape', model.markDef, config) as string});
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  }
};
