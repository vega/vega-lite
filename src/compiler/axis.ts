import Encoding from '../Encoding';
import * as util from '../util';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {COL, ROW, X, Y} from '../channel';
import * as time from './time';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

export function def(name: string, encoding: Encoding, layout, stats) {
  var isCol = name == COL,
    isRow = name == ROW,
    type = isCol ? 'x' : isRow ? 'y': name;

  // TODO: rename def to axisDef and avoid side effects where possible.
  // TODO: replace any with Vega Axis Interface
  var def:any = {
    type: type,
    scale: name
  };

  // 1. Add properties
  [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'format', 'grid', 'layer', 'offset', 'orient', 'tickSize', 'ticks', 'title', 'titleOffset',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
    'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
    'values', 'subdivide'
  ].forEach(function(property) {
    let method: (encoding:Encoding, name:String, layout:any, stats:any, def:any)=>any;

    var value = (method = exports[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(encoding, name, layout, stats, def) :
                  encoding.fieldDef(name).axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  var props = encoding.fieldDef(name).axis.properties || {};

  [
    'axis', 'grid', 'labels', 'title', // have special rules
    'ticks', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(group) {
    var value = properties[group] ?
      properties[group](encoding, name, props[group], layout, def) :
      props[group];
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function format(encoding: Encoding, name: string) {
  let fieldDef = encoding.fieldDef(name);
  var format = fieldDef.axis.format;
  if (format !== undefined)  {
    return format;
  }

  if (fieldDef.type === QUANTITATIVE) {
    return encoding.numberFormat(name);
  } else if (fieldDef.type === TEMPORAL) {
    var timeUnit = encoding.fieldDef(name).timeUnit;
    if (!timeUnit) {
      return encoding.config('timeFormat');
    } else if (timeUnit === 'year') {
      return 'd';
    }
  }
  return undefined;
}

export function grid(encoding: Encoding, name: string) {
  var grid = encoding.axis(name).grid;
  if (grid !== undefined) {
    return grid;
  }

  // If `grid` is unspecified, the default value is `true` for
  // - ROW and COL.
  // - X and Y that have (1) quantitative fields that are not binned or (2) time fields.
  // Otherwise, the default value is `false`.
  return name === ROW || name === COL ||
    (encoding.isTypes(name, [QUANTITATIVE, TEMPORAL]) && !encoding.fieldDef(name).bin);
}

export function layer(encoding: Encoding, name: string, layout, stats, def) {
  var layer = encoding.axis(name).layer;
  if (layer !== undefined) {
    return layer;
  }
  if (def.grid) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 'back';
  }
  return undefined; // otherwise return undefined and use Vega's default.
};

export function offset(encoding: Encoding, name: string, layout) {
  var offset = encoding.fieldDef(name).axis.offset;
  if (offset) {
    return offset;
  }

  if(name === ROW) {
   return layout.y.axisTitleOffset + 20;
  }
  return undefined;
}

export function orient(encoding: Encoding, name: string, layout, stats) {
  var orient = encoding.fieldDef(name).axis.orient;
  if (orient) {
    return orient;
  } else if (name === COL) {
    return 'top';
  } else if (name === X && encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
    // FIXME remove this case and migrate this logic to vega-lite-ui
    // x-axis for long y - put on top
    return 'top';
  }
  return undefined;
}

export function ticks(encoding: Encoding, name: string) {
  var ticks = encoding.fieldDef(name).axis.ticks;
  if (ticks !== undefined) {
    return ticks;
  }

  // FIXME depends on scale type too
  if (name === X && !encoding.fieldDef(name).bin) {
    return 5;
  }

  return undefined;
}

export function tickSize(encoding: Encoding, name: string) {
  var tickSize = encoding.fieldDef(name).axis.tickSize;
  if (tickSize !== undefined) {
    return tickSize;
  }
  if (name === ROW || name === COL) {
    return 0;
  }
  return undefined;
}


export function title(encoding: Encoding, name: string, layout) {
  var axisSpec = encoding.fieldDef(name).axis;
  if (axisSpec.title !== undefined) {
    return axisSpec.title;
  }

  // if not defined, automatically determine axis title from field def
  var fieldTitle = encoding.fieldTitle(name);

  var maxLength;
  if (axisSpec.titleMaxLength) {
  maxLength = axisSpec.titleMaxLength;
  } else if (name === X) {
    maxLength = layout.cellWidth / encoding.config('characterWidth');
  } else if (name === Y) {
    maxLength = layout.cellHeight / encoding.config('characterWidth');
  }

  return maxLength ? util.truncate(fieldTitle, maxLength) : fieldTitle;
}


export function titleOffset(encoding: Encoding, name: string) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    case ROW: return 0;
    case COL: return 35;
  }
  return undefined;
}

namespace properties {
  export function axis(encoding: Encoding, name: string, spec) {
    if (name === ROW || name === COL) {
      // hide axis for facets
      return util.extend({
        opacity: {value: 0}
      }, spec || {});
    }
    return spec || undefined;
  }

  export function grid(encoding: Encoding, name: string, spec, layout, def) {
    var cellPadding = layout.cellPadding;

    if (def.grid) {
      if (name == COL) {
        // set grid property -- put the lines on the right the cell
        var yOffset = encoding.config('cellGridOffset');

        var sign = encoding.fieldDef(name).axis.orient === 'bottom' ? -1 : 1;

        // TODO(#677): this should depend on orient
        return util.extend({
          x: {
            offset: layout.cellWidth * (1+ cellPadding/2.0),
            // default value(s) -- vega doesn't do recursive merge
            scale: 'col',
            field: 'data'
          },
          y: {
            value: - sign * yOffset,
          },
          y2: {
            field: {group: 'mark.group.height'},
            offset: sign * yOffset,
            mult: sign
          },
          stroke: { value: encoding.config('cellGridColor') },
          strokeOpacity: { value: encoding.config('cellGridOpacity') }
        }, spec || {});
      } else if (name == ROW) {
        var xOffset = encoding.config('cellGridOffset');

        var sign = encoding.fieldDef(name).axis.orient === 'right' ? -1 : 1;

        // TODO(#677): this should depend on orient
        // set grid property -- put the lines on the top
        return util.extend({
          y: {
            offset: -layout.cellHeight * (cellPadding/2),
            // default value(s) -- vega doesn't do recursive merge
            scale: 'row',
            field: 'data'
          },
          x: {
            value: sign * (def.offset - xOffset)
          },
          x2: {
            field: {group: 'mark.group.width'},
            offset: sign * (def.offset + xOffset),
            // default value(s) -- vega doesn't do recursive merge
            mult: sign
          },
          stroke: { value: encoding.config('cellGridColor') },
          strokeOpacity: { value: encoding.config('cellGridOpacity') }
        }, spec || {});
      } else {
        return util.extend({
          stroke: { value: encoding.config('gridColor') },
          strokeOpacity: { value: encoding.config('gridOpacity') }
        }, spec || {});
      }
    }
    return spec || undefined;
  }

  export function labels(encoding: Encoding, name: string, spec, layout, def) {
    let fieldDef = encoding.fieldDef(name);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.type === TEMPORAL && timeUnit && (time.hasScale(timeUnit))) {
      spec = util.extend({
        text: {scale: 'time-' + timeUnit, field: 'data'}
      }, spec || {});
    }

    if (encoding.isTypes(name, [NOMINAL, ORDINAL]) && encoding.axis(name).labelMaxLength) {
      // TODO replace this with Vega's labelMaxLength once it is introduced
      spec = util.extend({
        text: {
          template: '{{ datum.data | truncate:' + encoding.axis(name).labelMaxLength + '}}'
        }
      }, spec || {});
    }

     // for x-axis, set ticks for Q or rotate scale for ordinal scale
    if (name == X) {
      if ((encoding.isDimension(X) || fieldDef.type === TEMPORAL)) {
        spec = util.extend({
          angle: {value: 270},
          align: {value: def.orient === 'top' ? 'left': 'right'},
          baseline: {value: 'middle'}
        }, spec || {});
      }
    }
    return spec || undefined;
  }

  export function title(encoding: Encoding, name: string, spec, layout) {
    if (name === ROW) {
      return util.extend({
        angle: {value: 0},
        align: {value: 'right'},
        baseline: {value: 'middle'},
        dy: {value: (-layout.height / 2) - 20}
      }, spec || {});
    }
    return spec || undefined;
  }
}
