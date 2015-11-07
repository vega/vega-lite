'use strict';

require('../globals');

var util = require('../util'),
  time = require('./time');

var axis = module.exports = {};

axis.def = function(name, encoding, layout, stats) {
  var isCol = name == COL,
    isRow = name == ROW,
    type = isCol ? 'x' : isRow ? 'y' : name;

  var def = {
    type: type,
    scale: name
  };

  // Add optional properties
  [
    // properties with special rules (so it has axis[property] methods) -- call rule functions
    'format', 'grid', 'offset', 'orient', 'tickSize', 'ticks', 'title', 'titleOffset',
    // Otherwise, only produce default values in the schema, or explicit value if specified
    'layer', 'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
    'values', 'subdivide'
  ].forEach(function(property) {
    var value = axis[property] ?
          axis[property](encoding, name, layout, stats) :
          encoding.encDef(name).axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // Add properties under axis.properties
  var properties = encoding.encDef(name).axis.properties || {};

  [
    'axis', 'grid', 'labels', 'title', // have special rules
    'ticks', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(property) {
    var value = axis.properties[property] ?
      axis.properties[property](encoding, name, properties[property], layout, def) :
      properties[property];
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[property] = value;
    }
  });

  return def;
};

axis.format = function(encoding, name) {
  var format = encoding.encDef(name).axis.format;
  if (format !== undefined)  {
    return format;
  }

  if (encoding.isType(name, Q)) {
    return encoding.numberFormat(name);
  } else if (encoding.isType(name, T)) {
    var timeUnit = encoding.encDef(name).timeUnit;
    if (!timeUnit) {
      return encoding.config('timeFormat');
    } else if (timeUnit === 'year') {
      return 'd';
    }
  }
  return undefined;
};

axis.grid = function(encoding, name) {
  var grid = encoding.axis(name).grid;
  if (grid !== undefined) {
    return grid;
  }

  // If `grid` is unspecified, the default value is `true` for
  // - ROW and COL.
  // - X and Y that have (1) quantitative fields that are not binned or (2) time fields.
  // Otherwise, the default value is `false`.
  return name === ROW || name === COL ||
    (encoding.isTypes(name, [Q, T]) && !encoding.encDef(name).bin);
};

axis.offset = function(encoding, name, layout) {
  var offset = encoding.encDef(name).axis.offset;
  if (offset) {
    return offset;
  }

  if(name === ROW) {
   return layout.y.axisTitleOffset + 20;
  }
  return undefined;
};

axis.orient = function(encoding, name, layout, stats) {
  var orient = encoding.encDef(name).axis.orient;
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
};

axis.ticks = function(encoding, name) {
  var ticks = encoding.encDef(name).axis.ticks;
  if (ticks !== undefined) {
    return ticks;
  }

  // FIXME depends on scale type too
  if (name === X && !encoding.encDef(name).bin) {
    return 5;
  }

  return undefined;
};

axis.tickSize = function(encoding, name) {
  var tickSize = encoding.encDef(name).axis.tickSize;
  if (tickSize !== undefined) {
    return tickSize;
  }
  if (name === ROW || name === COL) {
    return 0;
  }
  return undefined;
};


axis.title = function (encoding, name, layout) {
  var axisSpec = encoding.encDef(name).axis;
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
};


axis.titleOffset = function (encoding, name) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    case ROW: return 0;
    case COL: return 35;
  }
  return undefined;
};

// PROPERTIES

axis.properties = {};

axis.properties.axis = function(encoding, name, spec) {
  if (name === ROW || name === COL) {
    // hide axis for facets
    return util.extend({
      opacity: {value: 0}
    }, spec || {});
  }
  return spec || undefined;
};

axis.properties.grid = function(encoding, name, spec, layout, def) {
  var cellPadding = layout.cellPadding;

  if (def.grid) {
    if (name == COL) {
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
    } else if (name == ROW) {
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
};

axis.properties.labels = function(encoding, name, spec, layout, def) {
  var timeUnit = encoding.encDef(name).timeUnit;
  if (encoding.isType(name, T) && timeUnit && (time.hasScale(timeUnit))) {
    spec = util.extend({
      text: {scale: 'time-' + timeUnit}
    }, spec || {});
  }

  if (encoding.isTypes(name, [N, O]) && encoding.axis(name).labelMaxLength) {
    // TODO replace this with Vega's labelMaxLength once it is introduced
    spec = util.extend({
      text: {
        template: '{{ datum.data | truncate:' + encoding.axis(name).labelMaxLength + '}}'
      }
    }, spec || {});
  }

   // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if ((encoding.isDimension(X) || encoding.isType(X, T))) {
      spec = util.extend({
        angle: {value: 270},
        align: {value: def.orient === 'top' ? 'left': 'right'},
        baseline: {value: 'middle'}
      }, spec || {});
    }
  }
  return spec || undefined;
};

axis.properties.title = function(encoding, name, spec, layout) {
  if (name === ROW) {
    return util.extend({
      angle: {value: 0},
      align: {value: 'right'},
      baseline: {value: 'middle'},
      dy: {value: (-layout.height / 2) - 20}
    }, spec || {});
  }
  return spec || undefined;
};

