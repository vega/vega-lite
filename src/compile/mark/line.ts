import {X, Y} from '../../channel';
import {VgEncodeEntry} from '../../vega.schema';

import {applyMarkConfig} from '../common';
import {applyColor} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const line: MarkCompiler = {
  vgMark: 'line',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const {config, encoding} = model;

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, model.encoding.x, model.scaleName(X), model.scale(X), model.stack, 'base');
    e.y = ref.stackable(Y, model.encoding.y, model.scaleName(Y), model.scale(Y), model.stack, 'base');

    const opacity = ref.midPoint('opacity', model.encoding.opacity, model.scaleName('opacity'), model.scale('opacity'), model.config.mark.opacity && {value: model.config.mark.opacity});
    if (opacity !== undefined) {
      e.opacity = opacity;
    }
    applyColor(e, model);

    e.strokeWidth = ref.midPoint('size', encoding.size, model.scaleName('size'), model.scale('size'), {
      value: config.line.strokeWidth
    });

    applyMarkConfig(e, model, ['interpolate', 'tension']);
    return e;
  }
};
