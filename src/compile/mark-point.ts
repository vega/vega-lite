import {Model} from './Model';
import {X, Y, SHAPE, SIZE} from '../channel';
import {applyColorAndOpacity, ColorMode} from './util';

export namespace point {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: Model, fixedShape?: string) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
    }

    // size
    if (model.has(SIZE)) {
      p.size = {
        scale: model.scaleName(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.size = { value: model.sizeValue() };
    }

    // shape
    if (fixedShape) { // square and circle marks
      p.shape = { value: fixedShape };
    } else if (model.has(SHAPE)) {
      p.shape = {
        scale: model.scaleName(SHAPE),
        field: model.field(SHAPE)
      };
    } else {
      p.shape = { value: model.fieldDef(SHAPE).value };
    }

    applyColorAndOpacity(p, model,
      // square and circle are filled by default, but point is stroked by default.
      fixedShape ? ColorMode.FILLED_BY_DEFAULT : ColorMode.STROKED_BY_DEFAULT
    );
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
  }
}

export namespace circle {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: Model) {
    return point.properties(model, 'circle');
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}

export namespace square {
  export function markType() {
    return 'symbol';
  }

  export function properties(model: Model) {
    return point.properties(model, 'square');
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
