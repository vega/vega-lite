import {AggregateOp} from '../aggregate';
import {AxisProperties} from '../axis';
import {X, Y, TEXT, PATH, ORDER, Channel, UNIT_CHANNELS,  UNIT_SCALE_CHANNELS, NONSPATIAL_SCALE_CHANNELS, supportMark} from '../channel';
import {defaultConfig, Config, CellConfig} from '../config';
import {SOURCE, SUMMARY} from '../data';
import {Encoding} from '../encoding';
import * as vlEncoding from '../encoding'; // TODO: remove
import {FieldDef} from '../fielddef';
import {LegendProperties} from '../legend';
import {Mark, TEXT as TEXTMARK} from '../mark';
import {Scale, ScaleType} from '../scale';
import {ExtendedUnitSpec} from '../spec';
import {getFullName, QUANTITATIVE} from '../type';
import {duplicate, extend, mergeDeep, Dict, isArray, array} from '../util';
import {VgData} from '../vega.schema';
import {isRepeatRef} from '../fielddef';

import {parseAxisComponent} from './axis';
import {applyConfig, FILL_STROKE_CONFIG} from './common';
import {initMarkConfig} from './config';
import {assembleData, parseUnitData} from './data/data';
import {parseLegendComponent} from './legend';
import {assembleLayout, parseUnitLayout} from './layout';
import {Model} from './model';
import {parseMark} from './mark/mark';
import {parseScaleComponent, scaleType} from './scale';
import {compileStackProperties, StackProperties} from './stack';
import {RepeatValues} from './repeat';

import * as selections from './selections';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends Model {

  private _mark: Mark;
  private _encoding: Encoding;
  private _stack: StackProperties;
  private _select: any;
  private _selections: selections.Selection[];

  constructor(spec: ExtendedUnitSpec, parent: Model, parentGivenName: string, repeatValues: RepeatValues) {
    super(spec, parent, parentGivenName, repeatValues);

    const mark = this._mark = spec.mark;
    const encoding = this._encoding = this._initEncoding(mark, spec.encoding || {});
    const config = this._config = this._initConfig(spec.config, parent, mark, encoding);

    const scale = this._scale =  this._initScale(mark, encoding, config);
    this._axis = this._initAxis(encoding, config);
    this._legend = this._initLegend(encoding, config);

    // calculate stack
    this._stack = compileStackProperties(mark, encoding, scale, config);

    this._select = duplicate(spec.select || {});
    this.parseSelection();
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

  private _initScale(mark: Mark, encoding: Encoding, config: Config): Dict<Scale> {
    var model = this;
    return UNIT_SCALE_CHANNELS.reduce(function(_scale, channel) {
      if (vlEncoding.has(encoding, channel)) {
        const fieldDef = model.fieldDef(channel),
              scaleSpec = (fieldDef as any).scale || {};

        const _scaleType = scaleType(scaleSpec, fieldDef, channel, mark);

        _scale[channel] = extend({
          type: _scaleType,
          round: config.scale.round,
          padding: config.scale.padding,
          includeRawDomain: config.scale.includeRawDomain,
          bandSize: channel === X && _scaleType === ScaleType.ORDINAL && mark === TEXTMARK ?
                     config.scale.textBandWidth : config.scale.bandSize
        }, scaleSpec);
      }
      return _scale;
    }, {} as Dict<Scale>);
  }

  private _initAxis(encoding: Encoding, config: Config): Dict<AxisProperties> {
    return [X, Y].reduce(function(_axis, channel) {
      // Position Axis
      if (vlEncoding.has(encoding, channel)) {
        const axisSpec = encoding[channel].axis;
        if (axisSpec !== false) {
          _axis[channel] = extend({},
            config.axis,
            axisSpec === true ? {} : axisSpec ||  {}
          );
        }
      }
      return _axis;
    }, {} as Dict<AxisProperties>);
  }

  private _initLegend(encoding: Encoding, config: Config): Dict<LegendProperties> {
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
    }, {} as Dict<LegendProperties>);
  }

  public parseSelection() {
    this.component.selection = selections.parse(this, this._select);
  }

  public parseData() {
    this.component.data = parseUnitData(this);
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

  public assembleSelectionData(data: VgData[]): VgData[] {
    return selections.assembleUnitData(this, data);
  }

  public assembleSignals(signals) {
    return selections.assembleUnitSignals(this, signals);
  }

  public assembleMarks() {
    return selections.assembleMarks(this, this.component.mark);
  }

  public assembleParentGroupProperties(cellConfig: CellConfig) {
    var props = applyConfig({}, cellConfig, FILL_STROKE_CONFIG.concat(['clip']));
    return extend(props, {
      unitName: { value: this.name() }
    });
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

  public isRepeatRef(channel: Channel) {
    if (channel in this._encoding) {
      const field = this._encoding[channel].field;
      return isRepeatRef(field);
    }
    return false;
  }

  public fieldDef(channel: Channel): FieldDef {
    // TODO: remove this || {}
    // Currently we have it to prevent null pointer exception.
    let fieldDef = this._encoding[channel] || {};
    if (isArray(fieldDef)) fieldDef = fieldDef[0];  // HACK for InfoVis!

    // replace references to repeated value
    if (fieldDef) {
      const field = fieldDef.field;
      if (isRepeatRef(field)) {
        fieldDef = duplicate(fieldDef);
        fieldDef.field = this.repeatValue(field.repeat);
      }
    }
    return fieldDef;
  }

  public fieldDefs(channel: Channel): FieldDef[] {
    var fieldDefs = this._encoding[channel] || {};
    return array(fieldDefs).map((fieldDef) => {
      const field = fieldDef.field;
      if (isRepeatRef(field)) {
        fieldDef = duplicate(fieldDef);
        fieldDef.field = this.repeatValue(field.repeat);
      }

      return fieldDef;
    });
  }

  public selection(name?: string) {
    return (this._select && this._select[name]) || this.component.selection || [];
  }

  public dataTable() {
    return this.dataName(vlEncoding.isAggregate(this._encoding) ? SUMMARY : SOURCE);
  }

  public isUnit() {
    return true;
  }
}
