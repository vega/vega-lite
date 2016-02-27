import {Spec} from '../spec';
import {AxisProperties} from '../axis';
import {LegendProperties} from '../legend';
import {Scale} from '../scale';
import {Encoding} from '../encoding';
import {FieldDef} from '../fielddef';
import {defaultConfig, Config} from '../config';

import {COLUMN, ROW, X, Y, COLOR, SHAPE, SIZE, TEXT, PATH, ORDER, Channel, supportMark} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import {FieldRefOption, field} from '../fielddef';
import * as vlEncoding from '../encoding';
import {Mark, TEXT as TEXTMARK} from '../mark';

import {getFullName, QUANTITATIVE} from '../type';
import {duplicate, extend, contains, mergeDeep} from '../util';

import {compileMarkConfig} from './config';
import {compileStackProperties, StackProperties} from './stack';
import {scaleType} from './scale';
import {ScaleType} from '../scale';
import {AggregateOp} from '../aggregate';
import {CHANNELS} from '../channel';

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
            includeRawDomain: config.scale.includeRawDomain,
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

    return field(fieldDef, opt);
  }

  public channelWithScales(): Channel[] {
    const model = this;
    return CHANNELS.filter(function(channel) {
      return !!model.scale(channel);
    });
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

  public isFacet() {
    return this.has(ROW) || this.has(COLUMN);
  }

  public dataTable() {
    return vlEncoding.isAggregate(this._spec.encoding) ? SUMMARY : SOURCE;
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
  public scaleName(channel: Channel|string): string {
    const name = this.spec().name;
    return (name ? name + '-' : '') + channel;
  }
}
