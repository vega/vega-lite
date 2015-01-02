module.exports = (function() {

  function Encoding(marktype, enc, config) {
    this._marktype = marktype;
    this._enc = enc; // {encType1:field1, ...}

    this._cfg = vl.merge(Object.create(vl.DEFAULTS), config);
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

  proto.scale = function(x){
    return this._enc[x].scale || {};
  }

  proto.aggr = function(x){
    return this._enc[x].aggr;
  }

  proto.bin = function(x){
    return this._enc[x].bin;
  }

  proto.fn = function(x){
    return this._enc[x].fn;
  }

  proto.any = function(f){
    return vl.any(this._enc, f);
  }

  proto.all = function(f){
    return vl.all(this._enc, f);
  }

  proto.length = function(){
    return vl.keys(this._enc).length;
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

  proto.toJSON = function(space, excludeConfig){
    var enc = vl.duplicate(this._enc), json;

    // convert type's bitcode to type name
    for(var e in enc){
      enc[e].type = vl.dataTypeNames[enc[e].type];
    }

    json = {
      marktype: this._marktype,
      enc: enc
    }

    if(!excludeConfig){
      json.cfg = vl.duplicate(this._cfg)
    }

    return json;
  };

  proto.toShorthand = function(){
    var enc = this._enc;
    return this._marktype + "." + vl.keys(enc).map(function(e){
      var v = enc[e];
        return e + "-" +
          (v.aggr ? v.aggr+"_" : "") +
          (v.fn ? v.fn+"_" : "") +
          (v.bin ? "bin_" : "") +
          (v.name || "") + "-" +
          vl.dataTypeNames[v.type];
      }
    ).join(".");
  }

  Encoding.parseShorthand = function(shorthand, cfg){
    var enc = shorthand.split("."),
      marktype = enc.shift();

    enc = enc.reduce(function(m, e){
      var split = e.split("-"),
        enctype = split[0],
        o = {name: split[1], type: vl.dataTypes[split[2]]};

      // check aggregate type
      for(var i in vl.quantAggTypes){
        var a = vl.quantAggTypes[i];
        if(o.name.indexOf(a+"_") == 0){
          o.name = o.name.substr(a.length+1);
          if (a=="count" && o.name.length === 0) o.name = "*";
          o.aggr = a;
          break;
        }
      }
      // check time fn
      for(var i in vl.timeFuncs){
        var f = vl.timeFuncs[i];
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

  Encoding.parseJSON = function(json, extraCfg) {
    var enc = vl.duplicate(json.enc);

    //convert type from string to bitcode (e.g, O=1)
    for(var e in enc){
      enc[e].type = vl.dataTypes[enc[e].type];
    }

    return new Encoding(json.marktype, enc, vl.merge(json.cfg, extraCfg || {}));
  }

  return Encoding;

})();