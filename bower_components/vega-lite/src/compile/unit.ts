import {AggregateOp} from '../aggregate';
import {Axis} from '../axis';
import {X, Y, X2, Y2, TEXT, PATH, ORDER, Channel, UNIT_CHANNELS,  UNIT_SCALE_CHANNELS, NONSPATIAL_SCALE_CHANNELS, supportMark} from '../channel';
import {defaultConfig, Config, CellConfig} from '../config';
import {SOURCE, SUMMARY} from '../data';
import {Encoding} from '../encoding';
import * as vlEncoding from '../encoding'; // TODO: remove
import {FieldDef, FieldRefOption, field} from '../fielddef';
import {Legend} from '../legend';
import {Mark, TEXT as TEXTMARK} from '../mark';
import {BANDSIZE_FIT, Scale, ScaleConfig, ScaleType} from '../scale';
import {ExtendedUnitSpec} from '../spec';
import {getFullName, QUANTITATIVE} from '../type';
import {duplicate, extend, mergeDeep, Dict} from '../util';
import {VgData} from '../vega.schema';

import {parseAxisComponent} from './axis';
import {applyConfig, FILL_STROKE_CONFIG} from './common';
import {initMarkConfig} from './config';
import {assembleData, parseUnitData} from './data/data';
import {parseLegendComponent} from './legend';
import {assembleLayout, parseUnitLayout} from './layout';
import {Model} from './model';
import {parseMark} from './mark/mark';
import {parseScaleComponent, scaleBandSize, scaleType} from './scale';
import {stack, StackProperties} from '../stack';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends Model {
  /**
   * Fixed width for the unit visualization.
   * If undefined (e.g., for ordinal scale), the width of the
   * visualization will be calculated dynamically.
   */
  private _width: number;

  /**
   * Fixed height for the unit visualization.
   * If undefined (e.g., for ordinal scale), the height of the
   * visualization will be calculated dynamically.
   */
  private _height: number;

  private _mark: Mark;
  private _encoding: Encoding;
  private _stack: StackProperties;

  constructor(spec: ExtendedUnitSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    // use top-level width / height or parent's top-level width / height
    const providedWidth = spec.width !== undefined ? spec.width :
      parent ? parent['width'] : undefined; // only exists if parent is layer
    const providedHeight = spec.height !== undefined ? spec.height :
      parent ? parent['height'] : undefined; // only exists if parent is layer

    const mark = this._mark = spec.mark;
    const encoding = this._encoding = this._initEncoding(mark, spec.encoding || {});
    const config = this._config = this._initConfig(spec.config, parent, mark, encoding);

    this._scale =  this._initScale(mark, encoding, config, providedWidth, providedHeight);
    this._axis = this._initAxis(encoding, config);
    this._legend = this._initLegend(encoding, config);

    // width / height
    this._initSize(mark, this._scale,
      providedWidth,
      providedHeight,
      config.cell, config.scale
    );

    // calculate stack properties
    this._stack = stack(mark, encoding, config);
  }

  private _initEncoding(mark: Mark, encoding: Encoding) {
    // clone to prevent side effect to the original spec
    encoding = duplicate(encoding);

    vlEncoding.forEach(encoding, function(fieldDef: FieldDef, channel: Channel) {
      if (!supportMark(channel, mark)) {
        // Drop unsupported channel

        // FIXME consolidate warning method
        console.warn(channel, 'dropped as it is incompatible with', mark);
        delete fieldDef.field;
        return;
      }

      if (fieldDef.type) {
        // convert short type to full type
        fieldDef.type = getFullName(fieldDef.type);
      }

      if ((channel === PATH || channel === ORDER) && !fieldDef.aggregate && fieldDef.type === QUANTITATIVE) {
        fieldDef.aggregate = AggregateOp.MIN;
      }
    });
    return encoding;
  }

  private _initConfig(specConfig: Config, parent: Model, mark: Mark, encoding: Encoding) {
    let config = mergeDeep(duplicate(defaultConfig), parent ? parent.config() : {}, specConfig);
    config.mark = initMarkConfig(mark, encoding, config);
    return config;
  }

  private _initScale(mark: Mark, encoding: Encoding, config: Config, topLevelWidth:number, topLevelHeight: number): Dict<Scale> {
    return UNIT_SCALE_CHANNELS.reduce(function(_scale, channel) {
      if (vlEncoding.has(encoding, channel) ||
          (channel === X && vlEncoding.has(encoding, X2)) ||
          (channel === Y && vlEncoding.has(encoding, Y2))
        ) {

        const channelDef = encoding[channel];
        const scaleSpec = (channelDef || {}).scale || {};
        const _scaleType = scaleType(scaleSpec, channelDef, channel, mark);

        var scale = _scale[channel] = extend({
          type: _scaleType,
          round: config.scale.round,
          padding: config.scale.padding,
          useRawDomain: config.scale.useRawDomain
        }, scaleSpec);

        // bandSize depends on top-level size (width/height) and scale type
        // If top-level size is specified, we override specified bandSize with "fit".
        scale.bandSize = scaleBandSize(scale.type, scale.bandSize, config.scale, channel === X ? topLevelWidth : topLevelHeight, mark, channel);
      }
      return _scale;
    }, {} as Dict<Scale>);
  }

  private _initSize(mark: Mark, scale: Dict<Scale>, width: number, height: number, cellConfig: CellConfig, scaleConfig: ScaleConfig) {
    if (width !== undefined) {
      this._width = width;
    } else if (scale[X]) {
      if (scale[X].type !== ScaleType.ORDINAL || scale[X].bandSize === BANDSIZE_FIT) {
        this._width = cellConfig.width;
      } // else: Do nothing, use dynamic width.
    } else { // No scale X
      if (mark === TEXTMARK) {
        // for text table without x/y scale we need wider bandSize
        this._width = scaleConfig.textBandWidth;
      } else {
        this._width = scaleConfig.bandSize;
      }
    }

    if (height !== undefined) {
      this._height = height;
    } else if (scale[Y]) {
      if (scale[Y].type !== ScaleType.ORDINAL || scale[Y].bandSize === BANDSIZE_FIT) {
        this._height = cellConfig.height;
      } // else: Do nothing, use dynamic height .
    } else {
      this._height = scaleConfig.bandSize;
    }
  }

  private _initAxis(encoding: Encoding, config: Config): Dict<Axis> {
    return [X, Y].reduce(function(_axis, channel) {
      // Position Axis
      if (vlEncoding.has(encoding, channel) ||
          (channel === X && vlEncoding.has(encoding, X2)) ||
          (channel === Y && vlEncoding.has(encoding, Y2))) {

        const axisSpec = (encoding[channel] || {}).axis;
        if (axisSpec !== false) {
          _axis[channel] = extend({},
            config.axis,
            axisSpec === true ? {} : axisSpec ||  {}
          );
        }
      }
      return _axis;
    }, {} as Dict<Axis>);
  }

  private _initLegend(encoding: Encoding, config: Config): Dict<Legend> {
    return NONSPATIAL_SCALE_CHANNELS.reduce(function(_legend, channel) {
      if (vlEncoding.has(encoding, channel)) {
        const legendSpec = encoding[channel].legend;
        if (legendSpec !== false) {
          _legend[channel] = extend({}, config.legend,
            legendSpec === true ? {} : legendSpec ||  {}
          );
        }
      }
      return _legend;
    }, {} as Dict<Legend>);
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public parseData() {
    this.component.data = parseUnitData(this);
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    this.component.layout = parseUnitLayout(this);
  }

  public parseScale() {
    this.component.scale = parseScaleComponent(this);
  }

  public parseMark() {
    this.component.mark = parseMark(this);
  }

  public parseAxis() {
    this.component.axis = parseAxisComponent(this, [X, Y]);
  }

  public parseAxisGroup() {
    return null;
  }

  public parseGridGroup() {
    return null;
  }

  public parseLegend() {
    this.component.legend = parseLegendComponent(this);
  }

  public assembleData(data: VgData[]): VgData[] {
    return assembleData(this, data);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    return assembleLayout(this, layoutData);
  }

  public assembleMarks() {
    return this.component.mark;
  }

  public assembleParentGroupProperties(cellConfig: CellConfig) {
    return applyConfig({}, cellConfig, FILL_STROKE_CONFIG.concat(['clip']));
  }

  public channels() {
    return UNIT_CHANNELS;
  }

  protected mapping() {
    return this.encoding();
  }

  public stack(): StackProperties {
    return this._stack;
  }

  public toSpec(excludeConfig?, excludeData?) {
    const encoding = duplicate(this._encoding);
    let spec: any;

    spec = {
      mark: this._mark,
      encoding: encoding
    };

    if (!excludeConfig) {
      spec.config = duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = duplicate(this._data);
    }

    // remove defaults
    return spec;
  }

  public mark(): Mark {
    return this._mark;
  }

  public has(channel: Channel) {
    return vlEncoding.has(this._encoding, channel);
  }

  public encoding() {
    return this._encoding;
  }

  public fieldDef(channel: Channel): FieldDef {
    // TODO: remove this || {}
    // Currently we have it to prevent null pointer exception.
    return this._encoding[channel] || {};
  }

  /** Get "field" reference for vega */
  public field(channel: Channel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);

    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: this.scale(channel).type === ScaleType.ORDINAL ? 'range' : 'start'
      }, opt);
    }

    return field(fieldDef, opt);
  }

  public dataTable() {
    return this.dataName(vlEncoding.isAggregate(this._encoding) ? SUMMARY : SOURCE);
  }

  public isUnit() {
    return true;
  }
}
