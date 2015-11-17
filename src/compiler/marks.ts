import {Enctype, Type} from '../consts';
import Encoding from '../Encoding';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

export function defs(encoding, layout, style) {
  var defs = [],
    mark = exports[encoding.marktype()],
    from = encoding.dataTable();

  // to add a background to text, we need to add it before the text
  if (encoding.marktype() === Enctype.TEXT && encoding.has(Enctype.COLOR)) {
    var bg = {
      x: {value: 0},
      y: {value: 0},
      x2: {value: layout.cellWidth},
      y2: {value: layout.cellHeight},
      fill: {scale: Enctype.COLOR, field: encoding.fieldRef(Enctype.COLOR)}
    };
    defs.push({
      type: 'rect',
      from: {data: from},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(encoding, layout, style);
  defs.push({
    type: mark.type,
    from: {data: from},
    properties: {enter: p, update: p}
  });

  return defs;
}

export const bar = {
  type: 'rect',
  prop: bar_props
};

export const line = {
  type: 'line',
  line: true,
  prop: line_props
};

export const area = {
  type: 'area',
  line: true,
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

function bar_props(e: Encoding, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x's and width
  if (e.fieldDef(Enctype.X).bin) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_start'}), offset: 1};
    p.x2 = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_end'})};
  } else if (e.isMeasure(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X)};
    if (!e.has(Enctype.Y) || e.isDimension(Enctype.Y)) {
      p.x2 = {value: 0};
    }
  } else {
    if (e.has(Enctype.X)) { // is ordinal
       p.xc = {scale: Enctype.X, field: e.fieldRef(Enctype.X)};
    } else {
       p.x = {value: 0, offset: e.config('singleBarOffset')};
    }
  }

  // width
  if (!p.x2) {
    if (!e.has(Enctype.X) || e.isOrdinalScale(Enctype.X)) { // no X or X is ordinal
      if (e.has(Enctype.SIZE)) {
        p.width = {scale: Enctype.SIZE, field: e.fieldRef(Enctype.SIZE)};
      } else {
        p.width = {
          value: e.bandWidth(Enctype.X, layout.x.useSmallBand),
          offset: -1
        };
      }
    } else { // X is Quant or Time Scale
      p.width = {value: 2};
    }
  }

  // y's & height
  if (e.fieldDef(Enctype.Y).bin) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_start'})};
    p.y2 = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_end'}), offset: 1};
  } else if (e.isMeasure(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y)};
    p.y2 = {field: {group: 'height'}};
  } else {
    if (e.has(Enctype.Y)) { // is ordinal
      p.yc = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y)};
    } else {
      p.y2 = {
        field: {group: 'height'},
        offset: -e.config('singleBarOffset')
      };
    }

    if (e.has(Enctype.SIZE)) {
      p.height = {scale: Enctype.SIZE, field: e.fieldRef(Enctype.SIZE)};
    } else {
      p.height = {
        value: e.bandWidth(Enctype.Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  }

  // fill
  if (e.has(Enctype.COLOR)) {
    p.fill = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
  } else {
    p.fill = {value: e.value(Enctype.COLOR)};
  }

  // opacity
  var opacity = e.fieldDef(Enctype.COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function point_props(e, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.X)) {
    p.x = {value: e.bandWidth(Enctype.X, layout.x.useSmallBand) / 2};
  }

  // y
  if (e.has(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.Y)) {
    p.y = {value: e.bandWidth(Enctype.Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(Enctype.SIZE)) {
    p.size = {scale: Enctype.SIZE, field: e.fieldRef(Enctype.SIZE)};
  } else if (!e.has(Enctype.SIZE)) {
    p.size = {value: e.value(Enctype.SIZE)};
  }

  // shape
  if (e.has(Enctype.SHAPE)) {
    p.shape = {scale: Enctype.SHAPE, field: e.fieldRef(Enctype.SHAPE)};
  } else if (!e.has(Enctype.SHAPE)) {
    p.shape = {value: e.value(Enctype.SHAPE)};
  }

  // fill or stroke
  if (e.fieldDef(Enctype.SHAPE).filled) {
    if (e.has(Enctype.COLOR)) {
      p.fill = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
    } else if (!e.has(Enctype.COLOR)) {
      p.fill = {value: e.value(Enctype.COLOR)};
    }
  } else {
    if (e.has(Enctype.COLOR)) {
      p.stroke = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
    } else if (!e.has(Enctype.COLOR)) {
      p.stroke = {value: e.value(Enctype.COLOR)};
    }
    p.strokeWidth = {value: e.config('strokeWidth')};
  }

  // opacity
  var opacity = e.fieldDef(Enctype.COLOR).opacity || style.opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function line_props(e,layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.Y)) {
    p.y = {field: {group: 'height'}};
  }

  // stroke
  if (e.has(Enctype.COLOR)) {
    p.stroke = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
  } else if (!e.has(Enctype.COLOR)) {
    p.stroke = {value: e.value(Enctype.COLOR)};
  }

  var opacity = e.fieldDef(Enctype.COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

// TODO(#694): optimize area's usage with bin
function area_props(e, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.isMeasure(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X)};
    if (e.isDimension(Enctype.Y)) {
      p.x2 = {scale: Enctype.X, value: 0};
      p.orient = {value: 'horizontal'};
    }
  } else if (e.has(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isMeasure(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y)};
    p.y2 = {scale: Enctype.Y, value: 0};
  } else if (e.has(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
  } else {
    p.y = {field: {group: 'height'}};
  }

  // fill
  if (e.has(Enctype.COLOR)) {
    p.fill = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
  } else if (!e.has(Enctype.COLOR)) {
    p.fill = {value: e.value(Enctype.COLOR)};
  }

  var opacity = e.fieldDef(Enctype.COLOR).opacity;
  if (opacity) p.opacity = {value: opacity};

  return p;
}

function tick_props(e, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {};

  // x
  if (e.has(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
    if (e.isDimension(Enctype.X)) {
      p.x.offset = -e.bandWidth(Enctype.X, layout.x.useSmallBand) / 3;
    }
  } else if (!e.has(Enctype.X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
    if (e.isDimension(Enctype.Y)) {
      p.y.offset = -e.bandWidth(Enctype.Y, layout.y.useSmallBand) / 3;
    }
  } else if (!e.has(Enctype.Y)) {
    p.y = {value: 0};
  }

  // width
  if (!e.has(Enctype.X) || e.isDimension(Enctype.X)) {
    // TODO(#694): optimize tick's width for bin
    p.width = {value: e.bandWidth(Enctype.X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!e.has(Enctype.Y) || e.isDimension(Enctype.Y)) {
    // TODO(#694): optimize tick's height for bin
    p.height = {value: e.bandWidth(Enctype.Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (e.has(Enctype.COLOR)) {
    p.fill = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
  } else {
    p.fill = {value: e.value(Enctype.COLOR)};
  }

  var opacity = e.fieldDef(Enctype.COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  return p;
}

function filled_point_props(shape) {
  return function(e, layout, style) {
    // TODO Use Vega's marks properties interface
    var p:any = {};

    // x
    if (e.has(Enctype.X)) {
      p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
    } else if (!e.has(Enctype.X)) {
      p.x = {value: e.bandWidth(Enctype.X, layout.x.useSmallBand) / 2};
    }

    // y
    if (e.has(Enctype.Y)) {
      p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
    } else if (!e.has(Enctype.Y)) {
      p.y = {value: e.bandWidth(Enctype.Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (e.has(Enctype.SIZE)) {
      p.size = {scale: Enctype.SIZE, field: e.fieldRef(Enctype.SIZE)};
    } else if (!e.has(Enctype.X)) {
      p.size = {value: e.value(Enctype.SIZE)};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(Enctype.COLOR)) {
      p.fill = {scale: Enctype.COLOR, field: e.fieldRef(Enctype.COLOR)};
    } else if (!e.has(Enctype.COLOR)) {
      p.fill = {value: e.value(Enctype.COLOR)};
    }

    var opacity = e.fieldDef(Enctype.COLOR).opacity  || style.opacity;
    if(opacity) p.opacity = {value: opacity};

    return p;
  };
}

function text_props(e, layout, style) {
  // TODO Use Vega's marks properties interface
  var p:any = {},
    fieldDef = e.fieldDef(Enctype.TEXT);

  // x
  if (e.has(Enctype.X)) {
    p.x = {scale: Enctype.X, field: e.fieldRef(Enctype.X, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.X)) {
    if (e.has(Enctype.TEXT) && e.fieldDef(Enctype.TEXT).type === Type.Quantitative) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: e.bandWidth(Enctype.X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (e.has(Enctype.Y)) {
    p.y = {scale: Enctype.Y, field: e.fieldRef(Enctype.Y, {bin_suffix: '_mid'})};
  } else if (!e.has(Enctype.Y)) {
    p.y = {value: e.bandWidth(Enctype.Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(Enctype.SIZE)) {
    p.fontSize = {scale: Enctype.SIZE, field: e.fieldRef(Enctype.SIZE)};
  } else if (!e.has(Enctype.SIZE)) {
    p.fontSize = {value: fieldDef.font.size};
  }

  // fill
  // color should be set to background
  p.fill = {value: fieldDef.color};

  var opacity = e.fieldDef(Enctype.COLOR).opacity  || style.opacity;
  if(opacity) p.opacity = {value: opacity};

  // text
  if (e.has(Enctype.TEXT)) {
    if (e.fieldDef(Enctype.TEXT).type === Type.Quantitative) {
      var numberFormat = fieldDef.format || e.numberFormat(Enctype.TEXT);

      p.text = {template: '{{' + e.fieldRef(Enctype.TEXT, {datum: true}) + ' | number:\'' +
        numberFormat +'\'}}'};
      p.align = {value: fieldDef.align};
    } else {
      p.text = {field: e.fieldRef(Enctype.TEXT)};
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
