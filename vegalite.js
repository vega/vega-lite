!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vl=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var globals = require('./globals'),
    util = require('./util'),
    consts = require('./consts');

var vl = util.merge(consts, util);

vl.Encoding = require('./Encoding');
vl.compile = require('./compile/compile');
vl.data = require('./data');
vl.field = require('./field');
vl.enc = require('./enc');
vl.schema = require('./schema/schema');


module.exports = vl;

},{"./Encoding":2,"./compile/compile":6,"./consts":20,"./data":21,"./enc":22,"./field":23,"./globals":24,"./schema/schema":25,"./util":27}],2:[function(require,module,exports){
'use strict';

var globals = require('./globals'),
  consts = require('./consts'),
  util = require('./util'),
  vlfield = require('./field'),
  vlenc = require('./enc'),
  schema = require('./schema/schema'),
  time = require('./compile/time');

var Encoding = module.exports = (function() {

  function Encoding(marktype, enc, config, filter, theme) {
    var defaults = schema.instantiate();

    var spec = {
      marktype: marktype,
      enc: enc,
      cfg: config,
      filter: filter || []
    };

    // type to bitcode
    for (var e in defaults.enc) {
      defaults.enc[e].type = consts.dataTypes[defaults.enc[e].type];
    }

    var specExtended = schema.util.merge(defaults, theme || {}, spec) ;

    this._marktype = specExtended.marktype;
    this._enc = specExtended.enc;
    this._cfg = specExtended.cfg;
    this._filter = specExtended.filter;
  }

  var proto = Encoding.prototype;

  proto.marktype = function() {
    return this._marktype;
  };

  proto.is = function(m) {
    return this._marktype === m;
  };

  proto.has = function(encType) {
    // equivalent to calling vlenc.has(this._enc, encType)
    return this._enc[encType].name !== undefined;
  };

  proto.enc = function(x) {
    return this._enc[x];
  };

  proto.filter = function() {
    var filterNull = [],
      fields = this.fields(),
      self = this;

    util.forEach(fields, function(fieldList, fieldName) {
      if (fieldName === '*') return; //count

      if ((self.config('filterNull').Q && fieldList.containsType[Q]) ||
          (self.config('filterNull').T && fieldList.containsType[T]) ||
          (self.config('filterNull').O && fieldList.containsType[O])) {
        filterNull.push({
          operands: [fieldName],
          operator: 'notNull'
        });
      }
    });

    return filterNull.concat(this._filter);
  };

  // get "field" property for vega
  proto.field = function(x, nodata, nofn) {
    if (!this.has(x)) return null;

    var f = (nodata ? '' : 'data.');

    if (this._enc[x].aggr === 'count') {
      return f + 'count';
    } else if (!nofn && this._enc[x].bin) {
      return f + 'bin_' + this._enc[x].name;
    } else if (!nofn && this._enc[x].aggr) {
      return f + this._enc[x].aggr + '_' + this._enc[x].name;
    } else if (!nofn && this._enc[x].fn) {
      return f + this._enc[x].fn + '_' + this._enc[x].name;
    } else {
      return f + this._enc[x].name;
    }
  };

  proto.fieldName = function(x) {
    return this._enc[x].name;
  };

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  proto.fields = function() {
    return vlenc.fields(this._enc);
  };

  proto.fieldTitle = function(x) {
    if (vlfield.isCount(this._enc[x])) {
      return vlfield.count.displayName;
    }
    var fn = this._enc[x].aggr || this._enc[x].fn || (this._enc[x].bin && "bin");
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[x].name + ')';
    } else {
      return this._enc[x].name;
    }
  };

  proto.scale = function(x) {
    return this._enc[x].scale || {};
  };

  proto.axis = function(x) {
    return this._enc[x].axis || {};
  };

  proto.band = function(x) {
    return this._enc[x].band || {};
  };

  proto.bandSize = function(encType, useSmallBand) {
    useSmallBand = useSmallBand ||
      //isBandInSmallMultiples
      (encType === Y && this.has(ROW) && this.has(Y)) ||
      (encType === X && this.has(COL) && this.has(X));

    // if band.size is explicitly specified, follow the specification, otherwise draw value from config.
    return this.band(encType).size ||
      this.config(useSmallBand ? 'smallBandSize' : 'largeBandSize');
  };

  proto.aggr = function(x) {
    return this._enc[x].aggr;
  };

  // returns false if binning is disabled, otherwise an object with binning properties
  proto.bin = function(x) {
    var bin = this._enc[x].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: schema.MAXBINS_DEFAULT
      };
    return bin;
  };

  proto.legend = function(x) {
    return this._enc[x].legend;
  };

  proto.value = function(x) {
    return this._enc[x].value;
  };

  proto.fn = function(x) {
    return this._enc[x].fn;
  };

  proto.sort = function(et, stats) {
    var sort = this._enc[et].sort,
      enc = this._enc,
      isType = vlfield.isType.byCode;

    // console.log('sort:', sort, 'support:', Encoding.toggleSort.support({enc:this._enc}, stats) , 'toggle:', this.config('toggleSort'))

    if ((!sort || sort.length===0) &&
        Encoding.toggleSort.support({enc:this._enc}, stats, true) && //HACK
        this.config('toggleSort') === 'Q'
      ) {
      var qField = isType(enc.x, O) ? enc.y : enc.x;

      if (isType(enc[et], O)) {
        sort = [{
          name: qField.name,
          aggr: qField.aggr,
          type: qField.type,
          reverse: true
        }];
      }

    }

    return sort;
  };

  proto.any = function(f) {
    return util.any(this._enc, f);
  };

  proto.all = function(f) {
    return util.all(this._enc, f);
  };

  proto.length = function() {
    return util.keys(this._enc).length;
  };

  proto.map = function(f) {
    return vlenc.map(this._enc, f);
  };

  proto.reduce = function(f, init) {
    return vlenc.reduce(this._enc, f, init);
  };

  proto.forEach = function(f) {
    return vlenc.forEach(this._enc, f);
  };

  proto.type = function(et) {
    return this.has(et) ? this._enc[et].type : null;
  };

  proto.role = function(et) {
    return this.has(et) ? vlfield.role(this._enc[et]) : null;
  };

  proto.text = function(prop) {
    var text = this._enc[TEXT].text;
    return prop ? text[prop] : text;
  };

  proto.font = function(prop) {
    var font = this._enc[TEXT].font;
    return prop ? font[prop] : font;
  };

  proto.isType = function(x, type) {
    var field = this.enc(x);
    return field && Encoding.isType(field, type);
  };

  Encoding.isType = function (fieldDef, type) {
    // FIXME vlfield.isType
    return (fieldDef.type & type) > 0;
  };

  Encoding.isOrdinalScale = function(encoding, encType) {
    return vlfield.isOrdinalScale(encoding.enc(encType), true);
  };

  Encoding.isDimension = function(encoding, encType) {
    return vlfield.isDimension(encoding.enc(encType), true);
  };

  Encoding.isMeasure = function(encoding, encType) {
    return vlfield.isMeasure(encoding.enc(encType), true);
  };

  proto.isOrdinalScale = function(encType) {
    return this.has(encType) && Encoding.isOrdinalScale(this, encType);
  };

  proto.isDimension = function(encType) {
    return this.has(encType) && Encoding.isDimension(this, encType);
  };

  proto.isMeasure = function(encType) {
    return this.has(encType) && Encoding.isMeasure(this, encType);
  };

  proto.isAggregate = function() {
    return vlenc.isAggregate(this._enc);
  };

  Encoding.isAggregate = function(spec) {
    return vlenc.isAggregate(spec.enc);
  };

  Encoding.alwaysNoOcclusion = function(spec, stats) {
    // FIXME raw OxQ with # of rows = # of O
    return vlenc.isAggregate(spec.enc);
  };

  Encoding.isStack = function(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      spec.enc.color;
  };

  proto.isStack = function() {
    // FIXME update this once we have control for stack ...
    return (this.is('bar') || this.is('area')) && this.has('color');
  };

  proto.cardinality = function(encType, stats) {
    return vlfield.cardinality(this.enc(encType), stats, this.config('filterNull'), true);
  };

  proto.isRaw = function() {
    return !this.isAggregate();
  };

  proto.config = function(name) {
    return this._cfg[name];
  };

  proto.toSpec = function(excludeConfig) {
    var enc = util.duplicate(this._enc),
      spec;

    // convert type's bitcode to type name
    for (var e in enc) {
      enc[e].type = consts.dataTypeNames[enc[e].type];
    }

    spec = {
      marktype: this._marktype,
      enc: enc,
      filter: this._filter
    };

    if (!excludeConfig) {
      spec.cfg = util.duplicate(this._cfg);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schema.util.subtract(spec, defaults);
  };

  proto.toShorthand = function() {
    var c = consts.shorthand;
    return 'mark' + c.assign + this._marktype +
      c.delim + vlenc.shorthand(this._enc);
  };

  Encoding.shorthand = function (spec) {
    var c = consts.shorthand;
    return 'mark' + c.assign + spec.marktype +
      c.delim + vlenc.shorthand(spec.enc);
  };

  Encoding.parseShorthand = function(shorthand, cfg) {
    var c = consts.shorthand,
        split = shorthand.split(c.delim),
        marktype = split.shift().split(c.assign)[1].trim(),
        enc = vlenc.parseShorthand(split, true);

    return new Encoding(marktype, enc, cfg);
  };

  // FIXME remove this -- simply use Encoding.shorthand
  Encoding.shorthandFromSpec = function(/*spec, theme*/) {
    return Encoding.fromSpec.apply(null, arguments).toShorthand();
  };

  Encoding.specFromShorthand = function(shorthand, cfg, excludeConfig) {
    return Encoding.parseShorthand(shorthand, cfg).toSpec(excludeConfig);
  };

  Encoding.fromSpec = function(spec, theme) {
    var enc = util.duplicate(spec.enc || {});

    //convert type from string to bitcode (e.g, O=1)
    for (var e in enc) {
      enc[e].type = consts.dataTypes[enc[e].type];
    }

    return new Encoding(spec.marktype, enc, spec.cfg, spec.filter, theme);
  };

  Encoding.transpose = function(spec) {
    var oldenc = spec.enc,
      enc = util.duplicate(spec.enc);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.enc = enc;
    return spec;
  };

  Encoding.toggleSort = function(spec) {
    spec.cfg = spec.cfg || {};
    spec.cfg.toggleSort = spec.cfg.toggleSort === 'Q' ? 'O' :'Q';
    return spec;
  };


  Encoding.toggleSort.direction = function(spec, useTypeCode) {
    if (!Encoding.toggleSort.support(spec, useTypeCode)) { return; }
    var enc = spec.enc;
    return enc.x.type === 'O' ? 'x' :  'y';
  };

  Encoding.toggleSort.mode = function(spec) {
    return spec.cfg.toggleSort;
  };

  Encoding.toggleSort.support = function(spec, stats, useTypeCode) {
    var enc = spec.enc,
      isType = vlfield.isType.get(useTypeCode);

    if (vlenc.has(enc, ROW) || vlenc.has(enc, COL) ||
      !vlenc.has(enc, X) || !vlenc.has(enc, Y) ||
      !Encoding.alwaysNoOcclusion(spec, stats)) {
      return false;
    }

    return ( isType(enc.x, O) && vlfield.isMeasure(enc.y, useTypeCode)) ? 'x' :
      ( isType(enc.y, O) && vlfield.isMeasure(enc.x, useTypeCode)) ? 'y' : false;
  };

  Encoding.toggleFilterNullO = function(spec) {
    spec.cfg = spec.cfg || {};
    spec.cfg.filterNull = spec.cfg.filterNull || { //FIXME
      T: true,
      Q: true
    };
    spec.cfg.filterNull.O = !spec.cfg.filterNull.O;
    return spec;
  };

  Encoding.toggleFilterNullO.support = function(spec, stats) {
    var fields = vlenc.fields(spec.enc);
    for (var fieldName in fields) {
      var fieldList = fields[fieldName];
      if (fieldList.containsType.O && fieldName in stats && stats[fieldName].numNulls > 0) {
        return true;
      }
    }
    return false;
  };

  return Encoding;
})();

},{"./compile/time":19,"./consts":20,"./enc":22,"./field":23,"./globals":24,"./schema/schema":25,"./util":27}],3:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = aggregates;

function aggregates(spec, encoding, opt) {
  opt = opt || {};

  var dims = {}, meas = {}, detail = {}, facets = {},
    data = spec.data[1]; // currently data[0] is raw and data[1] is table

  encoding.forEach(function(field, encType) {
    if (field.aggr) {
      if (field.aggr === 'count') {
        meas.count = {op: 'count', field: '*'};
      }else {
        meas[field.aggr + '|'+ field.name] = {
          op: field.aggr,
          field: 'data.'+ field.name
        };
      }
    } else {
      dims[field.name] = encoding.field(encType);
      if (encType == ROW || encType == COL) {
        facets[field.name] = dims[field.name];
      }else if (encType !== X && encType !== Y) {
        detail[field.name] = dims[field.name];
      }
    }
  });
  dims = util.vals(dims);
  meas = util.vals(meas);

  if (meas.length > 0 && !opt.preaggregatedData) {
    if (!data.transform) data.transform = [];
    data.transform.push({
      type: 'aggregate',
      groupby: dims,
      fields: meas
    });
  }
  return {
    details: util.vals(detail),
    dims: dims,
    facets: util.vals(facets),
    aggregated: meas.length > 0
  };
}

},{"../globals":24,"../util":27}],4:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  setter = util.setter,
  getter = util.getter,
  time = require('./time');

var axis = module.exports = {};

axis.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    var s = props[x].scale;
    if (s === X || s === Y) a[props[x].scale] = 1;
    return a;
  }, {}));
};

axis.defs = function(names, encoding, layout, stats, opt) {
  return names.reduce(function(a, name) {
    a.push(axis.def(name, encoding, layout, stats, opt));
    return a;
  }, []);
};

axis.def = function(name, encoding, layout, stats, opt) {
  var type = name;
  var isCol = name == COL, isRow = name == ROW;
  var rowOffset = axisTitleOffset(encoding, layout, Y) + 20,
    cellPadding = layout.cellPadding;


  if (isCol) type = 'x';
  if (isRow) type = 'y';

  var def = {
    type: type,
    scale: name
  };

  if (encoding.axis(name).grid) {
    def.grid = true;
    def.layer = (isRow || isCol) ? 'front' :  'back';

    if (isCol) {
      // set grid property -- put the lines on the right the cell
      setter(def, ['properties', 'grid'], {
        x: {
          offset: layout.cellWidth * (1+ cellPadding/2.0),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'col'
        },
        y: {
          value: -layout.cellHeight * (cellPadding/2),
        },
        stroke: { value: encoding.config('cellGridColor') }
      });
    } else if (isRow) {
      // set grid property -- put the lines on the top
      setter(def, ['properties', 'grid'], {
        y: {
          offset: -layout.cellHeight * (cellPadding/2),
          // default value(s) -- vega doesn't do recursive merge
          scale: 'row'
        },
        x: {
          value: rowOffset
        },
        x2: {
          offset: rowOffset + (layout.cellWidth * 0.05),
          // default value(s) -- vega doesn't do recursive merge
          group: "mark.group.width",
          mult: 1
        },
        stroke: { value: encoding.config('cellGridColor') }
      });
    } else {
      setter(def, ['properties', 'grid', 'stroke'], {
        value: encoding.config('gridColor')
      });
    }
  }

  if (encoding.axis(name).title) {
    def = axis_title(def, name, encoding, layout, opt);
  }

  if (isRow || isCol) {
    setter(def, ['properties', 'ticks'], {
      opacity: {value: 0}
    });
    setter(def, ['properties', 'majorTicks'], {
      opacity: {value: 0}
    });
    setter(def, ['properties', 'axis'], {
      opacity: {value: 0}
    });
  }

  if (isCol) {
    def.orient = 'top';
  }

  if (isRow) {
    def.offset = rowOffset;
  }

  if (name == X) {
    if (encoding.has(Y) && encoding.isOrdinalScale(Y) && encoding.cardinality(Y, stats) > 30) {
      def.orient = 'top';
    }

    if (encoding.isDimension(X) || encoding.isType(X, T)) {
      setter(def, ['properties','labels'], {
        angle: {value: 270},
        align: {value: 'right'},
        baseline: {value: 'middle'}
      });
    } else { // Q
      def.ticks = 5;
    }
  }

  def = axis_labels(def, name, encoding, layout, opt);

  return def;
};

function axis_title(def, name, encoding, layout, opt) {
  var maxlength = null,
    fieldTitle = encoding.fieldTitle(name);
  if (name===X) {
    maxlength = layout.cellWidth / encoding.config('characterWidth');
  } else if (name === Y) {
    maxlength = layout.cellHeight / encoding.config('characterWidth');
  }

  def.title = maxlength ? util.truncate(fieldTitle, maxlength) : fieldTitle;

  if (name === ROW) {
    setter(def, ['properties','title'], {
      angle: {value: 0},
      align: {value: 'right'},
      baseline: {value: 'middle'},
      dy: {value: (-layout.height/2) -20}
    });
  }

  def.titleOffset = axisTitleOffset(encoding, layout, name);
  return def;
}

function axis_labels(def, name, encoding, layout, opt) {
  var fn;
  // add custom label for time type
  if (encoding.isType(name, T) && (fn = encoding.fn(name)) && (time.hasScale(fn))) {
    setter(def, ['properties','labels','text','scale'], 'time-'+ fn);
  }

  var textTemplatePath = ['properties','labels','text','template'];
  if (encoding.axis(name).format) {
    def.format = encoding.axis(name).format;
  } else if (encoding.isType(name, Q)) {
    setter(def, textTemplatePath, "{{data | number:'.3s'}}");
  } else if (encoding.isType(name, T) && !encoding.fn(name)) {
    setter(def, textTemplatePath, "{{data | time:'%Y-%m-%d'}}");
  } else if (encoding.isType(name, T) && encoding.fn(name) === 'year') {
    setter(def, textTemplatePath, "{{data | number:'d'}}");
  } else if (encoding.isType(name, O) && encoding.axis(name).maxLabelLength) {
    setter(def, textTemplatePath, '{{data | truncate:' + encoding.axis(name).maxLabelLength + '}}');
  }

  return def;
}

function axisTitleOffset(encoding, layout, name) {
  var value = encoding.axis(name).titleOffset;
  if (value) {
    return value;
  }
  switch (name) {
    case ROW: return 0;
    case COL: return 35;
  }
  return getter(layout, [name, 'axisTitleOffset']);
}

},{"../globals":24,"../util":27,"./time":19}],5:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = binning;

function binning(spec, encoding, opt) {
  opt = opt || {};
  var bins = {};

  if (opt.preaggregatedData) {
    return;
  }

  if (!spec.transform) spec.transform = [];

  encoding.forEach(function(field, encType) {
    if (encoding.bin(encType)) {
      spec.transform.push({
        type: 'bin',
        field: 'data.' + field.name,
        output: 'data.bin_' + field.name,
        maxbins: encoding.bin(encType).maxbins
      });
    }
  });
}

},{"../globals":24,"../util":27}],6:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = compile;

var template = compile.template = require('./template'),
  axis = compile.axis = require('./axis'),
  filter = compile.filter = require('./filter'),
  legend = compile.legend = require('./legend'),
  marks = compile.marks = require('./marks'),
  scale = compile.scale = require('./scale'),
  vlsort = compile.sort = require('./sort'),
  vlstyle = compile.style = require('./style'),
  time = compile.time = require('./time'),
  aggregates = compile.aggregates = require('./aggregates'),
  binning = compile.binning = require('./binning'),
  faceting = compile.faceting = require('./faceting'),
  stacking = compile.stacking = require('./stacking'),
  subfaceting = compile.subfaceting = require('./subfaceting');

compile.layout = require('./layout');
compile.group = require('./group');

function compile(encoding, stats) {
  var layout = compile.layout(encoding, stats),
    style = vlstyle(encoding, stats),
    spec = template(encoding, layout, stats),
    group = spec.marks[0],
    mark = marks[encoding.marktype()],
    mdefs = marks.def(mark, encoding, layout, style),
    mdef = mdefs[0];  // TODO: remove this dirty hack by refactoring the whole flow

  filter.addFilters(spec, encoding);
  var sorting = vlsort(spec, encoding, stats);

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  var preaggregatedData = encoding.config('useVegaServer');

  for (var i = 0; i < mdefs.length; i++) {
    group.marks.push(mdefs[i]);
  }

  binning(spec.data[1], encoding, {preaggregatedData: preaggregatedData});

  var lineType = marks[encoding.marktype()].line;

  if (!preaggregatedData) {
    spec = time(spec, encoding);
  }

  // handle subfacets
  var aggResult = aggregates(spec, encoding, {preaggregatedData: preaggregatedData}),
    details = aggResult.details,
    hasDetails = details && details.length > 0,
    stack = hasDetails && stacking(spec, encoding, mdef, aggResult.facets);

  if (hasDetails && (stack || lineType)) {
    //subfacet to group stack / line together in one group
    subfaceting(group, mdef, details, stack, encoding);
  }

  // auto-sort line/area values
  //TODO(kanitw): have some config to turn off auto-sort for line (for line chart that encodes temporal information)
  if (lineType) {
    var f = (encoding.isMeasure(X) && encoding.isDimension(Y)) ? Y : X;
    if (!mdef.from) mdef.from = {};
    // TODO: why - ?
    mdef.from.transform = [{type: 'sort', by: '-' + encoding.field(f)}];
  }

  // Small Multiples
  if (hasRow || hasCol) {
    spec = faceting(group, encoding, layout, style, sorting, spec, mdef, stack, stats);
    spec.legends = legend.defs(encoding);
  } else {
    group.scales = scale.defs(scale.names(mdef.properties.update), encoding, layout, style, sorting,
      {stack: stack, stats: stats});
    group.axes = axis.defs(axis.names(mdef.properties.update), encoding, layout, stats);
    group.legends = legend.defs(encoding);
  }

  filter.filterLessThanZero(spec, encoding);

  return spec;
}


},{"../globals":24,"../util":27,"./aggregates":3,"./axis":4,"./binning":5,"./faceting":7,"./filter":8,"./group":9,"./layout":10,"./legend":11,"./marks":12,"./scale":13,"./sort":14,"./stacking":15,"./style":16,"./subfaceting":17,"./template":18,"./time":19}],7:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

var axis = require('./axis'),
  groupdef = require('./group').def,
  scale = require('./scale');

module.exports = faceting;

function faceting(group, encoding, layout, style, sorting, spec, mdef, stack, stats) {
  var enter = group.properties.enter;
  var facetKeys = [], cellAxes = [], from, axesGrp;

  var hasRow = encoding.has(ROW), hasCol = encoding.has(COL);

  enter.fill = {value: encoding.config('cellBackgroundColor')};

  //move "from" to cell level and add facet transform
  group.from = {data: group.marks[0].from.data};

  // Hack, this needs to be refactored
  for (var i = 0; i < group.marks.length; i++) {
    var mark = group.marks[i];
    if (mark.from.transform) {
      delete mark.from.data; //need to keep transform for subfacetting case
    } else {
      delete mark.from;
    }
  }

  if (hasRow) {
    if (!encoding.isDimension(ROW)) {
      util.error('Row encoding should be ordinal.');
    }
    enter.y = {scale: ROW, field: 'keys.' + facetKeys.length};
    enter.height = {'value': layout.cellHeight}; // HACK

    facetKeys.push(encoding.field(ROW));

    if (hasCol) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.field(COL)]});
    }

    axesGrp = groupdef('x-axes', {
        axes: encoding.has(X) ? axis.defs(['x'], encoding, layout, stats) : undefined,
        x: hasCol ? {scale: COL, field: 'keys.0'} : {value: 0},
        width: hasCol && {'value': layout.cellWidth}, //HACK?
        from: from
      });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['row'], encoding, layout, stats));
  } else { // doesn't have row
    if (encoding.has(X)) {
      //keep x axis in the cell
      cellAxes.push.apply(cellAxes, axis.defs(['x'], encoding, layout, stats));
    }
  }

  if (hasCol) {
    if (!encoding.isDimension(COL)) {
      util.error('Col encoding should be ordinal.');
    }
    enter.x = {scale: COL, field: 'keys.' + facetKeys.length};
    enter.width = {'value': layout.cellWidth}; // HACK

    facetKeys.push(encoding.field(COL));

    if (hasRow) {
      from = util.duplicate(group.from);
      from.transform = from.transform || [];
      from.transform.unshift({type: 'facet', keys: [encoding.field(ROW)]});
    }

    axesGrp = groupdef('y-axes', {
      axes: encoding.has(Y) ? axis.defs(['y'], encoding, layout, stats) : undefined,
      y: hasRow && {scale: ROW, field: 'keys.0'},
      x: hasRow && {value: 0},
      height: hasRow && {'value': layout.cellHeight}, //HACK?
      from: from
    });

    spec.marks.unshift(axesGrp); // need to prepend so it appears under the plots
    (spec.axes = spec.axes || []);
    spec.axes.push.apply(spec.axes, axis.defs(['col'], encoding, layout, stats));
  } else { // doesn't have col
    if (encoding.has(Y)) {
      cellAxes.push.apply(cellAxes, axis.defs(['y'], encoding, layout, stats));
    }
  }

  // assuming equal cellWidth here
  // TODO: support heterogenous cellWidth (maybe by using multiple scales?)
  spec.scales = (spec.scales || []).concat(scale.defs(
    scale.names(enter).concat(scale.names(mdef.properties.update)),
    encoding,
    layout,
    style,
    sorting,
    {stack: stack, facet: true, stats: stats}
  )); // row/col scales + cell scales

  if (cellAxes.length > 0) {
    group.axes = cellAxes;
  }

  // add facet transform
  var trans = (group.from.transform || (group.from.transform = []));
  trans.unshift({type: 'facet', keys: facetKeys});

  return spec;
}

},{"../globals":24,"../util":27,"./axis":4,"./group":9,"./scale":13}],8:[function(require,module,exports){
'use strict';

var globals = require('../globals');

var filter = module.exports = {};

var BINARY = {
  '>':  true,
  '>=': true,
  '=':  true,
  '!=': true,
  '<':  true,
  '<=': true
};

filter.addFilters = function(spec, encoding) {
  var filters = encoding.filter(),
    data = spec.data[0];  // apply filters to raw data before aggregation

  if (!data.transform)
    data.transform = [];

  // add custom filters
  for (var i in filters) {
    var filter = filters[i];

    var condition = '';
    var operator = filter.operator;
    var operands = filter.operands;

    if (BINARY[operator]) {
      // expects a field and a value
      if (operator === '=') {
        operator = '==';
      }

      var op1 = operands[0];
      var op2 = operands[1];
      condition = 'd.data.' + op1 + operator + op2;
    } else if (operator === 'notNull') {
      // expects a number of fields
      for (var j in operands) {
        condition += 'd.data.' + operands[j] + '!==null';
        if (j < operands.length - 1) {
          condition += ' && ';
        }
      }
    } else {
      console.warn('Unsupported operator: ', operator);
    }

    data.transform.push({
      type: 'filter',
      test: condition
    });
  }
};

// remove less than 0 values if we use log function
filter.filterLessThanZero = function(spec, encoding) {
  encoding.forEach(function(field, encType) {
    if (encoding.scale(encType).type === 'log') {
      spec.data[1].transform.push({
        type: 'filter',
        test: 'd.' + encoding.field(encType) + '>0'
      });
    }
  });
};


},{"../globals":24}],9:[function(require,module,exports){
'use strict';

module.exports = {
  def: groupdef
};

function groupdef(name, opt) {
  opt = opt || {};
  return {
    _name: name || undefined,
    type: 'group',
    from: opt.from,
    properties: {
      enter: {
        x: opt.x || undefined,
        y: opt.y || undefined,
        width: opt.width || {group: 'width'},
        height: opt.height || {group: 'height'}
      }
    },
    scales: opt.scales || undefined,
    axes: opt.axes || undefined,
    marks: opt.marks || []
  };
}

},{}],10:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  setter = util.setter,
  schema = require('../schema/schema'),
  time = require('./time'),
  vlfield = require('../field');

module.exports = vllayout;

function vllayout(encoding, stats) {
  var layout = box(encoding, stats);
  layout = offset(encoding, stats, layout);
  return layout;
}

/*
  HACK to set chart size
  NOTE: this fails for plots driven by derived values (e.g., aggregates)
  One solution is to update Vega to support auto-sizing
  In the meantime, auto-padding (mostly) does the trick
 */
function box(encoding, stats) {
  var hasRow = encoding.has(ROW),
      hasCol = encoding.has(COL),
      hasX = encoding.has(X),
      hasY = encoding.has(Y),
      marktype = encoding.marktype();

  // FIXME/HACK we need to take filter into account
  var xCardinality = hasX && encoding.isDimension(X) ? encoding.cardinality(X, stats) : 1,
    yCardinality = hasY && encoding.isDimension(Y) ? encoding.cardinality(Y, stats) : 1;

  var useSmallBand = xCardinality > encoding.config('largeBandMaxCardinality') ||
    yCardinality > encoding.config('largeBandMaxCardinality');

  var cellWidth, cellHeight, cellPadding = encoding.config('cellPadding');

  // set cellWidth
  if (hasX) {
    if (encoding.isOrdinalScale(X)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellWidth = (xCardinality + encoding.band(X).padding) * encoding.bandSize(X, useSmallBand);
    } else {
      cellWidth = hasCol || hasRow ? encoding.enc(COL).width :  encoding.config("singleWidth");
    }
  } else {
    if (marktype === TEXT) {
      cellWidth = encoding.config('textCellWidth');
    } else {
      cellWidth = encoding.bandSize(X);
    }
  }

  // set cellHeight
  if (hasY) {
    if (encoding.isOrdinalScale(Y)) {
      // for ordinal, hasCol or not doesn't matter -- we scale based on cardinality
      cellHeight = (yCardinality + encoding.band(Y).padding) * encoding.bandSize(Y, useSmallBand);
    } else {
      cellHeight = hasCol || hasRow ? encoding.enc(ROW).height :  encoding.config("singleHeight");
    }
  } else {
    cellHeight = encoding.bandSize(Y);
  }

  // Cell bands use rangeBands(). There are n-1 padding.  Outerpadding = 0 for cells

  var width = cellWidth, height = cellHeight;
  if (hasCol) {
    var colCardinality = encoding.cardinality(COL, stats);
    width = cellWidth * ((1 + cellPadding) * (colCardinality - 1) + 1);
  }
  if (hasRow) {
    var rowCardinality =  encoding.cardinality(ROW, stats);
    height = cellHeight * ((1 + cellPadding) * (rowCardinality - 1) + 1);
  }

  return {
    // width and height of the whole cell
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellPadding: cellPadding,
    // width and height of the chart
    width: width,
    height: height,
    // information about x and y, such as band size
    x: {useSmallBand: useSmallBand},
    y: {useSmallBand: useSmallBand}
  };
}

function offset(encoding, stats, layout) {
  [X, Y].forEach(function (x) {
    var maxLength;
    if (encoding.isDimension(x) || encoding.isType(x, T)) {
      maxLength = stats[encoding.fieldName(x)].maxlength;
    } else if (encoding.aggr(x) === 'count') {
      //assign default value for count as it won't have stats
      maxLength =  3;
    } else if (encoding.isType(x, Q)) {
      if (x===X) {
        maxLength = 3;
      } else { // Y
        //assume that default formating is always shorter than 7
        maxLength = Math.min(stats[encoding.fieldName(x)].maxlength, 7);
      }
    }
    setter(layout,[x, 'axisTitleOffset'], encoding.config('characterWidth') *  maxLength + 20);
  });
  return layout;
}

},{"../field":23,"../globals":24,"../schema/schema":25,"../util":27,"./time":19}],11:[function(require,module,exports){
'use strict';

var global = require('../globals'),
  time = require('./time');

var legend = module.exports = {};

legend.defs = function(encoding) {
  var defs = [];

  // TODO: support alpha

  if (encoding.has(COLOR) && encoding.legend(COLOR)) {
    defs.push(legend.def(COLOR, encoding, {
      fill: COLOR,
      orient: 'right'
    }));
  }

  if (encoding.has(SIZE) && encoding.legend(SIZE)) {
    defs.push(legend.def(SIZE, encoding, {
      size: SIZE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  if (encoding.has(SHAPE) && encoding.legend(SHAPE)) {
    if (defs.length === 2) {
      // TODO: fix this
      console.error('Vegalite currently only supports two legends');
      return defs;
    }
    defs.push(legend.def(SHAPE, encoding, {
      shape: SHAPE,
      orient: defs.length === 1 ? 'left' : 'right'
    }));
  }

  return defs;
};

legend.def = function(name, encoding, props) {
  var def = props, fn;

  def.title = encoding.fieldTitle(name);

  if (encoding.isType(name, T) && (fn = encoding.fn(name)) &&
    time.hasScale(fn)) {
    var properties = def.properties = def.properties || {},
      labels = properties.labels = properties.labels || {},
      text = labels.text = labels.text || {};

    text.scale = 'time-'+ fn;
  }

  return def;
};

},{"../globals":24,"./time":19}],12:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  vlscale = require('./scale');

var marks = module.exports = {};

marks.def = function(mark, encoding, layout, style) {
  var defs = [];

  // to add a background to text, we need to add it before the text
  if (encoding.marktype() === TEXT && encoding.has(COLOR)) {
    var bg = {
      x: {value: 0},
      y: {value: 0},
      x2: {value: layout.cellWidth},
      y2: {value: layout.cellHeight},
      fill: {scale: COLOR, field: encoding.field(COLOR)}
    };
    defs.push({
      type: 'rect',
      from: {data: TABLE},
      properties: {enter: bg, update: bg}
    });
  }

  // add the mark def for the main thing
  var p = mark.prop(encoding, layout, style);
  defs.push({
    type: mark.type,
    from: {data: TABLE},
    properties: {enter: p, update: p}
  });

  return defs;
};

marks.bar = {
  type: 'rect',
  stack: true,
  prop: bar_props,
  requiredEncoding: ['x', 'y'],
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1}
};

marks.line = {
  type: 'line',
  line: true,
  prop: line_props,
  requiredEncoding: ['x', 'y'],
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1, detail:1}
};

marks.area = {
  type: 'area',
  stack: true,
  line: true,
  requiredEncoding: ['x', 'y'],
  prop: area_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1}
};

marks.tick = {
  type: 'rect',
  prop: tick_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, color: 1, alpha: 1, detail: 1}
};

marks.circle = {
  type: 'symbol',
  prop: filled_point_props('circle'),
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1, detail: 1}
};

marks.square = {
  type: 'symbol',
  prop: filled_point_props('square'),
  supportedEncoding: marks.circle.supportedEncoding
};

marks.point = {
  type: 'symbol',
  prop: point_props,
  supportedEncoding: {row: 1, col: 1, x: 1, y: 1, size: 1, color: 1, alpha: 1, shape: 1, detail: 1}
};

marks.text = {
  type: 'text',
  prop: text_props,
  requiredEncoding: ['text'],
  supportedEncoding: {row: 1, col: 1, size: 1, color: 1, alpha: 1, text: 1}
};

function bar_props(e, layout, style) {
  var p = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: e.scale(X).type === 'log' ? 1 : 0};
    }
  } else if (e.has(X)) { // is ordinal
    p.xc = {scale: X, field: e.field(X)};
  } else {
    // TODO add single bar offset
    p.xc = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: e.scale(Y).type === 'log' ? 1 : 0};
  } else if (e.has(Y)) { // is ordinal
    p.yc = {scale: Y, field: e.field(Y)};
  } else {
    // TODO add single bar offset
    p.yc = {group: 'height'};
  }

  // width
  if (!e.has(X) || e.isOrdinalScale(X)) { // no X or X is ordinal
    if (e.has(SIZE)) {
      p.width = {scale: SIZE, field: e.field(SIZE)};
    } else {
      p.width = {
        value: e.bandSize(X, layout.x.useSmallBand),
        offset: -1
      };
    }
  } else { // X is Quant or Time Scale
    p.width = {value: 2};
  }

  // height
  if (!e.has(Y) || e.isOrdinalScale(Y)) { // no Y or Y is ordinal
    if (e.has(SIZE)) {
      p.height = {scale: SIZE, field: e.field(SIZE)};
    } else {
      p.height = {
        value: e.bandSize(Y, layout.y.useSmallBand),
        offset: -1
      };
    }
  } else { // Y is Quant or Time Scale
    p.height = {value: 2};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  return p;
}

function point_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.size = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(SIZE)) {
    p.size = {value: e.value(SIZE)};
  }

  // shape
  if (e.has(SHAPE)) {
    p.shape = {scale: SHAPE, field: e.field(SHAPE)};
  } else if (!e.has(SHAPE)) {
    p.shape = {value: e.value(SHAPE)};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else if (!e.has(COLOR)) {
    p.opacity = {value: style.opacity};
  }

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

function line_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {group: 'height'};
  }

  // stroke
  if (e.has(COLOR)) {
    p.stroke = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.stroke = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  p.strokeWidth = {value: e.config('strokeWidth')};

  return p;
}

function area_props(e, layout, style) {
  var p = {};

  // x
  if (e.isMeasure(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(Y)) {
      p.x2 = {scale: X, value: 0};
      p.orient = {value: 'horizontal'};
    }
  } else if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else {
    p.x = {value: 0};
  }

  // y
  if (e.isMeasure(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    p.y2 = {scale: Y, value: 0};
  } else if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else {
    p.y = {group: 'height'};
  }

  // stroke
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else if (!e.has(COLOR)) {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  }

  return p;
}

function tick_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
    if (e.isDimension(X)) {
      p.x.offset = -e.bandSize(X, layout.x.useSmallBand) / 3;
    }
  } else if (!e.has(X)) {
    p.x = {value: 0};
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
    if (e.isDimension(Y)) {
      p.y.offset = -e.bandSize(Y, layout.y.useSmallBand) / 3;
    }
  } else if (!e.has(Y)) {
    p.y = {value: 0};
  }

  // width
  if (!e.has(X) || e.isDimension(X)) {
    p.width = {value: e.bandSize(X, layout.y.useSmallBand) / 1.5};
  } else {
    p.width = {value: 1};
  }

  // height
  if (!e.has(Y) || e.isDimension(Y)) {
    p.height = {value: e.bandSize(Y, layout.y.useSmallBand) / 1.5};
  } else {
    p.height = {value: 1};
  }

  // fill
  if (e.has(COLOR)) {
    p.fill = {scale: COLOR, field: e.field(COLOR)};
  } else {
    p.fill = {value: e.value(COLOR)};
  }

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else if (!e.has(COLOR)) {
    p.opacity = {value: style.opacity};
  }

  return p;
}

function filled_point_props(shape) {
  return function(e, layout, style) {
    var p = {};

    // x
    if (e.has(X)) {
      p.x = {scale: X, field: e.field(X)};
    } else if (!e.has(X)) {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }

    // y
    if (e.has(Y)) {
      p.y = {scale: Y, field: e.field(Y)};
    } else if (!e.has(Y)) {
      p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
    }

    // size
    if (e.has(SIZE)) {
      p.size = {scale: SIZE, field: e.field(SIZE)};
    } else if (!e.has(X)) {
      p.size = {value: e.value(SIZE)};
    }

    // shape
    p.shape = {value: shape};

    // fill
    if (e.has(COLOR)) {
      p.fill = {scale: COLOR, field: e.field(COLOR)};
    } else if (!e.has(COLOR)) {
      p.fill = {value: e.value(COLOR)};
    }

    // alpha
    if (e.has(ALPHA)) {
      p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
    } else if (e.value(ALPHA) !== undefined) {
      p.opacity = {value: e.value(ALPHA)};
    } else if (!e.has(COLOR)) {
      p.opacity = {value: style.opacity};
    }

    return p;
  };
}

function text_props(e, layout, style) {
  var p = {};

  // x
  if (e.has(X)) {
    p.x = {scale: X, field: e.field(X)};
  } else if (!e.has(X)) {
    if (e.has(TEXT) && e.isType(TEXT, Q)) {
      p.x = {value: layout.cellWidth-5};
    } else {
      p.x = {value: e.bandSize(X, layout.x.useSmallBand) / 2};
    }
  }

  // y
  if (e.has(Y)) {
    p.y = {scale: Y, field: e.field(Y)};
  } else if (!e.has(Y)) {
    p.y = {value: e.bandSize(Y, layout.y.useSmallBand) / 2};
  }

  // size
  if (e.has(SIZE)) {
    p.fontSize = {scale: SIZE, field: e.field(SIZE)};
  } else if (!e.has(SIZE)) {
    p.fontSize = {value: e.font('size')};
  }

  // fill
  // color should be set to background
  p.fill = {value: 'black'};

  // alpha
  if (e.has(ALPHA)) {
    p.opacity = {scale: ALPHA, field: e.field(ALPHA)};
  } else if (e.value(ALPHA) !== undefined) {
    p.opacity = {value: e.value(ALPHA)};
  } else {
    p.opacity = {value: style.opacity};
  }

  // text
  if (e.has(TEXT)) {
    if (e.isType(TEXT, Q)) {
      p.text = {template: "{{" + e.field(TEXT) + " | number:'.3s'}}"};
      p.align = {value: 'right'};
    } else {
      p.text = {field: e.field(TEXT)};
    }
  } else {
    p.text = {value: 'Abc'};
  }

  p.font = {value: e.font('family')};
  p.fontWeight = {value: e.font('weight')};
  p.fontStyle = {value: e.font('style')};
  p.baseline = {value: e.text('baseline')};

  return p;
}

},{"../globals":24,"../util":27,"./scale":13}],13:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  time = require('./time');

var scale = module.exports = {};

scale.names = function(props) {
  return util.keys(util.keys(props).reduce(function(a, x) {
    if (props[x] && props[x].scale) a[props[x].scale] = 1;
    return a;
  }, {}));
};

scale.defs = function(names, encoding, layout, style, sorting, opt) {
  opt = opt || {};

  return names.reduce(function(a, name) {
    var s = {
      name: name,
      type: scale.type(name, encoding),
      domain: scale_domain(name, encoding, sorting, opt)
    };
    if (s.type === 'ordinal' && !encoding.bin(name) && encoding.sort(name).length === 0) {
      s.sort = true;
    }

    scale_range(s, encoding, layout, style, opt);

    return (a.push(s), a);
  }, []);
};

scale.type = function(name, encoding) {

  switch (encoding.type(name)) {
    case O: return 'ordinal';
    case T:
      var fn = encoding.fn(name);
      return (fn && time.scale.type(fn, name)) || 'time';
    case Q:
      if (encoding.bin(name)) {
        return name === COLOR ? 'linear' : 'ordinal';
      }
      return encoding.scale(name).type;
  }
};

function scale_domain(name, encoding, sorting, opt) {
  if (encoding.isType(name, T)) {
    var range = time.scale.domain(encoding.fn(name), name);
    if(range) return range;
  }

  if (encoding.bin(name)) {
    // TODO: add includeEmptyConfig here
    if (opt.stats) {
      var bins = util.getbins(opt.stats[encoding.fieldName(name)], encoding.bin(name).maxbins);
      var domain = util.range(bins.start, bins.stop, bins.step);
      return name === Y ? domain.reverse() : domain;
    }
  }

  return name == opt.stack ?
    {
      data: STACKED,
      field: 'data.' + (opt.facet ? 'max_' : '') + 'sum_' + encoding.field(name, true)
    } :
    {data: sorting.getDataset(name), field: encoding.field(name)};
}

function scale_range(s, encoding, layout, style, opt) {
  var spec = encoding.scale(s.name);
  switch (s.name) {
    case X:
      if (s.type === 'ordinal') {
        s.bandWidth = encoding.bandSize(X, layout.x.useSmallBand);
      } else {
        s.range = layout.cellWidth ? [0, layout.cellWidth] : 'width';

        if (encoding.isType(s.name,T) && encoding.fn(s.name) === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }
      s.round = true;
      if (s.type === 'time') {
        s.nice = encoding.fn(s.name);
      }else {
        s.nice = true;
      }
      break;
    case Y:
      if (s.type === 'ordinal') {
        s.bandWidth = encoding.bandSize(Y, layout.y.useSmallBand);
      } else {
        s.range = layout.cellHeight ? [layout.cellHeight, 0] : 'height';

        if (encoding.isType(s.name,T) && encoding.fn(s.name) === 'year') {
          s.zero = false;
        } else {
          s.zero = spec.zero === undefined ? true : spec.zero;
        }

        s.reverse = spec.reverse;
      }

      s.round = true;

      if (s.type === 'time') {
        s.nice = encoding.fn(s.name) || encoding.config('timeScaleNice');
      }else {
        s.nice = true;
      }
      break;
    case ROW: // support only ordinal
      s.bandWidth = layout.cellHeight;
      s.round = true;
      s.nice = true;
      break;
    case COL: // support only ordinal
      s.bandWidth = layout.cellWidth;
      s.round = true;
      s.nice = true;
      break;
    case SIZE:
      if (encoding.is('bar')) {
        // FIXME this is definitely incorrect
        // but let's fix it later since bar size is a bad encoding anyway
        s.range = [3, Math.max(encoding.bandSize(X), encoding.bandSize(Y))];
      } else if (encoding.is(TEXT)) {
        s.range = [8, 40];
      } else { //point
        var bandSize = Math.min(encoding.bandSize(X), encoding.bandSize(Y)) - 1;
        s.range = [10, 0.8 * bandSize*bandSize];
      }
      s.round = true;
      s.zero = false;
      break;
    case SHAPE:
      s.range = 'shapes';
      break;
    case COLOR:
      var range = encoding.scale(COLOR).range;
      if (range === undefined) {
        if (s.type === 'ordinal') {
          // FIXME
          range = style.colorRange;
        } else {
          range = ['#A9DB9F', '#0D5C21'];
          s.zero = false;
        }
      }
      s.range = range;
      break;
    case ALPHA:
      s.range = [0.2, 1.0];
      break;
    default:
      throw new Error('Unknown encoding name: '+ s.name);
  }

  switch (s.name) {
    case ROW:
    case COL:
      s.padding = encoding.config('cellPadding');
      s.outerPadding = 0;
      break;
    case X:
    case Y:
      if (s.type === 'ordinal') { //&& !s.bandWidth
        s.points = true;
        s.padding = encoding.band(s.name).padding;
      }
  }
}

},{"../globals":24,"../util":27,"./time":19}],14:[function(require,module,exports){
'use strict';

var globals = require('../globals');

module.exports = addSortTransforms;

// adds new transforms that produce sorted fields
function addSortTransforms(spec, encoding, stats, opt) {
  var datasetMapping = {};
  var counter = 0;

  encoding.forEach(function(field, encType) {
    var sortBy = encoding.sort(encType, stats);
    if (sortBy.length > 0) {
      var fields = sortBy.map(function(d) {
        return {
          op: d.aggr,
          field: 'data.' + d.name
        };
      });

      var byClause = sortBy.map(function(d) {
        var reverse = (d.reverse ? '-' : '');
        return reverse + 'data.' + (d.aggr==='count' ? 'count' : (d.aggr + '_' + d.name));
      });

      var dataName = 'sorted' + counter++;

      var transforms = [
        {
          type: 'aggregate',
          groupby: ['data.' + field.name],
          fields: fields
        },
        {
          type: 'sort',
          by: byClause
        }
      ];

      spec.data.push({
        name: dataName,
        source: RAW,
        transform: transforms
      });

      datasetMapping[encType] = dataName;
    }
  });

  return {
    spec: spec,
    getDataset: function(encType) {
      var data = datasetMapping[encType];
      if (!data) {
        return TABLE;
      }
      return data;
    }
  };
}

},{"../globals":24}],15:[function(require,module,exports){
"use strict";

var globals = require('../globals'),
  util = require('../util'),
  marks = require('./marks');

module.exports = stacking;

function stacking(spec, encoding, mdef, facets) {
  if (!marks[encoding.marktype()].stack) return false;

  // TODO: add || encoding.has(LOD) here once LOD is implemented
  if (!encoding.has(COLOR)) return false;

  var dim=null, val=null, idx =null,
    isXMeasure = encoding.isMeasure(X),
    isYMeasure = encoding.isMeasure(Y);

  if (isXMeasure && !isYMeasure) {
    dim = Y;
    val = X;
    idx = 0;
  } else if (isYMeasure && !isXMeasure) {
    dim = X;
    val = Y;
    idx = 1;
  } else {
    return null; // no stack encoding
  }

  // add transform to compute sums for scale
  var stacked = {
    name: STACKED,
    source: TABLE,
    transform: [{
      type: 'aggregate',
      groupby: [encoding.field(dim)].concat(facets), // dim and other facets
      fields: [{op: 'sum', field: encoding.field(val)}] // TODO check if field with aggr is correct?
    }]
  };

  if (facets && facets.length > 0) {
    stacked.transform.push({ //calculate max for each facet
      type: 'aggregate',
      groupby: facets,
      fields: [{op: 'max', field: 'data.sum_' + encoding.field(val, true)}]
    });
  }

  spec.data.push(stacked);

  // add stack transform to mark
  mdef.from.transform = [{
    type: 'stack',
    point: encoding.field(dim),
    height: encoding.field(val),
    output: {y1: val, y0: val + '2'}
  }];

  // TODO: This is super hack-ish -- consolidate into modular mark properties?
  mdef.properties.update[val] = mdef.properties.enter[val] = {scale: val, field: val};
  mdef.properties.update[val + '2'] = mdef.properties.enter[val + '2'] = {scale: val, field: val + '2'};

  return val; //return stack encoding
}

},{"../globals":24,"../util":27,"./marks":12}],16:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util'),
  vlfield = require('../field'),
  Encoding = require('../Encoding');

module.exports = function(encoding, stats) {
  return {
    opacity: estimateOpacity(encoding, stats),
    colorRange: colorRange(encoding, stats)
  };
};

function colorRange(encoding, stats){
  if (encoding.has(COLOR) && encoding.isDimension(COLOR)) {
    var cardinality = encoding.cardinality(COLOR, stats);
    if (cardinality <= 10) {
      return "category10";
    } else {
      return "category20";
    }
    // TODO can vega interpolate range for ordinal scale?
  }
  return null;
}

function estimateOpacity(encoding,stats) {
  if (!stats) {
    return 1;
  }

  var numPoints = 0;

  if (encoding.isAggregate()) { // aggregate plot
    numPoints = 1;

    //  get number of points in each "cell"
    //  by calculating product of cardinality
    //  for each non faceting and non-ordinal X / Y fields
    //  note that ordinal x,y are not include since we can
    //  consider that ordinal x are subdividing the cell into subcells anyway
    encoding.forEach(function(field, encType) {

      if (encType !== ROW && encType !== COL &&
          !((encType === X || encType === Y) &&
          vlfield.isOrdinalScale(field, true))
        ) {
        numPoints *= encoding.cardinality(encType, stats);
      }
    });

  } else { // raw plot
    numPoints = stats.count;

    // small multiples divide number of points
    var numMultiples = 1;
    if (encoding.has(ROW)) {
      numMultiples *= encoding.cardinality(ROW, stats);
    }
    if (encoding.has(COL)) {
      numMultiples *= encoding.cardinality(COL, stats);
    }
    numPoints /= numMultiples;
  }

  var opacity = 0;
  if (numPoints < 20) {
    opacity = 1;
  } else if (numPoints < 200) {
    opacity = 0.7;
  } else if (numPoints < 1000 || encoding.is('tick')) {
    opacity = 0.6;
  } else {
    opacity = 0.3;
  }

  return opacity;
}


},{"../Encoding":2,"../field":23,"../globals":24,"../util":27}],17:[function(require,module,exports){
'use strict';

var global = require('../globals');

var groupdef = require('./group').def;

module.exports = subfaceting;

function subfaceting(group, mdef, details, stack, encoding) {
  var m = group.marks,
    g = groupdef('subfacet', {marks: m});

  group.marks = [g];
  g.from = mdef.from;
  delete mdef.from;

  //TODO test LOD -- we should support stack / line without color (LOD) field
  var trans = (g.from.transform || (g.from.transform = []));
  trans.unshift({type: 'facet', keys: details});

  if (stack && encoding.has(COLOR)) {
    trans.unshift({type: 'sort', by: encoding.field(COLOR)});
  }
}

},{"../globals":24,"./group":9}],18:[function(require,module,exports){
'use strict';

var globals = require('../globals');

var groupdef = require('./group').def,
  vldata = require('../data');

module.exports = template;

function template(encoding, layout, stats) { //hack use stats

  var data = {name: RAW, format: {type: encoding.config('dataFormatType')}},
    table = {name: TABLE, source: RAW},
    dataUrl = vldata.getUrl(encoding, stats);
  if (dataUrl) data.url = dataUrl;

  var preaggregatedData = encoding.config('useVegaServer');

  encoding.forEach(function(field, encType) {
    var name;
    if (field.type == T) {
      data.format.parse = data.format.parse || {};
      data.format.parse[field.name] = 'date';
    } else if (field.type == Q) {
      data.format.parse = data.format.parse || {};
      if (field.aggr === 'count') {
        name = 'count';
      } else if (preaggregatedData && field.bin) {
        name = 'bin_' + field.name;
      } else if (preaggregatedData && field.aggr) {
        name = field.aggr + '_' + field.name;
      } else {
        name = field.name;
      }
      data.format.parse[name] = 'number';
    }
  });

  return {
    width: layout.width,
    height: layout.height,
    padding: 'auto',
    data: [data, table],
    marks: [groupdef('cell', {
      width: layout.cellWidth ? {value: layout.cellWidth} : undefined,
      height: layout.cellHeight ? {value: layout.cellHeight} : undefined
    })]
  };
}

},{"../data":21,"../globals":24,"./group":9}],19:[function(require,module,exports){
'use strict';

var globals = require('../globals'),
  util = require('../util');

module.exports = time;

function time(spec, encoding, opt) {
  var timeFields = {}, timeFn = {};

  // find unique formula transformation and bin function
  encoding.forEach(function(field, encType) {
    if (field.type === T && field.fn) {
      timeFields[encoding.field(encType)] = {
        field: field,
        encType: encType
      };
      timeFn[field.fn] = true;
    }
  });

  // add formula transform
  var data = spec.data[1],
    transform = data.transform = data.transform || [];

  for (var f in timeFields) {
    var tf = timeFields[f];
    time.transform(transform, encoding, tf.encType, tf.field);
  }

  // add scales
  var scales = spec.scales = spec.scales || [];
  for (var fn in timeFn) {
    time.scale(scales, fn, encoding);
  }
  return spec;
}

time.cardinality = function(field, stats, filterNull, type) {
  var fn = field.fn;
  switch (fn) {
    case 'seconds': return 60;
    case 'minutes': return 60;
    case 'hours': return 24;
    case 'day': return 7;
    case 'date': return 31;
    case 'month': return 12;
    case 'year':
      var stat = stats[field.name],
        yearstat = stats['year_'+field.name];

      if (!yearstat) { return null; }

      return yearstat.cardinality -
        (stat.numNulls > 0 && filterNull[type] ? 1 : 0);
  }

  return null;
};

function fieldFn(func, field) {
  return 'utc' + func + '(d.data.'+ field.name +')';
}

/**
 * @return {String} date binning formula of the given field
 */
time.formula = function(field) {
  return fieldFn(field.fn, field);
};

/** add formula transforms to data */
time.transform = function(transform, encoding, encType, field) {
  transform.push({
    type: 'formula',
    field: encoding.field(encType),
    expr: time.formula(field)
  });
};

/** append custom time scales for axis label */
time.scale = function(scales, fn, encoding) {
  var labelLength = encoding.config('timeScaleLabelLength');
  // TODO add option for shorter scale / custom range
  switch (fn) {
    case 'day':
      scales.push({
        name: 'time-'+fn,
        type: 'ordinal',
        domain: util.range(0, 7),
        range: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
          function(s) { return s.substr(0, labelLength);}
        )
      });
      break;
    case 'month':
      scales.push({
        name: 'time-'+fn,
        type: 'ordinal',
        domain: util.range(0, 12),
        range: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
            function(s) { return s.substr(0, labelLength);}
          )
      });
      break;
  }
};

time.isOrdinalFn = function(fn) {
  switch (fn) {
    case 'seconds':
    case 'minutes':
    case 'hours':
    case 'day':
    case 'date':
    case 'month':
      return true;
  }
  return false;
};

time.scale.type = function(fn, name) {
  if (name === COLOR) {
    return 'linear'; // this has order
  }

  return time.isOrdinalFn(fn) || name === COL || name === ROW ? 'ordinal' : 'linear';
};

time.scale.domain = function(fn, name) {
  var isColor = name === COLOR;
  switch (fn) {
    case 'seconds':
    case 'minutes': return isColor ? [0,59] : util.range(0, 60);
    case 'hours': return isColor ? [0,23] : util.range(0, 24);
    case 'day': return isColor ? [0,6] : util.range(0, 7);
    case 'date': return isColor ? [1,31] : util.range(1, 32);
    case 'month': return isColor ? [0,11] : util.range(0, 12);
  }
  return null;
};

/** whether a particular time function has custom scale for labels implemented in time.scale */
time.hasScale = function(fn) {
  switch (fn) {
    case 'day':
    case 'month':
      return true;
  }
  return false;
};



},{"../globals":24,"../util":27}],20:[function(require,module,exports){
'use strict';

var globals = require('./globals');

var consts = module.exports = {};

consts.encodingTypes = [X, Y, ROW, COL, SIZE, SHAPE, COLOR, ALPHA, TEXT, DETAIL];

consts.dataTypes = {'O': O, 'Q': Q, 'T': T};

consts.dataTypeNames = ['O', 'Q', 'T'].reduce(function(r, x) {
  r[consts.dataTypes[x]] = x;
  return r;
},{});

consts.shorthand = {
  delim:  '|',
  assign: '=',
  type:   ',',
  func:   '_'
};

},{"./globals":24}],21:[function(require,module,exports){
'use strict';

// TODO: rename getDataUrl to vl.data.getUrl() ?

var util = require('./util');

var vldata = module.exports = {},
  vlfield = require('./field');

vldata.getUrl = function getDataUrl(encoding, stats) {
  if (!encoding.config('useVegaServer')) {
    // don't use vega server
    return encoding.config('dataUrl');
  }

  if (encoding.length() === 0) {
    // no fields
    return;
  }

  var fields = [];
  encoding.forEach(function(field, encType) {
    var obj = {
      name: encoding.field(encType, true),
      field: field.name
    };
    if (field.aggr) {
      obj.aggr = field.aggr;
    }
    if (field.bin) {
      obj.binSize = util.getbins(stats[field.name], encoding.bin(encType).maxbins).step;
    }
    fields.push(obj);
  });

  var query = {
    table: encoding.config('vegaServerTable'),
    fields: fields
  };

  return encoding.config('vegaServerUrl') + '/query/?q=' + JSON.stringify(query);
};

/**
 * @param  {Object} data data in JSON/javascript object format
 * @return Array of {name: __name__, type: "number|text|time|location"}
 */
vldata.getSchema = function(data, order) {
  var schema = [],
    fields = util.keys(data[0]);

  fields.forEach(function(k) {
    // find non-null data
    var i = 0, datum = data[i][k];
    while (datum === '' || datum === null || datum === undefined) {
      datum = data[++i][k];
    }

    datum = util.parse(datum);
    var type = (typeof datum === 'number') ? 'Q':
      (datum instanceof Date) ? 'T' : 'O';

    schema.push({name: k, type: type});
  });

  schema = util.stablesort(schema, order || vlfield.order.typeThenName, vlfield.order.name);

  return schema;
};

vldata.getStats = function(data) { // hack
  var stats = {},
    fields = util.keys(data[0]);

  fields.forEach(function(k) {
    var column = data.map(function(d) {return d[k];});

    // Hack
    var val = util.parse(data[0][k]);
    var type = (typeof val === 'number') ? 'Q':
      (val instanceof Date) ? 'T' : 'O';

    var stat = {};
    if (typeof val === 'number') {
      stat = util.minmax(util.numbers(column));
    } else if (val instanceof Date) {
      stat = util.minmax(util.dates(column));
    } else {
      stat = util.minmax(column);
    }

    stat.cardinality = util.uniq(data, k);
    stat.count = data.length;

    stat.maxlength = data.reduce(function(max,row) {
      if (row[k] === null) {
        return max;
      }
      var len = row[k].toString().length;
      return len > max ? len : max;
    }, 0);

    stat.numNulls = data.reduce(function(count, row) {
      return row[k] === null ? count + 1 : count;
    }, 0);

    var numbers = util.numbers(column);

    if (numbers.length > 0) {
      stat.skew = util.skew(numbers);
      stat.stdev = util.stdev(numbers);
      stat.mean = util.mean(numbers);
      stat.median = util.median(numbers);
    }

    var sample = {};
    while(Object.keys(sample).length < Math.min(stat.cardinality, 10)) {
      var value = data[Math.floor(Math.random() * data.length)][k];
      sample[value] = true;
    }
    stat.sample = Object.keys(sample);

    stats[k] = stat;
  });
  stats.count = data.length;
  return stats;
};

},{"./field":23,"./util":27}],22:[function(require,module,exports){
// utility for enc

'use strict';

var consts = require('./consts'),
  c = consts.shorthand,
  time = require('./compile/time'),
  vlfield = require('./field'),
  util = require('./util'),
  schema = require('./schema/schema'),
  encTypes = schema.encTypes;

var vlenc = module.exports = {};

vlenc.countRetinal = function(enc) {
  var count = 0;
  if (enc.color) count++;
  if (enc.alpha) count++;
  if (enc.size) count++;
  if (enc.shape) count++;
  return count;
};

vlenc.has = function(enc, encType) {
  var fieldDef = enc && enc[encType];
  return fieldDef && fieldDef.name;
};

vlenc.isAggregate = function(enc) {
  for (var k in enc) {
    if (vlenc.has(enc, k) && enc[k].aggr) {
      return true;
    }
  }
  return false;
};

vlenc.forEach = function(enc, f) {
  var i = 0;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      f(enc[k], k, i++);
    }
  });
};

vlenc.map = function(enc, f) {
  var arr = [];
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      arr.push(f(enc[k], k, enc));
    }
  });
  return arr;
};

vlenc.reduce = function(enc, f, init) {
  var r = init, i = 0, k;
  encTypes.forEach(function(k) {
    if (vlenc.has(enc, k)) {
      r = f(r, enc[k], k,  enc);
    }
  });
  return r;
};

/*
 * return key-value pairs of field name and list of fields of that field name
 */
vlenc.fields = function(enc) {
  return vlenc.reduce(enc, function (m, field, encType) {
    var fieldList = m[field.name] = m[field.name] || [],
      containsType = fieldList.containsType = fieldList.containsType || {};

    if (fieldList.indexOf(field) === -1) {
      fieldList.push(field);
      // augment the array with containsType.Q / O / T
      containsType[field.type] = true;
    }
    return m;
  }, {});
};

vlenc.shorthand = function(enc) {
  return vlenc.map(enc, function(field, et) {
    return et + c.assign + vlfield.shorthand(field);
  }).join(c.delim);
};

vlenc.parseShorthand = function(shorthand, convertType) {
  var enc = util.isArray(shorthand) ? shorthand : shorthand.split(c.delim);
  return enc.reduce(function(m, e) {
    var split = e.split(c.assign),
        enctype = split[0].trim(),
        field = split[1];

    m[enctype] = vlfield.parseShorthand(field, convertType);
    return m;
  }, {});
};
},{"./compile/time":19,"./consts":20,"./field":23,"./schema/schema":25,"./util":27}],23:[function(require,module,exports){
'use strict';

// utility for field

var consts = require('./consts'),
  c = consts.shorthand,
  time = require('./compile/time'),
  util = require('./util'),
  schema = require('./schema/schema');

var vlfield = module.exports = {};

vlfield.shorthand = function(f) {
  var c = consts.shorthand;
  return (f.aggr ? f.aggr + c.func : '') +
    (f.fn ? f.fn + c.func : '') +
    (f.bin ? 'bin' + c.func : '') +
    (f.name || '') + c.type +
    (consts.dataTypeNames[f.type] || f.type);
};

vlfield.shorthands = function(fields, delim) {
  delim = delim || c.delim;
  return fields.map(vlfield.shorthand).join(delim);
};

vlfield.parseShorthand = function(shorthand, convertType) {
  var split = shorthand.split(c.type), i;
  var o = {
    name: split[0].trim(),
    type: convertType ? consts.dataTypes[split[1].trim()] : split[1].trim()
  };

  // check aggregate type
  for (i in schema.aggr.enum) {
    var a = schema.aggr.enum[i];
    if (o.name.indexOf(a + '_') === 0) {
      o.name = o.name.substr(a.length + 1);
      if (a == 'count' && o.name.length === 0) o.name = '*';
      o.aggr = a;
      break;
    }
  }

  // check time fn
  for (i in schema.timefns) {
    var f = schema.timefns[i];
    if (o.name && o.name.indexOf(f + '_') === 0) {
      o.name = o.name.substr(o.length + 1);
      o.fn = f;
      break;
    }
  }

  // check bin
  if (o.name && o.name.indexOf('bin_') === 0) {
    o.name = o.name.substr(4);
    o.bin = true;
  }

  return o;
};

var typeOrder = {
  O: 0,
  G: 1,
  T: 2,
  Q: 3
};

vlfield.order = {};

vlfield.order.type = function(field) {
  if (field.aggr==='count') return 4;
  return typeOrder[field.type];
};

vlfield.order.typeThenName = function(field) {
  return vlfield.order.type(field) + '_' + field.name.toLowerCase();
};

vlfield.order.original = function() {
  return 0; // no swap will occur
};

vlfield.order.name = function(field) {
  return field.name;
};

vlfield.order.typeThenCardinality = function(field, stats){
  return stats[field.name].cardinality;
};

// FIXME refactor
vlfield.isType = function (fieldDef, type) {
  return (fieldDef.type & type) > 0;
};

vlfield.isType.byCode = vlfield.isType;

vlfield.isType.byName = function (field, type) {
  return field.type === consts.dataTypeNames[type];
};


function getIsType(useTypeCode) {
  return useTypeCode ? vlfield.isType.byCode : vlfield.isType.byName;
}

vlfield.isType.get = getIsType; //FIXME

/*
 * Most fields that use ordinal scale are dimensions.
 * However, YEAR(T), YEARMONTH(T) use time scale, not ordinal but are dimensions too.
 */
vlfield.isOrdinalScale = function(field, useTypeCode /*optional*/) {
  var isType = getIsType(useTypeCode);
  return  isType(field, O) || field.bin ||
    ( isType(field, T) && field.fn && time.isOrdinalFn(field.fn) );
};

function isDimension(field, useTypeCode /*optional*/) {
  var isType = getIsType(useTypeCode);
  return  isType(field, O) || !!field.bin ||
    ( isType(field, T) && !!field.fn );
}

/**
 * For encoding, use encoding.isDimension() to avoid confusion.
 * Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.isDimension = function(field, useTypeCode /*optional*/) {
  return field && isDimension(field, useTypeCode);
};

vlfield.isMeasure = function(field, useTypeCode) {
  return field && !isDimension(field, useTypeCode);
};

vlfield.role = function(field) {
  return isDimension(field) ? 'dimension' : 'measure';
};

vlfield.count = function() {
  return {name:'*', aggr: 'count', type:'Q', displayName: vlfield.count.displayName};
};

vlfield.count.displayName = 'Number of Records';

vlfield.isCount = function(field) {
  return field.aggr === 'count';
};

/**
 * For encoding, use encoding.cardinality() to avoid confusion.  Or use Encoding.isType if your field is from Encoding (and thus have numeric data type).
 * otherwise, do not specific isType so we can use the default isTypeName here.
 */
vlfield.cardinality = function(field, stats, filterNull, useTypeCode) {
  // FIXME need to take filter into account
  var isType = getIsType(useTypeCode),
    type = useTypeCode ? consts.dataTypeNames[field.type] : field.type;

  filterNull = filterNull || {};

  if (field.bin) {
    var bins = util.getbins(stats[field.name], field.bin.maxbins || schema.MAXBINS_DEFAULT);
    return (bins.stop - bins.start) / bins.step;
  }
  if (isType(field, T)) {
    var cardinality = time.cardinality(field, stats, filterNull, type);
    if(cardinality !== null) return cardinality;
    //otherwise use calculation below
  }
  if (field.aggr) {
    return 1;
  }

  // remove null
  var stat = stats[field.name];
  return stat.cardinality -
    (stat.numNulls > 0 && filterNull[type] ? 1 : 0);
};

},{"./compile/time":19,"./consts":20,"./schema/schema":25,"./util":27}],24:[function(require,module,exports){
(function (global){
'use strict';

// declare global constant
var g = global || window;

g.TABLE = 'table';
g.RAW = 'raw';
g.STACKED = 'stacked';
g.INDEX = 'index';

g.X = 'x';
g.Y = 'y';
g.ROW = 'row';
g.COL = 'col';
g.SIZE = 'size';
g.SHAPE = 'shape';
g.COLOR = 'color';
g.ALPHA = 'alpha';
g.TEXT = 'text';
g.DETAIL = 'detail';

g.O = 1;
g.Q = 2;
g.T = 4;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],25:[function(require,module,exports){
// Package of defining Vegalite Specification's json schema
"use strict";

var schema = module.exports = {},
  util = require('../util');

schema.util = require('./schemautil');

schema.marktype = {
  type: 'string',
  enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};

schema.aggr = {
  type: 'string',
  enum: ['avg', 'sum', 'min', 'max', 'count'],
  supportedEnums: {
    Q: ['avg', 'sum', 'min', 'max', 'count'],
    O: [],
    T: ['avg', 'min', 'max'],
    '': ['count']
  },
  supportedTypes: {'Q': true, 'O': true, 'T': true, '': true}
};
schema.band = {
  type: 'object',
  properties: {
    size: {
      type: 'integer',
      minimum: 0
    },
    padding: {
      type: 'integer',
      minimum: 0,
      default: 1
    }
  }
};

schema.getSupportedRole = function(encType) {
  return schema.schema.properties.enc.properties[encType].supportedRole;
};

schema.timefns = ['year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'];

schema.defaultTimeFn = 'month';

schema.fn = {
  type: 'string',
  enum: schema.timefns,
  supportedTypes: {'T': true}
};

//TODO(kanitw): add other type of function here

schema.scale_type = {
  type: 'string',
  enum: ['linear', 'log', 'pow', 'sqrt', 'quantile'],
  default: 'linear',
  supportedTypes: {'Q': true}
};

schema.field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

var clone = util.duplicate;
var merge = schema.util.merge;

schema.MAXBINS_DEFAULT = 15;

var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    maxbins: {
      type: 'integer',
      default: schema.MAXBINS_DEFAULT,
      minimum: 2
    }
  },
  supportedTypes: {'Q': true} // TODO: add 'O' after finishing #81
};

var typicalField = merge(clone(schema.field), {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['O', 'Q', 'T']
    },
    aggr: schema.aggr,
    fn: schema.fn,
    bin: bin,
    scale: {
      type: 'object',
      properties: {
        type: schema.scale_type,
        reverse: {
          type: 'boolean',
          default: false,
          supportedTypes: {'Q': true, 'T': true}
        },
        zero: {
          type: 'boolean',
          description: 'Include zero',
          default: true,
          supportedTypes: {'Q': true, 'T': true}
        },
        nice: {
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
          supportedTypes: {'T': true}
        }
      }
    }
  }
});

var onlyOrdinalField = merge(clone(schema.field), {
  type: 'object',
  supportedRole: {
    dimension: true
  },
  properties: {
    type: {
      type: 'string',
      enum: ['O','Q', 'T'] // ordinal-only field supports Q when bin is applied and T when fn is applied.
    },
    fn: schema.fn,
    bin: bin,
    aggr: {
      type: 'string',
      enum: ['count'],
      supportedTypes: {'O': true}
    }
  }
});

var axisMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: {
      type: 'object',
      properties: {
        grid: {
          type: 'boolean',
          default: true,
          description: 'A flag indicate if gridlines should be created in addition to ticks.'
        },
        title: {
          type: 'boolean',
          default: true,
          description: 'A title for the axis.'
        },
        titleOffset: {
          type: 'integer',
          default: undefined,  // auto
          description: 'A title offset value for the axis.'
        },
        format: {
          type: 'string',
          default: undefined,  // auto
          description: 'The formatting pattern for axis labels.'
        },
        maxLabelLength: {
          type: 'integer',
          default: 25,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var sortMixin = {
  type: 'object',
  properties: {
    sort: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        supportedTypes: {'O': true},
        required: ['name', 'aggr'],
        name: {
          type: 'string'
        },
        aggr: {
          type: 'string',
          enum: ['avg', 'sum', 'min', 'max', 'count']
        },
        reverse: {
          type: 'boolean',
          default: false
        }
      }
    }
  }
};

var bandMixin = {
  type: 'object',
  properties: {
    band: schema.band
  }
};

var legendMixin = {
  type: 'object',
  properties: {
    legend: {
      type: 'boolean',
      default: true
    }
  }
};

var textMixin = {
  type: 'object',
  supportedMarktypes: {'text': true},
  properties: {
    text: {
      type: 'object',
      properties: {
        align: {
          type: 'string',
          default: 'left'
        },
        baseline: {
          type: 'string',
          default: 'middle'
        },
        margin: {
          type: 'integer',
          default: 4,
          minimum: 0
        }
      }
    },
    font: {
      type: 'object',
      properties: {
        weight: {
          type: 'string',
          enum: ['normal', 'bold'],
          default: 'normal'
        },
        size: {
          type: 'integer',
          default: 10,
          minimum: 0
        },
        family: {
          type: 'string',
          default: 'Helvetica Neue'
        },
        style: {
          type: 'string',
          default: 'normal',
          enum: ['normal', 'italic']
        }
      }
    }
  }
};

var sizeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, bar: true, circle: true, square: true, text: true},
  properties: {
    value: {
      type: 'integer',
      default: 30,
      minimum: 0
    }
  }
};

var colorMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'string',
      role: 'color',
      default: 'steelblue'
    },
    scale: {
      type: 'object',
      properties: {
        range: {
          type: ['string', 'array']
        }
      }
    }
  }
};

var alphaMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'number',
      default: undefined,  // auto
      minimum: 0,
      maximum: 1
    }
  }
};

var shapeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, circle: true, square: true},
  properties: {
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle'
    }
  }
};

var detailMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true}
};

var rowMixin = {
  properties: {
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    grid: {
      type: 'boolean',
      default: true,
      description: 'A flag indicate if gridlines should be created in addition to ticks.'
    },
  }
};

var colMixin = {
  properties: {
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    axis: {
      properties: {
        maxLabelLength: {
          type: 'integer',
          default: 12,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var facetMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    padding: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.1
    }
  }
};

var requiredNameType = {
  required: ['name', 'type']
};

var multiRoleField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: true
  }
});

var quantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: 'ordinal-only' // using alpha / size to encoding category lead to order interpretation
  }
});

var onlyQuantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true
  }
});

var x = merge(clone(multiRoleField), axisMixin, bandMixin, requiredNameType, sortMixin);
var y = clone(x);

var facet = merge(clone(onlyOrdinalField), requiredNameType, facetMixin, sortMixin);
var row = merge(clone(facet), axisMixin, rowMixin);
var col = merge(clone(facet), axisMixin, colMixin);

var size = merge(clone(quantitativeField), legendMixin, sizeMixin, sortMixin);
var color = merge(clone(multiRoleField), legendMixin, colorMixin, sortMixin);
var alpha = merge(clone(quantitativeField), alphaMixin, sortMixin);
var shape = merge(clone(onlyOrdinalField), legendMixin, shapeMixin, sortMixin);
var detail = merge(clone(onlyOrdinalField), detailMixin, sortMixin);

// we only put aggregated measure in pivot table
var text = merge(clone(onlyQuantitativeField), textMixin, sortMixin);

// TODO add label

var filter = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      operands: {
        type: 'array',
        items: {
          type: ['string', 'boolean', 'integer', 'number']
        }
      },
      operator: {
        type: 'string',
        enum: ['>', '>=', '=', '!=', '<', '<=', 'notNull']
      }
    }
  }
};

var cfg = {
  type: 'object',
  properties: {
    // template
    width: {
      type: 'integer',
      default: undefined
    },
    height: {
      type: 'integer',
      default: undefined
    },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      default: undefined
    },
    gridColor: {
      type: 'string',
      role: 'color',
      default: '#eeeeee'
    },

    // filter null
    filterNull: {
      type: 'object',
      properties: {
        O: {type:'boolean', default: false},
        Q: {type:'boolean', default: true},
        T: {type:'boolean', default: true}
      }
    },
    toggleSort: {
      type: 'string',
      default: 'O'
    },

    // single plot
    singleHeight: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    singleWidth: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    // band size
    largeBandSize: {
      type: 'integer',
      default: 21,
      minimum: 0
    },
    smallBandSize: {
      //small multiples or single plot with high cardinality
      type: 'integer',
      default: 12,
      minimum: 0
    },
    largeBandMaxCardinality: {
      type: 'integer',
      default: 10
    },
    // small multiples
    cellPadding: {
      type: 'number',
      default: 0.1
    },
    cellGridColor: {
      type: 'string',
      role: 'color',
      default: '#aaaaaa'
    },
    cellBackgroundColor: {
      type: 'string',
      role: 'color',
      default: 'transparent'
    },
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },

    // marks
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },

    // scales
    timeScaleLabelLength: {
      type: 'integer',
      default: 3,
      minimum: 0
    },
    // other
    characterWidth: {
      type: 'integer',
      default: 6
    },

    // data source
    dataFormatType: {
      type: 'string',
      enum: ['json', 'csv'],
      default: 'json'
    },
    useVegaServer: {
      type: 'boolean',
      default: false
    },
    dataUrl: {
      type: 'string',
      default: undefined
    },
    vegaServerTable: {
      type: 'string',
      default: undefined
    },
    vegaServerUrl: {
      type: 'string',
      default: 'http://localhost:3001'
    }
  }
};

/** @type Object Schema of a vegalite specification */
schema.schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for vegalite specification',
  type: 'object',
  required: ['marktype', 'enc', 'cfg'],
  properties: {
    marktype: schema.marktype,
    enc: {
      type: 'object',
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        alpha: alpha,
        shape: shape,
        text: text,
        detail: detail
      }
    },
    filter: filter,
    cfg: cfg
  }
};

schema.encTypes = util.keys(schema.schema.properties.enc.properties);

/** Instantiate a verbose vl spec from the schema */
schema.instantiate = function() {
  return schema.util.instantiate(schema.schema);
};

},{"../util":27,"./schemautil":26}],26:[function(require,module,exports){
'use strict';

var schemautil = module.exports = {},
  util = require('../util');

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
};

schemautil.extend = function(instance, schema) {
  return schemautil.merge(schemautil.instantiate(schema), instance);
};

// instantiate a schema
schemautil.instantiate = function(schema) {
  var val;
  if (schema.type === 'object') {
    var instance = {};
    for (var name in schema.properties) {
      val = schemautil.instantiate(schema.properties[name]);
      if (val !== undefined) {
        instance[name] = val;
      }
    }
    return instance;
  } else if ('default' in schema) {
    val = schema.default;
    return util.isObject(val) ? util.duplicate(val) : val;
  } else if (schema.type === 'array') {
    return [];
  }
  return undefined;
};

// remove all defaults from an instance
schemautil.subtract = function(instance, defaults) {
  var changes = {};
  for (var prop in instance) {
    var def = defaults[prop];
    var ins = instance[prop];
    // Note: does not properly subtract arrays
    if (!defaults || def !== ins) {
      if (typeof ins === 'object' && !util.isArray(ins) && def) {
        var c = schemautil.subtract(ins, def);
        if (!isEmpty(c))
          changes[prop] = c;
      } else if (!util.isArray(ins) || ins.length > 0) {
        changes[prop] = ins;
      }
    }
  }
  return changes;
};

schemautil.merge = function(/*dest*, src0, src1, ...*/){
  var dest = arguments[0];
  for (var i=1 ; i<arguments.length; i++) {
    dest = merge(dest, arguments[i]);
  }
  return dest;
};

// recursively merges src into dest
function merge(dest, src) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (var p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = merge(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      merge(dest[p], src[p]);
    }
  }
  return dest;
}
},{"../util":27}],27:[function(require,module,exports){
'use strict';

var util = module.exports = {};

util.keys = function(obj) {
  var k = [], x;
  for (x in obj) k.push(x);
  return k;
};

util.vals = function(obj) {
  var v = [], x;
  for (x in obj) v.push(obj[x]);
  return v;
};

util.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step == Infinity) throw new Error('infinite range');
  var range = [], i = -1, j;
  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
  else while ((j = start + step * ++i) < stop) range.push(j);
  return range;
};

util.find = function(list, pattern) {
  var l = list.filter(function(x) {
    return x[pattern.name] === pattern.value;
  });
  return l.length && l[0] || null;
};

util.isin = function(item, array) {
  return array.indexOf(item) !== -1;
};

util.uniq = function(data, field) {
  var map = {}, count = 0, i, k;
  for (i = 0; i < data.length; ++i) {
    k = data[i][field];
    if (!map[k]) {
      map[k] = 1;
      count += 1;
    }
  }
  return count;
};

var isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

// try parsing to number
util.numbers = function(values) {
  var nums = [];
  for (var i = 0; i < values.length; i++) {
    if (isNumber(values[i])) {
      nums.push(+values[i]);
    }
  }
  return nums;
};

// try to parse as date
util.dates = function(values) {
  var dates = [];
  for (var i = 0; i < values.length; i++) {
    var date = Date.parse(values[i]);
    if (!isNaN(date)) {
      dates.push(new Date(date));
    }
  }
  return dates;
};

util.median = function(values) {
  values.sort(function(a, b) {return a - b;});
  var half = Math.floor(values.length/2);
  if (values.length % 2) {
    return values[half];
  } else {
    return (values[half-1] + values[half]) / 2.0;
  }
};

util.mean = function(values) {
  return values.reduce(function(v, r) {return v + r;}, 0) / values.length;
};

util.variance = function(values) {
  var avg = util.mean(values);
  var diffs = [];
  for (var i = 0; i < values.length; i++) {
    diffs.push(Math.pow((values[i] - avg), 2));
  }
  return util.mean(diffs);
};

util.stablesort = function(array, sortBy, keyFn) {
  var indices = {};

  array.forEach(function(v, i) {
    indices[keyFn(v)] = i;
  });

  array.sort(function(a, b) {
    var sa = sortBy(a),
      sb = sortBy(b);

    return sa<sb ? -1 : sa>sb ? 1 : (indices[keyFn(a)] - indices[keyFn(b)]);
  });
  return array;
};

util.stdev = function(values) {
  return Math.sqrt(util.variance(values));
};

util.skew = function(values) {
  var avg = util.mean(values),
    med = util.median(values),
    std = util.stdev(values);
  return 1.0 * (avg - med) / std;
};

// parses a string to date or number
util.parse = function(value) {
  if (isNumber(value)) {
    return +value;
  }

  var date = Date.parse(value);
  if (!isNaN(date)) {
    return (new Date(date));
  }
  return value;
};

util.minmax = function(data) {
  var stats = {min: +Infinity, max: -Infinity};
  for (var i = 0; i < data.length; ++i) {
    var v = data[i];
    if (v !== null) {
      if (v > stats.max || stats.max === -Infinity) stats.max = v;
      if (v < stats.min || stats.min === +Infinity) stats.min = v;
    }
  }
  return stats;
};

util.duplicate = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

util.isObject = function(obj) {
  return obj === Object(obj);
};

util.isArray = Array.isArray || function(obj) {
  return toString.call(obj) == '[object Array]';
};

util.array = function(x) {
  return x ? (util.isArray(x) ? x : [x]) : [];
};

util.forEach = function(obj, f, thisArg) {
  if (obj.forEach) {
    obj.forEach.call(thisArg, f);
  } else {
    for (var k in obj) {
      f.call(thisArg, obj[k], k , obj);
    }
  }
};

util.reduce = function(obj, f, init, thisArg) {
  if (obj.reduce) {
    return obj.reduce.call(thisArg, f, init);
  } else {
    for (var k in obj) {
      init = f.call(thisArg, init, obj[k], k, obj);
    }
    return init;
  }
};

util.map = function(obj, f, thisArg) {
  if (obj.map) {
    return obj.map.call(thisArg, f);
  } else {
    var output = [];
    for (var k in obj) {
      output.push( f.call(thisArg, obj[k], k, obj));
    }
  }
};

util.any = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (f(arr[k], k, i++)) return true;
  }
  return false;
};

util.all = function(arr, f) {
  var i = 0, k;
  for (k in arr) {
    if (!f(arr[k], k, i++)) return false;
  }
  return true;
};


util.cmp = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else if (a >= b) {
    return 0;
  } else if (a === null && b === null) {
    return 0;
  } else if (a === null) {
    return -1;
  } else if (b === null) {
    return 1;
  }
  return NaN;
};

var merge = function(dest, src) {
  return util.keys(src).reduce(function(c, k) {
    c[k] = src[k];
    return c;
  }, dest);
};

util.merge = function(/*dest*, src0, src1, ...*/){
  var dest = arguments[0];
  for (var i=1 ; i<arguments.length; i++) {
    dest = merge(dest, arguments[i]);
  }
  return dest;
};

util.getbins = function(stats, maxbins) {
  return util.bins({
    min: stats.min,
    max: stats.max,
    maxbins: maxbins
  });
};


util.bins = function(opt) {
  opt = opt || {};

  // determine range
  var maxb = opt.maxbins || 1024,
      base = opt.base || 10,
      div = opt.div || [5, 2],
      mins = opt.minstep || 0,
      logb = Math.log(base),
      level = Math.ceil(Math.log(maxb) / logb),
      min = opt.min,
      max = opt.max,
      span = max - min,
      step = Math.max(mins, Math.pow(base, Math.round(Math.log(span) / logb) - level)),
      nbins = Math.ceil(span / step),
      precision, v, i, eps;

  if (opt.step) {
    step = opt.step;
  } else if (opt.steps) {
    // if provided, limit choice to acceptable step sizes
    step = opt.steps[Math.min(
        opt.steps.length - 1,
        util_bisectLeft(opt.steps, span / maxb, 0, opt.steps.length)
    )];
  } else {
    // increase step size if too many bins
    do {
      step *= base;
      nbins = Math.ceil(span / step);
    } while (nbins > maxb);

    // decrease step size if allowed
    for (i = 0; i < div.length; ++i) {
      v = step / div[i];
      if (v >= mins && span / v <= maxb) {
        step = v;
        nbins = Math.ceil(span / step);
      }
    }
  }

  // update precision, min and max
  v = Math.log(step);
  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
  eps = (min<0 ? -1 : 1) * Math.pow(base, -precision - 1);
  min = Math.min(min, Math.floor(min / step + eps) * step);
  max = Math.ceil(max / step) * step;

  return {
    start: min,
    stop: max,
    step: step,
    unit: precision
  };
};

function util_bisectLeft(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
    else { hi = mid; }
  }
  return lo;
}

/**
 * x[p[0]]...[p[n]] = val
 * @param noaugment determine whether new object should be added f
 * or non-existing properties along the path
 */
util.setter = function(x, p, val, noaugment) {
  for (var i=0; i<p.length-1; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  x[p[i]] = val;
};


/**
 * returns x[p[0]]...[p[n]]
 * @param augment determine whether new object should be added f
 * or non-existing properties along the path
 */
util.getter = function(x, p, noaugment) {
  for (var i=0; i<p.length; ++i) {
    if (!noaugment && !(p[i] in x)){
      x = x[p[i]] = {};
    } else {
      x = x[p[i]];
    }
  }
  return x;
};

util.truncate = function(s, length, pos, word, ellipsis) {
  var len = s.length;
  if (len <= length) return s;
  ellipsis = ellipsis || "...";
  var l = Math.max(0, length - ellipsis.length);

  switch (pos) {
    case "left":
      return ellipsis + (word ? vg_truncateOnWord(s,l,1) : s.slice(len-l));
    case "middle":
    case "center":
      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
      return (word ? vg_truncateOnWord(s,l1) : s.slice(0,l1)) + ellipsis +
        (word ? vg_truncateOnWord(s,l2,1) : s.slice(len-l2));
    default:
      return (word ? vg_truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
  }
};

function vg_truncateOnWord(s, len, rev) {
  var cnt = 0, tok = s.split(vg_truncate_word_re);
  if (rev) {
    s = (tok = tok.reverse())
      .filter(function(w) { cnt += w.length; return cnt <= len; })
      .reverse();
  } else {
    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
  }
  return s.length ? s.join("").trim() : tok[0].slice(0, len);
}

var vg_truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;


util.error = function(msg) {
  console.error('[VL Error]', msg);
};


},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJzcmMvRW5jb2RpbmcuanMiLCJzcmMvY29tcGlsZS9hZ2dyZWdhdGVzLmpzIiwic3JjL2NvbXBpbGUvYXhpcy5qcyIsInNyYy9jb21waWxlL2Jpbm5pbmcuanMiLCJzcmMvY29tcGlsZS9jb21waWxlLmpzIiwic3JjL2NvbXBpbGUvZmFjZXRpbmcuanMiLCJzcmMvY29tcGlsZS9maWx0ZXIuanMiLCJzcmMvY29tcGlsZS9ncm91cC5qcyIsInNyYy9jb21waWxlL2xheW91dC5qcyIsInNyYy9jb21waWxlL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlL21hcmtzLmpzIiwic3JjL2NvbXBpbGUvc2NhbGUuanMiLCJzcmMvY29tcGlsZS9zb3J0LmpzIiwic3JjL2NvbXBpbGUvc3RhY2tpbmcuanMiLCJzcmMvY29tcGlsZS9zdHlsZS5qcyIsInNyYy9jb21waWxlL3N1YmZhY2V0aW5nLmpzIiwic3JjL2NvbXBpbGUvdGVtcGxhdGUuanMiLCJzcmMvY29tcGlsZS90aW1lLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2VuYy5qcyIsInNyYy9maWVsZC5qcyIsInNyYy9nbG9iYWxzLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpLFxuICAgIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgICBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpO1xuXG52YXIgdmwgPSB1dGlsLm1lcmdlKGNvbnN0cywgdXRpbCk7XG5cbnZsLkVuY29kaW5nID0gcmVxdWlyZSgnLi9FbmNvZGluZycpO1xudmwuY29tcGlsZSA9IHJlcXVpcmUoJy4vY29tcGlsZS9jb21waWxlJyk7XG52bC5kYXRhID0gcmVxdWlyZSgnLi9kYXRhJyk7XG52bC5maWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKTtcbnZsLmVuYyA9IHJlcXVpcmUoJy4vZW5jJyk7XG52bC5zY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHZsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4vZ2xvYmFscycpLFxuICBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyksXG4gIHZsZW5jID0gcmVxdWlyZSgnLi9lbmMnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpO1xuXG52YXIgRW5jb2RpbmcgPSBtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcblxuICBmdW5jdGlvbiBFbmNvZGluZyhtYXJrdHlwZSwgZW5jLCBjb25maWcsIGZpbHRlciwgdGhlbWUpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcblxuICAgIHZhciBzcGVjID0ge1xuICAgICAgbWFya3R5cGU6IG1hcmt0eXBlLFxuICAgICAgZW5jOiBlbmMsXG4gICAgICBjZmc6IGNvbmZpZyxcbiAgICAgIGZpbHRlcjogZmlsdGVyIHx8IFtdXG4gICAgfTtcblxuICAgIC8vIHR5cGUgdG8gYml0Y29kZVxuICAgIGZvciAodmFyIGUgaW4gZGVmYXVsdHMuZW5jKSB7XG4gICAgICBkZWZhdWx0cy5lbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZXNbZGVmYXVsdHMuZW5jW2VdLnR5cGVdO1xuICAgIH1cblxuICAgIHZhciBzcGVjRXh0ZW5kZWQgPSBzY2hlbWEudXRpbC5tZXJnZShkZWZhdWx0cywgdGhlbWUgfHwge30sIHNwZWMpIDtcblxuICAgIHRoaXMuX21hcmt0eXBlID0gc3BlY0V4dGVuZGVkLm1hcmt0eXBlO1xuICAgIHRoaXMuX2VuYyA9IHNwZWNFeHRlbmRlZC5lbmM7XG4gICAgdGhpcy5fY2ZnID0gc3BlY0V4dGVuZGVkLmNmZztcbiAgICB0aGlzLl9maWx0ZXIgPSBzcGVjRXh0ZW5kZWQuZmlsdGVyO1xuICB9XG5cbiAgdmFyIHByb3RvID0gRW5jb2RpbmcucHJvdG90eXBlO1xuXG4gIHByb3RvLm1hcmt0eXBlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmt0eXBlO1xuICB9O1xuXG4gIHByb3RvLmlzID0gZnVuY3Rpb24obSkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZSA9PT0gbTtcbiAgfTtcblxuICBwcm90by5oYXMgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgLy8gZXF1aXZhbGVudCB0byBjYWxsaW5nIHZsZW5jLmhhcyh0aGlzLl9lbmMsIGVuY1R5cGUpXG4gICAgcmV0dXJuIHRoaXMuX2VuY1tlbmNUeXBlXS5uYW1lICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgcHJvdG8uZW5jID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF07XG4gIH07XG5cbiAgcHJvdG8uZmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck51bGwgPSBbXSxcbiAgICAgIGZpZWxkcyA9IHRoaXMuZmllbGRzKCksXG4gICAgICBzZWxmID0gdGhpcztcblxuICAgIHV0aWwuZm9yRWFjaChmaWVsZHMsIGZ1bmN0aW9uKGZpZWxkTGlzdCwgZmllbGROYW1lKSB7XG4gICAgICBpZiAoZmllbGROYW1lID09PSAnKicpIHJldHVybjsgLy9jb3VudFxuXG4gICAgICBpZiAoKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuUSAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW1FdKSB8fFxuICAgICAgICAgIChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlQgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtUXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5PICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbT10pKSB7XG4gICAgICAgIGZpbHRlck51bGwucHVzaCh7XG4gICAgICAgICAgb3BlcmFuZHM6IFtmaWVsZE5hbWVdLFxuICAgICAgICAgIG9wZXJhdG9yOiAnbm90TnVsbCdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyTnVsbC5jb25jYXQodGhpcy5fZmlsdGVyKTtcbiAgfTtcblxuICAvLyBnZXQgXCJmaWVsZFwiIHByb3BlcnR5IGZvciB2ZWdhXG4gIHByb3RvLmZpZWxkID0gZnVuY3Rpb24oeCwgbm9kYXRhLCBub2ZuKSB7XG4gICAgaWYgKCF0aGlzLmhhcyh4KSkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgZiA9IChub2RhdGEgPyAnJyA6ICdkYXRhLicpO1xuXG4gICAgaWYgKHRoaXMuX2VuY1t4XS5hZ2dyID09PSAnY291bnQnKSB7XG4gICAgICByZXR1cm4gZiArICdjb3VudCc7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbeF0uYmluKSB7XG4gICAgICByZXR1cm4gZiArICdiaW5fJyArIHRoaXMuX2VuY1t4XS5uYW1lO1xuICAgIH0gZWxzZSBpZiAoIW5vZm4gJiYgdGhpcy5fZW5jW3hdLmFnZ3IpIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW3hdLmFnZ3IgKyAnXycgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9IGVsc2UgaWYgKCFub2ZuICYmIHRoaXMuX2VuY1t4XS5mbikge1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbeF0uZm4gKyAnXycgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGYgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdG8uZmllbGROYW1lID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgfTtcblxuICAvKlxuICAgKiByZXR1cm4ga2V5LXZhbHVlIHBhaXJzIG9mIGZpZWxkIG5hbWUgYW5kIGxpc3Qgb2YgZmllbGRzIG9mIHRoYXQgZmllbGQgbmFtZVxuICAgKi9cbiAgcHJvdG8uZmllbGRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZsZW5jLmZpZWxkcyh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIHByb3RvLmZpZWxkVGl0bGUgPSBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHZsZmllbGQuaXNDb3VudCh0aGlzLl9lbmNbeF0pKSB7XG4gICAgICByZXR1cm4gdmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZTtcbiAgICB9XG4gICAgdmFyIGZuID0gdGhpcy5fZW5jW3hdLmFnZ3IgfHwgdGhpcy5fZW5jW3hdLmZuIHx8ICh0aGlzLl9lbmNbeF0uYmluICYmIFwiYmluXCIpO1xuICAgIGlmIChmbikge1xuICAgICAgcmV0dXJuIGZuLnRvVXBwZXJDYXNlKCkgKyAnKCcgKyB0aGlzLl9lbmNbeF0ubmFtZSArICcpJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5uYW1lO1xuICAgIH1cbiAgfTtcblxuICBwcm90by5zY2FsZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLnNjYWxlIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmF4aXMgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5heGlzIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmQgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5iYW5kIHx8IHt9O1xuICB9O1xuXG4gIHByb3RvLmJhbmRTaXplID0gZnVuY3Rpb24oZW5jVHlwZSwgdXNlU21hbGxCYW5kKSB7XG4gICAgdXNlU21hbGxCYW5kID0gdXNlU21hbGxCYW5kIHx8XG4gICAgICAvL2lzQmFuZEluU21hbGxNdWx0aXBsZXNcbiAgICAgIChlbmNUeXBlID09PSBZICYmIHRoaXMuaGFzKFJPVykgJiYgdGhpcy5oYXMoWSkpIHx8XG4gICAgICAoZW5jVHlwZSA9PT0gWCAmJiB0aGlzLmhhcyhDT0wpICYmIHRoaXMuaGFzKFgpKTtcblxuICAgIC8vIGlmIGJhbmQuc2l6ZSBpcyBleHBsaWNpdGx5IHNwZWNpZmllZCwgZm9sbG93IHRoZSBzcGVjaWZpY2F0aW9uLCBvdGhlcndpc2UgZHJhdyB2YWx1ZSBmcm9tIGNvbmZpZy5cbiAgICByZXR1cm4gdGhpcy5iYW5kKGVuY1R5cGUpLnNpemUgfHxcbiAgICAgIHRoaXMuY29uZmlnKHVzZVNtYWxsQmFuZCA/ICdzbWFsbEJhbmRTaXplJyA6ICdsYXJnZUJhbmRTaXplJyk7XG4gIH07XG5cbiAgcHJvdG8uYWdnciA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmFnZ3I7XG4gIH07XG5cbiAgLy8gcmV0dXJucyBmYWxzZSBpZiBiaW5uaW5nIGlzIGRpc2FibGVkLCBvdGhlcndpc2UgYW4gb2JqZWN0IHdpdGggYmlubmluZyBwcm9wZXJ0aWVzXG4gIHByb3RvLmJpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgYmluID0gdGhpcy5fZW5jW3hdLmJpbjtcbiAgICBpZiAoYmluID09PSB7fSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYmluID09PSB0cnVlKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWF4Ymluczogc2NoZW1hLk1BWEJJTlNfREVGQVVMVFxuICAgICAgfTtcbiAgICByZXR1cm4gYmluO1xuICB9O1xuXG4gIHByb3RvLmxlZ2VuZCA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmxlZ2VuZDtcbiAgfTtcblxuICBwcm90by52YWx1ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLnZhbHVlO1xuICB9O1xuXG4gIHByb3RvLmZuID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uZm47XG4gIH07XG5cbiAgcHJvdG8uc29ydCA9IGZ1bmN0aW9uKGV0LCBzdGF0cykge1xuICAgIHZhciBzb3J0ID0gdGhpcy5fZW5jW2V0XS5zb3J0LFxuICAgICAgZW5jID0gdGhpcy5fZW5jLFxuICAgICAgaXNUeXBlID0gdmxmaWVsZC5pc1R5cGUuYnlDb2RlO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ3NvcnQ6Jywgc29ydCwgJ3N1cHBvcnQ6JywgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0KHtlbmM6dGhpcy5fZW5jfSwgc3RhdHMpICwgJ3RvZ2dsZTonLCB0aGlzLmNvbmZpZygndG9nZ2xlU29ydCcpKVxuXG4gICAgaWYgKCghc29ydCB8fCBzb3J0Lmxlbmd0aD09PTApICYmXG4gICAgICAgIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jOnRoaXMuX2VuY30sIHN0YXRzLCB0cnVlKSAmJiAvL0hBQ0tcbiAgICAgICAgdGhpcy5jb25maWcoJ3RvZ2dsZVNvcnQnKSA9PT0gJ1EnXG4gICAgICApIHtcbiAgICAgIHZhciBxRmllbGQgPSBpc1R5cGUoZW5jLngsIE8pID8gZW5jLnkgOiBlbmMueDtcblxuICAgICAgaWYgKGlzVHlwZShlbmNbZXRdLCBPKSkge1xuICAgICAgICBzb3J0ID0gW3tcbiAgICAgICAgICBuYW1lOiBxRmllbGQubmFtZSxcbiAgICAgICAgICBhZ2dyOiBxRmllbGQuYWdncixcbiAgICAgICAgICB0eXBlOiBxRmllbGQudHlwZSxcbiAgICAgICAgICByZXZlcnNlOiB0cnVlXG4gICAgICAgIH1dO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHNvcnQ7XG4gIH07XG5cbiAgcHJvdG8uYW55ID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB1dGlsLmFueSh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLmFsbCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdXRpbC5hbGwodGhpcy5fZW5jLCBmKTtcbiAgfTtcblxuICBwcm90by5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdXRpbC5rZXlzKHRoaXMuX2VuYykubGVuZ3RoO1xuICB9O1xuXG4gIHByb3RvLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgICByZXR1cm4gdmxlbmMubWFwKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8ucmVkdWNlID0gZnVuY3Rpb24oZiwgaW5pdCkge1xuICAgIHJldHVybiB2bGVuYy5yZWR1Y2UodGhpcy5fZW5jLCBmLCBpbml0KTtcbiAgfTtcblxuICBwcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5mb3JFYWNoKHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8udHlwZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHRoaXMuX2VuY1tldF0udHlwZSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8ucm9sZSA9IGZ1bmN0aW9uKGV0KSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGV0KSA/IHZsZmllbGQucm9sZSh0aGlzLl9lbmNbZXRdKSA6IG51bGw7XG4gIH07XG5cbiAgcHJvdG8udGV4dCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgdGV4dCA9IHRoaXMuX2VuY1tURVhUXS50ZXh0O1xuICAgIHJldHVybiBwcm9wID8gdGV4dFtwcm9wXSA6IHRleHQ7XG4gIH07XG5cbiAgcHJvdG8uZm9udCA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICB2YXIgZm9udCA9IHRoaXMuX2VuY1tURVhUXS5mb250O1xuICAgIHJldHVybiBwcm9wID8gZm9udFtwcm9wXSA6IGZvbnQ7XG4gIH07XG5cbiAgcHJvdG8uaXNUeXBlID0gZnVuY3Rpb24oeCwgdHlwZSkge1xuICAgIHZhciBmaWVsZCA9IHRoaXMuZW5jKHgpO1xuICAgIHJldHVybiBmaWVsZCAmJiBFbmNvZGluZy5pc1R5cGUoZmllbGQsIHR5cGUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzVHlwZSA9IGZ1bmN0aW9uIChmaWVsZERlZiwgdHlwZSkge1xuICAgIC8vIEZJWE1FIHZsZmllbGQuaXNUeXBlXG4gICAgcmV0dXJuIChmaWVsZERlZi50eXBlICYgdHlwZSkgPiAwO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc09yZGluYWxTY2FsZShlbmNvZGluZy5lbmMoZW5jVHlwZSksIHRydWUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc0RpbWVuc2lvbihlbmNvZGluZy5lbmMoZW5jVHlwZSksIHRydWUpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY29kaW5nLCBlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuaXNNZWFzdXJlKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhlbmNUeXBlKSAmJiBFbmNvZGluZy5pc0RpbWVuc2lvbih0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc01lYXN1cmUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzTWVhc3VyZSh0aGlzLCBlbmNUeXBlKTtcbiAgfTtcblxuICBwcm90by5pc0FnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZSh0aGlzLl9lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZShzcGVjLmVuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuYWx3YXlzTm9PY2NsdXNpb24gPSBmdW5jdGlvbihzcGVjLCBzdGF0cykge1xuICAgIC8vIEZJWE1FIHJhdyBPeFEgd2l0aCAjIG9mIHJvd3MgPSAjIG9mIE9cbiAgICByZXR1cm4gdmxlbmMuaXNBZ2dyZWdhdGUoc3BlYy5lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLmlzU3RhY2sgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgLy8gRklYTUUgdXBkYXRlIHRoaXMgb25jZSB3ZSBoYXZlIGNvbnRyb2wgZm9yIHN0YWNrIC4uLlxuICAgIHJldHVybiAoc3BlYy5tYXJrdHlwZSA9PT0gJ2JhcicgfHwgc3BlYy5tYXJrdHlwZSA9PT0gJ2FyZWEnKSAmJlxuICAgICAgc3BlYy5lbmMuY29sb3I7XG4gIH07XG5cbiAgcHJvdG8uaXNTdGFjayA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIEZJWE1FIHVwZGF0ZSB0aGlzIG9uY2Ugd2UgaGF2ZSBjb250cm9sIGZvciBzdGFjayAuLi5cbiAgICByZXR1cm4gKHRoaXMuaXMoJ2JhcicpIHx8IHRoaXMuaXMoJ2FyZWEnKSkgJiYgdGhpcy5oYXMoJ2NvbG9yJyk7XG4gIH07XG5cbiAgcHJvdG8uY2FyZGluYWxpdHkgPSBmdW5jdGlvbihlbmNUeXBlLCBzdGF0cykge1xuICAgIHJldHVybiB2bGZpZWxkLmNhcmRpbmFsaXR5KHRoaXMuZW5jKGVuY1R5cGUpLCBzdGF0cywgdGhpcy5jb25maWcoJ2ZpbHRlck51bGwnKSwgdHJ1ZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNSYXcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNBZ2dyZWdhdGUoKTtcbiAgfTtcblxuICBwcm90by5jb25maWcgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NmZ1tuYW1lXTtcbiAgfTtcblxuICBwcm90by50b1NwZWMgPSBmdW5jdGlvbihleGNsdWRlQ29uZmlnKSB7XG4gICAgdmFyIGVuYyA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2VuYyksXG4gICAgICBzcGVjO1xuXG4gICAgLy8gY29udmVydCB0eXBlJ3MgYml0Y29kZSB0byB0eXBlIG5hbWVcbiAgICBmb3IgKHZhciBlIGluIGVuYykge1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVOYW1lc1tlbmNbZV0udHlwZV07XG4gICAgfVxuXG4gICAgc3BlYyA9IHtcbiAgICAgIG1hcmt0eXBlOiB0aGlzLl9tYXJrdHlwZSxcbiAgICAgIGVuYzogZW5jLFxuICAgICAgZmlsdGVyOiB0aGlzLl9maWx0ZXJcbiAgICB9O1xuXG4gICAgaWYgKCFleGNsdWRlQ29uZmlnKSB7XG4gICAgICBzcGVjLmNmZyA9IHV0aWwuZHVwbGljYXRlKHRoaXMuX2NmZyk7XG4gICAgfVxuXG4gICAgLy8gcmVtb3ZlIGRlZmF1bHRzXG4gICAgdmFyIGRlZmF1bHRzID0gc2NoZW1hLmluc3RhbnRpYXRlKCk7XG4gICAgcmV0dXJuIHNjaGVtYS51dGlsLnN1YnRyYWN0KHNwZWMsIGRlZmF1bHRzKTtcbiAgfTtcblxuICBwcm90by50b1Nob3J0aGFuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyB0aGlzLl9tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc2hvcnRoYW5kID0gZnVuY3Rpb24gKHNwZWMpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gICAgcmV0dXJuICdtYXJrJyArIGMuYXNzaWduICsgc3BlYy5tYXJrdHlwZSArXG4gICAgICBjLmRlbGltICsgdmxlbmMuc2hvcnRoYW5kKHNwZWMuZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5wYXJzZVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgY2ZnKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICAgICAgICBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChjLmRlbGltKSxcbiAgICAgICAgbWFya3R5cGUgPSBzcGxpdC5zaGlmdCgpLnNwbGl0KGMuYXNzaWduKVsxXS50cmltKCksXG4gICAgICAgIGVuYyA9IHZsZW5jLnBhcnNlU2hvcnRoYW5kKHNwbGl0LCB0cnVlKTtcblxuICAgIHJldHVybiBuZXcgRW5jb2RpbmcobWFya3R5cGUsIGVuYywgY2ZnKTtcbiAgfTtcblxuICAvLyBGSVhNRSByZW1vdmUgdGhpcyAtLSBzaW1wbHkgdXNlIEVuY29kaW5nLnNob3J0aGFuZFxuICBFbmNvZGluZy5zaG9ydGhhbmRGcm9tU3BlYyA9IGZ1bmN0aW9uKC8qc3BlYywgdGhlbWUqLykge1xuICAgIHJldHVybiBFbmNvZGluZy5mcm9tU3BlYy5hcHBseShudWxsLCBhcmd1bWVudHMpLnRvU2hvcnRoYW5kKCk7XG4gIH07XG5cbiAgRW5jb2Rpbmcuc3BlY0Zyb21TaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGNmZywgZXhjbHVkZUNvbmZpZykge1xuICAgIHJldHVybiBFbmNvZGluZy5wYXJzZVNob3J0aGFuZChzaG9ydGhhbmQsIGNmZykudG9TcGVjKGV4Y2x1ZGVDb25maWcpO1xuICB9O1xuXG4gIEVuY29kaW5nLmZyb21TcGVjID0gZnVuY3Rpb24oc3BlYywgdGhlbWUpIHtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUoc3BlYy5lbmMgfHwge30pO1xuXG4gICAgLy9jb252ZXJ0IHR5cGUgZnJvbSBzdHJpbmcgdG8gYml0Y29kZSAoZS5nLCBPPTEpXG4gICAgZm9yICh2YXIgZSBpbiBlbmMpIHtcbiAgICAgIGVuY1tlXS50eXBlID0gY29uc3RzLmRhdGFUeXBlc1tlbmNbZV0udHlwZV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFbmNvZGluZyhzcGVjLm1hcmt0eXBlLCBlbmMsIHNwZWMuY2ZnLCBzcGVjLmZpbHRlciwgdGhlbWUpO1xuICB9O1xuXG4gIEVuY29kaW5nLnRyYW5zcG9zZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICB2YXIgb2xkZW5jID0gc3BlYy5lbmMsXG4gICAgICBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuYyk7XG4gICAgZW5jLnggPSBvbGRlbmMueTtcbiAgICBlbmMueSA9IG9sZGVuYy54O1xuICAgIGVuYy5yb3cgPSBvbGRlbmMuY29sO1xuICAgIGVuYy5jb2wgPSBvbGRlbmMucm93O1xuICAgIHNwZWMuZW5jID0gZW5jO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgc3BlYy5jZmcgPSBzcGVjLmNmZyB8fCB7fTtcbiAgICBzcGVjLmNmZy50b2dnbGVTb3J0ID0gc3BlYy5jZmcudG9nZ2xlU29ydCA9PT0gJ1EnID8gJ08nIDonUSc7XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cblxuICBFbmNvZGluZy50b2dnbGVTb3J0LmRpcmVjdGlvbiA9IGZ1bmN0aW9uKHNwZWMsIHVzZVR5cGVDb2RlKSB7XG4gICAgaWYgKCFFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoc3BlYywgdXNlVHlwZUNvZGUpKSB7IHJldHVybjsgfVxuICAgIHZhciBlbmMgPSBzcGVjLmVuYztcbiAgICByZXR1cm4gZW5jLngudHlwZSA9PT0gJ08nID8gJ3gnIDogICd5JztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0Lm1vZGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHNwZWMuY2ZnLnRvZ2dsZVNvcnQ7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydC5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMsIHVzZVR5cGVDb2RlKSB7XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jLFxuICAgICAgaXNUeXBlID0gdmxmaWVsZC5pc1R5cGUuZ2V0KHVzZVR5cGVDb2RlKTtcblxuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBST1cpIHx8IHZsZW5jLmhhcyhlbmMsIENPTCkgfHxcbiAgICAgICF2bGVuYy5oYXMoZW5jLCBYKSB8fCAhdmxlbmMuaGFzKGVuYywgWSkgfHxcbiAgICAgICFFbmNvZGluZy5hbHdheXNOb09jY2x1c2lvbihzcGVjLCBzdGF0cykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCBpc1R5cGUoZW5jLngsIE8pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy55LCB1c2VUeXBlQ29kZSkpID8gJ3gnIDpcbiAgICAgICggaXNUeXBlKGVuYy55LCBPKSAmJiB2bGZpZWxkLmlzTWVhc3VyZShlbmMueCwgdXNlVHlwZUNvZGUpKSA/ICd5JyA6IGZhbHNlO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZUZpbHRlck51bGxPID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHNwZWMuY2ZnID0gc3BlYy5jZmcgfHwge307XG4gICAgc3BlYy5jZmcuZmlsdGVyTnVsbCA9IHNwZWMuY2ZnLmZpbHRlck51bGwgfHwgeyAvL0ZJWE1FXG4gICAgICBUOiB0cnVlLFxuICAgICAgUTogdHJ1ZVxuICAgIH07XG4gICAgc3BlYy5jZmcuZmlsdGVyTnVsbC5PID0gIXNwZWMuY2ZnLmZpbHRlck51bGwuTztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVGaWx0ZXJOdWxsTy5zdXBwb3J0ID0gZnVuY3Rpb24oc3BlYywgc3RhdHMpIHtcbiAgICB2YXIgZmllbGRzID0gdmxlbmMuZmllbGRzKHNwZWMuZW5jKTtcbiAgICBmb3IgKHZhciBmaWVsZE5hbWUgaW4gZmllbGRzKSB7XG4gICAgICB2YXIgZmllbGRMaXN0ID0gZmllbGRzW2ZpZWxkTmFtZV07XG4gICAgICBpZiAoZmllbGRMaXN0LmNvbnRhaW5zVHlwZS5PICYmIGZpZWxkTmFtZSBpbiBzdGF0cyAmJiBzdGF0c1tmaWVsZE5hbWVdLm51bU51bGxzID4gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiBFbmNvZGluZztcbn0pKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFnZ3JlZ2F0ZXM7XG5cbmZ1bmN0aW9uIGFnZ3JlZ2F0ZXMoc3BlYywgZW5jb2RpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgdmFyIGRpbXMgPSB7fSwgbWVhcyA9IHt9LCBkZXRhaWwgPSB7fSwgZmFjZXRzID0ge30sXG4gICAgZGF0YSA9IHNwZWMuZGF0YVsxXTsgLy8gY3VycmVudGx5IGRhdGFbMF0gaXMgcmF3IGFuZCBkYXRhWzFdIGlzIHRhYmxlXG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBpZiAoZmllbGQuYWdnciA9PT0gJ2NvdW50Jykge1xuICAgICAgICBtZWFzLmNvdW50ID0ge29wOiAnY291bnQnLCBmaWVsZDogJyonfTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgbWVhc1tmaWVsZC5hZ2dyICsgJ3wnKyBmaWVsZC5uYW1lXSA9IHtcbiAgICAgICAgICBvcDogZmllbGQuYWdncixcbiAgICAgICAgICBmaWVsZDogJ2RhdGEuJysgZmllbGQubmFtZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBkaW1zW2ZpZWxkLm5hbWVdID0gZW5jb2RpbmcuZmllbGQoZW5jVHlwZSk7XG4gICAgICBpZiAoZW5jVHlwZSA9PSBST1cgfHwgZW5jVHlwZSA9PSBDT0wpIHtcbiAgICAgICAgZmFjZXRzW2ZpZWxkLm5hbWVdID0gZGltc1tmaWVsZC5uYW1lXTtcbiAgICAgIH1lbHNlIGlmIChlbmNUeXBlICE9PSBYICYmIGVuY1R5cGUgIT09IFkpIHtcbiAgICAgICAgZGV0YWlsW2ZpZWxkLm5hbWVdID0gZGltc1tmaWVsZC5uYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBkaW1zID0gdXRpbC52YWxzKGRpbXMpO1xuICBtZWFzID0gdXRpbC52YWxzKG1lYXMpO1xuXG4gIGlmIChtZWFzLmxlbmd0aCA+IDAgJiYgIW9wdC5wcmVhZ2dyZWdhdGVkRGF0YSkge1xuICAgIGlmICghZGF0YS50cmFuc2Zvcm0pIGRhdGEudHJhbnNmb3JtID0gW107XG4gICAgZGF0YS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGRpbXMsXG4gICAgICBmaWVsZHM6IG1lYXNcbiAgICB9KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGRldGFpbHM6IHV0aWwudmFscyhkZXRhaWwpLFxuICAgIGRpbXM6IGRpbXMsXG4gICAgZmFjZXRzOiB1dGlsLnZhbHMoZmFjZXRzKSxcbiAgICBhZ2dyZWdhdGVkOiBtZWFzLmxlbmd0aCA+IDBcbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBnZXR0ZXIgPSB1dGlsLmdldHRlcixcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgYXhpcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmF4aXMubmFtZXMgPSBmdW5jdGlvbihwcm9wcykge1xuICByZXR1cm4gdXRpbC5rZXlzKHV0aWwua2V5cyhwcm9wcykucmVkdWNlKGZ1bmN0aW9uKGEsIHgpIHtcbiAgICB2YXIgcyA9IHByb3BzW3hdLnNjYWxlO1xuICAgIGlmIChzID09PSBYIHx8IHMgPT09IFkpIGFbcHJvcHNbeF0uc2NhbGVdID0gMTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30pKTtcbn07XG5cbmF4aXMuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIHJldHVybiBuYW1lcy5yZWR1Y2UoZnVuY3Rpb24oYSwgbmFtZSkge1xuICAgIGEucHVzaChheGlzLmRlZihuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSk7XG4gICAgcmV0dXJuIGE7XG4gIH0sIFtdKTtcbn07XG5cbmF4aXMuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMsIG9wdCkge1xuICB2YXIgdHlwZSA9IG5hbWU7XG4gIHZhciBpc0NvbCA9IG5hbWUgPT0gQ09MLCBpc1JvdyA9IG5hbWUgPT0gUk9XO1xuICB2YXIgcm93T2Zmc2V0ID0gYXhpc1RpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIFkpICsgMjAsXG4gICAgY2VsbFBhZGRpbmcgPSBsYXlvdXQuY2VsbFBhZGRpbmc7XG5cblxuICBpZiAoaXNDb2wpIHR5cGUgPSAneCc7XG4gIGlmIChpc1JvdykgdHlwZSA9ICd5JztcblxuICB2YXIgZGVmID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgc2NhbGU6IG5hbWVcbiAgfTtcblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS5ncmlkKSB7XG4gICAgZGVmLmdyaWQgPSB0cnVlO1xuICAgIGRlZi5sYXllciA9IChpc1JvdyB8fCBpc0NvbCkgPyAnZnJvbnQnIDogICdiYWNrJztcblxuICAgIGlmIChpc0NvbCkge1xuICAgICAgLy8gc2V0IGdyaWQgcHJvcGVydHkgLS0gcHV0IHRoZSBsaW5lcyBvbiB0aGUgcmlnaHQgdGhlIGNlbGxcbiAgICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdncmlkJ10sIHtcbiAgICAgICAgeDoge1xuICAgICAgICAgIG9mZnNldDogbGF5b3V0LmNlbGxXaWR0aCAqICgxKyBjZWxsUGFkZGluZy8yLjApLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAnY29sJ1xuICAgICAgICB9LFxuICAgICAgICB5OiB7XG4gICAgICAgICAgdmFsdWU6IC1sYXlvdXQuY2VsbEhlaWdodCAqIChjZWxsUGFkZGluZy8yKSxcbiAgICAgICAgfSxcbiAgICAgICAgc3Ryb2tlOiB7IHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxHcmlkQ29sb3InKSB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzUm93KSB7XG4gICAgICAvLyBzZXQgZ3JpZCBwcm9wZXJ0eSAtLSBwdXQgdGhlIGxpbmVzIG9uIHRoZSB0b3BcbiAgICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdncmlkJ10sIHtcbiAgICAgICAgeToge1xuICAgICAgICAgIG9mZnNldDogLWxheW91dC5jZWxsSGVpZ2h0ICogKGNlbGxQYWRkaW5nLzIpLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIHNjYWxlOiAncm93J1xuICAgICAgICB9LFxuICAgICAgICB4OiB7XG4gICAgICAgICAgdmFsdWU6IHJvd09mZnNldFxuICAgICAgICB9LFxuICAgICAgICB4Mjoge1xuICAgICAgICAgIG9mZnNldDogcm93T2Zmc2V0ICsgKGxheW91dC5jZWxsV2lkdGggKiAwLjA1KSxcbiAgICAgICAgICAvLyBkZWZhdWx0IHZhbHVlKHMpIC0tIHZlZ2EgZG9lc24ndCBkbyByZWN1cnNpdmUgbWVyZ2VcbiAgICAgICAgICBncm91cDogXCJtYXJrLmdyb3VwLndpZHRoXCIsXG4gICAgICAgICAgbXVsdDogMVxuICAgICAgICB9LFxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnY2VsbEdyaWRDb2xvcicpIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnZ3JpZCcsICdzdHJva2UnXSwge1xuICAgICAgICB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdncmlkQ29sb3InKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGUpIHtcbiAgICBkZWYgPSBheGlzX3RpdGxlKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KTtcbiAgfVxuXG4gIGlmIChpc1JvdyB8fCBpc0NvbCkge1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICd0aWNrcyddLCB7XG4gICAgICBvcGFjaXR5OiB7dmFsdWU6IDB9XG4gICAgfSk7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ21ham9yVGlja3MnXSwge1xuICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgIH0pO1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdheGlzJ10sIHtcbiAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpc0NvbCkge1xuICAgIGRlZi5vcmllbnQgPSAndG9wJztcbiAgfVxuXG4gIGlmIChpc1Jvdykge1xuICAgIGRlZi5vZmZzZXQgPSByb3dPZmZzZXQ7XG4gIH1cblxuICBpZiAobmFtZSA9PSBYKSB7XG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSAmJiBlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSAmJiBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgPiAzMCkge1xuICAgICAgZGVmLm9yaWVudCA9ICd0b3AnO1xuICAgIH1cblxuICAgIGlmIChlbmNvZGluZy5pc0RpbWVuc2lvbihYKSB8fCBlbmNvZGluZy5pc1R5cGUoWCwgVCkpIHtcbiAgICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ2xhYmVscyddLCB7XG4gICAgICAgIGFuZ2xlOiB7dmFsdWU6IDI3MH0sXG4gICAgICAgIGFsaWduOiB7dmFsdWU6ICdyaWdodCd9LFxuICAgICAgICBiYXNlbGluZToge3ZhbHVlOiAnbWlkZGxlJ31cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7IC8vIFFcbiAgICAgIGRlZi50aWNrcyA9IDU7XG4gICAgfVxuICB9XG5cbiAgZGVmID0gYXhpc19sYWJlbHMoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBvcHQpO1xuXG4gIHJldHVybiBkZWY7XG59O1xuXG5mdW5jdGlvbiBheGlzX3RpdGxlKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KSB7XG4gIHZhciBtYXhsZW5ndGggPSBudWxsLFxuICAgIGZpZWxkVGl0bGUgPSBlbmNvZGluZy5maWVsZFRpdGxlKG5hbWUpO1xuICBpZiAobmFtZT09PVgpIHtcbiAgICBtYXhsZW5ndGggPSBsYXlvdXQuY2VsbFdpZHRoIC8gZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpO1xuICB9IGVsc2UgaWYgKG5hbWUgPT09IFkpIHtcbiAgICBtYXhsZW5ndGggPSBsYXlvdXQuY2VsbEhlaWdodCAvIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKTtcbiAgfVxuXG4gIGRlZi50aXRsZSA9IG1heGxlbmd0aCA/IHV0aWwudHJ1bmNhdGUoZmllbGRUaXRsZSwgbWF4bGVuZ3RoKSA6IGZpZWxkVGl0bGU7XG5cbiAgaWYgKG5hbWUgPT09IFJPVykge1xuICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsJ3RpdGxlJ10sIHtcbiAgICAgIGFuZ2xlOiB7dmFsdWU6IDB9LFxuICAgICAgYWxpZ246IHt2YWx1ZTogJ3JpZ2h0J30sXG4gICAgICBiYXNlbGluZToge3ZhbHVlOiAnbWlkZGxlJ30sXG4gICAgICBkeToge3ZhbHVlOiAoLWxheW91dC5oZWlnaHQvMikgLTIwfVxuICAgIH0pO1xuICB9XG5cbiAgZGVmLnRpdGxlT2Zmc2V0ID0gYXhpc1RpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIG5hbWUpO1xuICByZXR1cm4gZGVmO1xufVxuXG5mdW5jdGlvbiBheGlzX2xhYmVscyhkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCkge1xuICB2YXIgZm47XG4gIC8vIGFkZCBjdXN0b20gbGFiZWwgZm9yIHRpbWUgdHlwZVxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIChmbiA9IGVuY29kaW5nLmZuKG5hbWUpKSAmJiAodGltZS5oYXNTY2FsZShmbikpKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJywndGV4dCcsJ3NjYWxlJ10sICd0aW1lLScrIGZuKTtcbiAgfVxuXG4gIHZhciB0ZXh0VGVtcGxhdGVQYXRoID0gWydwcm9wZXJ0aWVzJywnbGFiZWxzJywndGV4dCcsJ3RlbXBsYXRlJ107XG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLmZvcm1hdCkge1xuICAgIGRlZi5mb3JtYXQgPSBlbmNvZGluZy5heGlzKG5hbWUpLmZvcm1hdDtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgUSkpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCBcInt7ZGF0YSB8IG51bWJlcjonLjNzJ319XCIpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAhZW5jb2RpbmcuZm4obmFtZSkpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCBcInt7ZGF0YSB8IHRpbWU6JyVZLSVtLSVkJ319XCIpO1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiBlbmNvZGluZy5mbihuYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgc2V0dGVyKGRlZiwgdGV4dFRlbXBsYXRlUGF0aCwgXCJ7e2RhdGEgfCBudW1iZXI6J2QnfX1cIik7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIE8pICYmIGVuY29kaW5nLmF4aXMobmFtZSkubWF4TGFiZWxMZW5ndGgpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCAne3tkYXRhIHwgdHJ1bmNhdGU6JyArIGVuY29kaW5nLmF4aXMobmFtZSkubWF4TGFiZWxMZW5ndGggKyAnfX0nKTtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGF4aXNUaXRsZU9mZnNldChlbmNvZGluZywgbGF5b3V0LCBuYW1lKSB7XG4gIHZhciB2YWx1ZSA9IGVuY29kaW5nLmF4aXMobmFtZSkudGl0bGVPZmZzZXQ7XG4gIGlmICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlIFJPVzogcmV0dXJuIDA7XG4gICAgY2FzZSBDT0w6IHJldHVybiAzNTtcbiAgfVxuICByZXR1cm4gZ2V0dGVyKGxheW91dCwgW25hbWUsICdheGlzVGl0bGVPZmZzZXQnXSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbm5pbmc7XG5cbmZ1bmN0aW9uIGJpbm5pbmcoc3BlYywgZW5jb2RpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHZhciBiaW5zID0ge307XG5cbiAgaWYgKG9wdC5wcmVhZ2dyZWdhdGVkRGF0YSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghc3BlYy50cmFuc2Zvcm0pIHNwZWMudHJhbnNmb3JtID0gW107XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIGlmIChlbmNvZGluZy5iaW4oZW5jVHlwZSkpIHtcbiAgICAgIHNwZWMudHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmluJyxcbiAgICAgICAgZmllbGQ6ICdkYXRhLicgKyBmaWVsZC5uYW1lLFxuICAgICAgICBvdXRwdXQ6ICdkYXRhLmJpbl8nICsgZmllbGQubmFtZSxcbiAgICAgICAgbWF4YmluczogZW5jb2RpbmcuYmluKGVuY1R5cGUpLm1heGJpbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGU7XG5cbnZhciB0ZW1wbGF0ZSA9IGNvbXBpbGUudGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlJyksXG4gIGF4aXMgPSBjb21waWxlLmF4aXMgPSByZXF1aXJlKCcuL2F4aXMnKSxcbiAgZmlsdGVyID0gY29tcGlsZS5maWx0ZXIgPSByZXF1aXJlKCcuL2ZpbHRlcicpLFxuICBsZWdlbmQgPSBjb21waWxlLmxlZ2VuZCA9IHJlcXVpcmUoJy4vbGVnZW5kJyksXG4gIG1hcmtzID0gY29tcGlsZS5tYXJrcyA9IHJlcXVpcmUoJy4vbWFya3MnKSxcbiAgc2NhbGUgPSBjb21waWxlLnNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpLFxuICB2bHNvcnQgPSBjb21waWxlLnNvcnQgPSByZXF1aXJlKCcuL3NvcnQnKSxcbiAgdmxzdHlsZSA9IGNvbXBpbGUuc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyksXG4gIHRpbWUgPSBjb21waWxlLnRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgYWdncmVnYXRlcyA9IGNvbXBpbGUuYWdncmVnYXRlcyA9IHJlcXVpcmUoJy4vYWdncmVnYXRlcycpLFxuICBiaW5uaW5nID0gY29tcGlsZS5iaW5uaW5nID0gcmVxdWlyZSgnLi9iaW5uaW5nJyksXG4gIGZhY2V0aW5nID0gY29tcGlsZS5mYWNldGluZyA9IHJlcXVpcmUoJy4vZmFjZXRpbmcnKSxcbiAgc3RhY2tpbmcgPSBjb21waWxlLnN0YWNraW5nID0gcmVxdWlyZSgnLi9zdGFja2luZycpLFxuICBzdWJmYWNldGluZyA9IGNvbXBpbGUuc3ViZmFjZXRpbmcgPSByZXF1aXJlKCcuL3N1YmZhY2V0aW5nJyk7XG5cbmNvbXBpbGUubGF5b3V0ID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcbmNvbXBpbGUuZ3JvdXAgPSByZXF1aXJlKCcuL2dyb3VwJyk7XG5cbmZ1bmN0aW9uIGNvbXBpbGUoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBsYXlvdXQgPSBjb21waWxlLmxheW91dChlbmNvZGluZywgc3RhdHMpLFxuICAgIHN0eWxlID0gdmxzdHlsZShlbmNvZGluZywgc3RhdHMpLFxuICAgIHNwZWMgPSB0ZW1wbGF0ZShlbmNvZGluZywgbGF5b3V0LCBzdGF0cyksXG4gICAgZ3JvdXAgPSBzcGVjLm1hcmtzWzBdLFxuICAgIG1hcmsgPSBtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXSxcbiAgICBtZGVmcyA9IG1hcmtzLmRlZihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSksXG4gICAgbWRlZiA9IG1kZWZzWzBdOyAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgZGlydHkgaGFjayBieSByZWZhY3RvcmluZyB0aGUgd2hvbGUgZmxvd1xuXG4gIGZpbHRlci5hZGRGaWx0ZXJzKHNwZWMsIGVuY29kaW5nKTtcbiAgdmFyIHNvcnRpbmcgPSB2bHNvcnQoc3BlYywgZW5jb2RpbmcsIHN0YXRzKTtcblxuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9IGVuY29kaW5nLmNvbmZpZygndXNlVmVnYVNlcnZlcicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbWRlZnMubGVuZ3RoOyBpKyspIHtcbiAgICBncm91cC5tYXJrcy5wdXNoKG1kZWZzW2ldKTtcbiAgfVxuXG4gIGJpbm5pbmcoc3BlYy5kYXRhWzFdLCBlbmNvZGluZywge3ByZWFnZ3JlZ2F0ZWREYXRhOiBwcmVhZ2dyZWdhdGVkRGF0YX0pO1xuXG4gIHZhciBsaW5lVHlwZSA9IG1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLmxpbmU7XG5cbiAgaWYgKCFwcmVhZ2dyZWdhdGVkRGF0YSkge1xuICAgIHNwZWMgPSB0aW1lKHNwZWMsIGVuY29kaW5nKTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBzdWJmYWNldHNcbiAgdmFyIGFnZ1Jlc3VsdCA9IGFnZ3JlZ2F0ZXMoc3BlYywgZW5jb2RpbmcsIHtwcmVhZ2dyZWdhdGVkRGF0YTogcHJlYWdncmVnYXRlZERhdGF9KSxcbiAgICBkZXRhaWxzID0gYWdnUmVzdWx0LmRldGFpbHMsXG4gICAgaGFzRGV0YWlscyA9IGRldGFpbHMgJiYgZGV0YWlscy5sZW5ndGggPiAwLFxuICAgIHN0YWNrID0gaGFzRGV0YWlscyAmJiBzdGFja2luZyhzcGVjLCBlbmNvZGluZywgbWRlZiwgYWdnUmVzdWx0LmZhY2V0cyk7XG5cbiAgaWYgKGhhc0RldGFpbHMgJiYgKHN0YWNrIHx8IGxpbmVUeXBlKSkge1xuICAgIC8vc3ViZmFjZXQgdG8gZ3JvdXAgc3RhY2sgLyBsaW5lIHRvZ2V0aGVyIGluIG9uZSBncm91cFxuICAgIHN1YmZhY2V0aW5nKGdyb3VwLCBtZGVmLCBkZXRhaWxzLCBzdGFjaywgZW5jb2RpbmcpO1xuICB9XG5cbiAgLy8gYXV0by1zb3J0IGxpbmUvYXJlYSB2YWx1ZXNcbiAgLy9UT0RPKGthbml0dyk6IGhhdmUgc29tZSBjb25maWcgdG8gdHVybiBvZmYgYXV0by1zb3J0IGZvciBsaW5lIChmb3IgbGluZSBjaGFydCB0aGF0IGVuY29kZXMgdGVtcG9yYWwgaW5mb3JtYXRpb24pXG4gIGlmIChsaW5lVHlwZSkge1xuICAgIHZhciBmID0gKGVuY29kaW5nLmlzTWVhc3VyZShYKSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSkgPyBZIDogWDtcbiAgICBpZiAoIW1kZWYuZnJvbSkgbWRlZi5mcm9tID0ge307XG4gICAgLy8gVE9ETzogd2h5IC0gP1xuICAgIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe3R5cGU6ICdzb3J0JywgYnk6ICctJyArIGVuY29kaW5nLmZpZWxkKGYpfV07XG4gIH1cblxuICAvLyBTbWFsbCBNdWx0aXBsZXNcbiAgaWYgKGhhc1JvdyB8fCBoYXNDb2wpIHtcbiAgICBzcGVjID0gZmFjZXRpbmcoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpO1xuICAgIHNwZWMubGVnZW5kcyA9IGxlZ2VuZC5kZWZzKGVuY29kaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBncm91cC5zY2FsZXMgPSBzY2FsZS5kZWZzKHNjYWxlLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc29ydGluZyxcbiAgICAgIHtzdGFjazogc3RhY2ssIHN0YXRzOiBzdGF0c30pO1xuICAgIGdyb3VwLmF4ZXMgPSBheGlzLmRlZnMoYXhpcy5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpO1xuICAgIGdyb3VwLmxlZ2VuZHMgPSBsZWdlbmQuZGVmcyhlbmNvZGluZyk7XG4gIH1cblxuICBmaWx0ZXIuZmlsdGVyTGVzc1RoYW5aZXJvKHNwZWMsIGVuY29kaW5nKTtcblxuICByZXR1cm4gc3BlYztcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGF4aXMgPSByZXF1aXJlKCcuL2F4aXMnKSxcbiAgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmLFxuICBzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWNldGluZztcblxuZnVuY3Rpb24gZmFjZXRpbmcoZ3JvdXAsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLCBzcGVjLCBtZGVmLCBzdGFjaywgc3RhdHMpIHtcbiAgdmFyIGVudGVyID0gZ3JvdXAucHJvcGVydGllcy5lbnRlcjtcbiAgdmFyIGZhY2V0S2V5cyA9IFtdLCBjZWxsQXhlcyA9IFtdLCBmcm9tLCBheGVzR3JwO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgZW50ZXIuZmlsbCA9IHt2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsQmFja2dyb3VuZENvbG9yJyl9O1xuXG4gIC8vbW92ZSBcImZyb21cIiB0byBjZWxsIGxldmVsIGFuZCBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIGdyb3VwLmZyb20gPSB7ZGF0YTogZ3JvdXAubWFya3NbMF0uZnJvbS5kYXRhfTtcblxuICAvLyBIYWNrLCB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBncm91cC5tYXJrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBtYXJrID0gZ3JvdXAubWFya3NbaV07XG4gICAgaWYgKG1hcmsuZnJvbS50cmFuc2Zvcm0pIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb20uZGF0YTsgLy9uZWVkIHRvIGtlZXAgdHJhbnNmb3JtIGZvciBzdWJmYWNldHRpbmcgY2FzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgbWFyay5mcm9tO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNSb3cpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKFJPVykpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ1JvdyBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueSA9IHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLmhlaWdodCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbEhlaWdodH07IC8vIEhBQ0tcblxuICAgIGZhY2V0S2V5cy5wdXNoKGVuY29kaW5nLmZpZWxkKFJPVykpO1xuXG4gICAgaWYgKGhhc0NvbCkge1xuICAgICAgZnJvbSA9IHV0aWwuZHVwbGljYXRlKGdyb3VwLmZyb20pO1xuICAgICAgZnJvbS50cmFuc2Zvcm0gPSBmcm9tLnRyYW5zZm9ybSB8fCBbXTtcbiAgICAgIGZyb20udHJhbnNmb3JtLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IFtlbmNvZGluZy5maWVsZChDT0wpXX0pO1xuICAgIH1cblxuICAgIGF4ZXNHcnAgPSBncm91cGRlZigneC1heGVzJywge1xuICAgICAgICBheGVzOiBlbmNvZGluZy5oYXMoWCkgPyBheGlzLmRlZnMoWyd4J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgeDogaGFzQ29sID8ge3NjYWxlOiBDT0wsIGZpZWxkOiAna2V5cy4wJ30gOiB7dmFsdWU6IDB9LFxuICAgICAgICB3aWR0aDogaGFzQ29sICYmIHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofSwgLy9IQUNLP1xuICAgICAgICBmcm9tOiBmcm9tXG4gICAgICB9KTtcblxuICAgIHNwZWMubWFya3MudW5zaGlmdChheGVzR3JwKTsgLy8gbmVlZCB0byBwcmVwZW5kIHNvIGl0IGFwcGVhcnMgdW5kZXIgdGhlIHBsb3RzXG4gICAgKHNwZWMuYXhlcyA9IHNwZWMuYXhlcyB8fCBbXSk7XG4gICAgc3BlYy5heGVzLnB1c2guYXBwbHkoc3BlYy5heGVzLCBheGlzLmRlZnMoWydyb3cnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgfSBlbHNlIHsgLy8gZG9lc24ndCBoYXZlIHJvd1xuICAgIGlmIChlbmNvZGluZy5oYXMoWCkpIHtcbiAgICAgIC8va2VlcCB4IGF4aXMgaW4gdGhlIGNlbGxcbiAgICAgIGNlbGxBeGVzLnB1c2guYXBwbHkoY2VsbEF4ZXMsIGF4aXMuZGVmcyhbJ3gnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzQ29sKSB7XG4gICAgaWYgKCFlbmNvZGluZy5pc0RpbWVuc2lvbihDT0wpKSB7XG4gICAgICB1dGlsLmVycm9yKCdDb2wgZW5jb2Rpbmcgc2hvdWxkIGJlIG9yZGluYWwuJyk7XG4gICAgfVxuICAgIGVudGVyLnggPSB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLicgKyBmYWNldEtleXMubGVuZ3RofTtcbiAgICBlbnRlci53aWR0aCA9IHsndmFsdWUnOiBsYXlvdXQuY2VsbFdpZHRofTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoQ09MKSk7XG5cbiAgICBpZiAoaGFzUm93KSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkKFJPVyldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd5LWF4ZXMnLCB7XG4gICAgICBheGVzOiBlbmNvZGluZy5oYXMoWSkgPyBheGlzLmRlZnMoWyd5J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSA6IHVuZGVmaW5lZCxcbiAgICAgIHk6IGhhc1JvdyAmJiB7c2NhbGU6IFJPVywgZmllbGQ6ICdrZXlzLjAnfSxcbiAgICAgIHg6IGhhc1JvdyAmJiB7dmFsdWU6IDB9LFxuICAgICAgaGVpZ2h0OiBoYXNSb3cgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fSwgLy9IQUNLP1xuICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbJ2NvbCddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgY29sXG4gICAgaWYgKGVuY29kaW5nLmhhcyhZKSkge1xuICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFsneSddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFzc3VtaW5nIGVxdWFsIGNlbGxXaWR0aCBoZXJlXG4gIC8vIFRPRE86IHN1cHBvcnQgaGV0ZXJvZ2Vub3VzIGNlbGxXaWR0aCAobWF5YmUgYnkgdXNpbmcgbXVsdGlwbGUgc2NhbGVzPylcbiAgc3BlYy5zY2FsZXMgPSAoc3BlYy5zY2FsZXMgfHwgW10pLmNvbmNhdChzY2FsZS5kZWZzKFxuICAgIHNjYWxlLm5hbWVzKGVudGVyKS5jb25jYXQoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSkpLFxuICAgIGVuY29kaW5nLFxuICAgIGxheW91dCxcbiAgICBzdHlsZSxcbiAgICBzb3J0aW5nLFxuICAgIHtzdGFjazogc3RhY2ssIGZhY2V0OiB0cnVlLCBzdGF0czogc3RhdHN9XG4gICkpOyAvLyByb3cvY29sIHNjYWxlcyArIGNlbGwgc2NhbGVzXG5cbiAgaWYgKGNlbGxBeGVzLmxlbmd0aCA+IDApIHtcbiAgICBncm91cC5heGVzID0gY2VsbEF4ZXM7XG4gIH1cblxuICAvLyBhZGQgZmFjZXQgdHJhbnNmb3JtXG4gIHZhciB0cmFucyA9IChncm91cC5mcm9tLnRyYW5zZm9ybSB8fCAoZ3JvdXAuZnJvbS50cmFuc2Zvcm0gPSBbXSkpO1xuICB0cmFucy51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBmYWNldEtleXN9KTtcblxuICByZXR1cm4gc3BlYztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBmaWx0ZXIgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG52YXIgQklOQVJZID0ge1xuICAnPic6ICB0cnVlLFxuICAnPj0nOiB0cnVlLFxuICAnPSc6ICB0cnVlLFxuICAnIT0nOiB0cnVlLFxuICAnPCc6ICB0cnVlLFxuICAnPD0nOiB0cnVlXG59O1xuXG5maWx0ZXIuYWRkRmlsdGVycyA9IGZ1bmN0aW9uKHNwZWMsIGVuY29kaW5nKSB7XG4gIHZhciBmaWx0ZXJzID0gZW5jb2RpbmcuZmlsdGVyKCksXG4gICAgZGF0YSA9IHNwZWMuZGF0YVswXTsgIC8vIGFwcGx5IGZpbHRlcnMgdG8gcmF3IGRhdGEgYmVmb3JlIGFnZ3JlZ2F0aW9uXG5cbiAgaWYgKCFkYXRhLnRyYW5zZm9ybSlcbiAgICBkYXRhLnRyYW5zZm9ybSA9IFtdO1xuXG4gIC8vIGFkZCBjdXN0b20gZmlsdGVyc1xuICBmb3IgKHZhciBpIGluIGZpbHRlcnMpIHtcbiAgICB2YXIgZmlsdGVyID0gZmlsdGVyc1tpXTtcblxuICAgIHZhciBjb25kaXRpb24gPSAnJztcbiAgICB2YXIgb3BlcmF0b3IgPSBmaWx0ZXIub3BlcmF0b3I7XG4gICAgdmFyIG9wZXJhbmRzID0gZmlsdGVyLm9wZXJhbmRzO1xuXG4gICAgaWYgKEJJTkFSWVtvcGVyYXRvcl0pIHtcbiAgICAgIC8vIGV4cGVjdHMgYSBmaWVsZCBhbmQgYSB2YWx1ZVxuICAgICAgaWYgKG9wZXJhdG9yID09PSAnPScpIHtcbiAgICAgICAgb3BlcmF0b3IgPSAnPT0nO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3AxID0gb3BlcmFuZHNbMF07XG4gICAgICB2YXIgb3AyID0gb3BlcmFuZHNbMV07XG4gICAgICBjb25kaXRpb24gPSAnZC5kYXRhLicgKyBvcDEgKyBvcGVyYXRvciArIG9wMjtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdG9yID09PSAnbm90TnVsbCcpIHtcbiAgICAgIC8vIGV4cGVjdHMgYSBudW1iZXIgb2YgZmllbGRzXG4gICAgICBmb3IgKHZhciBqIGluIG9wZXJhbmRzKSB7XG4gICAgICAgIGNvbmRpdGlvbiArPSAnZC5kYXRhLicgKyBvcGVyYW5kc1tqXSArICchPT1udWxsJztcbiAgICAgICAgaWYgKGogPCBvcGVyYW5kcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgY29uZGl0aW9uICs9ICcgJiYgJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1Vuc3VwcG9ydGVkIG9wZXJhdG9yOiAnLCBvcGVyYXRvcik7XG4gICAgfVxuXG4gICAgZGF0YS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgIHRlc3Q6IGNvbmRpdGlvblxuICAgIH0pO1xuICB9XG59O1xuXG4vLyByZW1vdmUgbGVzcyB0aGFuIDAgdmFsdWVzIGlmIHdlIHVzZSBsb2cgZnVuY3Rpb25cbmZpbHRlci5maWx0ZXJMZXNzVGhhblplcm8gPSBmdW5jdGlvbihzcGVjLCBlbmNvZGluZykge1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGVuY29kaW5nLnNjYWxlKGVuY1R5cGUpLnR5cGUgPT09ICdsb2cnKSB7XG4gICAgICBzcGVjLmRhdGFbMV0udHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnZmlsdGVyJyxcbiAgICAgICAgdGVzdDogJ2QuJyArIGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpICsgJz4wJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlZjogZ3JvdXBkZWZcbn07XG5cbmZ1bmN0aW9uIGdyb3VwZGVmKG5hbWUsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG4gIHJldHVybiB7XG4gICAgX25hbWU6IG5hbWUgfHwgdW5kZWZpbmVkLFxuICAgIHR5cGU6ICdncm91cCcsXG4gICAgZnJvbTogb3B0LmZyb20sXG4gICAgcHJvcGVydGllczoge1xuICAgICAgZW50ZXI6IHtcbiAgICAgICAgeDogb3B0LnggfHwgdW5kZWZpbmVkLFxuICAgICAgICB5OiBvcHQueSB8fCB1bmRlZmluZWQsXG4gICAgICAgIHdpZHRoOiBvcHQud2lkdGggfHwge2dyb3VwOiAnd2lkdGgnfSxcbiAgICAgICAgaGVpZ2h0OiBvcHQuaGVpZ2h0IHx8IHtncm91cDogJ2hlaWdodCd9XG4gICAgICB9XG4gICAgfSxcbiAgICBzY2FsZXM6IG9wdC5zY2FsZXMgfHwgdW5kZWZpbmVkLFxuICAgIGF4ZXM6IG9wdC5heGVzIHx8IHVuZGVmaW5lZCxcbiAgICBtYXJrczogb3B0Lm1hcmtzIHx8IFtdXG4gIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICBzZXR0ZXIgPSB1dGlsLnNldHRlcixcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi4vc2NoZW1hL3NjaGVtYScpLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZsbGF5b3V0O1xuXG5mdW5jdGlvbiB2bGxheW91dChlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGxheW91dCA9IGJveChlbmNvZGluZywgc3RhdHMpO1xuICBsYXlvdXQgPSBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpO1xuICByZXR1cm4gbGF5b3V0O1xufVxuXG4vKlxuICBIQUNLIHRvIHNldCBjaGFydCBzaXplXG4gIE5PVEU6IHRoaXMgZmFpbHMgZm9yIHBsb3RzIGRyaXZlbiBieSBkZXJpdmVkIHZhbHVlcyAoZS5nLiwgYWdncmVnYXRlcylcbiAgT25lIHNvbHV0aW9uIGlzIHRvIHVwZGF0ZSBWZWdhIHRvIHN1cHBvcnQgYXV0by1zaXppbmdcbiAgSW4gdGhlIG1lYW50aW1lLCBhdXRvLXBhZGRpbmcgKG1vc3RseSkgZG9lcyB0aGUgdHJpY2tcbiAqL1xuZnVuY3Rpb24gYm94KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgaGFzUm93ID0gZW5jb2RpbmcuaGFzKFJPVyksXG4gICAgICBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKSxcbiAgICAgIGhhc1ggPSBlbmNvZGluZy5oYXMoWCksXG4gICAgICBoYXNZID0gZW5jb2RpbmcuaGFzKFkpLFxuICAgICAgbWFya3R5cGUgPSBlbmNvZGluZy5tYXJrdHlwZSgpO1xuXG4gIC8vIEZJWE1FL0hBQ0sgd2UgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcbiAgdmFyIHhDYXJkaW5hbGl0eSA9IGhhc1ggJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWCkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShYLCBzdGF0cykgOiAxLFxuICAgIHlDYXJkaW5hbGl0eSA9IGhhc1kgJiYgZW5jb2RpbmcuaXNEaW1lbnNpb24oWSkgPyBlbmNvZGluZy5jYXJkaW5hbGl0eShZLCBzdGF0cykgOiAxO1xuXG4gIHZhciB1c2VTbWFsbEJhbmQgPSB4Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5JykgfHxcbiAgICB5Q2FyZGluYWxpdHkgPiBlbmNvZGluZy5jb25maWcoJ2xhcmdlQmFuZE1heENhcmRpbmFsaXR5Jyk7XG5cbiAgdmFyIGNlbGxXaWR0aCwgY2VsbEhlaWdodCwgY2VsbFBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG5cbiAgLy8gc2V0IGNlbGxXaWR0aFxuICBpZiAoaGFzWCkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShYKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxXaWR0aCA9ICh4Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5iYW5kKFgpLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWCwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbFdpZHRoID0gaGFzQ29sIHx8IGhhc1JvdyA/IGVuY29kaW5nLmVuYyhDT0wpLndpZHRoIDogIGVuY29kaW5nLmNvbmZpZyhcInNpbmdsZVdpZHRoXCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAobWFya3R5cGUgPT09IFRFWFQpIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmNvbmZpZygndGV4dENlbGxXaWR0aCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYKTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgY2VsbEhlaWdodFxuICBpZiAoaGFzWSkge1xuICAgIGlmIChlbmNvZGluZy5pc09yZGluYWxTY2FsZShZKSkge1xuICAgICAgLy8gZm9yIG9yZGluYWwsIGhhc0NvbCBvciBub3QgZG9lc24ndCBtYXR0ZXIgLS0gd2Ugc2NhbGUgYmFzZWQgb24gY2FyZGluYWxpdHlcbiAgICAgIGNlbGxIZWlnaHQgPSAoeUNhcmRpbmFsaXR5ICsgZW5jb2RpbmcuYmFuZChZKS5wYWRkaW5nKSAqIGVuY29kaW5nLmJhbmRTaXplKFksIHVzZVNtYWxsQmFuZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxIZWlnaHQgPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZW5jKFJPVykuaGVpZ2h0IDogIGVuY29kaW5nLmNvbmZpZyhcInNpbmdsZUhlaWdodFwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY2VsbEhlaWdodCA9IGVuY29kaW5nLmJhbmRTaXplKFkpO1xuICB9XG5cbiAgLy8gQ2VsbCBiYW5kcyB1c2UgcmFuZ2VCYW5kcygpLiBUaGVyZSBhcmUgbi0xIHBhZGRpbmcuICBPdXRlcnBhZGRpbmcgPSAwIGZvciBjZWxsc1xuXG4gIHZhciB3aWR0aCA9IGNlbGxXaWR0aCwgaGVpZ2h0ID0gY2VsbEhlaWdodDtcbiAgaWYgKGhhc0NvbCkge1xuICAgIHZhciBjb2xDYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTCwgc3RhdHMpO1xuICAgIHdpZHRoID0gY2VsbFdpZHRoICogKCgxICsgY2VsbFBhZGRpbmcpICogKGNvbENhcmRpbmFsaXR5IC0gMSkgKyAxKTtcbiAgfVxuICBpZiAoaGFzUm93KSB7XG4gICAgdmFyIHJvd0NhcmRpbmFsaXR5ID0gIGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIGhlaWdodCA9IGNlbGxIZWlnaHQgKiAoKDEgKyBjZWxsUGFkZGluZykgKiAocm93Q2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSB3aG9sZSBjZWxsXG4gICAgY2VsbFdpZHRoOiBjZWxsV2lkdGgsXG4gICAgY2VsbEhlaWdodDogY2VsbEhlaWdodCxcbiAgICBjZWxsUGFkZGluZzogY2VsbFBhZGRpbmcsXG4gICAgLy8gd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgLy8gaW5mb3JtYXRpb24gYWJvdXQgeCBhbmQgeSwgc3VjaCBhcyBiYW5kIHNpemVcbiAgICB4OiB7dXNlU21hbGxCYW5kOiB1c2VTbWFsbEJhbmR9LFxuICAgIHk6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gb2Zmc2V0KGVuY29kaW5nLCBzdGF0cywgbGF5b3V0KSB7XG4gIFtYLCBZXS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgdmFyIG1heExlbmd0aDtcbiAgICBpZiAoZW5jb2RpbmcuaXNEaW1lbnNpb24oeCkgfHwgZW5jb2RpbmcuaXNUeXBlKHgsIFQpKSB7XG4gICAgICBtYXhMZW5ndGggPSBzdGF0c1tlbmNvZGluZy5maWVsZE5hbWUoeCldLm1heGxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKGVuY29kaW5nLmFnZ3IoeCkgPT09ICdjb3VudCcpIHtcbiAgICAgIC8vYXNzaWduIGRlZmF1bHQgdmFsdWUgZm9yIGNvdW50IGFzIGl0IHdvbid0IGhhdmUgc3RhdHNcbiAgICAgIG1heExlbmd0aCA9ICAzO1xuICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKHgsIFEpKSB7XG4gICAgICBpZiAoeD09PVgpIHtcbiAgICAgICAgbWF4TGVuZ3RoID0gMztcbiAgICAgIH0gZWxzZSB7IC8vIFlcbiAgICAgICAgLy9hc3N1bWUgdGhhdCBkZWZhdWx0IGZvcm1hdGluZyBpcyBhbHdheXMgc2hvcnRlciB0aGFuIDdcbiAgICAgICAgbWF4TGVuZ3RoID0gTWF0aC5taW4oc3RhdHNbZW5jb2RpbmcuZmllbGROYW1lKHgpXS5tYXhsZW5ndGgsIDcpO1xuICAgICAgfVxuICAgIH1cbiAgICBzZXR0ZXIobGF5b3V0LFt4LCAnYXhpc1RpdGxlT2Zmc2V0J10sIGVuY29kaW5nLmNvbmZpZygnY2hhcmFjdGVyV2lkdGgnKSAqICBtYXhMZW5ndGggKyAyMCk7XG4gIH0pO1xuICByZXR1cm4gbGF5b3V0O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBsZWdlbmQgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5sZWdlbmQuZGVmcyA9IGZ1bmN0aW9uKGVuY29kaW5nKSB7XG4gIHZhciBkZWZzID0gW107XG5cbiAgLy8gVE9ETzogc3VwcG9ydCBhbHBoYVxuXG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmxlZ2VuZChDT0xPUikpIHtcbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihDT0xPUiwgZW5jb2RpbmcsIHtcbiAgICAgIGZpbGw6IENPTE9SLFxuICAgICAgb3JpZW50OiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSVpFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0laRSkpIHtcbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihTSVpFLCBlbmNvZGluZywge1xuICAgICAgc2l6ZTogU0laRSxcbiAgICAgIG9yaWVudDogZGVmcy5sZW5ndGggPT09IDEgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmhhcyhTSEFQRSkgJiYgZW5jb2RpbmcubGVnZW5kKFNIQVBFKSkge1xuICAgIGlmIChkZWZzLmxlbmd0aCA9PT0gMikge1xuICAgICAgLy8gVE9ETzogZml4IHRoaXNcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1ZlZ2FsaXRlIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIHR3byBsZWdlbmRzJyk7XG4gICAgICByZXR1cm4gZGVmcztcbiAgICB9XG4gICAgZGVmcy5wdXNoKGxlZ2VuZC5kZWYoU0hBUEUsIGVuY29kaW5nLCB7XG4gICAgICBzaGFwZTogU0hBUEUsXG4gICAgICBvcmllbnQ6IGRlZnMubGVuZ3RoID09PSAxID8gJ2xlZnQnIDogJ3JpZ2h0J1xuICAgIH0pKTtcbiAgfVxuXG4gIHJldHVybiBkZWZzO1xufTtcblxubGVnZW5kLmRlZiA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nLCBwcm9wcykge1xuICB2YXIgZGVmID0gcHJvcHMsIGZuO1xuXG4gIGRlZi50aXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSk7XG5cbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSAmJiAoZm4gPSBlbmNvZGluZy5mbihuYW1lKSkgJiZcbiAgICB0aW1lLmhhc1NjYWxlKGZuKSkge1xuICAgIHZhciBwcm9wZXJ0aWVzID0gZGVmLnByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyB8fCB7fSxcbiAgICAgIGxhYmVscyA9IHByb3BlcnRpZXMubGFiZWxzID0gcHJvcGVydGllcy5sYWJlbHMgfHwge30sXG4gICAgICB0ZXh0ID0gbGFiZWxzLnRleHQgPSBsYWJlbHMudGV4dCB8fCB7fTtcblxuICAgIHRleHQuc2NhbGUgPSAndGltZS0nKyBmbjtcbiAgfVxuXG4gIHJldHVybiBkZWY7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdmxzY2FsZSA9IHJlcXVpcmUoJy4vc2NhbGUnKTtcblxudmFyIG1hcmtzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxubWFya3MuZGVmID0gZnVuY3Rpb24obWFyaywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICAvLyB0byBhZGQgYSBiYWNrZ3JvdW5kIHRvIHRleHQsIHdlIG5lZWQgdG8gYWRkIGl0IGJlZm9yZSB0aGUgdGV4dFxuICBpZiAoZW5jb2RpbmcubWFya3R5cGUoKSA9PT0gVEVYVCAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdmFyIGJnID0ge1xuICAgICAgeDoge3ZhbHVlOiAwfSxcbiAgICAgIHk6IHt2YWx1ZTogMH0sXG4gICAgICB4Mjoge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSxcbiAgICAgIHkyOiB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fSxcbiAgICAgIGZpbGw6IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlbmNvZGluZy5maWVsZChDT0xPUil9XG4gICAgfTtcbiAgICBkZWZzLnB1c2goe1xuICAgICAgdHlwZTogJ3JlY3QnLFxuICAgICAgZnJvbToge2RhdGE6IFRBQkxFfSxcbiAgICAgIHByb3BlcnRpZXM6IHtlbnRlcjogYmcsIHVwZGF0ZTogYmd9XG4gICAgfSk7XG4gIH1cblxuICAvLyBhZGQgdGhlIG1hcmsgZGVmIGZvciB0aGUgbWFpbiB0aGluZ1xuICB2YXIgcCA9IG1hcmsucHJvcChlbmNvZGluZywgbGF5b3V0LCBzdHlsZSk7XG4gIGRlZnMucHVzaCh7XG4gICAgdHlwZTogbWFyay50eXBlLFxuICAgIGZyb206IHtkYXRhOiBUQUJMRX0sXG4gICAgcHJvcGVydGllczoge2VudGVyOiBwLCB1cGRhdGU6IHB9XG4gIH0pO1xuXG4gIHJldHVybiBkZWZzO1xufTtcblxubWFya3MuYmFyID0ge1xuICB0eXBlOiAncmVjdCcsXG4gIHN0YWNrOiB0cnVlLFxuICBwcm9wOiBiYXJfcHJvcHMsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsneCcsICd5J10sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBhbHBoYTogMX1cbn07XG5cbm1hcmtzLmxpbmUgPSB7XG4gIHR5cGU6ICdsaW5lJyxcbiAgbGluZTogdHJ1ZSxcbiAgcHJvcDogbGluZV9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCBkZXRhaWw6MX1cbn07XG5cbm1hcmtzLmFyZWEgPSB7XG4gIHR5cGU6ICdhcmVhJyxcbiAgc3RhY2s6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHJlcXVpcmVkRW5jb2Rpbmc6IFsneCcsICd5J10sXG4gIHByb3A6IGFyZWFfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIGNvbG9yOiAxLCBhbHBoYTogMX1cbn07XG5cbm1hcmtzLnRpY2sgPSB7XG4gIHR5cGU6ICdyZWN0JyxcbiAgcHJvcDogdGlja19wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCBkZXRhaWw6IDF9XG59O1xuXG5tYXJrcy5jaXJjbGUgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBmaWxsZWRfcG9pbnRfcHJvcHMoJ2NpcmNsZScpLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBzaXplOiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLnNxdWFyZSA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IGZpbGxlZF9wb2ludF9wcm9wcygnc3F1YXJlJyksXG4gIHN1cHBvcnRlZEVuY29kaW5nOiBtYXJrcy5jaXJjbGUuc3VwcG9ydGVkRW5jb2Rpbmdcbn07XG5cbm1hcmtzLnBvaW50ID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogcG9pbnRfcHJvcHMsXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgc2hhcGU6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLnRleHQgPSB7XG4gIHR5cGU6ICd0ZXh0JyxcbiAgcHJvcDogdGV4dF9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd0ZXh0J10sXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgdGV4dDogMX1cbn07XG5cbmZ1bmN0aW9uIGJhcl9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc01lYXN1cmUoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC54MiA9IHtzY2FsZTogWCwgdmFsdWU6IGUuc2NhbGUoWCkudHlwZSA9PT0gJ2xvZycgPyAxIDogMH07XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7IC8vIGlzIG9yZGluYWxcbiAgICBwLnhjID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgLy8gVE9ETyBhZGQgc2luZ2xlIGJhciBvZmZzZXRcbiAgICBwLnhjID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNNZWFzdXJlKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IGUuc2NhbGUoWSkudHlwZSA9PT0gJ2xvZycgPyAxIDogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHsgLy8gaXMgb3JkaW5hbFxuICAgIHAueWMgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPIGFkZCBzaW5nbGUgYmFyIG9mZnNldFxuICAgIHAueWMgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHdpZHRoXG4gIGlmICghZS5oYXMoWCkgfHwgZS5pc09yZGluYWxTY2FsZShYKSkgeyAvLyBubyBYIG9yIFggaXMgb3JkaW5hbFxuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC53aWR0aCA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLndpZHRoID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gWCBpcyBRdWFudCBvciBUaW1lIFNjYWxlXG4gICAgcC53aWR0aCA9IHt2YWx1ZTogMn07XG4gIH1cblxuICAvLyBoZWlnaHRcbiAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzT3JkaW5hbFNjYWxlKFkpKSB7IC8vIG5vIFkgb3IgWSBpcyBvcmRpbmFsXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLmhlaWdodCA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLmhlaWdodCA9IHtcbiAgICAgICAgdmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSxcbiAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIFkgaXMgUXVhbnQgb3IgVGltZSBTY2FsZVxuICAgIHAuaGVpZ2h0ID0ge3ZhbHVlOiAyfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfSBlbHNlIGlmIChlLnZhbHVlKEFMUEhBKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gIH1cblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gcG9pbnRfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHNpemVcbiAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgcC5zaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFNJWkUpKSB7XG4gICAgcC5zaXplID0ge3ZhbHVlOiBlLnZhbHVlKFNJWkUpfTtcbiAgfVxuXG4gIC8vIHNoYXBlXG4gIGlmIChlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3NjYWxlOiBTSEFQRSwgZmllbGQ6IGUuZmllbGQoU0hBUEUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0hBUEUpKSB7XG4gICAgcC5zaGFwZSA9IHt2YWx1ZTogZS52YWx1ZShTSEFQRSl9O1xuICB9XG5cbiAgLy8gc3Ryb2tlXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfSBlbHNlIGlmIChlLnZhbHVlKEFMUEhBKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogc3R5bGUub3BhY2l0eX07XG4gIH1cblxuICBwLnN0cm9rZVdpZHRoID0ge3ZhbHVlOiBlLmNvbmZpZygnc3Ryb2tlV2lkdGgnKX07XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGxpbmVfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge2dyb3VwOiAnaGVpZ2h0J307XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gYXJlYV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5pc01lYXN1cmUoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC54MiA9IHtzY2FsZTogWCwgdmFsdWU6IDB9O1xuICAgICAgcC5vcmllbnQgPSB7dmFsdWU6ICdob3Jpem9udGFsJ307XG4gICAgfVxuICB9IGVsc2UgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gIH0gZWxzZSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaXNNZWFzdXJlKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgcC55MiA9IHtzY2FsZTogWSwgdmFsdWU6IDB9O1xuICB9IGVsc2UgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSB7XG4gICAgcC55ID0ge2dyb3VwOiAnaGVpZ2h0J307XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHtzY2FsZTogQ09MT1IsIGZpZWxkOiBlLmZpZWxkKENPTE9SKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIHRpY2tfcHJvcHMoZSwgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgcCA9IHt9O1xuXG4gIC8vIHhcbiAgaWYgKGUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWCkpIHtcbiAgICAgIHAueC5vZmZzZXQgPSAtZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFgpKSB7XG4gICAgcC54ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgaWYgKGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICAgIHAueS5vZmZzZXQgPSAtZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMztcbiAgICB9XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiAwfTtcbiAgfVxuXG4gIC8vIHdpZHRoXG4gIGlmICghZS5oYXMoWCkgfHwgZS5pc0RpbWVuc2lvbihYKSkge1xuICAgIHAud2lkdGggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBoZWlnaHRcbiAgaWYgKCFlLmhhcyhZKSB8fCBlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDEuNX07XG4gIH0gZWxzZSB7XG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDF9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBzdHlsZS5vcGFjaXR5fTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBmaWxsZWRfcG9pbnRfcHJvcHMoc2hhcGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgICB2YXIgcCA9IHt9O1xuXG4gICAgLy8geFxuICAgIGlmIChlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3NjYWxlOiBYLCBmaWVsZDogZS5maWVsZChYKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8geVxuICAgIGlmIChlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gICAgfVxuXG4gICAgLy8gc2l6ZVxuICAgIGlmIChlLmhhcyhTSVpFKSkge1xuICAgICAgcC5zaXplID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICAgIHAuc2l6ZSA9IHt2YWx1ZTogZS52YWx1ZShTSVpFKX07XG4gICAgfVxuXG4gICAgLy8gc2hhcGVcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBzaGFwZX07XG5cbiAgICAvLyBmaWxsXG4gICAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICAgIH1cblxuICAgIC8vIGFscGhhXG4gICAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBzdHlsZS5vcGFjaXR5fTtcbiAgICB9XG5cbiAgICByZXR1cm4gcDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdGV4dF9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBpZiAoZS5oYXMoVEVYVCkgJiYgZS5pc1R5cGUoVEVYVCwgUSkpIHtcbiAgICAgIHAueCA9IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aC01fTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG4gIH1cblxuICAvLyB5XG4gIGlmIChlLmhhcyhZKSkge1xuICAgIHAueSA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgIHAueSA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMn07XG4gIH1cblxuICAvLyBzaXplXG4gIGlmIChlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLmZvbnRTaXplID0ge3ZhbHVlOiBlLmZvbnQoJ3NpemUnKX07XG4gIH1cblxuICAvLyBmaWxsXG4gIC8vIGNvbG9yIHNob3VsZCBiZSBzZXQgdG8gYmFja2dyb3VuZFxuICBwLmZpbGwgPSB7dmFsdWU6ICdibGFjayd9O1xuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfSBlbHNlIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICB9XG5cbiAgLy8gdGV4dFxuICBpZiAoZS5oYXMoVEVYVCkpIHtcbiAgICBpZiAoZS5pc1R5cGUoVEVYVCwgUSkpIHtcbiAgICAgIHAudGV4dCA9IHt0ZW1wbGF0ZTogXCJ7e1wiICsgZS5maWVsZChURVhUKSArIFwiIHwgbnVtYmVyOicuM3MnfX1cIn07XG4gICAgICBwLmFsaWduID0ge3ZhbHVlOiAncmlnaHQnfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcC50ZXh0ID0ge2ZpZWxkOiBlLmZpZWxkKFRFWFQpfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcC50ZXh0ID0ge3ZhbHVlOiAnQWJjJ307XG4gIH1cblxuICBwLmZvbnQgPSB7dmFsdWU6IGUuZm9udCgnZmFtaWx5Jyl9O1xuICBwLmZvbnRXZWlnaHQgPSB7dmFsdWU6IGUuZm9udCgnd2VpZ2h0Jyl9O1xuICBwLmZvbnRTdHlsZSA9IHt2YWx1ZTogZS5mb250KCdzdHlsZScpfTtcbiAgcC5iYXNlbGluZSA9IHt2YWx1ZTogZS50ZXh0KCdiYXNlbGluZScpfTtcblxuICByZXR1cm4gcDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIHNjYWxlID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuc2NhbGUubmFtZXMgPSBmdW5jdGlvbihwcm9wcykge1xuICByZXR1cm4gdXRpbC5rZXlzKHV0aWwua2V5cyhwcm9wcykucmVkdWNlKGZ1bmN0aW9uKGEsIHgpIHtcbiAgICBpZiAocHJvcHNbeF0gJiYgcHJvcHNbeF0uc2NhbGUpIGFbcHJvcHNbeF0uc2NhbGVdID0gMTtcbiAgICByZXR1cm4gYTtcbiAgfSwge30pKTtcbn07XG5cbnNjYWxlLmRlZnMgPSBmdW5jdGlvbihuYW1lcywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsIG9wdCkge1xuICBvcHQgPSBvcHQgfHwge307XG5cbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgdmFyIHMgPSB7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgdHlwZTogc2NhbGUudHlwZShuYW1lLCBlbmNvZGluZyksXG4gICAgICBkb21haW46IHNjYWxlX2RvbWFpbihuYW1lLCBlbmNvZGluZywgc29ydGluZywgb3B0KVxuICAgIH07XG4gICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnICYmICFlbmNvZGluZy5iaW4obmFtZSkgJiYgZW5jb2Rpbmcuc29ydChuYW1lKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHMuc29ydCA9IHRydWU7XG4gICAgfVxuXG4gICAgc2NhbGVfcmFuZ2UocywgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIG9wdCk7XG5cbiAgICByZXR1cm4gKGEucHVzaChzKSwgYSk7XG4gIH0sIFtdKTtcbn07XG5cbnNjYWxlLnR5cGUgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZykge1xuXG4gIHN3aXRjaCAoZW5jb2RpbmcudHlwZShuYW1lKSkge1xuICAgIGNhc2UgTzogcmV0dXJuICdvcmRpbmFsJztcbiAgICBjYXNlIFQ6XG4gICAgICB2YXIgZm4gPSBlbmNvZGluZy5mbihuYW1lKTtcbiAgICAgIHJldHVybiAoZm4gJiYgdGltZS5zY2FsZS50eXBlKGZuLCBuYW1lKSkgfHwgJ3RpbWUnO1xuICAgIGNhc2UgUTpcbiAgICAgIGlmIChlbmNvZGluZy5iaW4obmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgPT09IENPTE9SID8gJ2xpbmVhcicgOiAnb3JkaW5hbCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW5jb2Rpbmcuc2NhbGUobmFtZSkudHlwZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzb3J0aW5nLCBvcHQpIHtcbiAgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBUKSkge1xuICAgIHZhciByYW5nZSA9IHRpbWUuc2NhbGUuZG9tYWluKGVuY29kaW5nLmZuKG5hbWUpLCBuYW1lKTtcbiAgICBpZihyYW5nZSkgcmV0dXJuIHJhbmdlO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgIC8vIFRPRE86IGFkZCBpbmNsdWRlRW1wdHlDb25maWcgaGVyZVxuICAgIGlmIChvcHQuc3RhdHMpIHtcbiAgICAgIHZhciBiaW5zID0gdXRpbC5nZXRiaW5zKG9wdC5zdGF0c1tlbmNvZGluZy5maWVsZE5hbWUobmFtZSldLCBlbmNvZGluZy5iaW4obmFtZSkubWF4Ymlucyk7XG4gICAgICB2YXIgZG9tYWluID0gdXRpbC5yYW5nZShiaW5zLnN0YXJ0LCBiaW5zLnN0b3AsIGJpbnMuc3RlcCk7XG4gICAgICByZXR1cm4gbmFtZSA9PT0gWSA/IGRvbWFpbi5yZXZlcnNlKCkgOiBkb21haW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgPT0gb3B0LnN0YWNrID9cbiAgICB7XG4gICAgICBkYXRhOiBTVEFDS0VELFxuICAgICAgZmllbGQ6ICdkYXRhLicgKyAob3B0LmZhY2V0ID8gJ21heF8nIDogJycpICsgJ3N1bV8nICsgZW5jb2RpbmcuZmllbGQobmFtZSwgdHJ1ZSlcbiAgICB9IDpcbiAgICB7ZGF0YTogc29ydGluZy5nZXREYXRhc2V0KG5hbWUpLCBmaWVsZDogZW5jb2RpbmcuZmllbGQobmFtZSl9O1xufVxuXG5mdW5jdGlvbiBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgb3B0KSB7XG4gIHZhciBzcGVjID0gZW5jb2Rpbmcuc2NhbGUocy5uYW1lKTtcbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFg6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShYLCBsYXlvdXQueC51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsV2lkdGggPyBbMCwgbGF5b3V0LmNlbGxXaWR0aF0gOiAnd2lkdGgnO1xuXG4gICAgICAgIGlmIChlbmNvZGluZy5pc1R5cGUocy5uYW1lLFQpICYmIGVuY29kaW5nLmZuKHMubmFtZSkgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmZuKHMubmFtZSk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgcy5iYW5kV2lkdGggPSBlbmNvZGluZy5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcy5yYW5nZSA9IGxheW91dC5jZWxsSGVpZ2h0ID8gW2xheW91dC5jZWxsSGVpZ2h0LCAwXSA6ICdoZWlnaHQnO1xuXG4gICAgICAgIGlmIChlbmNvZGluZy5pc1R5cGUocy5uYW1lLFQpICYmIGVuY29kaW5nLmZuKHMubmFtZSkgPT09ICd5ZWFyJykge1xuICAgICAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMuemVybyA9IHNwZWMuemVybyA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHNwZWMuemVybztcbiAgICAgICAgfVxuXG4gICAgICAgIHMucmV2ZXJzZSA9IHNwZWMucmV2ZXJzZTtcbiAgICAgIH1cblxuICAgICAgcy5yb3VuZCA9IHRydWU7XG5cbiAgICAgIGlmIChzLnR5cGUgPT09ICd0aW1lJykge1xuICAgICAgICBzLm5pY2UgPSBlbmNvZGluZy5mbihzLm5hbWUpIHx8IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTmljZScpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBST1c6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsSGVpZ2h0O1xuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBzLm5pY2UgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0w6IC8vIHN1cHBvcnQgb25seSBvcmRpbmFsXG4gICAgICBzLmJhbmRXaWR0aCA9IGxheW91dC5jZWxsV2lkdGg7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNJWkU6XG4gICAgICBpZiAoZW5jb2RpbmcuaXMoJ2JhcicpKSB7XG4gICAgICAgIC8vIEZJWE1FIHRoaXMgaXMgZGVmaW5pdGVseSBpbmNvcnJlY3RcbiAgICAgICAgLy8gYnV0IGxldCdzIGZpeCBpdCBsYXRlciBzaW5jZSBiYXIgc2l6ZSBpcyBhIGJhZCBlbmNvZGluZyBhbnl3YXlcbiAgICAgICAgcy5yYW5nZSA9IFszLCBNYXRoLm1heChlbmNvZGluZy5iYW5kU2l6ZShYKSwgZW5jb2RpbmcuYmFuZFNpemUoWSkpXTtcbiAgICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXMoVEVYVCkpIHtcbiAgICAgICAgcy5yYW5nZSA9IFs4LCA0MF07XG4gICAgICB9IGVsc2UgeyAvL3BvaW50XG4gICAgICAgIHZhciBiYW5kU2l6ZSA9IE1hdGgubWluKGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSkgLSAxO1xuICAgICAgICBzLnJhbmdlID0gWzEwLCAwLjggKiBiYW5kU2l6ZSpiYW5kU2l6ZV07XG4gICAgICB9XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMuemVybyA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBTSEFQRTpcbiAgICAgIHMucmFuZ2UgPSAnc2hhcGVzJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQ09MT1I6XG4gICAgICB2YXIgcmFuZ2UgPSBlbmNvZGluZy5zY2FsZShDT0xPUikucmFuZ2U7XG4gICAgICBpZiAocmFuZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHtcbiAgICAgICAgICAvLyBGSVhNRVxuICAgICAgICAgIHJhbmdlID0gc3R5bGUuY29sb3JSYW5nZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByYW5nZSA9IFsnI0E5REI5RicsICcjMEQ1QzIxJ107XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHMucmFuZ2UgPSByYW5nZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQUxQSEE6XG4gICAgICBzLnJhbmdlID0gWzAuMiwgMS4wXTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcgbmFtZTogJysgcy5uYW1lKTtcbiAgfVxuXG4gIHN3aXRjaCAocy5uYW1lKSB7XG4gICAgY2FzZSBST1c6XG4gICAgY2FzZSBDT0w6XG4gICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5jb25maWcoJ2NlbGxQYWRkaW5nJyk7XG4gICAgICBzLm91dGVyUGFkZGluZyA9IDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFg6XG4gICAgY2FzZSBZOlxuICAgICAgaWYgKHMudHlwZSA9PT0gJ29yZGluYWwnKSB7IC8vJiYgIXMuYmFuZFdpZHRoXG4gICAgICAgIHMucG9pbnRzID0gdHJ1ZTtcbiAgICAgICAgcy5wYWRkaW5nID0gZW5jb2RpbmcuYmFuZChzLm5hbWUpLnBhZGRpbmc7XG4gICAgICB9XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkU29ydFRyYW5zZm9ybXM7XG5cbi8vIGFkZHMgbmV3IHRyYW5zZm9ybXMgdGhhdCBwcm9kdWNlIHNvcnRlZCBmaWVsZHNcbmZ1bmN0aW9uIGFkZFNvcnRUcmFuc2Zvcm1zKHNwZWMsIGVuY29kaW5nLCBzdGF0cywgb3B0KSB7XG4gIHZhciBkYXRhc2V0TWFwcGluZyA9IHt9O1xuICB2YXIgY291bnRlciA9IDA7XG5cbiAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuICAgIHZhciBzb3J0QnkgPSBlbmNvZGluZy5zb3J0KGVuY1R5cGUsIHN0YXRzKTtcbiAgICBpZiAoc29ydEJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBmaWVsZHMgPSBzb3J0QnkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBvcDogZC5hZ2dyLFxuICAgICAgICAgIGZpZWxkOiAnZGF0YS4nICsgZC5uYW1lXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgdmFyIGJ5Q2xhdXNlID0gc29ydEJ5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgIHZhciByZXZlcnNlID0gKGQucmV2ZXJzZSA/ICctJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIHJldmVyc2UgKyAnZGF0YS4nICsgKGQuYWdncj09PSdjb3VudCcgPyAnY291bnQnIDogKGQuYWdnciArICdfJyArIGQubmFtZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBkYXRhTmFtZSA9ICdzb3J0ZWQnICsgY291bnRlcisrO1xuXG4gICAgICB2YXIgdHJhbnNmb3JtcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnZGF0YS4nICsgZmllbGQubmFtZV0sXG4gICAgICAgICAgZmllbGRzOiBmaWVsZHNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdzb3J0JyxcbiAgICAgICAgICBieTogYnlDbGF1c2VcbiAgICAgICAgfVxuICAgICAgXTtcblxuICAgICAgc3BlYy5kYXRhLnB1c2goe1xuICAgICAgICBuYW1lOiBkYXRhTmFtZSxcbiAgICAgICAgc291cmNlOiBSQVcsXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNmb3Jtc1xuICAgICAgfSk7XG5cbiAgICAgIGRhdGFzZXRNYXBwaW5nW2VuY1R5cGVdID0gZGF0YU5hbWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHNwZWM6IHNwZWMsXG4gICAgZ2V0RGF0YXNldDogZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgICAgdmFyIGRhdGEgPSBkYXRhc2V0TWFwcGluZ1tlbmNUeXBlXTtcbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICByZXR1cm4gVEFCTEU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH07XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIG1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNraW5nO1xuXG5mdW5jdGlvbiBzdGFja2luZyhzcGVjLCBlbmNvZGluZywgbWRlZiwgZmFjZXRzKSB7XG4gIGlmICghbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0uc3RhY2spIHJldHVybiBmYWxzZTtcblxuICAvLyBUT0RPOiBhZGQgfHwgZW5jb2RpbmcuaGFzKExPRCkgaGVyZSBvbmNlIExPRCBpcyBpbXBsZW1lbnRlZFxuICBpZiAoIWVuY29kaW5nLmhhcyhDT0xPUikpIHJldHVybiBmYWxzZTtcblxuICB2YXIgZGltPW51bGwsIHZhbD1udWxsLCBpZHggPW51bGwsXG4gICAgaXNYTWVhc3VyZSA9IGVuY29kaW5nLmlzTWVhc3VyZShYKSxcbiAgICBpc1lNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFkpO1xuXG4gIGlmIChpc1hNZWFzdXJlICYmICFpc1lNZWFzdXJlKSB7XG4gICAgZGltID0gWTtcbiAgICB2YWwgPSBYO1xuICAgIGlkeCA9IDA7XG4gIH0gZWxzZSBpZiAoaXNZTWVhc3VyZSAmJiAhaXNYTWVhc3VyZSkge1xuICAgIGRpbSA9IFg7XG4gICAgdmFsID0gWTtcbiAgICBpZHggPSAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsOyAvLyBubyBzdGFjayBlbmNvZGluZ1xuICB9XG5cbiAgLy8gYWRkIHRyYW5zZm9ybSB0byBjb21wdXRlIHN1bXMgZm9yIHNjYWxlXG4gIHZhciBzdGFja2VkID0ge1xuICAgIG5hbWU6IFNUQUNLRUQsXG4gICAgc291cmNlOiBUQUJMRSxcbiAgICB0cmFuc2Zvcm06IFt7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IFtlbmNvZGluZy5maWVsZChkaW0pXS5jb25jYXQoZmFjZXRzKSwgLy8gZGltIGFuZCBvdGhlciBmYWNldHNcbiAgICAgIGZpZWxkczogW3tvcDogJ3N1bScsIGZpZWxkOiBlbmNvZGluZy5maWVsZCh2YWwpfV0gLy8gVE9ETyBjaGVjayBpZiBmaWVsZCB3aXRoIGFnZ3IgaXMgY29ycmVjdD9cbiAgICB9XVxuICB9O1xuXG4gIGlmIChmYWNldHMgJiYgZmFjZXRzLmxlbmd0aCA+IDApIHtcbiAgICBzdGFja2VkLnRyYW5zZm9ybS5wdXNoKHsgLy9jYWxjdWxhdGUgbWF4IGZvciBlYWNoIGZhY2V0XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGZhY2V0cyxcbiAgICAgIGZpZWxkczogW3tvcDogJ21heCcsIGZpZWxkOiAnZGF0YS5zdW1fJyArIGVuY29kaW5nLmZpZWxkKHZhbCwgdHJ1ZSl9XVxuICAgIH0pO1xuICB9XG5cbiAgc3BlYy5kYXRhLnB1c2goc3RhY2tlZCk7XG5cbiAgLy8gYWRkIHN0YWNrIHRyYW5zZm9ybSB0byBtYXJrXG4gIG1kZWYuZnJvbS50cmFuc2Zvcm0gPSBbe1xuICAgIHR5cGU6ICdzdGFjaycsXG4gICAgcG9pbnQ6IGVuY29kaW5nLmZpZWxkKGRpbSksXG4gICAgaGVpZ2h0OiBlbmNvZGluZy5maWVsZCh2YWwpLFxuICAgIG91dHB1dDoge3kxOiB2YWwsIHkwOiB2YWwgKyAnMid9XG4gIH1dO1xuXG4gIC8vIFRPRE86IFRoaXMgaXMgc3VwZXIgaGFjay1pc2ggLS0gY29uc29saWRhdGUgaW50byBtb2R1bGFyIG1hcmsgcHJvcGVydGllcz9cbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWxdID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbF0gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbH07XG4gIG1kZWYucHJvcGVydGllcy51cGRhdGVbdmFsICsgJzInXSA9IG1kZWYucHJvcGVydGllcy5lbnRlclt2YWwgKyAnMiddID0ge3NjYWxlOiB2YWwsIGZpZWxkOiB2YWwgKyAnMid9O1xuXG4gIHJldHVybiB2YWw7IC8vcmV0dXJuIHN0YWNrIGVuY29kaW5nXG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKSxcbiAgRW5jb2RpbmcgPSByZXF1aXJlKCcuLi9FbmNvZGluZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVuY29kaW5nLCBzdGF0cykge1xuICByZXR1cm4ge1xuICAgIG9wYWNpdHk6IGVzdGltYXRlT3BhY2l0eShlbmNvZGluZywgc3RhdHMpLFxuICAgIGNvbG9yUmFuZ2U6IGNvbG9yUmFuZ2UoZW5jb2RpbmcsIHN0YXRzKVxuICB9O1xufTtcblxuZnVuY3Rpb24gY29sb3JSYW5nZShlbmNvZGluZywgc3RhdHMpe1xuICBpZiAoZW5jb2RpbmcuaGFzKENPTE9SKSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihDT0xPUikpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSBlbmNvZGluZy5jYXJkaW5hbGl0eShDT0xPUiwgc3RhdHMpO1xuICAgIGlmIChjYXJkaW5hbGl0eSA8PSAxMCkge1xuICAgICAgcmV0dXJuIFwiY2F0ZWdvcnkxMFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJjYXRlZ29yeTIwXCI7XG4gICAgfVxuICAgIC8vIFRPRE8gY2FuIHZlZ2EgaW50ZXJwb2xhdGUgcmFuZ2UgZm9yIG9yZGluYWwgc2NhbGU/XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGVzdGltYXRlT3BhY2l0eShlbmNvZGluZyxzdGF0cykge1xuICBpZiAoIXN0YXRzKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgbnVtUG9pbnRzID0gMDtcblxuICBpZiAoZW5jb2RpbmcuaXNBZ2dyZWdhdGUoKSkgeyAvLyBhZ2dyZWdhdGUgcGxvdFxuICAgIG51bVBvaW50cyA9IDE7XG5cbiAgICAvLyAgZ2V0IG51bWJlciBvZiBwb2ludHMgaW4gZWFjaCBcImNlbGxcIlxuICAgIC8vICBieSBjYWxjdWxhdGluZyBwcm9kdWN0IG9mIGNhcmRpbmFsaXR5XG4gICAgLy8gIGZvciBlYWNoIG5vbiBmYWNldGluZyBhbmQgbm9uLW9yZGluYWwgWCAvIFkgZmllbGRzXG4gICAgLy8gIG5vdGUgdGhhdCBvcmRpbmFsIHgseSBhcmUgbm90IGluY2x1ZGUgc2luY2Ugd2UgY2FuXG4gICAgLy8gIGNvbnNpZGVyIHRoYXQgb3JkaW5hbCB4IGFyZSBzdWJkaXZpZGluZyB0aGUgY2VsbCBpbnRvIHN1YmNlbGxzIGFueXdheVxuICAgIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcblxuICAgICAgaWYgKGVuY1R5cGUgIT09IFJPVyAmJiBlbmNUeXBlICE9PSBDT0wgJiZcbiAgICAgICAgICAhKChlbmNUeXBlID09PSBYIHx8IGVuY1R5cGUgPT09IFkpICYmXG4gICAgICAgICAgdmxmaWVsZC5pc09yZGluYWxTY2FsZShmaWVsZCwgdHJ1ZSkpXG4gICAgICAgICkge1xuICAgICAgICBudW1Qb2ludHMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoZW5jVHlwZSwgc3RhdHMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0gZWxzZSB7IC8vIHJhdyBwbG90XG4gICAgbnVtUG9pbnRzID0gc3RhdHMuY291bnQ7XG5cbiAgICAvLyBzbWFsbCBtdWx0aXBsZXMgZGl2aWRlIG51bWJlciBvZiBwb2ludHNcbiAgICB2YXIgbnVtTXVsdGlwbGVzID0gMTtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFJPVykpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShST1csIHN0YXRzKTtcbiAgICB9XG4gICAgaWYgKGVuY29kaW5nLmhhcyhDT0wpKSB7XG4gICAgICBudW1NdWx0aXBsZXMgKj0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgfVxuICAgIG51bVBvaW50cyAvPSBudW1NdWx0aXBsZXM7XG4gIH1cblxuICB2YXIgb3BhY2l0eSA9IDA7XG4gIGlmIChudW1Qb2ludHMgPCAyMCkge1xuICAgIG9wYWNpdHkgPSAxO1xuICB9IGVsc2UgaWYgKG51bVBvaW50cyA8IDIwMCkge1xuICAgIG9wYWNpdHkgPSAwLjc7XG4gIH0gZWxzZSBpZiAobnVtUG9pbnRzIDwgMTAwMCB8fCBlbmNvZGluZy5pcygndGljaycpKSB7XG4gICAgb3BhY2l0eSA9IDAuNjtcbiAgfSBlbHNlIHtcbiAgICBvcGFjaXR5ID0gMC4zO1xuICB9XG5cbiAgcmV0dXJuIG9wYWNpdHk7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGdyb3VwZGVmID0gcmVxdWlyZSgnLi9ncm91cCcpLmRlZjtcblxubW9kdWxlLmV4cG9ydHMgPSBzdWJmYWNldGluZztcblxuZnVuY3Rpb24gc3ViZmFjZXRpbmcoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZykge1xuICB2YXIgbSA9IGdyb3VwLm1hcmtzLFxuICAgIGcgPSBncm91cGRlZignc3ViZmFjZXQnLCB7bWFya3M6IG19KTtcblxuICBncm91cC5tYXJrcyA9IFtnXTtcbiAgZy5mcm9tID0gbWRlZi5mcm9tO1xuICBkZWxldGUgbWRlZi5mcm9tO1xuXG4gIC8vVE9ETyB0ZXN0IExPRCAtLSB3ZSBzaG91bGQgc3VwcG9ydCBzdGFjayAvIGxpbmUgd2l0aG91dCBjb2xvciAoTE9EKSBmaWVsZFxuICB2YXIgdHJhbnMgPSAoZy5mcm9tLnRyYW5zZm9ybSB8fCAoZy5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGRldGFpbHN9KTtcblxuICBpZiAoc3RhY2sgJiYgZW5jb2RpbmcuaGFzKENPTE9SKSkge1xuICAgIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdzb3J0JywgYnk6IGVuY29kaW5nLmZpZWxkKENPTE9SKX0pO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmLFxuICB2bGRhdGEgPSByZXF1aXJlKCcuLi9kYXRhJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGVtcGxhdGU7XG5cbmZ1bmN0aW9uIHRlbXBsYXRlKGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSB7IC8vaGFjayB1c2Ugc3RhdHNcblxuICB2YXIgZGF0YSA9IHtuYW1lOiBSQVcsIGZvcm1hdDoge3R5cGU6IGVuY29kaW5nLmNvbmZpZygnZGF0YUZvcm1hdFR5cGUnKX19LFxuICAgIHRhYmxlID0ge25hbWU6IFRBQkxFLCBzb3VyY2U6IFJBV30sXG4gICAgZGF0YVVybCA9IHZsZGF0YS5nZXRVcmwoZW5jb2RpbmcsIHN0YXRzKTtcbiAgaWYgKGRhdGFVcmwpIGRhdGEudXJsID0gZGF0YVVybDtcblxuICB2YXIgcHJlYWdncmVnYXRlZERhdGEgPSBlbmNvZGluZy5jb25maWcoJ3VzZVZlZ2FTZXJ2ZXInKTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIG5hbWU7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT0gVCkge1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2UgPSBkYXRhLmZvcm1hdC5wYXJzZSB8fCB7fTtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW2ZpZWxkLm5hbWVdID0gJ2RhdGUnO1xuICAgIH0gZWxzZSBpZiAoZmllbGQudHlwZSA9PSBRKSB7XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZSA9IGRhdGEuZm9ybWF0LnBhcnNlIHx8IHt9O1xuICAgICAgaWYgKGZpZWxkLmFnZ3IgPT09ICdjb3VudCcpIHtcbiAgICAgICAgbmFtZSA9ICdjb3VudCc7XG4gICAgICB9IGVsc2UgaWYgKHByZWFnZ3JlZ2F0ZWREYXRhICYmIGZpZWxkLmJpbikge1xuICAgICAgICBuYW1lID0gJ2Jpbl8nICsgZmllbGQubmFtZTtcbiAgICAgIH0gZWxzZSBpZiAocHJlYWdncmVnYXRlZERhdGEgJiYgZmllbGQuYWdncikge1xuICAgICAgICBuYW1lID0gZmllbGQuYWdnciArICdfJyArIGZpZWxkLm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lID0gZmllbGQubmFtZTtcbiAgICAgIH1cbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlW25hbWVdID0gJ251bWJlcic7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiBsYXlvdXQud2lkdGgsXG4gICAgaGVpZ2h0OiBsYXlvdXQuaGVpZ2h0LFxuICAgIHBhZGRpbmc6ICdhdXRvJyxcbiAgICBkYXRhOiBbZGF0YSwgdGFibGVdLFxuICAgIG1hcmtzOiBbZ3JvdXBkZWYoJ2NlbGwnLCB7XG4gICAgICB3aWR0aDogbGF5b3V0LmNlbGxXaWR0aCA/IHt2YWx1ZTogbGF5b3V0LmNlbGxXaWR0aH0gOiB1bmRlZmluZWQsXG4gICAgICBoZWlnaHQ6IGxheW91dC5jZWxsSGVpZ2h0ID8ge3ZhbHVlOiBsYXlvdXQuY2VsbEhlaWdodH0gOiB1bmRlZmluZWRcbiAgICB9KV1cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGltZTtcblxuZnVuY3Rpb24gdGltZShzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIHZhciB0aW1lRmllbGRzID0ge30sIHRpbWVGbiA9IHt9O1xuXG4gIC8vIGZpbmQgdW5pcXVlIGZvcm11bGEgdHJhbnNmb3JtYXRpb24gYW5kIGJpbiBmdW5jdGlvblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFQgJiYgZmllbGQuZm4pIHtcbiAgICAgIHRpbWVGaWVsZHNbZW5jb2RpbmcuZmllbGQoZW5jVHlwZSldID0ge1xuICAgICAgICBmaWVsZDogZmllbGQsXG4gICAgICAgIGVuY1R5cGU6IGVuY1R5cGVcbiAgICAgIH07XG4gICAgICB0aW1lRm5bZmllbGQuZm5dID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGFkZCBmb3JtdWxhIHRyYW5zZm9ybVxuICB2YXIgZGF0YSA9IHNwZWMuZGF0YVsxXSxcbiAgICB0cmFuc2Zvcm0gPSBkYXRhLnRyYW5zZm9ybSA9IGRhdGEudHJhbnNmb3JtIHx8IFtdO1xuXG4gIGZvciAodmFyIGYgaW4gdGltZUZpZWxkcykge1xuICAgIHZhciB0ZiA9IHRpbWVGaWVsZHNbZl07XG4gICAgdGltZS50cmFuc2Zvcm0odHJhbnNmb3JtLCBlbmNvZGluZywgdGYuZW5jVHlwZSwgdGYuZmllbGQpO1xuICB9XG5cbiAgLy8gYWRkIHNjYWxlc1xuICB2YXIgc2NhbGVzID0gc3BlYy5zY2FsZXMgPSBzcGVjLnNjYWxlcyB8fCBbXTtcbiAgZm9yICh2YXIgZm4gaW4gdGltZUZuKSB7XG4gICAgdGltZS5zY2FsZShzY2FsZXMsIGZuLCBlbmNvZGluZyk7XG4gIH1cbiAgcmV0dXJuIHNwZWM7XG59XG5cbnRpbWUuY2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwsIHR5cGUpIHtcbiAgdmFyIGZuID0gZmllbGQuZm47XG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdzZWNvbmRzJzogcmV0dXJuIDYwO1xuICAgIGNhc2UgJ21pbnV0ZXMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gMjQ7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIDc7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiAzMTtcbiAgICBjYXNlICdtb250aCc6IHJldHVybiAxMjtcbiAgICBjYXNlICd5ZWFyJzpcbiAgICAgIHZhciBzdGF0ID0gc3RhdHNbZmllbGQubmFtZV0sXG4gICAgICAgIHllYXJzdGF0ID0gc3RhdHNbJ3llYXJfJytmaWVsZC5uYW1lXTtcblxuICAgICAgaWYgKCF5ZWFyc3RhdCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgICByZXR1cm4geWVhcnN0YXQuY2FyZGluYWxpdHkgLVxuICAgICAgICAoc3RhdC5udW1OdWxscyA+IDAgJiYgZmlsdGVyTnVsbFt0eXBlXSA/IDEgOiAwKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcblxuZnVuY3Rpb24gZmllbGRGbihmdW5jLCBmaWVsZCkge1xuICByZXR1cm4gJ3V0YycgKyBmdW5jICsgJyhkLmRhdGEuJysgZmllbGQubmFtZSArJyknO1xufVxuXG4vKipcbiAqIEByZXR1cm4ge1N0cmluZ30gZGF0ZSBiaW5uaW5nIGZvcm11bGEgb2YgdGhlIGdpdmVuIGZpZWxkXG4gKi9cbnRpbWUuZm9ybXVsYSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZEZuKGZpZWxkLmZuLCBmaWVsZCk7XG59O1xuXG4vKiogYWRkIGZvcm11bGEgdHJhbnNmb3JtcyB0byBkYXRhICovXG50aW1lLnRyYW5zZm9ybSA9IGZ1bmN0aW9uKHRyYW5zZm9ybSwgZW5jb2RpbmcsIGVuY1R5cGUsIGZpZWxkKSB7XG4gIHRyYW5zZm9ybS5wdXNoKHtcbiAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgZmllbGQ6IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUpLFxuICAgIGV4cHI6IHRpbWUuZm9ybXVsYShmaWVsZClcbiAgfSk7XG59O1xuXG4vKiogYXBwZW5kIGN1c3RvbSB0aW1lIHNjYWxlcyBmb3IgYXhpcyBsYWJlbCAqL1xudGltZS5zY2FsZSA9IGZ1bmN0aW9uKHNjYWxlcywgZm4sIGVuY29kaW5nKSB7XG4gIHZhciBsYWJlbExlbmd0aCA9IGVuY29kaW5nLmNvbmZpZygndGltZVNjYWxlTGFiZWxMZW5ndGgnKTtcbiAgLy8gVE9ETyBhZGQgb3B0aW9uIGZvciBzaG9ydGVyIHNjYWxlIC8gY3VzdG9tIHJhbmdlXG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdkYXknOlxuICAgICAgc2NhbGVzLnB1c2goe1xuICAgICAgICBuYW1lOiAndGltZS0nK2ZuLFxuICAgICAgICB0eXBlOiAnb3JkaW5hbCcsXG4gICAgICAgIGRvbWFpbjogdXRpbC5yYW5nZSgwLCA3KSxcbiAgICAgICAgcmFuZ2U6IFsnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheScsICdTdW5kYXknXS5tYXAoXG4gICAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICAgKVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdtb250aCc6XG4gICAgICBzY2FsZXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICd0aW1lLScrZm4sXG4gICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgZG9tYWluOiB1dGlsLnJhbmdlKDAsIDEyKSxcbiAgICAgICAgcmFuZ2U6IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLm1hcChcbiAgICAgICAgICAgIGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMuc3Vic3RyKDAsIGxhYmVsTGVuZ3RoKTt9XG4gICAgICAgICAgKVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxudGltZS5pc09yZGluYWxGbiA9IGZ1bmN0aW9uKGZuKSB7XG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdob3Vycyc6XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdkYXRlJzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG50aW1lLnNjYWxlLnR5cGUgPSBmdW5jdGlvbihmbiwgbmFtZSkge1xuICBpZiAobmFtZSA9PT0gQ09MT1IpIHtcbiAgICByZXR1cm4gJ2xpbmVhcic7IC8vIHRoaXMgaGFzIG9yZGVyXG4gIH1cblxuICByZXR1cm4gdGltZS5pc09yZGluYWxGbihmbikgfHwgbmFtZSA9PT0gQ09MIHx8IG5hbWUgPT09IFJPVyA/ICdvcmRpbmFsJyA6ICdsaW5lYXInO1xufTtcblxudGltZS5zY2FsZS5kb21haW4gPSBmdW5jdGlvbihmbiwgbmFtZSkge1xuICB2YXIgaXNDb2xvciA9IG5hbWUgPT09IENPTE9SO1xuICBzd2l0Y2ggKGZuKSB7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiBpc0NvbG9yID8gWzAsNTldIDogdXRpbC5yYW5nZSgwLCA2MCk7XG4gICAgY2FzZSAnaG91cnMnOiByZXR1cm4gaXNDb2xvciA/IFswLDIzXSA6IHV0aWwucmFuZ2UoMCwgMjQpO1xuICAgIGNhc2UgJ2RheSc6IHJldHVybiBpc0NvbG9yID8gWzAsNl0gOiB1dGlsLnJhbmdlKDAsIDcpO1xuICAgIGNhc2UgJ2RhdGUnOiByZXR1cm4gaXNDb2xvciA/IFsxLDMxXSA6IHV0aWwucmFuZ2UoMSwgMzIpO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIGlzQ29sb3IgPyBbMCwxMV0gOiB1dGlsLnJhbmdlKDAsIDEyKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKiB3aGV0aGVyIGEgcGFydGljdWxhciB0aW1lIGZ1bmN0aW9uIGhhcyBjdXN0b20gc2NhbGUgZm9yIGxhYmVscyBpbXBsZW1lbnRlZCBpbiB0aW1lLnNjYWxlICovXG50aW1lLmhhc1NjYWxlID0gZnVuY3Rpb24oZm4pIHtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnbW9udGgnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi9nbG9iYWxzJyk7XG5cbnZhciBjb25zdHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5jb25zdHMuZW5jb2RpbmdUeXBlcyA9IFtYLCBZLCBST1csIENPTCwgU0laRSwgU0hBUEUsIENPTE9SLCBBTFBIQSwgVEVYVCwgREVUQUlMXTtcblxuY29uc3RzLmRhdGFUeXBlcyA9IHsnTyc6IE8sICdRJzogUSwgJ1QnOiBUfTtcblxuY29uc3RzLmRhdGFUeXBlTmFtZXMgPSBbJ08nLCAnUScsICdUJ10ucmVkdWNlKGZ1bmN0aW9uKHIsIHgpIHtcbiAgcltjb25zdHMuZGF0YVR5cGVzW3hdXSA9IHg7XG4gIHJldHVybiByO1xufSx7fSk7XG5cbmNvbnN0cy5zaG9ydGhhbmQgPSB7XG4gIGRlbGltOiAgJ3wnLFxuICBhc3NpZ246ICc9JyxcbiAgdHlwZTogICAnLCcsXG4gIGZ1bmM6ICAgJ18nXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUT0RPOiByZW5hbWUgZ2V0RGF0YVVybCB0byB2bC5kYXRhLmdldFVybCgpID9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIHZsZGF0YSA9IG1vZHVsZS5leHBvcnRzID0ge30sXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG5cbnZsZGF0YS5nZXRVcmwgPSBmdW5jdGlvbiBnZXREYXRhVXJsKGVuY29kaW5nLCBzdGF0cykge1xuICBpZiAoIWVuY29kaW5nLmNvbmZpZygndXNlVmVnYVNlcnZlcicpKSB7XG4gICAgLy8gZG9uJ3QgdXNlIHZlZ2Egc2VydmVyXG4gICAgcmV0dXJuIGVuY29kaW5nLmNvbmZpZygnZGF0YVVybCcpO1xuICB9XG5cbiAgaWYgKGVuY29kaW5nLmxlbmd0aCgpID09PSAwKSB7XG4gICAgLy8gbm8gZmllbGRzXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGZpZWxkcyA9IFtdO1xuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIG5hbWU6IGVuY29kaW5nLmZpZWxkKGVuY1R5cGUsIHRydWUpLFxuICAgICAgZmllbGQ6IGZpZWxkLm5hbWVcbiAgICB9O1xuICAgIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgICBvYmouYWdnciA9IGZpZWxkLmFnZ3I7XG4gICAgfVxuICAgIGlmIChmaWVsZC5iaW4pIHtcbiAgICAgIG9iai5iaW5TaXplID0gdXRpbC5nZXRiaW5zKHN0YXRzW2ZpZWxkLm5hbWVdLCBlbmNvZGluZy5iaW4oZW5jVHlwZSkubWF4Ymlucykuc3RlcDtcbiAgICB9XG4gICAgZmllbGRzLnB1c2gob2JqKTtcbiAgfSk7XG5cbiAgdmFyIHF1ZXJ5ID0ge1xuICAgIHRhYmxlOiBlbmNvZGluZy5jb25maWcoJ3ZlZ2FTZXJ2ZXJUYWJsZScpLFxuICAgIGZpZWxkczogZmllbGRzXG4gIH07XG5cbiAgcmV0dXJuIGVuY29kaW5nLmNvbmZpZygndmVnYVNlcnZlclVybCcpICsgJy9xdWVyeS8/cT0nICsgSlNPTi5zdHJpbmdpZnkocXVlcnkpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGRhdGEgZGF0YSBpbiBKU09OL2phdmFzY3JpcHQgb2JqZWN0IGZvcm1hdFxuICogQHJldHVybiBBcnJheSBvZiB7bmFtZTogX19uYW1lX18sIHR5cGU6IFwibnVtYmVyfHRleHR8dGltZXxsb2NhdGlvblwifVxuICovXG52bGRhdGEuZ2V0U2NoZW1hID0gZnVuY3Rpb24oZGF0YSwgb3JkZXIpIHtcbiAgdmFyIHNjaGVtYSA9IFtdLFxuICAgIGZpZWxkcyA9IHV0aWwua2V5cyhkYXRhWzBdKTtcblxuICBmaWVsZHMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgLy8gZmluZCBub24tbnVsbCBkYXRhXG4gICAgdmFyIGkgPSAwLCBkYXR1bSA9IGRhdGFbaV1ba107XG4gICAgd2hpbGUgKGRhdHVtID09PSAnJyB8fCBkYXR1bSA9PT0gbnVsbCB8fCBkYXR1bSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkYXR1bSA9IGRhdGFbKytpXVtrXTtcbiAgICB9XG5cbiAgICBkYXR1bSA9IHV0aWwucGFyc2UoZGF0dW0pO1xuICAgIHZhciB0eXBlID0gKHR5cGVvZiBkYXR1bSA9PT0gJ251bWJlcicpID8gJ1EnOlxuICAgICAgKGRhdHVtIGluc3RhbmNlb2YgRGF0ZSkgPyAnVCcgOiAnTyc7XG5cbiAgICBzY2hlbWEucHVzaCh7bmFtZTogaywgdHlwZTogdHlwZX0pO1xuICB9KTtcblxuICBzY2hlbWEgPSB1dGlsLnN0YWJsZXNvcnQoc2NoZW1hLCBvcmRlciB8fCB2bGZpZWxkLm9yZGVyLnR5cGVUaGVuTmFtZSwgdmxmaWVsZC5vcmRlci5uYW1lKTtcblxuICByZXR1cm4gc2NoZW1hO1xufTtcblxudmxkYXRhLmdldFN0YXRzID0gZnVuY3Rpb24oZGF0YSkgeyAvLyBoYWNrXG4gIHZhciBzdGF0cyA9IHt9LFxuICAgIGZpZWxkcyA9IHV0aWwua2V5cyhkYXRhWzBdKTtcblxuICBmaWVsZHMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgdmFyIGNvbHVtbiA9IGRhdGEubWFwKGZ1bmN0aW9uKGQpIHtyZXR1cm4gZFtrXTt9KTtcblxuICAgIC8vIEhhY2tcbiAgICB2YXIgdmFsID0gdXRpbC5wYXJzZShkYXRhWzBdW2tdKTtcbiAgICB2YXIgdHlwZSA9ICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykgPyAnUSc6XG4gICAgICAodmFsIGluc3RhbmNlb2YgRGF0ZSkgPyAnVCcgOiAnTyc7XG5cbiAgICB2YXIgc3RhdCA9IHt9O1xuICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgc3RhdCA9IHV0aWwubWlubWF4KHV0aWwubnVtYmVycyhjb2x1bW4pKTtcbiAgICB9IGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHN0YXQgPSB1dGlsLm1pbm1heCh1dGlsLmRhdGVzKGNvbHVtbikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ID0gdXRpbC5taW5tYXgoY29sdW1uKTtcbiAgICB9XG5cbiAgICBzdGF0LmNhcmRpbmFsaXR5ID0gdXRpbC51bmlxKGRhdGEsIGspO1xuICAgIHN0YXQuY291bnQgPSBkYXRhLmxlbmd0aDtcblxuICAgIHN0YXQubWF4bGVuZ3RoID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24obWF4LHJvdykge1xuICAgICAgaWYgKHJvd1trXSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbWF4O1xuICAgICAgfVxuICAgICAgdmFyIGxlbiA9IHJvd1trXS50b1N0cmluZygpLmxlbmd0aDtcbiAgICAgIHJldHVybiBsZW4gPiBtYXggPyBsZW4gOiBtYXg7XG4gICAgfSwgMCk7XG5cbiAgICBzdGF0Lm51bU51bGxzID0gZGF0YS5yZWR1Y2UoZnVuY3Rpb24oY291bnQsIHJvdykge1xuICAgICAgcmV0dXJuIHJvd1trXSA9PT0gbnVsbCA/IGNvdW50ICsgMSA6IGNvdW50O1xuICAgIH0sIDApO1xuXG4gICAgdmFyIG51bWJlcnMgPSB1dGlsLm51bWJlcnMoY29sdW1uKTtcblxuICAgIGlmIChudW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIHN0YXQuc2tldyA9IHV0aWwuc2tldyhudW1iZXJzKTtcbiAgICAgIHN0YXQuc3RkZXYgPSB1dGlsLnN0ZGV2KG51bWJlcnMpO1xuICAgICAgc3RhdC5tZWFuID0gdXRpbC5tZWFuKG51bWJlcnMpO1xuICAgICAgc3RhdC5tZWRpYW4gPSB1dGlsLm1lZGlhbihudW1iZXJzKTtcbiAgICB9XG5cbiAgICB2YXIgc2FtcGxlID0ge307XG4gICAgd2hpbGUoT2JqZWN0LmtleXMoc2FtcGxlKS5sZW5ndGggPCBNYXRoLm1pbihzdGF0LmNhcmRpbmFsaXR5LCAxMCkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGRhdGFbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGF0YS5sZW5ndGgpXVtrXTtcbiAgICAgIHNhbXBsZVt2YWx1ZV0gPSB0cnVlO1xuICAgIH1cbiAgICBzdGF0LnNhbXBsZSA9IE9iamVjdC5rZXlzKHNhbXBsZSk7XG5cbiAgICBzdGF0c1trXSA9IHN0YXQ7XG4gIH0pO1xuICBzdGF0cy5jb3VudCA9IGRhdGEubGVuZ3RoO1xuICByZXR1cm4gc3RhdHM7XG59O1xuIiwiLy8gdXRpbGl0eSBmb3IgZW5jXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnN0cyA9IHJlcXVpcmUoJy4vY29uc3RzJyksXG4gIGMgPSBjb25zdHMuc2hvcnRoYW5kLFxuICB0aW1lID0gcmVxdWlyZSgnLi9jb21waWxlL3RpbWUnKSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuL3NjaGVtYS9zY2hlbWEnKSxcbiAgZW5jVHlwZXMgPSBzY2hlbWEuZW5jVHlwZXM7XG5cbnZhciB2bGVuYyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZsZW5jLmNvdW50UmV0aW5hbCA9IGZ1bmN0aW9uKGVuYykge1xuICB2YXIgY291bnQgPSAwO1xuICBpZiAoZW5jLmNvbG9yKSBjb3VudCsrO1xuICBpZiAoZW5jLmFscGhhKSBjb3VudCsrO1xuICBpZiAoZW5jLnNpemUpIGNvdW50Kys7XG4gIGlmIChlbmMuc2hhcGUpIGNvdW50Kys7XG4gIHJldHVybiBjb3VudDtcbn07XG5cbnZsZW5jLmhhcyA9IGZ1bmN0aW9uKGVuYywgZW5jVHlwZSkge1xuICB2YXIgZmllbGREZWYgPSBlbmMgJiYgZW5jW2VuY1R5cGVdO1xuICByZXR1cm4gZmllbGREZWYgJiYgZmllbGREZWYubmFtZTtcbn07XG5cbnZsZW5jLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oZW5jKSB7XG4gIGZvciAodmFyIGsgaW4gZW5jKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspICYmIGVuY1trXS5hZ2dyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudmxlbmMuZm9yRWFjaCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgaSA9IDA7XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgZihlbmNba10sIGssIGkrKyk7XG4gICAgfVxuICB9KTtcbn07XG5cbnZsZW5jLm1hcCA9IGZ1bmN0aW9uKGVuYywgZikge1xuICB2YXIgYXJyID0gW107XG4gIGVuY1R5cGVzLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGlmICh2bGVuYy5oYXMoZW5jLCBrKSkge1xuICAgICAgYXJyLnB1c2goZihlbmNba10sIGssIGVuYykpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBhcnI7XG59O1xuXG52bGVuYy5yZWR1Y2UgPSBmdW5jdGlvbihlbmMsIGYsIGluaXQpIHtcbiAgdmFyIHIgPSBpbml0LCBpID0gMCwgaztcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICByID0gZihyLCBlbmNba10sIGssICBlbmMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByO1xufTtcblxuLypcbiAqIHJldHVybiBrZXktdmFsdWUgcGFpcnMgb2YgZmllbGQgbmFtZSBhbmQgbGlzdCBvZiBmaWVsZHMgb2YgdGhhdCBmaWVsZCBuYW1lXG4gKi9cbnZsZW5jLmZpZWxkcyA9IGZ1bmN0aW9uKGVuYykge1xuICByZXR1cm4gdmxlbmMucmVkdWNlKGVuYywgZnVuY3Rpb24gKG0sIGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIGZpZWxkTGlzdCA9IG1bZmllbGQubmFtZV0gPSBtW2ZpZWxkLm5hbWVdIHx8IFtdLFxuICAgICAgY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSA9IGZpZWxkTGlzdC5jb250YWluc1R5cGUgfHwge307XG5cbiAgICBpZiAoZmllbGRMaXN0LmluZGV4T2YoZmllbGQpID09PSAtMSkge1xuICAgICAgZmllbGRMaXN0LnB1c2goZmllbGQpO1xuICAgICAgLy8gYXVnbWVudCB0aGUgYXJyYXkgd2l0aCBjb250YWluc1R5cGUuUSAvIE8gLyBUXG4gICAgICBjb250YWluc1R5cGVbZmllbGQudHlwZV0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufTtcblxudmxlbmMuc2hvcnRoYW5kID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5tYXAoZW5jLCBmdW5jdGlvbihmaWVsZCwgZXQpIHtcbiAgICByZXR1cm4gZXQgKyBjLmFzc2lnbiArIHZsZmllbGQuc2hvcnRoYW5kKGZpZWxkKTtcbiAgfSkuam9pbihjLmRlbGltKTtcbn07XG5cbnZsZW5jLnBhcnNlU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBjb252ZXJ0VHlwZSkge1xuICB2YXIgZW5jID0gdXRpbC5pc0FycmF5KHNob3J0aGFuZCkgPyBzaG9ydGhhbmQgOiBzaG9ydGhhbmQuc3BsaXQoYy5kZWxpbSk7XG4gIHJldHVybiBlbmMucmVkdWNlKGZ1bmN0aW9uKG0sIGUpIHtcbiAgICB2YXIgc3BsaXQgPSBlLnNwbGl0KGMuYXNzaWduKSxcbiAgICAgICAgZW5jdHlwZSA9IHNwbGl0WzBdLnRyaW0oKSxcbiAgICAgICAgZmllbGQgPSBzcGxpdFsxXTtcblxuICAgIG1bZW5jdHlwZV0gPSB2bGZpZWxkLnBhcnNlU2hvcnRoYW5kKGZpZWxkLCBjb252ZXJ0VHlwZSk7XG4gICAgcmV0dXJuIG07XG4gIH0sIHt9KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyB1dGlsaXR5IGZvciBmaWVsZFxuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpO1xuXG52YXIgdmxmaWVsZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZsZmllbGQuc2hvcnRoYW5kID0gZnVuY3Rpb24oZikge1xuICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQ7XG4gIHJldHVybiAoZi5hZ2dyID8gZi5hZ2dyICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5mbiA/IGYuZm4gKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmJpbiA/ICdiaW4nICsgYy5mdW5jIDogJycpICtcbiAgICAoZi5uYW1lIHx8ICcnKSArIGMudHlwZSArXG4gICAgKGNvbnN0cy5kYXRhVHlwZU5hbWVzW2YudHlwZV0gfHwgZi50eXBlKTtcbn07XG5cbnZsZmllbGQuc2hvcnRoYW5kcyA9IGZ1bmN0aW9uKGZpZWxkcywgZGVsaW0pIHtcbiAgZGVsaW0gPSBkZWxpbSB8fCBjLmRlbGltO1xuICByZXR1cm4gZmllbGRzLm1hcCh2bGZpZWxkLnNob3J0aGFuZCkuam9pbihkZWxpbSk7XG59O1xuXG52bGZpZWxkLnBhcnNlU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBjb252ZXJ0VHlwZSkge1xuICB2YXIgc3BsaXQgPSBzaG9ydGhhbmQuc3BsaXQoYy50eXBlKSwgaTtcbiAgdmFyIG8gPSB7XG4gICAgbmFtZTogc3BsaXRbMF0udHJpbSgpLFxuICAgIHR5cGU6IGNvbnZlcnRUeXBlID8gY29uc3RzLmRhdGFUeXBlc1tzcGxpdFsxXS50cmltKCldIDogc3BsaXRbMV0udHJpbSgpXG4gIH07XG5cbiAgLy8gY2hlY2sgYWdncmVnYXRlIHR5cGVcbiAgZm9yIChpIGluIHNjaGVtYS5hZ2dyLmVudW0pIHtcbiAgICB2YXIgYSA9IHNjaGVtYS5hZ2dyLmVudW1baV07XG4gICAgaWYgKG8ubmFtZS5pbmRleE9mKGEgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKGEubGVuZ3RoICsgMSk7XG4gICAgICBpZiAoYSA9PSAnY291bnQnICYmIG8ubmFtZS5sZW5ndGggPT09IDApIG8ubmFtZSA9ICcqJztcbiAgICAgIG8uYWdnciA9IGE7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayB0aW1lIGZuXG4gIGZvciAoaSBpbiBzY2hlbWEudGltZWZucykge1xuICAgIHZhciBmID0gc2NoZW1hLnRpbWVmbnNbaV07XG4gICAgaWYgKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZihmICsgJ18nKSA9PT0gMCkge1xuICAgICAgby5uYW1lID0gby5uYW1lLnN1YnN0cihvLmxlbmd0aCArIDEpO1xuICAgICAgby5mbiA9IGY7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBjaGVjayBiaW5cbiAgaWYgKG8ubmFtZSAmJiBvLm5hbWUuaW5kZXhPZignYmluXycpID09PSAwKSB7XG4gICAgby5uYW1lID0gby5uYW1lLnN1YnN0cig0KTtcbiAgICBvLmJpbiA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gbztcbn07XG5cbnZhciB0eXBlT3JkZXIgPSB7XG4gIE86IDAsXG4gIEc6IDEsXG4gIFQ6IDIsXG4gIFE6IDNcbn07XG5cbnZsZmllbGQub3JkZXIgPSB7fTtcblxudmxmaWVsZC5vcmRlci50eXBlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgaWYgKGZpZWxkLmFnZ3I9PT0nY291bnQnKSByZXR1cm4gNDtcbiAgcmV0dXJuIHR5cGVPcmRlcltmaWVsZC50eXBlXTtcbn07XG5cbnZsZmllbGQub3JkZXIudHlwZVRoZW5OYW1lID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIHZsZmllbGQub3JkZXIudHlwZShmaWVsZCkgKyAnXycgKyBmaWVsZC5uYW1lLnRvTG93ZXJDYXNlKCk7XG59O1xuXG52bGZpZWxkLm9yZGVyLm9yaWdpbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAwOyAvLyBubyBzd2FwIHdpbGwgb2NjdXJcbn07XG5cbnZsZmllbGQub3JkZXIubmFtZSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZC5uYW1lO1xufTtcblxudmxmaWVsZC5vcmRlci50eXBlVGhlbkNhcmRpbmFsaXR5ID0gZnVuY3Rpb24oZmllbGQsIHN0YXRzKXtcbiAgcmV0dXJuIHN0YXRzW2ZpZWxkLm5hbWVdLmNhcmRpbmFsaXR5O1xufTtcblxuLy8gRklYTUUgcmVmYWN0b3JcbnZsZmllbGQuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gIHJldHVybiAoZmllbGREZWYudHlwZSAmIHR5cGUpID4gMDtcbn07XG5cbnZsZmllbGQuaXNUeXBlLmJ5Q29kZSA9IHZsZmllbGQuaXNUeXBlO1xuXG52bGZpZWxkLmlzVHlwZS5ieU5hbWUgPSBmdW5jdGlvbiAoZmllbGQsIHR5cGUpIHtcbiAgcmV0dXJuIGZpZWxkLnR5cGUgPT09IGNvbnN0cy5kYXRhVHlwZU5hbWVzW3R5cGVdO1xufTtcblxuXG5mdW5jdGlvbiBnZXRJc1R5cGUodXNlVHlwZUNvZGUpIHtcbiAgcmV0dXJuIHVzZVR5cGVDb2RlID8gdmxmaWVsZC5pc1R5cGUuYnlDb2RlIDogdmxmaWVsZC5pc1R5cGUuYnlOYW1lO1xufVxuXG52bGZpZWxkLmlzVHlwZS5nZXQgPSBnZXRJc1R5cGU7IC8vRklYTUVcblxuLypcbiAqIE1vc3QgZmllbGRzIHRoYXQgdXNlIG9yZGluYWwgc2NhbGUgYXJlIGRpbWVuc2lvbnMuXG4gKiBIb3dldmVyLCBZRUFSKFQpLCBZRUFSTU9OVEgoVCkgdXNlIHRpbWUgc2NhbGUsIG5vdCBvcmRpbmFsIGJ1dCBhcmUgZGltZW5zaW9ucyB0b28uXG4gKi9cbnZsZmllbGQuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUgLypvcHRpb25hbCovKSB7XG4gIHZhciBpc1R5cGUgPSBnZXRJc1R5cGUodXNlVHlwZUNvZGUpO1xuICByZXR1cm4gIGlzVHlwZShmaWVsZCwgTykgfHwgZmllbGQuYmluIHx8XG4gICAgKCBpc1R5cGUoZmllbGQsIFQpICYmIGZpZWxkLmZuICYmIHRpbWUuaXNPcmRpbmFsRm4oZmllbGQuZm4pICk7XG59O1xuXG5mdW5jdGlvbiBpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUgLypvcHRpb25hbCovKSB7XG4gIHZhciBpc1R5cGUgPSBnZXRJc1R5cGUodXNlVHlwZUNvZGUpO1xuICByZXR1cm4gIGlzVHlwZShmaWVsZCwgTykgfHwgISFmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgISFmaWVsZC5mbiApO1xufVxuXG4vKipcbiAqIEZvciBlbmNvZGluZywgdXNlIGVuY29kaW5nLmlzRGltZW5zaW9uKCkgdG8gYXZvaWQgY29uZnVzaW9uLlxuICogT3IgdXNlIEVuY29kaW5nLmlzVHlwZSBpZiB5b3VyIGZpZWxkIGlzIGZyb20gRW5jb2RpbmcgKGFuZCB0aHVzIGhhdmUgbnVtZXJpYyBkYXRhIHR5cGUpLlxuICogb3RoZXJ3aXNlLCBkbyBub3Qgc3BlY2lmaWMgaXNUeXBlIHNvIHdlIGNhbiB1c2UgdGhlIGRlZmF1bHQgaXNUeXBlTmFtZSBoZXJlLlxuICovXG52bGZpZWxkLmlzRGltZW5zaW9uID0gZnVuY3Rpb24oZmllbGQsIHVzZVR5cGVDb2RlIC8qb3B0aW9uYWwqLykge1xuICByZXR1cm4gZmllbGQgJiYgaXNEaW1lbnNpb24oZmllbGQsIHVzZVR5cGVDb2RlKTtcbn07XG5cbnZsZmllbGQuaXNNZWFzdXJlID0gZnVuY3Rpb24oZmllbGQsIHVzZVR5cGVDb2RlKSB7XG4gIHJldHVybiBmaWVsZCAmJiAhaXNEaW1lbnNpb24oZmllbGQsIHVzZVR5cGVDb2RlKTtcbn07XG5cbnZsZmllbGQucm9sZSA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBpc0RpbWVuc2lvbihmaWVsZCkgPyAnZGltZW5zaW9uJyA6ICdtZWFzdXJlJztcbn07XG5cbnZsZmllbGQuY291bnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtuYW1lOicqJywgYWdncjogJ2NvdW50JywgdHlwZTonUScsIGRpc3BsYXlOYW1lOiB2bGZpZWxkLmNvdW50LmRpc3BsYXlOYW1lfTtcbn07XG5cbnZsZmllbGQuY291bnQuZGlzcGxheU5hbWUgPSAnTnVtYmVyIG9mIFJlY29yZHMnO1xuXG52bGZpZWxkLmlzQ291bnQgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gZmllbGQuYWdnciA9PT0gJ2NvdW50Jztcbn07XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuY2FyZGluYWxpdHkoKSB0byBhdm9pZCBjb25mdXNpb24uICBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuY2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMsIGZpbHRlck51bGwsIHVzZVR5cGVDb2RlKSB7XG4gIC8vIEZJWE1FIG5lZWQgdG8gdGFrZSBmaWx0ZXIgaW50byBhY2NvdW50XG4gIHZhciBpc1R5cGUgPSBnZXRJc1R5cGUodXNlVHlwZUNvZGUpLFxuICAgIHR5cGUgPSB1c2VUeXBlQ29kZSA/IGNvbnN0cy5kYXRhVHlwZU5hbWVzW2ZpZWxkLnR5cGVdIDogZmllbGQudHlwZTtcblxuICBmaWx0ZXJOdWxsID0gZmlsdGVyTnVsbCB8fCB7fTtcblxuICBpZiAoZmllbGQuYmluKSB7XG4gICAgdmFyIGJpbnMgPSB1dGlsLmdldGJpbnMoc3RhdHNbZmllbGQubmFtZV0sIGZpZWxkLmJpbi5tYXhiaW5zIHx8IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQpO1xuICAgIHJldHVybiAoYmlucy5zdG9wIC0gYmlucy5zdGFydCkgLyBiaW5zLnN0ZXA7XG4gIH1cbiAgaWYgKGlzVHlwZShmaWVsZCwgVCkpIHtcbiAgICB2YXIgY2FyZGluYWxpdHkgPSB0aW1lLmNhcmRpbmFsaXR5KGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSk7XG4gICAgaWYoY2FyZGluYWxpdHkgIT09IG51bGwpIHJldHVybiBjYXJkaW5hbGl0eTtcbiAgICAvL290aGVyd2lzZSB1c2UgY2FsY3VsYXRpb24gYmVsb3dcbiAgfVxuICBpZiAoZmllbGQuYWdncikge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gcmVtb3ZlIG51bGxcbiAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXTtcbiAgcmV0dXJuIHN0YXQuY2FyZGluYWxpdHkgLVxuICAgIChzdGF0Lm51bU51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gZGVjbGFyZSBnbG9iYWwgY29uc3RhbnRcbnZhciBnID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuZy5UQUJMRSA9ICd0YWJsZSc7XG5nLlJBVyA9ICdyYXcnO1xuZy5TVEFDS0VEID0gJ3N0YWNrZWQnO1xuZy5JTkRFWCA9ICdpbmRleCc7XG5cbmcuWCA9ICd4JztcbmcuWSA9ICd5JztcbmcuUk9XID0gJ3Jvdyc7XG5nLkNPTCA9ICdjb2wnO1xuZy5TSVpFID0gJ3NpemUnO1xuZy5TSEFQRSA9ICdzaGFwZSc7XG5nLkNPTE9SID0gJ2NvbG9yJztcbmcuQUxQSEEgPSAnYWxwaGEnO1xuZy5URVhUID0gJ3RleHQnO1xuZy5ERVRBSUwgPSAnZGV0YWlsJztcblxuZy5PID0gMTtcbmcuUSA9IDI7XG5nLlQgPSA0O1xuIiwiLy8gUGFja2FnZSBvZiBkZWZpbmluZyBWZWdhbGl0ZSBTcGVjaWZpY2F0aW9uJ3MganNvbiBzY2hlbWFcblwidXNlIHN0cmljdFwiO1xuXG52YXIgc2NoZW1hID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxuc2NoZW1hLnV0aWwgPSByZXF1aXJlKCcuL3NjaGVtYXV0aWwnKTtcblxuc2NoZW1hLm1hcmt0eXBlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydwb2ludCcsICd0aWNrJywgJ2JhcicsICdsaW5lJywgJ2FyZWEnLCAnY2lyY2xlJywgJ3NxdWFyZScsICd0ZXh0J11cbn07XG5cbnNjaGVtYS5hZ2dyID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXSxcbiAgc3VwcG9ydGVkRW51bXM6IHtcbiAgICBROiBbJ2F2ZycsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICAgIE86IFtdLFxuICAgIFQ6IFsnYXZnJywgJ21pbicsICdtYXgnXSxcbiAgICAnJzogWydjb3VudCddXG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlLCAnTyc6IHRydWUsICdUJzogdHJ1ZSwgJyc6IHRydWV9XG59O1xuc2NoZW1hLmJhbmQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDFcbiAgICB9XG4gIH1cbn07XG5cbnNjaGVtYS5nZXRTdXBwb3J0ZWRSb2xlID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICByZXR1cm4gc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuYy5wcm9wZXJ0aWVzW2VuY1R5cGVdLnN1cHBvcnRlZFJvbGU7XG59O1xuXG5zY2hlbWEudGltZWZucyA9IFsneWVhcicsICdtb250aCcsICdkYXknLCAnZGF0ZScsICdob3VycycsICdtaW51dGVzJywgJ3NlY29uZHMnXTtcblxuc2NoZW1hLmRlZmF1bHRUaW1lRm4gPSAnbW9udGgnO1xuXG5zY2hlbWEuZm4gPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBzY2hlbWEudGltZWZucyxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnVCc6IHRydWV9XG59O1xuXG4vL1RPRE8oa2FuaXR3KTogYWRkIG90aGVyIHR5cGUgb2YgZnVuY3Rpb24gaGVyZVxuXG5zY2hlbWEuc2NhbGVfdHlwZSA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IFsnbGluZWFyJywgJ2xvZycsICdwb3cnLCAnc3FydCcsICdxdWFudGlsZSddLFxuICBkZWZhdWx0OiAnbGluZWFyJyxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWV9XG59O1xuXG5zY2hlbWEuZmllbGQgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9XG4gIH1cbn07XG5cbnZhciBjbG9uZSA9IHV0aWwuZHVwbGljYXRlO1xudmFyIG1lcmdlID0gc2NoZW1hLnV0aWwubWVyZ2U7XG5cbnNjaGVtYS5NQVhCSU5TX0RFRkFVTFQgPSAxNTtcblxudmFyIGJpbiA9IHtcbiAgdHlwZTogWydib29sZWFuJywgJ29iamVjdCddLFxuICBkZWZhdWx0OiBmYWxzZSxcbiAgcHJvcGVydGllczoge1xuICAgIG1heGJpbnM6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFQsXG4gICAgICBtaW5pbXVtOiAyXG4gICAgfVxuICB9LFxuICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZX0gLy8gVE9ETzogYWRkICdPJyBhZnRlciBmaW5pc2hpbmcgIzgxXG59O1xuXG52YXIgdHlwaWNhbEZpZWxkID0gbWVyZ2UoY2xvbmUoc2NoZW1hLmZpZWxkKSwge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydPJywgJ1EnLCAnVCddXG4gICAgfSxcbiAgICBhZ2dyOiBzY2hlbWEuYWdncixcbiAgICBmbjogc2NoZW1hLmZuLFxuICAgIGJpbjogYmluLFxuICAgIHNjYWxlOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdHlwZTogc2NoZW1hLnNjYWxlX3R5cGUsXG4gICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWUsICdUJzogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgICAgemVybzoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0luY2x1ZGUgemVybycsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZSwgJ1QnOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICBuaWNlOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydzZWNvbmQnLCAnbWludXRlJywgJ2hvdXInLCAnZGF5JywgJ3dlZWsnLCAnbW9udGgnLCAneWVhciddLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J1QnOiB0cnVlfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxudmFyIG9ubHlPcmRpbmFsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgZGltZW5zaW9uOiB0cnVlXG4gIH0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0eXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnTycsJ1EnLCAnVCddIC8vIG9yZGluYWwtb25seSBmaWVsZCBzdXBwb3J0cyBRIHdoZW4gYmluIGlzIGFwcGxpZWQgYW5kIFQgd2hlbiBmbiBpcyBhcHBsaWVkLlxuICAgIH0sXG4gICAgZm46IHNjaGVtYS5mbixcbiAgICBiaW46IGJpbixcbiAgICBhZ2dyOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY291bnQnXSxcbiAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J08nOiB0cnVlfVxuICAgIH1cbiAgfVxufSk7XG5cbnZhciBheGlzTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBheGlzOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3JpZDoge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIHRpdGxlIGZvciB0aGUgYXhpcy4nXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlT2Zmc2V0OiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgYXhpcy4nXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RoZSBmb3JtYXR0aW5nIHBhdHRlcm4gZm9yIGF4aXMgbGFiZWxzLidcbiAgICAgICAgfSxcbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMjUsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzb3J0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgc29ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGRlZmF1bHQ6IFtdLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J08nOiB0cnVlfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsnbmFtZScsICdhZ2dyJ10sXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBhZ2dyOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZW51bTogWydhdmcnLCAnc3VtJywgJ21pbicsICdtYXgnLCAnY291bnQnXVxuICAgICAgICB9LFxuICAgICAgICByZXZlcnNlOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBiYW5kTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgYmFuZDogc2NoZW1hLmJhbmRcbiAgfVxufTtcblxudmFyIGxlZ2VuZE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcHJvcGVydGllczoge1xuICAgIGxlZ2VuZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcblxudmFyIHRleHRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczogeyd0ZXh0JzogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB0ZXh0OiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYWxpZ246IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbGVmdCdcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZWxpbmU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbWlkZGxlJ1xuICAgICAgICB9LFxuICAgICAgICBtYXJnaW46IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogNCxcbiAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGZvbnQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB3ZWlnaHQ6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdib2xkJ10sXG4gICAgICAgICAgZGVmYXVsdDogJ25vcm1hbCdcbiAgICAgICAgfSxcbiAgICAgICAgc2l6ZToge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICBtaW5pbXVtOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGZhbWlseToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdIZWx2ZXRpY2EgTmV1ZSdcbiAgICAgICAgfSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJyxcbiAgICAgICAgICBlbnVtOiBbJ25vcm1hbCcsICdpdGFsaWMnXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgc2l6ZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGJhcjogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgbWluaW11bTogMFxuICAgIH1cbiAgfVxufTtcblxudmFyIGNvbG9yTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnc3RlZWxibHVlJ1xuICAgIH0sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByYW5nZToge1xuICAgICAgICAgIHR5cGU6IFsnc3RyaW5nJywgJ2FycmF5J11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGFscGhhTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgJ3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCwgIC8vIGF1dG9cbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxXG4gICAgfVxuICB9XG59O1xuXG52YXIgc2hhcGVNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2NpcmNsZScsICdzcXVhcmUnLCAnY3Jvc3MnLCAnZGlhbW9uZCcsICd0cmlhbmdsZS11cCcsICd0cmlhbmdsZS1kb3duJ10sXG4gICAgICBkZWZhdWx0OiAnY2lyY2xlJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIGRldGFpbE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGxpbmU6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfVxufTtcblxudmFyIHJvd01peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgaGVpZ2h0OiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAxNTBcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0EgZmxhZyBpbmRpY2F0ZSBpZiBncmlkbGluZXMgc2hvdWxkIGJlIGNyZWF0ZWQgaW4gYWRkaXRpb24gdG8gdGlja3MuJ1xuICAgIH0sXG4gIH1cbn07XG5cbnZhciBjb2xNaXhpbiA9IHtcbiAgcHJvcGVydGllczoge1xuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBkZWZhdWx0OiAxNTBcbiAgICB9LFxuICAgIGF4aXM6IHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbWF4TGFiZWxMZW5ndGg6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogMTIsXG4gICAgICAgICAgbWluaW11bTogMCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ1RydW5jYXRlIGxhYmVscyB0aGF0IGFyZSB0b28gbG9uZy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBmYWNldE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIHRpY2s6IHRydWUsIGJhcjogdHJ1ZSwgbGluZTogdHJ1ZSwgYXJlYTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWUsIHRleHQ6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgcGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgbWF4aW11bTogMSxcbiAgICAgIGRlZmF1bHQ6IDAuMVxuICAgIH1cbiAgfVxufTtcblxudmFyIHJlcXVpcmVkTmFtZVR5cGUgPSB7XG4gIHJlcXVpcmVkOiBbJ25hbWUnLCAndHlwZSddXG59O1xuXG52YXIgbXVsdGlSb2xlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlLFxuICAgIGRpbWVuc2lvbjogdHJ1ZVxuICB9XG59KTtcblxudmFyIHF1YW50aXRhdGl2ZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZSxcbiAgICBkaW1lbnNpb246ICdvcmRpbmFsLW9ubHknIC8vIHVzaW5nIGFscGhhIC8gc2l6ZSB0byBlbmNvZGluZyBjYXRlZ29yeSBsZWFkIHRvIG9yZGVyIGludGVycHJldGF0aW9uXG4gIH1cbn0pO1xuXG52YXIgb25seVF1YW50aXRhdGl2ZUZpZWxkID0gbWVyZ2UoY2xvbmUodHlwaWNhbEZpZWxkKSwge1xuICBzdXBwb3J0ZWRSb2xlOiB7XG4gICAgbWVhc3VyZTogdHJ1ZVxuICB9XG59KTtcblxudmFyIHggPSBtZXJnZShjbG9uZShtdWx0aVJvbGVGaWVsZCksIGF4aXNNaXhpbiwgYmFuZE1peGluLCByZXF1aXJlZE5hbWVUeXBlLCBzb3J0TWl4aW4pO1xudmFyIHkgPSBjbG9uZSh4KTtcblxudmFyIGZhY2V0ID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIHJlcXVpcmVkTmFtZVR5cGUsIGZhY2V0TWl4aW4sIHNvcnRNaXhpbik7XG52YXIgcm93ID0gbWVyZ2UoY2xvbmUoZmFjZXQpLCBheGlzTWl4aW4sIHJvd01peGluKTtcbnZhciBjb2wgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgY29sTWl4aW4pO1xuXG52YXIgc2l6ZSA9IG1lcmdlKGNsb25lKHF1YW50aXRhdGl2ZUZpZWxkKSwgbGVnZW5kTWl4aW4sIHNpemVNaXhpbiwgc29ydE1peGluKTtcbnZhciBjb2xvciA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgbGVnZW5kTWl4aW4sIGNvbG9yTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgYWxwaGEgPSBtZXJnZShjbG9uZShxdWFudGl0YXRpdmVGaWVsZCksIGFscGhhTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgc2hhcGUgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgbGVnZW5kTWl4aW4sIHNoYXBlTWl4aW4sIHNvcnRNaXhpbik7XG52YXIgZGV0YWlsID0gbWVyZ2UoY2xvbmUob25seU9yZGluYWxGaWVsZCksIGRldGFpbE1peGluLCBzb3J0TWl4aW4pO1xuXG4vLyB3ZSBvbmx5IHB1dCBhZ2dyZWdhdGVkIG1lYXN1cmUgaW4gcGl2b3QgdGFibGVcbnZhciB0ZXh0ID0gbWVyZ2UoY2xvbmUob25seVF1YW50aXRhdGl2ZUZpZWxkKSwgdGV4dE1peGluLCBzb3J0TWl4aW4pO1xuXG4vLyBUT0RPIGFkZCBsYWJlbFxuXG52YXIgZmlsdGVyID0ge1xuICB0eXBlOiAnYXJyYXknLFxuICBpdGVtczoge1xuICAgIHR5cGU6ICdvYmplY3QnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIG9wZXJhbmRzOiB7XG4gICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgIGl0ZW1zOiB7XG4gICAgICAgICAgdHlwZTogWydzdHJpbmcnLCAnYm9vbGVhbicsICdpbnRlZ2VyJywgJ251bWJlciddXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVyYXRvcjoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZW51bTogWyc+JywgJz49JywgJz0nLCAnIT0nLCAnPCcsICc8PScsICdub3ROdWxsJ11cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBjZmcgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLy8gdGVtcGxhdGVcbiAgICB3aWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmlld3BvcnQ6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGdyaWRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJyNlZWVlZWUnXG4gICAgfSxcblxuICAgIC8vIGZpbHRlciBudWxsXG4gICAgZmlsdGVyTnVsbDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIE86IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogZmFsc2V9LFxuICAgICAgICBROiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IHRydWV9LFxuICAgICAgICBUOiB7dHlwZTonYm9vbGVhbicsIGRlZmF1bHQ6IHRydWV9XG4gICAgICB9XG4gICAgfSxcbiAgICB0b2dnbGVTb3J0OiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdPJ1xuICAgIH0sXG5cbiAgICAvLyBzaW5nbGUgcGxvdFxuICAgIHNpbmdsZUhlaWdodDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc2luZ2xlV2lkdGg6IHtcbiAgICAgIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgYmFuZFdpZHRoICogKGNhcmRpbmFsaXR5ICsgcGFkZGluZylcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIC8vIGJhbmQgc2l6ZVxuICAgIGxhcmdlQmFuZFNpemU6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIxLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgc21hbGxCYW5kU2l6ZToge1xuICAgICAgLy9zbWFsbCBtdWx0aXBsZXMgb3Igc2luZ2xlIHBsb3Qgd2l0aCBoaWdoIGNhcmRpbmFsaXR5XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAxMixcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIGxhcmdlQmFuZE1heENhcmRpbmFsaXR5OiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAxMFxuICAgIH0sXG4gICAgLy8gc21hbGwgbXVsdGlwbGVzXG4gICAgY2VsbFBhZGRpbmc6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogMC4xXG4gICAgfSxcbiAgICBjZWxsR3JpZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnI2FhYWFhYSdcbiAgICB9LFxuICAgIGNlbGxCYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcbiAgICB9LFxuICAgIHRleHRDZWxsV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDkwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBtYXJrc1xuICAgIHN0cm9rZVdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG5cbiAgICAvLyBzY2FsZXNcbiAgICB0aW1lU2NhbGVMYWJlbExlbmd0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMyxcbiAgICAgIG1pbmltdW06IDBcbiAgICB9LFxuICAgIC8vIG90aGVyXG4gICAgY2hhcmFjdGVyV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDZcbiAgICB9LFxuXG4gICAgLy8gZGF0YSBzb3VyY2VcbiAgICBkYXRhRm9ybWF0VHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ2pzb24nLCAnY3N2J10sXG4gICAgICBkZWZhdWx0OiAnanNvbidcbiAgICB9LFxuICAgIHVzZVZlZ2FTZXJ2ZXI6IHtcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBkYXRhVXJsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmVnYVNlcnZlclRhYmxlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgdmVnYVNlcnZlclVybDoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZWZhdWx0OiAnaHR0cDovL2xvY2FsaG9zdDozMDAxJ1xuICAgIH1cbiAgfVxufTtcblxuLyoqIEB0eXBlIE9iamVjdCBTY2hlbWEgb2YgYSB2ZWdhbGl0ZSBzcGVjaWZpY2F0aW9uICovXG5zY2hlbWEuc2NoZW1hID0ge1xuICAkc2NoZW1hOiAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyxcbiAgZGVzY3JpcHRpb246ICdTY2hlbWEgZm9yIHZlZ2FsaXRlIHNwZWNpZmljYXRpb24nLFxuICB0eXBlOiAnb2JqZWN0JyxcbiAgcmVxdWlyZWQ6IFsnbWFya3R5cGUnLCAnZW5jJywgJ2NmZyddLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbWFya3R5cGU6IHNjaGVtYS5tYXJrdHlwZSxcbiAgICBlbmM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB4OiB4LFxuICAgICAgICB5OiB5LFxuICAgICAgICByb3c6IHJvdyxcbiAgICAgICAgY29sOiBjb2wsXG4gICAgICAgIHNpemU6IHNpemUsXG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICBzaGFwZTogc2hhcGUsXG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICBjZmc6IGNmZ1xuICB9XG59O1xuXG5zY2hlbWEuZW5jVHlwZXMgPSB1dGlsLmtleXMoc2NoZW1hLnNjaGVtYS5wcm9wZXJ0aWVzLmVuYy5wcm9wZXJ0aWVzKTtcblxuLyoqIEluc3RhbnRpYXRlIGEgdmVyYm9zZSB2bCBzcGVjIGZyb20gdGhlIHNjaGVtYSAqL1xuc2NoZW1hLmluc3RhbnRpYXRlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBzY2hlbWEudXRpbC5pbnN0YW50aWF0ZShzY2hlbWEuc2NoZW1hKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzY2hlbWF1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuc2NoZW1hdXRpbC5leHRlbmQgPSBmdW5jdGlvbihpbnN0YW5jZSwgc2NoZW1hKSB7XG4gIHJldHVybiBzY2hlbWF1dGlsLm1lcmdlKHNjaGVtYXV0aWwuaW5zdGFudGlhdGUoc2NoZW1hKSwgaW5zdGFuY2UpO1xufTtcblxuLy8gaW5zdGFudGlhdGUgYSBzY2hlbWFcbnNjaGVtYXV0aWwuaW5zdGFudGlhdGUgPSBmdW5jdGlvbihzY2hlbWEpIHtcbiAgdmFyIHZhbDtcbiAgaWYgKHNjaGVtYS50eXBlID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBpbnN0YW5jZSA9IHt9O1xuICAgIGZvciAodmFyIG5hbWUgaW4gc2NoZW1hLnByb3BlcnRpZXMpIHtcbiAgICAgIHZhbCA9IHNjaGVtYXV0aWwuaW5zdGFudGlhdGUoc2NoZW1hLnByb3BlcnRpZXNbbmFtZV0pO1xuICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGluc3RhbmNlW25hbWVdID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSBpZiAoJ2RlZmF1bHQnIGluIHNjaGVtYSkge1xuICAgIHZhbCA9IHNjaGVtYS5kZWZhdWx0O1xuICAgIHJldHVybiB1dGlsLmlzT2JqZWN0KHZhbCkgPyB1dGlsLmR1cGxpY2F0ZSh2YWwpIDogdmFsO1xuICB9IGVsc2UgaWYgKHNjaGVtYS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG4vLyByZW1vdmUgYWxsIGRlZmF1bHRzIGZyb20gYW4gaW5zdGFuY2VcbnNjaGVtYXV0aWwuc3VidHJhY3QgPSBmdW5jdGlvbihpbnN0YW5jZSwgZGVmYXVsdHMpIHtcbiAgdmFyIGNoYW5nZXMgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBpbnN0YW5jZSkge1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1twcm9wXTtcbiAgICB2YXIgaW5zID0gaW5zdGFuY2VbcHJvcF07XG4gICAgLy8gTm90ZTogZG9lcyBub3QgcHJvcGVybHkgc3VidHJhY3QgYXJyYXlzXG4gICAgaWYgKCFkZWZhdWx0cyB8fCBkZWYgIT09IGlucykge1xuICAgICAgaWYgKHR5cGVvZiBpbnMgPT09ICdvYmplY3QnICYmICF1dGlsLmlzQXJyYXkoaW5zKSAmJiBkZWYpIHtcbiAgICAgICAgdmFyIGMgPSBzY2hlbWF1dGlsLnN1YnRyYWN0KGlucywgZGVmKTtcbiAgICAgICAgaWYgKCFpc0VtcHR5KGMpKVxuICAgICAgICAgIGNoYW5nZXNbcHJvcF0gPSBjO1xuICAgICAgfSBlbHNlIGlmICghdXRpbC5pc0FycmF5KGlucykgfHwgaW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2hhbmdlc1twcm9wXSA9IGlucztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoYW5nZXM7XG59O1xuXG5zY2hlbWF1dGlsLm1lcmdlID0gZnVuY3Rpb24oLypkZXN0Kiwgc3JjMCwgc3JjMSwgLi4uKi8pe1xuICB2YXIgZGVzdCA9IGFyZ3VtZW50c1swXTtcbiAgZm9yICh2YXIgaT0xIDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0ID0gbWVyZ2UoZGVzdCwgYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gZGVzdDtcbn07XG5cbi8vIHJlY3Vyc2l2ZWx5IG1lcmdlcyBzcmMgaW50byBkZXN0XG5mdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgIT09ICdvYmplY3QnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgZm9yICh2YXIgcCBpbiBzcmMpIHtcbiAgICBpZiAoIXNyYy5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChzcmNbcF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc3JjW3BdICE9PSAnb2JqZWN0JyB8fCBzcmNbcF0gPT09IG51bGwpIHtcbiAgICAgIGRlc3RbcF0gPSBzcmNbcF07XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzdFtwXSAhPT0gJ29iamVjdCcgfHwgZGVzdFtwXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IG1lcmdlKHNyY1twXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgPyBbXSA6IHt9LCBzcmNbcF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShkZXN0W3BdLCBzcmNbcF0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdDtcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudXRpbC5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBrID0gW10sIHg7XG4gIGZvciAoeCBpbiBvYmopIGsucHVzaCh4KTtcbiAgcmV0dXJuIGs7XG59O1xuXG51dGlsLnZhbHMgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHYgPSBbXSwgeDtcbiAgZm9yICh4IGluIG9iaikgdi5wdXNoKG9ialt4XSk7XG4gIHJldHVybiB2O1xufTtcblxudXRpbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgIHN0ZXAgPSAxO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgc3RvcCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoKHN0b3AgLSBzdGFydCkgLyBzdGVwID09IEluZmluaXR5KSB0aHJvdyBuZXcgRXJyb3IoJ2luZmluaXRlIHJhbmdlJyk7XG4gIHZhciByYW5nZSA9IFtdLCBpID0gLTEsIGo7XG4gIGlmIChzdGVwIDwgMCkgd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA+IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIGVsc2Ugd2hpbGUgKChqID0gc3RhcnQgKyBzdGVwICogKytpKSA8IHN0b3ApIHJhbmdlLnB1c2goaik7XG4gIHJldHVybiByYW5nZTtcbn07XG5cbnV0aWwuZmluZCA9IGZ1bmN0aW9uKGxpc3QsIHBhdHRlcm4pIHtcbiAgdmFyIGwgPSBsaXN0LmZpbHRlcihmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHhbcGF0dGVybi5uYW1lXSA9PT0gcGF0dGVybi52YWx1ZTtcbiAgfSk7XG4gIHJldHVybiBsLmxlbmd0aCAmJiBsWzBdIHx8IG51bGw7XG59O1xuXG51dGlsLmlzaW4gPSBmdW5jdGlvbihpdGVtLCBhcnJheSkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtKSAhPT0gLTE7XG59O1xuXG51dGlsLnVuaXEgPSBmdW5jdGlvbihkYXRhLCBmaWVsZCkge1xuICB2YXIgbWFwID0ge30sIGNvdW50ID0gMCwgaSwgaztcbiAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICBrID0gZGF0YVtpXVtmaWVsZF07XG4gICAgaWYgKCFtYXBba10pIHtcbiAgICAgIG1hcFtrXSA9IDE7XG4gICAgICBjb3VudCArPSAxO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY291bnQ7XG59O1xuXG52YXIgaXNOdW1iZXIgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG59O1xuXG4vLyB0cnkgcGFyc2luZyB0byBudW1iZXJcbnV0aWwubnVtYmVycyA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgbnVtcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc051bWJlcih2YWx1ZXNbaV0pKSB7XG4gICAgICBudW1zLnB1c2goK3ZhbHVlc1tpXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBudW1zO1xufTtcblxuLy8gdHJ5IHRvIHBhcnNlIGFzIGRhdGVcbnV0aWwuZGF0ZXMgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIGRhdGVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRhdGUgPSBEYXRlLnBhcnNlKHZhbHVlc1tpXSk7XG4gICAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgICAgZGF0ZXMucHVzaChuZXcgRGF0ZShkYXRlKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkYXRlcztcbn07XG5cbnV0aWwubWVkaWFuID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhbHVlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtyZXR1cm4gYSAtIGI7fSk7XG4gIHZhciBoYWxmID0gTWF0aC5mbG9vcih2YWx1ZXMubGVuZ3RoLzIpO1xuICBpZiAodmFsdWVzLmxlbmd0aCAlIDIpIHtcbiAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAodmFsdWVzW2hhbGYtMV0gKyB2YWx1ZXNbaGFsZl0pIC8gMi4wO1xuICB9XG59O1xuXG51dGlsLm1lYW4gPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIHZhbHVlcy5yZWR1Y2UoZnVuY3Rpb24odiwgcikge3JldHVybiB2ICsgcjt9LCAwKSAvIHZhbHVlcy5sZW5ndGg7XG59O1xuXG51dGlsLnZhcmlhbmNlID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBhdmcgPSB1dGlsLm1lYW4odmFsdWVzKTtcbiAgdmFyIGRpZmZzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgZGlmZnMucHVzaChNYXRoLnBvdygodmFsdWVzW2ldIC0gYXZnKSwgMikpO1xuICB9XG4gIHJldHVybiB1dGlsLm1lYW4oZGlmZnMpO1xufTtcblxudXRpbC5zdGFibGVzb3J0ID0gZnVuY3Rpb24oYXJyYXksIHNvcnRCeSwga2V5Rm4pIHtcbiAgdmFyIGluZGljZXMgPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHYsIGkpIHtcbiAgICBpbmRpY2VzW2tleUZuKHYpXSA9IGk7XG4gIH0pO1xuXG4gIGFycmF5LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHZhciBzYSA9IHNvcnRCeShhKSxcbiAgICAgIHNiID0gc29ydEJ5KGIpO1xuXG4gICAgcmV0dXJuIHNhPHNiID8gLTEgOiBzYT5zYiA/IDEgOiAoaW5kaWNlc1trZXlGbihhKV0gLSBpbmRpY2VzW2tleUZuKGIpXSk7XG4gIH0pO1xuICByZXR1cm4gYXJyYXk7XG59O1xuXG51dGlsLnN0ZGV2ID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHJldHVybiBNYXRoLnNxcnQodXRpbC52YXJpYW5jZSh2YWx1ZXMpKTtcbn07XG5cbnV0aWwuc2tldyA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgYXZnID0gdXRpbC5tZWFuKHZhbHVlcyksXG4gICAgbWVkID0gdXRpbC5tZWRpYW4odmFsdWVzKSxcbiAgICBzdGQgPSB1dGlsLnN0ZGV2KHZhbHVlcyk7XG4gIHJldHVybiAxLjAgKiAoYXZnIC0gbWVkKSAvIHN0ZDtcbn07XG5cbi8vIHBhcnNlcyBhIHN0cmluZyB0byBkYXRlIG9yIG51bWJlclxudXRpbC5wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmIChpc051bWJlcih2YWx1ZSkpIHtcbiAgICByZXR1cm4gK3ZhbHVlO1xuICB9XG5cbiAgdmFyIGRhdGUgPSBEYXRlLnBhcnNlKHZhbHVlKTtcbiAgaWYgKCFpc05hTihkYXRlKSkge1xuICAgIHJldHVybiAobmV3IERhdGUoZGF0ZSkpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbnV0aWwubWlubWF4ID0gZnVuY3Rpb24oZGF0YSkge1xuICB2YXIgc3RhdHMgPSB7bWluOiArSW5maW5pdHksIG1heDogLUluZmluaXR5fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHYgPSBkYXRhW2ldO1xuICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICBpZiAodiA+IHN0YXRzLm1heCB8fCBzdGF0cy5tYXggPT09IC1JbmZpbml0eSkgc3RhdHMubWF4ID0gdjtcbiAgICAgIGlmICh2IDwgc3RhdHMubWluIHx8IHN0YXRzLm1pbiA9PT0gK0luZmluaXR5KSBzdGF0cy5taW4gPSB2O1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RhdHM7XG59O1xuXG51dGlsLmR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKTtcbn07XG5cbnV0aWwuaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59O1xuXG51dGlsLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG51dGlsLmFycmF5ID0gZnVuY3Rpb24oeCkge1xuICByZXR1cm4geCA/ICh1dGlsLmlzQXJyYXkoeCkgPyB4IDogW3hdKSA6IFtdO1xufTtcblxudXRpbC5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmouZm9yRWFjaCkge1xuICAgIG9iai5mb3JFYWNoLmNhbGwodGhpc0FyZywgZik7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGsgLCBvYmopO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5yZWR1Y2UgPSBmdW5jdGlvbihvYmosIGYsIGluaXQsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5yZWR1Y2UpIHtcbiAgICByZXR1cm4gb2JqLnJlZHVjZS5jYWxsKHRoaXNBcmcsIGYsIGluaXQpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICBpbml0ID0gZi5jYWxsKHRoaXNBcmcsIGluaXQsIG9ialtrXSwgaywgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIGluaXQ7XG4gIH1cbn07XG5cbnV0aWwubWFwID0gZnVuY3Rpb24ob2JqLCBmLCB0aGlzQXJnKSB7XG4gIGlmIChvYmoubWFwKSB7XG4gICAgcmV0dXJuIG9iai5tYXAuY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIG91dHB1dC5wdXNoKCBmLmNhbGwodGhpc0FyZywgb2JqW2tdLCBrLCBvYmopKTtcbiAgICB9XG4gIH1cbn07XG5cbnV0aWwuYW55ID0gZnVuY3Rpb24oYXJyLCBmKSB7XG4gIHZhciBpID0gMCwgaztcbiAgZm9yIChrIGluIGFycikge1xuICAgIGlmIChmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxudXRpbC5hbGwgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKCFmKGFycltrXSwgaywgaSsrKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuXG51dGlsLmNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgPCBiKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGEgPiBiKSB7XG4gICAgcmV0dXJuIDE7XG4gIH0gZWxzZSBpZiAoYSA+PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCAmJiBiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0gZWxzZSBpZiAoYSA9PT0gbnVsbCkge1xuICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmIChiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIE5hTjtcbn07XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uKGRlc3QsIHNyYykge1xuICByZXR1cm4gdXRpbC5rZXlzKHNyYykucmVkdWNlKGZ1bmN0aW9uKGMsIGspIHtcbiAgICBjW2tdID0gc3JjW2tdO1xuICAgIHJldHVybiBjO1xuICB9LCBkZXN0KTtcbn07XG5cbnV0aWwubWVyZ2UgPSBmdW5jdGlvbigvKmRlc3QqLCBzcmMwLCBzcmMxLCAuLi4qLyl7XG4gIHZhciBkZXN0ID0gYXJndW1lbnRzWzBdO1xuICBmb3IgKHZhciBpPTEgOyBpPGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBtZXJnZShkZXN0LCBhcmd1bWVudHNbaV0pO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcblxudXRpbC5nZXRiaW5zID0gZnVuY3Rpb24oc3RhdHMsIG1heGJpbnMpIHtcbiAgcmV0dXJuIHV0aWwuYmlucyh7XG4gICAgbWluOiBzdGF0cy5taW4sXG4gICAgbWF4OiBzdGF0cy5tYXgsXG4gICAgbWF4YmluczogbWF4Ymluc1xuICB9KTtcbn07XG5cblxudXRpbC5iaW5zID0gZnVuY3Rpb24ob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICAvLyBkZXRlcm1pbmUgcmFuZ2VcbiAgdmFyIG1heGIgPSBvcHQubWF4YmlucyB8fCAxMDI0LFxuICAgICAgYmFzZSA9IG9wdC5iYXNlIHx8IDEwLFxuICAgICAgZGl2ID0gb3B0LmRpdiB8fCBbNSwgMl0sXG4gICAgICBtaW5zID0gb3B0Lm1pbnN0ZXAgfHwgMCxcbiAgICAgIGxvZ2IgPSBNYXRoLmxvZyhiYXNlKSxcbiAgICAgIGxldmVsID0gTWF0aC5jZWlsKE1hdGgubG9nKG1heGIpIC8gbG9nYiksXG4gICAgICBtaW4gPSBvcHQubWluLFxuICAgICAgbWF4ID0gb3B0Lm1heCxcbiAgICAgIHNwYW4gPSBtYXggLSBtaW4sXG4gICAgICBzdGVwID0gTWF0aC5tYXgobWlucywgTWF0aC5wb3coYmFzZSwgTWF0aC5yb3VuZChNYXRoLmxvZyhzcGFuKSAvIGxvZ2IpIC0gbGV2ZWwpKSxcbiAgICAgIG5iaW5zID0gTWF0aC5jZWlsKHNwYW4gLyBzdGVwKSxcbiAgICAgIHByZWNpc2lvbiwgdiwgaSwgZXBzO1xuXG4gIGlmIChvcHQuc3RlcCkge1xuICAgIHN0ZXAgPSBvcHQuc3RlcDtcbiAgfSBlbHNlIGlmIChvcHQuc3RlcHMpIHtcbiAgICAvLyBpZiBwcm92aWRlZCwgbGltaXQgY2hvaWNlIHRvIGFjY2VwdGFibGUgc3RlcCBzaXplc1xuICAgIHN0ZXAgPSBvcHQuc3RlcHNbTWF0aC5taW4oXG4gICAgICAgIG9wdC5zdGVwcy5sZW5ndGggLSAxLFxuICAgICAgICB1dGlsX2Jpc2VjdExlZnQob3B0LnN0ZXBzLCBzcGFuIC8gbWF4YiwgMCwgb3B0LnN0ZXBzLmxlbmd0aClcbiAgICApXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBpbmNyZWFzZSBzdGVwIHNpemUgaWYgdG9vIG1hbnkgYmluc1xuICAgIGRvIHtcbiAgICAgIHN0ZXAgKj0gYmFzZTtcbiAgICAgIG5iaW5zID0gTWF0aC5jZWlsKHNwYW4gLyBzdGVwKTtcbiAgICB9IHdoaWxlIChuYmlucyA+IG1heGIpO1xuXG4gICAgLy8gZGVjcmVhc2Ugc3RlcCBzaXplIGlmIGFsbG93ZWRcbiAgICBmb3IgKGkgPSAwOyBpIDwgZGl2Lmxlbmd0aDsgKytpKSB7XG4gICAgICB2ID0gc3RlcCAvIGRpdltpXTtcbiAgICAgIGlmICh2ID49IG1pbnMgJiYgc3BhbiAvIHYgPD0gbWF4Yikge1xuICAgICAgICBzdGVwID0gdjtcbiAgICAgICAgbmJpbnMgPSBNYXRoLmNlaWwoc3BhbiAvIHN0ZXApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHVwZGF0ZSBwcmVjaXNpb24sIG1pbiBhbmQgbWF4XG4gIHYgPSBNYXRoLmxvZyhzdGVwKTtcbiAgcHJlY2lzaW9uID0gdiA+PSAwID8gMCA6IH5+KC12IC8gbG9nYikgKyAxO1xuICBlcHMgPSAobWluPDAgPyAtMSA6IDEpICogTWF0aC5wb3coYmFzZSwgLXByZWNpc2lvbiAtIDEpO1xuICBtaW4gPSBNYXRoLm1pbihtaW4sIE1hdGguZmxvb3IobWluIC8gc3RlcCArIGVwcykgKiBzdGVwKTtcbiAgbWF4ID0gTWF0aC5jZWlsKG1heCAvIHN0ZXApICogc3RlcDtcblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBtaW4sXG4gICAgc3RvcDogbWF4LFxuICAgIHN0ZXA6IHN0ZXAsXG4gICAgdW5pdDogcHJlY2lzaW9uXG4gIH07XG59O1xuXG5mdW5jdGlvbiB1dGlsX2Jpc2VjdExlZnQoYSwgeCwgbG8sIGhpKSB7XG4gIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgaWYgKHV0aWwuY21wKGFbbWlkXSwgeCkgPCAwKSB7IGxvID0gbWlkICsgMTsgfVxuICAgIGVsc2UgeyBoaSA9IG1pZDsgfVxuICB9XG4gIHJldHVybiBsbztcbn1cblxuLyoqXG4gKiB4W3BbMF1dLi4uW3Bbbl1dID0gdmFsXG4gKiBAcGFyYW0gbm9hdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuc2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgdmFsLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoLTE7ICsraSkge1xuICAgIGlmICghbm9hdWdtZW50ICYmICEocFtpXSBpbiB4KSl7XG4gICAgICB4ID0geFtwW2ldXSA9IHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICB4ID0geFtwW2ldXTtcbiAgICB9XG4gIH1cbiAgeFtwW2ldXSA9IHZhbDtcbn07XG5cblxuLyoqXG4gKiByZXR1cm5zIHhbcFswXV0uLi5bcFtuXV1cbiAqIEBwYXJhbSBhdWdtZW50IGRldGVybWluZSB3aGV0aGVyIG5ldyBvYmplY3Qgc2hvdWxkIGJlIGFkZGVkIGZcbiAqIG9yIG5vbi1leGlzdGluZyBwcm9wZXJ0aWVzIGFsb25nIHRoZSBwYXRoXG4gKi9cbnV0aWwuZ2V0dGVyID0gZnVuY3Rpb24oeCwgcCwgbm9hdWdtZW50KSB7XG4gIGZvciAodmFyIGk9MDsgaTxwLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4geDtcbn07XG5cbnV0aWwudHJ1bmNhdGUgPSBmdW5jdGlvbihzLCBsZW5ndGgsIHBvcywgd29yZCwgZWxsaXBzaXMpIHtcbiAgdmFyIGxlbiA9IHMubGVuZ3RoO1xuICBpZiAobGVuIDw9IGxlbmd0aCkgcmV0dXJuIHM7XG4gIGVsbGlwc2lzID0gZWxsaXBzaXMgfHwgXCIuLi5cIjtcbiAgdmFyIGwgPSBNYXRoLm1heCgwLCBsZW5ndGggLSBlbGxpcHNpcy5sZW5ndGgpO1xuXG4gIHN3aXRjaCAocG9zKSB7XG4gICAgY2FzZSBcImxlZnRcIjpcbiAgICAgIHJldHVybiBlbGxpcHNpcyArICh3b3JkID8gdmdfdHJ1bmNhdGVPbldvcmQocyxsLDEpIDogcy5zbGljZShsZW4tbCkpO1xuICAgIGNhc2UgXCJtaWRkbGVcIjpcbiAgICBjYXNlIFwiY2VudGVyXCI6XG4gICAgICB2YXIgbDEgPSBNYXRoLmNlaWwobC8yKSwgbDIgPSBNYXRoLmZsb29yKGwvMik7XG4gICAgICByZXR1cm4gKHdvcmQgPyB2Z190cnVuY2F0ZU9uV29yZChzLGwxKSA6IHMuc2xpY2UoMCxsMSkpICsgZWxsaXBzaXMgK1xuICAgICAgICAod29yZCA/IHZnX3RydW5jYXRlT25Xb3JkKHMsbDIsMSkgOiBzLnNsaWNlKGxlbi1sMikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKHdvcmQgPyB2Z190cnVuY2F0ZU9uV29yZChzLGwpIDogcy5zbGljZSgwLGwpKSArIGVsbGlwc2lzO1xuICB9XG59O1xuXG5mdW5jdGlvbiB2Z190cnVuY2F0ZU9uV29yZChzLCBsZW4sIHJldikge1xuICB2YXIgY250ID0gMCwgdG9rID0gcy5zcGxpdCh2Z190cnVuY2F0ZV93b3JkX3JlKTtcbiAgaWYgKHJldikge1xuICAgIHMgPSAodG9rID0gdG9rLnJldmVyc2UoKSlcbiAgICAgIC5maWx0ZXIoZnVuY3Rpb24odykgeyBjbnQgKz0gdy5sZW5ndGg7IHJldHVybiBjbnQgPD0gbGVuOyB9KVxuICAgICAgLnJldmVyc2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzID0gdG9rLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pO1xuICB9XG4gIHJldHVybiBzLmxlbmd0aCA/IHMuam9pbihcIlwiKS50cmltKCkgOiB0b2tbMF0uc2xpY2UoMCwgbGVuKTtcbn1cblxudmFyIHZnX3RydW5jYXRlX3dvcmRfcmUgPSAvKFtcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRFxcdTAwMjBcXHUwMEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MjAyOFxcdTIwMjlcXHUzMDAwXFx1RkVGRl0pLztcblxuXG51dGlsLmVycm9yID0gZnVuY3Rpb24obXNnKSB7XG4gIGNvbnNvbGUuZXJyb3IoJ1tWTCBFcnJvcl0nLCBtc2cpO1xufTtcblxuIl19
