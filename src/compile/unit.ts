import {NewSignal, SignalRef} from 'vega';
import {isArray} from 'vega-util';
import {Axis, AxisInternal, isConditionalAxisValue} from '../axis';
import {
  Channel,
  GEOPOSITION_CHANNELS,
  NonPositionScaleChannel,
  NONPOSITION_SCALE_CHANNELS,
  PositionChannel,
  POSITION_SCALE_CHANNELS,
  ScaleChannel,
  SCALE_CHANNELS,
  SingleDefChannel,
  supportLegend,
  X,
  Y
} from '../channel';
import {
  getFieldDef,
  getFieldOrDatumDef,
  isFieldOrDatumDef,
  isTypedFieldDef,
  MarkPropFieldOrDatumDef,
  PositionFieldDef
} from '../channeldef';
import {Config} from '../config';
import {isGraticuleGenerator} from '../data';
import * as vlEncoding from '../encoding';
import {Encoding, initEncoding} from '../encoding';
import {ExprRef, replaceExprRef} from '../expr';
import {LegendInternal} from '../legend';
import {GEOSHAPE, isMarkDef, Mark, MarkDef} from '../mark';
import {Projection} from '../projection';
import {Domain, Scale} from '../scale';
import {isSelectionParameter, SelectionParameter} from '../selection';
import {LayoutSizeMixins, NormalizedUnitSpec} from '../spec';
import {isFrameMixins} from '../spec/base';
import {stack, StackProperties} from '../stack';
import {keys} from '../util';
import {VgData, VgLayout} from '../vega.schema';
import {assembleAxisSignals} from './axis/assemble';
import {AxisInternalIndex} from './axis/component';
import {parseUnitAxes} from './axis/parse';
import {signalOrValueRefWithCondition, signalRefOrValue} from './common';
import {parseData} from './data/parse';
import {assembleLayoutSignals} from './layoutsize/assemble';
import {initLayoutSize} from './layoutsize/init';
import {parseUnitLayoutSize} from './layoutsize/parse';
import {LegendInternalIndex} from './legend/component';
import {defaultFilled, initMarkdef} from './mark/init';
import {parseMarkGroups} from './mark/mark';
import {isLayerModel, Model, ModelWithField} from './model';
import {ScaleIndex} from './scale/component';
import {
  assembleTopLevelSignals,
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals
} from './selection/assemble';
import {parseUnitSelection} from './selection/parse';

/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends ModelWithField {
  public readonly markDef: MarkDef<Mark, SignalRef>;
  public readonly encoding: Encoding<string>;

  public readonly specifiedScales: ScaleIndex = {};

  public readonly stack: StackProperties;

  protected specifiedAxes: AxisInternalIndex = {};

  protected specifiedLegends: LegendInternalIndex = {};

  public specifiedProjection: Projection<ExprRef | SignalRef> = {};

  public readonly selection: SelectionParameter[] = [];
  public children: Model[] = [];

  constructor(
    spec: NormalizedUnitSpec,
    parent: Model,
    parentGivenName: string,
    parentGivenSize: LayoutSizeMixins = {},
    config: Config<SignalRef>
  ) {
    super(spec, 'unit', parent, parentGivenName, config, undefined, isFrameMixins(spec) ? spec.view : undefined);

    const markDef = isMarkDef(spec.mark) ? {...spec.mark} : {type: spec.mark};
    const mark = markDef.type;

    // Need to init filled before other mark properties because encoding depends on filled but other mark properties depend on types inside encoding
    if (markDef.filled === undefined) {
      markDef.filled = defaultFilled(markDef, config, {
        graticule: spec.data && isGraticuleGenerator(spec.data)
      });
    }

    const encoding = (this.encoding = initEncoding(spec.encoding || {}, mark, markDef.filled, config));
    this.markDef = initMarkdef(markDef, encoding, config);

    this.size = initLayoutSize({
      encoding,
      size: isFrameMixins(spec)
        ? {
            ...parentGivenSize,
            ...(spec.width ? {width: spec.width} : {}),
            ...(spec.height ? {height: spec.height} : {})
          }
        : parentGivenSize
    });

    // calculate stack properties
    this.stack = stack(mark, encoding);
    this.specifiedScales = this.initScales(mark, encoding);

    this.specifiedAxes = this.initAxes(encoding);
    this.specifiedLegends = this.initLegends(encoding);
    this.specifiedProjection = spec.projection;

    // Selections will be initialized upon parse.
    this.selection = (spec.params ?? []).filter(p => isSelectionParameter(p)) as SelectionParameter[];
  }

  public get hasProjection(): boolean {
    const {encoding} = this;
    const isGeoShapeMark = this.mark === GEOSHAPE;
    const hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some(channel => isFieldOrDatumDef(encoding[channel]));
    return isGeoShapeMark || hasGeoPosition;
  }

  /**
   * Return specified Vega-Lite scale domain for a particular channel
   * @param channel
   */
  public scaleDomain(channel: ScaleChannel): Domain {
    const scale = this.specifiedScales[channel];
    return scale ? scale.domain : undefined;
  }

  public axis(channel: PositionChannel): AxisInternal {
    return this.specifiedAxes[channel];
  }

  public legend(channel: NonPositionScaleChannel): LegendInternal {
    return this.specifiedLegends[channel];
  }

  private initScales(mark: Mark, encoding: Encoding<string>): ScaleIndex {
    return SCALE_CHANNELS.reduce((scales, channel) => {
      const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]) as
        | PositionFieldDef<string>
        | MarkPropFieldOrDatumDef<string>;
      if (fieldOrDatumDef) {
        scales[channel] = this.initScale(fieldOrDatumDef.scale ?? {});
      }
      return scales;
    }, {} as ScaleIndex);
  }

  private initScale(scale: Scale<ExprRef | SignalRef>): Scale<SignalRef> {
    const {domain, range} = scale;
    // TODO: we could simplify this function if we had a recursive replace function
    const scaleInternal = replaceExprRef(scale);
    if (isArray(domain)) {
      scaleInternal.domain = domain.map(signalRefOrValue);
    }
    if (isArray(range)) {
      scaleInternal.range = range.map(signalRefOrValue);
    }
    return scaleInternal as Scale<SignalRef>;
  }

  private initAxes(encoding: Encoding<string>): AxisInternalIndex {
    return POSITION_SCALE_CHANNELS.reduce((_axis, channel) => {
      // Position Axis

      // TODO: handle ConditionFieldDef
      const channelDef = encoding[channel];
      if (
        isFieldOrDatumDef(channelDef) ||
        (channel === X && isFieldOrDatumDef(encoding.x2)) ||
        (channel === Y && isFieldOrDatumDef(encoding.y2))
      ) {
        const axisSpec = isFieldOrDatumDef(channelDef) ? channelDef.axis : undefined;

        _axis[channel] = axisSpec
          ? this.initAxis({...axisSpec}) // convert truthy value to object
          : axisSpec;
      }
      return _axis;
    }, {});
  }

  private initAxis(axis: Axis<ExprRef | SignalRef>): Axis<SignalRef> {
    const props = keys(axis);
    const axisInternal = {};
    for (const prop of props) {
      const val = axis[prop];
      axisInternal[prop as any] = isConditionalAxisValue<any, ExprRef | SignalRef>(val)
        ? signalOrValueRefWithCondition<any>(val)
        : signalRefOrValue(val);
    }
    return axisInternal;
  }

  private initLegends(encoding: Encoding<string>): LegendInternalIndex {
    return NONPOSITION_SCALE_CHANNELS.reduce((_legend, channel) => {
      const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]) as MarkPropFieldOrDatumDef<string>;

      if (fieldOrDatumDef && supportLegend(channel)) {
        const legend = fieldOrDatumDef.legend;
        _legend[channel] = legend
          ? replaceExprRef(legend) // convert truthy value to object
          : legend;
      }

      return _legend;
    }, {});
  }

  public parseData() {
    this.component.data = parseData(this);
  }

  public parseLayoutSize() {
    parseUnitLayoutSize(this);
  }

  public parseSelections() {
    this.component.selection = parseUnitSelection(this, this.selection);
  }

  public parseMarkGroup() {
    this.component.mark = parseMarkGroups(this);
  }

  public parseAxesAndHeaders() {
    this.component.axes = parseUnitAxes(this);
  }

  public assembleSelectionTopLevelSignals(signals: any[]): NewSignal[] {
    return assembleTopLevelSignals(this, signals);
  }

  public assembleSignals(): NewSignal[] {
    return [...assembleAxisSignals(this), ...assembleUnitSelectionSignals(this, [])];
  }

  public assembleSelectionData(data: readonly VgData[]): VgData[] {
    return assembleUnitSelectionData(this, data);
  }

  public assembleLayout(): VgLayout {
    return null;
  }

  public assembleLayoutSignals(): NewSignal[] {
    return assembleLayoutSignals(this);
  }

  public assembleMarks() {
    let marks = this.component.mark ?? [];

    // If this unit is part of a layer, selections should augment
    // all in concert rather than each unit individually. This
    // ensures correct interleaving of clipping and brushed marks.
    if (!this.parent || !isLayerModel(this.parent)) {
      marks = assembleUnitSelectionMarks(this, marks);
    }

    return marks.map(this.correctDataNames);
  }
  public assembleGroupStyle(): string | string[] {
    const {style} = this.view || {};
    if (style !== undefined) {
      return style;
    }
    if (this.encoding.x || this.encoding.y) {
      return 'cell';
    } else {
      return undefined;
    }
  }

  protected getMapping() {
    return this.encoding;
  }

  public get mark(): Mark {
    return this.markDef.type;
  }

  public channelHasField(channel: Channel) {
    return vlEncoding.channelHasField(this.encoding, channel);
  }

  public fieldDef(channel: SingleDefChannel) {
    const channelDef = this.encoding[channel];
    return getFieldDef<string>(channelDef);
  }

  public typedFieldDef(channel: SingleDefChannel) {
    const fieldDef = this.fieldDef(channel);
    if (isTypedFieldDef(fieldDef)) {
      return fieldDef;
    }
    return null;
  }
}
