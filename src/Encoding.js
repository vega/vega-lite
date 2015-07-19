'use strict';

require('./globals');

var consts = require('./consts'),
  util = require('./util'),
  vlfield = require('./field'),
  vlenc = require('./enc'),
  schema = require('./schema/schema');

module.exports = (function() {
  function Encoding(spec, theme) {
    var defaults = schema.instantiate(),
      specExtended = schema.util.merge(defaults, theme || {}, spec) ;

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.encoding;
    this._config = specExtended.config;
    this._filter = specExtended.filter;
    // this._vega2 = true;
  }

  var proto = Encoding.prototype;

  Encoding.fromShorthand = function(shorthand, data, config, theme) {
    var c = consts.shorthand,
        split = shorthand.split(c.delim),
        marktype = split.shift().split(c.assign)[1].trim(),
        enc = vlenc.fromShorthand(split);

    return new Encoding({
      data: data,
      marktype: marktype,
      encoding: enc,
      config: config,
      filter: []
    }, theme);
  };

  Encoding.fromSpec = function(spec, theme) {
    return new Encoding(spec, theme);
  };

  proto.toShorthand = function() {
    var c = consts.shorthand;
    return 'mark' + c.assign + this._marktype +
      c.delim + vlenc.shorthand(this._enc);
  };

  Encoding.shorthand = function (spec) {
    var c = consts.shorthand;
    return 'mark' + c.assign + spec.marktype +
      c.delim + vlenc.shorthand(spec.encoding);
  };

  Encoding.specFromShorthand = function(shorthand, data, config, excludeConfig) {
    return Encoding.fromShorthand(shorthand, data, config).toSpec(excludeConfig);
  };

  proto.toSpec = function(excludeConfig, excludeData) {
    var enc = util.duplicate(this._enc),
      spec;

    spec = {
      marktype: this._marktype,
      encoding: enc,
      filter: this._filter
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schema.util.subtract(spec, defaults);
  };


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

  proto.field = function(et) {
    return this._enc[et];
  };

  proto.filter = function() {
    var filterNull = [],
      fields = this.fields(),
      self = this;

    util.forEach(fields, function(fieldList, fieldName) {
      if (fieldName === '*') return; //count

      if ((self.config('filterNull').Q && fieldList.containsType[Q]) ||
          (self.config('filterNull').T && fieldList.containsType[T]) ||
          (self.config('filterNull').O && fieldList.containsType[O]) ||
          (self.config('filterNull').N && fieldList.containsType[N])) {
        filterNull.push({
          operands: [fieldName],
          operator: 'notNull'
        });
      }
    });

    return filterNull.concat(this._filter);
  };

  // get "field" reference for vega
  proto.fieldRef = function(et, opt) {
    opt = opt || {};
    opt.data = !this._vega2 && (opt.data !== false);
    return vlfield.fieldRef(this._enc[et], opt);
  };

  proto.fieldName = function(et) {
    return this._enc[et].name;
  };

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  proto.fields = function() {
    return vlenc.fields(this._enc);
  };

  proto.fieldTitle = function(et) {
    if (vlfield.isCount(this._enc[et])) {
      return vlfield.count.displayName;
    }
    var fn = this._enc[et].aggregate || this._enc[et].timeUnit || (this._enc[et].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[et].name + ')';
    } else {
      return this._enc[et].name;
    }
  };

  proto.scale = function(et) {
    return this._enc[et].scale || {};
  };

  proto.axis = function(et) {
    return this._enc[et].axis || {};
  };

  proto.bandSize = function(encType, useSmallBand) {
    useSmallBand = useSmallBand ||
      //isBandInSmallMultiples
      (encType === Y && this.has(ROW) && this.has(Y)) ||
      (encType === X && this.has(COL) && this.has(X));

    // if band.size is explicitly specified, follow the specification, otherwise draw value from config.
    return this.field(encType).band.size ||
      this.config(useSmallBand ? 'smallBandSize' : 'largeBandSize');
  };

  proto.aggregate = function(et) {
    return this._enc[et].aggregate;
  };

  // returns false if binning is disabled, otherwise an object with binning properties
  proto.bin = function(et) {
    var bin = this._enc[et].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: schema.MAXBINS_DEFAULT
      };
    return bin;
  };

  proto.value = function(et) {
    return this._enc[et].value;
  };

  proto.numberFormat = function(fieldStats) {
    var formatConfig = fieldStats.max > this.config('maxSmallNumber') ?
      'largeNumberFormat': 'smallNumberFormat';
    return this.config(formatConfig);
  };

  proto.sort = function(et, stats) {
    var sort = this._enc[et].sort,
      enc = this._enc,
      isTypes = vlfield.isTypes;

    if ((!sort || sort.length===0) &&
        // FIXME
        Encoding.toggleSort.support({encoding:this._enc}, stats, true) && //HACK
        this.config('toggleSort') === Q
      ) {
      var qField = isTypes(enc.x, [N, O]) ? enc.y : enc.x;

      if (isTypes(enc[et], [N, O])) {
        sort = [{
          name: qField.name,
          aggregate: qField.aggregate,
          type: qField.type,
          reverse: true
        }];
      }
    }

    return sort;
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

  proto.isType = function(et, type) {
    var field = this.field(et);
    return field && vlfield.isType(field, type);
  };

  proto.isTypes = function(et, type) {
    var field = this.field(et);
    return field && vlfield.isTypes(field, type);
  };

  Encoding.isOrdinalScale = function(encoding, encType) {
    return vlfield.isOrdinalScale(encoding.field(encType));
  };

  Encoding.isDimension = function(encoding, encType) {
    return vlfield.isDimension(encoding.field(encType));
  };

  Encoding.isMeasure = function(encoding, encType) {
    return vlfield.isMeasure(encoding.field(encType));
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
    return vlenc.isAggregate(spec.encoding);
  };

  Encoding.alwaysNoOcclusion = function(spec) {
    // FIXME raw OxQ with # of rows = # of O
    return vlenc.isAggregate(spec.encoding);
  };

  Encoding.isStack = function(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      spec.encoding.color;
  };

  proto.isStack = function() {
    // FIXME update this once we have control for stack ...
    return (this.is('bar') || this.is('area')) && this.has('color');
  };

  proto.cardinality = function(encType, stats) {
    return vlfield.cardinality(this.field(encType), stats, this.config('filterNull'));
  };

  proto.isRaw = function() {
    return !this.isAggregate();
  };

  proto.data = function(name) {
    return name ? this._data[name] : this._data;
  };

   // returns whether the encoding has values embedded
  proto.hasValues = function() {
    var vals = this.data('values');
    return vals && vals.length;
  };

  proto.config = function(name) {
    return this._config[name];
  };

  Encoding.transpose = function(spec) {
    var oldenc = spec.encoding,
      enc = util.duplicate(spec.encoding);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.encoding = enc;
    return spec;
  };

  // FIXME: REMOVE everything below here

  Encoding.toggleSort = function(spec) {
    spec.config = spec.config || {};
    spec.config.toggleSort = spec.config.toggleSort === Q ? N : Q;
    return spec;
  };


  Encoding.toggleSort.direction = function(spec) {
    if (!Encoding.toggleSort.support(spec)) { return; }
    var enc = spec.encoding;
    return enc.x.type === N ? 'x' : 'y';
  };

  Encoding.toggleSort.mode = function(spec) {
    return spec.config.toggleSort;
  };

  Encoding.toggleSort.support = function(spec, stats) {
    var enc = spec.encoding,
      isTypes = vlfield.isTypes;

    if (vlenc.has(enc, ROW) || vlenc.has(enc, COL) ||
      !vlenc.has(enc, X) || !vlenc.has(enc, Y) ||
      !Encoding.alwaysNoOcclusion(spec, stats)) {
      return false;
    }

    return ( isTypes(enc.x, [N,O]) && vlfield.isMeasure(enc.y)) ? 'x' :
      ( isTypes(enc.y, [N,O]) && vlfield.isMeasure(enc.x)) ? 'y' : false;
  };

  Encoding.toggleFilterNullO = function(spec) {
    spec.config = spec.config || {};
    spec.config.filterNull = spec.config.filterNull || { //FIXME
      T: true,
      Q: true
    };
    spec.config.filterNull.O = !spec.config.filterNull.O;
    return spec;
  };

  Encoding.toggleFilterNullO.support = function(spec, stats) {
    var fields = vlenc.fields(spec.encoding);
    for (var fieldName in fields) {
      var fieldList = fields[fieldName];
      if (fieldList.containsType.O && fieldName in stats && stats[fieldName].nulls > 0) {
        return true;
      }
    }
    return false;
  };

  return Encoding;
})();
