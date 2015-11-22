import {Model} from './Model';
import {COLUMN, ROW, X, Y, COLOR, TEXT, SIZE, SHAPE} from '../channel';
import {QUANTITATIVE} from '../type';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

export function compileMarks(model: Model, layout, style) {
  var defs = [],
    mark = exports[model.marktype()],
    from = model.dataTable();

  // to add a background to text, we need to add it before the text
  if (model.marktype() === TEXT && model.has(COLOR)) {
    var bg = {
      x: {value: 0},
      y: {value: 0},
      x2: {value: layout.cellWidth},
      y2: {value: layout.cellHeight},
      fill: {scale: COLOR, field: model.fieldRef(COLOR)}
    };
    defs.push({
      type: 'rect',
      from: {data: from},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(model, layout, style);
  defs.push({
    type: mark.type,
    from: {data: from},
    properties: {update: p}
  });

  return defs;
}

export const bar = {
  type: 'rect',
  prop: bar_props
};

export const line = {
  type: 'line',
  prop: line_props
};

export const area = {
  type: 'area',
  prop: area_props
};

export const tick = {
  type: 'rect',
  prop: tick_props
};

export const circle = {
  type: 'symbol',
  prop: filled_point_props('circle')
};

export const square = {
  type: 'symbol',
  prop: filled_point_props('square')
};

export const point = {
  type: 'symbol',
  prop: point_props
};

export const text = {
  type: 'text',
  prop: text_props
};

function bar_props(e: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x's and width
  if (e.fieldDef(X).bin) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_start'}), offset: 1};
    p.x2 = {scale: X, field: e.fieldRef(X, {binSuffix: '_end'})};
  } else if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
    if (!e.has(Y) || e.isDimension(Y)) {
      p.x2 = {value: 0};
    }
  } else {
    if (e.has(X)) { // is ordinal
       p.xc = {scale: X, field: e.fieldRef(X)};
    } else {
       p.x = {value: 0, offset: e.config('singleBarOffset')};
    }
  }

  // width
  if (!p.x2) {
    if (!e.has(X) || e.isOrdinalScale(X)) { // no X or X is ordinal
      if (e.has(SIZE)) {
        p.width = {scale: SIZE, field: e.fieldRef(SIZE)};
      } else {
        p.width = {
          value: e.bandWidth(X, layout.x.useSmallBand),
          offset: -1
        };
      }
    } else { // X is Quant or Time Scale
      p.width = {value: 2};
    }
  }

  // y's & height
  if (e.fieldDef(Y).bin) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_start'})};
    p.y2 = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_end'}), offset: 1};
  } else if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
    p.y2 = {field: {group: 'height'}};
  } else {
    if (e.has(Y)) { // is ordinal
      p.yc = {scale: Y, field: e.fieldRef(Y)};
    } else {
      p.y2 = {
        field: {group: 'height'},
        offset: -e.config('singleBarOffset')
      };
    }

    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.fieldRef(SIZE)};
    } else {
      p.height = {
        value: e.bandWidth(Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else {
    p.fill = {value: e.fieldDef(COLOR).value};
  }

  // opacity
  var opacity = e.fieldDef(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function point_props(e: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!e.has(X)) {
    p.x = {value: e.bandWidth(X, layout.x.useSmallBand) / 2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandWidth(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.fieldRef(SIZE)};
  } else if (!e.has(SIZE)) {
    p.size = {value: e.fieldDef(SIZE).value};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.fieldRef(SHAPE)};
  } else if (!e.has(SHAPE)) {
    p.shape = {value: e.fieldDef(SHAPE).value};
  }

  // fill or stroke
  if (e.fieldDef(SHAPE).filled) {
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.fieldDef(COLOR).value};
    }
  } else {
    if (e.has(COLOR)) {
      p.stroke = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.stroke = {value: e.fieldDef(COLOR).value};
    }
    p.strokeWidth = {value: e.config('strokeWidth')};
  }

  // opacity
  var opacity = e.fieldDef(COLOR).opacity || style.opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function line_props(e: Model,layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!e.has(Y)) {
    p.y = {field: {group: 'height'}};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.fieldDef(COLOR).value};
  }

  var opacity = e.fieldDef(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

// TODO(#694): optimize area's usage with bin
function area_props(e: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.fieldRef(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: 'horizontal'};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
  } else {
    p.y = {field: {group: 'height'}};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.fieldDef(COLOR).value};
  }

  var opacity = e.fieldDef(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function tick_props(e: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
    if (e.isDimension(X)) {
      p.x.offset = -e.bandWidth(X, layout.x.useSmallBand) / 3;
    }
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
    if (e.isDimension(Y)) {
      p.y.offset = -e.bandWidth(Y, layout.y.useSmallBand) / 3;
    }
  } else if (!e.has(Y)) {
    p.y = {value: 0};
  }

  // width
  if (!e.has(X) || e.isDimension(X)) {
    // TODO(#694): optimize tick's width for bin
    p.width = {value: e.bandWidth(X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!e.has(Y) || e.isDimension(Y)) {
    // TODO(#694): optimize tick's height for bin
    p.height = {value: e.bandWidth(Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
  } else {
    p.fill = {value: e.fieldDef(COLOR).value};
  }

  var opacity = e.fieldDef(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  return p;
}

function filled_point_props(shape) {
  return function(e: Model, layout, style) {
    // TODO Use Vega's marks properties interface
    var p:any = {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
    } else if (!e.has(X)) {
      p.x = {value: e.bandWidth(X, layout.x.useSmallBand) / 2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
    } else if (!e.has(Y)) {
      p.y = {value: e.bandWidth(Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.fieldRef(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.fieldDef(SIZE).value};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.fieldRef(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.fieldDef(COLOR).value};
    }

    var opacity = e.fieldDef(COLOR).opacity  || style.opacity;
    if(opacity) p.opacity = {value: opacity};

    return p;
  };
}

function text_props(e: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {},
    fieldDef = e.fieldDef(TEXT);

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!e.has(X)) {
    if (e.has(TEXT) && e.fieldDef(TEXT).type === QUANTITATIVE) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: e.bandWidth(X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandWidth(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.fieldRef(SIZE)};
  } else if (!e.has(SIZE)) {
    p.fontSize = {value: fieldDef.font.size};
  }

  // fill
  // color should be set to background
  p.fill = {value: fieldDef.color};

  var opacity = e.fieldDef(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  // text
  if (e.has(TEXT)) {
    if (e.fieldDef(TEXT).type === QUANTITATIVE) {
      var numberFormat = fieldDef.format !== undefined ?
                         fieldDef.format : e.numberFormat(TEXT);

      p.text = {template: '{{' + e.fieldRef(TEXT, {datum: true}) + ' | number:\'' +
        numberFormat +'\'}}'};
      p.align = {value: fieldDef.align};
    } else {
      p.text = {field: e.fieldRef(TEXT)};
    }
  } else {
    p.text = {value: fieldDef.placeholder};
  }

  p.font = {value: fieldDef.font.family};
  p.fontWeight = {value: fieldDef.font.weight};
  p.fontStyle = {value: fieldDef.font.style};
  p.baseline = {value: fieldDef.baseline};

  return p;
}
