import {X, Y, SHAPE, SIZE} from '../../channel';
import {LegendFieldDef} from '../../fielddef';
import {SymbolConfig, PointConfig} from '../../mark';
import {Scale} from '../../scale';
import {VgEncodeEntry, VgValueRef} from '../../vega.schema';

import {applyColor} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

function encodeEntry(model: UnitModel, fixedShape?: string) {
  let e: VgEncodeEntry = {};
  const {config, encoding, stack} = model;
  const markSpecificConfig: SymbolConfig = fixedShape ? config[fixedShape] : config.point;

  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  e.x = ref.stackable(X, encoding.x, model.scaleName(X), model.scale(X), stack, ref.midX(config));
  e.y = ref.stackable(Y, encoding.y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

  e.size = ref.midPoint(SIZE, encoding.size, model.scaleName(SIZE), model.scale(SIZE),
    {value: markSpecificConfig.size}
  );

  e.shape = shape(encoding.shape, model.scaleName(SHAPE), model.scale(SHAPE), config.point, fixedShape);

  const opacity = ref.midPoint('opacity', model.encoding.opacity, model.scaleName('opacity'), model.scale('opacity'), config.mark.opacity && {value: config.mark.opacity});
  if (opacity !== undefined) {
    e.opacity = opacity;
  }
  applyColor(e, model);
  return e;
}

function shape(shapeDef: LegendFieldDef, scaleName: string, scale: Scale, pointConfig: PointConfig, fixedShape?: string): VgValueRef {
  // shape
  if (fixedShape) { // square and circle marks
    return {value: fixedShape};
  }
  return ref.midPoint(SHAPE, shapeDef, scaleName, scale, {value: pointConfig.shape});
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
