'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  getter = util.getter,
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
    // has special rules (so it has axis[property] methods)
    'format', 'grid', 'orient', 'tickSize', 'ticks', 'title', 'titleOffset',
    // only produce default values in the schema, or explicit value if specified
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

  // FIXME move offset to above
  if(isRow) def.offset = axis.titleOffset(encoding, Y, layout) + 20;


  // axis.properties from the spec
  var properties = encoding.encDef(name).axis.properties || {};
  var opt = {
    grid: def.grid,
    offset: def.offset || 0
  };

  ['axis', 'title'].forEach(function(property) {
    var value = axis.properties[property](encoding, name, properties[property], layout, opt);
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[property] = value;
    }
  });

  // Add axis label custom scale (for bin / time)
  def = axis.labels.scale(def, encoding, name);
  def = axis.labels.format(def, encoding, name);
  def = axis.labels.angle(def, encoding, name);

  // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if ((encoding.isDimension(X) || encoding.isType(X, T)) &&
        !('angle' in getter(def, ['properties', 'labels']))) {
      // TODO(kanitw): Jul 19, 2015 - #506 add condition for rotation
      def = axis.labels.rotate(def);
    }
  }

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

axis.orient = function(encoding, name, layout, stats) {
  var orient = encoding.encDef(name).axis.orient;
  if (orient) {
    return orient;
  } else if (name === COL) {
    return 'top';
  } else if (name === X && encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
    // FIXME remove this case
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


axis.titleOffset = function (encoding, name, layout) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    case ROW: return 0;
    case COL: return 35;
  }
  return getter(layout, [name, 'axisTitleOffset']);
};

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


axis.properties.grid = function(encoding, name, spec, layout, opt) {
  var cellPadding = layout.cellPadding;

  if (opt.grid) {
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
          value: opt.offset - xOffset
        },
        x2: {
          field: {group: 'mark.group.width'},
          offset: opt.offset + xOffset,
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

axis.properties.labels = function(encoding, name, spec) {

};

axis.labels = {};

/** add custom label for time type and bin */
axis.labels.scale = function(def, encoding, name) {
  // time
  var timeUnit = encoding.encDef(name).timeUnit;
  if (encoding.isType(name, T) && timeUnit && (time.hasScale(timeUnit))) {
    setter(def, ['properties','labels','text','scale'], 'time-'+ timeUnit);
  }
  // FIXME bin
  return def;
};


/**
 * Determine number format or truncate if maxLabel length is presented.
 */
axis.labels.format = function (def, encoding, name) {
  if (encoding.isTypes(name, [N, O]) && encoding.axis(name).labelMaxLength) {
    setter(def,
      ['properties','labels','text','template'],
      '{{ datum.data | truncate:' +
      encoding.axis(name).labelMaxLength + '}}'
    );
  }

  return def;
};

axis.labels.angle = function(def, encoding, name) {
  var angle = encoding.axis(name).labelAngle;
  if (typeof angle === 'undefined') return def;

  setter(def, ['properties', 'labels', 'angle', 'value'], angle);
  return def;
};

axis.labels.rotate = function(def) {
 var align = def.orient ==='top' ? 'left' : 'right';
 setter(def, ['properties','labels', 'angle', 'value'], 270);
 setter(def, ['properties','labels', 'align', 'value'], align);
 setter(def, ['properties','labels', 'baseline', 'value'], 'middle');
 return def;
};

