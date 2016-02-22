import {Model} from './Model';
import {X, Y, SIZE} from '../channel';
import {applyColorAndOpacity} from './util';

export namespace tick {
  export function markType() {
    return 'rect';
  }

  export function properties(model: Model) {
    let p: any = {};

    // x
    if (model.has(X)) {
      p.xc = {
        scale: model.scaleName(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.xc = { value: model.config().scale.bandSize / 2 };
    }

    // y
    if (model.has(Y)) {
      p.yc = {
        scale: model.scaleName(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.yc = { value: model.config().scale.bandSize / 2 };
    }

    if (model.config().mark.orient === 'horizontal') {
      p.width = { value: model.config().mark.tickThickness };
      p.height = model.has(SIZE)? {
            scale: model.scaleName(SIZE),
            field: model.field(SIZE)
        } : {
            value: model.sizeValue(Y)
        };
    } else {
      p.width = model.has(SIZE)? {
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        } : {
          value: model.sizeValue(X)
        };
      p.height = { value: model.config().mark.tickThickness };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
