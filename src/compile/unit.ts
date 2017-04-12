import {Axis} from '../axis';
import {Channel, NONSPATIAL_SCALE_CHANNELS, UNIT_CHANNELS, UNIT_SCALE_CHANNELS, X, X2,  Y, Y2} from '../channel';
import {CellConfig, Config} from '../config';
import {Encoding, normalizeEncoding} from '../encoding';
import * as vlEncoding from '../encoding'; // TODO: remove
import {field, FieldDef, FieldRefOption, isFieldDef} from '../fielddef';
import {Legend} from '../legend';
import {FILL_STROKE_CONFIG, isMarkDef, Mark, MarkDef, TEXT as TEXT_MARK} from '../mark';
import {hasDiscreteDomain, Scale} from '../scale';
import {SelectionDef} from '../selection';
import {UnitSpec} from '../spec';
import {stack, StackProperties} from '../stack';
import {Dict, duplicate, extend, vals} from '../util';
import {VgData} from '../vega.schema';

import {parseAxisComponent} from './axis/parse';
import {applyConfig} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayout, parseUnitLayout} from './layout';
import {parseLegendComponent} from './legend/parse';
import {initEncoding, initMarkDef} from './mark/init';
import {parseMark} from './mark/mark';
import {Model} from './model';
import initScale from './scale/init';
import parseScaleComponent from './scale/parse';
import {assembleUnitData as assembleSelectionData, assembleUnitMarks as assembleSelectionMarks, assembleUnitSignals, parseUnitSelection} from './selection/selection';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends Model {
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
  public readonly encoding: Encoding;
  protected readonly selection: Dict<SelectionDef> = {};
  protected readonly scales: Dict<Scale> = {};
  protected readonly axes: Dict<Axis> = {};
  protected readonly legends: Dict<Legend> = {};
  public readonly config: Config;
  public readonly stack: StackProperties;
  public children: Model[] = [];

  constructor(spec: UnitSpec, parent: Model, parentGivenName: string, cfg: Config) {
    super(spec, parent, parentGivenName, cfg);

    // FIXME(#2041): copy config.facet.cell to config.cell -- this seems incorrect and should be rewritten
    this.initFacetCellConfig();

    // use top-level width / height or parent's top-level width / height

    // FIXME: once facet supports width/height, this is no longer correct!
    const providedWidth = spec.width !== undefined ? spec.width :
      parent ? parent['width'] : undefined; // only exists if parent is layer
    const providedHeight = spec.height !== undefined ? spec.height :
      parent ? parent['height'] : undefined; // only exists if parent is layer

    const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    const encoding = this.encoding = normalizeEncoding(spec.encoding || {}, mark);

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

  private initFacetCellConfig() {
    const config = this.config;
    let ancestor = this.parent;
    let hasFacetAncestor = false;
    while (ancestor !== null) {
      if (ancestor.isFacet()) {
        hasFacetAncestor = true;
        break;
      }
      ancestor = ancestor.parent;
    }

    if (hasFacetAncestor) {
      config.cell = extend({}, config.cell, config.facet.cell);
    }
  }

  private initScales(mark: Mark, encoding: Encoding, topLevelWidth:number, topLevelHeight: number): Dict<Scale> {
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

  private initAxes(encoding: Encoding): Dict<Axis> {
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

  private initLegend(encoding: Encoding): Dict<Legend> {
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

  public parseLayoutData() {
    this.component.layout = parseUnitLayout(this);
  }

  public parseScale() {
    this.component.scales = parseScaleComponent(this);
  }

  public parseMark() {
    this.component.mark = parseMark(this);
  }

  public parseAxis() {
    this.component.axes = parseAxisComponent(this, [X, Y]);
  }

  public parseAxisGroup(): void {
    return null;
  }

  public parseGridGroup(): void {
    return null;
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

  public assembleSignals(signals: any[]): any[] {
    return assembleUnitSignals(this, signals);
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return assembleSelectionData(this, data);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    return assembleLayout(this, layoutData);
  }

  public assembleMarks() {
    let marks = this.component.mark || [];
    marks = assembleSelectionMarks(this, marks);

    return marks.map(this.correctDataNames);
  }

  public assembleParentGroupProperties(cellConfig: CellConfig) {
    return applyConfig({}, cellConfig, FILL_STROKE_CONFIG.concat(['clip']));
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

  public fieldDef(channel: Channel): FieldDef {
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

  public isUnit() {
    return true;
  }
}
