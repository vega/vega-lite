import {Enctype, Type, Shorthand, Table, MAXBINS_DEFAULT} from './consts';
import * as util from './util';
import * as vlEncDef from './encdef';
import * as vlEnc from './enc';
import * as schema from './schema/schema';
import * as schemaUtil from './schema/schemautil';

export default class Encoding {
  _data: any;
  _marktype: string;  // TODO: replace with enum
  _enc: any;
  _config: any;

  constructor(spec, theme?) {
    var defaults = schema.instantiate();
    var specExtended = schemaUtil.merge(defaults, theme || {}, spec);

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.encoding;
    this._config = specExtended.config;
  }

  static fromShorthand(shorthand: string, data?, config?, theme?) {
    var c = Shorthand,
      split = shorthand.split(c.Delim),
      marktype = split.shift().split(c.Assign)[1].trim(),
      enc = vlEnc.fromShorthand(split);

    return new Encoding({
      data: data,
      marktype: marktype,
      encoding: enc,
      config: config
    }, theme);
  }

  static fromSpec(spec, theme?) {
    return new Encoding(spec, theme);
  }

  toShorthand() {
    return 'mark' + Shorthand.Assign + this._marktype +
      Shorthand.Delim + vlEnc.shorthand(this._enc);
  }

  static shorthand(spec) {
    return 'mark' + Shorthand.Assign + spec.marktype +
      Shorthand.Delim + vlEnc.shorthand(spec.encoding);
  }

  static specFromShorthand(shorthand: string, data, config, excludeConfig?) {
    return Encoding.fromShorthand(shorthand, data, config).toSpec(excludeConfig);
  }

  toSpec(excludeConfig?, excludeData?) {
    var enc = util.duplicate(this._enc),
      spec;

    spec = {
      marktype: this._marktype,
      encoding: enc
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schemaUtil.subtract(spec, defaults);
  }

  marktype() {
    return this._marktype;
  }

  is(m) {
    return this._marktype === m;
  }

  has(encType) {
    // equivalent to calling vlenc.has(this._enc, encType)
    return this._enc[encType].name !== undefined;
  }

  encDef(encType) {
    return this._enc[encType];
  }

  // get "field" reference for vega
  fieldRef(encType, opt?) {
    opt = opt || {};
    return vlEncDef.fieldRef(this._enc[encType], opt);
  }

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEnc.fields(this._enc);
  }

  fieldTitle(et) {
    if (vlEncDef.isCount(this._enc[et])) {
      return vlEncDef.COUNT_DISPLAYNAME;
    }
    var fn = this._enc[et].aggregate || this._enc[et].timeUnit || (this._enc[et].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[et].name + ')';
    } else {
      return this._enc[et].name;
    }
  }

  scale(et) {
    return this._enc[et].scale || {};
  }

  axis(et) {
    return this._enc[et].axis || {};
  }

  bandWidth(encType, useSmallBand?: boolean) {
    if (this.encDef(encType).scale.bandWidth !== undefined) {
      // explicit value
      return this.encDef(encType).scale.bandWidth;
    }

    // If not specified, draw value from config.

    useSmallBand = useSmallBand ||
    //isBandInSmallMultiples
    (encType === Enctype.Y && this.has(Enctype.ROW) && this.has(Enctype.Y)) ||
    (encType === Enctype.X && this.has(Enctype.COL) && this.has(Enctype.X));

    return this.config(useSmallBand ? 'smallBandWidth' : 'largeBandWidth');
  }

  padding(encType) {
    if (this.encDef(encType).scale.padding !== undefined) {
      // explicit value
      return this.encDef(encType).scale.padding;
    }
    if (encType === Enctype.ROW || encType === Enctype.COL) {
      return this.config('cellPadding');
    }
    return this.config('padding');
  }

  // returns false if binning is disabled, otherwise an object with binning properties
  bin(et) {
    var bin = this._enc[et].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: MAXBINS_DEFAULT
      };
    return bin;
  }

  value(et) {
    return this._enc[et].value;
  }

  numberFormat = function(name?) {
    // TODO(#497): have different number format based on numberType (discrete/continuous)
    return this.config('numberFormat');
  };

  map(f) {
    return vlEnc.map(this._enc, f);
  }

  reduce(f, init) {
    return vlEnc.reduce(this._enc, f, init);
  }

  forEach(f) {
    return vlEnc.forEach(this._enc, f);
  }

  isTypes(et: string, type: Array<any>) {
    var encDef = this.encDef(et);
    return encDef && vlEncDef.isTypes(encDef, type);
  }

  static isOrdinalScale(encoding, encType) {
    return vlEncDef.isOrdinalScale(encoding.encDef(encType));
  }

  static isDimension(encoding, encType) {
    return vlEncDef.isDimension(encoding.encDef(encType));
  }

  static isMeasure(encoding, encType) {
    return vlEncDef.isMeasure(encoding.encDef(encType));
  }

  isOrdinalScale(encType) {
    return this.has(encType) && Encoding.isOrdinalScale(this, encType);
  }

  isDimension(encType) {
    return this.has(encType) && Encoding.isDimension(this, encType);
  }

  isMeasure(encType) {
    return this.has(encType) && Encoding.isMeasure(this, encType);
  }

  isAggregate() {
    return vlEnc.isAggregate(this._enc);
  }

  dataTable() {
    return this.isAggregate() ? Table.SUMMARY : Table.SOURCE;
  }

  static isAggregate(spec) {
    return vlEnc.isAggregate(spec.encoding);
  }

  static alwaysNoOcclusion(spec) {
    // FIXME raw OxQ with # of rows = # of O
    return vlEnc.isAggregate(spec.encoding);
  }

  static isStack(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      !!spec.encoding.color;
  }

  /**
   * Check if the encoding should be stacked and return the stack dimenstion and value fields.
   * @return {Object} An object containing two properties:
   * - dimension - the dimension field
   * - value - the value field
   */
  stack() {
    var stack = (this.has(Enctype.COLOR) && this.encDef(Enctype.COLOR).stack) ? Enctype.COLOR :
      (this.has(Enctype.DETAIL) && this.encDef(Enctype.DETAIL).stack) ? Enctype.DETAIL :
        null;

    var properties = stack && this.encDef(stack).stack !== true ?
      this.encDef(stack).stack :
      {};

    if ((this.is('bar') || this.is('area')) && stack && this.isAggregate()) {

      var isXMeasure = this.isMeasure(Enctype.X);
      var isYMeasure = this.isMeasure(Enctype.Y);

      if (isXMeasure && !isYMeasure) {
        return {
          groupby: Enctype.Y,
          value: Enctype.X,
          stack: stack,
          properties: properties
        };
      } else if (isYMeasure && !isXMeasure) {
        return {
          groupby: Enctype.X,
          value: Enctype.Y,
          stack: stack,
          properties: properties
        };
      }
    }
    return null; // no stack encoding
  }

  details() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType !== Enctype.X && encType !== Enctype.Y)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  }

  facets() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType == Enctype.ROW || encType == Enctype.COL)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  }

  cardinality(encType, stats) {
    return vlEncDef.cardinality(this.encDef(encType), stats, this.config('filterNull'));
  }

  isRaw() {
    return !this.isAggregate();
  }

  data() {
    return this._data;
  }

  // returns whether the encoding has values embedded
  hasValues() {
    var vals = this.data().values;
    return vals && vals.length;
  }

  config(name) {
    return this._config[name];
  }

  static transpose(spec) {
    var oldenc = spec.encoding,
      enc = util.duplicate(spec.encoding);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.encoding = enc;
    return spec;
  }
}
