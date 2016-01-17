import {Model} from './Model';
import {X, Y} from '../channel';
import {applyColorAndOpacity, applyMarkConfig, ColorMode} from './util';


export namespace line {
  export function markType() {
    return 'line';
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scale(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: 0 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { field: { group: 'height' } };
    }

    applyColorAndOpacity(p, model, ColorMode.ALWAYS_STROKED);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
