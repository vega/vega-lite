import {
  AnchorValue,
  Axis as VgAxis,
  Legend as VgLegend,
  NewSignal,
  Projection as VgProjection,
  Signal,
  SignalRef,
  Title as VgTitle,
} from 'vega';
import {
  Channel,
  ExtendedChannel,
  FACET_CHANNELS,
  getPositionScaleChannel,
  isChannel,
  isScaleChannel,
  ScaleChannel,
  SingleDefChannel,
} from '../channel.js';
import {ChannelDef, FieldDef, FieldRefOption, getFieldDef, vgField} from '../channeldef.js';
import {Config} from '../config.js';
import {Data, DataSourceType} from '../data.js';
import {forEach, reduce} from '../encoding.js';
import {ExprRef, replaceExprRef} from '../expr.js';
import * as log from '../log/index.js';
import {Resolve} from '../resolve.js';
import {ScaleType, hasDiscreteDomain} from '../scale.js';
import {isFacetSpec} from '../spec/index.js';
import {
  extractCompositionLayout,
  GenericCompositionLayoutWithColumns,
  LayoutSizeMixins,
  SpecType,
  ViewBackground,
} from '../spec/base.js';
import {NormalizedSpec} from '../spec/index.js';
import {extractTitleConfig, isText, TitleParams} from '../title.js';
import {normalizeTransform, Transform} from '../transform.js';
import {contains, Dict, duplicate, isEmpty, keys, varName} from '../util.js';
import {isVgRangeStep, VgData, VgEncodeEntry, VgLayout, VgMarkGroup} from '../vega.schema.js';
import {assembleAxes} from './axis/assemble.js';
import {AxisComponentIndex} from './axis/component.js';
import {signalOrValueRef} from './common.js';
import {ConcatModel} from './concat.js';
import {DataComponent} from './data/index.js';
import {FacetModel} from './facet.js';
import {assembleHeaderGroups, assembleLayoutTitleBand, assembleTitleGroup} from './header/assemble.js';
import {HEADER_CHANNELS, LayoutHeaderComponent} from './header/component.js';
import {LayerModel} from './layer.js';
import {sizeExpr} from './layoutsize/assemble.js';
import {
  getSizeTypeFromLayoutSizeType,
  LayoutSizeComponent,
  LayoutSizeIndex,
  LayoutSizeType,
} from './layoutsize/component.js';
import {assembleLegends} from './legend/assemble.js';
import {LegendComponentIndex} from './legend/component.js';
import {parseLegend} from './legend/parse.js';
import {assembleProjections} from './projection/assemble.js';
import {ProjectionComponent} from './projection/component.js';
import {parseProjection} from './projection/parse.js';
import {assembleScales} from './scale/assemble.js';
import {ScaleComponent, ScaleComponentIndex} from './scale/component.js';
import {assembleDomain, getFieldFromDomain} from './scale/domain.js';
import {parseScales} from './scale/parse.js';
import {SelectionComponent} from './selection/index.js';
import {Split} from './split.js';
import {UnitModel} from './unit.js';

/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations. The components represents parts of the specification in a form that
 * can be easily merged (during parsing for composite specs).
 * In addition, these components are easily transformed into Vega specifications
 * during the "assemble" phase, which is the last phase of the compilation step.
 */
export interface Component {
  data: DataComponent;

  layoutSize: LayoutSizeComponent;

  layoutHeaders: {
    row?: LayoutHeaderComponent;
    column?: LayoutHeaderComponent;
    facet?: LayoutHeaderComponent;
  };

  mark: VgMarkGroup[];
  scales: ScaleComponentIndex;
  projection: ProjectionComponent;
  selection: Dict<SelectionComponent>;

  /** Dictionary mapping channel to VgAxis definition */
  axes: AxisComponentIndex;

  /** Dictionary mapping channel to VgLegend definition */
  legends: LegendComponentIndex;

  resolve: Resolve;
}

export interface NameMapInterface {
  rename(oldname: string, newName: string): void;
  has(name: string): boolean;
  get(name: string): string;
}

export class NameMap implements NameMapInterface {
  private nameMap: Dict<string>;

  constructor() {
    this.nameMap = {};
  }

  public rename(oldName: string, newName: string) {
    this.nameMap[oldName] = newName;
  }

  public has(name: string): boolean {
    return this.nameMap[name] !== undefined;
  }

  public get(name: string): string {
    // If the name appears in the _nameMap, we need to read its new name.
    // We have to loop over the dict just in case the new name also gets renamed.
    while (this.nameMap[name] && name !== this.nameMap[name]) {
      name = this.nameMap[name];
    }

    return name;
  }
}

/*
  We use type guards instead of `instanceof` as `instanceof` makes
  different parts of the compiler depend on the actual implementation of
  the model classes, which in turn depend on different parts of the compiler.
  Thus, `instanceof` leads to circular dependency problems.

  On the other hand, type guards only make different parts of the compiler
  depend on the type of the model classes, but not the actual implementation.
*/

export function isUnitModel(model: Model): model is UnitModel {
  return model?.type === 'unit';
}

export function isFacetModel(model: Model): model is FacetModel {
  return model?.type === 'facet';
}

export function isConcatModel(model: Model): model is ConcatModel {
  return model?.type === 'concat';
}

export function isLayerModel(model: Model): model is LayerModel {
  return model?.type === 'layer';
}

export abstract class Model {
  public readonly name: string;

  public size: LayoutSizeMixins;

  public readonly title: TitleParams<SignalRef>;
  public readonly description: string;

  public readonly data: Data | null;
  public readonly transforms: Transform[];
  public readonly layout: GenericCompositionLayoutWithColumns;

  /** Name map for scales, which can be renamed by a model's parent. */
  protected scaleNameMap: NameMapInterface;

  /** Name map for projections, which can be renamed by a model's parent. */
  protected projectionNameMap: NameMapInterface;

  /** Name map for signals, which can be renamed by a model's parent. */
  protected signalNameMap: NameMapInterface;

  public readonly component: Component;

  public readonly view?: ViewBackground<SignalRef>;

  public abstract readonly children: Model[];

  constructor(
    spec: NormalizedSpec,
    public readonly type: SpecType,
    public readonly parent: Model,
    parentGivenName: string,
    public readonly config: Config<SignalRef>,
    resolve: Resolve,
    view?: ViewBackground<ExprRef | SignalRef>,
  ) {
    this.parent = parent;
    this.config = config;
    this.view = replaceExprRef(view);

    // If name is not provided, always use parent's givenName to avoid name conflicts.
    this.name = spec.name ?? parentGivenName;
    this.title = isText(spec.title) ? {text: spec.title} : spec.title ? replaceExprRef(spec.title) : undefined;

    // Shared name maps
    this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
    this.projectionNameMap = parent ? parent.projectionNameMap : new NameMap();
    this.signalNameMap = parent ? parent.signalNameMap : new NameMap();

    this.data = spec.data;

    this.description = spec.description;
    this.transforms = normalizeTransform(spec.transform ?? []);
    this.layout = type === 'layer' || type === 'unit' ? {} : extractCompositionLayout(spec, type, config);

    this.component = {
      data: {
        sources: parent ? parent.component.data.sources : [],
        outputNodes: parent ? parent.component.data.outputNodes : {},
        outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
        // data is faceted if the spec is a facet spec or the parent has faceted data and data is undefined
        isFaceted: isFacetSpec(spec) || (parent?.component.data.isFaceted && spec.data === undefined),
      },
      layoutSize: new Split<LayoutSizeIndex>(),
      layoutHeaders: {row: {}, column: {}, facet: {}},
      mark: null,
      resolve: {
        scale: {},
        axis: {},
        legend: {},
        ...(resolve ? duplicate(resolve) : {}),
      },
      selection: null,
      scales: null,
      projection: null,
      axes: {},
      legends: {},
    };
  }

  public get width(): SignalRef {
    return this.getSizeSignalRef('width');
  }

  public get height(): SignalRef {
    return this.getSizeSignalRef('height');
  }

  public parse() {
    this.parseScale();

    this.parseLayoutSize(); // depends on scale
    this.renameTopLevelLayoutSizeSignal();

    this.parseSelections();
    this.parseProjection();
    this.parseData(); // (pathorder) depends on markDef; selection filters depend on parsed selections; depends on projection because some transforms require the finalized projection name.
    this.parseAxesAndHeaders(); // depends on scale and layout size
    this.parseLegends(); // depends on scale, markDef
    this.parseMarkGroup(); // depends on data name, scale, layout size, axisGroup, and children's scale, axis, legend and mark.
  }

  public abstract parseData(): void;

  public abstract parseSelections(): void;

  public parseScale() {
    parseScales(this);
  }

  public parseProjection() {
    parseProjection(this);
  }

  public abstract parseLayoutSize(): void;

  /**
   * Rename top-level spec's size to be just width / height, ignoring model name.
   * This essentially merges the top-level spec's width/height signals with the width/height signals
   * to help us reduce redundant signals declaration.
   */
  private renameTopLevelLayoutSizeSignal() {
    if (this.getName('width') !== 'width') {
      this.renameSignal(this.getName('width'), 'width');
    }
    if (this.getName('height') !== 'height') {
      this.renameSignal(this.getName('height'), 'height');
    }
  }

  public abstract parseMarkGroup(): void;

  public abstract parseAxesAndHeaders(): void;

  public parseLegends() {
    parseLegend(this);
  }

  public abstract assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
  public abstract assembleSignals(): NewSignal[];

  public abstract assembleSelectionData(data: readonly VgData[]): readonly VgData[];

  public abstract assembleGroupStyle(): string | string[];

  private assembleEncodeFromView(view: ViewBackground<SignalRef>): VgEncodeEntry {
    // Exclude "style"
    const {style: _, ...baseView} = view;

    const e: VgEncodeEntry = {};
    for (const property of keys(baseView)) {
      const value = baseView[property];
      if (value !== undefined) {
        e[property] = signalOrValueRef(value);
      }
    }

    return e;
  }

  public assembleGroupEncodeEntry(isTopLevel: boolean): VgEncodeEntry {
    let encodeEntry: VgEncodeEntry = {};
    if (this.view) {
      encodeEntry = this.assembleEncodeFromView(this.view);
    }

    if (!isTopLevel) {
      // Descriptions are already added to the top-level description so we only need to add them to the inner views.
      if (this.description) {
        (encodeEntry as any)['description'] = signalOrValueRef(this.description);
      }

      // For top-level spec, we can set the global width and height signal to adjust the group size.
      // For other child specs, we have to manually set width and height in the encode entry.
      if (this.type === 'unit' || this.type === 'layer') {
        return {
          width: this.getSizeSignalRef('width'),
          height: this.getSizeSignalRef('height'),
          ...encodeEntry,
        };
      }
    }

    return isEmpty(encodeEntry) ? undefined : encodeEntry;
  }

  public assembleLayout(): VgLayout {
    if (!this.layout) {
      return undefined;
    }

    const {spacing, ...layout} = this.layout;

    const {component, config} = this;
    const titleBand = assembleLayoutTitleBand(component.layoutHeaders, config);

    return {
      padding: spacing,
      ...this.assembleDefaultLayout(),
      ...layout,
      ...(titleBand ? {titleBand} : {}),
    };
  }

  protected assembleDefaultLayout(): VgLayout {
    return {};
  }

  public abstract assembleLayoutSignals(): NewSignal[];

  public assembleHeaderMarks(): VgMarkGroup[] {
    const {layoutHeaders} = this.component;
    let headerMarks = [];

    for (const channel of FACET_CHANNELS) {
      if (layoutHeaders[channel].title) {
        headerMarks.push(assembleTitleGroup(this, channel));
      }
    }

    for (const channel of HEADER_CHANNELS) {
      headerMarks = headerMarks.concat(assembleHeaderGroups(this, channel));
    }
    return headerMarks;
  }

  public abstract assembleMarks(): VgMarkGroup[];

  public assembleAxes(): VgAxis[] {
    return assembleAxes(this.component.axes, this.config);
  }

  public assembleLegends(): VgLegend[] {
    return assembleLegends(this);
  }

  public assembleProjections(): VgProjection[] {
    return assembleProjections(this);
  }

  public assembleTitle(): VgTitle {
    const {encoding, ...titleNoEncoding} = this.title ?? ({} as TitleParams<SignalRef>);

    const title: VgTitle = {
      ...extractTitleConfig(this.config.title).nonMarkTitleProperties,
      ...titleNoEncoding,
      ...(encoding ? {encode: {update: encoding}} : {}),
    };

    if (title.text) {
      if (contains(['unit', 'layer'], this.type)) {
        // Unit/Layer
        if (contains<AnchorValue>(['middle', undefined], title.anchor)) {
          title.frame ??= 'group';
        }
      } else {
        // composition with Vega layout

        // Set title = "start" by default for composition as "middle" does not look nice
        // https://github.com/vega/vega/issues/960#issuecomment-471360328
        title.anchor ??= 'start';
      }

      return isEmpty(title) ? undefined : title;
    }
    return undefined;
  }

  /**
   * Assemble the mark group for this model. We accept optional `signals` so that we can include concat top-level signals with the top-level model's local signals.
   */
  public assembleGroup(signals: Signal[] = []) {
    const group: VgMarkGroup = {};

    signals = signals.concat(this.assembleSignals());

    if (signals.length > 0) {
      group.signals = signals;
    }

    const layout = this.assembleLayout();
    if (layout) {
      group.layout = layout;
    }

    group.marks = [].concat(this.assembleHeaderMarks(), this.assembleMarks());

    // Only include scales if this spec is top-level or if parent is facet.
    // (Otherwise, it will be merged with upper-level's scope.)
    const scales = !this.parent || isFacetModel(this.parent) ? assembleScales(this) : [];
    if (scales.length > 0) {
      group.scales = scales;
    }

    const axes = this.assembleAxes();
    if (axes.length > 0) {
      group.axes = axes;
    }

    const legends = this.assembleLegends();
    if (legends.length > 0) {
      group.legends = legends;
    }

    return group;
  }

  public getName(text: string) {
    return varName((this.name ? `${this.name}_` : '') + text);
  }

  public getDataName(type: DataSourceType) {
    return this.getName(DataSourceType[type].toLowerCase());
  }

  /**
   * Request a data source name for the given data source type and mark that data source as required.
   * This method should be called in parse, so that all used data source can be correctly instantiated in assembleData().
   * You can lookup the correct dataset name in assemble with `lookupDataSource`.
   */
  public requestDataName(name: DataSourceType) {
    const fullName = this.getDataName(name);

    // Increase ref count. This is critical because otherwise we won't create a data source.
    // We also increase the ref counts on OutputNode.getSource() calls.
    const refCounts = this.component.data.outputNodeRefCounts;
    refCounts[fullName] = (refCounts[fullName] || 0) + 1;

    return fullName;
  }

  public getSizeSignalRef(layoutSizeType: LayoutSizeType): SignalRef {
    if (isFacetModel(this.parent)) {
      const sizeType = getSizeTypeFromLayoutSizeType(layoutSizeType);
      const channel = getPositionScaleChannel(sizeType);
      const scaleComponent = this.component.scales[channel];

      if (scaleComponent && !scaleComponent.merged) {
        // independent scale
        const type = scaleComponent.get('type');
        const range = scaleComponent.get('range');

        if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
          const scaleName = scaleComponent.get('name');
          const domain = assembleDomain(this, channel);
          const field = getFieldFromDomain(domain);
          if (field) {
            const fieldRef = vgField({aggregate: 'distinct', field}, {expr: 'datum'});
            return {
              signal: sizeExpr(scaleName, scaleComponent, fieldRef),
            };
          } else {
            log.warn(log.message.unknownField(channel));
            return null;
          }
        }
      }
    }

    return {
      signal: this.signalNameMap.get(this.getName(layoutSizeType)),
    };
  }

  /**
   * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
   */
  public lookupDataSource(name: string) {
    const node = this.component.data.outputNodes[name];

    if (!node) {
      // Name not found in map so let's just return what we got.
      // This can happen if we already have the correct name.
      return name;
    }

    return node.getSource();
  }

  public getSignalName(oldSignalName: string): string {
    return this.signalNameMap.get(oldSignalName);
  }

  public renameSignal(oldName: string, newName: string) {
    this.signalNameMap.rename(oldName, newName);
  }

  public renameScale(oldName: string, newName: string) {
    this.scaleNameMap.rename(oldName, newName);
  }

  public renameProjection(oldName: string, newName: string) {
    this.projectionNameMap.rename(oldName, newName);
  }

  /**
   * @return scale name for a given channel after the scale has been parsed and named.
   */
  public scaleName(originalScaleName: ScaleChannel | string, parse?: boolean): string {
    if (parse) {
      // During the parse phase always return a value
      // No need to refer to rename map because a scale can't be renamed
      // before it has the original name.
      return this.getName(originalScaleName);
    }

    // If there is a scale for the channel, it should either
    // be in the scale component or exist in the name map
    if (
      // If there is a scale for the channel, there should be a local scale component for it
      (isChannel(originalScaleName) && isScaleChannel(originalScaleName) && this.component.scales[originalScaleName]) ||
      // in the scale name map (the scale get merged by its parent)
      this.scaleNameMap.has(this.getName(originalScaleName))
    ) {
      return this.scaleNameMap.get(this.getName(originalScaleName));
    }
    return undefined;
  }

  /**
   * @return projection name after the projection has been parsed and named.
   */
  public projectionName(parse?: boolean): string {
    if (parse) {
      // During the parse phase always return a value
      // No need to refer to rename map because a projection can't be renamed
      // before it has the original name.
      return this.getName('projection');
    }

    if (
      (this.component.projection && !this.component.projection.merged) ||
      this.projectionNameMap.has(this.getName('projection'))
    ) {
      return this.projectionNameMap.get(this.getName('projection'));
    }
    return undefined;
  }

  /**
   * Traverse a model's hierarchy to get the scale component for a particular channel.
   */
  public getScaleComponent(channel: ScaleChannel): ScaleComponent {
    /* istanbul ignore next: This is warning for debugging test */
    if (!this.component.scales) {
      throw new Error(
        'getScaleComponent cannot be called before parseScale(). Make sure you have called parseScale or use parseUnitModelWithScale().',
      );
    }

    const localScaleComponent = this.component.scales[channel];
    if (localScaleComponent && !localScaleComponent.merged) {
      return localScaleComponent;
    }
    return this.parent ? this.parent.getScaleComponent(channel) : undefined;
  }

  public getScaleType(channel: ScaleChannel): ScaleType {
    const scaleComponent = this.getScaleComponent(channel);
    return scaleComponent ? scaleComponent.get('type') : undefined;
  }

  /**
   * Traverse a model's hierarchy to get a particular selection component.
   */
  public getSelectionComponent(variableName: string, origName: string): SelectionComponent {
    let sel = this.component.selection[variableName];
    if (!sel && this.parent) {
      sel = this.parent.getSelectionComponent(variableName, origName);
    }
    if (!sel) {
      throw new Error(log.message.selectionNotFound(origName));
    }
    return sel;
  }

  /**
   * Returns true if the model has a signalRef for an axis orient.
   */
  public hasAxisOrientSignalRef() {
    return (
      this.component.axes.x?.some((a) => a.hasOrientSignalRef()) ||
      this.component.axes.y?.some((a) => a.hasOrientSignalRef())
    );
  }
}

/** Abstract class for UnitModel and FacetModel. Both of which can contain fieldDefs as a part of its own specification. */
export abstract class ModelWithField extends Model {
  public abstract fieldDef(channel: SingleDefChannel): FieldDef<any>;

  /** Get "field" reference for Vega */
  public vgField(channel: SingleDefChannel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);

    if (!fieldDef) {
      return undefined;
    }

    return vgField(fieldDef, opt);
  }

  protected abstract getMapping(): Partial<Record<ExtendedChannel, any>>;

  public reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef<string>, c: Channel) => U, init: T): T {
    return reduce(
      this.getMapping(),
      (acc: U, cd: ChannelDef, c: Channel) => {
        const fieldDef = getFieldDef(cd);
        if (fieldDef) {
          return f(acc, fieldDef, c);
        }
        return acc;
      },
      init,
    );
  }

  public forEachFieldDef(f: (fd: FieldDef<string>, c: ExtendedChannel) => void, t?: any) {
    forEach(
      this.getMapping(),
      (cd, c) => {
        const fieldDef = getFieldDef(cd);
        if (fieldDef) {
          f(fieldDef, c);
        }
      },
      t,
    );
  }

  public abstract channelHasField(channel: Channel): boolean;
}
