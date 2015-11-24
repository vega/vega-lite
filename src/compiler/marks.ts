import {Model} from './Model';
import {COLUMN, ROW, X, Y, COLOR, TEXT, SIZE, SHAPE} from '../channel';
import {AREA, BAR, LINE, POINT, TEXT as TEXTMARKS, TICK, CIRCLE, SQUARE} from '../marktype';
import {QUANTITATIVE} from '../type';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

/* mapping from vega-lite's mark types to vega's mark types */
const MARKTYPES_MAP = {
  bar: 'rect',
  tick: 'rect',
  point: 'symbol',
  line: 'line',
  area: 'area',
  text: 'text',
  circle: 'symbol',
  square: 'symbol'
};

export function compileMarks(model: Model, layout, style) {
  const marktype = model.marktype();
  const from = {data: model.dataTable()};
  let defs = [];

  switch (marktype) {
    case TEXTMARKS:
      if (model.has(COLOR)) {
        defs.push({
          type: 'rect',
          from: from,
          properties: {update: properties.textBackground(model, layout)}
        });
      }
      break;
    case LINE:
    case AREA:
      // TODO: move subfacets and line sort logic here
  };

  defs.push({
    type: MARKTYPES_MAP[marktype],
    from: from,
    properties: {
      update: properties[marktype](model, layout, style)
    }
  });

  return defs;
}

export namespace properties {
export function bar(model: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x's and width
  if (model.fieldDef(X).bin) {
    p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_start'}), offset: 1};
    p.x2 = {scale: X, field: model.fieldRef(X, {binSuffix: '_end'})};
  } else if (model.isMeasure(X)) {
    p.x = {scale: X, field: model.fieldRef(X)};
    if (!model.has(Y) || model.isDimension(Y)) {
      p.x2 = {value: 0};
    }
  } else {
    if (model.has(X)) { // is ordinal
       p.xc = {scale: X, field: model.fieldRef(X)};
    } else {
       p.x = {value: 0, offset: model.config('singleBarOffset')};
    }
  }

  // width
  if (!p.x2) {
    if (!model.has(X) || model.isOrdinalScale(X)) { // no X or X is ordinal
      if (model.has(SIZE)) {
        p.width = {scale: SIZE, field: model.fieldRef(SIZE)};
      } else {
        p.width = {
          value: model.bandWidth(X, layout.x.useSmallBand),
          offset: -1
        };
      }
    } else { // X is Quant or Time Scale
      p.width = {value: 2};
    }
  }

  // y's & height
  if (model.fieldDef(Y).bin) {
    p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_start'})};
    p.y2 = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_end'}), offset: 1};
  } else if (model.isMeasure(Y)) {
    p.y = {scale: Y, field: model.fieldRef(Y)};
    p.y2 = {field: {group: 'height'}};
  } else {
    if (model.has(Y)) { // is ordinal
      p.yc = {scale: Y, field: model.fieldRef(Y)};
    } else {
      p.y2 = {
        field: {group: 'height'},
        offset: -model.config('singleBarOffset')
      };
    }

    if (model.has(SIZE)) {
      p.height = {scale: SIZE, field: model.fieldRef(SIZE)};
    } else {
      p.height = {
        value: model.bandWidth(Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  }

  // fill
  if (model.has(COLOR)) {
    p.fill = {scale: COLOR, field: model.fieldRef(COLOR)};
  } else {
    p.fill = {value: model.fieldDef(COLOR).value};
  }

  // opacity
  var opacity = model.fieldDef(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

export function point(model: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (model.has(X)) {
    p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!model.has(X)) {
    p.x = {value: model.bandWidth(X, layout.x.useSmallBand) / 2};
  }

  // y
  if (model.has(Y)) {
    p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!model.has(Y)) {
    p.y = {value: model.bandWidth(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (model.has(SIZE)) {
    p.size = {scale: SIZE, field: model.fieldRef(SIZE)};
  } else if (!model.has(SIZE)) {
    p.size = {value: model.fieldDef(SIZE).value};
  }

  // shape
  if (model.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: model.fieldRef(SHAPE)};
  } else if (!model.has(SHAPE)) {
    p.shape = {value: model.fieldDef(SHAPE).value};
  }

  // fill or stroke
  if (model.fieldDef(SHAPE).filled) {
    if (model.has(COLOR)) {
      p.fill = {scale: COLOR, field: model.fieldRef(COLOR)};
    } else if (!model.has(COLOR)) {
      p.fill = {value: model.fieldDef(COLOR).value};
    }
  } else {
    if (model.has(COLOR)) {
      p.stroke = {scale: COLOR, field: model.fieldRef(COLOR)};
    } else if (!model.has(COLOR)) {
      p.stroke = {value: model.fieldDef(COLOR).value};
    }
    p.strokeWidth = {value: model.config('strokeWidth')};
  }

  // opacity
  var opacity = model.fieldDef(COLOR).opacity || style.opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

export function line(model: Model,layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (model.has(X)) {
    p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!model.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (model.has(Y)) {
    p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!model.has(Y)) {
    p.y = {field: {group: 'height'}};
  }

  // stroke
  if (model.has(COLOR)) {
    p.stroke = {scale: COLOR, field: model.fieldRef(COLOR)};
  } else if (!model.has(COLOR)) {
    p.stroke = {value: model.fieldDef(COLOR).value};
  }

  var opacity = model.fieldDef(COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  p.strokeWidth = {value: model.config('strokeWidth')};

  return p;
}

// TODO(#694): optimize area's usage with bin
export function area(e: Model, layout, style) {
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

export function tick(model: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (model.has(X)) {
    p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_mid'})};
    if (model.isDimension(X)) {
      p.x.offset = -model.bandWidth(X, layout.x.useSmallBand) / 3;
    }
  } else if (!model.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (model.has(Y)) {
    p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_mid'})};
    if (model.isDimension(Y)) {
      p.y.offset = -model.bandWidth(Y, layout.y.useSmallBand) / 3;
    }
  } else if (!model.has(Y)) {
    p.y = {value: 0};
  }

  // width
  if (!model.has(X) || model.isDimension(X)) {
    // TODO(#694): optimize tick's width for bin
    p.width = {value: model.bandWidth(X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!model.has(Y) || model.isDimension(Y)) {
    // TODO(#694): optimize tick's height for bin
    p.height = {value: model.bandWidth(Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (model.has(COLOR)) {
    p.fill = {scale: COLOR, field: model.fieldRef(COLOR)};
  } else {
    p.fill = {value: model.fieldDef(COLOR).value};
  }

  var opacity = model.fieldDef(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  return p;
}

function filled_point_props(shape) {
  return function(model: Model, layout, style) {
    // TODO Use Vega's marks properties interface
    var p:any = {};

    // x
    if (model.has(X)) {
      p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_mid'})};
    } else if (!model.has(X)) {
      p.x = {value: model.bandWidth(X, layout.x.useSmallBand) / 2};
    }

    // y
    if (model.has(Y)) {
      p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_mid'})};
    } else if (!model.has(Y)) {
      p.y = {value: model.bandWidth(Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (model.has(SIZE)) {
      p.size = {scale: SIZE, field: model.fieldRef(SIZE)};
    } else if (!model.has(X)) {
      p.size = {value: model.fieldDef(SIZE).value};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (model.has(COLOR)) {
      p.fill = {scale: COLOR, field: model.fieldRef(COLOR)};
    } else if (!model.has(COLOR)) {
      p.fill = {value: model.fieldDef(COLOR).value};
    }

    var opacity = model.fieldDef(COLOR).opacity  || style.opacity;
    if(opacity) p.opacity = {value: opacity};

    return p;
  };
}

export const circle = filled_point_props('circle');
export const square = filled_point_props('square');

export function textBackground(model: Model, layout) {
  return {
    x: {value: 0},
    y: {value: 0},
    x2: {value: layout.cellWidth},
    y2: {value: layout.cellHeight},
    fill: {scale: COLOR, field: model.fieldRef(COLOR)}
  };
}

export function text(model: Model, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {},
    fieldDef = model.fieldDef(TEXT);

  // x
  if (model.has(X)) {
    p.x = {scale: X, field: model.fieldRef(X, {binSuffix: '_mid'})};
  } else if (!model.has(X)) {
    if (model.has(TEXT) && model.fieldDef(TEXT).type === QUANTITATIVE) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: model.bandWidth(X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (model.has(Y)) {
    p.y = {scale: Y, field: model.fieldRef(Y, {binSuffix: '_mid'})};
  } else if (!model.has(Y)) {
    p.y = {value: model.bandWidth(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (model.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: model.fieldRef(SIZE)};
  } else if (!model.has(SIZE)) {
    p.fontSize = {value: fieldDef.font.size};
  }

  // fill
  // color should be set to background
  p.fill = {value: fieldDef.color};

  var opacity = model.fieldDef(COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  // text
  if (model.has(TEXT)) {
    if (model.fieldDef(TEXT).type === QUANTITATIVE) {
      var numberFormat = fieldDef.format !== undefined ?
                         fieldDef.format : model.numberFormat(TEXT);

      p.text = {template: '{{' + model.fieldRef(TEXT, {datum: true}) + ' | number:\'' +
        numberFormat +'\'}}'};
      p.align = {value: fieldDef.align};
    } else {
      p.text = {field: model.fieldRef(TEXT)};
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
}
