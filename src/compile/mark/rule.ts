import {X, Y, X2, Y2, SIZE} from '../../channel';
import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};
    const orient = model.config().mark.orient;
    const config = model.config();

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    const stack = model.stack();

    p.x = ref.stackable(X,model.encoding().x, model.scaleName(X), model.scale(X), stack, 'base');
    p.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'base');

    if(orient === 'vertical') {
      p.y2 = ref.stackable2(Y2, model.encoding().y, model.encoding().y2, model.scaleName(Y), model.scale(Y), stack, 'baseOrMax');
    } else {
      p.x2 = ref.stackable2(X2, model.encoding().x, model.encoding().x2, model.scaleName(X), model.scale(X), stack, 'baseOrMax');
    }

    // FIXME: this function would overwrite strokeWidth but shouldn't
    applyColorAndOpacity(p, model);

    p.strokeWidth = ref.normal(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), {
      value: config.mark.ruleSize
    });

    return p;
  }
}
