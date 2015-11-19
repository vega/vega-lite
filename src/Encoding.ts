import {Type, Shorthand, Table, MAXBINS_DEFAULT} from './consts';
import {COL, ROW, X, Y, COLOR, DETAIL} from './channel';
import * as util from './util';
import * as vlFieldDef from './fielddef';
import * as vlEnc from './enc';
import * as schema from './schema/schema';
import * as schemaUtil from './schema/schemautil';

export default class Encoding {
  _data: any;
  _marktype: string;
  _enc: any;
  _config: any;

  constructor(spec, theme?) {
    var defaults = schema.instantiate();
    var specExtended = schemaUtil.merge(defaults, theme || {}, spec);

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.encoding;
    this._config = specExtended.config;

    // convert short type to full type
    vlEnc.forEach(this._enc, function(fieldDef) {
      if (fieldDef.type) {
        fieldDef.type = Type.getFullName(fieldDef.type);
      }
    });
  }

  static fromShorthand(shorthand: string, data?, config?, theme?) {
    var c = Shorthand,
      split = shorthand.split(c.DELIM),
      marktype = split.shift().split(c.ASSIGN)[1].trim(),
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
    return 'mark' + Shorthand.ASSIGN + this._marktype +
      Shorthand.DELIM + vlEnc.shorthand(this._enc);
  }

  static shorthand(spec) {
    return 'mark' + Shorthand.ASSIGN + spec.marktype +
      Shorthand.DELIM + vlEnc.shorthand(spec.encoding);
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

  fieldDef(encType) {
    return this._enc[encType];
  }

  // get "field" reference for vega
  fieldRef(encType, opt?) {
    opt = opt || {};
    return vlFieldDef.fieldRef(this._enc[encType], opt);
  }

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEnc.fields(this._enc);
  }

  fieldTitle(et) {
    if (vlFieldDef.isCount(this._enc[et])) {
      return vlFieldDef.COUNT_DISPLAYNAME;
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
    if (this.fieldDef(encType).scale.bandWidth !== undefined) {
      // explicit value
      return this.fieldDef(encType).scale.bandWidth;
    }

    // If not specified, draw value from config.

    useSmallBand = useSmallBand ||
    //isBandInSmallMultiples
    (encType === Y && this.has(ROW) && this.has(Y)) ||
    (encType === X && this.has(COL) && this.has(X));

    return this.config(useSmallBand ? 'smallBandWidth' : 'largeBandWidth');
  }

  padding(encType) {
    if (this.fieldDef(encType).scale.padding !== undefined) {
      // explicit value
      return this.fieldDef(encType).scale.padding;
    }
    if (encType === ROW || encType === COL) {
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
    var fieldDef = this.fieldDef(et);
    return fieldDef && vlFieldDef.isTypes(fieldDef, type);
  }


  isOrdinalScale(encType) {
    return this.has(encType) &&
      vlFieldDef.isOrdinalScale(this.fieldDef(encType));
  }

  isDimension(encType) {
    return this.has(encType) &&
      vlFieldDef.isDimension(this.fieldDef(encType));
  }

  isMeasure(encType) {
    return this.has(encType) &&
      vlFieldDef.isMeasure(this.fieldDef(encType));
  }

  isAggregate() {
    return vlEnc.isAggregate(this._enc);
  }

  dataTable() {
    return this.isAggregate() ? Table.SUMMARY : Table.SOURCE;
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
    var stack = (this.has(COLOR) && this.fieldDef(COLOR).stack) ? COLOR :
      (this.has(DETAIL) && this.fieldDef(DETAIL).stack) ? DETAIL :
        null;

    var properties = stack && this.fieldDef(stack).stack !== true ?
      this.fieldDef(stack).stack :
      {};

    if ((this.is('bar') || this.is('area')) && stack && this.isAggregate()) {

      var isXMeasure = this.isMeasure(X);
      var isYMeasure = this.isMeasure(Y);

      if (isXMeasure && !isYMeasure) {
        return {
          groupby: Y,
          value: X,
          stack: stack,
          properties: properties
        };
      } else if (isYMeasure && !isXMeasure) {
        return {
          groupby: X,
          value: Y,
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
      if (!field.aggregate && (encType !== X && encType !== Y)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  }

  facets() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType == ROW || encType == COL)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  }

  cardinality(encType, stats) {
    return vlFieldDef.cardinality(this.fieldDef(encType), stats, this.config('filterNull'));
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
