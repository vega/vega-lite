import {Spec} from '../schema/schema';
import {Bin} from '../schema/bin.schema';
import {FieldDef} from '../schema/fielddef.schema';

import {MAXBINS_DEFAULT} from '../bin';
import {COLUMN, ROW, X, Y, COLOR, DETAIL, Channel} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import * as vlFieldDef from '../fielddef';
import * as vlEncoding from '../encoding';
import {AREA, BAR} from '../marktype';
import * as schema from '../schema/schema';
import * as schemaUtil from '../schema/schemautil';
import {StackDef} from './stack';
import {getFullName} from '../type';
import * as util from '../util';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */

export class Model {
  _spec: Spec;
  _stack: StackDef;

  // TODO: include _stack, _layout, _style, etc.

  constructor(spec: Spec, theme?) {
    var defaults = schema.instantiate();
    this._spec = schemaUtil.merge(defaults, theme || {}, spec);
    this._stack = this.getStackDef();

    // convert short type to full type
    vlEncoding.forEach(this._spec.encoding, function(fieldDef) {
      if (fieldDef.type) {
        fieldDef.type = getFullName(fieldDef.type);
      }
    });

    // calculate stack
  }

  private getStackDef(): StackDef {
    var stack = (this.has(COLOR)) ? COLOR : (this.has(DETAIL)) ? DETAIL : null;

    if (stack &&
        (this.is(BAR) || this.is(AREA)) &&
        this.config('stack') !== false &&
        this.isAggregate()) {
      var isXMeasure = this.isMeasure(X);
      var isYMeasure = this.isMeasure(Y);

      if (isXMeasure && !isYMeasure) {
        return {
          groupbyChannel: Y,
          fieldChannel: X,
          stackChannel: stack,
          config: this.config('stack')
        };
      } else if (isYMeasure && !isXMeasure) {
        return {
          groupbyChannel: X,
          fieldChannel: Y,
          stackChannel: stack,
          config: this.config('stack')
        };
      }
    }
    return null;
  }

  stack(): StackDef {
    return this._stack;
  }

  toSpec(excludeConfig?, excludeData?) {
    var encoding = util.duplicate(this._spec.encoding),
      spec: any;

    spec = {
      marktype: this._spec.marktype,
      encoding: encoding
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._spec.config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._spec.data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schemaUtil.subtract(spec, defaults);
  }

  marktype() {
    return this._spec.marktype;
  }

  is(m) {
    return this._spec.marktype === m;
  }

  has(channel: Channel) {
    // equivalent to calling vlenc.has(this._spec.encoding, channel)
    return this._spec.encoding[channel].field !== undefined;
  }

  fieldDef(channel: Channel) {
    return this._spec.encoding[channel];
  }

  // get "field" reference for vega
  fieldRef(channel: Channel, opt?) {
    opt = opt || {};
    return vlFieldDef.fieldRef(this._spec.encoding[channel], opt);
  }

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEncoding.fields(this._spec.encoding);
  }

  fieldTitle(channel: Channel) {
    if (vlFieldDef.isCount(this._spec.encoding[channel])) {
      return vlFieldDef.COUNT_DISPLAYNAME;
    }
    var fn = this._spec.encoding[channel].aggregate || this._spec.encoding[channel].timeUnit || (this._spec.encoding[channel].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._spec.encoding[channel].field + ')';
    } else {
      return this._spec.encoding[channel].field;
    }
  }

  bandWidth(channel: Channel, useSmallBand?: boolean) {
    if (this.fieldDef(channel).scale.bandWidth !== undefined) {
      // explicit value
      return this.fieldDef(channel).scale.bandWidth;
    }

    // If not specified, draw value from config.

    useSmallBand = useSmallBand ||
    //isBandInSmallMultiples
    (channel === Y && this.has(ROW) && this.has(Y)) ||
    (channel === X && this.has(COLUMN) && this.has(X));

    return this.config(useSmallBand ? 'smallBandWidth' : 'largeBandWidth');
  }

  padding(channel: Channel) {
    if (this.fieldDef(channel).scale.padding !== undefined) {
      // explicit value
      return this.fieldDef(channel).scale.padding;
    }
    if (channel === ROW || channel === COLUMN) {
      return this.config('cellPadding');
    }
    return this.config('padding');
  }

  // returns false if binning is disabled, otherwise an object with binning properties
  bin(channel: Channel): Bin | boolean {
    var bin = this._spec.encoding[channel].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: MAXBINS_DEFAULT
      };
    return bin;
  }

  numberFormat = function(channel?: Channel) {
    // TODO(#497): have different number format based on numberType (discrete/continuous)
    return this.config('numberFormat');
  };

  map(f) {
    return vlEncoding.map(this._spec.encoding, f);
  }

  reduce(f, init) {
    return vlEncoding.reduce(this._spec.encoding, f, init);
  }

  forEach(f) {
    return vlEncoding.forEach(this._spec.encoding, f);
  }

  isTypes(channel: Channel, type: Array<any>) {
    var fieldDef = this.fieldDef(channel);
    return fieldDef && vlFieldDef.isTypes(fieldDef, type);
  }


  isOrdinalScale(channel: Channel) {
    return this.has(channel) &&
      vlFieldDef.isOrdinalScale(this.fieldDef(channel));
  }

  isDimension(channel: Channel) {
    return this.has(channel) &&
      vlFieldDef.isDimension(this.fieldDef(channel));
  }

  isMeasure(channel: Channel) {
    return this.has(channel) &&
      vlFieldDef.isMeasure(this.fieldDef(channel));
  }

  isAggregate() {
    return vlEncoding.isAggregate(this._spec.encoding);
  }

  dataTable() {
    return this.isAggregate() ? SUMMARY : SOURCE;
  }


  details() {
    var encoding = this;
    return this.reduce(function(refs, fieldDef: FieldDef, channel: Channel) {
      if (!fieldDef.aggregate && (channel !== X && channel !== Y)) {
        refs.push(encoding.fieldRef(channel));
      }
      return refs;
    }, []);
  }

  facets() {
    var encoding = this;
    return this.reduce(function(refs: string[], field: FieldDef, channel: Channel) {
      if (!field.aggregate && (channel === ROW || channel === COLUMN)) {
        refs.push(encoding.fieldRef(channel));
      }
      return refs;
    }, []);
  }

  cardinality(channel: Channel, stats) {
    return vlFieldDef.cardinality(this.fieldDef(channel), stats, this.config('filterNull'));
  }

  data() {
    return this._spec.data;
  }

  // returns whether the encoding has values embedded
  hasValues() {
    var vals = this.data().values;
    return vals && vals.length;
  }

  config(name: string) {
    return this._spec.config[name];
  }
}
