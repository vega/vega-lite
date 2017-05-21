import {Axis} from '../axis';
import {Channel, NONSPATIAL_SCALE_CHANNELS, SCALE_CHANNELS, ScaleChannel, SingleDefChannel, UNIT_CHANNELS, X, X2, Y, Y2} from '../channel';
import {CellConfig, Config} from '../config';
import * as vlEncoding from '../encoding'; // TODO: remove
import {Encoding, normalizeEncoding} from '../encoding';
import {ChannelDef, field, FieldDef, FieldRefOption, getFieldDef, isConditionalDef, isFieldDef, isProjection} from '../fielddef';
import {Legend} from '../legend';
import {FILL_STROKE_CONFIG, isMarkDef, Mark, MarkDef, TEXT as TEXT_MARK} from '../mark';
import {Projection} from '../projection';
import {defaultScaleConfig, Domain, hasDiscreteDomain, Scale} from '../scale';
import {SelectionDef} from '../selection';
import {SortField, SortOrder} from '../sort';
import {UnitSize, UnitSpec} from '../spec';
import {stack, StackProperties} from '../stack';
import {LATITUDE, LONGITUDE} from '../type';
import {Dict, duplicate, extend, vals} from '../util';
import {VgData, VgEncodeEntry, VgLayout, VgSignal} from '../vega.schema';
import {AxisIndex} from './axis/component';
import {parseAxisComponent} from './axis/parse';
import {applyConfig} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {FacetModel} from './facet';
import {LayerModel} from './layer';
import {assembleLayoutUnitSignals} from './layout/index';
import {LegendIndex} from './legend/component';
import {parseLegendComponent} from './legend/parse';
import {initEncoding, initMarkDef} from './mark/init';
import {parseMark} from './mark/mark';
import {Model, ModelWithField} from './model';
import {initProjection} from './projection/init';
import {parseProjectionComponent} from './projection/parse';
import {RepeaterValue, replaceRepeaterInEncoding} from './repeat';
import {ScaleIndex} from './scale/component';
import initScale from './scale/init';
import parseScaleComponent from './scale/parse';
import {assembleTopLevelSignals, assembleUnitSelectionData, assembleUnitSelectionMarks, assembleUnitSelectionSignals, parseUnitSelection} from './selection/selection';
import {Split} from './split';

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

  protected scales: ScaleIndex = {};

  public readonly projection: Projection;

  public readonly stack: StackProperties;

  protected axes: AxisIndex = {};

  protected legends: LegendIndex = {};

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

    // TODO: in parent, if no projection is specified, and some child has a projection
    //       set projection equal to the first projection found in children (from first child to last child)
    const parentProjection = parent ? parent.projection : {};
    this.projection = initProjection(this.config, spec.projection, parentProjection, mark, encoding);

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

  public scale(channel: Channel): Split<Scale> {
    return this.scales[channel];
  }

  /**
   * Return specified Vega-lite scale domain for a particular channel
   * @param channel
   */
  public scaleDomain(channel: ScaleChannel): Domain {
    const scale = this.scales[channel];
    return scale ? scale.get('domain') : undefined;
  }

  public hasDiscreteDomain(channel: ScaleChannel) {
    const scale = this.scale(channel);
    return scale && hasDiscreteDomain(scale.get('type'));
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

  private initScales(mark: Mark, encoding: Encoding<string>, topLevelWidth:number, topLevelHeight: number): ScaleIndex {
    const xyRangeSteps: number[] = [];

    return SCALE_CHANNELS.reduce((scales, channel) => {
      let fieldDef: FieldDef<string>;
      let specifiedScale: Scale;

      const channelDef = encoding[channel];

      if (isFieldDef(channelDef)) {
        fieldDef = channelDef;
        specifiedScale = channelDef.scale;
      } else if (isConditionalDef(channelDef) && isFieldDef(channelDef.condition)) {
        fieldDef = channelDef.condition;
        specifiedScale = channelDef.condition.scale;
      } else if (channel === 'x') {
        fieldDef = getFieldDef(encoding.x2);
      } else if (channel === 'y') {
        fieldDef = getFieldDef(encoding.y2);
      }

      if (fieldDef) {
        const splitScale = scales[channel] = initScale(
          channel, fieldDef, specifiedScale, this.config, mark,
          channel === X ? topLevelWidth : channel === Y ? topLevelHeight : undefined,
          xyRangeSteps // for determine point / bar size
        );

        if (channel === X || channel === Y) {
          const rangeStep = splitScale.get('rangeStep');
          if (rangeStep) {
            xyRangeSteps.push(rangeStep);
          }
        }
      }
      return scales;
    }, {} as ScaleIndex);
  }

  // TODO: consolidate this with scale?  Current scale range is in parseScale (later),
  // but not in initScale because scale range depends on size,
  // but size depends on scale type and rangeStep
  private initSize(mark: Mark, scales: ScaleIndex, width: number, height: number) {
    const cellConfig = this.config.cell;
    const scaleConfig = this.config.scale;

    if (width === undefined) {
      if (scales.x) {
        if (!hasDiscreteDomain(scales.x.get('type')) || !scales.x.get('rangeStep')) {
          width = cellConfig.width;
        } // else: Do nothing, use dynamic width.
      } else { // No scale X
        if (mark === TEXT_MARK) {
          // for text table without x/y scale we need wider rangeStep
          width = scaleConfig.textXRangeStep;
        } else {
          // Set height equal to rangeStep config or if rangeStep is null, use value from default scale config.
          if (scaleConfig.rangeStep) {
            width = scaleConfig.rangeStep;
          } else {
            width = defaultScaleConfig.rangeStep;
          }
        }
      }
    }

    if (height === undefined) {
      if (scales.y) {
        if (!hasDiscreteDomain(scales.y.get('type')) || !scales.y.get('rangeStep')) {
          height = cellConfig.height;
        } // else: Do nothing, use dynamic height .
      } else {
        // Set height equal to rangeStep config or if rangeStep is null, use value from default scale config.
        if (scaleConfig.rangeStep) {
          height = scaleConfig.rangeStep;
        } else {
          height = defaultScaleConfig.rangeStep;
        }
      }
    }

    return {width, height};
  }

  private initAxes(encoding: Encoding<string>): AxisIndex {
    return [X, Y].reduce(function(_axis, channel) {
      // Position Axis
      const channelDef = encoding[channel];
      if ((isFieldDef(channelDef) ||
        (channel === X && isFieldDef(encoding.x2)) ||
        (channel === Y && isFieldDef(encoding.y2))
      ) && !isProjection(channelDef)) {

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

  private initLegend(encoding: Encoding<string>): LegendIndex {
    return NONSPATIAL_SCALE_CHANNELS.reduce(function(_legend, channel) {
      const channelDef = encoding[channel];
      if (channelDef) {
        const legend = isFieldDef(channelDef) ? channelDef.legend :
          (channelDef.condition && isFieldDef(channelDef.condition)) ? channelDef.condition.legend : null;

        if (legend !== null && legend !== false) {
          _legend[channel] = {...legend};
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

  public parseProjection() {
    this.component.projections = parseProjectionComponent(this);
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
      return assembleData(this.component.data);
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

  public assembleParentGroupProperties(): VgEncodeEntry {
    return {
      width: this.getSizeSignalRef('width'),
      height: this.getSizeSignalRef('height'),
      ...applyConfig({}, this.config.cell, FILL_STROKE_CONFIG.concat(['clip']))
    };
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

  public fieldDef(channel: SingleDefChannel): FieldDef<string> {
    const channelDef = this.encoding[channel] as ChannelDef<string>;
    return getFieldDef(channelDef);
  }

  /** Get "field" reference for vega */
  public field(channel: SingleDefChannel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);

    if (!fieldDef) {
      return undefined;
    }

    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: hasDiscreteDomain(this.scale(channel).get('type')) ? 'range' : 'start'
      }, opt);
    }

    return field(fieldDef, opt);
  }
}
