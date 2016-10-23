import {X, Y, SIZE} from '../../channel';
import {applyColorAndOpacity} from '../common';
import {Orient} from '../../config';
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
    // TODO: consider if we can apply stack here.

    p.x = ref.normal(model.encoding().x, model.scaleName(X), model.scale(X), 'baseX');
    p.y = ref.normal(model.encoding().y, model.scaleName(Y), model.scale(Y), 'baseY');

    if(orient === Orient.VERTICAL) {
      p.y2 = ref.normal(model.encoding().y2, model.scaleName(Y), model.scale(Y), 'baseOrMaxY');
    } else {
      p.x2 = ref.normal(model.encoding().x2, model.scaleName(X), model.scale(X), 'baseOrMaxX');
    }

    // FIXME: this function would overwrite strokeWidth but shouldn't
    applyColorAndOpacity(p, model);


    p.strokeWidth = ref.normal(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE), {
      value: config.mark.ruleSize
    });

    return p;
  }
}
