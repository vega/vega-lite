import {X, Y, COLOR, TEXT, SIZE} from '../../channel';
import {applyMarkConfig, applyColorAndOpacity, numberFormat, timeTemplate} from '../common';
import {Config} from '../../config';
import {FieldDef, field} from '../../fielddef';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../../type';
import {VgValueRef} from '../../vega.schema';


import {UnitModel} from '../unit';

export namespace text {
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
        field: model.field(COLOR, model.encoding().color.type === ORDINAL ? {prefix: 'rank'} : {})
      }
    };
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    applyMarkConfig(p, model,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);

    const config = model.config();
    const textFieldDef = model.encoding().text;

    p.x = x(model.encoding().x, model.scaleName(X), config, textFieldDef);

    p.y = y(model.encoding().y, model.scaleName(Y), config);

    p.fontSize = size(model.encoding().size, model.scaleName(SIZE), config);

    p.text = text(textFieldDef, model.scaleName(TEXT), config);

    if (model.config().mark.applyColorToBackground && !model.has(X) && !model.has(Y)) {
      p.fill = {value: 'black'}; // TODO: add rules for swapping between black and white
      // opacity
      const opacity = model.config().mark.opacity;
      if (opacity) { p.opacity = { value: opacity }; };
    } else {
      applyColorAndOpacity(p, model);
    }

    return p;
  }

  function x(xFieldDef: FieldDef, scaleName: string, config: Config, textFieldDef:FieldDef): VgValueRef {
    // x
    if (xFieldDef) {
      if (xFieldDef.field) {
        return {
          scale: scaleName,
          field: field(xFieldDef, { binSuffix: 'mid' })
        };
      }
    }
    // TODO: support x.value, x.datum
    if (textFieldDef && textFieldDef.type === QUANTITATIVE) {
      return { field: { group: 'width' }, offset: -5 };
    } else {
      // TODO: allow this to fit
      return { value: config.scale.textBandWidth / 2 };
    }
  }

  function y(yFieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // y
    if (yFieldDef) {
      if (yFieldDef.field) {
        return {
          scale: scaleName,
          field: field(yFieldDef, { binSuffix: 'mid' })
        };
      }
    }
    // TODO: allow this to fit
    // TODO consider if this should support group: height case too.
    return { value: config.scale.bandSize / 2 };
  }

  function size(sizeFieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // size
    if (sizeFieldDef) {
      if (sizeFieldDef.field) {
        return {
          scale: scaleName,
          field: field(sizeFieldDef)
        };
      }
      if (sizeFieldDef.value) {
        return {value: sizeFieldDef.value};
      }
    }
    return { value: config.mark.fontSize };
  }

  function text(textFieldDef: FieldDef, scaleName: string, config: Config): VgValueRef {
    // text
    if (textFieldDef) {
      if (textFieldDef.field) {
        if (QUANTITATIVE === textFieldDef.type) {
          const format = numberFormat(textFieldDef, config.mark.format, config);

          const filter = 'number' + ( format ? ':\'' + format + '\'' : '');
          return {
            template: '{{' + field(textFieldDef, { datum: true }) + ' | ' + filter + '}}'
          };
        } else if (TEMPORAL === textFieldDef.type) {
          return {
            template: timeTemplate(field(textFieldDef, {datum: true}), textFieldDef.timeUnit, config.mark.format, config.mark.shortTimeLabels, config)
          };
        } else {
          return { field: textFieldDef.field };
        }
      } else if (textFieldDef.value) {
        return { value: textFieldDef.value };
      }
    }
    return {value: config.mark.text};
  }
}
