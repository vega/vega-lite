import {getter, setter} from '../util';
import * as util from '../util';
import * as time from './time';
import {X, Y, COL, ROW} from '../consts';
import {Q, O, N, T} from '../consts';

export function def(name, encoding, layout, stats, opt?) {
  var isCol = name == COL,
    isRow = name == ROW,
    type = isCol ? 'x' : isRow ? 'y' : name;

  // TODO: rename def to axisDef and avoid side effects where possible.

  var def:any = {
    type: type,
    scale: name,
    properties: {},
    layer: encoding.encDef(name).axis.layer
  };

  var orient = orient(encoding, name, stats);
  if (orient) {
    def.orient = orient;
  }

  // Add axis label custom scale (for bin / time)
  def = labels.scale(def, encoding, name);
  def = labels.format(def, encoding, name);
  def = labels.angle(def, encoding, name);

  // for x-axis, set ticks for Q or rotate scale for ordinal scale
  if (name == X) {
    if ((encoding.isDimension(X) || encoding.isType(X, T)) &&
        !('angle' in getter(def, ['properties', 'labels']))) {
      // TODO(kanitw): Jul 19, 2015 - #506 add condition for rotation
      def = labels.rotate(def);
    } else { // Q
      def.ticks = encoding.encDef(name).axis.ticks;
    }
  }

  // TitleOffset depends on labels rotation
  def.titleOffset = titleOffset(encoding, layout, name);

  //def.offset is used in axis.grid
  if(isRow) def.offset = titleOffset(encoding, layout, Y) + 20;
  // FIXME(kanitw): Jul 19, 2015 - offset for column when x is put on top

  def = grid(def, encoding, name, layout);
  def = title(def, encoding, name, layout);

  if (isRow || isCol) {
    def = hideTicks(def);
  }

  return def;
};

export function orient(encoding, name, stats) {
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

export function grid(def, encoding, name, layout) {
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

export function hideTicks(def) {
  def.properties.ticks = {opacity: {value: 0}};
  def.properties.majorTicks = {opacity: {value: 0}};
  def.properties.axis = {opacity: {value: 0}};
  return def;
};

export function title(def, encoding, name, layout) {
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

export var labels = {
  /**
   * add custom label for time type and bin
   */
  scale: function(def, encoding, name) {
    // time
    var timeUnit = encoding.encDef(name).timeUnit;
    if (encoding.isType(name, T) && timeUnit && (time.hasScale(timeUnit))) {
      setter(def, ['properties','labels','text','scale'], 'time-'+ timeUnit);
    }
    // FIXME bin
    return def;
  },

  /**
   * Determine number format or truncate if maxLabel length is presented.
   */
  format: function (def, encoding, name) {
    if (encoding.axis(name).format) {
      def.format = encoding.axis(name).format;
    } else if (encoding.isType(name, Q)) {
      def.format = encoding.numberFormat(name);
    } else if (encoding.isType(name, T)) {
      var timeUnit = encoding.encDef(name).timeUnit;
      if (!timeUnit) {
        def.format = encoding.config('timeFormat');
      } else if (timeUnit === 'year') {
        def.format = 'd';
      }
    } else if (encoding.isTypes(name, [N, O]) && encoding.axis(name).labelMaxLength) {
      setter(def,
        ['properties','labels','text','template'],
        '{{ datum.data | truncate:' +
        encoding.axis(name).labelMaxLength + '}}'
      );
    }

    return def;
  },

  angle: function(def, encoding, name) {
    var angle = encoding.axis(name).labelAngle;
    if (typeof angle === 'undefined') return def;

    setter(def, ['properties', 'labels', 'angle', 'value'], angle);
    return def;
  },

  rotate: function(def) {
   var align = def.orient ==='top' ? 'left' : 'right';
   setter(def, ['properties','labels', 'angle', 'value'], 270);
   setter(def, ['properties','labels', 'align', 'value'], align);
   setter(def, ['properties','labels', 'baseline', 'value'], 'middle');
   return def;
  }
};

export function titleOffset(encoding, layout, name) {
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
