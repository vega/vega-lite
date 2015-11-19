import {MAXBINS_DEFAULT} from '../consts';
import {COL, ROW, X, Y, COLOR, DETAIL} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import * as util from '../util';
import * as vlFieldDef from '../fielddef';
import * as vlEnc from '../enc';
import * as schema from '../schema/schema';
import * as schemaUtil from '../schema/schemautil';
import {getFullName} from '../type';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */

export class Model {
  _data: any;
  _marktype: string;
  _enc: any;
  _config: any;

  // TODO: include _stack, _layout, _style, etc.

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
        fieldDef.type = getFullName(fieldDef.type);
      }
    });
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

  has(channel) {
    // equivalent to calling vlenc.has(this._enc, channel)
    return this._enc[channel].name !== undefined;
  }

  fieldDef(channel) {
    return this._enc[channel];
  }

  // get "field" reference for vega
  fieldRef(channel, opt?) {
    opt = opt || {};
    return vlFieldDef.fieldRef(this._enc[channel], opt);
  }

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEnc.fields(this._enc);
  }

  fieldTitle(channel) {
    if (vlFieldDef.isCount(this._enc[channel])) {
      return vlFieldDef.COUNT_DISPLAYNAME;
    }
    var fn = this._enc[channel].aggregate || this._enc[channel].timeUnit || (this._enc[channel].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[channel].name + ')';
    } else {
      return this._enc[channel].name;
    }
  }

  scale(channel) {
    return this._enc[channel].scale || {};
  }

  axis(channel) {
    return this._enc[channel].axis || {};
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
    var bin = this._enc[channel].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: MAXBINS_DEFAULT
      };
    return bin;
  }

  value(channel) {
    return this._enc[channel].value;
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
    return vlEnc.isAggregate(this._enc);
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
