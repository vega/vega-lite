import {Spec} from '../schema/schema';
import {AxisProperties} from '../schema/axis.schema';
import {LegendProperties} from '../schema/legend.schema';
import {Scale} from '../schema/scale.schema';
import {Encoding} from '../schema/encoding.schema';
import {FieldDef} from '../schema/fielddef.schema';
import {defaultConfig, Config} from '../schema/config.schema';

import {COLUMN, ROW, X, Y, COLOR, SHAPE, SIZE, TEXT, PATH, ORDER, Channel, supportMark} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import * as vlFieldDef from '../fielddef';
import {FieldRefOption} from '../fielddef';
import * as vlEncoding from '../encoding';
import {Mark, BAR, TICK, TEXT as TEXTMARK} from '../mark';

import {getFullName, QUANTITATIVE} from '../type';
import {duplicate, extend, contains, mergeDeep} from '../util';

import {compileMarkConfig} from './config';
import {compileStackProperties, StackProperties} from './stack';
import {scaleType} from './scale';
import {ScaleType} from '../enums';
import {AggregateOp} from '../aggregate';

export interface ScaleMap {
  x?: Scale;
  y?: Scale;
  row?: Scale;
  column?: Scale;
  color?: Scale;
  size?: Scale;
  shape?: Scale;
};

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class Model {
  private _spec: Spec;
  private _stack: StackProperties;

  private _scale: ScaleMap;

  private _axis: {
    x?: AxisProperties;
    y?: AxisProperties;
    row?: AxisProperties;
    column?: AxisProperties;
  };

  private _legend: {
    color?: LegendProperties;
    size?: LegendProperties;
    shape?: LegendProperties;
  };

  private _config: Config;

  constructor(spec: Spec) {
    const model = this; // For self-reference in children method.

    this._spec = spec;

    const mark = this._spec.mark;

    // TODO: remove this || {}
    // Currently we have it to prevent null pointer exception.
    const encoding = this._spec.encoding = this._spec.encoding || {};
    const config = this._config = mergeDeep(duplicate(defaultConfig), spec.config);

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

      if ((channel === PATH || channel === ORDER) && !fieldDef.aggregate && fieldDef.type === QUANTITATIVE) {
        fieldDef.aggregate = AggregateOp.MIN;
      }
    }, this);

    // Initialize Scale

    const scale = this._scale = [X, Y, COLOR, SHAPE, SIZE, ROW, COLUMN].reduce(function(_scale, channel) {
      // Position Axis
      if (vlEncoding.has(encoding, channel)) {
        const channelScale = encoding[channel].scale || {};
        const channelDef = encoding[channel];

        const _scaleType = scaleType(channelScale, channelDef, channel, mark);

        if (contains([ROW, COLUMN], channel)) {
            _scale[channel] = extend({
              type: _scaleType,
              round: config.facet.scale.round,
              padding: (channel === ROW && model.has(Y)) || (channel === COLUMN && model.has(X)) ?
                       config.facet.scale.padding : 0
            }, channelScale);
        } else {
          _scale[channel] = extend({
            type: _scaleType,
            round: config.scale.round,
            padding: config.scale.padding,
            useRawDomain: config.scale.useRawDomain,
            bandSize: channel === X && _scaleType === ScaleType.ORDINAL && mark === TEXTMARK ?
                       config.scale.textBandWidth : config.scale.bandSize
          }, channelScale);
        }
      }
      return _scale;
    }, {});

    // Initialize Axis
    this._axis = [X, Y, ROW, COLUMN].reduce(function(_axis, channel) {
      // Position Axis
      if (vlEncoding.has(encoding, channel)) {
        const channelAxis = encoding[channel].axis;
        if (channelAxis !== false) {
          _axis[channel] = extend({},
            channel === X || channel === Y ? config.axis : config.facet.axis,
            channelAxis === true ? {} : channelAxis ||  {}
          );
        }
      }
      return _axis;
    }, {});

    // initialize legend
    this._legend = [COLOR, SHAPE, SIZE].reduce(function(_legend, channel) {
      if (vlEncoding.has(encoding, channel)) {
        const channelLegend = encoding[channel].legend;
        if (channelLegend !== false) {
          _legend[channel] = extend({}, config.legend,
            channelLegend === true ? {} : channelLegend ||  {}
          );
        }
      }
      return _legend;
    }, {});

    // calculate stack
    this._stack = compileStackProperties(mark, encoding, scale, config);
    this._config.mark = compileMarkConfig(mark, encoding, config, this._stack);
  }

  public stack(): StackProperties {
    return this._stack;
  }

  public toSpec(excludeConfig?, excludeData?) {
    const encoding = duplicate(this._spec.encoding);
    let spec: any;

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
    return spec;
  }

  public cellWidth(): number {
    return (this.isFacet() ? this.config().facet.cell.width : null) ||
      this.config().cell.width;
  }

  public cellHeight(): number {
    return (this.isFacet() ? this.config().facet.cell.height : null) ||
      this.config().cell.height;
  }

  public mark(): Mark {
    return this._spec.mark;
  }

  // TODO: remove
  public spec(): Spec {
    return this._spec;
  }

  public is(mark: Mark) {
    return this._spec.mark === mark;
  }

  public has(channel: Channel) {
    return vlEncoding.has(this._spec.encoding, channel);
  }

  public encoding() {
    return this._spec.encoding;
  }

  public fieldDef(channel: Channel): FieldDef {
    // TODO: remove this || {}
    // Currently we have it to prevent null pointer exception.
    return this._spec.encoding[channel] || {};
  }

  /** Get "field" reference for vega */
  public field(channel: Channel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);
    const scale = this.scale(channel);

    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: scaleType(scale, fieldDef, channel, this.mark()) === ScaleType.ORDINAL ? '_range' : '_start'
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
    const scale = this.scale(channel);

    return this.has(channel) && scaleType(scale, fieldDef, channel, this.mark()) === ScaleType.ORDINAL;
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
    return this._spec.transform || {};
  }

  /**
   * Get the spec configuration.
   */
  public config() {
    return this._config;
  }

  public sort(channel: Channel) {
    return this._spec.encoding[channel].sort;
  }

  public scale(channel: Channel): Scale {
    return this._scale[channel];
  }

  public axis(channel: Channel): AxisProperties {
    return this._axis[channel];
  }

  public legend(channel: Channel): LegendProperties {
    return this._legend[channel];
  }

  /** returns scale name for a given channel */
  public scaleName(channel: Channel): string {
    const name = this.spec().name;
    return (name ? name + '-' : '') + channel;
  }

  public sizeValue(channel: Channel = SIZE) {
    const fieldDef = this.fieldDef(SIZE);
    if (fieldDef && fieldDef.value !== undefined) {
       return fieldDef.value;
    }

    const scaleConfig = this.config().scale;

    switch (this.mark()) {
      case TEXTMARK:
        return this.config().mark.fontSize; // font size 10 by default
      case BAR:
        if (this.config().mark.barSize) {
          return this.config().mark.barSize;
        }
        // BAR's size is applied on either X or Y
        return this.isOrdinalScale(channel) ?
            // For ordinal scale or single bar, we can use bandSize - 1
            // (-1 so that the border of the bar falls on exact pixel)
            this.scale(channel).bandSize - 1 :
          !this.has(channel) ?
            scaleConfig.bandSize - 1 :
            // otherwise, set to thinBarWidth by default
            this.config().mark.barThinSize;
      case TICK:
        if (this.config().mark.tickSize) {
          return this.config().mark.tickSize;
        }
        const bandSize = this.has(channel) ?
          this.scale(channel).bandSize :
          scaleConfig.bandSize;
        return bandSize / 1.5;
    }
    return this.config().mark.size;
  }
}
