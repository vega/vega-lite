import {Config} from '../../config.js';
import {VgEncodeEntry} from '../../vega.schema.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config} = model;

  return {
    ...encode.baseEncodeEntry(model, {
      align: 'ignore',
      baseline: 'ignore',
      color: 'include',
      size: 'include',
      orient: 'ignore',
      theta: 'ignore',
    }),
    ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
    ...encode.pointPosition('y', model, {defaultPos: 'mid'}),
    ...encode.nonPosition('size', model),
    ...encode.nonPosition('angle', model),
    ...shapeMixins(model, config, fixedShape),
  };
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square'): VgEncodeEntry {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return encode.nonPosition('shape', model);
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  },
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  },
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  },
};
