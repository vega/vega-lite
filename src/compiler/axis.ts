import {getter, setter} from '../util';
import Encoding from '../Encoding';
import * as util from '../util';
import {Type, Enctype} from '../consts';

import * as time from './time';

export default function(name, encoding: Encoding, layout, stats) {
  var isCol = name == Enctype.COL,
    isRow = name == Enctype.ROW,
    type = isCol ? 'x' : isRow ? 'y': name;

  // TODO: rename def to axisDef and avoid side effects where possible.
  // TODO: replace any with Vega Axis Interface
  var def:any = {
    type: type,
    scale: name
  };

  // properties with special rules (so it has axis[property] methods) -- call rule functions
  var methods = {
    'format': format, 'grid': grid, 'offset': offset, 'orient': orient,
    'tickSize': tickSize, 'ticks': ticks, 'title': title, 'titleOffset': titleOffset
  };

  // Add optional properties

  for (var property in methods) {
    var value = methods[property](encoding, name, layout, stats);
    if (value !== undefined) {
      def[property] = value;
    }
  }

  [
    // If we don't have a special function, only produce default values in the schema, or explicit value if specified
    'layer', 'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
    'values', 'subdivide'
  ].forEach(function(property) {
    var value = encoding.encDef(name).axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // Add properties
  var props = encoding.encDef(name).axis.properties || {};

  [
    'axis', 'grid', 'labels', 'title', // have special rules
    'ticks', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(property) {
    var value = properties[property] ?
      properties[property](encoding, name, props[property], layout, def) :
      props[property];
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[property] = value;
    }
  });

  return def;
};

export function format(encoding: Encoding, name) {
  var format = encoding.encDef(name).axis.format;
  if (format !== undefined)  {
    return format;
  }

  if (encoding.isType(name, Type.Q)) {
    return encoding.numberFormat(name);
  } else if (encoding.isType(name, Type.T)) {
    var timeUnit = encoding.encDef(name).timeUnit;
    if (!timeUnit) {
      return encoding.config('timeFormat');
    } else if (timeUnit === 'year') {
      return 'd';
    }
  }
  return undefined;
};

export function grid(encoding, name) {
  var grid = encoding.axis(name).grid;
  if (grid !== undefined) {
    return grid;
  }

  // If `grid` is unspecified, the default value is `true` for
  // - ROW and COL.
  // - X and Y that have (1) quantitative fields that are not binned or (2) time fields.
  // Otherwise, the default value is `false`.
  return name === Enctype.ROW || name === Enctype.COL ||
    (encoding.isTypes(name, [Type.Q, Type.T]) && !encoding.encDef(name).bin);
};

export function offset(encoding, name, layout) {
  var offset = encoding.encDef(name).axis.offset;
  if (offset) {
    return offset;
  }

  if(name === Enctype.ROW) {
   return layout.y.axisTitleOffset + 20;
  }
  return undefined;
};

export function orient(encoding, name, layout, stats) {
  var orient = encoding.encDef(name).axis.orient;
  if (orient) {
    return orient;
  } else if (name === Enctype.COL) {
    return 'top';
  } else if (name === Enctype.X && encoding.has(Enctype.Y) && encoding.isOrdinalScale(Enctype.Y) && encoding.cardinality(Enctype.Y, stats) > 30) {
    // FIXME remove this case and migrate this logic to vega-lite-ui
    // x-axis for long y - put on top
    return 'top';
  }
  return undefined;
};

export function ticks(encoding, name) {
  var ticks = encoding.encDef(name).axis.ticks;
  if (ticks !== undefined) {
    return ticks;
  }

  // FIXME depends on scale type too
  if (name === Enctype.X && !encoding.encDef(name).bin) {
    return 5;
  }

  return undefined;
};

export function tickSize(encoding, name) {
  var tickSize = encoding.encDef(name).axis.tickSize;
  if (tickSize !== undefined) {
    return tickSize;
  }
  if (name === Enctype.ROW || name === Enctype.COL) {
    return 0;
  }
  return undefined;
};


export function title(encoding, name, layout) {
  var axisSpec = encoding.encDef(name).axis;
  if (axisSpec.title !== undefined) {
    return axisSpec.title;
  }

  // if not defined, automatically determine axis title from field def
  var fieldTitle = encoding.fieldTitle(name);

  var maxLength;
  if (axisSpec.titleMaxLength) {
  maxLength = axisSpec.titleMaxLength;
  } else if (name === Enctype.X) {
    maxLength = layout.cellWidth / encoding.config('characterWidth');
  } else if (name === Enctype.Y) {
    maxLength = layout.cellHeight / encoding.config('characterWidth');
  }

  return maxLength ? util.truncate(fieldTitle, maxLength) : fieldTitle;
};


export function titleOffset(encoding, name) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    case Enctype.ROW: return 0;
    case Enctype.COL: return 35;
  }
  return undefined;
};

namespace properties {
  export function axis(encoding, name, spec) {
    if (name === Enctype.ROW || name === Enctype.COL) {
      // hide axis for facets
      return util.extend({
        opacity: {value: 0}
      }, spec || {});
    }
    return spec || undefined;
  }

  export function grid(encoding, name, spec, layout, def) {
    var cellPadding = layout.cellPadding;

    if (def.grid) {
      if (name == Enctype.COL) {
        // set grid property -- put the lines on the right the cell
        var yOffset = encoding.config('cellGridOffset');

        // TODO(#677): this should depend on orient
        return util.extend({
          x: {
            offset: layout.cellWidth * (1+ cellPadding/2.0),
            // default value(s) -- vega doesn't do recursive merge
            scale: 'col',
            field: 'data'
          },
          y: {
            value: -yOffset,
          },
          y2: {
            field: {group: 'mark.group.height'},
            offset: yOffset
          },
          stroke: { value: encoding.config('cellGridColor') },
          strokeOpacity: { value: encoding.config('cellGridOpacity') }
        }, spec || {});
      } else if (name == Enctype.ROW) {
        var xOffset = encoding.config('cellGridOffset');

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
            value: def.offset - xOffset
          },
          x2: {
            field: {group: 'mark.group.width'},
            offset: def.offset + xOffset,
            // default value(s) -- vega doesn't do recursive merge
            mult: 1
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

  export function labels(encoding, name, spec, layout, def) {
    var timeUnit = encoding.encDef(name).timeUnit;
    if (encoding.isType(name, Type.T) && timeUnit && (time.hasScale(timeUnit))) {
      spec = util.extend({
        text: {scale: 'time-' + timeUnit}
      }, spec || {});
    }

    if (encoding.isTypes(name, [Type.N, Type.O]) && encoding.axis(name).labelMaxLength) {
      // TODO replace this with Vega's labelMaxLength once it is introduced
      spec = util.extend({
        text: {
          template: '{{ datum.data | truncate:' + encoding.axis(name).labelMaxLength + '}}'
        }
      }, spec || {});
    }

     // for x-axis, set ticks for Q or rotate scale for ordinal scale
    if (name == Enctype.X) {
      if ((encoding.isDimension(Enctype.X) || encoding.isType(Enctype.X, Type.T))) {
        spec = util.extend({
          angle: {value: 270},
          align: {value: def.orient === 'top' ? 'left': 'right'},
          baseline: {value: 'middle'}
        }, spec || {});
      }
    }
    return spec || undefined;
  }

  export function title(encoding, name, spec, layout) {
    if (name === Enctype.ROW) {
      return util.extend({
        angle: {value: 0},
        align: {value: 'right'},
        baseline: {value: 'middle'},
        dy: {value: (-layout.height / 2) - 20}
      }, spec || {});
    }
    return spec || undefined;
  }
};
