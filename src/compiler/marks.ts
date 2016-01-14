import {Model} from './Model';
import {X, Y, COLOR, TEXT, SIZE, SHAPE, DETAIL, ROW, COLUMN, LABEL} from '../channel';
import {AREA, LINE, TEXT as TEXTMARK} from '../mark';
import {imputeTransform, stackTransform} from './stack';
import {QUANTITATIVE} from '../type';
import {extend} from '../util';

declare var exports;

export function compileMarks(model: Model): any[] {
  const mark = model.mark();
  const name = model.spec().name;
  const isFaceted = model.has(ROW) || model.has(COLUMN);
  const dataFrom = {data: model.dataTable()};
  const markConfig = model.config().mark;
  const sortBy = markConfig.sortBy;

  if (mark === LINE || mark === AREA) {
    const details = detailFields(model);

    // For line and area, we sort values based on dimension by default
    // For line, a special config "sortLineBy" is allowed
    let sortLineBy = mark === LINE ? markConfig.sortLineBy : undefined;
    if (!sortLineBy) {
      sortLineBy = '-' + model.field(markConfig.orient === 'horizontal' ? Y : X);
    }

    let pathMarks: any = extend(
      name ? { name: name + '-marks' } : {},
      {
        type: exports[mark].markType(model),
        from: extend(
          // If has facet, `from.data` will be added in the cell group.
          // If has subfacet for line/area group, `from.data` will be added in the outer subfacet group below.
          // If has no subfacet, add from.data.
          isFaceted || details.length > 0 ? {} : dataFrom,

          // sort transform
          {transform: [{ type: 'sort', by: sortLineBy }]}
        ),
        properties: { update: exports[mark].properties(model) }
      }
    );

    // FIXME is there a case where area requires impute without stacking?

    if (details.length > 0) { // have level of details - need to facet line into subgroups
      const facetTransform = { type: 'facet', groupby: details };
      const transform: any[] = [].concat(
        (sortBy ? [{type: 'sort', by: sortBy}] : []),
        mark === AREA && model.stack() ?
          // For stacked area, we need to impute missing tuples and stack values
          [imputeTransform(model), stackTransform(model), facetTransform] :
          [facetTransform]
        );

      return [{
        name: (name ? name + '-' : '') + mark + '-facet',
        type: 'group',
        from: extend(
          // If has facet, `from.data` will be added in the cell group.
          // Otherwise, add it here.
          isFaceted ? {} : dataFrom,
          {transform: transform}
        ),
        properties: {
          update: {
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } }
          }
        },
        marks: [pathMarks]
      }];
    } else {
      return [pathMarks];
    }
  } else { // other mark type
    let marks = []; // TODO: vgMarks
    if (mark === TEXTMARK && model.has(COLOR)) {
      // add background to 'text' marks if has color
      marks.push(extend(
        name ? { name: name + '-background' } : {},
        {type: 'rect'},
        // If has facet, `from.data` will be added in the cell group.
        // Otherwise, add it here.
        isFaceted ? {} : {from: dataFrom},
        // Properties
        {properties: { update: text.background(model) } }
      ));
    }

    marks.push(extend(
      name ? { name: name + '-marks' } : {},
      { type: exports[mark].markType(model) },
      // Add `from` if needed
      (!isFaceted || model.stack() || sortBy) ? {
        from: extend(
          // If faceted, `from.data` will be added in the cell group.
          // Otherwise, add it here
          isFaceted ? {} : dataFrom,
          // Stacked Chart need additional transform
          model.stack() || sortBy ? { transform: [].concat(
              (model.stack() ? [stackTransform(model)] : []),
              sortBy ? [{type:'sort', by: sortBy}] : []
          )} : {}
        )
      } : {},
      // properties groups
      { properties: { update: exports[mark].properties(model) } }
    ));

    if (model.has(LABEL)) {
      const labelProperties = exports[mark].labels(model);

      // check if we have label method for current mark type.
      if (labelProperties !== undefined) { // If label is supported 
        // add label group
        marks.push(extend(
          name ? { name: name + '-label' } : {},
          {type: 'text'},
          // If has facet, `from.data` will be added in the cell group.
          // Otherwise, add it here.
          isFaceted ? {} : {from: dataFrom},
          // Properties
          { properties: { update: labelProperties } }
        ));
      }
    }

    return marks;
  }
}

enum ColorMode {
  ALWAYS_FILLED,
  ALWAYS_STROKED
}

export const FILL_STROKE_CONFIG = ['fill', 'fillOpacity',
  'stroke', 'strokeWidth', 'strokeDash', 'strokeDashOffset', 'strokeOpacity',
  'opacity'];

function applyColorAndOpacity(p, model: Model, colorMode?: ColorMode) {
  const filled = colorMode === ColorMode.ALWAYS_FILLED ? true :
    colorMode === ColorMode.ALWAYS_STROKED ? false :
    model.config().mark.filled;

  // Apply fill and stroke config first
  // so that `color.value` can override `fill` and `stroke` config
  applyMarkConfig(p, model, FILL_STROKE_CONFIG);

  if (filled) {
    if (model.has(COLOR)) {
      p.fill = {
        scale: model.scale(COLOR),
        field: model.field(COLOR)
      };
    } else {
      p.fill = { value: model.fieldDef(COLOR).value };
    }
  } else {
    if (model.has(COLOR)) {
      p.stroke = {
        scale: model.scale(COLOR),
        field: model.field(COLOR)
      };
    } else {
      p.stroke = { value: model.fieldDef(COLOR).value };
    }
  }
}

export function applyMarkConfig(marksProperties, model: Model, propsList: string[]) {
  propsList.forEach(function(property) {
    const value = model.config().mark[property];
    if (value !== undefined) {
      marksProperties[property] = { value: value };
    }
  });
}

/**
 * Returns list of detail fields (for 'color', 'shape', or 'detail' channels)
 * that the model's spec contains.
 */
function detailFields(model: Model): string[] {
  return [COLOR, DETAIL, SHAPE].reduce(function(details, channel) {
    if (model.has(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}


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
        scale: model.scale(X),
        field: model.field(X) + '_start'
      };
      p.x2 = {
        scale: model.scale(X),
        field: model.field(X) + '_end'
      };
    } else if (model.isMeasure(X)) {
      if (orient === 'horizontal') {
        p.x = {
          scale: model.scale(X),
          field: model.field(X)
        };
        p.x2 = { value: 0 };
      } else { // vertical
        p.xc = {
          scale: model.scale(X),
          field: model.field(X)
        };
        p.width = {value: model.sizeValue(X)};
      }
    } else if (model.fieldDef(X).bin) {
      if (model.has(SIZE) && orient !== 'horizontal') {
        // For vertical chart that has binned X and size,
        // center bar and apply size to width.
        p.xc = {
          scale: model.scale(X),
          field: model.field(X, { binSuffix: '_mid' })
        };
        p.width = {
          scale: model.scale(SIZE),
          field: model.field(SIZE)
        };
      } else {
        p.x = {
          scale: model.scale(X),
          field: model.field(X, { binSuffix: '_start' }),
          offset: 1
        };
        p.x2 = {
          scale: model.scale(X),
          field: model.field(X, { binSuffix: '_end' })
        };
      }
    } else { // x is dimension or unspecified
      if (model.has(X)) { // is ordinal
       p.xc = {
         scale: model.scale(X),
         field: model.field(X)
       };
     } else { // no x
        p.x = { value: 0, offset: 2 };
      }

      p.width = model.has(SIZE) && orient !== 'horizontal' ? {
          // apply size scale if has size and is vertical (explicit "vertical" or undefined)
          scale: model.scale(SIZE),
          field: model.field(SIZE)
        } : {
          // otherwise, use fixed size
          value: model.sizeValue(X)
        };
    }

    // y, y2 & height -- we must specify two of these in all conditions
    if (stack && Y === stack.fieldChannel) { // y is stacked measure
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y) + '_start'
      };
      p.y2 = {
        scale: model.scale(Y),
        field: model.field(Y) + '_end'
      };
    } else if (model.isMeasure(Y)) {
      if (orient !== 'horizontal') { // vertical (explicit 'vertical' or undefined)
        p.y = {
          scale: model.scale(Y),
          field: model.field(Y)
        };
        p.y2 = { field: { group: 'height' } };
      } else {
        p.yc = {
          scale: model.scale(Y),
          field: model.field(Y)
        };
        p.height = { value: model.sizeValue(Y) };
      }
    } else if (model.fieldDef(Y).bin) {
      if (model.has(SIZE) && orient === 'horizontal') {
        // For horizontal chart that has binned Y and size,
        // center bar and apply size to height.
        p.yc = {
          scale: model.scale(Y),
          field: model.field(Y, { binSuffix: '_mid' })
        };
        p.height = {
          scale: model.scale(SIZE),
          field: model.field(SIZE)
        };
      } else {
        // Otherwise, simply use <field>_start, <field>_end
        p.y = {
          scale: model.scale(Y),
          field: model.field(Y, { binSuffix: '_start' })
        };
        p.y2 = {
          scale: model.scale(Y),
          field: model.field(Y, { binSuffix: '_end' }),
          offset: 1
        };
      }
    } else { // y is ordinal or unspecified

      if (model.has(Y)) { // is ordinal
        p.yc = {
          scale: model.scale(Y),
          field: model.field(Y)
        };
      } else { // No Y
        p.y2 = {
          field: { group: 'height' },
          offset: -1
        };
      }

      p.height = model.has(SIZE)  && orient === 'horizontal' ? {
          // apply size scale if has size and is horizontal
          scale: model.scale(SIZE),
          field: model.field(SIZE)
        } : {
          value: model.sizeValue(Y)
        };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#64): fill this method
    return undefined;
  }
}

export namespace point {
  export function markType() {
    return 'symbol';
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
      p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
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
      p.size = {
        scale: model.scale(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.size = { value: model.sizeValue() };
    }

    // shape
    if (model.has(SHAPE)) {
      p.shape = {
        scale: model.scale(SHAPE),
        field: model.field(SHAPE)
      };
    } else {
      p.shape = { value: model.fieldDef(SHAPE).value };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
  }
}

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

export namespace area {
  export function markType() {
    return 'area';
  }

  // TODO(#694): optimize area's usage with bin
  export function properties(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    const orient = model.config().mark.orient;
    if (orient !== undefined) {
      p.orient = { value: orient };
    }

    const stack = model.stack();
    // x
    if (stack && X === stack.fieldChannel) { // Stacked Measure
      p.x = {
        scale: model.scale(X),
        field: model.field(X) + '_start'
      };
    } else if (model.isMeasure(X)) { // Measure
      p.x = { scale: model.scale(X), field: model.field(X) };
    } else if (model.isDimension(X)) {
      p.x = {
        scale: model.scale(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    }

    // x2
    if (orient === 'horizontal') {
      if (stack && X === stack.fieldChannel) {
        p.x2 = {
          scale: model.scale(X),
          field: model.field(X) + '_end'
        };
      } else {
        p.x2 = {
          scale: model.scale(X),
          value: 0
        };
      }
    }

    // y
    if (stack && Y === stack.fieldChannel) { // Stacked Measure
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y) + '_start'
      };
    } else if (model.isMeasure(Y)) {
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y)
      };
    } else if (model.isDimension(Y)) {
      p.y = {
        scale: model.scale(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    }

    if (orient !== 'horizontal') { // 'vertical' or undefined are vertical
      if (stack && Y === stack.fieldChannel) {
        p.y2 = {
          scale: model.scale(Y),
          field: model.field(Y) + '_end'
        };
      } else {
        p.y2 = {
          scale: model.scale(Y),
          value: 0
        };
      }
    }

    applyColorAndOpacity(p, model);
    applyMarkConfig(p, model, ['interpolate', 'tension']);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}

export namespace tick {
  export function markType() {
    return 'rect';
  }

  export function properties(model: Model) {
    var p: any = {};

    // x
    if (model.has(X)) {
      p.xc = {
        scale: model.scale(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: 0, offset: 2 };
    }

    // y
    if (model.has(Y)) {
      p.yc = {
        scale: model.scale(Y),
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { value: 0 };
    }

    if (model.config().mark.orient === 'horizontal') {
      p.width = { value: model.config().mark.thickness };
      p.height = { value: model.sizeValue(Y) }; // TODO(#932) support size channel
    } else {
      p.width = { value: model.sizeValue(X) }; // TODO(#932) support size channel
      p.height = { value: model.config().mark.thickness };
    }

    applyColorAndOpacity(p, model, ColorMode.ALWAYS_FILLED);
    return p;
  }

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}

function filled_point_props(shape) {
  return function(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: model.scale(X),
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
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
      p.size = {
        scale: model.scale(SIZE),
        field: model.field(SIZE)
      };
    } else {
      p.size = { value: model.sizeValue() };
    }

    // shape
    p.shape = { value: shape };

    applyColorAndOpacity(p, model, ColorMode.ALWAYS_FILLED);
    return p;
  };
}

export namespace circle {
  export function markType(model: Model) {
    return 'symbol';
  }

  export const properties = filled_point_props('circle');

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}

export namespace square {
  export function markType(model: Model) {
    return 'symbol';
  }

  export const properties = filled_point_props('square');

  export function labels(model: Model) {
    // TODO(#240): fill this method
    return undefined;
  }
}

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
    return undefined; // text do not support label
  }
}
