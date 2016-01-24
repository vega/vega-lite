import {Model} from './Model';
import {X, Y, SIZE, LABEL} from '../channel';
import {applyColorAndOpacity, applyLabelConfig, formatMixins} from './util';
import {extend, contains} from '../util';
import {QUANTITATIVE, TEMPORAL} from '../type';

export namespace bar {
  export function markType() {
    return 'rect';
  }

  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    let p: any = {};

    const orient = model.config().mark.orient;

    const stack = model.stack();
    // x, x2, and width -- we must specify two of these in all conditions
    if (stack && X === stack.fieldChannel) {
      // 'x' is a stacked measure, thus use <field>_start and <field>_end for x, x2.
      p.x = {
        scale: model.scaleName(X),
        field: model.field(X, { suffix: '_start' })
      };
      p.x2 = {
        scale: model.scaleName(X),
        field: model.field(X, { suffix: '_end' })
      };
    } else if (model.isMeasure(X)) {
      if (orient === 'horizontal') {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X)
        };
        p.x2 = {
          scale: model.scaleName(X),
          value: 0
        };
      } else { // vertical
        p.xc = {
          scale: model.scaleName(X),
          field: model.field(X)
        };
        p.width = {value: model.sizeValue(X)};
      }
    } else if (model.fieldDef(X).bin) {
      if (model.has(SIZE) && orient !== 'horizontal') {
        // For vertical chart that has binned X and size,
        // center bar and apply size to width.
        p.xc = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: '_mid' })
        };
        p.width = {
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        };
      } else {
        p.x = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: '_start' }),
          offset: 1
        };
        p.x2 = {
          scale: model.scaleName(X),
          field: model.field(X, { binSuffix: '_end' })
        };
      }
    } else { // x is dimension or unspecified
      if (model.has(X)) { // is ordinal
       p.xc = {
         scale: model.scaleName(X),
         field: model.field(X)
       };
     } else { // no x
        p.x = { value: 0, offset: 2 };
      }

      p.width = model.has(SIZE) && orient !== 'horizontal' ? {
          // apply size scale if has size and is vertical (explicit "vertical" or undefined)
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        } : {
          // otherwise, use fixed size
          value: model.sizeValue(X)
        };
    }

    // y, y2 & height -- we must specify two of these in all conditions
    if (stack && Y === stack.fieldChannel) { // y is stacked measure
      p.y = {
        scale: model.scaleName(Y),
        field: model.field(Y, { suffix: '_start' })
      };
      p.y2 = {
        scale: model.scaleName(Y),
        field: model.field(Y, { suffix: '_end' })
      };
    } else if (model.isMeasure(Y)) {
      if (orient !== 'horizontal') { // vertical (explicit 'vertical' or undefined)
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y)
        };
        p.y2 = {
          scale: model.scaleName(Y),
          value: 0
        };
      } else {
        p.yc = {
          scale: model.scaleName(Y),
          field: model.field(Y)
        };
        p.height = { value: model.sizeValue(Y) };
      }
    } else if (model.fieldDef(Y).bin) {
      if (model.has(SIZE) && orient === 'horizontal') {
        // For horizontal chart that has binned Y and size,
        // center bar and apply size to height.
        p.yc = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: '_mid' })
        };
        p.height = {
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        };
      } else {
        // Otherwise, simply use <field>_start, <field>_end
        p.y = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: '_start' })
        };
        p.y2 = {
          scale: model.scaleName(Y),
          field: model.field(Y, { binSuffix: '_end' }),
          offset: 1
        };
      }
    } else { // y is ordinal or unspecified

      if (model.has(Y)) { // is ordinal
        p.yc = {
          scale: model.scaleName(Y),
          field: model.field(Y)
        };
      } else { // No Y
        p.y2 = {
          field: { group: 'height' },
          offset: -1
        };
      }

      p.height = model.has(SIZE) && orient === 'horizontal' ? {
          // apply size scale if has size and is horizontal
          scale: model.scaleName(SIZE),
          field: model.field(SIZE)
        } : {
          value: model.sizeValue(Y)
        };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  export function labels(model: Model) {
    let p: any = {};

    const orient = model.config().mark.orient;
    const isHorizontal = (orient === 'horizontal');

    const stack = model.stack();

    let fieldOptions: any = { datum: 1 };

    if (stack && X === stack.fieldChannel) {
      fieldOptions.suffix = '_end';
    }

    const datumField = model.field(LABEL, fieldOptions);

    // text
    if (contains([QUANTITATIVE, TEMPORAL], model.fieldDef(LABEL).type)) {
      const format = model.config().label.format;
      extend(p, formatMixins(model, LABEL, format, fieldOptions));
    } else {
      p.text = { field: datumField };
    }

    p.x = { field: isHorizontal ? 'x2' : 'xc' };

    p.y = { field: isHorizontal ? 'yc' : datumField };

    if (isHorizontal) {
      p.baseline = { value: 'middle' };
      p.align = { value: 'left' };
      p.x.offset = 5;
    } else {
      p.baseline = { value: 'bottom' };
      p.align = { value: 'center' };
      p.y.offset = -5;
      p.y.scale = model.scaleName(Y);
    }

    applyLabelConfig(p, model);

    return p;
  }
}
