import {Model} from '../Model';
import {X, Y, COLOR, TEXT, SIZE} from '../../channel';
import {applyMarkConfig, applyColorAndOpacity, formatMixins} from '../common';
import {extend, contains} from '../../util';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../../type';

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
      fill: {
        scale: model.scaleName(COLOR),
        field: model.field(COLOR, model.fieldDef(COLOR).type === ORDINAL ? {prefn: 'rank_'} : {})
      }
    };
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    applyMarkConfig(p, model,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);

    const fieldDef = model.fieldDef(TEXT);

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else { // TODO: support x.value, x.datum
      if (model.has(TEXT) && model.fieldDef(TEXT).type === QUANTITATIVE) {
        p.x = { field: { group: 'width' }, offset: -5 };
      } else {
        p.x = { value: model.config().scale.textBandWidth / 2 };
      }
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { value: model.config().scale.bandSize / 2 };
    }

    // size
    if (model.has(SIZE)) {
      p.fontSize = {
        scale: model.scaleName(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.fontSize = { value: sizeValue(model) };
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
      if (contains([QUANTITATIVE, TEMPORAL], model.fieldDef(TEXT).type)) {
        const format = model.config().mark.format;
        extend(p, formatMixins(model, TEXT, format));
      } else {
        p.text = { field: model.field(TEXT) };
      }
    } else if (fieldDef.value) {
      p.text = { value: fieldDef.value };
    }

    return p;
  }

  function sizeValue(model: Model) {
    const fieldDef = model.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    return model.config().mark.fontSize;
  }
}
