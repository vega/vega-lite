import {Spec} from '../schema/schema';
import {Axis, axis as axisSchema} from '../schema/axis.schema';
import {Legend, legend as legendSchema} from '../schema/legend.schema';
import {Encoding} from '../schema/encoding.schema';
import {FieldDef} from '../schema/fielddef.schema';
import {instantiate} from '../schema/schemautil';
import * as schema from '../schema/schema';
import * as schemaUtil from '../schema/schemautil';

import {COLUMN, ROW, X, Y, SIZE, TEXT, Channel, supportMark} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import * as vlFieldDef from '../fielddef';
import {FieldRefOption} from '../fielddef';
import * as vlEncoding from '../encoding';
import {Mark, BAR, TICK, TEXT as TEXTMARK} from '../mark';

import {getFullName, NOMINAL, ORDINAL, TEMPORAL} from '../type';
import {contains, duplicate, extend} from '../util';

import {compileMarkConfig} from './config';
import {compileLayout, Layout} from './layout';
import {compileStackProperties, StackProperties} from './stack';
import {type as scaleType} from './scale';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class Model {
  private _spec: Spec;
  private _stack: StackProperties;
  private _layout: Layout;

  constructor(spec: Spec) {
    var defaults = schema.instantiate();
    this._spec = schemaUtil.mergeDeep(defaults, spec);

    vlEncoding.forEach(this._spec.encoding, function(fieldDef: FieldDef, channel: Channel) {
      if (!supportMark(channel, this._spec.mark)) {
        // Drop unsupported channel

        // FIXME consolidate warning method
        console.warn(channel, 'dropped as it is incompatible with', this._spec.mark);
        delete this._spec.encoding[channel].field;
      }

      if (fieldDef.type) {
        // convert short type to full type
        fieldDef.type = getFullName(fieldDef.type);
      }

      // TODO instantiate bin here

      if (fieldDef.axis === true) {
        fieldDef.axis = instantiate(axisSchema);
      }

      if (fieldDef.legend === true) {
        fieldDef.legend = instantiate(legendSchema);
      }

      // set default padding for ROW and COLUMN
      if (channel === ROW && fieldDef.scale.padding === undefined) {
        fieldDef.scale.padding = this.has(Y) ? 16 : 0;
      }
      if (channel === COLUMN && fieldDef.scale.padding === undefined) {
        fieldDef.scale.padding = this.has(X) ? 16 : 0;
      }
    }, this);

    // calculate stack
    this._stack = compileStackProperties(this._spec);
    this._spec.config.mark = compileMarkConfig(this._spec, this._stack);
    this._layout = compileLayout(this);

  }

  public layout(): Layout {
    return this._layout;
  }

  public stack(): StackProperties {
    return this._stack;
  }

  public toSpec(excludeConfig?, excludeData?) {
    var encoding = duplicate(this._spec.encoding),
      spec: any;

    spec = {
      mark: this._spec.mark,
      encoding: encoding
    };

    if (!excludeConfig) {
      spec.config = duplicate(this._spec.config);
    }

    if (!excludeData) {
      spec.data = duplicate(this._spec.data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schemaUtil.subtract(spec, defaults);
  }

  public mark(): Mark {
    return this._spec.mark;
  }

  public spec(): Spec {
    return this._spec;
  }

  public is(mark: Mark) {
    return this._spec.mark === mark;
  }

  public has(channel: Channel) {
    return vlEncoding.has(this._spec.encoding, channel);
  }

  public fieldDef(channel: Channel): FieldDef {
    return this._spec.encoding[channel];
  }

  /** Get "field" reference for vega */
  public field(channel: Channel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);
    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: scaleType(fieldDef, channel, this.mark()) === 'ordinal' ? '_range' : '_start'
      }, opt);
    }
    return vlFieldDef.field(fieldDef, opt);
  }

  public fieldTitle(channel: Channel): string {
    return vlFieldDef.title(this._spec.encoding[channel]);
  }

  public channels(): Channel[] {
    return vlEncoding.channels(this._spec.encoding);
  }

  public map(f: (fd: FieldDef, c: Channel, e: Encoding) => any, t?: any) {
    return vlEncoding.map(this._spec.encoding, f, t);
  }

  public reduce(f: (acc: any, fd: FieldDef, c: Channel, e: Encoding) => any, init, t?: any) {
    return vlEncoding.reduce(this._spec.encoding, f, init, t);
  }

  public forEach(f: (fd: FieldDef, c: Channel, i:number) => void, t?: any) {
    vlEncoding.forEach(this._spec.encoding, f, t);
  }

  public isOrdinalScale(channel: Channel) {
    const fieldDef = this.fieldDef(channel);
    return fieldDef && (
      contains([NOMINAL, ORDINAL], fieldDef.type) ||
      ( fieldDef.type === TEMPORAL && scaleType(fieldDef, channel, this.mark()) === 'ordinal' )
      );
  }

  public isDimension(channel: Channel) {
    return vlFieldDef.isDimension(this.fieldDef(channel));
  }

  public isMeasure(channel: Channel) {
    return vlFieldDef.isMeasure(this.fieldDef(channel));
  }

  public isAggregate() {
    return vlEncoding.isAggregate(this._spec.encoding);
  }

  public isFacet() {
    return this.has(ROW) || this.has(COLUMN);
  }

  public dataTable() {
    return this.isAggregate() ? SUMMARY : SOURCE;
  }

  public data() {
    return this._spec.data;
  }

  public transform() {
    return this._spec.transform;
  }

  /** returns whether the encoding has values embedded */
  public hasValues() {
    var vals = this.data().values;
    return vals && vals.length;
  }

  /**
   * Get the spec configuration.
   */
  public config() {
    return this._spec.config;
  }

  public axis(channel: Channel): Axis {
    const axis = this.fieldDef(channel).axis;

    // This line should actually always return axis object since we already
    // replace boolean axis with properties.
    return typeof axis !== 'boolean' ? axis : {};
  }

  public legend(channel: Channel): Legend {
    const legend = this.fieldDef(channel).legend;

    // This line should actually always return legend object since we already
    // replace boolean legend with properties.
    return typeof legend !== 'boolean' ? legend : {};
  }

  /** returns scale name for a given channel */
  public scaleName(channel: Channel): string {
    const name = this.spec().name;
    return (name ? name + '-' : '') + channel;
  }

  public sizeValue(channel: Channel = SIZE) {
    const value = this.fieldDef(SIZE).value;
    if (value !== undefined) {
      return value;
    }
    switch (this.mark()) {
      case TEXTMARK:
        return 10; // font size 10 by default
      case BAR:
        // BAR's size is applied on either X or Y
        return !this.has(channel) || this.isOrdinalScale(channel) ?
          // For ordinal scale or single bar, we can use bandWidth - 1
          // (-1 so that the border of the bar falls on exact pixel)
          this.fieldDef(channel).scale.bandWidth - 1 :
          // otherwise, set to 2 by default
          2;
      case TICK:
        return this.fieldDef(channel).scale.bandWidth / 1.5;
    }
    return 30;
  }
}
