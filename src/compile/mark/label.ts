import {UnitModel} from '../unit';
import {X, Y, COLOR, TEXT, SIZE, ANCHOR, OFFSET} from '../../channel';
import {applyMarkConfig, applyColorAndOpacity, formatMixins} from '../common';
import {extend, contains} from '../../util';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../../type';

export namespace label {
  export function markType() {
    return 'text';
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

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {
      xc: {field: 'label_xc'},
      yc: {field: 'label_yc'},
      align: {field: 'label_align'},
      fill: {field: 'label_color'}
    };

    applyMarkConfig(p, model,
      ['angle', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);
        
    const fieldDef = model.fieldDef(TEXT);

    // size
    if (model.has(SIZE)) {
      p.fontSize = { field: model.field(SIZE, {datum: true}) };
    } else {
      p.fontSize = { value: sizeValue(model) };
    }

    p.opacity = {field: 'label_opacity'};

    // text
    if (model.has(TEXT)) {
      if (contains([QUANTITATIVE, TEMPORAL], model.fieldDef(TEXT).type)) {
        const format = model.config().mark.format;
        extend(p, formatMixins(model, TEXT, format));
      } else {
        p.text = { field: model.field(TEXT, {datum: true}) };
      }
    } else if (fieldDef.value) {
      p.text = { value: fieldDef.value };
    }

    return p;
  }
  
  export function transforms(model: UnitModel) {
    const opacity        = model.config().mark.opacity;
    const anchorFieldDef = model.encoding()['anchor'];
    const offsetFieldDef = model.encoding()['offset'];
    const colorFieldDef  = model.encoding()['color'];
    let t: any = { 
      type: 'label',
      anchor: anchorFieldDef? anchorFieldDef.value : 'bottom-center',
      offset: offsetFieldDef ? offsetFieldDef.value : 10,
      color: colorFieldDef ? colorFieldDef.value : 'black',
      opacity: opacity ? opacity : 1,
      align: 'center',
      buffer: 10 // minimum spacing between labels
    };
    
    return [t];
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
