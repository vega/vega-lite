import {Axis} from '../axis';
import {Channel, NONSPATIAL_SCALE_CHANNELS, UNIT_CHANNELS, UNIT_SCALE_CHANNELS, X, X2, Y, Y2} from '../channel';
import {CellConfig, Config} from '../config';
import {Encoding, normalizeEncoding} from '../encoding';
import * as vlEncoding from '../encoding'; // TODO: remove
import {field, FieldDef, FieldRefOption, isFieldDef} from '../fielddef';
import {Legend} from '../legend';
import {FILL_STROKE_CONFIG, isMarkDef, Mark, MarkDef, TEXT as TEXT_MARK} from '../mark';
import {hasDiscreteDomain, Scale} from '../scale';
import {SelectionDef} from '../selection';
import {SortField, SortOrder} from '../sort';
import {UnitSize, UnitSpec} from '../spec';
import {stack, StackProperties} from '../stack';
import {Dict, duplicate, extend, vals} from '../util';
import {VgData, VgLayout, VgSignal} from '../vega.schema';
import {parseAxisComponent} from './axis/parse';
import {applyConfig} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {assembleLayoutUnitSignals} from './layout/index';
import {parseLegendComponent} from './legend/parse';
import {initEncoding, initMarkDef} from './mark/init';
import {parseMark} from './mark/mark';
import {Model, ModelWithField} from './model';
import {RepeaterValue, replaceRepeaterInEncoding} from './repeat';
import initScale from './scale/init';
import parseScaleComponent from './scale/parse';
import {assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals, parseUnitSelection} from './selection/selection';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends ModelWithField {
  /**
   * Fixed width for the unit visualization.
   * If undefined (e.g., for ordinal scale), the width of the
   * visualization will be calculated dynamically.
   */
  public readonly width: number;

  /**
   * Fixed height for the unit visualization.
   * If undefined (e.g., for ordinal scale), the height of the
   * visualization will be calculated dynamically.
   */
  public readonly height: number;

  public readonly markDef: MarkDef;
  public readonly encoding: Encoding<string>;

  protected scales: Dict<Scale> = {};

  public readonly stack: StackProperties;

  protected axes: Dict<Axis> = {};

  protected legends: Dict<Legend> = {};

  public readonly selection: Dict<SelectionDef> = {};
  public children: Model[] = [];

  constructor(spec: UnitSpec, parent: Model, parentGivenName: string,
    parentUnitSize: UnitSize = {}, repeater: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config);

    // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten
    this.initFacetCellConfig();

    // use top-level width / height or ancestor's width / height
    const providedWidth = spec.width || parentUnitSize.width;
    const providedHeight = spec.height || parentUnitSize.height;

    const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    const encoding = this.encoding = normalizeEncoding(replaceRepeaterInEncoding(spec.encoding || {}, repeater), mark);

    // calculate stack properties
    this.stack = stack(mark, encoding, this.config.stack);
    this.scales = this.initScales(mark, encoding, providedWidth, providedHeight);

    this.markDef = initMarkDef(spec.mark, encoding, this.scales, this.config);
    this.encoding = initEncoding(mark, encoding, this.stack, this.config);

    this.axes = this.initAxes(encoding);
    this.legends = this.initLegend(encoding);

    // Selections will be initialized upon parse.
    this.selection = spec.selection;

    // width / height
    const {width = this.width, height = this.height} = this.initSize(mark, this.scales,
      providedWidth,
      providedHeight
    );
    this.width = width;
    this.height = height;
  }

  public scale(channel: Channel) {
    return this.scales[channel];
  }

  public hasDiscreteDomain(channel: Channel) {
    const scale = this.scale(channel);
    return scale && hasDiscreteDomain(scale.type);
  }


  public sort(channel: Channel): SortField | SortOrder {
    return (this.getMapping()[channel] || {}).sort;
  }

  public axis(channel: Channel): Axis {
    return this.axes[channel];
  }

  public legend(channel: Channel): Legend {
    return this.legends[channel];
  }
  private initFacetCellConfig() {
    const config = this.config;
    let ancestor = this.parent;
    let hasFacetAncestor = false;
    while (ancestor !== null) {
      if (ancestor instanceof FacetModel) {
        hasFacetAncestor = true;
        break;
      }
      ancestor = ancestor.parent;
    }

    if (hasFacetAncestor) {
      config.cell = extend({}, config.cell, config.facet.cell);
    }
  }

  private initScales(mark: Mark, encoding: Encoding<string>, topLevelWidth:number, topLevelHeight: number): Dict<Scale> {
    const xyRangeSteps: number[] = [];

    return UNIT_SCALE_CHANNELS.reduce((scales, channel) => {
      if (vlEncoding.channelHasField(encoding, channel) ||
          (channel === X && vlEncoding.channelHasField(encoding, X2)) ||
          (channel === Y && vlEncoding.channelHasField(encoding, Y2))
        ) {
        const scale = scales[channel] = initScale(
          channel, encoding[channel], this.config, mark,
          channel === X ? topLevelWidth : channel === Y ? topLevelHeight : undefined,
          xyRangeSteps // for determine point / bar size
        );

        if (channel === X || channel === Y) {
          if (scale.rangeStep) {
            xyRangeSteps.push(scale.rangeStep);
          }
        }
      }
      return scales;
    }, {});
  }

  // TODO: consolidate this with scale?  Current scale range is in parseScale (later),
  // but not in initScale because scale range depends on size,
  // but size depends on scale type and rangeStep
  private initSize(mark: Mark, scale: Dict<Scale>, width: number, height: number) {
    const cellConfig = this.config.cell;
    const scaleConfig = this.config.scale;

    if (width === undefined) {
      if (scale[X]) {
        if (!hasDiscreteDomain(scale[X].type) || !scale[X].rangeStep) {
          width = cellConfig.width;
        } // else: Do nothing, use dynamic width.
      } else { // No scale X
        if (mark === TEXT_MARK) {
          // for text table without x/y scale we need wider rangeStep
          width = scaleConfig.textXRangeStep;
        } else {
          if (typeof scaleConfig.rangeStep === 'string') {
            throw new Error('_initSize does not handle string rangeSteps');
          }
          width = scaleConfig.rangeStep;
        }
      }
    }

    if (height === undefined) {
      if (scale[Y]) {
        if (!hasDiscreteDomain(scale[Y].type) || !scale[Y].rangeStep) {
          height = cellConfig.height;
        } // else: Do nothing, use dynamic height .
      } else {
        if (typeof scaleConfig.rangeStep === 'string') {
          throw new Error('_initSize does not handle string rangeSteps');
        }
        height = scaleConfig.rangeStep;
      }
    }

    return {width, height};
  }

  private initAxes(encoding: Encoding<string>): Dict<Axis> {
    return [X, Y].reduce(function(_axis, channel) {
      // Position Axis

      const channelDef = encoding[channel];
      if (isFieldDef(channelDef) ||
          (channel === X && isFieldDef(encoding.x2)) ||
          (channel === Y && isFieldDef(encoding.y2))) {

        const axisSpec = isFieldDef(channelDef) ? channelDef.axis : null;

        // We no longer support false in the schema, but we keep false here for backward compatability.
        if (axisSpec !== null && axisSpec !== false) {
          _axis[channel] = {
            ...axisSpec
          };
        }
      }
      return _axis;
    }, {});
  }

  private initLegend(encoding: Encoding<string>): Dict<Legend> {
    return NONSPATIAL_SCALE_CHANNELS.reduce(function(_legend, channel) {
      const channelDef = encoding[channel];
      if (isFieldDef(channelDef)) {
        const legendSpec = channelDef.legend;
        if (legendSpec !== null && legendSpec !== false) {
          _legend[channel] = {...legendSpec};
        }
      }
      return _legend;
    }, {});
  }

  public parseData() {
    this.component.data = parseData(this);
  }

  public parseSelection() {
    this.component.selection = parseUnitSelection(this, this.selection);
  }

  public parseScale() {
    this.component.scales = parseScaleComponent(this);
  }

  public parseMark() {
    this.component.mark = parseMark(this);
  }

  public parseAxisAndHeader() {
    this.component.axes = parseAxisComponent(this, [X, Y]);
  }

  public parseLegend() {
    this.component.legends = parseLegendComponent(this);
  }

  public assembleData(): VgData[] {
     if (!this.parent) {
      // only assemble data in the root
      return assembleData(vals(this.component.data.sources));
    }
    return [];
  }

  public assembleSelectionTopLevelSignals(signals: any[]): VgSignal[] {
    return assembleTopLevelSignals(this, signals);
  }

  public assembleSelectionSignals(): VgSignal[] {
    return assembleUnitSelectionSignals(this, []);
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return assembleUnitSelectionData(this, data);
  }

  public assembleLayout(): VgLayout {
    return null;
  }

  public assembleLayoutSignals(): VgSignal[] {
    return assembleLayoutUnitSignals(this);
  }

  public assembleMarks() {
    let marks = this.component.mark || [];

    // If this unit is part of a layer, selections should augment
    // all in concert rather than each unit individually. This
    // ensures correct interleaving of clipping and brushed marks.
    if (!this.parent || !(this.parent instanceof LayerModel)) {
      marks = assembleUnitSelectionMarks(this, marks);
    }

    return marks.map(this.correctDataNames);
  }

  public assembleParentGroupProperties() {
    return {
      width: this.getSizeSignalRef('width'),
      height: this.getSizeSignalRef('height'),
      ...applyConfig({}, this.config.cell, FILL_STROKE_CONFIG.concat(['clip']))
    };
  }

  public channels() {
    return UNIT_CHANNELS;
  }

  protected getMapping() {
    return this.encoding;
  }

  public toSpec(excludeConfig?: any, excludeData?: any) {
    const encoding = duplicate(this.encoding);
    let spec: any;

    spec = {
      mark: this.markDef,
      encoding: encoding
    };

    if (!excludeConfig) {
      spec.config = duplicate(this.config);
    }

    if (!excludeData) {
      spec.data = duplicate(this.data);
    }

    // remove defaults
    return spec;
  }

  public mark(): Mark {
    return this.markDef.type;
  }

  public channelHasField(channel: Channel) {
    return vlEncoding.channelHasField(this.encoding, channel);
  }

  public fieldDef(channel: Channel): FieldDef<string> {
    // TODO: remove this || {}
    // Currently we have it to prevent null pointer exception.
    return this.encoding[channel] || {};
  }

  /** Get "field" reference for vega */
  public field(channel: Channel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);

    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: hasDiscreteDomain(this.scale(channel).type) ? 'range' : 'start'
      }, opt);
    }

    return field(fieldDef, opt);
  }
}
