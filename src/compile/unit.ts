import {NewSignal, SignalRef} from 'vega';
import {isArray, stringValue} from 'vega-util';
import {Axis, AxisInternal, isConditionalAxisValue} from '../axis.js';
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
  Y,
} from '../channel.js';
import {
  getFieldDef,
  getFieldOrDatumDef,
  isFieldDef,
  isFieldOrDatumDef,
  isTypedFieldDef,
  MarkPropFieldOrDatumDef,
  PositionFieldDef,
} from '../channeldef.js';
import {Config} from '../config.js';
import {isGraticuleGenerator} from '../data.js';
import * as vlEncoding from '../encoding.js';
import {Encoding, initEncoding} from '../encoding.js';
import {ExprRef, replaceExprRef} from '../expr.js';
import {LegendInternal} from '../legend.js';
import {GEOSHAPE, isMarkDef, Mark, MarkDef} from '../mark.js';
import {Projection} from '../projection.js';
import {Domain, Scale} from '../scale.js';
import {isSelectionParameter, SelectionParameter} from '../selection.js';
import {LayoutSizeMixins, NormalizedUnitSpec} from '../spec/index.js';
import {isFrameMixins} from '../spec/base.js';
import {stack, StackProperties} from '../stack.js';
import {keys} from '../util.js';
import {VgData, VgLayout, VgMarkGroup} from '../vega.schema.js';
import {assembleAxisSignals} from './axis/assemble.js';
import {AxisInternalIndex} from './axis/component.js';
import {parseUnitAxes} from './axis/parse.js';
import {signalOrValueRefWithCondition, signalRefOrValue} from './common.js';
import {parseData} from './data/parse.js';
import {assembleLayoutSignals} from './layoutsize/assemble.js';
import {initLayoutSize} from './layoutsize/init.js';
import {parseUnitLayoutSize} from './layoutsize/parse.js';
import {LegendInternalIndex} from './legend/component.js';
import {defaultFilled, initMarkdef} from './mark/init.js';
import {parseMarkGroups} from './mark/mark.js';
import {isLayerModel, Model, ModelWithField} from './model.js';
import {ScaleIndex} from './scale/component.js';
import {
  assembleTopLevelSignals,
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals,
} from './selection/assemble.js';
import {parseUnitSelection} from './selection/parse.js';
import {CURR} from './selection/point.js';

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
    config: Config<SignalRef>,
  ) {
    super(spec, 'unit', parent, parentGivenName, config, undefined, isFrameMixins(spec) ? spec.view : undefined);

    const markDef = isMarkDef(spec.mark) ? {...spec.mark} : {type: spec.mark};
    const mark = markDef.type;

    // Need to init filled before other mark properties because encoding depends on filled but other mark properties depend on types inside encoding
    if (markDef.filled === undefined) {
      markDef.filled = defaultFilled(markDef, config, {
        graticule: spec.data && isGraticuleGenerator(spec.data),
      });
    }

    const encoding = (this.encoding = initEncoding(spec.encoding || {}, mark, markDef.filled, config));
    this.markDef = initMarkdef(markDef, encoding, config);

    this.size = initLayoutSize({
      encoding,
      size: isFrameMixins(spec)
        ? {
            ...parentGivenSize,
            ...(spec.width !== undefined ? {width: spec.width} : {}),
            ...(spec.height !== undefined ? {height: spec.height} : {}),
          }
        : parentGivenSize,
    });

    // calculate stack properties
    this.stack = stack(this.markDef, encoding);
    this.specifiedScales = this.initScales(mark, encoding);

    this.specifiedAxes = this.initAxes(encoding);
    this.specifiedLegends = this.initLegends(encoding);
    this.specifiedProjection = spec.projection;

    // Selections will be initialized upon parse.
    this.selection = (spec.params ?? []).filter((p) => isSelectionParameter(p)) as SelectionParameter[];

    this.alignStackOrderWithColorDomain();
  }

  public get hasProjection(): boolean {
    const {encoding} = this;
    const isGeoShapeMark = this.mark === GEOSHAPE;
    const hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some((channel) => isFieldOrDatumDef(encoding[channel]));
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
    return (this.specifiedAxes as any)[channel];
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
    }, {} as any);
  }

  private initAxis(axis: Axis<ExprRef | SignalRef>): Axis<SignalRef> {
    const props = keys(axis);
    const axisInternal: any = {};
    for (const prop of props) {
      const val = axis[prop];
      axisInternal[prop] = isConditionalAxisValue<any, ExprRef | SignalRef>(val)
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
    }, {} as any);
  }

  /**
   * If this unit lacks order encoding but does contain a color domain
   * add transform and encoding that aligns the stack order with the color domain.
   */
  private alignStackOrderWithColorDomain() {
    const {color, fill, order, xOffset, yOffset} = this.encoding;
    const colorField = fill || color;
    const colorEncoding = isFieldDef(colorField) ? colorField : undefined;
    const field = colorEncoding?.field;
    const scale = colorEncoding?.scale;
    const colorEncodingType = colorEncoding?.type;
    const domain = scale?.domain;
    const offset = xOffset || yOffset;
    const offsetEncoding = isFieldDef(offset) ? offset : undefined;
    const orderFieldName = `_${field}_sort_index`;

    if (!order && Array.isArray(domain) && typeof field === 'string' && colorEncodingType === 'nominal') {
      // align grouped chart order with color domain
      if (offsetEncoding && !offsetEncoding.sort) {
        offsetEncoding.sort = domain as [];
      } else {
        // align stacked chart order with color domain
        if (!this.stack) {
          return;
        }

        const orderExpression = `indexof(${stringValue(domain)}, datum['${field}'])`;
        const sort = this.markDef?.orient === 'horizontal' ? 'ascending' : 'descending';
        this.transforms.push({calculate: orderExpression, as: orderFieldName});
        this.encoding.order = {field: orderFieldName, type: 'quantitative', sort};
      }
    }
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

  /**
   * Corrects the data references in marks after assemble.
   */
  public correctDataNames = (mark: VgMarkGroup) => {
    // for normal data references
    if (mark.from?.data) {
      mark.from.data = this.lookupDataSource(mark.from.data);
      if ('time' in this.encoding) {
        mark.from.data = mark.from.data + CURR;
      }
    }

    // for access to facet data
    if (mark.from?.facet?.data) {
      mark.from.facet.data = this.lookupDataSource(mark.from.facet.data);
      // TOOD(jzong) uncomment this when it's time to implement facet animation
      // if ('time' in this.encoding) {
      //   mark.from.facet.data = mark.from.facet.data + CURR;
      // }
    }

    return mark;
  };

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
      return 'view';
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
    const channelDef = (this.encoding as any)[channel];
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
