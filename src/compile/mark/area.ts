import {X, X2, Y, Y2} from '../../channel';
import {VgEncodeEntry} from '../../vega.schema';

import {applyMarkConfig} from '../common';
import {applyColorAndOpacity} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const area: MarkCompiler = {
  vgMark: 'area',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};
    const config = model.config();

    // We should always have orient as we augment it in config.ts
    const orient = config.mark.orient;
    e.orient = {value: orient} ;

    const stack = model.stack();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, 'base');
    e.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'base');

    // Have only x2 or y2 based on orientation
    if (orient === 'horizontal') {
      e.x2 = ref.stackable2(X2, model.encoding().x, model.encoding().x2, model.scaleName(X), model.scale(X), stack, 'base');
    } else {
      e.y2 = ref.stackable2(Y2, model.encoding().y, model.encoding().y2, model.scaleName(Y), model.scale(Y), stack, 'base');
    }

    applyColorAndOpacity(e, model);
    applyMarkConfig(e, model, ['interpolate', 'tension']);
    return e;
  }
};
