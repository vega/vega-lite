import {X, Y, SHAPE, SIZE} from '../../channel';
import {ChannelDefWithLegend} from '../../fielddef';
import {PointConfig} from '../../mark';
import {Scale} from '../../scale';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

function encodeEntry(model: UnitModel, fixedShape?: string) {
  // TODO Use Vega's marks properties interface
  let p: any = {};
  const config = model.config();
  const markSpecificConfig: PointConfig = fixedShape ? config[fixedShape] : config.point;
  const stack = model.stack();

  // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

  p.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, ref.midX(config));
  p.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

  p.size = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
    {value: markSpecificConfig.size}
  );

  p.shape = shape(model.encoding().shape, model.scaleName(SHAPE), model.scale(SHAPE), markSpecificConfig, fixedShape);

  applyColorAndOpacity(p, model);
  return p;
}

function shape(fieldDef: ChannelDefWithLegend, scaleName: string, scale: Scale, markSpecificConfig: PointConfig, fixedShape?: string): VgValueRef {
  // shape
  if (fixedShape) { // square and circle marks
    return { value: fixedShape };
  }
  return ref.midPoint(SHAPE, fieldDef, scaleName, scale, {value: markSpecificConfig.shape});
}

export const point: MarkCompiler = {
  markType: () => {
    return 'symbol';
  },
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model);
  }
};

export const circle: MarkCompiler = {
  markType: () => {
    return 'symbol';
  },
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'circle');
  }
};

export const square: MarkCompiler = {
  markType: () => {
    return 'symbol';
  },
  encodeEntry: (model: UnitModel) => {
    return encodeEntry(model, 'square');
  }
};
