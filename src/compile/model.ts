import {Axis} from '../axis';
import {Channel, COLUMN, isChannel, X} from '../channel';
import {CellConfig, Config} from '../config';
import {Data, DataSourceType, MAIN, RAW} from '../data';
import {forEach, reduce} from '../encoding';
import {ChannelDef, field, FieldDef, FieldRefOption, isFieldDef, isRepeatRef} from '../fielddef';
import {Legend} from '../legend';
import {hasDiscreteDomain, Scale} from '../scale';
import {SortField, SortOrder} from '../sort';
import {BaseSpec} from '../spec';
import {StackProperties} from '../stack';
import {Transform} from '../transform';
import {Dict, extend, vals, varName} from '../util';
import {VgAxis, VgData, VgEncodeEntry, VgLayout, VgLegend, VgMarkGroup, VgScale, VgSignal, VgSignalRef, VgValueRef} from '../vega.schema';

import {AxesComponent, AxisComponent} from './axis/index';
import {DataComponent} from './data/index';
import {getHeaderGroup, getTitleGroup, HEADER_CHANNELS, HEADER_TYPES, LayoutHeaderComponent} from './layout/header';
import {RepeaterValue} from './repeat';
import {assembleScale} from './scale/assemble';
import {SelectionComponent} from './selection/selection';
import {UnitModel} from './unit';

/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
  data: DataComponent;
  scales: Dict<VgScale>;
  selection: Dict<SelectionComponent>;

  /** Dictionary mapping channel to VgAxis definition */
  axes: AxesComponent;

  /** Dictionary mapping channel to VgLegend definition */
  legends: Dict<VgLegend>;

  layoutHeaders: {
    row?: LayoutHeaderComponent,
    column?: LayoutHeaderComponent
  };

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
  public readonly name: string;
  public readonly description: string;

  public readonly data: Data;
  public readonly transforms: Transform[];

  /** Name map for scales, which can be renamed by a model's parent. */
  protected scaleNameMap: NameMapInterface;

  /** Name map for size, which can be renamed by a model's parent. */
  protected sizeNameMap: NameMapInterface;

  public readonly config: Config;

  public component: Component;

  public abstract readonly children: Model[] = [];

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
      mark: null, scales: null, axes: {x: null, y: null},
      layoutHeaders:{row: {}, column: {}}, legends: null, selection: null
    };
  }

  public parse() {
    this.parseData();
    this.parseScale(); // depends on data name
    this.parseSelection();
    this.parseAxisAndHeader(); // depends on scale name
    this.parseLegend(); // depends on scale name
    this.parseMark(); // depends on data name and scale name, axisGroup, and children's scale, axis, legend and mark.
  }

  public abstract parseData(): void;

  public abstract parseSelection(): void;


  public abstract parseScale(): void;

  public abstract parseMark(): void;

  public abstract parseAxisAndHeader(): void;

  public abstract parseLegend(): void;

  public abstract assembleSelectionTopLevelSignals(signals: any[]): any[];
  public abstract assembleSelectionSignals(): any[];

  public abstract assembleSelectionData(data: VgData[]): VgData[];
  public abstract assembleData(): VgData[];

  public abstract assembleLayout(): VgLayout;

  public abstract assembleLayoutSignals(): VgSignal[];

  public assembleScales(): VgScale[] {
    return assembleScale(this);
  }

  public assembleHeaderMarks(): VgMarkGroup[] {
    const {layoutHeaders} = this.component;
    const headerMarks = [];

    for (const channel of HEADER_CHANNELS) {
      if (layoutHeaders[channel].title) {
        headerMarks.push(getTitleGroup(this, channel));
      }
    }

    for (const channel of HEADER_CHANNELS) {
      const layoutHeader = layoutHeaders[channel];
      for (const headerType of HEADER_TYPES) {
        if (layoutHeader[headerType]) {
          for (const header of layoutHeader[headerType]) {
            const headerGroup = getHeaderGroup(this, channel, headerType, layoutHeader, header);
            if (headerGroup)  {
              headerMarks.push(headerGroup);
            }
          }
        }
      }
    }
    return headerMarks;
  }

  public abstract assembleMarks(): VgMarkGroup[]; // TODO: VgMarkGroup[]

  public assembleAxes(): VgAxis[] {
    const {x, y} = this.component.axes;

    return [
      ...(x ? x.axes.concat(x.gridAxes) : []),
      ...(y ? y.axes.concat(y.gridAxes) : []),
    ];
  }

  public assembleLegends(): VgLegend[] {
    return vals(this.component.legends);
  }

  public assembleGroup(signals: VgSignal[] = []) {
    const group: VgEncodeEntry = {};

    signals = signals.concat(this.assembleSelectionSignals());
    if (signals.length > 0) {
      group.signals = signals;
    }

    const layout = this.assembleLayout();
    if (layout) {
      group.layout = layout;
    }

    group.marks = [].concat(
      this.assembleHeaderMarks(),
      this.assembleMarks()
    );
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

  public abstract assembleParentGroupProperties(): VgEncodeEntry;

  public hasDescendantWithFieldOnChannel(channel: Channel) {
    for (const child of this.children) {
      if (child instanceof UnitModel) {
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

    return this.lookupDataSource(fullName);
  }

  public getSizeSignalRef(sizeType: 'width' | 'height'): {signal: string} {
    // TODO: this could change in the future once we have sizeSignal merging
    return {
      signal: this.getName(sizeType)
    };
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
     return this.sizeNameMap.get(this.getName(size));
  }

  public renameScale(oldName: string, newName: string) {
    this.scaleNameMap.rename(oldName, newName);
  }

  // FIXME: remove this, but currently the scaleName() method below depends on this.
  public scale(channel: Channel): Scale {
    return null;
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
        (this.scale && isChannel(originalScaleName) && this.scale(originalScaleName)) ||
        // in the scale name map (the the scale get merged by its parent)
        this.scaleNameMap.has(this.getName(originalScaleName))
      ) {
      return this.scaleNameMap.get(this.getName(originalScaleName));
    }
    return undefined;
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
   * Traverse a model's hierarchy to get the specified component.
   * @param type Scales or Selection
   * @param name Name of the component
   */
  public getComponent(type: 'scales' | 'selection', name: string): any {
    return this.component[type][name] || this.parent.getComponent(type, name);
  }
}

/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
export abstract class ModelWithField extends Model {
  public abstract fieldDef(channel: Channel): FieldDef<string>;

  /** Get "field" reference for vega */
  public field(channel: Channel, opt: FieldRefOption = {}) {
    const fieldDef = this.fieldDef(channel);

    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: this.hasDiscreteDomain(channel) ? 'range' : 'start'
      }, opt);
    }

    return field(fieldDef, opt);
  }

  public abstract hasDiscreteDomain(channel: Channel): boolean;


  public abstract channels(): Channel[];

  protected abstract getMapping(): {[key: string]: any};

  public reduceFieldDef<T, U>(f: (acc: U, fd: FieldDef<string>, c: Channel) => U, init: T, t?: any) {
    return reduce(this.getMapping(), (acc:U , cd: ChannelDef<string>, c: Channel) => {
      return isFieldDef(cd) ? f(acc, cd, c) : acc;
    }, init, t);
  }

  public forEachFieldDef(f: (fd: FieldDef<string>, c: Channel) => void, t?: any) {
    forEach(this.getMapping(), (cd: ChannelDef<string>, c: Channel) => {
      if (isFieldDef(cd)) {
        f(cd, c);
      }
    }, t);
  }
  public abstract channelHasField(channel: Channel): boolean;
}
