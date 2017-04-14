import {Axis} from '../axis';
import {Channel, COLUMN, X} from '../channel';
import {CellConfig, Config} from '../config';
import {Data, DataSourceType, MAIN, RAW} from '../data';
import {forEach, reduce} from '../encoding';
import {ChannelDef, field, FieldDef, FieldRefOption, isFieldDef} from '../fielddef';
import {Legend} from '../legend';
import {hasDiscreteDomain, Scale} from '../scale';
import {SortField, SortOrder} from '../sort';
import {BaseSpec} from '../spec';
import {StackProperties} from '../stack';
import {Transform} from '../transform';
import {Dict, extend, vals} from '../util';
import {VgAxis, VgData, VgEncodeEntry, VgLegend, VgScale} from '../vega.schema';

import {DataComponent} from './data/index';
import {LayoutComponent} from './layout';
import {assembleScale} from './scale/assemble';
import {SelectionComponent} from './selection/selection';

/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
  data: DataComponent;
  layout: LayoutComponent;
  scales: Dict<VgScale>;
  selection: Dict<SelectionComponent>;

  /** Dictionary mapping channel to VgAxis definition */
  axes: Dict<VgAxis[]>;

  /** Dictionary mapping channel to VgLegend definition */
  legends: Dict<VgLegend>;

  /** Dictionary mapping channel to axis mark group for facet and concat */
  axisGroups: Dict<VgEncodeEntry>;

  /** Dictionary mapping channel to grid mark group for facet (and concat?) */
  gridGroups: Dict<VgEncodeEntry[]>;

  mark: VgEncodeEntry[];
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
    while (this.nameMap[name]) {
      name = this.nameMap[name];
    }

    return name;
  }
}

export abstract class Model {
  public readonly parent: Model;
  protected readonly name: string;
  public readonly description: string;

  public readonly data: Data;
  public readonly transforms: Transform[];

  /** Name map for scales, which can be renamed by a model's parent. */
  protected scaleNameMap: NameMapInterface;

  /** Name map for size, which can be renamed by a model's parent. */
  protected sizeNameMap: NameMapInterface;

  protected readonly transform: Transform;
  protected readonly scales: Dict<Scale> = {};

  protected readonly axes: Dict<Axis> = {};

  protected readonly legends: Dict<Legend> = {};

  public readonly config: Config;

  public component: Component;

  public abstract readonly children: Model[] = [];

  public abstract stack: StackProperties;

  constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config) {
    this.parent = parent;
    this.config = config;

    // If name is not provided, always use parent's givenName to avoid name conflicts.
    this.name = spec.name || parentGivenName;

    // Shared name maps
    this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
    this.sizeNameMap = parent ? parent.sizeNameMap : new NameMap();

    this.data = spec.data;

    this.description = spec.description;
    this.transforms = spec.transform || [];

    this.component = {
      data: {
        sources: parent ? parent.component.data.sources : {},
        outputNodes: parent ? parent.component.data.outputNodes : {}
      },
      layout: null, mark: null, scales: null, axes: null,
      axisGroups: null, gridGroups: null, legends: null, selection: null
    };
  }

  public parse() {
    this.parseData();
    this.parseLayoutData();
    this.parseScale(); // depends on data name
    this.parseSelection();
    this.parseAxis(); // depends on scale name
    this.parseLegend(); // depends on scale name
    this.parseAxisGroup(); // depends on child axis
    this.parseGridGroup();
    this.parseMark(); // depends on data name and scale name, axisGroup, gridGroup and children's scale, axis, legend and mark.
  }

  public abstract parseData(): void;

  public abstract parseSelection(): void;

  public abstract parseLayoutData(): void;

  public abstract parseScale(): void;

  public abstract parseMark(): void;

  public abstract parseAxis(): void;

  public abstract parseLegend(): void;

  // TODO: revise if these two methods make sense for shared scale concat
  public abstract parseAxisGroup(): void;
  public abstract parseGridGroup(): void;

  public abstract assembleSignals(signals: any[]): any[];

  public abstract assembleSelectionData(data: VgData[]): VgData[];
  public abstract assembleData(): VgData[];

  public abstract assembleLayout(layoutData: VgData[]): VgData[];

  public assembleScales(): VgScale[] {
    return assembleScale(this);
  }

  public abstract assembleMarks(): any[]; // TODO: VgMarkGroup[]

  public assembleAxes(): VgAxis[] {
    return [].concat.apply([], vals(this.component.axes));
  }

  public assembleLegends(): VgLegend[] {
    return vals(this.component.legends);
  }

  public assembleGroup() {
    const group: VgEncodeEntry = {};

    const signals = this.assembleSignals(group.signals || []);
    if (signals.length > 0) {
      group.signals = signals;
    }

    group.marks = this.assembleMarks();
    const scales = this.assembleScales();
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

  public abstract assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry;

  public abstract channels(): Channel[];

  protected abstract getMapping(): {[key: string]: any};

  public reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef, c: Channel) => U, init: T, t?: any) {
    return reduce(this.getMapping(), (acc:U , cd: ChannelDef, c: Channel) => {
      return isFieldDef(cd) ? f(acc, cd, c) : acc;
    }, init, t);
  }

  public forEachFieldDef(f: (fd: FieldDef, c: Channel) => void, t?: any) {
    forEach(this.getMapping(), (cd: ChannelDef, c: Channel) => {
      if (isFieldDef(cd)) {
        f(cd, c);
      }
    }, t);
  }

  public hasDescendantWithFieldOnChannel(channel: Channel) {
    for (const child of this.children) {
      if (child.isUnit()) {
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

  public abstract channelHasField(channel: Channel): boolean;

  public getName(text: string, delimiter: string = '_') {
    return (this.name ? this.name + delimiter : '') + text;
  }

  /**
   * Return the data source name for the given data source type. You probably want to call this in parse.
   */
  public getDataName(name: DataSourceType) {
    const fullName = this.getName(name);

    return this.lookupDataSource(fullName);
  }

  /**
   * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
   */
  public lookupDataSource(name: string) {
    const node = this.component.data.outputNodes[name];

    if (!node) {
      // name not found in map so let's just return what we got
      return name;
    }

    return node.source;
  }

  public renameSize(oldName: string, newName: string) {
    this.sizeNameMap.rename(oldName, newName);
  }

  public channelSizeName(channel: Channel): string {
    return this.sizeName(channel === X || channel === COLUMN ? 'width' : 'height');
  }

  public sizeName(size: string): string {
     return this.sizeNameMap.get(this.getName(size, '_'));
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

  public abstract fieldDef(channel: Channel): FieldDef;

  public scale(channel: Channel): Scale {
    return this.scales[channel];
  }

  public hasDiscreteScale(channel: Channel) {
    const scale = this.scale(channel);
    return scale && hasDiscreteDomain(scale.type);
  }

  public renameScale(oldName: string, newName: string) {
    this.scaleNameMap.rename(oldName, newName);
  }


  /**
   * @return scale name for a given channel after the scale has been parsed and named.
   */
  public scaleName(this: Model, originalScaleName: Channel | string, parse?: boolean): string {
    if (parse) {
      // During the parse phase always return a value
      // No need to refer to rename map because a scale can't be renamed
      // before it has the original name.
      return this.getName(originalScaleName);
    }

    // If there is a scale for the channel, it should either
    // be in the _scale mapping or exist in the name map
    if (
        // in the scale map (the scale is not merged by its parent)
        (this.scale && this.scales[originalScaleName]) ||
        // in the scale name map (the the scale get merged by its parent)
        this.scaleNameMap.has(this.getName(originalScaleName))
      ) {
      return this.scaleNameMap.get(this.getName(originalScaleName));
    }
    return undefined;
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

  /**
   * Corrects the data references in marks after assemble.
   */
  public correctDataNames = (mark: VgEncodeEntry) => {
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
  }

  /**
   * Type checks
   */
  public isUnit() {
    return false;
  }
  public isFacet() {
    return false;
  }
  public isLayer() {
    return false;
  }
}
