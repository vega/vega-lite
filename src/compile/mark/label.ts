import {UnitModel} from '../unit';
import {X, Y, COLOR, TEXT, SIZE, ANCHOR, OFFSET} from '../../channel';
import {applyMarkConfig, applyColorAndOpacity, formatMixins} from '../common';
import {extend, contains} from '../../util';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../../type';

export namespace label {
  export function markType() {
    return 'label';
  }

  export function background(model: UnitModel) {
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

  export function properties(model: UnitModel, referencedModel?: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    applyMarkConfig(p, model,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);
        
    const fieldDef = model.fieldDef(TEXT);

    // size
    if (model.has(SIZE)) {
      p.fontSize = {
        field: model.field(SIZE)
      };
      if (!referencedModel) {
        p.fontSize.scale = model.scaleName(SIZE);
      }
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

  function sizeValue(model: UnitModel) {
    const fieldDef = model.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    return model.config().mark.fontSize;
  }
  
  export function ref(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
