'use strict';

require('../globals');

var util = require('../util'),
  setter = util.setter,
  getter = util.getter,
  time = require('./time');

var axis = module.exports = {};

axis.def = function(name, encoding, layout, stats, opt) {
  var isCol = name == COL,
    isRow = name == ROW,
    type = isCol ? 'x' : isRow ? 'y' : name;

  // TODO: rename def to axisDef and avoid side effects where possible.

  var def = {
    type: type,
    scale: name,
    properties: {},
    layer: encoding.encDef(name).axis.layer
  };

  var orient = axis.orient(encoding, name, stats);
  if (orient) {
    def.orient = orient;
  }

  // Add axis label custom scale (for bin / time)
  def = axis.labels.scale(def, encoding, name);
  def = axis.labels.format(def, encoding, name, stats);
  def = axis.labels.angle(def, encoding, name);

  // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if ((encoding.isDimension(X) || encoding.isType(X, T)) &&
        !('angle' in getter(def, ['properties', 'labels']))) {
      // TODO(kanitw): Jul 19, 2015 - #506 add condition for rotation
      def = axis.labels.rotate(def);
    } else { // Q
      def.ticks = encoding.encDef(name).axis.ticks;
    }
  }

  // TitleOffset depends on labels rotation
  def.titleOffset = axis.titleOffset(encoding, layout, name);

  //def.offset is used in axis.grid
  if(isRow) def.offset = axis.titleOffset(encoding, layout, Y) + 20;
  // FIXME(kanitw): Jul 19, 2015 - offset for column when x is put on top

  def = axis.grid(def, encoding, name, layout);
  def = axis.title(def, encoding, name, layout, opt);

  if (isRow || isCol) {
    def = axis.hideTicks(def);
  }

  return def;
};

axis.orient = function(encoding, name, stats) {
  var orient = encoding.encDef(name).axis.orient;
  if (orient) {
    return orient;
  } else if (name === COL) {
    return 'top';
  } else if (name === X && encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
    // x-axis for long y - put on top
    return 'top';
  }
  return undefined;
};

axis.grid = function(def, encoding, name, layout) {
  var cellPadding = layout.cellPadding,
    isCol = name == COL,
    isRow = name == ROW;

  var _grid = encoding.axis(name).grid;

  // If `grid` is unspecified, the default value is `true` for ROW and COL.
  // For X and Y, the default value is `true` for (1) quantitative fields that are not binned and (2) time fields.
  // Otherwise, the default value is `false`.
  var grid = _grid === undefined ?
    ( name === ROW || name === COL ||
      (encoding.isTypes(name, [Q, T]) && !encoding.encDef(name).bin)
    ) : _grid;

  if (grid) {
    def.grid = true;

    if (isCol) {
      // set grid property -- put the lines on the right the cell
      var yOffset = encoding.config('cellGridOffset');

      // TODO(#677): this should depend on orient
      def.properties.grid = {
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
      };
    } else if (isRow) {
      var xOffset = encoding.config('cellGridOffset');

      // TODO(#677): this should depend on orient
      // set grid property -- put the lines on the top
      def.properties.grid = {
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
      };
    } else {
      def.properties.grid = {
        stroke: { value: encoding.config('gridColor') },
        strokeOpacity: { value: encoding.config('gridOpacity') }
      };
    }
  }
  return def;
};

axis.hideTicks = function(def) {
  def.properties.ticks = {opacity: {value: 0}};
  def.properties.majorTicks = {opacity: {value: 0}};
  def.properties.axis = {opacity: {value: 0}};
  return def;
};

axis.title = function (def, encoding, name, layout) {
  var ax = encoding.encDef(name).axis;

  if (ax.title) {
    def.title = ax.title;
  } else {
    // if not defined, automatically determine axis title from field def
    var fieldTitle = encoding.fieldTitle(name),
      maxLength;

    if (ax.titleMaxLength) {
      maxLength = ax.titleMaxLength;
    } else if (name===X) {
      maxLength = layout.cellWidth / encoding.config('characterWidth');
    } else if (name === Y) {
      maxLength = layout.cellHeight / encoding.config('characterWidth');
    }

    def.title = maxLength ? util.truncate(fieldTitle, maxLength) : fieldTitle;
  }

  if (name === ROW) {
    def.properties.title = {
      angle: {value: 0},
      align: {value: 'right'},
      baseline: {value: 'middle'},
      dy: {value: (-layout.height/2) -20}
    };
  }

  return def;
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
axis.labels.format = function (def, encoding, name, stats) {
  var fieldStats = stats[encoding.encDef(name).name];

  if (encoding.axis(name).format) {
    def.format = encoding.axis(name).format;
  } else if (encoding.isType(name, Q) || fieldStats.type === 'number') {
    def.format = encoding.numberFormat(fieldStats);
  } else if (encoding.isType(name, T)) {
    var timeUnit = encoding.encDef(name).timeUnit;
    if (!timeUnit) {
      def.format = encoding.config('timeFormat');
    } else if (timeUnit === 'year') {
      def.format = 'd';
    }
  } else if (encoding.isTypes(name, [N, O]) && encoding.axis(name).maxLabelLength) {
    setter(def,
      ['properties','labels','text','template'],
      '{{ datum.data | truncate:' +
      encoding.axis(name).maxLabelLength + '}}'
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

axis.titleOffset = function (encoding, layout, name) {
  // return specified value if specified
  var value = encoding.axis(name).titleOffset;
  if (value)  return value;

  switch (name) {
    //FIXME make this adjustable
    case ROW: return 0;
    case COL: return 35;
  }
  return getter(layout, [name, 'axisTitleOffset']);
};
