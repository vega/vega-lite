import {Config} from '../../config';
import {VgEncodeEntry} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config, markDef, width, height} = model;

  return {
    ...mixins.baseEncodeEntry(model, {size: 'include', orient: 'ignore'}),
    ...mixins.pointPosition('x', model, ref.mid(width)),
    ...mixins.pointPosition('y', model, ref.mid(height)),
    ...mixins.nonPosition('size', model, {defaultValue: getMarkConfig('size', markDef, config)}),
    ...shapeMixins(model, config, fixedShape)
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
