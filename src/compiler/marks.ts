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
  const from = {from: model.dataTable()};
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
  export function bar(e: Model, layout, style) {
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

  export function point(e: Model, layout, style) {
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

  export function line(e: Model,layout, style) {
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

  export function tick(e: Model, layout, style) {
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

  export function text(e: Model, layout, style) {
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
}
