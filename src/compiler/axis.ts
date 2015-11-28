import {Model} from './Model';
import {roundFloat} from '../util';
import * as util from '../util';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from '../type';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import * as time from './time';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare var exports;

export function compileAxis(channel: Channel, model: Model, layout) {
  var isCol = channel === COLUMN,
    isRow = channel === ROW,
    type = isCol ? 'x' : isRow ? 'y': channel;

  // TODO: rename def to axisDef and avoid side effects where possible.
  // TODO: replace any with Vega Axis Interface
  var def:any = {
    type: type,
    scale: channel
  };

  // 1. Add properties
  [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'format', 'grid', 'layer', 'offset', 'orient', 'tickSize', 'ticks', 'title', 'titleOffset',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
    'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
    'values', 'subdivide'
  ].forEach(function(property) {
    let method: (model: Model, channel: Channel, layout:any, def:any)=>any;

    var value = (method = exports[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(model, channel, layout, def) :
                  model.fieldDef(channel).axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  var props = model.fieldDef(channel).axis.properties || {};

  [
    'axis', 'grid', 'labels', 'title', // have special rules
    'ticks', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(group) {
    var value = properties[group] ?
      properties[group](model, channel, props[group], layout, def) :
      props[group];
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function format(model: Model, channel: Channel) {
  const fieldDef = model.fieldDef(channel);
  var format = fieldDef.axis.format;
  if (format !== undefined)  {
    return format;
  }

  if (fieldDef.type === QUANTITATIVE) {
    return model.numberFormat(channel);
  } else if (fieldDef.type === TEMPORAL) {
    const timeUnit = fieldDef.timeUnit;
    if (!timeUnit) {
      return model.config('timeFormat');
    } else if (timeUnit === 'year') {
      return 'd';
    }
  }
  return undefined;
}

export function grid(model: Model, channel: Channel) {
  var grid = model.fieldDef(channel).axis.grid;
  if (grid !== undefined) {
    return grid;
  }

  // If `grid` is unspecified, the default value is `true` for
  // - ROW and COL.
  // - X and Y that have (1) quantitative fields that are not binned or (2) time fields.
  // Otherwise, the default value is `false`.
  return channel === ROW || channel === COLUMN ||
    (model.isTypes(channel, [QUANTITATIVE, TEMPORAL]) && !model.fieldDef(channel).bin);
}

export function layer(model: Model, channel: Channel, layout, def) {
  var layer = model.fieldDef(channel).axis.layer;
  if (layer !== undefined) {
    return layer;
  }
  if (def.grid) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 'back';
  }
  return undefined; // otherwise return undefined and use Vega's default.
};

export function offset(model: Model, channel: Channel, layout) {
  var offset = model.fieldDef(channel).axis.offset;
  if (offset) {
    return offset;
  }

  if(channel === ROW) {
   return layout.y.axisTitleOffset + 20;
  }
  return undefined;
}

export function orient(model: Model, channel: Channel, layout) {
  var orient = model.fieldDef(channel).axis.orient;
  if (orient) {
    return orient;
  } else if (channel === COLUMN) {
    return 'top';
  }
  return undefined;
}

export function ticks(model: Model, channel: Channel) {
  var ticks = model.fieldDef(channel).axis.ticks;
  if (ticks !== undefined) {
    return ticks;
  }

  // FIXME depends on scale type too
  if (channel === X && !model.fieldDef(channel).bin) {
    return 5;
  }

  return undefined;
}

export function tickSize(model: Model, channel: Channel) {
  var tickSize = model.fieldDef(channel).axis.tickSize;
  if (tickSize !== undefined) {
    return tickSize;
  }
  if (channel === ROW || channel === COLUMN) {
    return 0;
  }
  return undefined;
}


export function title(model: Model, channel: Channel, layout) {
  var axisSpec = model.fieldDef(channel).axis;
  if (axisSpec.title !== undefined) {
    return axisSpec.title;
  }

  // if not defined, automatically determine axis title from field def
  var fieldTitle = model.fieldTitle(channel);

  var maxLength;
  if (axisSpec.titleMaxLength) {
  maxLength = axisSpec.titleMaxLength;
  } else if (channel === X) {
    maxLength = layout.cellWidth / model.config('characterWidth');
  } else if (channel === Y) {
    maxLength = layout.cellHeight / model.config('characterWidth');
  }

  return maxLength ? util.truncate(fieldTitle, maxLength) : fieldTitle;
}


export function titleOffset(model: Model, channel: Channel) {
  // return specified value if specified
  var value = model.fieldDef(channel).axis.titleOffset;
  if (value)  return value;

  switch (channel) {
    case ROW: return 0;
    case COLUMN: return 35;
  }
  return undefined;
}

namespace properties {
  export function axis(model: Model, channel: Channel, spec) {
    if (channel === ROW || channel === COLUMN) {
      // hide axis for facets
      return util.extend({
        opacity: {value: 0}
      }, spec || {});
    }
    return spec || undefined;
  }

  export function grid(model: Model, channel: Channel, spec, layout, def) {
    var cellPadding = model.config('cellPadding');

    if (def.grid) {
      if (channel === COLUMN) {
        // set grid property -- put the lines on the right the cell
        var yOffset = model.config('cellGridOffset');

        var sign = model.fieldDef(channel).axis.orient === 'bottom' ? -1 : 1;

        // TODO(#677): this should depend on orient
        return util.extend({
          x: {
            offset: roundFloat(layout.cellWidth + cellPadding / 2.0 - 1),
            // default value(s) -- vega doesn't do recursive merge
            scale: 'column',
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
          stroke: { value: model.config('cellGridColor') },
          strokeOpacity: { value: model.config('cellGridOpacity') }
        }, spec || {});
      } else if (channel === ROW) {
        var xOffset = model.config('cellGridOffset');

        var sign = model.fieldDef(channel).axis.orient === 'right' ? -1 : 1;

        // TODO(#677): this should depend on orient
        // set grid property -- put the lines on the top
        return util.extend({
          y: {
            offset: roundFloat(- cellPadding / 2.0 + 1),
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
          stroke: { value: model.config('cellGridColor') },
          strokeOpacity: { value: model.config('cellGridOpacity') }
        }, spec || {});
      } else {
        return util.extend({
          stroke: { value: model.config('gridColor') },
          strokeOpacity: { value: model.config('gridOpacity') }
        }, spec || {});
      }
    }
    return spec || undefined;
  }

  export function labels(model: Model, channel: Channel, spec, layout, def) {
    let fieldDef = model.fieldDef(channel);
    var timeUnit = fieldDef.timeUnit;
    if (fieldDef.type === TEMPORAL && timeUnit && (time.hasScale(timeUnit))) {
      spec = util.extend({
        text: {scale: 'time-' + timeUnit, field: 'data'}
      }, spec || {});
    }

    if (model.isTypes(channel, [NOMINAL, ORDINAL]) && fieldDef.axis.labelMaxLength) {
      // TODO replace this with Vega's labelMaxLength once it is introduced
      spec = util.extend({
        text: {
          template: '{{ datum.data | truncate:' + fieldDef.axis.labelMaxLength + '}}'
        }
      }, spec || {});
    }

     // for x-axis, set ticks for Q or rotate scale for ordinal scale
    if (channel === X) {
      if ((model.isDimension(X) || fieldDef.type === TEMPORAL)) {
        spec = util.extend({
          angle: {value: 270},
          align: {value: def.orient === 'top' ? 'left': 'right'},
          baseline: {value: 'middle'}
        }, spec || {});
      }
    }
    return spec || undefined;
  }

  export function title(model: Model, channel: Channel, spec) {
    if (channel === ROW) {
      return util.extend({
        angle: {value: 0},
        align: {value: 'right'},
        baseline: {value: 'middle'},
        dy: {
          field: {group: 'mark.group.height'},
          mult: -0.5,
          offset: -20
          // value: (-layout.height / 2) - 20
        }
      }, spec || {});
    }
    return spec || undefined;
  }
}
