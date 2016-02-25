import {Model} from '../Model';
import {X, Y, SIZE, Channel} from '../../channel';
import {applyColorAndOpacity} from '../common';

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
            value: sizeValue(model, Y)
        };
    } else {
      p.width = model.has(SIZE)? {
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        } : {
          value: sizeValue(model, X)
        };
      p.height = { value: model.config().mark.tickThickness };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  function sizeValue(model: Model, channel: Channel) {
    const fieldDef = model.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    const scaleConfig = model.config().scale;
    const markConfig = model.config().mark;

    if (markConfig.tickSize) {
      return markConfig.tickSize;
    }
    const bandSize = model.has(channel) ?
      model.scale(channel).bandSize :
      scaleConfig.bandSize;
    return bandSize / 1.5;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
