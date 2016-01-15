import {Model} from './Model';
import {X, Y, COLOR, TEXT, SIZE} from '../channel';
import {applyMarkConfig} from './util';
import {QUANTITATIVE} from '../type';

export namespace text {
  export function markType(model: Model) {
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
        // TODO: make this -5 offset a config
        p.x = { field: { group: 'width' }, offset: -5 };
      } else {
        p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
      }
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
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

    // FIXME applyColorAndOpacity
    // fill
    // TODO: consider if color should just map to fill instead?

    p.fill = {value: 'black'}; // TODO: add rules for swapping between black and white
    // opacity
    var opacity = model.config().mark.opacity;
    if (opacity) { p.opacity = { value: opacity }; };

    // text
    if (model.has(TEXT)) {
      if (model.fieldDef(TEXT).type === QUANTITATIVE) {
        const format = model.config().mark.format;
        // TODO: revise this line
        var numberFormat = format !== undefined ? format : model.numberFormat(TEXT);

        p.text = {
          template: '{{' + model.field(TEXT, { datum: true }) +
          ' | number:\'' + numberFormat + '\'}}'
        };
      } else {
        p.text = { field: model.field(TEXT) };
      }
    } else {
      p.text = { value: fieldDef.value };
    }

    applyMarkConfig(p, model,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'fill', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta']);

    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}
