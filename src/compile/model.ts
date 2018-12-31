import {AnchorValue, Axis as VgAxis, Legend as VgLegend, NewSignal, SignalRef, Title as VgTitle} from 'vega';
import {isNumber, isString} from 'vega-util';
import {Channel, isChannel, isScaleChannel, ScaleChannel, SingleDefChannel} from '../channel';
import {Config} from '../config';
import {Data, DataSourceType} from '../data';
import {forEach, reduce} from '../encoding';
import {ChannelDef, FieldDef, FieldRefOption, getFieldDef, vgField} from '../fielddef';
import * as log from '../log';
import {Resolve} from '../resolve';
import {hasDiscreteDomain} from '../scale';
import {BaseSpec, isFacetSpec, isLayerSpec, isUnitSpec, TopLevelFacetSpec} from '../spec';
import {extractCompositionLayout, GenericCompositionLayout} from '../spec/toplevel';
import {extractTitleConfig, TitleParams} from '../title';
import {normalizeTransform, Transform} from '../transform';
import {contains, Dict, duplicate, keys, varName} from '../util';
import {isVgRangeStep, VgData, VgEncodeEntry, VgLayout, VgMarkGroup, VgProjection} from '../vega.schema';
import {assembleAxes} from './axis/assemble';
import {AxisComponentIndex} from './axis/component';
import {ConcatModel} from './concat';
import {DataComponent} from './data';
import {FacetModel} from './facet';
import {getHeaderGroups, getTitleGroup, HEADER_CHANNELS, LayoutHeaderComponent} from './header/index';
import {LayerModel} from './layer';
import {sizeExpr} from './layoutsize/assemble';
import {LayoutSizeComponent, LayoutSizeIndex} from './layoutsize/component';
import {assembleLegends} from './legend/assemble';
import {LegendComponentIndex} from './legend/component';
import {parseLegend} from './legend/parse';
import {assembleProjections} from './projection/assemble';
import {ProjectionComponent} from './projection/component';
import {parseProjection} from './projection/parse';
import {RepeatModel} from './repeat';
import {RepeaterValue} from './repeater';
import {assembleScales} from './scale/assemble';
import {ScaleComponent, ScaleComponentIndex} from './scale/component';
import {assembleDomain, getFieldFromDomain} from './scale/domain';
import {parseScale} from './scale/parse';
import {SelectionComponent} from './selection/selection';
import {Split} from './split';
import {UnitModel} from './unit';

/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  The components represents parts of the specification in a form that
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
  return model && model.type === 'unit';
}

export function isFacetModel(model: Model): model is FacetModel {
  return model && model.type === 'facet';
}

export function isRepeatModel(model: Model): model is RepeatModel {
  return model && model.type === 'repeat';
}

export function isConcatModel(model: Model): model is ConcatModel {
  return model && model.type === 'concat';
}

export function isLayerModel(model: Model): model is LayerModel {
  return model && model.type === 'layer';
}

export abstract class Model {
  public abstract readonly type: 'unit' | 'facet' | 'layer' | 'concat' | 'repeat';
  public readonly parent: Model;
  public readonly name: string;

  public readonly title: TitleParams;
  public readonly description: string;

  public readonly data: Data;
  public readonly transforms: Transform[];
  public readonly layout: GenericCompositionLayout;

  /** Name map for scales, which can be renamed by a model's parent. */
  protected scaleNameMap: NameMapInterface;

  /** Name map for projections, which can be renamed by a model's parent. */
  protected projectionNameMap: NameMapInterface;

  /** Name map for signals, which can be renamed by a model's parent. */
  protected signalNameMap: NameMapInterface;

  public readonly repeater: RepeaterValue;

  public readonly config: Config;

  public readonly component: Component;

  public abstract readonly children: Model[] = [];

  constructor(
    spec: BaseSpec,
    parent: Model,
    parentGivenName: string,
    config: Config,
    repeater: RepeaterValue,
    resolve: Resolve
  ) {
    this.parent = parent;
    this.config = config;
    this.repeater = repeater;

    // If name is not provided, always use parent's givenName to avoid name conflicts.
    this.name = spec.name || parentGivenName;
    this.title = isString(spec.title) ? {text: spec.title} : spec.title;

    // Shared name maps
    this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
    this.projectionNameMap = parent ? parent.projectionNameMap : new NameMap();
    this.signalNameMap = parent ? parent.signalNameMap : new NameMap();

    this.data = spec.data;

    this.description = spec.description;
    this.transforms = normalizeTransform(spec.transform || []);
    this.layout =
      isUnitSpec(spec) || isLayerSpec(spec) ? undefined : extractCompositionLayout(spec as TopLevelFacetSpec);

    this.component = {
      data: {
        sources: parent ? parent.component.data.sources : [],
        outputNodes: parent ? parent.component.data.outputNodes : {},
        outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
        // data is faceted if the spec is a facet spec or the parent has faceted data and no data is defined
        isFaceted: isFacetSpec(spec) || (parent && parent.component.data.isFaceted && !spec.data)
      },
      layoutSize: new Split<LayoutSizeIndex>(),
      layoutHeaders: {row: {}, column: {}},
      mark: null,
      resolve: {
        scale: {},
        axis: {},
        legend: {},
        ...(resolve ? duplicate(resolve) : {})
      },
      selection: null,
      scales: null,
      projection: null,
      axes: {},
      legends: {}
    };
  }

  public get width(): SignalRef {
    return this.getSizeSignalRef('width');
  }

  public get height(): SignalRef {
    return this.getSizeSignalRef('height');
  }

  protected initSize(size: LayoutSizeIndex) {
    const {width, height} = size;
    if (width) {
      this.component.layoutSize.set('width', width, true);
    }

    if (height) {
      this.component.layoutSize.set('height', height, true);
    }
  }

  public parse() {
    this.parseScale();

    this.parseLayoutSize(); // depends on scale
    this.renameTopLevelLayoutSizeSignal();

    this.parseSelection();
    this.parseProjection();
    this.parseData(); // (pathorder) depends on markDef; selection filters depend on parsed selections; depends on projection because some transforms require the finalized projection name.
    this.parseAxisAndHeader(); // depends on scale and layout size
    this.parseLegend(); // depends on scale, markDef
    this.parseMarkGroup(); // depends on data name, scale, layout size, axisGroup, and children's scale, axis, legend and mark.
  }

  public abstract parseData(): void;

  public abstract parseSelection(): void;

  public parseScale() {
    parseScale(this);
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

  public abstract parseAxisAndHeader(): void;

  public parseLegend() {
    parseLegend(this);
  }

  public abstract assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
  public abstract assembleSelectionSignals(): NewSignal[];

  public abstract assembleSelectionData(data: VgData[]): VgData[];

  public assembleGroupStyle(): string {
    if (this.type === 'unit' || this.type === 'layer') {
      return 'cell';
    }
    return undefined;
  }

  public assembleLayoutSize(): VgEncodeEntry {
    if (this.type === 'unit' || this.type === 'layer') {
      return {
        width: this.getSizeSignalRef('width'),
        height: this.getSizeSignalRef('height')
      };
    }
    return undefined;
  }

  public assembleLayout(): VgLayout {
    if (!this.layout) {
      return undefined;
    }

    const {align, bounds, center, spacing = {}} = this.layout;

    return {
      padding: isNumber(spacing)
        ? spacing
        : {
            row: spacing.row || 10,
            column: spacing.column || 10
          },
      ...this.assembleDefaultLayout(),
      ...(align ? {align} : {}),
      ...(bounds ? {bounds} : {}),
      ...(center ? {center} : {})
    };
  }

  protected assembleDefaultLayout(): VgLayout {
    return {};
  }

  public abstract assembleLayoutSignals(): NewSignal[];

  public assembleHeaderMarks(): VgMarkGroup[] {
    const {layoutHeaders} = this.component;
    let headerMarks = [];

    for (const channel of HEADER_CHANNELS) {
      if (layoutHeaders[channel].title) {
        headerMarks.push(getTitleGroup(this, channel));
      }
    }

    for (const channel of HEADER_CHANNELS) {
      headerMarks = headerMarks.concat(getHeaderGroups(this, channel));
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
    const {encoding, ...titleNoEncoding} = this.title || ({} as TitleParams);

    const title: VgTitle = {
      ...extractTitleConfig(this.config.title).nonMark,
      ...titleNoEncoding,
      ...(encoding ? {encode: {update: encoding}} : {})
    };

    if (title.text) {
      if (!contains(['unit', 'layer'], this.type)) {
        // As described in https://github.com/vega/vega-lite/issues/2875:
        // Due to vega/vega#960 (comment), we only support title's anchor for unit and layered spec for now.

        if (title.anchor && title.anchor !== 'start') {
          log.warn(log.message.cannotSetTitleAnchor(this.type));
        }
        title.anchor = 'start';
      }

      if (contains<AnchorValue>(['middle', undefined], title.anchor) && title.frame === undefined) {
        title.frame = 'group';
      }

      return keys(title).length > 0 ? title : undefined;
    }
    return undefined;
  }

  /**
   * Assemble the mark group for this model.  We accept optional `signals` so that we can include concat top-level signals with the top-level model's local signals.
   */
  public assembleGroup(signals: NewSignal[] = []) {
    const group: VgMarkGroup = {};

    signals = signals.concat(this.assembleSelectionSignals());

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

  public hasDescendantWithFieldOnChannel(channel: Channel) {
    for (const child of this.children) {
      if (isUnitModel(child)) {
        if (child.channelHasField(channel)) {
          return true;
        }
      } else {
        if (child.hasDescendantWithFieldOnChannel(channel)) {
          return true;
        }
      }
    }
    return false;
  }

  public getName(text: string) {
    return varName((this.name ? this.name + '_' : '') + text);
  }

  /**
   * Request a data source name for the given data source type and mark that data source as required. This method should be called in parse, so that all used data source can be correctly instantiated in assembleData().
   */
  public requestDataName(name: DataSourceType) {
    const fullName = this.getName(name);

    // Increase ref count. This is critical because otherwise we won't create a data source.
    // We also increase the ref counts on OutputNode.getSource() calls.
    const refCounts = this.component.data.outputNodeRefCounts;
    refCounts[fullName] = (refCounts[fullName] || 0) + 1;

    return fullName;
  }

  public getSizeSignalRef(sizeType: 'width' | 'height'): SignalRef {
    if (isFacetModel(this.parent)) {
      const channel = sizeType === 'width' ? 'x' : 'y';
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
              signal: sizeExpr(scaleName, scaleComponent, fieldRef)
            };
          } else {
            log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
            return null;
          }
        }
      }
    }

    return {
      signal: this.signalNameMap.get(this.getName(sizeType))
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
  public scaleName(originalScaleName: Channel | string, parse?: boolean): string {
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
   * Corrects the data references in marks after assemble.
   */
  public correctDataNames = (mark: VgMarkGroup) => {
    // TODO: make this correct

    // for normal data references
    if (mark.from && mark.from.data) {
      mark.from.data = this.lookupDataSource(mark.from.data);
    }

    // for access to facet data
    if (mark.from && mark.from.facet && mark.from.facet.data) {
      mark.from.facet.data = this.lookupDataSource(mark.from.facet.data);
    }

    return mark;
  };

  /**
   * Traverse a model's hierarchy to get the scale component for a particular channel.
   */
  public getScaleComponent(channel: ScaleChannel): ScaleComponent {
    /* istanbul ignore next: This is warning for debugging test */
    if (!this.component.scales) {
      throw new Error(
        'getScaleComponent cannot be called before parseScale().  Make sure you have called parseScale or use parseUnitModelWithScale().'
      );
    }

    const localScaleComponent = this.component.scales[channel];
    if (localScaleComponent && !localScaleComponent.merged) {
      return localScaleComponent;
    }
    return this.parent ? this.parent.getScaleComponent(channel) : undefined;
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
}

/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
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

  protected abstract getMapping(): {[key in Channel]?: any};

  public reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef<string>, c: Channel) => U, init: T, t?: any) {
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
      t
    );
  }

  public forEachFieldDef(f: (fd: FieldDef<string>, c: Channel) => void, t?: any) {
    forEach(
      this.getMapping(),
      (cd: ChannelDef, c: Channel) => {
        const fieldDef = getFieldDef(cd);
        if (fieldDef) {
          f(fieldDef, c);
        }
      },
      t
    );
  }
  public abstract channelHasField(channel: Channel): boolean;
}
