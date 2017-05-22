import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';
import * as ref from './valueref';

import {isFieldDef, isProjection} from '../../fielddef';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, keys} from '../../util';

function encodeEntry(model: UnitModel, fixedShape?: 'circle' | 'square') {
  const {config, encoding, width, height} = model;
  return {
    ...(isProjection(encoding.x) || isProjection(encoding.y)) ? {
      // TODO: obviously these can't be hardcoded like this
      x: {'field': model.getName(LONGITUDE)},
      y: {'field': model.getName(LATITUDE)}
    } : {
      x: mixins.pointPosition('x', model, ref.midX(width, config)),
      y: mixins.pointPosition('y', model, ref.midY(height, config))
    },
    ...mixins.nonPosition('size', model),
    ...mixins.color(model),
    ...mixins.text(model, 'tooltip'),
    ...shapeMixins(model, config, fixedShape),
    ...mixins.nonPosition('opacity', model),
  };
}

export function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square') {
  if (fixedShape) {
    return {shape: {value: fixedShape}};
  }
  return mixins.nonPosition('shape', model, {
    defaultValue: getMarkConfig('shape', 'point', config) as string
  });
}

export const point: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'point',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  }
};

export const circle: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'circle',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  }
};

export const square: MarkCompiler = {
  vgMark: 'symbol',
  defaultRole: 'square',
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  }
};
