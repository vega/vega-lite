import {X, Y, X2, Y2, SIZE} from '../../channel';
import {VgEncodeEntry} from '../../vega.schema';

import {applyColorAndOpacity} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const rule: MarkCompiler = {
  vgMark: 'rule',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const orient = model.config.mark.orient;
    const {config, encoding, stack} = model;

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, encoding.x, model.scaleName(X), model.scale(X), stack, 'base');
    e.y = ref.stackable(Y, encoding.y, model.scaleName(Y), model.scale(Y), stack, 'base');

    if(orient === 'vertical') {
      e.y2 = ref.stackable2(Y2, encoding.y, encoding.y2, model.scaleName(Y), model.scale(Y), stack, 'baseOrMax');
    } else {
      e.x2 = ref.stackable2(X2, encoding.x, encoding.x2, model.scaleName(X), model.scale(X), stack, 'baseOrMax');
    }

    // FIXME: this function would overwrite strokeWidth but shouldn't
    applyColorAndOpacity(e, model);

    e.strokeWidth = ref.midPoint(SIZE, encoding.size, model.scaleName(SIZE), model.scale(SIZE), {
      value: config.rule.strokeWidth
    });

    return e;
  }
};
