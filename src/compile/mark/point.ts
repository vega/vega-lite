

import * as mixins from './mixins';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';
import {getMarkConfig} from '../common';
import {Config} from '../../config';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config} = model;

  return {
    ...mixins.pointPosition('x', model, ref.midX(config)),
    ...mixins.pointPosition('y', model, ref.midY(config)),

    ...mixins.color(model),
    ...mixins.nonPosition('size', model),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model)
  };
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square') {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return mixins.nonPosition('shape', model, {defaultValue: getMarkConfig('shape', 'point', config) as string});
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  role: 'point',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  role: 'circle',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  role: 'square',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  }
};
