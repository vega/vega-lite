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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvdmwiLCJzcmMvRW5jb2RpbmcuanMiLCJzcmMvY29tcGlsZS9hZ2dyZWdhdGVzLmpzIiwic3JjL2NvbXBpbGUvYXhpcy5qcyIsInNyYy9jb21waWxlL2Jpbm5pbmcuanMiLCJzcmMvY29tcGlsZS9jb21waWxlLmpzIiwic3JjL2NvbXBpbGUvZmFjZXRpbmcuanMiLCJzcmMvY29tcGlsZS9maWx0ZXIuanMiLCJzcmMvY29tcGlsZS9ncm91cC5qcyIsInNyYy9jb21waWxlL2xheW91dC5qcyIsInNyYy9jb21waWxlL2xlZ2VuZC5qcyIsInNyYy9jb21waWxlL21hcmtzLmpzIiwic3JjL2NvbXBpbGUvc2NhbGUuanMiLCJzcmMvY29tcGlsZS9zb3J0LmpzIiwic3JjL2NvbXBpbGUvc3RhY2tpbmcuanMiLCJzcmMvY29tcGlsZS9zdHlsZS5qcyIsInNyYy9jb21waWxlL3N1YmZhY2V0aW5nLmpzIiwic3JjL2NvbXBpbGUvdGVtcGxhdGUuanMiLCJzcmMvY29tcGlsZS90aW1lLmpzIiwic3JjL2NvbnN0cy5qcyIsInNyYy9kYXRhLmpzIiwic3JjL2VuYy5qcyIsInNyYy9maWVsZC5qcyIsInNyYy9nbG9iYWxzLmpzIiwic3JjL3NjaGVtYS9zY2hlbWEuanMiLCJzcmMvc2NoZW1hL3NjaGVtYXV0aWwuanMiLCJzcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gICAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKTtcblxudmFyIHZsID0gdXRpbC5tZXJnZShjb25zdHMsIHV0aWwpO1xuXG52bC5FbmNvZGluZyA9IHJlcXVpcmUoJy4vRW5jb2RpbmcnKTtcbnZsLmNvbXBpbGUgPSByZXF1aXJlKCcuL2NvbXBpbGUvY29tcGlsZScpO1xudmwuZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpO1xudmwuZmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJyk7XG52bC5lbmMgPSByZXF1aXJlKCcuL2VuYycpO1xudmwuc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB2bDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKSxcbiAgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB2bGVuYyA9IHJlcXVpcmUoJy4vZW5jJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICB0aW1lID0gcmVxdWlyZSgnLi9jb21waWxlL3RpbWUnKTtcblxudmFyIEVuY29kaW5nID0gbW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG5cbiAgZnVuY3Rpb24gRW5jb2RpbmcobWFya3R5cGUsIGVuYywgY29uZmlnLCBmaWx0ZXIsIHRoZW1lKSB7XG4gICAgdmFyIGRlZmF1bHRzID0gc2NoZW1hLmluc3RhbnRpYXRlKCk7XG5cbiAgICB2YXIgc3BlYyA9IHtcbiAgICAgIG1hcmt0eXBlOiBtYXJrdHlwZSxcbiAgICAgIGVuYzogZW5jLFxuICAgICAgY2ZnOiBjb25maWcsXG4gICAgICBmaWx0ZXI6IGZpbHRlciB8fCBbXVxuICAgIH07XG5cbiAgICAvLyB0eXBlIHRvIGJpdGNvZGVcbiAgICBmb3IgKHZhciBlIGluIGRlZmF1bHRzLmVuYykge1xuICAgICAgZGVmYXVsdHMuZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVzW2RlZmF1bHRzLmVuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICB2YXIgc3BlY0V4dGVuZGVkID0gc2NoZW1hLnV0aWwubWVyZ2UoZGVmYXVsdHMsIHRoZW1lIHx8IHt9LCBzcGVjKSA7XG5cbiAgICB0aGlzLl9tYXJrdHlwZSA9IHNwZWNFeHRlbmRlZC5tYXJrdHlwZTtcbiAgICB0aGlzLl9lbmMgPSBzcGVjRXh0ZW5kZWQuZW5jO1xuICAgIHRoaXMuX2NmZyA9IHNwZWNFeHRlbmRlZC5jZmc7XG4gICAgdGhpcy5fZmlsdGVyID0gc3BlY0V4dGVuZGVkLmZpbHRlcjtcbiAgfVxuXG4gIHZhciBwcm90byA9IEVuY29kaW5nLnByb3RvdHlwZTtcblxuICBwcm90by5tYXJrdHlwZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXJrdHlwZTtcbiAgfTtcblxuICBwcm90by5pcyA9IGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya3R5cGUgPT09IG07XG4gIH07XG5cbiAgcHJvdG8uaGFzID0gZnVuY3Rpb24oZW5jVHlwZSkge1xuICAgIC8vIGVxdWl2YWxlbnQgdG8gY2FsbGluZyB2bGVuYy5oYXModGhpcy5fZW5jLCBlbmNUeXBlKVxuICAgIHJldHVybiB0aGlzLl9lbmNbZW5jVHlwZV0ubmFtZSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIHByb3RvLmVuYyA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdO1xuICB9O1xuXG4gIHByb3RvLmZpbHRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXJOdWxsID0gW10sXG4gICAgICBmaWVsZHMgPSB0aGlzLmZpZWxkcygpLFxuICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICB1dGlsLmZvckVhY2goZmllbGRzLCBmdW5jdGlvbihmaWVsZExpc3QsIGZpZWxkTmFtZSkge1xuICAgICAgaWYgKGZpZWxkTmFtZSA9PT0gJyonKSByZXR1cm47IC8vY291bnRcblxuICAgICAgaWYgKChzZWxmLmNvbmZpZygnZmlsdGVyTnVsbCcpLlEgJiYgZmllbGRMaXN0LmNvbnRhaW5zVHlwZVtRXSkgfHxcbiAgICAgICAgICAoc2VsZi5jb25maWcoJ2ZpbHRlck51bGwnKS5UICYmIGZpZWxkTGlzdC5jb250YWluc1R5cGVbVF0pIHx8XG4gICAgICAgICAgKHNlbGYuY29uZmlnKCdmaWx0ZXJOdWxsJykuTyAmJiBmaWVsZExpc3QuY29udGFpbnNUeXBlW09dKSkge1xuICAgICAgICBmaWx0ZXJOdWxsLnB1c2goe1xuICAgICAgICAgIG9wZXJhbmRzOiBbZmllbGROYW1lXSxcbiAgICAgICAgICBvcGVyYXRvcjogJ25vdE51bGwnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZpbHRlck51bGwuY29uY2F0KHRoaXMuX2ZpbHRlcik7XG4gIH07XG5cbiAgLy8gZ2V0IFwiZmllbGRcIiBwcm9wZXJ0eSBmb3IgdmVnYVxuICBwcm90by5maWVsZCA9IGZ1bmN0aW9uKHgsIG5vZGF0YSwgbm9mbikge1xuICAgIGlmICghdGhpcy5oYXMoeCkpIHJldHVybiBudWxsO1xuXG4gICAgdmFyIGYgPSAobm9kYXRhID8gJycgOiAnZGF0YS4nKTtcblxuICAgIGlmICh0aGlzLl9lbmNbeF0uYWdnciA9PT0gJ2NvdW50Jykge1xuICAgICAgcmV0dXJuIGYgKyAnY291bnQnO1xuICAgIH0gZWxzZSBpZiAoIW5vZm4gJiYgdGhpcy5fZW5jW3hdLmJpbikge1xuICAgICAgcmV0dXJuIGYgKyAnYmluXycgKyB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9IGVsc2UgaWYgKCFub2ZuICYmIHRoaXMuX2VuY1t4XS5hZ2dyKSB7XG4gICAgICByZXR1cm4gZiArIHRoaXMuX2VuY1t4XS5hZ2dyICsgJ18nICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfSBlbHNlIGlmICghbm9mbiAmJiB0aGlzLl9lbmNbeF0uZm4pIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW3hdLmZuICsgJ18nICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmICsgdGhpcy5fZW5jW3hdLm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLmZpZWxkTmFtZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLm5hbWU7XG4gIH07XG5cbiAgLypcbiAgICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAgICovXG4gIHByb3RvLmZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2bGVuYy5maWVsZHModGhpcy5fZW5jKTtcbiAgfTtcblxuICBwcm90by5maWVsZFRpdGxlID0gZnVuY3Rpb24oeCkge1xuICAgIGlmICh2bGZpZWxkLmlzQ291bnQodGhpcy5fZW5jW3hdKSkge1xuICAgICAgcmV0dXJuIHZsZmllbGQuY291bnQuZGlzcGxheU5hbWU7XG4gICAgfVxuICAgIHZhciBmbiA9IHRoaXMuX2VuY1t4XS5hZ2dyIHx8IHRoaXMuX2VuY1t4XS5mbiB8fCAodGhpcy5fZW5jW3hdLmJpbiAmJiBcImJpblwiKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHJldHVybiBmbi50b1VwcGVyQ2FzZSgpICsgJygnICsgdGhpcy5fZW5jW3hdLm5hbWUgKyAnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbmNbeF0ubmFtZTtcbiAgICB9XG4gIH07XG5cbiAgcHJvdG8uc2NhbGUgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5zY2FsZSB8fCB7fTtcbiAgfTtcblxuICBwcm90by5heGlzID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uYXhpcyB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kID0gZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLl9lbmNbeF0uYmFuZCB8fCB7fTtcbiAgfTtcblxuICBwcm90by5iYW5kU2l6ZSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHVzZVNtYWxsQmFuZCkge1xuICAgIHVzZVNtYWxsQmFuZCA9IHVzZVNtYWxsQmFuZCB8fFxuICAgICAgLy9pc0JhbmRJblNtYWxsTXVsdGlwbGVzXG4gICAgICAoZW5jVHlwZSA9PT0gWSAmJiB0aGlzLmhhcyhST1cpICYmIHRoaXMuaGFzKFkpKSB8fFxuICAgICAgKGVuY1R5cGUgPT09IFggJiYgdGhpcy5oYXMoQ09MKSAmJiB0aGlzLmhhcyhYKSk7XG5cbiAgICAvLyBpZiBiYW5kLnNpemUgaXMgZXhwbGljaXRseSBzcGVjaWZpZWQsIGZvbGxvdyB0aGUgc3BlY2lmaWNhdGlvbiwgb3RoZXJ3aXNlIGRyYXcgdmFsdWUgZnJvbSBjb25maWcuXG4gICAgcmV0dXJuIHRoaXMuYmFuZChlbmNUeXBlKS5zaXplIHx8XG4gICAgICB0aGlzLmNvbmZpZyh1c2VTbWFsbEJhbmQgPyAnc21hbGxCYW5kU2l6ZScgOiAnbGFyZ2VCYW5kU2l6ZScpO1xuICB9O1xuXG4gIHByb3RvLmFnZ3IgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5hZ2dyO1xuICB9O1xuXG4gIC8vIHJldHVybnMgZmFsc2UgaWYgYmlubmluZyBpcyBkaXNhYmxlZCwgb3RoZXJ3aXNlIGFuIG9iamVjdCB3aXRoIGJpbm5pbmcgcHJvcGVydGllc1xuICBwcm90by5iaW4gPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIGJpbiA9IHRoaXMuX2VuY1t4XS5iaW47XG4gICAgaWYgKGJpbiA9PT0ge30pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGJpbiA9PT0gdHJ1ZSlcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heGJpbnM6IHNjaGVtYS5NQVhCSU5TX0RFRkFVTFRcbiAgICAgIH07XG4gICAgcmV0dXJuIGJpbjtcbiAgfTtcblxuICBwcm90by5sZWdlbmQgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS5sZWdlbmQ7XG4gIH07XG5cbiAgcHJvdG8udmFsdWUgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuY1t4XS52YWx1ZTtcbiAgfTtcblxuICBwcm90by5mbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5jW3hdLmZuO1xuICB9O1xuXG4gIHByb3RvLnNvcnQgPSBmdW5jdGlvbihldCwgc3RhdHMpIHtcbiAgICB2YXIgc29ydCA9IHRoaXMuX2VuY1tldF0uc29ydCxcbiAgICAgIGVuYyA9IHRoaXMuX2VuYyxcbiAgICAgIGlzVHlwZSA9IHZsZmllbGQuaXNUeXBlLmJ5Q29kZTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdzb3J0OicsIHNvcnQsICdzdXBwb3J0OicsIEVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydCh7ZW5jOnRoaXMuX2VuY30sIHN0YXRzKSAsICd0b2dnbGU6JywgdGhpcy5jb25maWcoJ3RvZ2dsZVNvcnQnKSlcblxuICAgIGlmICgoIXNvcnQgfHwgc29ydC5sZW5ndGg9PT0wKSAmJlxuICAgICAgICBFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQoe2VuYzp0aGlzLl9lbmN9LCBzdGF0cywgdHJ1ZSkgJiYgLy9IQUNLXG4gICAgICAgIHRoaXMuY29uZmlnKCd0b2dnbGVTb3J0JykgPT09ICdRJ1xuICAgICAgKSB7XG4gICAgICB2YXIgcUZpZWxkID0gaXNUeXBlKGVuYy54LCBPKSA/IGVuYy55IDogZW5jLng7XG5cbiAgICAgIGlmIChpc1R5cGUoZW5jW2V0XSwgTykpIHtcbiAgICAgICAgc29ydCA9IFt7XG4gICAgICAgICAgbmFtZTogcUZpZWxkLm5hbWUsXG4gICAgICAgICAgYWdncjogcUZpZWxkLmFnZ3IsXG4gICAgICAgICAgdHlwZTogcUZpZWxkLnR5cGUsXG4gICAgICAgICAgcmV2ZXJzZTogdHJ1ZVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc29ydDtcbiAgfTtcblxuICBwcm90by5hbnkgPSBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIHV0aWwuYW55KHRoaXMuX2VuYywgZik7XG4gIH07XG5cbiAgcHJvdG8uYWxsID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB1dGlsLmFsbCh0aGlzLl9lbmMsIGYpO1xuICB9O1xuXG4gIHByb3RvLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB1dGlsLmtleXModGhpcy5fZW5jKS5sZW5ndGg7XG4gIH07XG5cbiAgcHJvdG8ubWFwID0gZnVuY3Rpb24oZikge1xuICAgIHJldHVybiB2bGVuYy5tYXAodGhpcy5fZW5jLCBmKTtcbiAgfTtcblxuICBwcm90by5yZWR1Y2UgPSBmdW5jdGlvbihmLCBpbml0KSB7XG4gICAgcmV0dXJuIHZsZW5jLnJlZHVjZSh0aGlzLl9lbmMsIGYsIGluaXQpO1xuICB9O1xuXG4gIHByb3RvLmZvckVhY2ggPSBmdW5jdGlvbihmKSB7XG4gICAgcmV0dXJuIHZsZW5jLmZvckVhY2godGhpcy5fZW5jLCBmKTtcbiAgfTtcblxuICBwcm90by50eXBlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZXQpID8gdGhpcy5fZW5jW2V0XS50eXBlIDogbnVsbDtcbiAgfTtcblxuICBwcm90by5yb2xlID0gZnVuY3Rpb24oZXQpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZXQpID8gdmxmaWVsZC5yb2xlKHRoaXMuX2VuY1tldF0pIDogbnVsbDtcbiAgfTtcblxuICBwcm90by50ZXh0ID0gZnVuY3Rpb24ocHJvcCkge1xuICAgIHZhciB0ZXh0ID0gdGhpcy5fZW5jW1RFWFRdLnRleHQ7XG4gICAgcmV0dXJuIHByb3AgPyB0ZXh0W3Byb3BdIDogdGV4dDtcbiAgfTtcblxuICBwcm90by5mb250ID0gZnVuY3Rpb24ocHJvcCkge1xuICAgIHZhciBmb250ID0gdGhpcy5fZW5jW1RFWFRdLmZvbnQ7XG4gICAgcmV0dXJuIHByb3AgPyBmb250W3Byb3BdIDogZm9udDtcbiAgfTtcblxuICBwcm90by5pc1R5cGUgPSBmdW5jdGlvbih4LCB0eXBlKSB7XG4gICAgdmFyIGZpZWxkID0gdGhpcy5lbmMoeCk7XG4gICAgcmV0dXJuIGZpZWxkICYmIEVuY29kaW5nLmlzVHlwZShmaWVsZCwgdHlwZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNUeXBlID0gZnVuY3Rpb24gKGZpZWxkRGVmLCB0eXBlKSB7XG4gICAgLy8gRklYTUUgdmxmaWVsZC5pc1R5cGVcbiAgICByZXR1cm4gKGZpZWxkRGVmLnR5cGUgJiB0eXBlKSA+IDA7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUgPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNvZGluZywgZW5jVHlwZSkge1xuICAgIHJldHVybiB2bGZpZWxkLmlzRGltZW5zaW9uKGVuY29kaW5nLmVuYyhlbmNUeXBlKSwgdHJ1ZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNNZWFzdXJlID0gZnVuY3Rpb24oZW5jb2RpbmcsIGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdmxmaWVsZC5pc01lYXN1cmUoZW5jb2RpbmcuZW5jKGVuY1R5cGUpLCB0cnVlKTtcbiAgfTtcblxuICBwcm90by5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNPcmRpbmFsU2NhbGUodGhpcywgZW5jVHlwZSk7XG4gIH07XG5cbiAgcHJvdG8uaXNEaW1lbnNpb24gPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGVuY1R5cGUpICYmIEVuY29kaW5nLmlzRGltZW5zaW9uKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzTWVhc3VyZSA9IGZ1bmN0aW9uKGVuY1R5cGUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoZW5jVHlwZSkgJiYgRW5jb2RpbmcuaXNNZWFzdXJlKHRoaXMsIGVuY1R5cGUpO1xuICB9O1xuXG4gIHByb3RvLmlzQWdncmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHRoaXMuX2VuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgcmV0dXJuIHZsZW5jLmlzQWdncmVnYXRlKHNwZWMuZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5hbHdheXNOb09jY2x1c2lvbiA9IGZ1bmN0aW9uKHNwZWMsIHN0YXRzKSB7XG4gICAgLy8gRklYTUUgcmF3IE94USB3aXRoICMgb2Ygcm93cyA9ICMgb2YgT1xuICAgIHJldHVybiB2bGVuYy5pc0FnZ3JlZ2F0ZShzcGVjLmVuYyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuaXNTdGFjayA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICAvLyBGSVhNRSB1cGRhdGUgdGhpcyBvbmNlIHdlIGhhdmUgY29udHJvbCBmb3Igc3RhY2sgLi4uXG4gICAgcmV0dXJuIChzcGVjLm1hcmt0eXBlID09PSAnYmFyJyB8fCBzcGVjLm1hcmt0eXBlID09PSAnYXJlYScpICYmXG4gICAgICBzcGVjLmVuYy5jb2xvcjtcbiAgfTtcblxuICBwcm90by5pc1N0YWNrID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gRklYTUUgdXBkYXRlIHRoaXMgb25jZSB3ZSBoYXZlIGNvbnRyb2wgZm9yIHN0YWNrIC4uLlxuICAgIHJldHVybiAodGhpcy5pcygnYmFyJykgfHwgdGhpcy5pcygnYXJlYScpKSAmJiB0aGlzLmhhcygnY29sb3InKTtcbiAgfTtcblxuICBwcm90by5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGVuY1R5cGUsIHN0YXRzKSB7XG4gICAgcmV0dXJuIHZsZmllbGQuY2FyZGluYWxpdHkodGhpcy5lbmMoZW5jVHlwZSksIHN0YXRzLCB0aGlzLmNvbmZpZygnZmlsdGVyTnVsbCcpLCB0cnVlKTtcbiAgfTtcblxuICBwcm90by5pc1JhdyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0FnZ3JlZ2F0ZSgpO1xuICB9O1xuXG4gIHByb3RvLmNvbmZpZyA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY2ZnW25hbWVdO1xuICB9O1xuXG4gIHByb3RvLnRvU3BlYyA9IGZ1bmN0aW9uKGV4Y2x1ZGVDb25maWcpIHtcbiAgICB2YXIgZW5jID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fZW5jKSxcbiAgICAgIHNwZWM7XG5cbiAgICAvLyBjb252ZXJ0IHR5cGUncyBiaXRjb2RlIHRvIHR5cGUgbmFtZVxuICAgIGZvciAodmFyIGUgaW4gZW5jKSB7XG4gICAgICBlbmNbZV0udHlwZSA9IGNvbnN0cy5kYXRhVHlwZU5hbWVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICBzcGVjID0ge1xuICAgICAgbWFya3R5cGU6IHRoaXMuX21hcmt0eXBlLFxuICAgICAgZW5jOiBlbmMsXG4gICAgICBmaWx0ZXI6IHRoaXMuX2ZpbHRlclxuICAgIH07XG5cbiAgICBpZiAoIWV4Y2x1ZGVDb25maWcpIHtcbiAgICAgIHNwZWMuY2ZnID0gdXRpbC5kdXBsaWNhdGUodGhpcy5fY2ZnKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgZGVmYXVsdHNcbiAgICB2YXIgZGVmYXVsdHMgPSBzY2hlbWEuaW5zdGFudGlhdGUoKTtcbiAgICByZXR1cm4gc2NoZW1hLnV0aWwuc3VidHJhY3Qoc3BlYywgZGVmYXVsdHMpO1xuICB9O1xuXG4gIHByb3RvLnRvU2hvcnRoYW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMgPSBjb25zdHMuc2hvcnRoYW5kO1xuICAgIHJldHVybiAnbWFyaycgKyBjLmFzc2lnbiArIHRoaXMuX21hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQodGhpcy5fZW5jKTtcbiAgfTtcblxuICBFbmNvZGluZy5zaG9ydGhhbmQgPSBmdW5jdGlvbiAoc3BlYykge1xuICAgIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgICByZXR1cm4gJ21hcmsnICsgYy5hc3NpZ24gKyBzcGVjLm1hcmt0eXBlICtcbiAgICAgIGMuZGVsaW0gKyB2bGVuYy5zaG9ydGhhbmQoc3BlYy5lbmMpO1xuICB9O1xuXG4gIEVuY29kaW5nLnBhcnNlU2hvcnRoYW5kID0gZnVuY3Rpb24oc2hvcnRoYW5kLCBjZmcpIHtcbiAgICB2YXIgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gICAgICAgIHNwbGl0ID0gc2hvcnRoYW5kLnNwbGl0KGMuZGVsaW0pLFxuICAgICAgICBtYXJrdHlwZSA9IHNwbGl0LnNoaWZ0KCkuc3BsaXQoYy5hc3NpZ24pWzFdLnRyaW0oKSxcbiAgICAgICAgZW5jID0gdmxlbmMucGFyc2VTaG9ydGhhbmQoc3BsaXQsIHRydWUpO1xuXG4gICAgcmV0dXJuIG5ldyBFbmNvZGluZyhtYXJrdHlwZSwgZW5jLCBjZmcpO1xuICB9O1xuXG4gIC8vIEZJWE1FIHJlbW92ZSB0aGlzIC0tIHNpbXBseSB1c2UgRW5jb2Rpbmcuc2hvcnRoYW5kXG4gIEVuY29kaW5nLnNob3J0aGFuZEZyb21TcGVjID0gZnVuY3Rpb24oLypzcGVjLCB0aGVtZSovKSB7XG4gICAgcmV0dXJuIEVuY29kaW5nLmZyb21TcGVjLmFwcGx5KG51bGwsIGFyZ3VtZW50cykudG9TaG9ydGhhbmQoKTtcbiAgfTtcblxuICBFbmNvZGluZy5zcGVjRnJvbVNob3J0aGFuZCA9IGZ1bmN0aW9uKHNob3J0aGFuZCwgY2ZnLCBleGNsdWRlQ29uZmlnKSB7XG4gICAgcmV0dXJuIEVuY29kaW5nLnBhcnNlU2hvcnRoYW5kKHNob3J0aGFuZCwgY2ZnKS50b1NwZWMoZXhjbHVkZUNvbmZpZyk7XG4gIH07XG5cbiAgRW5jb2RpbmcuZnJvbVNwZWMgPSBmdW5jdGlvbihzcGVjLCB0aGVtZSkge1xuICAgIHZhciBlbmMgPSB1dGlsLmR1cGxpY2F0ZShzcGVjLmVuYyB8fCB7fSk7XG5cbiAgICAvL2NvbnZlcnQgdHlwZSBmcm9tIHN0cmluZyB0byBiaXRjb2RlIChlLmcsIE89MSlcbiAgICBmb3IgKHZhciBlIGluIGVuYykge1xuICAgICAgZW5jW2VdLnR5cGUgPSBjb25zdHMuZGF0YVR5cGVzW2VuY1tlXS50eXBlXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEVuY29kaW5nKHNwZWMubWFya3R5cGUsIGVuYywgc3BlYy5jZmcsIHNwZWMuZmlsdGVyLCB0aGVtZSk7XG4gIH07XG5cbiAgRW5jb2RpbmcudHJhbnNwb3NlID0gZnVuY3Rpb24oc3BlYykge1xuICAgIHZhciBvbGRlbmMgPSBzcGVjLmVuYyxcbiAgICAgIGVuYyA9IHV0aWwuZHVwbGljYXRlKHNwZWMuZW5jKTtcbiAgICBlbmMueCA9IG9sZGVuYy55O1xuICAgIGVuYy55ID0gb2xkZW5jLng7XG4gICAgZW5jLnJvdyA9IG9sZGVuYy5jb2w7XG4gICAgZW5jLmNvbCA9IG9sZGVuYy5yb3c7XG4gICAgc3BlYy5lbmMgPSBlbmM7XG4gICAgcmV0dXJuIHNwZWM7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlU29ydCA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICBzcGVjLmNmZyA9IHNwZWMuY2ZnIHx8IHt9O1xuICAgIHNwZWMuY2ZnLnRvZ2dsZVNvcnQgPSBzcGVjLmNmZy50b2dnbGVTb3J0ID09PSAnUScgPyAnTycgOidRJztcbiAgICByZXR1cm4gc3BlYztcbiAgfTtcblxuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQuZGlyZWN0aW9uID0gZnVuY3Rpb24oc3BlYywgdXNlVHlwZUNvZGUpIHtcbiAgICBpZiAoIUVuY29kaW5nLnRvZ2dsZVNvcnQuc3VwcG9ydChzcGVjLCB1c2VUeXBlQ29kZSkpIHsgcmV0dXJuOyB9XG4gICAgdmFyIGVuYyA9IHNwZWMuZW5jO1xuICAgIHJldHVybiBlbmMueC50eXBlID09PSAnTycgPyAneCcgOiAgJ3knO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZVNvcnQubW9kZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gc3BlYy5jZmcudG9nZ2xlU29ydDtcbiAgfTtcblxuICBFbmNvZGluZy50b2dnbGVTb3J0LnN1cHBvcnQgPSBmdW5jdGlvbihzcGVjLCBzdGF0cywgdXNlVHlwZUNvZGUpIHtcbiAgICB2YXIgZW5jID0gc3BlYy5lbmMsXG4gICAgICBpc1R5cGUgPSB2bGZpZWxkLmlzVHlwZS5nZXQodXNlVHlwZUNvZGUpO1xuXG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIFJPVykgfHwgdmxlbmMuaGFzKGVuYywgQ09MKSB8fFxuICAgICAgIXZsZW5jLmhhcyhlbmMsIFgpIHx8ICF2bGVuYy5oYXMoZW5jLCBZKSB8fFxuICAgICAgIUVuY29kaW5nLmFsd2F5c05vT2NjbHVzaW9uKHNwZWMsIHN0YXRzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAoIGlzVHlwZShlbmMueCwgTykgJiYgdmxmaWVsZC5pc01lYXN1cmUoZW5jLnksIHVzZVR5cGVDb2RlKSkgPyAneCcgOlxuICAgICAgKCBpc1R5cGUoZW5jLnksIE8pICYmIHZsZmllbGQuaXNNZWFzdXJlKGVuYy54LCB1c2VUeXBlQ29kZSkpID8gJ3knIDogZmFsc2U7XG4gIH07XG5cbiAgRW5jb2RpbmcudG9nZ2xlRmlsdGVyTnVsbE8gPSBmdW5jdGlvbihzcGVjKSB7XG4gICAgc3BlYy5jZmcgPSBzcGVjLmNmZyB8fCB7fTtcbiAgICBzcGVjLmNmZy5maWx0ZXJOdWxsID0gc3BlYy5jZmcuZmlsdGVyTnVsbCB8fCB7IC8vRklYTUVcbiAgICAgIFQ6IHRydWUsXG4gICAgICBROiB0cnVlXG4gICAgfTtcbiAgICBzcGVjLmNmZy5maWx0ZXJOdWxsLk8gPSAhc3BlYy5jZmcuZmlsdGVyTnVsbC5PO1xuICAgIHJldHVybiBzcGVjO1xuICB9O1xuXG4gIEVuY29kaW5nLnRvZ2dsZUZpbHRlck51bGxPLnN1cHBvcnQgPSBmdW5jdGlvbihzcGVjLCBzdGF0cykge1xuICAgIHZhciBmaWVsZHMgPSB2bGVuYy5maWVsZHMoc3BlYy5lbmMpO1xuICAgIGZvciAodmFyIGZpZWxkTmFtZSBpbiBmaWVsZHMpIHtcbiAgICAgIHZhciBmaWVsZExpc3QgPSBmaWVsZHNbZmllbGROYW1lXTtcbiAgICAgIGlmIChmaWVsZExpc3QuY29udGFpbnNUeXBlLk8gJiYgZmllbGROYW1lIGluIHN0YXRzICYmIHN0YXRzW2ZpZWxkTmFtZV0ubnVtTnVsbHMgPiAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIEVuY29kaW5nO1xufSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYWdncmVnYXRlcztcblxuZnVuY3Rpb24gYWdncmVnYXRlcyhzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICB2YXIgZGltcyA9IHt9LCBtZWFzID0ge30sIGRldGFpbCA9IHt9LCBmYWNldHMgPSB7fSxcbiAgICBkYXRhID0gc3BlYy5kYXRhWzFdOyAvLyBjdXJyZW50bHkgZGF0YVswXSBpcyByYXcgYW5kIGRhdGFbMV0gaXMgdGFibGVcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGZpZWxkLmFnZ3IpIHtcbiAgICAgIGlmIChmaWVsZC5hZ2dyID09PSAnY291bnQnKSB7XG4gICAgICAgIG1lYXMuY291bnQgPSB7b3A6ICdjb3VudCcsIGZpZWxkOiAnKid9O1xuICAgICAgfWVsc2Uge1xuICAgICAgICBtZWFzW2ZpZWxkLmFnZ3IgKyAnfCcrIGZpZWxkLm5hbWVdID0ge1xuICAgICAgICAgIG9wOiBmaWVsZC5hZ2dyLFxuICAgICAgICAgIGZpZWxkOiAnZGF0YS4nKyBmaWVsZC5uYW1lXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpbXNbZmllbGQubmFtZV0gPSBlbmNvZGluZy5maWVsZChlbmNUeXBlKTtcbiAgICAgIGlmIChlbmNUeXBlID09IFJPVyB8fCBlbmNUeXBlID09IENPTCkge1xuICAgICAgICBmYWNldHNbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfWVsc2UgaWYgKGVuY1R5cGUgIT09IFggJiYgZW5jVHlwZSAhPT0gWSkge1xuICAgICAgICBkZXRhaWxbZmllbGQubmFtZV0gPSBkaW1zW2ZpZWxkLm5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGRpbXMgPSB1dGlsLnZhbHMoZGltcyk7XG4gIG1lYXMgPSB1dGlsLnZhbHMobWVhcyk7XG5cbiAgaWYgKG1lYXMubGVuZ3RoID4gMCAmJiAhb3B0LnByZWFnZ3JlZ2F0ZWREYXRhKSB7XG4gICAgaWYgKCFkYXRhLnRyYW5zZm9ybSkgZGF0YS50cmFuc2Zvcm0gPSBbXTtcbiAgICBkYXRhLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogZGltcyxcbiAgICAgIGZpZWxkczogbWVhc1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgZGV0YWlsczogdXRpbC52YWxzKGRldGFpbCksXG4gICAgZGltczogZGltcyxcbiAgICBmYWNldHM6IHV0aWwudmFscyhmYWNldHMpLFxuICAgIGFnZ3JlZ2F0ZWQ6IG1lYXMubGVuZ3RoID4gMFxuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgc2V0dGVyID0gdXRpbC5zZXR0ZXIsXG4gIGdldHRlciA9IHV0aWwuZ2V0dGVyLFxuICB0aW1lID0gcmVxdWlyZSgnLi90aW1lJyk7XG5cbnZhciBheGlzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuYXhpcy5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIHZhciBzID0gcHJvcHNbeF0uc2NhbGU7XG4gICAgaWYgKHMgPT09IFggfHwgcyA9PT0gWSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuYXhpcy5kZWZzID0gZnVuY3Rpb24obmFtZXMsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpIHtcbiAgcmV0dXJuIG5hbWVzLnJlZHVjZShmdW5jdGlvbihhLCBuYW1lKSB7XG4gICAgYS5wdXNoKGF4aXMuZGVmKG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzLCBvcHQpKTtcbiAgICByZXR1cm4gYTtcbiAgfSwgW10pO1xufTtcblxuYXhpcy5kZWYgPSBmdW5jdGlvbihuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cywgb3B0KSB7XG4gIHZhciB0eXBlID0gbmFtZTtcbiAgdmFyIGlzQ29sID0gbmFtZSA9PSBDT0wsIGlzUm93ID0gbmFtZSA9PSBST1c7XG4gIHZhciByb3dPZmZzZXQgPSBheGlzVGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgWSkgKyAyMCxcbiAgICBjZWxsUGFkZGluZyA9IGxheW91dC5jZWxsUGFkZGluZztcblxuXG4gIGlmIChpc0NvbCkgdHlwZSA9ICd4JztcbiAgaWYgKGlzUm93KSB0eXBlID0gJ3knO1xuXG4gIHZhciBkZWYgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBzY2FsZTogbmFtZVxuICB9O1xuXG4gIGlmIChlbmNvZGluZy5heGlzKG5hbWUpLmdyaWQpIHtcbiAgICBkZWYuZ3JpZCA9IHRydWU7XG4gICAgZGVmLmxheWVyID0gKGlzUm93IHx8IGlzQ29sKSA/ICdmcm9udCcgOiAgJ2JhY2snO1xuXG4gICAgaWYgKGlzQ29sKSB7XG4gICAgICAvLyBzZXQgZ3JpZCBwcm9wZXJ0eSAtLSBwdXQgdGhlIGxpbmVzIG9uIHRoZSByaWdodCB0aGUgY2VsbFxuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2dyaWQnXSwge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgb2Zmc2V0OiBsYXlvdXQuY2VsbFdpZHRoICogKDErIGNlbGxQYWRkaW5nLzIuMCksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdjb2wnXG4gICAgICAgIH0sXG4gICAgICAgIHk6IHtcbiAgICAgICAgICB2YWx1ZTogLWxheW91dC5jZWxsSGVpZ2h0ICogKGNlbGxQYWRkaW5nLzIpLFxuICAgICAgICB9LFxuICAgICAgICBzdHJva2U6IHsgdmFsdWU6IGVuY29kaW5nLmNvbmZpZygnY2VsbEdyaWRDb2xvcicpIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaXNSb3cpIHtcbiAgICAgIC8vIHNldCBncmlkIHByb3BlcnR5IC0tIHB1dCB0aGUgbGluZXMgb24gdGhlIHRvcFxuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2dyaWQnXSwge1xuICAgICAgICB5OiB7XG4gICAgICAgICAgb2Zmc2V0OiAtbGF5b3V0LmNlbGxIZWlnaHQgKiAoY2VsbFBhZGRpbmcvMiksXG4gICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZShzKSAtLSB2ZWdhIGRvZXNuJ3QgZG8gcmVjdXJzaXZlIG1lcmdlXG4gICAgICAgICAgc2NhbGU6ICdyb3cnXG4gICAgICAgIH0sXG4gICAgICAgIHg6IHtcbiAgICAgICAgICB2YWx1ZTogcm93T2Zmc2V0XG4gICAgICAgIH0sXG4gICAgICAgIHgyOiB7XG4gICAgICAgICAgb2Zmc2V0OiByb3dPZmZzZXQgKyAobGF5b3V0LmNlbGxXaWR0aCAqIDAuMDUpLFxuICAgICAgICAgIC8vIGRlZmF1bHQgdmFsdWUocykgLS0gdmVnYSBkb2Vzbid0IGRvIHJlY3Vyc2l2ZSBtZXJnZVxuICAgICAgICAgIGdyb3VwOiBcIm1hcmsuZ3JvdXAud2lkdGhcIixcbiAgICAgICAgICBtdWx0OiAxXG4gICAgICAgIH0sXG4gICAgICAgIHN0cm9rZTogeyB2YWx1ZTogZW5jb2RpbmcuY29uZmlnKCdjZWxsR3JpZENvbG9yJykgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldHRlcihkZWYsIFsncHJvcGVydGllcycsICdncmlkJywgJ3N0cm9rZSddLCB7XG4gICAgICAgIHZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2dyaWRDb2xvcicpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuYXhpcyhuYW1lKS50aXRsZSkge1xuICAgIGRlZiA9IGF4aXNfdGl0bGUoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBvcHQpO1xuICB9XG5cbiAgaWYgKGlzUm93IHx8IGlzQ29sKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ3RpY2tzJ10sIHtcbiAgICAgIG9wYWNpdHk6IHt2YWx1ZTogMH1cbiAgICB9KTtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCAnbWFqb3JUaWNrcyddLCB7XG4gICAgICBvcGFjaXR5OiB7dmFsdWU6IDB9XG4gICAgfSk7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywgJ2F4aXMnXSwge1xuICAgICAgb3BhY2l0eToge3ZhbHVlOiAwfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGlzQ29sKSB7XG4gICAgZGVmLm9yaWVudCA9ICd0b3AnO1xuICB9XG5cbiAgaWYgKGlzUm93KSB7XG4gICAgZGVmLm9mZnNldCA9IHJvd09mZnNldDtcbiAgfVxuXG4gIGlmIChuYW1lID09IFgpIHtcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpICYmIGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFkpICYmIGVuY29kaW5nLmNhcmRpbmFsaXR5KFksIHN0YXRzKSA+IDMwKSB7XG4gICAgICBkZWYub3JpZW50ID0gJ3RvcCc7XG4gICAgfVxuXG4gICAgaWYgKGVuY29kaW5nLmlzRGltZW5zaW9uKFgpIHx8IGVuY29kaW5nLmlzVHlwZShYLCBUKSkge1xuICAgICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywnbGFiZWxzJ10sIHtcbiAgICAgICAgYW5nbGU6IHt2YWx1ZTogMjcwfSxcbiAgICAgICAgYWxpZ246IHt2YWx1ZTogJ3JpZ2h0J30sXG4gICAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHsgLy8gUVxuICAgICAgZGVmLnRpY2tzID0gNTtcbiAgICB9XG4gIH1cblxuICBkZWYgPSBheGlzX2xhYmVscyhkZWYsIG5hbWUsIGVuY29kaW5nLCBsYXlvdXQsIG9wdCk7XG5cbiAgcmV0dXJuIGRlZjtcbn07XG5cbmZ1bmN0aW9uIGF4aXNfdGl0bGUoZGVmLCBuYW1lLCBlbmNvZGluZywgbGF5b3V0LCBvcHQpIHtcbiAgdmFyIG1heGxlbmd0aCA9IG51bGwsXG4gICAgZmllbGRUaXRsZSA9IGVuY29kaW5nLmZpZWxkVGl0bGUobmFtZSk7XG4gIGlmIChuYW1lPT09WCkge1xuICAgIG1heGxlbmd0aCA9IGxheW91dC5jZWxsV2lkdGggLyBlbmNvZGluZy5jb25maWcoJ2NoYXJhY3RlcldpZHRoJyk7XG4gIH0gZWxzZSBpZiAobmFtZSA9PT0gWSkge1xuICAgIG1heGxlbmd0aCA9IGxheW91dC5jZWxsSGVpZ2h0IC8gZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpO1xuICB9XG5cbiAgZGVmLnRpdGxlID0gbWF4bGVuZ3RoID8gdXRpbC50cnVuY2F0ZShmaWVsZFRpdGxlLCBtYXhsZW5ndGgpIDogZmllbGRUaXRsZTtcblxuICBpZiAobmFtZSA9PT0gUk9XKSB7XG4gICAgc2V0dGVyKGRlZiwgWydwcm9wZXJ0aWVzJywndGl0bGUnXSwge1xuICAgICAgYW5nbGU6IHt2YWx1ZTogMH0sXG4gICAgICBhbGlnbjoge3ZhbHVlOiAncmlnaHQnfSxcbiAgICAgIGJhc2VsaW5lOiB7dmFsdWU6ICdtaWRkbGUnfSxcbiAgICAgIGR5OiB7dmFsdWU6ICgtbGF5b3V0LmhlaWdodC8yKSAtMjB9XG4gICAgfSk7XG4gIH1cblxuICBkZWYudGl0bGVPZmZzZXQgPSBheGlzVGl0bGVPZmZzZXQoZW5jb2RpbmcsIGxheW91dCwgbmFtZSk7XG4gIHJldHVybiBkZWY7XG59XG5cbmZ1bmN0aW9uIGF4aXNfbGFiZWxzKGRlZiwgbmFtZSwgZW5jb2RpbmcsIGxheW91dCwgb3B0KSB7XG4gIHZhciBmbjtcbiAgLy8gYWRkIGN1c3RvbSBsYWJlbCBmb3IgdGltZSB0eXBlXG4gIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgVCkgJiYgKGZuID0gZW5jb2RpbmcuZm4obmFtZSkpICYmICh0aW1lLmhhc1NjYWxlKGZuKSkpIHtcbiAgICBzZXR0ZXIoZGVmLCBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0Jywnc2NhbGUnXSwgJ3RpbWUtJysgZm4pO1xuICB9XG5cbiAgdmFyIHRleHRUZW1wbGF0ZVBhdGggPSBbJ3Byb3BlcnRpZXMnLCdsYWJlbHMnLCd0ZXh0JywndGVtcGxhdGUnXTtcbiAgaWYgKGVuY29kaW5nLmF4aXMobmFtZSkuZm9ybWF0KSB7XG4gICAgZGVmLmZvcm1hdCA9IGVuY29kaW5nLmF4aXMobmFtZSkuZm9ybWF0O1xuICB9IGVsc2UgaWYgKGVuY29kaW5nLmlzVHlwZShuYW1lLCBRKSkge1xuICAgIHNldHRlcihkZWYsIHRleHRUZW1wbGF0ZVBhdGgsIFwie3tkYXRhIHwgbnVtYmVyOicuM3MnfX1cIik7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmICFlbmNvZGluZy5mbihuYW1lKSkge1xuICAgIHNldHRlcihkZWYsIHRleHRUZW1wbGF0ZVBhdGgsIFwie3tkYXRhIHwgdGltZTonJVktJW0tJWQnfX1cIik7XG4gIH0gZWxzZSBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIGVuY29kaW5nLmZuKG5hbWUpID09PSAneWVhcicpIHtcbiAgICBzZXR0ZXIoZGVmLCB0ZXh0VGVtcGxhdGVQYXRoLCBcInt7ZGF0YSB8IG51bWJlcjonZCd9fVwiKTtcbiAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUobmFtZSwgTykgJiYgZW5jb2RpbmcuYXhpcyhuYW1lKS5tYXhMYWJlbExlbmd0aCkge1xuICAgIHNldHRlcihkZWYsIHRleHRUZW1wbGF0ZVBhdGgsICd7e2RhdGEgfCB0cnVuY2F0ZTonICsgZW5jb2RpbmcuYXhpcyhuYW1lKS5tYXhMYWJlbExlbmd0aCArICd9fScpO1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn1cblxuZnVuY3Rpb24gYXhpc1RpdGxlT2Zmc2V0KGVuY29kaW5nLCBsYXlvdXQsIG5hbWUpIHtcbiAgdmFyIHZhbHVlID0gZW5jb2RpbmcuYXhpcyhuYW1lKS50aXRsZU9mZnNldDtcbiAgaWYgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHN3aXRjaCAobmFtZSkge1xuICAgIGNhc2UgUk9XOiByZXR1cm4gMDtcbiAgICBjYXNlIENPTDogcmV0dXJuIDM1O1xuICB9XG4gIHJldHVybiBnZXR0ZXIobGF5b3V0LCBbbmFtZSwgJ2F4aXNUaXRsZU9mZnNldCddKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmlubmluZztcblxuZnVuY3Rpb24gYmlubmluZyhzcGVjLCBlbmNvZGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgdmFyIGJpbnMgPSB7fTtcblxuICBpZiAob3B0LnByZWFnZ3JlZ2F0ZWREYXRhKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFzcGVjLnRyYW5zZm9ybSkgc3BlYy50cmFuc2Zvcm0gPSBbXTtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgaWYgKGVuY29kaW5nLmJpbihlbmNUeXBlKSkge1xuICAgICAgc3BlYy50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdiaW4nLFxuICAgICAgICBmaWVsZDogJ2RhdGEuJyArIGZpZWxkLm5hbWUsXG4gICAgICAgIG91dHB1dDogJ2RhdGEuYmluXycgKyBmaWVsZC5uYW1lLFxuICAgICAgICBtYXhiaW5zOiBlbmNvZGluZy5iaW4oZW5jVHlwZSkubWF4Ymluc1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZTtcblxudmFyIHRlbXBsYXRlID0gY29tcGlsZS50ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGUnKSxcbiAgYXhpcyA9IGNvbXBpbGUuYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBmaWx0ZXIgPSBjb21waWxlLmZpbHRlciA9IHJlcXVpcmUoJy4vZmlsdGVyJyksXG4gIGxlZ2VuZCA9IGNvbXBpbGUubGVnZW5kID0gcmVxdWlyZSgnLi9sZWdlbmQnKSxcbiAgbWFya3MgPSBjb21waWxlLm1hcmtzID0gcmVxdWlyZSgnLi9tYXJrcycpLFxuICBzY2FsZSA9IGNvbXBpbGUuc2NhbGUgPSByZXF1aXJlKCcuL3NjYWxlJyksXG4gIHZsc29ydCA9IGNvbXBpbGUuc29ydCA9IHJlcXVpcmUoJy4vc29ydCcpLFxuICB2bHN0eWxlID0gY29tcGlsZS5zdHlsZSA9IHJlcXVpcmUoJy4vc3R5bGUnKSxcbiAgdGltZSA9IGNvbXBpbGUudGltZSA9IHJlcXVpcmUoJy4vdGltZScpLFxuICBhZ2dyZWdhdGVzID0gY29tcGlsZS5hZ2dyZWdhdGVzID0gcmVxdWlyZSgnLi9hZ2dyZWdhdGVzJyksXG4gIGJpbm5pbmcgPSBjb21waWxlLmJpbm5pbmcgPSByZXF1aXJlKCcuL2Jpbm5pbmcnKSxcbiAgZmFjZXRpbmcgPSBjb21waWxlLmZhY2V0aW5nID0gcmVxdWlyZSgnLi9mYWNldGluZycpLFxuICBzdGFja2luZyA9IGNvbXBpbGUuc3RhY2tpbmcgPSByZXF1aXJlKCcuL3N0YWNraW5nJyksXG4gIHN1YmZhY2V0aW5nID0gY29tcGlsZS5zdWJmYWNldGluZyA9IHJlcXVpcmUoJy4vc3ViZmFjZXRpbmcnKTtcblxuY29tcGlsZS5sYXlvdXQgPSByZXF1aXJlKCcuL2xheW91dCcpO1xuY29tcGlsZS5ncm91cCA9IHJlcXVpcmUoJy4vZ3JvdXAnKTtcblxuZnVuY3Rpb24gY29tcGlsZShlbmNvZGluZywgc3RhdHMpIHtcbiAgdmFyIGxheW91dCA9IGNvbXBpbGUubGF5b3V0KGVuY29kaW5nLCBzdGF0cyksXG4gICAgc3R5bGUgPSB2bHN0eWxlKGVuY29kaW5nLCBzdGF0cyksXG4gICAgc3BlYyA9IHRlbXBsYXRlKGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSxcbiAgICBncm91cCA9IHNwZWMubWFya3NbMF0sXG4gICAgbWFyayA9IG1hcmtzW2VuY29kaW5nLm1hcmt0eXBlKCldLFxuICAgIG1kZWZzID0gbWFya3MuZGVmKG1hcmssIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlKSxcbiAgICBtZGVmID0gbWRlZnNbMF07ICAvLyBUT0RPOiByZW1vdmUgdGhpcyBkaXJ0eSBoYWNrIGJ5IHJlZmFjdG9yaW5nIHRoZSB3aG9sZSBmbG93XG5cbiAgZmlsdGVyLmFkZEZpbHRlcnMoc3BlYywgZW5jb2RpbmcpO1xuICB2YXIgc29ydGluZyA9IHZsc29ydChzcGVjLCBlbmNvZGluZywgc3RhdHMpO1xuXG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSwgaGFzQ29sID0gZW5jb2RpbmcuaGFzKENPTCk7XG5cbiAgdmFyIHByZWFnZ3JlZ2F0ZWREYXRhID0gZW5jb2RpbmcuY29uZmlnKCd1c2VWZWdhU2VydmVyJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZGVmcy5sZW5ndGg7IGkrKykge1xuICAgIGdyb3VwLm1hcmtzLnB1c2gobWRlZnNbaV0pO1xuICB9XG5cbiAgYmlubmluZyhzcGVjLmRhdGFbMV0sIGVuY29kaW5nLCB7cHJlYWdncmVnYXRlZERhdGE6IHByZWFnZ3JlZ2F0ZWREYXRhfSk7XG5cbiAgdmFyIGxpbmVUeXBlID0gbWFya3NbZW5jb2RpbmcubWFya3R5cGUoKV0ubGluZTtcblxuICBpZiAoIXByZWFnZ3JlZ2F0ZWREYXRhKSB7XG4gICAgc3BlYyA9IHRpbWUoc3BlYywgZW5jb2RpbmcpO1xuICB9XG5cbiAgLy8gaGFuZGxlIHN1YmZhY2V0c1xuICB2YXIgYWdnUmVzdWx0ID0gYWdncmVnYXRlcyhzcGVjLCBlbmNvZGluZywge3ByZWFnZ3JlZ2F0ZWREYXRhOiBwcmVhZ2dyZWdhdGVkRGF0YX0pLFxuICAgIGRldGFpbHMgPSBhZ2dSZXN1bHQuZGV0YWlscyxcbiAgICBoYXNEZXRhaWxzID0gZGV0YWlscyAmJiBkZXRhaWxzLmxlbmd0aCA+IDAsXG4gICAgc3RhY2sgPSBoYXNEZXRhaWxzICYmIHN0YWNraW5nKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBhZ2dSZXN1bHQuZmFjZXRzKTtcblxuICBpZiAoaGFzRGV0YWlscyAmJiAoc3RhY2sgfHwgbGluZVR5cGUpKSB7XG4gICAgLy9zdWJmYWNldCB0byBncm91cCBzdGFjayAvIGxpbmUgdG9nZXRoZXIgaW4gb25lIGdyb3VwXG4gICAgc3ViZmFjZXRpbmcoZ3JvdXAsIG1kZWYsIGRldGFpbHMsIHN0YWNrLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBhdXRvLXNvcnQgbGluZS9hcmVhIHZhbHVlc1xuICAvL1RPRE8oa2FuaXR3KTogaGF2ZSBzb21lIGNvbmZpZyB0byB0dXJuIG9mZiBhdXRvLXNvcnQgZm9yIGxpbmUgKGZvciBsaW5lIGNoYXJ0IHRoYXQgZW5jb2RlcyB0ZW1wb3JhbCBpbmZvcm1hdGlvbilcbiAgaWYgKGxpbmVUeXBlKSB7XG4gICAgdmFyIGYgPSAoZW5jb2RpbmcuaXNNZWFzdXJlKFgpICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKFkpKSA/IFkgOiBYO1xuICAgIGlmICghbWRlZi5mcm9tKSBtZGVmLmZyb20gPSB7fTtcbiAgICAvLyBUT0RPOiB3aHkgLSA/XG4gICAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7dHlwZTogJ3NvcnQnLCBieTogJy0nICsgZW5jb2RpbmcuZmllbGQoZil9XTtcbiAgfVxuXG4gIC8vIFNtYWxsIE11bHRpcGxlc1xuICBpZiAoaGFzUm93IHx8IGhhc0NvbCkge1xuICAgIHNwZWMgPSBmYWNldGluZyhncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsIHNwZWMsIG1kZWYsIHN0YWNrLCBzdGF0cyk7XG4gICAgc3BlYy5sZWdlbmRzID0gbGVnZW5kLmRlZnMoZW5jb2RpbmcpO1xuICB9IGVsc2Uge1xuICAgIGdyb3VwLnNjYWxlcyA9IHNjYWxlLmRlZnMoc2NhbGUubmFtZXMobWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZSksIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBzb3J0aW5nLFxuICAgICAge3N0YWNrOiBzdGFjaywgc3RhdHM6IHN0YXRzfSk7XG4gICAgZ3JvdXAuYXhlcyA9IGF4aXMuZGVmcyhheGlzLm5hbWVzKG1kZWYucHJvcGVydGllcy51cGRhdGUpLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cyk7XG4gICAgZ3JvdXAubGVnZW5kcyA9IGxlZ2VuZC5kZWZzKGVuY29kaW5nKTtcbiAgfVxuXG4gIGZpbHRlci5maWx0ZXJMZXNzVGhhblplcm8oc3BlYywgZW5jb2RpbmcpO1xuXG4gIHJldHVybiBzcGVjO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgYXhpcyA9IHJlcXVpcmUoJy4vYXhpcycpLFxuICBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY2V0aW5nO1xuXG5mdW5jdGlvbiBmYWNldGluZyhncm91cCwgZW5jb2RpbmcsIGxheW91dCwgc3R5bGUsIHNvcnRpbmcsIHNwZWMsIG1kZWYsIHN0YWNrLCBzdGF0cykge1xuICB2YXIgZW50ZXIgPSBncm91cC5wcm9wZXJ0aWVzLmVudGVyO1xuICB2YXIgZmFjZXRLZXlzID0gW10sIGNlbGxBeGVzID0gW10sIGZyb20sIGF4ZXNHcnA7XG5cbiAgdmFyIGhhc1JvdyA9IGVuY29kaW5nLmhhcyhST1cpLCBoYXNDb2wgPSBlbmNvZGluZy5oYXMoQ09MKTtcblxuICBlbnRlci5maWxsID0ge3ZhbHVlOiBlbmNvZGluZy5jb25maWcoJ2NlbGxCYWNrZ3JvdW5kQ29sb3InKX07XG5cbiAgLy9tb3ZlIFwiZnJvbVwiIHRvIGNlbGwgbGV2ZWwgYW5kIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgZ3JvdXAuZnJvbSA9IHtkYXRhOiBncm91cC5tYXJrc1swXS5mcm9tLmRhdGF9O1xuXG4gIC8vIEhhY2ssIHRoaXMgbmVlZHMgdG8gYmUgcmVmYWN0b3JlZFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGdyb3VwLm1hcmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG1hcmsgPSBncm91cC5tYXJrc1tpXTtcbiAgICBpZiAobWFyay5mcm9tLnRyYW5zZm9ybSkge1xuICAgICAgZGVsZXRlIG1hcmsuZnJvbS5kYXRhOyAvL25lZWQgdG8ga2VlcCB0cmFuc2Zvcm0gZm9yIHN1YmZhY2V0dGluZyBjYXNlXG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBtYXJrLmZyb207XG4gICAgfVxuICB9XG5cbiAgaWYgKGhhc1Jvdykge1xuICAgIGlmICghZW5jb2RpbmcuaXNEaW1lbnNpb24oUk9XKSkge1xuICAgICAgdXRpbC5lcnJvcignUm93IGVuY29kaW5nIHNob3VsZCBiZSBvcmRpbmFsLicpO1xuICAgIH1cbiAgICBlbnRlci55ID0ge3NjYWxlOiBST1csIGZpZWxkOiAna2V5cy4nICsgZmFjZXRLZXlzLmxlbmd0aH07XG4gICAgZW50ZXIuaGVpZ2h0ID0geyd2YWx1ZSc6IGxheW91dC5jZWxsSGVpZ2h0fTsgLy8gSEFDS1xuXG4gICAgZmFjZXRLZXlzLnB1c2goZW5jb2RpbmcuZmllbGQoUk9XKSk7XG5cbiAgICBpZiAoaGFzQ29sKSB7XG4gICAgICBmcm9tID0gdXRpbC5kdXBsaWNhdGUoZ3JvdXAuZnJvbSk7XG4gICAgICBmcm9tLnRyYW5zZm9ybSA9IGZyb20udHJhbnNmb3JtIHx8IFtdO1xuICAgICAgZnJvbS50cmFuc2Zvcm0udW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogW2VuY29kaW5nLmZpZWxkKENPTCldfSk7XG4gICAgfVxuXG4gICAgYXhlc0dycCA9IGdyb3VwZGVmKCd4LWF4ZXMnLCB7XG4gICAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhYKSA/IGF4aXMuZGVmcyhbJ3gnXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIDogdW5kZWZpbmVkLFxuICAgICAgICB4OiBoYXNDb2wgPyB7c2NhbGU6IENPTCwgZmllbGQ6ICdrZXlzLjAnfSA6IHt2YWx1ZTogMH0sXG4gICAgICAgIHdpZHRoOiBoYXNDb2wgJiYgeyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9LCAvL0hBQ0s/XG4gICAgICAgIGZyb206IGZyb21cbiAgICAgIH0pO1xuXG4gICAgc3BlYy5tYXJrcy51bnNoaWZ0KGF4ZXNHcnApOyAvLyBuZWVkIHRvIHByZXBlbmQgc28gaXQgYXBwZWFycyB1bmRlciB0aGUgcGxvdHNcbiAgICAoc3BlYy5heGVzID0gc3BlYy5heGVzIHx8IFtdKTtcbiAgICBzcGVjLmF4ZXMucHVzaC5hcHBseShzcGVjLmF4ZXMsIGF4aXMuZGVmcyhbJ3JvdyddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICB9IGVsc2UgeyAvLyBkb2Vzbid0IGhhdmUgcm93XG4gICAgaWYgKGVuY29kaW5nLmhhcyhYKSkge1xuICAgICAgLy9rZWVwIHggYXhpcyBpbiB0aGUgY2VsbFxuICAgICAgY2VsbEF4ZXMucHVzaC5hcHBseShjZWxsQXhlcywgYXhpcy5kZWZzKFsneCddLCBlbmNvZGluZywgbGF5b3V0LCBzdGF0cykpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYXNDb2wpIHtcbiAgICBpZiAoIWVuY29kaW5nLmlzRGltZW5zaW9uKENPTCkpIHtcbiAgICAgIHV0aWwuZXJyb3IoJ0NvbCBlbmNvZGluZyBzaG91bGQgYmUgb3JkaW5hbC4nKTtcbiAgICB9XG4gICAgZW50ZXIueCA9IHtzY2FsZTogQ09MLCBmaWVsZDogJ2tleXMuJyArIGZhY2V0S2V5cy5sZW5ndGh9O1xuICAgIGVudGVyLndpZHRoID0geyd2YWx1ZSc6IGxheW91dC5jZWxsV2lkdGh9OyAvLyBIQUNLXG5cbiAgICBmYWNldEtleXMucHVzaChlbmNvZGluZy5maWVsZChDT0wpKTtcblxuICAgIGlmIChoYXNSb3cpIHtcbiAgICAgIGZyb20gPSB1dGlsLmR1cGxpY2F0ZShncm91cC5mcm9tKTtcbiAgICAgIGZyb20udHJhbnNmb3JtID0gZnJvbS50cmFuc2Zvcm0gfHwgW107XG4gICAgICBmcm9tLnRyYW5zZm9ybS51bnNoaWZ0KHt0eXBlOiAnZmFjZXQnLCBrZXlzOiBbZW5jb2RpbmcuZmllbGQoUk9XKV19KTtcbiAgICB9XG5cbiAgICBheGVzR3JwID0gZ3JvdXBkZWYoJ3ktYXhlcycsIHtcbiAgICAgIGF4ZXM6IGVuY29kaW5nLmhhcyhZKSA/IGF4aXMuZGVmcyhbJ3knXSwgZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIDogdW5kZWZpbmVkLFxuICAgICAgeTogaGFzUm93ICYmIHtzY2FsZTogUk9XLCBmaWVsZDogJ2tleXMuMCd9LFxuICAgICAgeDogaGFzUm93ICYmIHt2YWx1ZTogMH0sXG4gICAgICBoZWlnaHQ6IGhhc1JvdyAmJiB7J3ZhbHVlJzogbGF5b3V0LmNlbGxIZWlnaHR9LCAvL0hBQ0s/XG4gICAgICBmcm9tOiBmcm9tXG4gICAgfSk7XG5cbiAgICBzcGVjLm1hcmtzLnVuc2hpZnQoYXhlc0dycCk7IC8vIG5lZWQgdG8gcHJlcGVuZCBzbyBpdCBhcHBlYXJzIHVuZGVyIHRoZSBwbG90c1xuICAgIChzcGVjLmF4ZXMgPSBzcGVjLmF4ZXMgfHwgW10pO1xuICAgIHNwZWMuYXhlcy5wdXNoLmFwcGx5KHNwZWMuYXhlcywgYXhpcy5kZWZzKFsnY29sJ10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gIH0gZWxzZSB7IC8vIGRvZXNuJ3QgaGF2ZSBjb2xcbiAgICBpZiAoZW5jb2RpbmcuaGFzKFkpKSB7XG4gICAgICBjZWxsQXhlcy5wdXNoLmFwcGx5KGNlbGxBeGVzLCBheGlzLmRlZnMoWyd5J10sIGVuY29kaW5nLCBsYXlvdXQsIHN0YXRzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYXNzdW1pbmcgZXF1YWwgY2VsbFdpZHRoIGhlcmVcbiAgLy8gVE9ETzogc3VwcG9ydCBoZXRlcm9nZW5vdXMgY2VsbFdpZHRoIChtYXliZSBieSB1c2luZyBtdWx0aXBsZSBzY2FsZXM/KVxuICBzcGVjLnNjYWxlcyA9IChzcGVjLnNjYWxlcyB8fCBbXSkuY29uY2F0KHNjYWxlLmRlZnMoXG4gICAgc2NhbGUubmFtZXMoZW50ZXIpLmNvbmNhdChzY2FsZS5uYW1lcyhtZGVmLnByb3BlcnRpZXMudXBkYXRlKSksXG4gICAgZW5jb2RpbmcsXG4gICAgbGF5b3V0LFxuICAgIHN0eWxlLFxuICAgIHNvcnRpbmcsXG4gICAge3N0YWNrOiBzdGFjaywgZmFjZXQ6IHRydWUsIHN0YXRzOiBzdGF0c31cbiAgKSk7IC8vIHJvdy9jb2wgc2NhbGVzICsgY2VsbCBzY2FsZXNcblxuICBpZiAoY2VsbEF4ZXMubGVuZ3RoID4gMCkge1xuICAgIGdyb3VwLmF4ZXMgPSBjZWxsQXhlcztcbiAgfVxuXG4gIC8vIGFkZCBmYWNldCB0cmFuc2Zvcm1cbiAgdmFyIHRyYW5zID0gKGdyb3VwLmZyb20udHJhbnNmb3JtIHx8IChncm91cC5mcm9tLnRyYW5zZm9ybSA9IFtdKSk7XG4gIHRyYW5zLnVuc2hpZnQoe3R5cGU6ICdmYWNldCcsIGtleXM6IGZhY2V0S2V5c30pO1xuXG4gIHJldHVybiBzcGVjO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxudmFyIGZpbHRlciA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBCSU5BUlkgPSB7XG4gICc+JzogIHRydWUsXG4gICc+PSc6IHRydWUsXG4gICc9JzogIHRydWUsXG4gICchPSc6IHRydWUsXG4gICc8JzogIHRydWUsXG4gICc8PSc6IHRydWVcbn07XG5cbmZpbHRlci5hZGRGaWx0ZXJzID0gZnVuY3Rpb24oc3BlYywgZW5jb2RpbmcpIHtcbiAgdmFyIGZpbHRlcnMgPSBlbmNvZGluZy5maWx0ZXIoKSxcbiAgICBkYXRhID0gc3BlYy5kYXRhWzBdOyAgLy8gYXBwbHkgZmlsdGVycyB0byByYXcgZGF0YSBiZWZvcmUgYWdncmVnYXRpb25cblxuICBpZiAoIWRhdGEudHJhbnNmb3JtKVxuICAgIGRhdGEudHJhbnNmb3JtID0gW107XG5cbiAgLy8gYWRkIGN1c3RvbSBmaWx0ZXJzXG4gIGZvciAodmFyIGkgaW4gZmlsdGVycykge1xuICAgIHZhciBmaWx0ZXIgPSBmaWx0ZXJzW2ldO1xuXG4gICAgdmFyIGNvbmRpdGlvbiA9ICcnO1xuICAgIHZhciBvcGVyYXRvciA9IGZpbHRlci5vcGVyYXRvcjtcbiAgICB2YXIgb3BlcmFuZHMgPSBmaWx0ZXIub3BlcmFuZHM7XG5cbiAgICBpZiAoQklOQVJZW29wZXJhdG9yXSkge1xuICAgICAgLy8gZXhwZWN0cyBhIGZpZWxkIGFuZCBhIHZhbHVlXG4gICAgICBpZiAob3BlcmF0b3IgPT09ICc9Jykge1xuICAgICAgICBvcGVyYXRvciA9ICc9PSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcDEgPSBvcGVyYW5kc1swXTtcbiAgICAgIHZhciBvcDIgPSBvcGVyYW5kc1sxXTtcbiAgICAgIGNvbmRpdGlvbiA9ICdkLmRhdGEuJyArIG9wMSArIG9wZXJhdG9yICsgb3AyO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0b3IgPT09ICdub3ROdWxsJykge1xuICAgICAgLy8gZXhwZWN0cyBhIG51bWJlciBvZiBmaWVsZHNcbiAgICAgIGZvciAodmFyIGogaW4gb3BlcmFuZHMpIHtcbiAgICAgICAgY29uZGl0aW9uICs9ICdkLmRhdGEuJyArIG9wZXJhbmRzW2pdICsgJyE9PW51bGwnO1xuICAgICAgICBpZiAoaiA8IG9wZXJhbmRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBjb25kaXRpb24gKz0gJyAmJiAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgb3BlcmF0b3I6ICcsIG9wZXJhdG9yKTtcbiAgICB9XG5cbiAgICBkYXRhLnRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgdGVzdDogY29uZGl0aW9uXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIHJlbW92ZSBsZXNzIHRoYW4gMCB2YWx1ZXMgaWYgd2UgdXNlIGxvZyBmdW5jdGlvblxuZmlsdGVyLmZpbHRlckxlc3NUaGFuWmVybyA9IGZ1bmN0aW9uKHNwZWMsIGVuY29kaW5nKSB7XG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZW5jb2Rpbmcuc2NhbGUoZW5jVHlwZSkudHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHNwZWMuZGF0YVsxXS50cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdmaWx0ZXInLFxuICAgICAgICB0ZXN0OiAnZC4nICsgZW5jb2RpbmcuZmllbGQoZW5jVHlwZSkgKyAnPjAnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVmOiBncm91cGRlZlxufTtcblxuZnVuY3Rpb24gZ3JvdXBkZWYobmFtZSwgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcbiAgcmV0dXJuIHtcbiAgICBfbmFtZTogbmFtZSB8fCB1bmRlZmluZWQsXG4gICAgdHlwZTogJ2dyb3VwJyxcbiAgICBmcm9tOiBvcHQuZnJvbSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICBlbnRlcjoge1xuICAgICAgICB4OiBvcHQueCB8fCB1bmRlZmluZWQsXG4gICAgICAgIHk6IG9wdC55IHx8IHVuZGVmaW5lZCxcbiAgICAgICAgd2lkdGg6IG9wdC53aWR0aCB8fCB7Z3JvdXA6ICd3aWR0aCd9LFxuICAgICAgICBoZWlnaHQ6IG9wdC5oZWlnaHQgfHwge2dyb3VwOiAnaGVpZ2h0J31cbiAgICAgIH1cbiAgICB9LFxuICAgIHNjYWxlczogb3B0LnNjYWxlcyB8fCB1bmRlZmluZWQsXG4gICAgYXhlczogb3B0LmF4ZXMgfHwgdW5kZWZpbmVkLFxuICAgIG1hcmtzOiBvcHQubWFya3MgfHwgW11cbiAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHNldHRlciA9IHV0aWwuc2V0dGVyLFxuICBzY2hlbWEgPSByZXF1aXJlKCcuLi9zY2hlbWEvc2NoZW1hJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdmxsYXlvdXQ7XG5cbmZ1bmN0aW9uIHZsbGF5b3V0KGVuY29kaW5nLCBzdGF0cykge1xuICB2YXIgbGF5b3V0ID0gYm94KGVuY29kaW5nLCBzdGF0cyk7XG4gIGxheW91dCA9IG9mZnNldChlbmNvZGluZywgc3RhdHMsIGxheW91dCk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG5cbi8qXG4gIEhBQ0sgdG8gc2V0IGNoYXJ0IHNpemVcbiAgTk9URTogdGhpcyBmYWlscyBmb3IgcGxvdHMgZHJpdmVuIGJ5IGRlcml2ZWQgdmFsdWVzIChlLmcuLCBhZ2dyZWdhdGVzKVxuICBPbmUgc29sdXRpb24gaXMgdG8gdXBkYXRlIFZlZ2EgdG8gc3VwcG9ydCBhdXRvLXNpemluZ1xuICBJbiB0aGUgbWVhbnRpbWUsIGF1dG8tcGFkZGluZyAobW9zdGx5KSBkb2VzIHRoZSB0cmlja1xuICovXG5mdW5jdGlvbiBib3goZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHZhciBoYXNSb3cgPSBlbmNvZGluZy5oYXMoUk9XKSxcbiAgICAgIGhhc0NvbCA9IGVuY29kaW5nLmhhcyhDT0wpLFxuICAgICAgaGFzWCA9IGVuY29kaW5nLmhhcyhYKSxcbiAgICAgIGhhc1kgPSBlbmNvZGluZy5oYXMoWSksXG4gICAgICBtYXJrdHlwZSA9IGVuY29kaW5nLm1hcmt0eXBlKCk7XG5cbiAgLy8gRklYTUUvSEFDSyB3ZSBuZWVkIHRvIHRha2UgZmlsdGVyIGludG8gYWNjb3VudFxuICB2YXIgeENhcmRpbmFsaXR5ID0gaGFzWCAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihYKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFgsIHN0YXRzKSA6IDEsXG4gICAgeUNhcmRpbmFsaXR5ID0gaGFzWSAmJiBlbmNvZGluZy5pc0RpbWVuc2lvbihZKSA/IGVuY29kaW5nLmNhcmRpbmFsaXR5KFksIHN0YXRzKSA6IDE7XG5cbiAgdmFyIHVzZVNtYWxsQmFuZCA9IHhDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKSB8fFxuICAgIHlDYXJkaW5hbGl0eSA+IGVuY29kaW5nLmNvbmZpZygnbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHknKTtcblxuICB2YXIgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0LCBjZWxsUGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcblxuICAvLyBzZXQgY2VsbFdpZHRoXG4gIGlmIChoYXNYKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFgpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbFdpZHRoID0gKHhDYXJkaW5hbGl0eSArIGVuY29kaW5nLmJhbmQoWCkucGFkZGluZykgKiBlbmNvZGluZy5iYW5kU2l6ZShYLCB1c2VTbWFsbEJhbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsV2lkdGggPSBoYXNDb2wgfHwgaGFzUm93ID8gZW5jb2RpbmcuZW5jKENPTCkud2lkdGggOiAgZW5jb2RpbmcuY29uZmlnKFwic2luZ2xlV2lkdGhcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChtYXJrdHlwZSA9PT0gVEVYVCkge1xuICAgICAgY2VsbFdpZHRoID0gZW5jb2RpbmcuY29uZmlnKCd0ZXh0Q2VsbFdpZHRoJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGxXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHNldCBjZWxsSGVpZ2h0XG4gIGlmIChoYXNZKSB7XG4gICAgaWYgKGVuY29kaW5nLmlzT3JkaW5hbFNjYWxlKFkpKSB7XG4gICAgICAvLyBmb3Igb3JkaW5hbCwgaGFzQ29sIG9yIG5vdCBkb2Vzbid0IG1hdHRlciAtLSB3ZSBzY2FsZSBiYXNlZCBvbiBjYXJkaW5hbGl0eVxuICAgICAgY2VsbEhlaWdodCA9ICh5Q2FyZGluYWxpdHkgKyBlbmNvZGluZy5iYW5kKFkpLnBhZGRpbmcpICogZW5jb2RpbmcuYmFuZFNpemUoWSwgdXNlU21hbGxCYW5kKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbEhlaWdodCA9IGhhc0NvbCB8fCBoYXNSb3cgPyBlbmNvZGluZy5lbmMoUk9XKS5oZWlnaHQgOiAgZW5jb2RpbmcuY29uZmlnKFwic2luZ2xlSGVpZ2h0XCIpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjZWxsSGVpZ2h0ID0gZW5jb2RpbmcuYmFuZFNpemUoWSk7XG4gIH1cblxuICAvLyBDZWxsIGJhbmRzIHVzZSByYW5nZUJhbmRzKCkuIFRoZXJlIGFyZSBuLTEgcGFkZGluZy4gIE91dGVycGFkZGluZyA9IDAgZm9yIGNlbGxzXG5cbiAgdmFyIHdpZHRoID0gY2VsbFdpZHRoLCBoZWlnaHQgPSBjZWxsSGVpZ2h0O1xuICBpZiAoaGFzQ29sKSB7XG4gICAgdmFyIGNvbENhcmRpbmFsaXR5ID0gZW5jb2RpbmcuY2FyZGluYWxpdHkoQ09MLCBzdGF0cyk7XG4gICAgd2lkdGggPSBjZWxsV2lkdGggKiAoKDEgKyBjZWxsUGFkZGluZykgKiAoY29sQ2FyZGluYWxpdHkgLSAxKSArIDEpO1xuICB9XG4gIGlmIChoYXNSb3cpIHtcbiAgICB2YXIgcm93Q2FyZGluYWxpdHkgPSAgZW5jb2RpbmcuY2FyZGluYWxpdHkoUk9XLCBzdGF0cyk7XG4gICAgaGVpZ2h0ID0gY2VsbEhlaWdodCAqICgoMSArIGNlbGxQYWRkaW5nKSAqIChyb3dDYXJkaW5hbGl0eSAtIDEpICsgMSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIHdob2xlIGNlbGxcbiAgICBjZWxsV2lkdGg6IGNlbGxXaWR0aCxcbiAgICBjZWxsSGVpZ2h0OiBjZWxsSGVpZ2h0LFxuICAgIGNlbGxQYWRkaW5nOiBjZWxsUGFkZGluZyxcbiAgICAvLyB3aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBjaGFydFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAvLyBpbmZvcm1hdGlvbiBhYm91dCB4IGFuZCB5LCBzdWNoIGFzIGJhbmQgc2l6ZVxuICAgIHg6IHt1c2VTbWFsbEJhbmQ6IHVzZVNtYWxsQmFuZH0sXG4gICAgeToge3VzZVNtYWxsQmFuZDogdXNlU21hbGxCYW5kfVxuICB9O1xufVxuXG5mdW5jdGlvbiBvZmZzZXQoZW5jb2RpbmcsIHN0YXRzLCBsYXlvdXQpIHtcbiAgW1gsIFldLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICB2YXIgbWF4TGVuZ3RoO1xuICAgIGlmIChlbmNvZGluZy5pc0RpbWVuc2lvbih4KSB8fCBlbmNvZGluZy5pc1R5cGUoeCwgVCkpIHtcbiAgICAgIG1heExlbmd0aCA9IHN0YXRzW2VuY29kaW5nLmZpZWxkTmFtZSh4KV0ubWF4bGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoZW5jb2RpbmcuYWdncih4KSA9PT0gJ2NvdW50Jykge1xuICAgICAgLy9hc3NpZ24gZGVmYXVsdCB2YWx1ZSBmb3IgY291bnQgYXMgaXQgd29uJ3QgaGF2ZSBzdGF0c1xuICAgICAgbWF4TGVuZ3RoID0gIDM7XG4gICAgfSBlbHNlIGlmIChlbmNvZGluZy5pc1R5cGUoeCwgUSkpIHtcbiAgICAgIGlmICh4PT09WCkge1xuICAgICAgICBtYXhMZW5ndGggPSAzO1xuICAgICAgfSBlbHNlIHsgLy8gWVxuICAgICAgICAvL2Fzc3VtZSB0aGF0IGRlZmF1bHQgZm9ybWF0aW5nIGlzIGFsd2F5cyBzaG9ydGVyIHRoYW4gN1xuICAgICAgICBtYXhMZW5ndGggPSBNYXRoLm1pbihzdGF0c1tlbmNvZGluZy5maWVsZE5hbWUoeCldLm1heGxlbmd0aCwgNyk7XG4gICAgICB9XG4gICAgfVxuICAgIHNldHRlcihsYXlvdXQsW3gsICdheGlzVGl0bGVPZmZzZXQnXSwgZW5jb2RpbmcuY29uZmlnKCdjaGFyYWN0ZXJXaWR0aCcpICogIG1heExlbmd0aCArIDIwKTtcbiAgfSk7XG4gIHJldHVybiBsYXlvdXQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHRpbWUgPSByZXF1aXJlKCcuL3RpbWUnKTtcblxudmFyIGxlZ2VuZCA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmxlZ2VuZC5kZWZzID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdmFyIGRlZnMgPSBbXTtcblxuICAvLyBUT0RPOiBzdXBwb3J0IGFscGhhXG5cbiAgaWYgKGVuY29kaW5nLmhhcyhDT0xPUikgJiYgZW5jb2RpbmcubGVnZW5kKENPTE9SKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKENPTE9SLCBlbmNvZGluZywge1xuICAgICAgZmlsbDogQ09MT1IsXG4gICAgICBvcmllbnQ6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNJWkUpICYmIGVuY29kaW5nLmxlZ2VuZChTSVpFKSkge1xuICAgIGRlZnMucHVzaChsZWdlbmQuZGVmKFNJWkUsIGVuY29kaW5nLCB7XG4gICAgICBzaXplOiBTSVpFLFxuICAgICAgb3JpZW50OiBkZWZzLmxlbmd0aCA9PT0gMSA/ICdsZWZ0JyA6ICdyaWdodCdcbiAgICB9KSk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuaGFzKFNIQVBFKSAmJiBlbmNvZGluZy5sZWdlbmQoU0hBUEUpKSB7XG4gICAgaWYgKGRlZnMubGVuZ3RoID09PSAyKSB7XG4gICAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgICAgY29uc29sZS5lcnJvcignVmVnYWxpdGUgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgdHdvIGxlZ2VuZHMnKTtcbiAgICAgIHJldHVybiBkZWZzO1xuICAgIH1cbiAgICBkZWZzLnB1c2gobGVnZW5kLmRlZihTSEFQRSwgZW5jb2RpbmcsIHtcbiAgICAgIHNoYXBlOiBTSEFQRSxcbiAgICAgIG9yaWVudDogZGVmcy5sZW5ndGggPT09IDEgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgfSkpO1xuICB9XG5cbiAgcmV0dXJuIGRlZnM7XG59O1xuXG5sZWdlbmQuZGVmID0gZnVuY3Rpb24obmFtZSwgZW5jb2RpbmcsIHByb3BzKSB7XG4gIHZhciBkZWYgPSBwcm9wcywgZm47XG5cbiAgZGVmLnRpdGxlID0gZW5jb2RpbmcuZmllbGRUaXRsZShuYW1lKTtcblxuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpICYmIChmbiA9IGVuY29kaW5nLmZuKG5hbWUpKSAmJlxuICAgIHRpbWUuaGFzU2NhbGUoZm4pKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBkZWYucHJvcGVydGllcyA9IGRlZi5wcm9wZXJ0aWVzIHx8IHt9LFxuICAgICAgbGFiZWxzID0gcHJvcGVydGllcy5sYWJlbHMgPSBwcm9wZXJ0aWVzLmxhYmVscyB8fCB7fSxcbiAgICAgIHRleHQgPSBsYWJlbHMudGV4dCA9IGxhYmVscy50ZXh0IHx8IHt9O1xuXG4gICAgdGV4dC5zY2FsZSA9ICd0aW1lLScrIGZuO1xuICB9XG5cbiAgcmV0dXJuIGRlZjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBnbG9iYWxzID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpLFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpLFxuICB2bHNjYWxlID0gcmVxdWlyZSgnLi9zY2FsZScpO1xuXG52YXIgbWFya3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5tYXJrcy5kZWYgPSBmdW5jdGlvbihtYXJrLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSkge1xuICB2YXIgZGVmcyA9IFtdO1xuXG4gIC8vIHRvIGFkZCBhIGJhY2tncm91bmQgdG8gdGV4dCwgd2UgbmVlZCB0byBhZGQgaXQgYmVmb3JlIHRoZSB0ZXh0XG4gIGlmIChlbmNvZGluZy5tYXJrdHlwZSgpID09PSBURVhUICYmIGVuY29kaW5nLmhhcyhDT0xPUikpIHtcbiAgICB2YXIgYmcgPSB7XG4gICAgICB4OiB7dmFsdWU6IDB9LFxuICAgICAgeToge3ZhbHVlOiAwfSxcbiAgICAgIHgyOiB7dmFsdWU6IGxheW91dC5jZWxsV2lkdGh9LFxuICAgICAgeTI6IHt2YWx1ZTogbGF5b3V0LmNlbGxIZWlnaHR9LFxuICAgICAgZmlsbDoge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGVuY29kaW5nLmZpZWxkKENPTE9SKX1cbiAgICB9O1xuICAgIGRlZnMucHVzaCh7XG4gICAgICB0eXBlOiAncmVjdCcsXG4gICAgICBmcm9tOiB7ZGF0YTogVEFCTEV9LFxuICAgICAgcHJvcGVydGllczoge2VudGVyOiBiZywgdXBkYXRlOiBiZ31cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFkZCB0aGUgbWFyayBkZWYgZm9yIHRoZSBtYWluIHRoaW5nXG4gIHZhciBwID0gbWFyay5wcm9wKGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlKTtcbiAgZGVmcy5wdXNoKHtcbiAgICB0eXBlOiBtYXJrLnR5cGUsXG4gICAgZnJvbToge2RhdGE6IFRBQkxFfSxcbiAgICBwcm9wZXJ0aWVzOiB7ZW50ZXI6IHAsIHVwZGF0ZTogcH1cbiAgfSk7XG5cbiAgcmV0dXJuIGRlZnM7XG59O1xuXG5tYXJrcy5iYXIgPSB7XG4gIHR5cGU6ICdyZWN0JyxcbiAgc3RhY2s6IHRydWUsXG4gIHByb3A6IGJhcl9wcm9wcyxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxfVxufTtcblxubWFya3MubGluZSA9IHtcbiAgdHlwZTogJ2xpbmUnLFxuICBsaW5lOiB0cnVlLFxuICBwcm9wOiBsaW5lX3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3gnLCAneSddLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIGRldGFpbDoxfVxufTtcblxubWFya3MuYXJlYSA9IHtcbiAgdHlwZTogJ2FyZWEnLFxuICBzdGFjazogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcmVxdWlyZWRFbmNvZGluZzogWyd4JywgJ3knXSxcbiAgcHJvcDogYXJlYV9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgY29sb3I6IDEsIGFscGhhOiAxfVxufTtcblxubWFya3MudGljayA9IHtcbiAgdHlwZTogJ3JlY3QnLFxuICBwcm9wOiB0aWNrX3Byb3BzLFxuICBzdXBwb3J0ZWRFbmNvZGluZzoge3JvdzogMSwgY29sOiAxLCB4OiAxLCB5OiAxLCBjb2xvcjogMSwgYWxwaGE6IDEsIGRldGFpbDogMX1cbn07XG5cbm1hcmtzLmNpcmNsZSA9IHtcbiAgdHlwZTogJ3N5bWJvbCcsXG4gIHByb3A6IGZpbGxlZF9wb2ludF9wcm9wcygnY2lyY2xlJyksXG4gIHN1cHBvcnRlZEVuY29kaW5nOiB7cm93OiAxLCBjb2w6IDEsIHg6IDEsIHk6IDEsIHNpemU6IDEsIGNvbG9yOiAxLCBhbHBoYTogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3Muc3F1YXJlID0ge1xuICB0eXBlOiAnc3ltYm9sJyxcbiAgcHJvcDogZmlsbGVkX3BvaW50X3Byb3BzKCdzcXVhcmUnKSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IG1hcmtzLmNpcmNsZS5zdXBwb3J0ZWRFbmNvZGluZ1xufTtcblxubWFya3MucG9pbnQgPSB7XG4gIHR5cGU6ICdzeW1ib2wnLFxuICBwcm9wOiBwb2ludF9wcm9wcyxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgeDogMSwgeTogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCBzaGFwZTogMSwgZGV0YWlsOiAxfVxufTtcblxubWFya3MudGV4dCA9IHtcbiAgdHlwZTogJ3RleHQnLFxuICBwcm9wOiB0ZXh0X3Byb3BzLFxuICByZXF1aXJlZEVuY29kaW5nOiBbJ3RleHQnXSxcbiAgc3VwcG9ydGVkRW5jb2Rpbmc6IHtyb3c6IDEsIGNvbDogMSwgc2l6ZTogMSwgY29sb3I6IDEsIGFscGhhOiAxLCB0ZXh0OiAxfVxufTtcblxuZnVuY3Rpb24gYmFyX3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogZS5zY2FsZShYKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHsgLy8gaXMgb3JkaW5hbFxuICAgIHAueGMgPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPIGFkZCBzaW5nbGUgYmFyIG9mZnNldFxuICAgIHAueGMgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogZS5zY2FsZShZKS50eXBlID09PSAnbG9nJyA/IDEgOiAwfTtcbiAgfSBlbHNlIGlmIChlLmhhcyhZKSkgeyAvLyBpcyBvcmRpbmFsXG4gICAgcC55YyA9IHtzY2FsZTogWSwgZmllbGQ6IGUuZmllbGQoWSl9O1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE8gYWRkIHNpbmdsZSBiYXIgb2Zmc2V0XG4gICAgcC55YyA9IHtncm91cDogJ2hlaWdodCd9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzT3JkaW5hbFNjYWxlKFgpKSB7IC8vIG5vIFggb3IgWCBpcyBvcmRpbmFsXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLndpZHRoID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAud2lkdGggPSB7XG4gICAgICAgIHZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCksXG4gICAgICAgIG9mZnNldDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgeyAvLyBYIGlzIFF1YW50IG9yIFRpbWUgU2NhbGVcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAyfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNPcmRpbmFsU2NhbGUoWSkpIHsgLy8gbm8gWSBvciBZIGlzIG9yZGluYWxcbiAgICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICAgIHAuaGVpZ2h0ID0ge3NjYWxlOiBTSVpFLCBmaWVsZDogZS5maWVsZChTSVpFKX07XG4gICAgfSBlbHNlIHtcbiAgICAgIHAuaGVpZ2h0ID0ge1xuICAgICAgICB2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpLFxuICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIHsgLy8gWSBpcyBRdWFudCBvciBUaW1lIFNjYWxlXG4gICAgcC5oZWlnaHQgPSB7dmFsdWU6IDJ9O1xuICB9XG5cbiAgLy8gZmlsbFxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIHtcbiAgICBwLmZpbGwgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfVxuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBwb2ludF9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IGUuYmFuZFNpemUoWSwgbGF5b3V0LnkudXNlU21hbGxCYW5kKSAvIDJ9O1xuICB9XG5cbiAgLy8gc2l6ZVxuICBpZiAoZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoU0laRSkpIHtcbiAgICBwLnNpemUgPSB7dmFsdWU6IGUudmFsdWUoU0laRSl9O1xuICB9XG5cbiAgLy8gc2hhcGVcbiAgaWYgKGUuaGFzKFNIQVBFKSkge1xuICAgIHAuc2hhcGUgPSB7c2NhbGU6IFNIQVBFLCBmaWVsZDogZS5maWVsZChTSEFQRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSEFQRSkpIHtcbiAgICBwLnNoYXBlID0ge3ZhbHVlOiBlLnZhbHVlKFNIQVBFKX07XG4gIH1cblxuICAvLyBzdHJva2VcbiAgaWYgKGUuaGFzKENPTE9SKSkge1xuICAgIHAuc3Ryb2tlID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7dmFsdWU6IGUudmFsdWUoQ09MT1IpfTtcbiAgfVxuXG4gIC8vIGFscGhhXG4gIGlmIChlLmhhcyhBTFBIQSkpIHtcbiAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICB9IGVsc2UgaWYgKGUudmFsdWUoQUxQSEEpICE9PSB1bmRlZmluZWQpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IGUudmFsdWUoQUxQSEEpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBzdHlsZS5vcGFjaXR5fTtcbiAgfVxuXG4gIHAuc3Ryb2tlV2lkdGggPSB7dmFsdWU6IGUuY29uZmlnKCdzdHJva2VXaWR0aCcpfTtcblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gbGluZV9wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5zdHJva2UgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLnN0cm9rZSA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9XG5cbiAgcC5zdHJva2VXaWR0aCA9IHt2YWx1ZTogZS5jb25maWcoJ3N0cm9rZVdpZHRoJyl9O1xuXG4gIHJldHVybiBwO1xufVxuXG5mdW5jdGlvbiBhcmVhX3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmlzTWVhc3VyZShYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICAgIGlmIChlLmlzRGltZW5zaW9uKFkpKSB7XG4gICAgICBwLngyID0ge3NjYWxlOiBYLCB2YWx1ZTogMH07XG4gICAgICBwLm9yaWVudCA9IHt2YWx1ZTogJ2hvcml6b250YWwnfTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5pc01lYXN1cmUoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBwLnkyID0ge3NjYWxlOiBZLCB2YWx1ZTogMH07XG4gIH0gZWxzZSBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgfSBlbHNlIHtcbiAgICBwLnkgPSB7Z3JvdXA6ICdoZWlnaHQnfTtcbiAgfVxuXG4gIC8vIHN0cm9rZVxuICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3NjYWxlOiBDT0xPUiwgZmllbGQ6IGUuZmllbGQoQ09MT1IpfTtcbiAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gIH1cblxuICAvLyBhbHBoYVxuICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgcC5vcGFjaXR5ID0ge3NjYWxlOiBBTFBIQSwgZmllbGQ6IGUuZmllbGQoQUxQSEEpfTtcbiAgfSBlbHNlIGlmIChlLnZhbHVlKEFMUEhBKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gIH1cblxuICByZXR1cm4gcDtcbn1cblxuZnVuY3Rpb24gdGlja19wcm9wcyhlLCBsYXlvdXQsIHN0eWxlKSB7XG4gIHZhciBwID0ge307XG5cbiAgLy8geFxuICBpZiAoZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihYKSkge1xuICAgICAgcC54Lm9mZnNldCA9IC1lLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWCkpIHtcbiAgICBwLnggPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8geVxuICBpZiAoZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICBpZiAoZS5pc0RpbWVuc2lvbihZKSkge1xuICAgICAgcC55Lm9mZnNldCA9IC1lLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAzO1xuICAgIH1cbiAgfSBlbHNlIGlmICghZS5oYXMoWSkpIHtcbiAgICBwLnkgPSB7dmFsdWU6IDB9O1xuICB9XG5cbiAgLy8gd2lkdGhcbiAgaWYgKCFlLmhhcyhYKSB8fCBlLmlzRGltZW5zaW9uKFgpKSB7XG4gICAgcC53aWR0aCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShYLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLndpZHRoID0ge3ZhbHVlOiAxfTtcbiAgfVxuXG4gIC8vIGhlaWdodFxuICBpZiAoIWUuaGFzKFkpIHx8IGUuaXNEaW1lbnNpb24oWSkpIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogZS5iYW5kU2l6ZShZLCBsYXlvdXQueS51c2VTbWFsbEJhbmQpIC8gMS41fTtcbiAgfSBlbHNlIHtcbiAgICBwLmhlaWdodCA9IHt2YWx1ZTogMX07XG4gIH1cblxuICAvLyBmaWxsXG4gIGlmIChlLmhhcyhDT0xPUikpIHtcbiAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICB9IGVsc2Uge1xuICAgIHAuZmlsbCA9IHt2YWx1ZTogZS52YWx1ZShDT0xPUil9O1xuICB9XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhDT0xPUikpIHtcbiAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICB9XG5cbiAgcmV0dXJuIHA7XG59XG5cbmZ1bmN0aW9uIGZpbGxlZF9wb2ludF9wcm9wcyhzaGFwZSkge1xuICByZXR1cm4gZnVuY3Rpb24oZSwgbGF5b3V0LCBzdHlsZSkge1xuICAgIHZhciBwID0ge307XG5cbiAgICAvLyB4XG4gICAgaWYgKGUuaGFzKFgpKSB7XG4gICAgICBwLnggPSB7c2NhbGU6IFgsIGZpZWxkOiBlLmZpZWxkKFgpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyB5XG4gICAgaWYgKGUuaGFzKFkpKSB7XG4gICAgICBwLnkgPSB7c2NhbGU6IFksIGZpZWxkOiBlLmZpZWxkKFkpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhZKSkge1xuICAgICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgICB9XG5cbiAgICAvLyBzaXplXG4gICAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgICBwLnNpemUgPSB7c2NhbGU6IFNJWkUsIGZpZWxkOiBlLmZpZWxkKFNJWkUpfTtcbiAgICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgICAgcC5zaXplID0ge3ZhbHVlOiBlLnZhbHVlKFNJWkUpfTtcbiAgICB9XG5cbiAgICAvLyBzaGFwZVxuICAgIHAuc2hhcGUgPSB7dmFsdWU6IHNoYXBlfTtcblxuICAgIC8vIGZpbGxcbiAgICBpZiAoZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLmZpbGwgPSB7c2NhbGU6IENPTE9SLCBmaWVsZDogZS5maWVsZChDT0xPUil9O1xuICAgIH0gZWxzZSBpZiAoIWUuaGFzKENPTE9SKSkge1xuICAgICAgcC5maWxsID0ge3ZhbHVlOiBlLnZhbHVlKENPTE9SKX07XG4gICAgfVxuXG4gICAgLy8gYWxwaGFcbiAgICBpZiAoZS5oYXMoQUxQSEEpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7c2NhbGU6IEFMUEhBLCBmaWVsZDogZS5maWVsZChBTFBIQSl9O1xuICAgIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcC5vcGFjaXR5ID0ge3ZhbHVlOiBlLnZhbHVlKEFMUEhBKX07XG4gICAgfSBlbHNlIGlmICghZS5oYXMoQ09MT1IpKSB7XG4gICAgICBwLm9wYWNpdHkgPSB7dmFsdWU6IHN0eWxlLm9wYWNpdHl9O1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZXh0X3Byb3BzKGUsIGxheW91dCwgc3R5bGUpIHtcbiAgdmFyIHAgPSB7fTtcblxuICAvLyB4XG4gIGlmIChlLmhhcyhYKSkge1xuICAgIHAueCA9IHtzY2FsZTogWCwgZmllbGQ6IGUuZmllbGQoWCl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhYKSkge1xuICAgIGlmIChlLmhhcyhURVhUKSAmJiBlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC54ID0ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRoLTV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnggPSB7dmFsdWU6IGUuYmFuZFNpemUoWCwgbGF5b3V0LngudXNlU21hbGxCYW5kKSAvIDJ9O1xuICAgIH1cbiAgfVxuXG4gIC8vIHlcbiAgaWYgKGUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3NjYWxlOiBZLCBmaWVsZDogZS5maWVsZChZKX07XG4gIH0gZWxzZSBpZiAoIWUuaGFzKFkpKSB7XG4gICAgcC55ID0ge3ZhbHVlOiBlLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCkgLyAyfTtcbiAgfVxuXG4gIC8vIHNpemVcbiAgaWYgKGUuaGFzKFNJWkUpKSB7XG4gICAgcC5mb250U2l6ZSA9IHtzY2FsZTogU0laRSwgZmllbGQ6IGUuZmllbGQoU0laRSl9O1xuICB9IGVsc2UgaWYgKCFlLmhhcyhTSVpFKSkge1xuICAgIHAuZm9udFNpemUgPSB7dmFsdWU6IGUuZm9udCgnc2l6ZScpfTtcbiAgfVxuXG4gIC8vIGZpbGxcbiAgLy8gY29sb3Igc2hvdWxkIGJlIHNldCB0byBiYWNrZ3JvdW5kXG4gIHAuZmlsbCA9IHt2YWx1ZTogJ2JsYWNrJ307XG5cbiAgLy8gYWxwaGFcbiAgaWYgKGUuaGFzKEFMUEhBKSkge1xuICAgIHAub3BhY2l0eSA9IHtzY2FsZTogQUxQSEEsIGZpZWxkOiBlLmZpZWxkKEFMUEhBKX07XG4gIH0gZWxzZSBpZiAoZS52YWx1ZShBTFBIQSkgIT09IHVuZGVmaW5lZCkge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogZS52YWx1ZShBTFBIQSl9O1xuICB9IGVsc2Uge1xuICAgIHAub3BhY2l0eSA9IHt2YWx1ZTogc3R5bGUub3BhY2l0eX07XG4gIH1cblxuICAvLyB0ZXh0XG4gIGlmIChlLmhhcyhURVhUKSkge1xuICAgIGlmIChlLmlzVHlwZShURVhULCBRKSkge1xuICAgICAgcC50ZXh0ID0ge3RlbXBsYXRlOiBcInt7XCIgKyBlLmZpZWxkKFRFWFQpICsgXCIgfCBudW1iZXI6Jy4zcyd9fVwifTtcbiAgICAgIHAuYWxpZ24gPSB7dmFsdWU6ICdyaWdodCd9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwLnRleHQgPSB7ZmllbGQ6IGUuZmllbGQoVEVYVCl9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwLnRleHQgPSB7dmFsdWU6ICdBYmMnfTtcbiAgfVxuXG4gIHAuZm9udCA9IHt2YWx1ZTogZS5mb250KCdmYW1pbHknKX07XG4gIHAuZm9udFdlaWdodCA9IHt2YWx1ZTogZS5mb250KCd3ZWlnaHQnKX07XG4gIHAuZm9udFN0eWxlID0ge3ZhbHVlOiBlLmZvbnQoJ3N0eWxlJyl9O1xuICBwLmJhc2VsaW5lID0ge3ZhbHVlOiBlLnRleHQoJ2Jhc2VsaW5lJyl9O1xuXG4gIHJldHVybiBwO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgdGltZSA9IHJlcXVpcmUoJy4vdGltZScpO1xuXG52YXIgc2NhbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5zY2FsZS5uYW1lcyA9IGZ1bmN0aW9uKHByb3BzKSB7XG4gIHJldHVybiB1dGlsLmtleXModXRpbC5rZXlzKHByb3BzKS5yZWR1Y2UoZnVuY3Rpb24oYSwgeCkge1xuICAgIGlmIChwcm9wc1t4XSAmJiBwcm9wc1t4XS5zY2FsZSkgYVtwcm9wc1t4XS5zY2FsZV0gPSAxO1xuICAgIHJldHVybiBhO1xuICB9LCB7fSkpO1xufTtcblxuc2NhbGUuZGVmcyA9IGZ1bmN0aW9uKG5hbWVzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgc29ydGluZywgb3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fTtcblxuICByZXR1cm4gbmFtZXMucmVkdWNlKGZ1bmN0aW9uKGEsIG5hbWUpIHtcbiAgICB2YXIgcyA9IHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB0eXBlOiBzY2FsZS50eXBlKG5hbWUsIGVuY29kaW5nKSxcbiAgICAgIGRvbWFpbjogc2NhbGVfZG9tYWluKG5hbWUsIGVuY29kaW5nLCBzb3J0aW5nLCBvcHQpXG4gICAgfTtcbiAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcgJiYgIWVuY29kaW5nLmJpbihuYW1lKSAmJiBlbmNvZGluZy5zb3J0KG5hbWUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcy5zb3J0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzY2FsZV9yYW5nZShzLCBlbmNvZGluZywgbGF5b3V0LCBzdHlsZSwgb3B0KTtcblxuICAgIHJldHVybiAoYS5wdXNoKHMpLCBhKTtcbiAgfSwgW10pO1xufTtcblxuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKG5hbWUsIGVuY29kaW5nKSB7XG5cbiAgc3dpdGNoIChlbmNvZGluZy50eXBlKG5hbWUpKSB7XG4gICAgY2FzZSBPOiByZXR1cm4gJ29yZGluYWwnO1xuICAgIGNhc2UgVDpcbiAgICAgIHZhciBmbiA9IGVuY29kaW5nLmZuKG5hbWUpO1xuICAgICAgcmV0dXJuIChmbiAmJiB0aW1lLnNjYWxlLnR5cGUoZm4sIG5hbWUpKSB8fCAndGltZSc7XG4gICAgY2FzZSBROlxuICAgICAgaWYgKGVuY29kaW5nLmJpbihuYW1lKSkge1xuICAgICAgICByZXR1cm4gbmFtZSA9PT0gQ09MT1IgPyAnbGluZWFyJyA6ICdvcmRpbmFsJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbmNvZGluZy5zY2FsZShuYW1lKS50eXBlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBzY2FsZV9kb21haW4obmFtZSwgZW5jb2RpbmcsIHNvcnRpbmcsIG9wdCkge1xuICBpZiAoZW5jb2RpbmcuaXNUeXBlKG5hbWUsIFQpKSB7XG4gICAgdmFyIHJhbmdlID0gdGltZS5zY2FsZS5kb21haW4oZW5jb2RpbmcuZm4obmFtZSksIG5hbWUpO1xuICAgIGlmKHJhbmdlKSByZXR1cm4gcmFuZ2U7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcuYmluKG5hbWUpKSB7XG4gICAgLy8gVE9ETzogYWRkIGluY2x1ZGVFbXB0eUNvbmZpZyBoZXJlXG4gICAgaWYgKG9wdC5zdGF0cykge1xuICAgICAgdmFyIGJpbnMgPSB1dGlsLmdldGJpbnMob3B0LnN0YXRzW2VuY29kaW5nLmZpZWxkTmFtZShuYW1lKV0sIGVuY29kaW5nLmJpbihuYW1lKS5tYXhiaW5zKTtcbiAgICAgIHZhciBkb21haW4gPSB1dGlsLnJhbmdlKGJpbnMuc3RhcnQsIGJpbnMuc3RvcCwgYmlucy5zdGVwKTtcbiAgICAgIHJldHVybiBuYW1lID09PSBZID8gZG9tYWluLnJldmVyc2UoKSA6IGRvbWFpbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSA9PSBvcHQuc3RhY2sgP1xuICAgIHtcbiAgICAgIGRhdGE6IFNUQUNLRUQsXG4gICAgICBmaWVsZDogJ2RhdGEuJyArIChvcHQuZmFjZXQgPyAnbWF4XycgOiAnJykgKyAnc3VtXycgKyBlbmNvZGluZy5maWVsZChuYW1lLCB0cnVlKVxuICAgIH0gOlxuICAgIHtkYXRhOiBzb3J0aW5nLmdldERhdGFzZXQobmFtZSksIGZpZWxkOiBlbmNvZGluZy5maWVsZChuYW1lKX07XG59XG5cbmZ1bmN0aW9uIHNjYWxlX3JhbmdlKHMsIGVuY29kaW5nLCBsYXlvdXQsIHN0eWxlLCBvcHQpIHtcbiAgdmFyIHNwZWMgPSBlbmNvZGluZy5zY2FsZShzLm5hbWUpO1xuICBzd2l0Y2ggKHMubmFtZSkge1xuICAgIGNhc2UgWDpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFgsIGxheW91dC54LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxXaWR0aCA/IFswLCBsYXlvdXQuY2VsbFdpZHRoXSA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuICAgICAgcy5yb3VuZCA9IHRydWU7XG4gICAgICBpZiAocy50eXBlID09PSAndGltZScpIHtcbiAgICAgICAgcy5uaWNlID0gZW5jb2RpbmcuZm4ocy5uYW1lKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWTpcbiAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICBzLmJhbmRXaWR0aCA9IGVuY29kaW5nLmJhbmRTaXplKFksIGxheW91dC55LnVzZVNtYWxsQmFuZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzLnJhbmdlID0gbGF5b3V0LmNlbGxIZWlnaHQgPyBbbGF5b3V0LmNlbGxIZWlnaHQsIDBdIDogJ2hlaWdodCc7XG5cbiAgICAgICAgaWYgKGVuY29kaW5nLmlzVHlwZShzLm5hbWUsVCkgJiYgZW5jb2RpbmcuZm4ocy5uYW1lKSA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy56ZXJvID0gc3BlYy56ZXJvID09PSB1bmRlZmluZWQgPyB0cnVlIDogc3BlYy56ZXJvO1xuICAgICAgICB9XG5cbiAgICAgICAgcy5yZXZlcnNlID0gc3BlYy5yZXZlcnNlO1xuICAgICAgfVxuXG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ3RpbWUnKSB7XG4gICAgICAgIHMubmljZSA9IGVuY29kaW5nLmZuKHMubmFtZSkgfHwgZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVOaWNlJyk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIFJPVzogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxIZWlnaHQ7XG4gICAgICBzLnJvdW5kID0gdHJ1ZTtcbiAgICAgIHMubmljZSA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICBjYXNlIENPTDogLy8gc3VwcG9ydCBvbmx5IG9yZGluYWxcbiAgICAgIHMuYmFuZFdpZHRoID0gbGF5b3V0LmNlbGxXaWR0aDtcbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy5uaWNlID0gdHJ1ZTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgU0laRTpcbiAgICAgIGlmIChlbmNvZGluZy5pcygnYmFyJykpIHtcbiAgICAgICAgLy8gRklYTUUgdGhpcyBpcyBkZWZpbml0ZWx5IGluY29ycmVjdFxuICAgICAgICAvLyBidXQgbGV0J3MgZml4IGl0IGxhdGVyIHNpbmNlIGJhciBzaXplIGlzIGEgYmFkIGVuY29kaW5nIGFueXdheVxuICAgICAgICBzLnJhbmdlID0gWzMsIE1hdGgubWF4KGVuY29kaW5nLmJhbmRTaXplKFgpLCBlbmNvZGluZy5iYW5kU2l6ZShZKSldO1xuICAgICAgfSBlbHNlIGlmIChlbmNvZGluZy5pcyhURVhUKSkge1xuICAgICAgICBzLnJhbmdlID0gWzgsIDQwXTtcbiAgICAgIH0gZWxzZSB7IC8vcG9pbnRcbiAgICAgICAgdmFyIGJhbmRTaXplID0gTWF0aC5taW4oZW5jb2RpbmcuYmFuZFNpemUoWCksIGVuY29kaW5nLmJhbmRTaXplKFkpKSAtIDE7XG4gICAgICAgIHMucmFuZ2UgPSBbMTAsIDAuOCAqIGJhbmRTaXplKmJhbmRTaXplXTtcbiAgICAgIH1cbiAgICAgIHMucm91bmQgPSB0cnVlO1xuICAgICAgcy56ZXJvID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFNIQVBFOlxuICAgICAgcy5yYW5nZSA9ICdzaGFwZXMnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBDT0xPUjpcbiAgICAgIHZhciByYW5nZSA9IGVuY29kaW5nLnNjYWxlKENPTE9SKS5yYW5nZTtcbiAgICAgIGlmIChyYW5nZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzLnR5cGUgPT09ICdvcmRpbmFsJykge1xuICAgICAgICAgIC8vIEZJWE1FXG4gICAgICAgICAgcmFuZ2UgPSBzdHlsZS5jb2xvclJhbmdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJhbmdlID0gWycjQTlEQjlGJywgJyMwRDVDMjEnXTtcbiAgICAgICAgICBzLnplcm8gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcy5yYW5nZSA9IHJhbmdlO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBBTFBIQTpcbiAgICAgIHMucmFuZ2UgPSBbMC4yLCAxLjBdO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZyBuYW1lOiAnKyBzLm5hbWUpO1xuICB9XG5cbiAgc3dpdGNoIChzLm5hbWUpIHtcbiAgICBjYXNlIFJPVzpcbiAgICBjYXNlIENPTDpcbiAgICAgIHMucGFkZGluZyA9IGVuY29kaW5nLmNvbmZpZygnY2VsbFBhZGRpbmcnKTtcbiAgICAgIHMub3V0ZXJQYWRkaW5nID0gMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgWDpcbiAgICBjYXNlIFk6XG4gICAgICBpZiAocy50eXBlID09PSAnb3JkaW5hbCcpIHsgLy8mJiAhcy5iYW5kV2lkdGhcbiAgICAgICAgcy5wb2ludHMgPSB0cnVlO1xuICAgICAgICBzLnBhZGRpbmcgPSBlbmNvZGluZy5iYW5kKHMubmFtZSkucGFkZGluZztcbiAgICAgIH1cbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTb3J0VHJhbnNmb3JtcztcblxuLy8gYWRkcyBuZXcgdHJhbnNmb3JtcyB0aGF0IHByb2R1Y2Ugc29ydGVkIGZpZWxkc1xuZnVuY3Rpb24gYWRkU29ydFRyYW5zZm9ybXMoc3BlYywgZW5jb2RpbmcsIHN0YXRzLCBvcHQpIHtcbiAgdmFyIGRhdGFzZXRNYXBwaW5nID0ge307XG4gIHZhciBjb3VudGVyID0gMDtcblxuICBlbmNvZGluZy5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkLCBlbmNUeXBlKSB7XG4gICAgdmFyIHNvcnRCeSA9IGVuY29kaW5nLnNvcnQoZW5jVHlwZSwgc3RhdHMpO1xuICAgIGlmIChzb3J0QnkubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGZpZWxkcyA9IHNvcnRCeS5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9wOiBkLmFnZ3IsXG4gICAgICAgICAgZmllbGQ6ICdkYXRhLicgKyBkLm5hbWVcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgYnlDbGF1c2UgPSBzb3J0QnkubWFwKGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHJldmVyc2UgPSAoZC5yZXZlcnNlID8gJy0nIDogJycpO1xuICAgICAgICByZXR1cm4gcmV2ZXJzZSArICdkYXRhLicgKyAoZC5hZ2dyPT09J2NvdW50JyA/ICdjb3VudCcgOiAoZC5hZ2dyICsgJ18nICsgZC5uYW1lKSk7XG4gICAgICB9KTtcblxuICAgICAgdmFyIGRhdGFOYW1lID0gJ3NvcnRlZCcgKyBjb3VudGVyKys7XG5cbiAgICAgIHZhciB0cmFuc2Zvcm1zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydkYXRhLicgKyBmaWVsZC5uYW1lXSxcbiAgICAgICAgICBmaWVsZHM6IGZpZWxkc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ3NvcnQnLFxuICAgICAgICAgIGJ5OiBieUNsYXVzZVxuICAgICAgICB9XG4gICAgICBdO1xuXG4gICAgICBzcGVjLmRhdGEucHVzaCh7XG4gICAgICAgIG5hbWU6IGRhdGFOYW1lLFxuICAgICAgICBzb3VyY2U6IFJBVyxcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1zXG4gICAgICB9KTtcblxuICAgICAgZGF0YXNldE1hcHBpbmdbZW5jVHlwZV0gPSBkYXRhTmFtZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3BlYzogc3BlYyxcbiAgICBnZXREYXRhc2V0OiBmdW5jdGlvbihlbmNUeXBlKSB7XG4gICAgICB2YXIgZGF0YSA9IGRhdGFzZXRNYXBwaW5nW2VuY1R5cGVdO1xuICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIHJldHVybiBUQUJMRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKSxcbiAgbWFya3MgPSByZXF1aXJlKCcuL21hcmtzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tpbmc7XG5cbmZ1bmN0aW9uIHN0YWNraW5nKHNwZWMsIGVuY29kaW5nLCBtZGVmLCBmYWNldHMpIHtcbiAgaWYgKCFtYXJrc1tlbmNvZGluZy5tYXJrdHlwZSgpXS5zdGFjaykgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIFRPRE86IGFkZCB8fCBlbmNvZGluZy5oYXMoTE9EKSBoZXJlIG9uY2UgTE9EIGlzIGltcGxlbWVudGVkXG4gIGlmICghZW5jb2RpbmcuaGFzKENPTE9SKSkgcmV0dXJuIGZhbHNlO1xuXG4gIHZhciBkaW09bnVsbCwgdmFsPW51bGwsIGlkeCA9bnVsbCxcbiAgICBpc1hNZWFzdXJlID0gZW5jb2RpbmcuaXNNZWFzdXJlKFgpLFxuICAgIGlzWU1lYXN1cmUgPSBlbmNvZGluZy5pc01lYXN1cmUoWSk7XG5cbiAgaWYgKGlzWE1lYXN1cmUgJiYgIWlzWU1lYXN1cmUpIHtcbiAgICBkaW0gPSBZO1xuICAgIHZhbCA9IFg7XG4gICAgaWR4ID0gMDtcbiAgfSBlbHNlIGlmIChpc1lNZWFzdXJlICYmICFpc1hNZWFzdXJlKSB7XG4gICAgZGltID0gWDtcbiAgICB2YWwgPSBZO1xuICAgIGlkeCA9IDE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7IC8vIG5vIHN0YWNrIGVuY29kaW5nXG4gIH1cblxuICAvLyBhZGQgdHJhbnNmb3JtIHRvIGNvbXB1dGUgc3VtcyBmb3Igc2NhbGVcbiAgdmFyIHN0YWNrZWQgPSB7XG4gICAgbmFtZTogU1RBQ0tFRCxcbiAgICBzb3VyY2U6IFRBQkxFLFxuICAgIHRyYW5zZm9ybTogW3tcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogW2VuY29kaW5nLmZpZWxkKGRpbSldLmNvbmNhdChmYWNldHMpLCAvLyBkaW0gYW5kIG90aGVyIGZhY2V0c1xuICAgICAgZmllbGRzOiBbe29wOiAnc3VtJywgZmllbGQ6IGVuY29kaW5nLmZpZWxkKHZhbCl9XSAvLyBUT0RPIGNoZWNrIGlmIGZpZWxkIHdpdGggYWdnciBpcyBjb3JyZWN0P1xuICAgIH1dXG4gIH07XG5cbiAgaWYgKGZhY2V0cyAmJiBmYWNldHMubGVuZ3RoID4gMCkge1xuICAgIHN0YWNrZWQudHJhbnNmb3JtLnB1c2goeyAvL2NhbGN1bGF0ZSBtYXggZm9yIGVhY2ggZmFjZXRcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieTogZmFjZXRzLFxuICAgICAgZmllbGRzOiBbe29wOiAnbWF4JywgZmllbGQ6ICdkYXRhLnN1bV8nICsgZW5jb2RpbmcuZmllbGQodmFsLCB0cnVlKX1dXG4gICAgfSk7XG4gIH1cblxuICBzcGVjLmRhdGEucHVzaChzdGFja2VkKTtcblxuICAvLyBhZGQgc3RhY2sgdHJhbnNmb3JtIHRvIG1hcmtcbiAgbWRlZi5mcm9tLnRyYW5zZm9ybSA9IFt7XG4gICAgdHlwZTogJ3N0YWNrJyxcbiAgICBwb2ludDogZW5jb2RpbmcuZmllbGQoZGltKSxcbiAgICBoZWlnaHQ6IGVuY29kaW5nLmZpZWxkKHZhbCksXG4gICAgb3V0cHV0OiB7eTE6IHZhbCwgeTA6IHZhbCArICcyJ31cbiAgfV07XG5cbiAgLy8gVE9ETzogVGhpcyBpcyBzdXBlciBoYWNrLWlzaCAtLSBjb25zb2xpZGF0ZSBpbnRvIG1vZHVsYXIgbWFyayBwcm9wZXJ0aWVzP1xuICBtZGVmLnByb3BlcnRpZXMudXBkYXRlW3ZhbF0gPSBtZGVmLnByb3BlcnRpZXMuZW50ZXJbdmFsXSA9IHtzY2FsZTogdmFsLCBmaWVsZDogdmFsfTtcbiAgbWRlZi5wcm9wZXJ0aWVzLnVwZGF0ZVt2YWwgKyAnMiddID0gbWRlZi5wcm9wZXJ0aWVzLmVudGVyW3ZhbCArICcyJ10gPSB7c2NhbGU6IHZhbCwgZmllbGQ6IHZhbCArICcyJ307XG5cbiAgcmV0dXJuIHZhbDsgLy9yZXR1cm4gc3RhY2sgZW5jb2Rpbmdcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyksXG4gIHZsZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpLFxuICBFbmNvZGluZyA9IHJlcXVpcmUoJy4uL0VuY29kaW5nJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXRzKSB7XG4gIHJldHVybiB7XG4gICAgb3BhY2l0eTogZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLCBzdGF0cyksXG4gICAgY29sb3JSYW5nZTogY29sb3JSYW5nZShlbmNvZGluZywgc3RhdHMpXG4gIH07XG59O1xuXG5mdW5jdGlvbiBjb2xvclJhbmdlKGVuY29kaW5nLCBzdGF0cyl7XG4gIGlmIChlbmNvZGluZy5oYXMoQ09MT1IpICYmIGVuY29kaW5nLmlzRGltZW5zaW9uKENPTE9SKSkge1xuICAgIHZhciBjYXJkaW5hbGl0eSA9IGVuY29kaW5nLmNhcmRpbmFsaXR5KENPTE9SLCBzdGF0cyk7XG4gICAgaWYgKGNhcmRpbmFsaXR5IDw9IDEwKSB7XG4gICAgICByZXR1cm4gXCJjYXRlZ29yeTEwXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcImNhdGVnb3J5MjBcIjtcbiAgICB9XG4gICAgLy8gVE9ETyBjYW4gdmVnYSBpbnRlcnBvbGF0ZSByYW5nZSBmb3Igb3JkaW5hbCBzY2FsZT9cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZXN0aW1hdGVPcGFjaXR5KGVuY29kaW5nLHN0YXRzKSB7XG4gIGlmICghc3RhdHMpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHZhciBudW1Qb2ludHMgPSAwO1xuXG4gIGlmIChlbmNvZGluZy5pc0FnZ3JlZ2F0ZSgpKSB7IC8vIGFnZ3JlZ2F0ZSBwbG90XG4gICAgbnVtUG9pbnRzID0gMTtcblxuICAgIC8vICBnZXQgbnVtYmVyIG9mIHBvaW50cyBpbiBlYWNoIFwiY2VsbFwiXG4gICAgLy8gIGJ5IGNhbGN1bGF0aW5nIHByb2R1Y3Qgb2YgY2FyZGluYWxpdHlcbiAgICAvLyAgZm9yIGVhY2ggbm9uIGZhY2V0aW5nIGFuZCBub24tb3JkaW5hbCBYIC8gWSBmaWVsZHNcbiAgICAvLyAgbm90ZSB0aGF0IG9yZGluYWwgeCx5IGFyZSBub3QgaW5jbHVkZSBzaW5jZSB3ZSBjYW5cbiAgICAvLyAgY29uc2lkZXIgdGhhdCBvcmRpbmFsIHggYXJlIHN1YmRpdmlkaW5nIHRoZSBjZWxsIGludG8gc3ViY2VsbHMgYW55d2F5XG4gICAgZW5jb2RpbmcuZm9yRWFjaChmdW5jdGlvbihmaWVsZCwgZW5jVHlwZSkge1xuXG4gICAgICBpZiAoZW5jVHlwZSAhPT0gUk9XICYmIGVuY1R5cGUgIT09IENPTCAmJlxuICAgICAgICAgICEoKGVuY1R5cGUgPT09IFggfHwgZW5jVHlwZSA9PT0gWSkgJiZcbiAgICAgICAgICB2bGZpZWxkLmlzT3JkaW5hbFNjYWxlKGZpZWxkLCB0cnVlKSlcbiAgICAgICAgKSB7XG4gICAgICAgIG51bVBvaW50cyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShlbmNUeXBlLCBzdGF0cyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBlbHNlIHsgLy8gcmF3IHBsb3RcbiAgICBudW1Qb2ludHMgPSBzdGF0cy5jb3VudDtcblxuICAgIC8vIHNtYWxsIG11bHRpcGxlcyBkaXZpZGUgbnVtYmVyIG9mIHBvaW50c1xuICAgIHZhciBudW1NdWx0aXBsZXMgPSAxO1xuICAgIGlmIChlbmNvZGluZy5oYXMoUk9XKSkge1xuICAgICAgbnVtTXVsdGlwbGVzICo9IGVuY29kaW5nLmNhcmRpbmFsaXR5KFJPVywgc3RhdHMpO1xuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcuaGFzKENPTCkpIHtcbiAgICAgIG51bU11bHRpcGxlcyAqPSBlbmNvZGluZy5jYXJkaW5hbGl0eShDT0wsIHN0YXRzKTtcbiAgICB9XG4gICAgbnVtUG9pbnRzIC89IG51bU11bHRpcGxlcztcbiAgfVxuXG4gIHZhciBvcGFjaXR5ID0gMDtcbiAgaWYgKG51bVBvaW50cyA8IDIwKSB7XG4gICAgb3BhY2l0eSA9IDE7XG4gIH0gZWxzZSBpZiAobnVtUG9pbnRzIDwgMjAwKSB7XG4gICAgb3BhY2l0eSA9IDAuNztcbiAgfSBlbHNlIGlmIChudW1Qb2ludHMgPCAxMDAwIHx8IGVuY29kaW5nLmlzKCd0aWNrJykpIHtcbiAgICBvcGFjaXR5ID0gMC42O1xuICB9IGVsc2Uge1xuICAgIG9wYWNpdHkgPSAwLjM7XG4gIH1cblxuICByZXR1cm4gb3BhY2l0eTtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vZ2xvYmFscycpO1xuXG52YXIgZ3JvdXBkZWYgPSByZXF1aXJlKCcuL2dyb3VwJykuZGVmO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YmZhY2V0aW5nO1xuXG5mdW5jdGlvbiBzdWJmYWNldGluZyhncm91cCwgbWRlZiwgZGV0YWlscywgc3RhY2ssIGVuY29kaW5nKSB7XG4gIHZhciBtID0gZ3JvdXAubWFya3MsXG4gICAgZyA9IGdyb3VwZGVmKCdzdWJmYWNldCcsIHttYXJrczogbX0pO1xuXG4gIGdyb3VwLm1hcmtzID0gW2ddO1xuICBnLmZyb20gPSBtZGVmLmZyb207XG4gIGRlbGV0ZSBtZGVmLmZyb207XG5cbiAgLy9UT0RPIHRlc3QgTE9EIC0tIHdlIHNob3VsZCBzdXBwb3J0IHN0YWNrIC8gbGluZSB3aXRob3V0IGNvbG9yIChMT0QpIGZpZWxkXG4gIHZhciB0cmFucyA9IChnLmZyb20udHJhbnNmb3JtIHx8IChnLmZyb20udHJhbnNmb3JtID0gW10pKTtcbiAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ2ZhY2V0Jywga2V5czogZGV0YWlsc30pO1xuXG4gIGlmIChzdGFjayAmJiBlbmNvZGluZy5oYXMoQ09MT1IpKSB7XG4gICAgdHJhbnMudW5zaGlmdCh7dHlwZTogJ3NvcnQnLCBieTogZW5jb2RpbmcuZmllbGQoQ09MT1IpfSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuLi9nbG9iYWxzJyk7XG5cbnZhciBncm91cGRlZiA9IHJlcXVpcmUoJy4vZ3JvdXAnKS5kZWYsXG4gIHZsZGF0YSA9IHJlcXVpcmUoJy4uL2RhdGEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZW1wbGF0ZTtcblxuZnVuY3Rpb24gdGVtcGxhdGUoZW5jb2RpbmcsIGxheW91dCwgc3RhdHMpIHsgLy9oYWNrIHVzZSBzdGF0c1xuXG4gIHZhciBkYXRhID0ge25hbWU6IFJBVywgZm9ybWF0OiB7dHlwZTogZW5jb2RpbmcuY29uZmlnKCdkYXRhRm9ybWF0VHlwZScpfX0sXG4gICAgdGFibGUgPSB7bmFtZTogVEFCTEUsIHNvdXJjZTogUkFXfSxcbiAgICBkYXRhVXJsID0gdmxkYXRhLmdldFVybChlbmNvZGluZywgc3RhdHMpO1xuICBpZiAoZGF0YVVybCkgZGF0YS51cmwgPSBkYXRhVXJsO1xuXG4gIHZhciBwcmVhZ2dyZWdhdGVkRGF0YSA9IGVuY29kaW5nLmNvbmZpZygndXNlVmVnYVNlcnZlcicpO1xuXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgbmFtZTtcbiAgICBpZiAoZmllbGQudHlwZSA9PSBUKSB7XG4gICAgICBkYXRhLmZvcm1hdC5wYXJzZSA9IGRhdGEuZm9ybWF0LnBhcnNlIHx8IHt9O1xuICAgICAgZGF0YS5mb3JtYXQucGFyc2VbZmllbGQubmFtZV0gPSAnZGF0ZSc7XG4gICAgfSBlbHNlIGlmIChmaWVsZC50eXBlID09IFEpIHtcbiAgICAgIGRhdGEuZm9ybWF0LnBhcnNlID0gZGF0YS5mb3JtYXQucGFyc2UgfHwge307XG4gICAgICBpZiAoZmllbGQuYWdnciA9PT0gJ2NvdW50Jykge1xuICAgICAgICBuYW1lID0gJ2NvdW50JztcbiAgICAgIH0gZWxzZSBpZiAocHJlYWdncmVnYXRlZERhdGEgJiYgZmllbGQuYmluKSB7XG4gICAgICAgIG5hbWUgPSAnYmluXycgKyBmaWVsZC5uYW1lO1xuICAgICAgfSBlbHNlIGlmIChwcmVhZ2dyZWdhdGVkRGF0YSAmJiBmaWVsZC5hZ2dyKSB7XG4gICAgICAgIG5hbWUgPSBmaWVsZC5hZ2dyICsgJ18nICsgZmllbGQubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgPSBmaWVsZC5uYW1lO1xuICAgICAgfVxuICAgICAgZGF0YS5mb3JtYXQucGFyc2VbbmFtZV0gPSAnbnVtYmVyJztcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGxheW91dC53aWR0aCxcbiAgICBoZWlnaHQ6IGxheW91dC5oZWlnaHQsXG4gICAgcGFkZGluZzogJ2F1dG8nLFxuICAgIGRhdGE6IFtkYXRhLCB0YWJsZV0sXG4gICAgbWFya3M6IFtncm91cGRlZignY2VsbCcsIHtcbiAgICAgIHdpZHRoOiBsYXlvdXQuY2VsbFdpZHRoID8ge3ZhbHVlOiBsYXlvdXQuY2VsbFdpZHRofSA6IHVuZGVmaW5lZCxcbiAgICAgIGhlaWdodDogbGF5b3V0LmNlbGxIZWlnaHQgPyB7dmFsdWU6IGxheW91dC5jZWxsSGVpZ2h0fSA6IHVuZGVmaW5lZFxuICAgIH0pXVxuICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2xvYmFscyA9IHJlcXVpcmUoJy4uL2dsb2JhbHMnKSxcbiAgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aW1lO1xuXG5mdW5jdGlvbiB0aW1lKHNwZWMsIGVuY29kaW5nLCBvcHQpIHtcbiAgdmFyIHRpbWVGaWVsZHMgPSB7fSwgdGltZUZuID0ge307XG5cbiAgLy8gZmluZCB1bmlxdWUgZm9ybXVsYSB0cmFuc2Zvcm1hdGlvbiBhbmQgYmluIGZ1bmN0aW9uXG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gVCAmJiBmaWVsZC5mbikge1xuICAgICAgdGltZUZpZWxkc1tlbmNvZGluZy5maWVsZChlbmNUeXBlKV0gPSB7XG4gICAgICAgIGZpZWxkOiBmaWVsZCxcbiAgICAgICAgZW5jVHlwZTogZW5jVHlwZVxuICAgICAgfTtcbiAgICAgIHRpbWVGbltmaWVsZC5mbl0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gYWRkIGZvcm11bGEgdHJhbnNmb3JtXG4gIHZhciBkYXRhID0gc3BlYy5kYXRhWzFdLFxuICAgIHRyYW5zZm9ybSA9IGRhdGEudHJhbnNmb3JtID0gZGF0YS50cmFuc2Zvcm0gfHwgW107XG5cbiAgZm9yICh2YXIgZiBpbiB0aW1lRmllbGRzKSB7XG4gICAgdmFyIHRmID0gdGltZUZpZWxkc1tmXTtcbiAgICB0aW1lLnRyYW5zZm9ybSh0cmFuc2Zvcm0sIGVuY29kaW5nLCB0Zi5lbmNUeXBlLCB0Zi5maWVsZCk7XG4gIH1cblxuICAvLyBhZGQgc2NhbGVzXG4gIHZhciBzY2FsZXMgPSBzcGVjLnNjYWxlcyA9IHNwZWMuc2NhbGVzIHx8IFtdO1xuICBmb3IgKHZhciBmbiBpbiB0aW1lRm4pIHtcbiAgICB0aW1lLnNjYWxlKHNjYWxlcywgZm4sIGVuY29kaW5nKTtcbiAgfVxuICByZXR1cm4gc3BlYztcbn1cblxudGltZS5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdHlwZSkge1xuICB2YXIgZm4gPSBmaWVsZC5mbjtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOiByZXR1cm4gNjA7XG4gICAgY2FzZSAnbWludXRlcyc6IHJldHVybiA2MDtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiAyNDtcbiAgICBjYXNlICdkYXknOiByZXR1cm4gNztcbiAgICBjYXNlICdkYXRlJzogcmV0dXJuIDMxO1xuICAgIGNhc2UgJ21vbnRoJzogcmV0dXJuIDEyO1xuICAgIGNhc2UgJ3llYXInOlxuICAgICAgdmFyIHN0YXQgPSBzdGF0c1tmaWVsZC5uYW1lXSxcbiAgICAgICAgeWVhcnN0YXQgPSBzdGF0c1sneWVhcl8nK2ZpZWxkLm5hbWVdO1xuXG4gICAgICBpZiAoIXllYXJzdGF0KSB7IHJldHVybiBudWxsOyB9XG5cbiAgICAgIHJldHVybiB5ZWFyc3RhdC5jYXJkaW5hbGl0eSAtXG4gICAgICAgIChzdGF0Lm51bU51bGxzID4gMCAmJiBmaWx0ZXJOdWxsW3R5cGVdID8gMSA6IDApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5mdW5jdGlvbiBmaWVsZEZuKGZ1bmMsIGZpZWxkKSB7XG4gIHJldHVybiAndXRjJyArIGZ1bmMgKyAnKGQuZGF0YS4nKyBmaWVsZC5uYW1lICsnKSc7XG59XG5cbi8qKlxuICogQHJldHVybiB7U3RyaW5nfSBkYXRlIGJpbm5pbmcgZm9ybXVsYSBvZiB0aGUgZ2l2ZW4gZmllbGRcbiAqL1xudGltZS5mb3JtdWxhID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkRm4oZmllbGQuZm4sIGZpZWxkKTtcbn07XG5cbi8qKiBhZGQgZm9ybXVsYSB0cmFuc2Zvcm1zIHRvIGRhdGEgKi9cbnRpbWUudHJhbnNmb3JtID0gZnVuY3Rpb24odHJhbnNmb3JtLCBlbmNvZGluZywgZW5jVHlwZSwgZmllbGQpIHtcbiAgdHJhbnNmb3JtLnB1c2goe1xuICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICBmaWVsZDogZW5jb2RpbmcuZmllbGQoZW5jVHlwZSksXG4gICAgZXhwcjogdGltZS5mb3JtdWxhKGZpZWxkKVxuICB9KTtcbn07XG5cbi8qKiBhcHBlbmQgY3VzdG9tIHRpbWUgc2NhbGVzIGZvciBheGlzIGxhYmVsICovXG50aW1lLnNjYWxlID0gZnVuY3Rpb24oc2NhbGVzLCBmbiwgZW5jb2RpbmcpIHtcbiAgdmFyIGxhYmVsTGVuZ3RoID0gZW5jb2RpbmcuY29uZmlnKCd0aW1lU2NhbGVMYWJlbExlbmd0aCcpO1xuICAvLyBUT0RPIGFkZCBvcHRpb24gZm9yIHNob3J0ZXIgc2NhbGUgLyBjdXN0b20gcmFuZ2VcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ2RheSc6XG4gICAgICBzY2FsZXMucHVzaCh7XG4gICAgICAgIG5hbWU6ICd0aW1lLScrZm4sXG4gICAgICAgIHR5cGU6ICdvcmRpbmFsJyxcbiAgICAgICAgZG9tYWluOiB1dGlsLnJhbmdlKDAsIDcpLFxuICAgICAgICByYW5nZTogWydNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5JywgJ1N1bmRheSddLm1hcChcbiAgICAgICAgICBmdW5jdGlvbihzKSB7IHJldHVybiBzLnN1YnN0cigwLCBsYWJlbExlbmd0aCk7fVxuICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHNjYWxlcy5wdXNoKHtcbiAgICAgICAgbmFtZTogJ3RpbWUtJytmbixcbiAgICAgICAgdHlwZTogJ29yZGluYWwnLFxuICAgICAgICBkb21haW46IHV0aWwucmFuZ2UoMCwgMTIpLFxuICAgICAgICByYW5nZTogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJywgJ0p1bHknLCAnQXVndXN0JywgJ1NlcHRlbWJlcicsICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ10ubWFwKFxuICAgICAgICAgICAgZnVuY3Rpb24ocykgeyByZXR1cm4gcy5zdWJzdHIoMCwgbGFiZWxMZW5ndGgpO31cbiAgICAgICAgICApXG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG50aW1lLmlzT3JkaW5hbEZuID0gZnVuY3Rpb24oZm4pIHtcbiAgc3dpdGNoIChmbikge1xuICAgIGNhc2UgJ3NlY29uZHMnOlxuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2RhdGUnOlxuICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnRpbWUuc2NhbGUudHlwZSA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIGlmIChuYW1lID09PSBDT0xPUikge1xuICAgIHJldHVybiAnbGluZWFyJzsgLy8gdGhpcyBoYXMgb3JkZXJcbiAgfVxuXG4gIHJldHVybiB0aW1lLmlzT3JkaW5hbEZuKGZuKSB8fCBuYW1lID09PSBDT0wgfHwgbmFtZSA9PT0gUk9XID8gJ29yZGluYWwnIDogJ2xpbmVhcic7XG59O1xuXG50aW1lLnNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKGZuLCBuYW1lKSB7XG4gIHZhciBpc0NvbG9yID0gbmFtZSA9PT0gQ09MT1I7XG4gIHN3aXRjaCAoZm4pIHtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdtaW51dGVzJzogcmV0dXJuIGlzQ29sb3IgPyBbMCw1OV0gOiB1dGlsLnJhbmdlKDAsIDYwKTtcbiAgICBjYXNlICdob3Vycyc6IHJldHVybiBpc0NvbG9yID8gWzAsMjNdIDogdXRpbC5yYW5nZSgwLCAyNCk7XG4gICAgY2FzZSAnZGF5JzogcmV0dXJuIGlzQ29sb3IgPyBbMCw2XSA6IHV0aWwucmFuZ2UoMCwgNyk7XG4gICAgY2FzZSAnZGF0ZSc6IHJldHVybiBpc0NvbG9yID8gWzEsMzFdIDogdXRpbC5yYW5nZSgxLCAzMik7XG4gICAgY2FzZSAnbW9udGgnOiByZXR1cm4gaXNDb2xvciA/IFswLDExXSA6IHV0aWwucmFuZ2UoMCwgMTIpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuLyoqIHdoZXRoZXIgYSBwYXJ0aWN1bGFyIHRpbWUgZnVuY3Rpb24gaGFzIGN1c3RvbSBzY2FsZSBmb3IgbGFiZWxzIGltcGxlbWVudGVkIGluIHRpbWUuc2NhbGUgKi9cbnRpbWUuaGFzU2NhbGUgPSBmdW5jdGlvbihmbikge1xuICBzd2l0Y2ggKGZuKSB7XG4gICAgY2FzZSAnZGF5JzpcbiAgICBjYXNlICdtb250aCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdsb2JhbHMgPSByZXF1aXJlKCcuL2dsb2JhbHMnKTtcblxudmFyIGNvbnN0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbmNvbnN0cy5lbmNvZGluZ1R5cGVzID0gW1gsIFksIFJPVywgQ09MLCBTSVpFLCBTSEFQRSwgQ09MT1IsIEFMUEhBLCBURVhULCBERVRBSUxdO1xuXG5jb25zdHMuZGF0YVR5cGVzID0geydPJzogTywgJ1EnOiBRLCAnVCc6IFR9O1xuXG5jb25zdHMuZGF0YVR5cGVOYW1lcyA9IFsnTycsICdRJywgJ1QnXS5yZWR1Y2UoZnVuY3Rpb24ociwgeCkge1xuICByW2NvbnN0cy5kYXRhVHlwZXNbeF1dID0geDtcbiAgcmV0dXJuIHI7XG59LHt9KTtcblxuY29uc3RzLnNob3J0aGFuZCA9IHtcbiAgZGVsaW06ICAnfCcsXG4gIGFzc2lnbjogJz0nLFxuICB0eXBlOiAgICcsJyxcbiAgZnVuYzogICAnXydcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFRPRE86IHJlbmFtZSBnZXREYXRhVXJsIHRvIHZsLmRhdGEuZ2V0VXJsKCkgP1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgdmxkYXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7fSxcbiAgdmxmaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKTtcblxudmxkYXRhLmdldFVybCA9IGZ1bmN0aW9uIGdldERhdGFVcmwoZW5jb2RpbmcsIHN0YXRzKSB7XG4gIGlmICghZW5jb2RpbmcuY29uZmlnKCd1c2VWZWdhU2VydmVyJykpIHtcbiAgICAvLyBkb24ndCB1c2UgdmVnYSBzZXJ2ZXJcbiAgICByZXR1cm4gZW5jb2RpbmcuY29uZmlnKCdkYXRhVXJsJyk7XG4gIH1cblxuICBpZiAoZW5jb2RpbmcubGVuZ3RoKCkgPT09IDApIHtcbiAgICAvLyBubyBmaWVsZHNcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZmllbGRzID0gW107XG4gIGVuY29kaW5nLmZvckVhY2goZnVuY3Rpb24oZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgbmFtZTogZW5jb2RpbmcuZmllbGQoZW5jVHlwZSwgdHJ1ZSksXG4gICAgICBmaWVsZDogZmllbGQubmFtZVxuICAgIH07XG4gICAgaWYgKGZpZWxkLmFnZ3IpIHtcbiAgICAgIG9iai5hZ2dyID0gZmllbGQuYWdncjtcbiAgICB9XG4gICAgaWYgKGZpZWxkLmJpbikge1xuICAgICAgb2JqLmJpblNpemUgPSB1dGlsLmdldGJpbnMoc3RhdHNbZmllbGQubmFtZV0sIGVuY29kaW5nLmJpbihlbmNUeXBlKS5tYXhiaW5zKS5zdGVwO1xuICAgIH1cbiAgICBmaWVsZHMucHVzaChvYmopO1xuICB9KTtcblxuICB2YXIgcXVlcnkgPSB7XG4gICAgdGFibGU6IGVuY29kaW5nLmNvbmZpZygndmVnYVNlcnZlclRhYmxlJyksXG4gICAgZmllbGRzOiBmaWVsZHNcbiAgfTtcblxuICByZXR1cm4gZW5jb2RpbmcuY29uZmlnKCd2ZWdhU2VydmVyVXJsJykgKyAnL3F1ZXJ5Lz9xPScgKyBKU09OLnN0cmluZ2lmeShxdWVyeSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBkYXRhIGluIEpTT04vamF2YXNjcmlwdCBvYmplY3QgZm9ybWF0XG4gKiBAcmV0dXJuIEFycmF5IG9mIHtuYW1lOiBfX25hbWVfXywgdHlwZTogXCJudW1iZXJ8dGV4dHx0aW1lfGxvY2F0aW9uXCJ9XG4gKi9cbnZsZGF0YS5nZXRTY2hlbWEgPSBmdW5jdGlvbihkYXRhLCBvcmRlcikge1xuICB2YXIgc2NoZW1hID0gW10sXG4gICAgZmllbGRzID0gdXRpbC5rZXlzKGRhdGFbMF0pO1xuXG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAvLyBmaW5kIG5vbi1udWxsIGRhdGFcbiAgICB2YXIgaSA9IDAsIGRhdHVtID0gZGF0YVtpXVtrXTtcbiAgICB3aGlsZSAoZGF0dW0gPT09ICcnIHx8IGRhdHVtID09PSBudWxsIHx8IGRhdHVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGRhdHVtID0gZGF0YVsrK2ldW2tdO1xuICAgIH1cblxuICAgIGRhdHVtID0gdXRpbC5wYXJzZShkYXR1bSk7XG4gICAgdmFyIHR5cGUgPSAodHlwZW9mIGRhdHVtID09PSAnbnVtYmVyJykgPyAnUSc6XG4gICAgICAoZGF0dW0gaW5zdGFuY2VvZiBEYXRlKSA/ICdUJyA6ICdPJztcblxuICAgIHNjaGVtYS5wdXNoKHtuYW1lOiBrLCB0eXBlOiB0eXBlfSk7XG4gIH0pO1xuXG4gIHNjaGVtYSA9IHV0aWwuc3RhYmxlc29ydChzY2hlbWEsIG9yZGVyIHx8IHZsZmllbGQub3JkZXIudHlwZVRoZW5OYW1lLCB2bGZpZWxkLm9yZGVyLm5hbWUpO1xuXG4gIHJldHVybiBzY2hlbWE7XG59O1xuXG52bGRhdGEuZ2V0U3RhdHMgPSBmdW5jdGlvbihkYXRhKSB7IC8vIGhhY2tcbiAgdmFyIHN0YXRzID0ge30sXG4gICAgZmllbGRzID0gdXRpbC5rZXlzKGRhdGFbMF0pO1xuXG4gIGZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgY29sdW1uID0gZGF0YS5tYXAoZnVuY3Rpb24oZCkge3JldHVybiBkW2tdO30pO1xuXG4gICAgLy8gSGFja1xuICAgIHZhciB2YWwgPSB1dGlsLnBhcnNlKGRhdGFbMF1ba10pO1xuICAgIHZhciB0eXBlID0gKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSA/ICdRJzpcbiAgICAgICh2YWwgaW5zdGFuY2VvZiBEYXRlKSA/ICdUJyA6ICdPJztcblxuICAgIHZhciBzdGF0ID0ge307XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgICBzdGF0ID0gdXRpbC5taW5tYXgodXRpbC5udW1iZXJzKGNvbHVtbikpO1xuICAgIH0gZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgc3RhdCA9IHV0aWwubWlubWF4KHV0aWwuZGF0ZXMoY29sdW1uKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXQgPSB1dGlsLm1pbm1heChjb2x1bW4pO1xuICAgIH1cblxuICAgIHN0YXQuY2FyZGluYWxpdHkgPSB1dGlsLnVuaXEoZGF0YSwgayk7XG4gICAgc3RhdC5jb3VudCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgc3RhdC5tYXhsZW5ndGggPSBkYXRhLnJlZHVjZShmdW5jdGlvbihtYXgscm93KSB7XG4gICAgICBpZiAocm93W2tdID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgICB9XG4gICAgICB2YXIgbGVuID0gcm93W2tdLnRvU3RyaW5nKCkubGVuZ3RoO1xuICAgICAgcmV0dXJuIGxlbiA+IG1heCA/IGxlbiA6IG1heDtcbiAgICB9LCAwKTtcblxuICAgIHN0YXQubnVtTnVsbHMgPSBkYXRhLnJlZHVjZShmdW5jdGlvbihjb3VudCwgcm93KSB7XG4gICAgICByZXR1cm4gcm93W2tdID09PSBudWxsID8gY291bnQgKyAxIDogY291bnQ7XG4gICAgfSwgMCk7XG5cbiAgICB2YXIgbnVtYmVycyA9IHV0aWwubnVtYmVycyhjb2x1bW4pO1xuXG4gICAgaWYgKG51bWJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgc3RhdC5za2V3ID0gdXRpbC5za2V3KG51bWJlcnMpO1xuICAgICAgc3RhdC5zdGRldiA9IHV0aWwuc3RkZXYobnVtYmVycyk7XG4gICAgICBzdGF0Lm1lYW4gPSB1dGlsLm1lYW4obnVtYmVycyk7XG4gICAgICBzdGF0Lm1lZGlhbiA9IHV0aWwubWVkaWFuKG51bWJlcnMpO1xuICAgIH1cblxuICAgIHZhciBzYW1wbGUgPSB7fTtcbiAgICB3aGlsZShPYmplY3Qua2V5cyhzYW1wbGUpLmxlbmd0aCA8IE1hdGgubWluKHN0YXQuY2FyZGluYWxpdHksIDEwKSkge1xuICAgICAgdmFyIHZhbHVlID0gZGF0YVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkYXRhLmxlbmd0aCldW2tdO1xuICAgICAgc2FtcGxlW3ZhbHVlXSA9IHRydWU7XG4gICAgfVxuICAgIHN0YXQuc2FtcGxlID0gT2JqZWN0LmtleXMoc2FtcGxlKTtcblxuICAgIHN0YXRzW2tdID0gc3RhdDtcbiAgfSk7XG4gIHN0YXRzLmNvdW50ID0gZGF0YS5sZW5ndGg7XG4gIHJldHVybiBzdGF0cztcbn07XG4iLCIvLyB1dGlsaXR5IGZvciBlbmNcblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29uc3RzID0gcmVxdWlyZSgnLi9jb25zdHMnKSxcbiAgYyA9IGNvbnN0cy5zaG9ydGhhbmQsXG4gIHRpbWUgPSByZXF1aXJlKCcuL2NvbXBpbGUvdGltZScpLFxuICB2bGZpZWxkID0gcmVxdWlyZSgnLi9maWVsZCcpLFxuICB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyksXG4gIHNjaGVtYSA9IHJlcXVpcmUoJy4vc2NoZW1hL3NjaGVtYScpLFxuICBlbmNUeXBlcyA9IHNjaGVtYS5lbmNUeXBlcztcblxudmFyIHZsZW5jID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxlbmMuY291bnRSZXRpbmFsID0gZnVuY3Rpb24oZW5jKSB7XG4gIHZhciBjb3VudCA9IDA7XG4gIGlmIChlbmMuY29sb3IpIGNvdW50Kys7XG4gIGlmIChlbmMuYWxwaGEpIGNvdW50Kys7XG4gIGlmIChlbmMuc2l6ZSkgY291bnQrKztcbiAgaWYgKGVuYy5zaGFwZSkgY291bnQrKztcbiAgcmV0dXJuIGNvdW50O1xufTtcblxudmxlbmMuaGFzID0gZnVuY3Rpb24oZW5jLCBlbmNUeXBlKSB7XG4gIHZhciBmaWVsZERlZiA9IGVuYyAmJiBlbmNbZW5jVHlwZV07XG4gIHJldHVybiBmaWVsZERlZiAmJiBmaWVsZERlZi5uYW1lO1xufTtcblxudmxlbmMuaXNBZ2dyZWdhdGUgPSBmdW5jdGlvbihlbmMpIHtcbiAgZm9yICh2YXIgayBpbiBlbmMpIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykgJiYgZW5jW2tdLmFnZ3IpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG52bGVuYy5mb3JFYWNoID0gZnVuY3Rpb24oZW5jLCBmKSB7XG4gIHZhciBpID0gMDtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICBmKGVuY1trXSwgaywgaSsrKTtcbiAgICB9XG4gIH0pO1xufTtcblxudmxlbmMubWFwID0gZnVuY3Rpb24oZW5jLCBmKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgZW5jVHlwZXMuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgaWYgKHZsZW5jLmhhcyhlbmMsIGspKSB7XG4gICAgICBhcnIucHVzaChmKGVuY1trXSwgaywgZW5jKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFycjtcbn07XG5cbnZsZW5jLnJlZHVjZSA9IGZ1bmN0aW9uKGVuYywgZiwgaW5pdCkge1xuICB2YXIgciA9IGluaXQsIGkgPSAwLCBrO1xuICBlbmNUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICBpZiAodmxlbmMuaGFzKGVuYywgaykpIHtcbiAgICAgIHIgPSBmKHIsIGVuY1trXSwgaywgIGVuYyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHI7XG59O1xuXG4vKlxuICogcmV0dXJuIGtleS12YWx1ZSBwYWlycyBvZiBmaWVsZCBuYW1lIGFuZCBsaXN0IG9mIGZpZWxkcyBvZiB0aGF0IGZpZWxkIG5hbWVcbiAqL1xudmxlbmMuZmllbGRzID0gZnVuY3Rpb24oZW5jKSB7XG4gIHJldHVybiB2bGVuYy5yZWR1Y2UoZW5jLCBmdW5jdGlvbiAobSwgZmllbGQsIGVuY1R5cGUpIHtcbiAgICB2YXIgZmllbGRMaXN0ID0gbVtmaWVsZC5uYW1lXSA9IG1bZmllbGQubmFtZV0gfHwgW10sXG4gICAgICBjb250YWluc1R5cGUgPSBmaWVsZExpc3QuY29udGFpbnNUeXBlID0gZmllbGRMaXN0LmNvbnRhaW5zVHlwZSB8fCB7fTtcblxuICAgIGlmIChmaWVsZExpc3QuaW5kZXhPZihmaWVsZCkgPT09IC0xKSB7XG4gICAgICBmaWVsZExpc3QucHVzaChmaWVsZCk7XG4gICAgICAvLyBhdWdtZW50IHRoZSBhcnJheSB3aXRoIGNvbnRhaW5zVHlwZS5RIC8gTyAvIFRcbiAgICAgIGNvbnRhaW5zVHlwZVtmaWVsZC50eXBlXSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9LCB7fSk7XG59O1xuXG52bGVuYy5zaG9ydGhhbmQgPSBmdW5jdGlvbihlbmMpIHtcbiAgcmV0dXJuIHZsZW5jLm1hcChlbmMsIGZ1bmN0aW9uKGZpZWxkLCBldCkge1xuICAgIHJldHVybiBldCArIGMuYXNzaWduICsgdmxmaWVsZC5zaG9ydGhhbmQoZmllbGQpO1xuICB9KS5qb2luKGMuZGVsaW0pO1xufTtcblxudmxlbmMucGFyc2VTaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGNvbnZlcnRUeXBlKSB7XG4gIHZhciBlbmMgPSB1dGlsLmlzQXJyYXkoc2hvcnRoYW5kKSA/IHNob3J0aGFuZCA6IHNob3J0aGFuZC5zcGxpdChjLmRlbGltKTtcbiAgcmV0dXJuIGVuYy5yZWR1Y2UoZnVuY3Rpb24obSwgZSkge1xuICAgIHZhciBzcGxpdCA9IGUuc3BsaXQoYy5hc3NpZ24pLFxuICAgICAgICBlbmN0eXBlID0gc3BsaXRbMF0udHJpbSgpLFxuICAgICAgICBmaWVsZCA9IHNwbGl0WzFdO1xuXG4gICAgbVtlbmN0eXBlXSA9IHZsZmllbGQucGFyc2VTaG9ydGhhbmQoZmllbGQsIGNvbnZlcnRUeXBlKTtcbiAgICByZXR1cm4gbTtcbiAgfSwge30pO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIHV0aWxpdHkgZm9yIGZpZWxkXG5cbnZhciBjb25zdHMgPSByZXF1aXJlKCcuL2NvbnN0cycpLFxuICBjID0gY29uc3RzLnNob3J0aGFuZCxcbiAgdGltZSA9IHJlcXVpcmUoJy4vY29tcGlsZS90aW1lJyksXG4gIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKSxcbiAgc2NoZW1hID0gcmVxdWlyZSgnLi9zY2hlbWEvc2NoZW1hJyk7XG5cbnZhciB2bGZpZWxkID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxudmxmaWVsZC5zaG9ydGhhbmQgPSBmdW5jdGlvbihmKSB7XG4gIHZhciBjID0gY29uc3RzLnNob3J0aGFuZDtcbiAgcmV0dXJuIChmLmFnZ3IgPyBmLmFnZ3IgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLmZuID8gZi5mbiArIGMuZnVuYyA6ICcnKSArXG4gICAgKGYuYmluID8gJ2JpbicgKyBjLmZ1bmMgOiAnJykgK1xuICAgIChmLm5hbWUgfHwgJycpICsgYy50eXBlICtcbiAgICAoY29uc3RzLmRhdGFUeXBlTmFtZXNbZi50eXBlXSB8fCBmLnR5cGUpO1xufTtcblxudmxmaWVsZC5zaG9ydGhhbmRzID0gZnVuY3Rpb24oZmllbGRzLCBkZWxpbSkge1xuICBkZWxpbSA9IGRlbGltIHx8IGMuZGVsaW07XG4gIHJldHVybiBmaWVsZHMubWFwKHZsZmllbGQuc2hvcnRoYW5kKS5qb2luKGRlbGltKTtcbn07XG5cbnZsZmllbGQucGFyc2VTaG9ydGhhbmQgPSBmdW5jdGlvbihzaG9ydGhhbmQsIGNvbnZlcnRUeXBlKSB7XG4gIHZhciBzcGxpdCA9IHNob3J0aGFuZC5zcGxpdChjLnR5cGUpLCBpO1xuICB2YXIgbyA9IHtcbiAgICBuYW1lOiBzcGxpdFswXS50cmltKCksXG4gICAgdHlwZTogY29udmVydFR5cGUgPyBjb25zdHMuZGF0YVR5cGVzW3NwbGl0WzFdLnRyaW0oKV0gOiBzcGxpdFsxXS50cmltKClcbiAgfTtcblxuICAvLyBjaGVjayBhZ2dyZWdhdGUgdHlwZVxuICBmb3IgKGkgaW4gc2NoZW1hLmFnZ3IuZW51bSkge1xuICAgIHZhciBhID0gc2NoZW1hLmFnZ3IuZW51bVtpXTtcbiAgICBpZiAoby5uYW1lLmluZGV4T2YoYSArICdfJykgPT09IDApIHtcbiAgICAgIG8ubmFtZSA9IG8ubmFtZS5zdWJzdHIoYS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChhID09ICdjb3VudCcgJiYgby5uYW1lLmxlbmd0aCA9PT0gMCkgby5uYW1lID0gJyonO1xuICAgICAgby5hZ2dyID0gYTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIHRpbWUgZm5cbiAgZm9yIChpIGluIHNjaGVtYS50aW1lZm5zKSB7XG4gICAgdmFyIGYgPSBzY2hlbWEudGltZWZuc1tpXTtcbiAgICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKGYgKyAnXycpID09PSAwKSB7XG4gICAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKG8ubGVuZ3RoICsgMSk7XG4gICAgICBvLmZuID0gZjtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNoZWNrIGJpblxuICBpZiAoby5uYW1lICYmIG8ubmFtZS5pbmRleE9mKCdiaW5fJykgPT09IDApIHtcbiAgICBvLm5hbWUgPSBvLm5hbWUuc3Vic3RyKDQpO1xuICAgIG8uYmluID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBvO1xufTtcblxudmFyIHR5cGVPcmRlciA9IHtcbiAgTzogMCxcbiAgRzogMSxcbiAgVDogMixcbiAgUTogM1xufTtcblxudmxmaWVsZC5vcmRlciA9IHt9O1xuXG52bGZpZWxkLm9yZGVyLnR5cGUgPSBmdW5jdGlvbihmaWVsZCkge1xuICBpZiAoZmllbGQuYWdncj09PSdjb3VudCcpIHJldHVybiA0O1xuICByZXR1cm4gdHlwZU9yZGVyW2ZpZWxkLnR5cGVdO1xufTtcblxudmxmaWVsZC5vcmRlci50eXBlVGhlbk5hbWUgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gdmxmaWVsZC5vcmRlci50eXBlKGZpZWxkKSArICdfJyArIGZpZWxkLm5hbWUudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZsZmllbGQub3JkZXIub3JpZ2luYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDA7IC8vIG5vIHN3YXAgd2lsbCBvY2N1clxufTtcblxudmxmaWVsZC5vcmRlci5uYW1lID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGZpZWxkLm5hbWU7XG59O1xuXG52bGZpZWxkLm9yZGVyLnR5cGVUaGVuQ2FyZGluYWxpdHkgPSBmdW5jdGlvbihmaWVsZCwgc3RhdHMpe1xuICByZXR1cm4gc3RhdHNbZmllbGQubmFtZV0uY2FyZGluYWxpdHk7XG59O1xuXG4vLyBGSVhNRSByZWZhY3RvclxudmxmaWVsZC5pc1R5cGUgPSBmdW5jdGlvbiAoZmllbGREZWYsIHR5cGUpIHtcbiAgcmV0dXJuIChmaWVsZERlZi50eXBlICYgdHlwZSkgPiAwO1xufTtcblxudmxmaWVsZC5pc1R5cGUuYnlDb2RlID0gdmxmaWVsZC5pc1R5cGU7XG5cbnZsZmllbGQuaXNUeXBlLmJ5TmFtZSA9IGZ1bmN0aW9uIChmaWVsZCwgdHlwZSkge1xuICByZXR1cm4gZmllbGQudHlwZSA9PT0gY29uc3RzLmRhdGFUeXBlTmFtZXNbdHlwZV07XG59O1xuXG5cbmZ1bmN0aW9uIGdldElzVHlwZSh1c2VUeXBlQ29kZSkge1xuICByZXR1cm4gdXNlVHlwZUNvZGUgPyB2bGZpZWxkLmlzVHlwZS5ieUNvZGUgOiB2bGZpZWxkLmlzVHlwZS5ieU5hbWU7XG59XG5cbnZsZmllbGQuaXNUeXBlLmdldCA9IGdldElzVHlwZTsgLy9GSVhNRVxuXG4vKlxuICogTW9zdCBmaWVsZHMgdGhhdCB1c2Ugb3JkaW5hbCBzY2FsZSBhcmUgZGltZW5zaW9ucy5cbiAqIEhvd2V2ZXIsIFlFQVIoVCksIFlFQVJNT05USChUKSB1c2UgdGltZSBzY2FsZSwgbm90IG9yZGluYWwgYnV0IGFyZSBkaW1lbnNpb25zIHRvby5cbiAqL1xudmxmaWVsZC5pc09yZGluYWxTY2FsZSA9IGZ1bmN0aW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCBmaWVsZC5iaW4gfHxcbiAgICAoIGlzVHlwZShmaWVsZCwgVCkgJiYgZmllbGQuZm4gJiYgdGltZS5pc09yZGluYWxGbihmaWVsZC5mbikgKTtcbn07XG5cbmZ1bmN0aW9uIGlzRGltZW5zaW9uKGZpZWxkLCB1c2VUeXBlQ29kZSAvKm9wdGlvbmFsKi8pIHtcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSk7XG4gIHJldHVybiAgaXNUeXBlKGZpZWxkLCBPKSB8fCAhIWZpZWxkLmJpbiB8fFxuICAgICggaXNUeXBlKGZpZWxkLCBUKSAmJiAhIWZpZWxkLmZuICk7XG59XG5cbi8qKlxuICogRm9yIGVuY29kaW5nLCB1c2UgZW5jb2RpbmcuaXNEaW1lbnNpb24oKSB0byBhdm9pZCBjb25mdXNpb24uXG4gKiBPciB1c2UgRW5jb2RpbmcuaXNUeXBlIGlmIHlvdXIgZmllbGQgaXMgZnJvbSBFbmNvZGluZyAoYW5kIHRodXMgaGF2ZSBudW1lcmljIGRhdGEgdHlwZSkuXG4gKiBvdGhlcndpc2UsIGRvIG5vdCBzcGVjaWZpYyBpc1R5cGUgc28gd2UgY2FuIHVzZSB0aGUgZGVmYXVsdCBpc1R5cGVOYW1lIGhlcmUuXG4gKi9cbnZsZmllbGQuaXNEaW1lbnNpb24gPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUgLypvcHRpb25hbCovKSB7XG4gIHJldHVybiBmaWVsZCAmJiBpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5pc01lYXN1cmUgPSBmdW5jdGlvbihmaWVsZCwgdXNlVHlwZUNvZGUpIHtcbiAgcmV0dXJuIGZpZWxkICYmICFpc0RpbWVuc2lvbihmaWVsZCwgdXNlVHlwZUNvZGUpO1xufTtcblxudmxmaWVsZC5yb2xlID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIGlzRGltZW5zaW9uKGZpZWxkKSA/ICdkaW1lbnNpb24nIDogJ21lYXN1cmUnO1xufTtcblxudmxmaWVsZC5jb3VudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge25hbWU6JyonLCBhZ2dyOiAnY291bnQnLCB0eXBlOidRJywgZGlzcGxheU5hbWU6IHZsZmllbGQuY291bnQuZGlzcGxheU5hbWV9O1xufTtcblxudmxmaWVsZC5jb3VudC5kaXNwbGF5TmFtZSA9ICdOdW1iZXIgb2YgUmVjb3Jkcyc7XG5cbnZsZmllbGQuaXNDb3VudCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiBmaWVsZC5hZ2dyID09PSAnY291bnQnO1xufTtcblxuLyoqXG4gKiBGb3IgZW5jb2RpbmcsIHVzZSBlbmNvZGluZy5jYXJkaW5hbGl0eSgpIHRvIGF2b2lkIGNvbmZ1c2lvbi4gIE9yIHVzZSBFbmNvZGluZy5pc1R5cGUgaWYgeW91ciBmaWVsZCBpcyBmcm9tIEVuY29kaW5nIChhbmQgdGh1cyBoYXZlIG51bWVyaWMgZGF0YSB0eXBlKS5cbiAqIG90aGVyd2lzZSwgZG8gbm90IHNwZWNpZmljIGlzVHlwZSBzbyB3ZSBjYW4gdXNlIHRoZSBkZWZhdWx0IGlzVHlwZU5hbWUgaGVyZS5cbiAqL1xudmxmaWVsZC5jYXJkaW5hbGl0eSA9IGZ1bmN0aW9uKGZpZWxkLCBzdGF0cywgZmlsdGVyTnVsbCwgdXNlVHlwZUNvZGUpIHtcbiAgLy8gRklYTUUgbmVlZCB0byB0YWtlIGZpbHRlciBpbnRvIGFjY291bnRcbiAgdmFyIGlzVHlwZSA9IGdldElzVHlwZSh1c2VUeXBlQ29kZSksXG4gICAgdHlwZSA9IHVzZVR5cGVDb2RlID8gY29uc3RzLmRhdGFUeXBlTmFtZXNbZmllbGQudHlwZV0gOiBmaWVsZC50eXBlO1xuXG4gIGZpbHRlck51bGwgPSBmaWx0ZXJOdWxsIHx8IHt9O1xuXG4gIGlmIChmaWVsZC5iaW4pIHtcbiAgICB2YXIgYmlucyA9IHV0aWwuZ2V0YmlucyhzdGF0c1tmaWVsZC5uYW1lXSwgZmllbGQuYmluLm1heGJpbnMgfHwgc2NoZW1hLk1BWEJJTlNfREVGQVVMVCk7XG4gICAgcmV0dXJuIChiaW5zLnN0b3AgLSBiaW5zLnN0YXJ0KSAvIGJpbnMuc3RlcDtcbiAgfVxuICBpZiAoaXNUeXBlKGZpZWxkLCBUKSkge1xuICAgIHZhciBjYXJkaW5hbGl0eSA9IHRpbWUuY2FyZGluYWxpdHkoZmllbGQsIHN0YXRzLCBmaWx0ZXJOdWxsLCB0eXBlKTtcbiAgICBpZihjYXJkaW5hbGl0eSAhPT0gbnVsbCkgcmV0dXJuIGNhcmRpbmFsaXR5O1xuICAgIC8vb3RoZXJ3aXNlIHVzZSBjYWxjdWxhdGlvbiBiZWxvd1xuICB9XG4gIGlmIChmaWVsZC5hZ2dyKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyByZW1vdmUgbnVsbFxuICB2YXIgc3RhdCA9IHN0YXRzW2ZpZWxkLm5hbWVdO1xuICByZXR1cm4gc3RhdC5jYXJkaW5hbGl0eSAtXG4gICAgKHN0YXQubnVtTnVsbHMgPiAwICYmIGZpbHRlck51bGxbdHlwZV0gPyAxIDogMCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBkZWNsYXJlIGdsb2JhbCBjb25zdGFudFxudmFyIGcgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5nLlRBQkxFID0gJ3RhYmxlJztcbmcuUkFXID0gJ3Jhdyc7XG5nLlNUQUNLRUQgPSAnc3RhY2tlZCc7XG5nLklOREVYID0gJ2luZGV4JztcblxuZy5YID0gJ3gnO1xuZy5ZID0gJ3knO1xuZy5ST1cgPSAncm93JztcbmcuQ09MID0gJ2NvbCc7XG5nLlNJWkUgPSAnc2l6ZSc7XG5nLlNIQVBFID0gJ3NoYXBlJztcbmcuQ09MT1IgPSAnY29sb3InO1xuZy5BTFBIQSA9ICdhbHBoYSc7XG5nLlRFWFQgPSAndGV4dCc7XG5nLkRFVEFJTCA9ICdkZXRhaWwnO1xuXG5nLk8gPSAxO1xuZy5RID0gMjtcbmcuVCA9IDQ7XG4iLCIvLyBQYWNrYWdlIG9mIGRlZmluaW5nIFZlZ2FsaXRlIFNwZWNpZmljYXRpb24ncyBqc29uIHNjaGVtYVxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzY2hlbWEgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5zY2hlbWEudXRpbCA9IHJlcXVpcmUoJy4vc2NoZW1hdXRpbCcpO1xuXG5zY2hlbWEubWFya3R5cGUgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ3BvaW50JywgJ3RpY2snLCAnYmFyJywgJ2xpbmUnLCAnYXJlYScsICdjaXJjbGUnLCAnc3F1YXJlJywgJ3RleHQnXVxufTtcblxuc2NoZW1hLmFnZ3IgPSB7XG4gIHR5cGU6ICdzdHJpbmcnLFxuICBlbnVtOiBbJ2F2ZycsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddLFxuICBzdXBwb3J0ZWRFbnVtczoge1xuICAgIFE6IFsnYXZnJywgJ3N1bScsICdtaW4nLCAnbWF4JywgJ2NvdW50J10sXG4gICAgTzogW10sXG4gICAgVDogWydhdmcnLCAnbWluJywgJ21heCddLFxuICAgICcnOiBbJ2NvdW50J11cbiAgfSxcbiAgc3VwcG9ydGVkVHlwZXM6IHsnUSc6IHRydWUsICdPJzogdHJ1ZSwgJ1QnOiB0cnVlLCAnJzogdHJ1ZX1cbn07XG5zY2hlbWEuYmFuZCA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzaXplOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBwYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBtaW5pbXVtOiAwLFxuICAgICAgZGVmYXVsdDogMVxuICAgIH1cbiAgfVxufTtcblxuc2NoZW1hLmdldFN1cHBvcnRlZFJvbGUgPSBmdW5jdGlvbihlbmNUeXBlKSB7XG4gIHJldHVybiBzY2hlbWEuc2NoZW1hLnByb3BlcnRpZXMuZW5jLnByb3BlcnRpZXNbZW5jVHlwZV0uc3VwcG9ydGVkUm9sZTtcbn07XG5cbnNjaGVtYS50aW1lZm5zID0gWyd5ZWFyJywgJ21vbnRoJywgJ2RheScsICdkYXRlJywgJ2hvdXJzJywgJ21pbnV0ZXMnLCAnc2Vjb25kcyddO1xuXG5zY2hlbWEuZGVmYXVsdFRpbWVGbiA9ICdtb250aCc7XG5cbnNjaGVtYS5mbiA9IHtcbiAgdHlwZTogJ3N0cmluZycsXG4gIGVudW06IHNjaGVtYS50aW1lZm5zLFxuICBzdXBwb3J0ZWRUeXBlczogeydUJzogdHJ1ZX1cbn07XG5cbi8vVE9ETyhrYW5pdHcpOiBhZGQgb3RoZXIgdHlwZSBvZiBmdW5jdGlvbiBoZXJlXG5cbnNjaGVtYS5zY2FsZV90eXBlID0ge1xuICB0eXBlOiAnc3RyaW5nJyxcbiAgZW51bTogWydsaW5lYXInLCAnbG9nJywgJ3BvdycsICdzcXJ0JywgJ3F1YW50aWxlJ10sXG4gIGRlZmF1bHQ6ICdsaW5lYXInLFxuICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZX1cbn07XG5cbnNjaGVtYS5maWVsZCA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBuYW1lOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIH1cbiAgfVxufTtcblxudmFyIGNsb25lID0gdXRpbC5kdXBsaWNhdGU7XG52YXIgbWVyZ2UgPSBzY2hlbWEudXRpbC5tZXJnZTtcblxuc2NoZW1hLk1BWEJJTlNfREVGQVVMVCA9IDE1O1xuXG52YXIgYmluID0ge1xuICB0eXBlOiBbJ2Jvb2xlYW4nLCAnb2JqZWN0J10sXG4gIGRlZmF1bHQ6IGZhbHNlLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbWF4Ymluczoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogc2NoZW1hLk1BWEJJTlNfREVGQVVMVCxcbiAgICAgIG1pbmltdW06IDJcbiAgICB9XG4gIH0sXG4gIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlfSAvLyBUT0RPOiBhZGQgJ08nIGFmdGVyIGZpbmlzaGluZyAjODFcbn07XG5cbnZhciB0eXBpY2FsRmllbGQgPSBtZXJnZShjbG9uZShzY2hlbWEuZmllbGQpLCB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdHlwZToge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBlbnVtOiBbJ08nLCAnUScsICdUJ11cbiAgICB9LFxuICAgIGFnZ3I6IHNjaGVtYS5hZ2dyLFxuICAgIGZuOiBzY2hlbWEuZm4sXG4gICAgYmluOiBiaW4sXG4gICAgc2NhbGU6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICB0eXBlOiBzY2hlbWEuc2NhbGVfdHlwZSxcbiAgICAgICAgcmV2ZXJzZToge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICBzdXBwb3J0ZWRUeXBlczogeydRJzogdHJ1ZSwgJ1QnOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgICB6ZXJvOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnSW5jbHVkZSB6ZXJvJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgIHN1cHBvcnRlZFR5cGVzOiB7J1EnOiB0cnVlLCAnVCc6IHRydWV9XG4gICAgICAgIH0sXG4gICAgICAgIG5pY2U6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ3NlY29uZCcsICdtaW51dGUnLCAnaG91cicsICdkYXknLCAnd2VlaycsICdtb250aCcsICd5ZWFyJ10sXG4gICAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnVCc6IHRydWV9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgb25seU9yZGluYWxGaWVsZCA9IG1lcmdlKGNsb25lKHNjaGVtYS5maWVsZCksIHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBkaW1lbnNpb246IHRydWVcbiAgfSxcbiAgcHJvcGVydGllczoge1xuICAgIHR5cGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydPJywnUScsICdUJ10gLy8gb3JkaW5hbC1vbmx5IGZpZWxkIHN1cHBvcnRzIFEgd2hlbiBiaW4gaXMgYXBwbGllZCBhbmQgVCB3aGVuIGZuIGlzIGFwcGxpZWQuXG4gICAgfSxcbiAgICBmbjogc2NoZW1hLmZuLFxuICAgIGJpbjogYmluLFxuICAgIGFnZ3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZW51bTogWydjb3VudCddLFxuICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnTyc6IHRydWV9XG4gICAgfVxuICB9XG59KTtcblxudmFyIGF4aXNNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIGF4aXM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBncmlkOiB7XG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdBIGZsYWcgaW5kaWNhdGUgaWYgZ3JpZGxpbmVzIHNob3VsZCBiZSBjcmVhdGVkIGluIGFkZGl0aW9uIHRvIHRpY2tzLidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgdGl0bGUgZm9yIHRoZSBheGlzLidcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGVPZmZzZXQ6IHtcbiAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnQSB0aXRsZSBvZmZzZXQgdmFsdWUgZm9yIHRoZSBheGlzLidcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIGZvcm1hdHRpbmcgcGF0dGVybiBmb3IgYXhpcyBsYWJlbHMuJ1xuICAgICAgICB9LFxuICAgICAgICBtYXhMYWJlbExlbmd0aDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAyNSxcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIHNvcnRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBzb3J0OiB7XG4gICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgZGVmYXVsdDogW10sXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgc3VwcG9ydGVkVHlwZXM6IHsnTyc6IHRydWV9LFxuICAgICAgICByZXF1aXJlZDogWyduYW1lJywgJ2FnZ3InXSxcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGFnZ3I6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBlbnVtOiBbJ2F2ZycsICdzdW0nLCAnbWluJywgJ21heCcsICdjb3VudCddXG4gICAgICAgIH0sXG4gICAgICAgIHJldmVyc2U6IHtcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGJhbmRNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICBiYW5kOiBzY2hlbWEuYmFuZFxuICB9XG59O1xuXG52YXIgbGVnZW5kTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgbGVnZW5kOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfVxuICB9XG59O1xuXG52YXIgdGV4dE1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7J3RleHQnOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHRleHQ6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBhbGlnbjoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdsZWZ0J1xuICAgICAgICB9LFxuICAgICAgICBiYXNlbGluZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdtaWRkbGUnXG4gICAgICAgIH0sXG4gICAgICAgIG1hcmdpbjoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiA0LFxuICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZm9udDoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHdlaWdodDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2JvbGQnXSxcbiAgICAgICAgICBkZWZhdWx0OiAnbm9ybWFsJ1xuICAgICAgICB9LFxuICAgICAgICBzaXplOiB7XG4gICAgICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgIG1pbmltdW06IDBcbiAgICAgICAgfSxcbiAgICAgICAgZmFtaWx5OiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVmYXVsdDogJ0hlbHZldGljYSBOZXVlJ1xuICAgICAgICB9LFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlZmF1bHQ6ICdub3JtYWwnLFxuICAgICAgICAgIGVudW06IFsnbm9ybWFsJywgJ2l0YWxpYyddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbnZhciBzaXplTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgYmFyOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgdGV4dDogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMzAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfVxuICB9XG59O1xuXG52YXIgY29sb3JNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCAndGV4dCc6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICdzdGVlbGJsdWUnXG4gICAgfSxcbiAgICBzY2FsZToge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgdHlwZTogWydzdHJpbmcnLCAnYXJyYXknXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG52YXIgYWxwaGFNaXhpbiA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHN1cHBvcnRlZE1hcmt0eXBlczoge3BvaW50OiB0cnVlLCB0aWNrOiB0cnVlLCBiYXI6IHRydWUsIGxpbmU6IHRydWUsIGFyZWE6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlLCAndGV4dCc6IHRydWV9LFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLCAgLy8gYXV0b1xuICAgICAgbWluaW11bTogMCxcbiAgICAgIG1heGltdW06IDFcbiAgICB9XG4gIH1cbn07XG5cbnZhciBzaGFwZU1peGluID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgc3VwcG9ydGVkTWFya3R5cGVzOiB7cG9pbnQ6IHRydWUsIGNpcmNsZTogdHJ1ZSwgc3F1YXJlOiB0cnVlfSxcbiAgcHJvcGVydGllczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnY2lyY2xlJywgJ3NxdWFyZScsICdjcm9zcycsICdkaWFtb25kJywgJ3RyaWFuZ2xlLXVwJywgJ3RyaWFuZ2xlLWRvd24nXSxcbiAgICAgIGRlZmF1bHQ6ICdjaXJjbGUnXG4gICAgfVxuICB9XG59O1xuXG52YXIgZGV0YWlsTWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgbGluZTogdHJ1ZSwgY2lyY2xlOiB0cnVlLCBzcXVhcmU6IHRydWV9XG59O1xuXG52YXIgcm93TWl4aW4gPSB7XG4gIHByb3BlcnRpZXM6IHtcbiAgICBoZWlnaHQ6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDE1MFxuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQSBmbGFnIGluZGljYXRlIGlmIGdyaWRsaW5lcyBzaG91bGQgYmUgY3JlYXRlZCBpbiBhZGRpdGlvbiB0byB0aWNrcy4nXG4gICAgfSxcbiAgfVxufTtcblxudmFyIGNvbE1peGluID0ge1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgd2lkdGg6IHtcbiAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgbWluaW11bTogMCxcbiAgICAgIGRlZmF1bHQ6IDE1MFxuICAgIH0sXG4gICAgYXhpczoge1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBtYXhMYWJlbExlbmd0aDoge1xuICAgICAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgICAgICBkZWZhdWx0OiAxMixcbiAgICAgICAgICBtaW5pbXVtOiAwLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVHJ1bmNhdGUgbGFiZWxzIHRoYXQgYXJlIHRvbyBsb25nLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGZhY2V0TWl4aW4gPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBzdXBwb3J0ZWRNYXJrdHlwZXM6IHtwb2ludDogdHJ1ZSwgdGljazogdHJ1ZSwgYmFyOiB0cnVlLCBsaW5lOiB0cnVlLCBhcmVhOiB0cnVlLCBjaXJjbGU6IHRydWUsIHNxdWFyZTogdHJ1ZSwgdGV4dDogdHJ1ZX0sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBwYWRkaW5nOiB7XG4gICAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICAgIG1pbmltdW06IDAsXG4gICAgICBtYXhpbXVtOiAxLFxuICAgICAgZGVmYXVsdDogMC4xXG4gICAgfVxuICB9XG59O1xuXG52YXIgcmVxdWlyZWROYW1lVHlwZSA9IHtcbiAgcmVxdWlyZWQ6IFsnbmFtZScsICd0eXBlJ11cbn07XG5cbnZhciBtdWx0aVJvbGVGaWVsZCA9IG1lcmdlKGNsb25lKHR5cGljYWxGaWVsZCksIHtcbiAgc3VwcG9ydGVkUm9sZToge1xuICAgIG1lYXN1cmU6IHRydWUsXG4gICAgZGltZW5zaW9uOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgcXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlLFxuICAgIGRpbWVuc2lvbjogJ29yZGluYWwtb25seScgLy8gdXNpbmcgYWxwaGEgLyBzaXplIHRvIGVuY29kaW5nIGNhdGVnb3J5IGxlYWQgdG8gb3JkZXIgaW50ZXJwcmV0YXRpb25cbiAgfVxufSk7XG5cbnZhciBvbmx5UXVhbnRpdGF0aXZlRmllbGQgPSBtZXJnZShjbG9uZSh0eXBpY2FsRmllbGQpLCB7XG4gIHN1cHBvcnRlZFJvbGU6IHtcbiAgICBtZWFzdXJlOiB0cnVlXG4gIH1cbn0pO1xuXG52YXIgeCA9IG1lcmdlKGNsb25lKG11bHRpUm9sZUZpZWxkKSwgYXhpc01peGluLCBiYW5kTWl4aW4sIHJlcXVpcmVkTmFtZVR5cGUsIHNvcnRNaXhpbik7XG52YXIgeSA9IGNsb25lKHgpO1xuXG52YXIgZmFjZXQgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgcmVxdWlyZWROYW1lVHlwZSwgZmFjZXRNaXhpbiwgc29ydE1peGluKTtcbnZhciByb3cgPSBtZXJnZShjbG9uZShmYWNldCksIGF4aXNNaXhpbiwgcm93TWl4aW4pO1xudmFyIGNvbCA9IG1lcmdlKGNsb25lKGZhY2V0KSwgYXhpc01peGluLCBjb2xNaXhpbik7XG5cbnZhciBzaXplID0gbWVyZ2UoY2xvbmUocXVhbnRpdGF0aXZlRmllbGQpLCBsZWdlbmRNaXhpbiwgc2l6ZU1peGluLCBzb3J0TWl4aW4pO1xudmFyIGNvbG9yID0gbWVyZ2UoY2xvbmUobXVsdGlSb2xlRmllbGQpLCBsZWdlbmRNaXhpbiwgY29sb3JNaXhpbiwgc29ydE1peGluKTtcbnZhciBhbHBoYSA9IG1lcmdlKGNsb25lKHF1YW50aXRhdGl2ZUZpZWxkKSwgYWxwaGFNaXhpbiwgc29ydE1peGluKTtcbnZhciBzaGFwZSA9IG1lcmdlKGNsb25lKG9ubHlPcmRpbmFsRmllbGQpLCBsZWdlbmRNaXhpbiwgc2hhcGVNaXhpbiwgc29ydE1peGluKTtcbnZhciBkZXRhaWwgPSBtZXJnZShjbG9uZShvbmx5T3JkaW5hbEZpZWxkKSwgZGV0YWlsTWl4aW4sIHNvcnRNaXhpbik7XG5cbi8vIHdlIG9ubHkgcHV0IGFnZ3JlZ2F0ZWQgbWVhc3VyZSBpbiBwaXZvdCB0YWJsZVxudmFyIHRleHQgPSBtZXJnZShjbG9uZShvbmx5UXVhbnRpdGF0aXZlRmllbGQpLCB0ZXh0TWl4aW4sIHNvcnRNaXhpbik7XG5cbi8vIFRPRE8gYWRkIGxhYmVsXG5cbnZhciBmaWx0ZXIgPSB7XG4gIHR5cGU6ICdhcnJheScsXG4gIGl0ZW1zOiB7XG4gICAgdHlwZTogJ29iamVjdCcsXG4gICAgcHJvcGVydGllczoge1xuICAgICAgb3BlcmFuZHM6IHtcbiAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICB0eXBlOiBbJ3N0cmluZycsICdib29sZWFuJywgJ2ludGVnZXInLCAnbnVtYmVyJ11cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZXJhdG9yOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICBlbnVtOiBbJz4nLCAnPj0nLCAnPScsICchPScsICc8JywgJzw9JywgJ25vdE51bGwnXVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxudmFyIGNmZyA9IHtcbiAgdHlwZTogJ29iamVjdCcsXG4gIHByb3BlcnRpZXM6IHtcbiAgICAvLyB0ZW1wbGF0ZVxuICAgIHdpZHRoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiB1bmRlZmluZWRcbiAgICB9LFxuICAgIGhlaWdodDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2aWV3cG9ydDoge1xuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgfSxcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgZ3JpZENvbG9yOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIHJvbGU6ICdjb2xvcicsXG4gICAgICBkZWZhdWx0OiAnI2VlZWVlZSdcbiAgICB9LFxuXG4gICAgLy8gZmlsdGVyIG51bGxcbiAgICBmaWx0ZXJOdWxsOiB7XG4gICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgTzoge3R5cGU6J2Jvb2xlYW4nLCBkZWZhdWx0OiBmYWxzZX0sXG4gICAgICAgIFE6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX0sXG4gICAgICAgIFQ6IHt0eXBlOidib29sZWFuJywgZGVmYXVsdDogdHJ1ZX1cbiAgICAgIH1cbiAgICB9LFxuICAgIHRvZ2dsZVNvcnQ6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ08nXG4gICAgfSxcblxuICAgIC8vIHNpbmdsZSBwbG90XG4gICAgc2luZ2xlSGVpZ2h0OiB7XG4gICAgICAvLyB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IGJhbmRXaWR0aCAqIChjYXJkaW5hbGl0eSArIHBhZGRpbmcpXG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzaW5nbGVXaWR0aDoge1xuICAgICAgLy8gd2lsbCBiZSBvdmVyd3JpdHRlbiBieSBiYW5kV2lkdGggKiAoY2FyZGluYWxpdHkgKyBwYWRkaW5nKVxuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gYmFuZCBzaXplXG4gICAgbGFyZ2VCYW5kU2l6ZToge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogMjEsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcbiAgICBzbWFsbEJhbmRTaXplOiB7XG4gICAgICAvL3NtYWxsIG11bHRpcGxlcyBvciBzaW5nbGUgcGxvdCB3aXRoIGhpZ2ggY2FyZGluYWxpdHlcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEyLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgbGFyZ2VCYW5kTWF4Q2FyZGluYWxpdHk6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDEwXG4gICAgfSxcbiAgICAvLyBzbWFsbCBtdWx0aXBsZXNcbiAgICBjZWxsUGFkZGluZzoge1xuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjFcbiAgICB9LFxuICAgIGNlbGxHcmlkQ29sb3I6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgcm9sZTogJ2NvbG9yJyxcbiAgICAgIGRlZmF1bHQ6ICcjYWFhYWFhJ1xuICAgIH0sXG4gICAgY2VsbEJhY2tncm91bmRDb2xvcjoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICByb2xlOiAnY29sb3InLFxuICAgICAgZGVmYXVsdDogJ3RyYW5zcGFyZW50J1xuICAgIH0sXG4gICAgdGV4dENlbGxXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogOTAsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIG1hcmtzXG4gICAgc3Ryb2tlV2lkdGg6IHtcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICBtaW5pbXVtOiAwXG4gICAgfSxcblxuICAgIC8vIHNjYWxlc1xuICAgIHRpbWVTY2FsZUxhYmVsTGVuZ3RoOiB7XG4gICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICBkZWZhdWx0OiAzLFxuICAgICAgbWluaW11bTogMFxuICAgIH0sXG4gICAgLy8gb3RoZXJcbiAgICBjaGFyYWN0ZXJXaWR0aDoge1xuICAgICAgdHlwZTogJ2ludGVnZXInLFxuICAgICAgZGVmYXVsdDogNlxuICAgIH0sXG5cbiAgICAvLyBkYXRhIHNvdXJjZVxuICAgIGRhdGFGb3JtYXRUeXBlOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGVudW06IFsnanNvbicsICdjc3YnXSxcbiAgICAgIGRlZmF1bHQ6ICdqc29uJ1xuICAgIH0sXG4gICAgdXNlVmVnYVNlcnZlcjoge1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICB9LFxuICAgIGRhdGFVcmw6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2ZWdhU2VydmVyVGFibGU6IHtcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2ZWdhU2VydmVyVXJsOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDEnXG4gICAgfVxuICB9XG59O1xuXG4vKiogQHR5cGUgT2JqZWN0IFNjaGVtYSBvZiBhIHZlZ2FsaXRlIHNwZWNpZmljYXRpb24gKi9cbnNjaGVtYS5zY2hlbWEgPSB7XG4gICRzY2hlbWE6ICdodHRwOi8vanNvbi1zY2hlbWEub3JnL2RyYWZ0LTA0L3NjaGVtYSMnLFxuICBkZXNjcmlwdGlvbjogJ1NjaGVtYSBmb3IgdmVnYWxpdGUgc3BlY2lmaWNhdGlvbicsXG4gIHR5cGU6ICdvYmplY3QnLFxuICByZXF1aXJlZDogWydtYXJrdHlwZScsICdlbmMnLCAnY2ZnJ10sXG4gIHByb3BlcnRpZXM6IHtcbiAgICBtYXJrdHlwZTogc2NoZW1hLm1hcmt0eXBlLFxuICAgIGVuYzoge1xuICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHg6IHgsXG4gICAgICAgIHk6IHksXG4gICAgICAgIHJvdzogcm93LFxuICAgICAgICBjb2w6IGNvbCxcbiAgICAgICAgc2l6ZTogc2l6ZSxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBhbHBoYTogYWxwaGEsXG4gICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgZGV0YWlsOiBkZXRhaWxcbiAgICAgIH1cbiAgICB9LFxuICAgIGZpbHRlcjogZmlsdGVyLFxuICAgIGNmZzogY2ZnXG4gIH1cbn07XG5cbnNjaGVtYS5lbmNUeXBlcyA9IHV0aWwua2V5cyhzY2hlbWEuc2NoZW1hLnByb3BlcnRpZXMuZW5jLnByb3BlcnRpZXMpO1xuXG4vKiogSW5zdGFudGlhdGUgYSB2ZXJib3NlIHZsIHNwZWMgZnJvbSB0aGUgc2NoZW1hICovXG5zY2hlbWEuaW5zdGFudGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHNjaGVtYS51dGlsLmluc3RhbnRpYXRlKHNjaGVtYS5zY2hlbWEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNjaGVtYXV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9LFxuICB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG52YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG5zY2hlbWF1dGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYXV0aWwubWVyZ2Uoc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEpLCBpbnN0YW5jZSk7XG59O1xuXG4vLyBpbnN0YW50aWF0ZSBhIHNjaGVtYVxuc2NoZW1hdXRpbC5pbnN0YW50aWF0ZSA9IGZ1bmN0aW9uKHNjaGVtYSkge1xuICB2YXIgdmFsO1xuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIGluc3RhbmNlID0ge307XG4gICAgZm9yICh2YXIgbmFtZSBpbiBzY2hlbWEucHJvcGVydGllcykge1xuICAgICAgdmFsID0gc2NoZW1hdXRpbC5pbnN0YW50aWF0ZShzY2hlbWEucHJvcGVydGllc1tuYW1lXSk7XG4gICAgICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaW5zdGFuY2VbbmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIGlmICgnZGVmYXVsdCcgaW4gc2NoZW1hKSB7XG4gICAgdmFsID0gc2NoZW1hLmRlZmF1bHQ7XG4gICAgcmV0dXJuIHV0aWwuaXNPYmplY3QodmFsKSA/IHV0aWwuZHVwbGljYXRlKHZhbCkgOiB2YWw7XG4gIH0gZWxzZSBpZiAoc2NoZW1hLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbi8vIHJlbW92ZSBhbGwgZGVmYXVsdHMgZnJvbSBhbiBpbnN0YW5jZVxuc2NoZW1hdXRpbC5zdWJ0cmFjdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBkZWZhdWx0cykge1xuICB2YXIgY2hhbmdlcyA9IHt9O1xuICBmb3IgKHZhciBwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgdmFyIGRlZiA9IGRlZmF1bHRzW3Byb3BdO1xuICAgIHZhciBpbnMgPSBpbnN0YW5jZVtwcm9wXTtcbiAgICAvLyBOb3RlOiBkb2VzIG5vdCBwcm9wZXJseSBzdWJ0cmFjdCBhcnJheXNcbiAgICBpZiAoIWRlZmF1bHRzIHx8IGRlZiAhPT0gaW5zKSB7XG4gICAgICBpZiAodHlwZW9mIGlucyA9PT0gJ29iamVjdCcgJiYgIXV0aWwuaXNBcnJheShpbnMpICYmIGRlZikge1xuICAgICAgICB2YXIgYyA9IHNjaGVtYXV0aWwuc3VidHJhY3QoaW5zLCBkZWYpO1xuICAgICAgICBpZiAoIWlzRW1wdHkoYykpXG4gICAgICAgICAgY2hhbmdlc1twcm9wXSA9IGM7XG4gICAgICB9IGVsc2UgaWYgKCF1dGlsLmlzQXJyYXkoaW5zKSB8fCBpbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBjaGFuZ2VzW3Byb3BdID0gaW5zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY2hhbmdlcztcbn07XG5cbnNjaGVtYXV0aWwubWVyZ2UgPSBmdW5jdGlvbigvKmRlc3QqLCBzcmMwLCBzcmMxLCAuLi4qLyl7XG4gIHZhciBkZXN0ID0gYXJndW1lbnRzWzBdO1xuICBmb3IgKHZhciBpPTEgOyBpPGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGRlc3QgPSBtZXJnZShkZXN0LCBhcmd1bWVudHNbaV0pO1xuICB9XG4gIHJldHVybiBkZXN0O1xufTtcblxuLy8gcmVjdXJzaXZlbHkgbWVyZ2VzIHNyYyBpbnRvIGRlc3RcbmZ1bmN0aW9uIG1lcmdlKGRlc3QsIHNyYykge1xuICBpZiAodHlwZW9mIHNyYyAhPT0gJ29iamVjdCcgfHwgc3JjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICBmb3IgKHZhciBwIGluIHNyYykge1xuICAgIGlmICghc3JjLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHNyY1twXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzcmNbcF0gIT09ICdvYmplY3QnIHx8IHNyY1twXSA9PT0gbnVsbCkge1xuICAgICAgZGVzdFtwXSA9IHNyY1twXTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0W3BdICE9PSAnb2JqZWN0JyB8fCBkZXN0W3BdID09PSBudWxsKSB7XG4gICAgICBkZXN0W3BdID0gbWVyZ2Uoc3JjW3BdLmNvbnN0cnVjdG9yID09PSBBcnJheSA/IFtdIDoge30sIHNyY1twXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lcmdlKGRlc3RbcF0sIHNyY1twXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXN0O1xufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG51dGlsLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIGsgPSBbXSwgeDtcbiAgZm9yICh4IGluIG9iaikgay5wdXNoKHgpO1xuICByZXR1cm4gaztcbn07XG5cbnV0aWwudmFscyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgdiA9IFtdLCB4O1xuICBmb3IgKHggaW4gb2JqKSB2LnB1c2gob2JqW3hdKTtcbiAgcmV0dXJuIHY7XG59O1xuXG51dGlsLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgc3RlcCA9IDE7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICB9XG4gIGlmICgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXAgPT0gSW5maW5pdHkpIHRocm93IG5ldyBFcnJvcignaW5maW5pdGUgcmFuZ2UnKTtcbiAgdmFyIHJhbmdlID0gW10sIGkgPSAtMSwgajtcbiAgaWYgKHN0ZXAgPCAwKSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpID4gc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgZWxzZSB3aGlsZSAoKGogPSBzdGFydCArIHN0ZXAgKiArK2kpIDwgc3RvcCkgcmFuZ2UucHVzaChqKTtcbiAgcmV0dXJuIHJhbmdlO1xufTtcblxudXRpbC5maW5kID0gZnVuY3Rpb24obGlzdCwgcGF0dGVybikge1xuICB2YXIgbCA9IGxpc3QuZmlsdGVyKGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4geFtwYXR0ZXJuLm5hbWVdID09PSBwYXR0ZXJuLnZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIGwubGVuZ3RoICYmIGxbMF0gfHwgbnVsbDtcbn07XG5cbnV0aWwuaXNpbiA9IGZ1bmN0aW9uKGl0ZW0sIGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pICE9PSAtMTtcbn07XG5cbnV0aWwudW5pcSA9IGZ1bmN0aW9uKGRhdGEsIGZpZWxkKSB7XG4gIHZhciBtYXAgPSB7fSwgY291bnQgPSAwLCBpLCBrO1xuICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBkYXRhW2ldW2ZpZWxkXTtcbiAgICBpZiAoIW1hcFtrXSkge1xuICAgICAgbWFwW2tdID0gMTtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3VudDtcbn07XG5cbnZhciBpc051bWJlciA9IGZ1bmN0aW9uKG4pIHtcbiAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbn07XG5cbi8vIHRyeSBwYXJzaW5nIHRvIG51bWJlclxudXRpbC5udW1iZXJzID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBudW1zID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGlzTnVtYmVyKHZhbHVlc1tpXSkpIHtcbiAgICAgIG51bXMucHVzaCgrdmFsdWVzW2ldKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bXM7XG59O1xuXG4vLyB0cnkgdG8gcGFyc2UgYXMgZGF0ZVxudXRpbC5kYXRlcyA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICB2YXIgZGF0ZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZGF0ZSA9IERhdGUucGFyc2UodmFsdWVzW2ldKTtcbiAgICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgICBkYXRlcy5wdXNoKG5ldyBEYXRlKGRhdGUpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGVzO1xufTtcblxudXRpbC5tZWRpYW4gPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFsdWVzLnNvcnQoZnVuY3Rpb24oYSwgYikge3JldHVybiBhIC0gYjt9KTtcbiAgdmFyIGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGgvMik7XG4gIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgIHJldHVybiB2YWx1ZXNbaGFsZl07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICh2YWx1ZXNbaGFsZi0xXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG4gIH1cbn07XG5cbnV0aWwubWVhbiA9IGZ1bmN0aW9uKHZhbHVlcykge1xuICByZXR1cm4gdmFsdWVzLnJlZHVjZShmdW5jdGlvbih2LCByKSB7cmV0dXJuIHYgKyByO30sIDApIC8gdmFsdWVzLmxlbmd0aDtcbn07XG5cbnV0aWwudmFyaWFuY2UgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgdmFyIGF2ZyA9IHV0aWwubWVhbih2YWx1ZXMpO1xuICB2YXIgZGlmZnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBkaWZmcy5wdXNoKE1hdGgucG93KCh2YWx1ZXNbaV0gLSBhdmcpLCAyKSk7XG4gIH1cbiAgcmV0dXJuIHV0aWwubWVhbihkaWZmcyk7XG59O1xuXG51dGlsLnN0YWJsZXNvcnQgPSBmdW5jdGlvbihhcnJheSwgc29ydEJ5LCBrZXlGbikge1xuICB2YXIgaW5kaWNlcyA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odiwgaSkge1xuICAgIGluZGljZXNba2V5Rm4odildID0gaTtcbiAgfSk7XG5cbiAgYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgdmFyIHNhID0gc29ydEJ5KGEpLFxuICAgICAgc2IgPSBzb3J0QnkoYik7XG5cbiAgICByZXR1cm4gc2E8c2IgPyAtMSA6IHNhPnNiID8gMSA6IChpbmRpY2VzW2tleUZuKGEpXSAtIGluZGljZXNba2V5Rm4oYildKTtcbiAgfSk7XG4gIHJldHVybiBhcnJheTtcbn07XG5cbnV0aWwuc3RkZXYgPSBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgcmV0dXJuIE1hdGguc3FydCh1dGlsLnZhcmlhbmNlKHZhbHVlcykpO1xufTtcblxudXRpbC5za2V3ID0gZnVuY3Rpb24odmFsdWVzKSB7XG4gIHZhciBhdmcgPSB1dGlsLm1lYW4odmFsdWVzKSxcbiAgICBtZWQgPSB1dGlsLm1lZGlhbih2YWx1ZXMpLFxuICAgIHN0ZCA9IHV0aWwuc3RkZXYodmFsdWVzKTtcbiAgcmV0dXJuIDEuMCAqIChhdmcgLSBtZWQpIC8gc3RkO1xufTtcblxuLy8gcGFyc2VzIGEgc3RyaW5nIHRvIGRhdGUgb3IgbnVtYmVyXG51dGlsLnBhcnNlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSkge1xuICAgIHJldHVybiArdmFsdWU7XG4gIH1cblxuICB2YXIgZGF0ZSA9IERhdGUucGFyc2UodmFsdWUpO1xuICBpZiAoIWlzTmFOKGRhdGUpKSB7XG4gICAgcmV0dXJuIChuZXcgRGF0ZShkYXRlKSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxudXRpbC5taW5tYXggPSBmdW5jdGlvbihkYXRhKSB7XG4gIHZhciBzdGF0cyA9IHttaW46ICtJbmZpbml0eSwgbWF4OiAtSW5maW5pdHl9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgdiA9IGRhdGFbaV07XG4gICAgaWYgKHYgIT09IG51bGwpIHtcbiAgICAgIGlmICh2ID4gc3RhdHMubWF4IHx8IHN0YXRzLm1heCA9PT0gLUluZmluaXR5KSBzdGF0cy5tYXggPSB2O1xuICAgICAgaWYgKHYgPCBzdGF0cy5taW4gfHwgc3RhdHMubWluID09PSArSW5maW5pdHkpIHN0YXRzLm1pbiA9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdGF0cztcbn07XG5cbnV0aWwuZHVwbGljYXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xufTtcblxudXRpbC5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn07XG5cbnV0aWwuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbnV0aWwuYXJyYXkgPSBmdW5jdGlvbih4KSB7XG4gIHJldHVybiB4ID8gKHV0aWwuaXNBcnJheSh4KSA/IHggOiBbeF0pIDogW107XG59O1xuXG51dGlsLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGYsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgb2JqLmZvckVhY2guY2FsbCh0aGlzQXJnLCBmKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgZi5jYWxsKHRoaXNBcmcsIG9ialtrXSwgayAsIG9iaik7XG4gICAgfVxuICB9XG59O1xuXG51dGlsLnJlZHVjZSA9IGZ1bmN0aW9uKG9iaiwgZiwgaW5pdCwgdGhpc0FyZykge1xuICBpZiAob2JqLnJlZHVjZSkge1xuICAgIHJldHVybiBvYmoucmVkdWNlLmNhbGwodGhpc0FyZywgZiwgaW5pdCk7XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgIGluaXQgPSBmLmNhbGwodGhpc0FyZywgaW5pdCwgb2JqW2tdLCBrLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gaW5pdDtcbiAgfVxufTtcblxudXRpbC5tYXAgPSBmdW5jdGlvbihvYmosIGYsIHRoaXNBcmcpIHtcbiAgaWYgKG9iai5tYXApIHtcbiAgICByZXR1cm4gb2JqLm1hcC5jYWxsKHRoaXNBcmcsIGYpO1xuICB9IGVsc2Uge1xuICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgb3V0cHV0LnB1c2goIGYuY2FsbCh0aGlzQXJnLCBvYmpba10sIGssIG9iaikpO1xuICAgIH1cbiAgfVxufTtcblxudXRpbC5hbnkgPSBmdW5jdGlvbihhcnIsIGYpIHtcbiAgdmFyIGkgPSAwLCBrO1xuICBmb3IgKGsgaW4gYXJyKSB7XG4gICAgaWYgKGYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG51dGlsLmFsbCA9IGZ1bmN0aW9uKGFyciwgZikge1xuICB2YXIgaSA9IDAsIGs7XG4gIGZvciAoayBpbiBhcnIpIHtcbiAgICBpZiAoIWYoYXJyW2tdLCBrLCBpKyspKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbnV0aWwuY21wID0gZnVuY3Rpb24oYSwgYikge1xuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfSBlbHNlIGlmIChhID49IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsICYmIGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIGlmIChhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKGIgPT09IG51bGwpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gTmFOO1xufTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24oZGVzdCwgc3JjKSB7XG4gIHJldHVybiB1dGlsLmtleXMoc3JjKS5yZWR1Y2UoZnVuY3Rpb24oYywgaykge1xuICAgIGNba10gPSBzcmNba107XG4gICAgcmV0dXJuIGM7XG4gIH0sIGRlc3QpO1xufTtcblxudXRpbC5tZXJnZSA9IGZ1bmN0aW9uKC8qZGVzdCosIHNyYzAsIHNyYzEsIC4uLiovKXtcbiAgdmFyIGRlc3QgPSBhcmd1bWVudHNbMF07XG4gIGZvciAodmFyIGk9MSA7IGk8YXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVzdCA9IG1lcmdlKGRlc3QsIGFyZ3VtZW50c1tpXSk7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG51dGlsLmdldGJpbnMgPSBmdW5jdGlvbihzdGF0cywgbWF4Ymlucykge1xuICByZXR1cm4gdXRpbC5iaW5zKHtcbiAgICBtaW46IHN0YXRzLm1pbixcbiAgICBtYXg6IHN0YXRzLm1heCxcbiAgICBtYXhiaW5zOiBtYXhiaW5zXG4gIH0pO1xufTtcblxuXG51dGlsLmJpbnMgPSBmdW5jdGlvbihvcHQpIHtcbiAgb3B0ID0gb3B0IHx8IHt9O1xuXG4gIC8vIGRldGVybWluZSByYW5nZVxuICB2YXIgbWF4YiA9IG9wdC5tYXhiaW5zIHx8IDEwMjQsXG4gICAgICBiYXNlID0gb3B0LmJhc2UgfHwgMTAsXG4gICAgICBkaXYgPSBvcHQuZGl2IHx8IFs1LCAyXSxcbiAgICAgIG1pbnMgPSBvcHQubWluc3RlcCB8fCAwLFxuICAgICAgbG9nYiA9IE1hdGgubG9nKGJhc2UpLFxuICAgICAgbGV2ZWwgPSBNYXRoLmNlaWwoTWF0aC5sb2cobWF4YikgLyBsb2diKSxcbiAgICAgIG1pbiA9IG9wdC5taW4sXG4gICAgICBtYXggPSBvcHQubWF4LFxuICAgICAgc3BhbiA9IG1heCAtIG1pbixcbiAgICAgIHN0ZXAgPSBNYXRoLm1heChtaW5zLCBNYXRoLnBvdyhiYXNlLCBNYXRoLnJvdW5kKE1hdGgubG9nKHNwYW4pIC8gbG9nYikgLSBsZXZlbCkpLFxuICAgICAgbmJpbnMgPSBNYXRoLmNlaWwoc3BhbiAvIHN0ZXApLFxuICAgICAgcHJlY2lzaW9uLCB2LCBpLCBlcHM7XG5cbiAgaWYgKG9wdC5zdGVwKSB7XG4gICAgc3RlcCA9IG9wdC5zdGVwO1xuICB9IGVsc2UgaWYgKG9wdC5zdGVwcykge1xuICAgIC8vIGlmIHByb3ZpZGVkLCBsaW1pdCBjaG9pY2UgdG8gYWNjZXB0YWJsZSBzdGVwIHNpemVzXG4gICAgc3RlcCA9IG9wdC5zdGVwc1tNYXRoLm1pbihcbiAgICAgICAgb3B0LnN0ZXBzLmxlbmd0aCAtIDEsXG4gICAgICAgIHV0aWxfYmlzZWN0TGVmdChvcHQuc3RlcHMsIHNwYW4gLyBtYXhiLCAwLCBvcHQuc3RlcHMubGVuZ3RoKVxuICAgICldO1xuICB9IGVsc2Uge1xuICAgIC8vIGluY3JlYXNlIHN0ZXAgc2l6ZSBpZiB0b28gbWFueSBiaW5zXG4gICAgZG8ge1xuICAgICAgc3RlcCAqPSBiYXNlO1xuICAgICAgbmJpbnMgPSBNYXRoLmNlaWwoc3BhbiAvIHN0ZXApO1xuICAgIH0gd2hpbGUgKG5iaW5zID4gbWF4Yik7XG5cbiAgICAvLyBkZWNyZWFzZSBzdGVwIHNpemUgaWYgYWxsb3dlZFxuICAgIGZvciAoaSA9IDA7IGkgPCBkaXYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHYgPSBzdGVwIC8gZGl2W2ldO1xuICAgICAgaWYgKHYgPj0gbWlucyAmJiBzcGFuIC8gdiA8PSBtYXhiKSB7XG4gICAgICAgIHN0ZXAgPSB2O1xuICAgICAgICBuYmlucyA9IE1hdGguY2VpbChzcGFuIC8gc3RlcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdXBkYXRlIHByZWNpc2lvbiwgbWluIGFuZCBtYXhcbiAgdiA9IE1hdGgubG9nKHN0ZXApO1xuICBwcmVjaXNpb24gPSB2ID49IDAgPyAwIDogfn4oLXYgLyBsb2diKSArIDE7XG4gIGVwcyA9IChtaW48MCA/IC0xIDogMSkgKiBNYXRoLnBvdyhiYXNlLCAtcHJlY2lzaW9uIC0gMSk7XG4gIG1pbiA9IE1hdGgubWluKG1pbiwgTWF0aC5mbG9vcihtaW4gLyBzdGVwICsgZXBzKSAqIHN0ZXApO1xuICBtYXggPSBNYXRoLmNlaWwobWF4IC8gc3RlcCkgKiBzdGVwO1xuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IG1pbixcbiAgICBzdG9wOiBtYXgsXG4gICAgc3RlcDogc3RlcCxcbiAgICB1bml0OiBwcmVjaXNpb25cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIHV0aWxfYmlzZWN0TGVmdChhLCB4LCBsbywgaGkpIHtcbiAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICBpZiAodXRpbC5jbXAoYVttaWRdLCB4KSA8IDApIHsgbG8gPSBtaWQgKyAxOyB9XG4gICAgZWxzZSB7IGhpID0gbWlkOyB9XG4gIH1cbiAgcmV0dXJuIGxvO1xufVxuXG4vKipcbiAqIHhbcFswXV0uLi5bcFtuXV0gPSB2YWxcbiAqIEBwYXJhbSBub2F1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5zZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCB2YWwsIG5vYXVnbWVudCkge1xuICBmb3IgKHZhciBpPTA7IGk8cC5sZW5ndGgtMTsgKytpKSB7XG4gICAgaWYgKCFub2F1Z21lbnQgJiYgIShwW2ldIGluIHgpKXtcbiAgICAgIHggPSB4W3BbaV1dID0ge307XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSB4W3BbaV1dO1xuICAgIH1cbiAgfVxuICB4W3BbaV1dID0gdmFsO1xufTtcblxuXG4vKipcbiAqIHJldHVybnMgeFtwWzBdXS4uLltwW25dXVxuICogQHBhcmFtIGF1Z21lbnQgZGV0ZXJtaW5lIHdoZXRoZXIgbmV3IG9iamVjdCBzaG91bGQgYmUgYWRkZWQgZlxuICogb3Igbm9uLWV4aXN0aW5nIHByb3BlcnRpZXMgYWxvbmcgdGhlIHBhdGhcbiAqL1xudXRpbC5nZXR0ZXIgPSBmdW5jdGlvbih4LCBwLCBub2F1Z21lbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHAubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoIW5vYXVnbWVudCAmJiAhKHBbaV0gaW4geCkpe1xuICAgICAgeCA9IHhbcFtpXV0gPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IHhbcFtpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiB4O1xufTtcblxudXRpbC50cnVuY2F0ZSA9IGZ1bmN0aW9uKHMsIGxlbmd0aCwgcG9zLCB3b3JkLCBlbGxpcHNpcykge1xuICB2YXIgbGVuID0gcy5sZW5ndGg7XG4gIGlmIChsZW4gPD0gbGVuZ3RoKSByZXR1cm4gcztcbiAgZWxsaXBzaXMgPSBlbGxpcHNpcyB8fCBcIi4uLlwiO1xuICB2YXIgbCA9IE1hdGgubWF4KDAsIGxlbmd0aCAtIGVsbGlwc2lzLmxlbmd0aCk7XG5cbiAgc3dpdGNoIChwb3MpIHtcbiAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgcmV0dXJuIGVsbGlwc2lzICsgKHdvcmQgPyB2Z190cnVuY2F0ZU9uV29yZChzLGwsMSkgOiBzLnNsaWNlKGxlbi1sKSk7XG4gICAgY2FzZSBcIm1pZGRsZVwiOlxuICAgIGNhc2UgXCJjZW50ZXJcIjpcbiAgICAgIHZhciBsMSA9IE1hdGguY2VpbChsLzIpLCBsMiA9IE1hdGguZmxvb3IobC8yKTtcbiAgICAgIHJldHVybiAod29yZCA/IHZnX3RydW5jYXRlT25Xb3JkKHMsbDEpIDogcy5zbGljZSgwLGwxKSkgKyBlbGxpcHNpcyArXG4gICAgICAgICh3b3JkID8gdmdfdHJ1bmNhdGVPbldvcmQocyxsMiwxKSA6IHMuc2xpY2UobGVuLWwyKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAod29yZCA/IHZnX3RydW5jYXRlT25Xb3JkKHMsbCkgOiBzLnNsaWNlKDAsbCkpICsgZWxsaXBzaXM7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHZnX3RydW5jYXRlT25Xb3JkKHMsIGxlbiwgcmV2KSB7XG4gIHZhciBjbnQgPSAwLCB0b2sgPSBzLnNwbGl0KHZnX3RydW5jYXRlX3dvcmRfcmUpO1xuICBpZiAocmV2KSB7XG4gICAgcyA9ICh0b2sgPSB0b2sucmV2ZXJzZSgpKVxuICAgICAgLmZpbHRlcihmdW5jdGlvbih3KSB7IGNudCArPSB3Lmxlbmd0aDsgcmV0dXJuIGNudCA8PSBsZW47IH0pXG4gICAgICAucmV2ZXJzZSgpO1xuICB9IGVsc2Uge1xuICAgIHMgPSB0b2suZmlsdGVyKGZ1bmN0aW9uKHcpIHsgY250ICs9IHcubGVuZ3RoOyByZXR1cm4gY250IDw9IGxlbjsgfSk7XG4gIH1cbiAgcmV0dXJuIHMubGVuZ3RoID8gcy5qb2luKFwiXCIpLnRyaW0oKSA6IHRva1swXS5zbGljZSgwLCBsZW4pO1xufVxuXG52YXIgdmdfdHJ1bmNhdGVfd29yZF9yZSA9IC8oW1xcdTAwMDlcXHUwMDBBXFx1MDAwQlxcdTAwMENcXHUwMDBEXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUyMDI4XFx1MjAyOVxcdTMwMDBcXHVGRUZGXSkvO1xuXG5cbnV0aWwuZXJyb3IgPSBmdW5jdGlvbihtc2cpIHtcbiAgY29uc29sZS5lcnJvcignW1ZMIEVycm9yXScsIG1zZyk7XG59O1xuXG4iXX0=
