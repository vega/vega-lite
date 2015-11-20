import {MAXBINS_DEFAULT} from '../bin';
import {COL, ROW, X, Y, COLOR, DETAIL} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import * as util from '../util';
import * as vlFieldDef from '../fielddef';
import * as vlEncoding from '../encoding';
import * as schema from '../schema/schema';
import * as schemaUtil from '../schema/schemautil';
import {getFullName} from '../type';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */

export class Model {
  _data: any;
  _marktype: string;
  _encoding: any;
  _config: any;

  // TODO: include _stack, _layout, _style, etc.

  constructor(spec, theme?) {
    var defaults = schema.instantiate();
    var specExtended = schemaUtil.merge(defaults, theme || {}, spec);

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._encoding = specExtended.encoding;
    this._config = specExtended.config;

    // convert short type to full type
    vlEncoding.forEach(this._encoding, function(fieldDef) {
      if (fieldDef.type) {
        fieldDef.type = getFullName(fieldDef.type);
      }
    });
  }

  toSpec(excludeConfig?, excludeData?) {
    var encoding = util.duplicate(this._encoding),
      spec;

    spec = {
      marktype: this._marktype,
      encoding: encoding
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

  has(channel) {
    // equivalent to calling vlenc.has(this._enc, channel)
    return this._encoding[channel].name !== undefined;
  }

  fieldDef(channel) {
    return this._encoding[channel];
  }

  // get "field" reference for vega
  fieldRef(channel, opt?) {
    opt = opt || {};
    return vlFieldDef.fieldRef(this._encoding[channel], opt);
  }

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEncoding.fields(this._encoding);
  }

  fieldTitle(channel) {
    if (vlFieldDef.isCount(this._encoding[channel])) {
      return vlFieldDef.COUNT_DISPLAYNAME;
    }
    var fn = this._encoding[channel].aggregate || this._encoding[channel].timeUnit || (this._encoding[channel].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._encoding[channel].name + ')';
    } else {
      return this._encoding[channel].name;
    }
  }

  scale(channel) {
    return this._encoding[channel].scale || {};
  }

  axis(channel) {
    return this._encoding[channel].axis || {};
  }

  bandWidth(channel, useSmallBand?: boolean) {
    if (this.fieldDef(channel).scale.bandWidth !== undefined) {
      // explicit value
      return this.fieldDef(channel).scale.bandWidth;
    }

    // If not specified, draw value from config.

    useSmallBand = useSmallBand ||
    //isBandInSmallMultiples
    (channel === Y && this.has(ROW) && this.has(Y)) ||
    (channel === X && this.has(COL) && this.has(X));

    return this.config(useSmallBand ? 'smallBandWidth' : 'largeBandWidth');
  }

  padding(channel) {
    if (this.fieldDef(channel).scale.padding !== undefined) {
      // explicit value
      return this.fieldDef(channel).scale.padding;
    }
    if (channel === ROW || channel === COL) {
      return this.config('cellPadding');
    }
    return this.config('padding');
  }

  // returns false if binning is disabled, otherwise an object with binning properties
  bin(channel) {
    var bin = this._encoding[channel].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: MAXBINS_DEFAULT
      };
    return bin;
  }

  value(channel) {
    return this._encoding[channel].value;
  }

  numberFormat = function(name?) {
    // TODO(#497): have different number format based on numberType (discrete/continuous)
    return this.config('numberFormat');
  };

  map(f) {
    return vlEncoding.map(this._encoding, f);
  }

  reduce(f, init) {
    return vlEncoding.reduce(this._encoding, f, init);
  }

  forEach(f) {
    return vlEncoding.forEach(this._encoding, f);
  }

  isTypes(channel: string, type: Array<any>) {
    var fieldDef = this.fieldDef(channel);
    return fieldDef && vlFieldDef.isTypes(fieldDef, type);
  }


  isOrdinalScale(channel) {
    return this.has(channel) &&
      vlFieldDef.isOrdinalScale(this.fieldDef(channel));
  }

  isDimension(channel) {
    return this.has(channel) &&
      vlFieldDef.isDimension(this.fieldDef(channel));
  }

  isMeasure(channel) {
    return this.has(channel) &&
      vlFieldDef.isMeasure(this.fieldDef(channel));
  }

  isAggregate() {
    return vlEncoding.isAggregate(this._encoding);
  }

  dataTable() {
    return this.isAggregate() ? SUMMARY : SOURCE;
  }

  // TODO: calculate this and store it in this._stack so it can be called multiple times.
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
    return this.reduce(function(refs, field, channel) {
      if (!field.aggregate && (channel !== X && channel !== Y)) {
        refs.push(encoding.fieldRef(channel));
      }
      return refs;
    }, []);
  }

  facets() {
    var encoding = this;
    return this.reduce(function(refs, field, channel) {
      if (!field.aggregate && (channel === ROW || channel === COL)) {
        refs.push(encoding.fieldRef(channel));
      }
      return refs;
    }, []);
  }

  cardinality(channel, stats) {
    return vlFieldDef.cardinality(this.fieldDef(channel), stats, this.config('filterNull'));
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
}
