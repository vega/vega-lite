"use strict";

var global = require('./globals'),
  consts = require('./consts'),
  util = require('./util'),
  schema = require('./schema');

var Encoding = module.exports = (function() {

  function Encoding(marktype, enc, config) {
    this._marktype = marktype;
    this._enc = enc; // {encType1:field1, ...}
    this._cfg = util.merge(Object.create(consts.DEFAULTS), config);
  }

  var proto = Encoding.prototype;

  proto.marktype = function() {
    return this._marktype;
  };

  proto.is = function(m) {
    return this._marktype === m;
  };

  proto.has = function(x) {
    return this._enc[x] !== undefined;
  };

  proto.enc = function(x){
    return this._enc[x];
  };

  // get "field" property for vega
  proto.field = function(x, nodata, nofn) {
    if (!this.has(x)) return null;

    var f = (nodata ? "" : "data.");

    if (this._enc[x].aggr === "count") {
      return f + "count";
    } else if (!nofn && this._enc[x].bin) {
      return f + "bin_" + this._enc[x].name;
    } else if (!nofn && this._enc[x].aggr) {
      return f + this._enc[x].aggr + "_" + this._enc[x].name;
    } else if (!nofn && this._enc[x].fn){
      return f + this._enc[x].fn + "_" + this._enc[x].name;
    } else {
      return f + this._enc[x].name;
    }
  };

  proto.fieldName = function(x){
    return this._enc[x].name;
  }

  proto.fieldTitle = function(x){
    if (this._enc[x].aggr) {
      return this._enc[x].aggr + "(" + this._enc[x].name + ")";
    } else {
      return this._enc[x].name;
    }
  }

  proto.scale = function(x){
    return this._enc[x].scale || {};
  }

  proto.axis = function(x){
    return this._enc[x].axis || {};
  }

  proto.aggr = function(x){
    return this._enc[x].aggr;
  }

  proto.bin = function(x){
    return this._enc[x].bin;
  }

  proto.legend = function(x){
    return this._enc[x].legend;
  }

  proto.fn = function(x){
    return this._enc[x].fn;
  }

  proto.any = function(f){
    return util.any(this._enc, f);
  }

  proto.all = function(f){
    return util.all(this._enc, f);
  }

  proto.length = function(){
    return util.keys(this._enc).length;
  }

  proto.reduce = function(f, init){
    var r = init, i=0;
    for (k in this._enc){
      r = f(r, this._enc[k], k, this._enc);
    }
    return r;
  }

  proto.forEach = function(f) {
    var i=0, k;
    for (k in this._enc) {
      f(k, this._enc[k], i++);
    }
  };

  proto.type = function(x) {
    return this.has(x) ? this._enc[x].type : null;
  };

  proto.isType = function(x, t) {
    var xt = this.type(x);
    if (xt == null) return false;
    return (xt & t) > 0;
  };

  proto.config = function(name) {
    return this._cfg[name];
  };

  proto.toSpec = function(excludeConfig){
    var enc = util.duplicate(this._enc),
      spec;

    // convert type's bitcode to type name
    for(var e in enc){
      enc[e].type = consts.dataTypeNames[enc[e].type];
    }

    spec = {
      marktype: this._marktype,
      enc: enc
    }

    if(!excludeConfig){
      spec.cfg = util.duplicate(this._cfg)
    }

    return spec;
  };

  proto.toShorthand = function(){
    var enc = this._enc;
    return this._marktype + "." + util.keys(enc).map(function(e){
      var v = enc[e];
        return e + "-" +
          (v.aggr ? v.aggr+"_" : "") +
          (v.fn ? v.fn+"_" : "") +
          (v.bin ? "bin_" : "") +
          (v.name || "") + "-" +
          consts.dataTypeNames[v.type];
      }
    ).join(".");
  }

  Encoding.parseShorthand = function(shorthand, cfg){
    var enc = shorthand.split("."),
      marktype = enc.shift();

    enc = enc.reduce(function(m, e){
      var split = e.split("-"),
        enctype = split[0],
        o = {name: split[1], type: consts.dataTypes[split[2]]};

      // check aggregate type
      for(var i in schema.aggr.enum){
        var a = schema.aggr.enum[i];
        if(o.name.indexOf(a+"_") == 0){
          o.name = o.name.substr(a.length+1);
          if (a=="count" && o.name.length === 0) o.name = "*";
          o.aggr = a;
          break;
        }
      }
      // check time fn
      for(var i in schema.timefns){
        var f = schema.timefns[i];
        if(o.name && o.name.indexOf(f+"_") == 0){
          o.name = o.name.substr(o.length+1);
          o.fn = f;
          break;
        }
      }

      // check bin
      if(o.name && o.name.indexOf("bin_") == 0){
        o.name = o.name.substr(4);
        o.bin = true;
      }

      m[enctype] = o;
      return m;
    }, {});

    return new Encoding(marktype, enc, cfg);
  }

  Encoding.fromSpec = function(spec, extraCfg) {
    var enc = util.duplicate(spec.enc);

    //convert type from string to bitcode (e.g, O=1)
    for(var e in enc){
      enc[e].type = consts.dataTypes[enc[e].type];
    }

    return new Encoding(spec.marktype, enc, util.merge(spec.cfg, extraCfg || {}));
  }

  return Encoding;

})();
