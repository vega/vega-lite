import {Model} from './Model';
import {X, Y, COLOR, TEXT, SIZE} from '../channel';
import {applyMarkConfig, applyColorAndOpacity, formatMixins} from './util';
import {extend} from '../util';
import {QUANTITATIVE} from '../type';

export namespace text {
  export function markType() {
    return 'text';
  }

  export function background(model: Model) {
    return {
      x: { value: 0 },
      y: { value: 0 },
      width: { field: { group: 'width' } },
      height: { field: { group: 'height' } },
      fill: { scale: model.scale(COLOR), field: model.field(COLOR) }
    };
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const fieldDef = model.fieldDef(TEXT);

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scale(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      if (model.has(TEXT) && model.fieldDef(TEXT).type === QUANTITATIVE) {
        p.x = { field: { group: 'width' }, offset: -5 };
      } else {
        p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
      }
      // TODO: support x.value
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
      // TODO: support x.value
    }

    // size
    if (model.has(SIZE)) {
      p.fontSize = {
        scale: model.scale(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.fontSize = { value: model.sizeValue() };
    }

    if (model.config().mark.applyColorToBackground && !model.has(X) && !model.has(Y)) {
      p.fill = {value: 'black'}; // TODO: add rules for swapping between black and white

      // opacity
      const opacity = model.config().mark.opacity;
      if (opacity) { p.opacity = { value: opacity }; };
    } else {
      applyColorAndOpacity(p, model);
    }


    // text
    if (model.has(TEXT)) {
      p.text = { field: model.field(TEXT) };
      const format = model.config().mark.format;
      extend(p, formatMixins(model, TEXT, format));
    } else {
      p.text = { value: fieldDef.value };
    }

    applyMarkConfig(p, model,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta']);

    return p;
  }
}
