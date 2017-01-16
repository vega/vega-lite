import * as log from '../log';

import {Axis} from '../axis';
import {Channel, X, COLUMN} from '../channel';
import {Config, CellConfig} from '../config';
import {Data, DataSourceType} from '../data';
import {reduce, forEach} from '../encoding';
import {FieldDef, FieldRefOption, field} from '../fielddef';
import {Legend} from '../legend';
import {Scale, hasDiscreteDomain} from '../scale';
import {SortField, SortOrder} from '../sort';
import {BaseSpec, Padding} from '../spec';
import {Transform} from '../transform';
import {extend, flatten, vals, Dict} from '../util';
import {VgData, VgMarkGroup, VgScale, VgAxis, VgLegend} from '../vega.schema';

import {DataComponent} from './data/data';
import {LayoutComponent} from './layout';
import {ScaleComponents, BIN_LEGEND_SUFFIX, BIN_LEGEND_LABEL_SUFFIX} from './scale/scale';
import {StackProperties} from '../stack';

/* tslint:disable:no-unused-variable */
// These imports exist so the TS compiler can name publicly exported members in
// The automatically created .d.ts correctly
import {Formula} from '../transform';
import {OneOfFilter, EqualFilter, RangeFilter} from '../filter';
/* tslint:enable:no-unused-variable */


/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
  data: DataComponent;
  layout: LayoutComponent;
  scale: Dict<ScaleComponents>;

  /** Dictionary mapping channel to VgAxis definition */
  axis: Dict<VgAxis[]>;

  /** Dictionary mapping channel to VgLegend definition */
  legend: Dict<VgLegend>;

  /** Dictionary mapping channel to axis mark group for facet and concat */
  axisGroup: Dict<VgMarkGroup>;

  /** Dictionary mapping channel to grid mark group for facet (and concat?) */
  gridGroup: Dict<VgMarkGroup[]>;

  mark: VgMarkGroup[];
}

class NameMap implements NameMapInterface {
  private _nameMap: Dict<string>;

  constructor() {
    this._nameMap = {} as Dict<string>;
  }

  public rename(oldName: string, newName: string) {
    this._nameMap[oldName] = newName;
  }


  public has(name: string): boolean {
    return this._nameMap[name] !== undefined;
  }

  public get(name: string): string {
    // If the name appears in the _nameMap, we need to read its new name.
    // We have to loop over the dict just in case the new name also gets renamed.
    while (this._nameMap[name]) {
      name = this._nameMap[name];
    }

    return name;
  }
}

export interface NameMapInterface {
  rename(oldname: string, newName: string): void;
  has(name: string): boolean;
  get(name: string): string;
}

export abstract class Model {
  protected _parent: Model;
  protected _name: string;
  protected _description: string;
  protected _padding: Padding;

  protected _data: Data;

  /** Name map for data sources, which can be renamed by a model's parent. */
  protected _dataNameMap: NameMapInterface;

  /** Name map for scales, which can be renamed by a model's parent. */
  protected _scaleNameMap: NameMapInterface;

  /** Name map for size, which can be renamed by a model's parent. */
  protected _sizeNameMap: NameMapInterface;

  protected _transform: Transform;
  protected _scale: Dict<Scale> = {};

  protected _axis: Dict<Axis> = {};

  protected _legend: Dict<Legend> = {};

  protected _config: Config;

  public component: Component;

  constructor(spec: BaseSpec, parent: Model, parentGivenName: string) {
    this._parent = parent;

    // If name is not provided, always use parent's givenName to avoid name conflicts.
    this._name = spec.name || parentGivenName;

    // Shared name maps
    this._dataNameMap = parent ? parent._dataNameMap : new NameMap();
    this._scaleNameMap = parent ? parent._scaleNameMap : new NameMap();
    this._sizeNameMap = parent ? parent._sizeNameMap : new NameMap();

    this._data = spec.data;

    this._description = spec.description;
    this._padding = spec.padding;
    this._transform = spec.transform;

    if (spec.transform) {
      if (spec.transform.filterInvalid === undefined &&
          spec.transform['filterNull'] !== undefined) {
        spec.transform.filterInvalid = spec.transform['filterNull'];
        log.warn(log.message.DEPRECATED_FILTER_NULL);
      }
    }

    this.component = {data: null, layout: null, mark: null, scale: null, axis: null, axisGroup: null, gridGroup: null, legend: null};
  }


  public parse() {
    this.parseData();
    this.parseSelectionData();
    this.parseLayoutData();
    this.parseScale(); // depends on data name
    this.parseAxis(); // depends on scale name
    this.parseLegend(); // depends on scale name
    this.parseAxisGroup(); // depends on child axis
    this.parseGridGroup();
    this.parseMark(); // depends on data name and scale name, axisGroup, gridGroup and children's scale, axis, legend and mark.
  }

  public abstract parseData(): void;

  public abstract parseSelectionData(): void;

  public abstract parseLayoutData(): void;

  public abstract parseScale(): void;

  public abstract parseMark(): void;

  public abstract parseAxis(): void;

  public abstract parseLegend(): void;

  // TODO: revise if these two methods make sense for shared scale concat
  public abstract parseAxisGroup(): void;
  public abstract parseGridGroup(): void;


  public abstract assembleData(data: VgData[]): VgData[];

  public abstract assembleLayout(layoutData: VgData[]): VgData[];

  // TODO: for Arvind to write
  // public abstract assembleSelectionSignal(layoutData: VgData[]): VgData[];
  // public abstract assembleSelectionData(layoutData: VgData[]): VgData[];

  public assembleScales(): VgScale[] {
    // FIXME: write assembleScales() in scale.ts that
    // help assemble scale domains with scale signature as well
    return flatten(vals(this.component.scale).map((scales: ScaleComponents) => {
      let arr = [scales.main];
      if (scales.binLegend) {
        arr.push(scales.binLegend);
      }
      if (scales.binLegendLabel) {
        arr.push(scales.binLegendLabel);
      }
      return arr;
    }));
  }

  public abstract assembleMarks(): any[]; // TODO: VgMarkGroup[]

  public assembleAxes(): VgAxis[] {
    return [].concat.apply([], vals(this.component.axis));
  }

  public assembleLegends(): any[] { // TODO: VgLegend[]
    return vals(this.component.legend);
  }

  public assembleGroup() {
    let group: VgMarkGroup = {};

    // TODO: consider if we want scales to come before marks in the output spec.

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

  public abstract assembleParentGroupProperties(cellConfig: CellConfig): any;

  public abstract channels(): Channel[];

  protected abstract mapping(): any;

  public reduce<T>(f: (acc: any, fd: FieldDef, c: Channel) => any, init: T, t?: any) {
    return reduce(this.mapping(), f, init, t);
  }

  public forEach(f: (fd: FieldDef, c: Channel) => void, t?: any) {
    forEach(this.mapping(), f, t);
  }

  public hasDescendantWithFieldOnChannel(channel: Channel) {
    for (let child of this.children()) {
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

  public parent(): Model {
    return this._parent;
  }

  public abstract children(): Model[];

  public name(text: string, delimiter: string = '_') {
    return (this._name ? this._name + delimiter : '') + text;
  }

  public description() {
    return this._description;
  }

  public padding() {
    return this._padding;
  }

  public data() {
    return this._data;
  }

  public renameData(oldName: string, newName: string) {
     this._dataNameMap.rename(oldName, newName);
  }

  /**
   * Return the data source name for the given data source type.
   *
   * For unit spec, this is always simply the spec.name + '-' + dataSourceType.
   * We already use the name map so that marks and scales use the correct data.
   */
  public dataName(dataSourceType: DataSourceType): string {
    return this._dataNameMap.get(this.name(String(dataSourceType)));
  }

  public renameSize(oldName: string, newName: string) {
    this._sizeNameMap.rename(oldName, newName);
  }

  public channelSizeName(channel: Channel): string {
    return this.sizeName(channel === X || channel === COLUMN ? 'width' : 'height');
  }

  public sizeName(size: string): string {
     return this._sizeNameMap.get(this.name(size, '_'));
  }

  public abstract dataTable(): string;

  // TRANSFORMS
  public calculate() {
    return this._transform ? this._transform.calculate : undefined;
  }

  public filterInvalid(): boolean {
    const transform = this._transform || {};
    if (transform.filterInvalid === undefined) {
      return this.parent() ? this.parent().filterInvalid() : undefined;
    }
    return transform.filterInvalid;
  }

  public filter() {
    return this._transform ? this._transform.filter : undefined;
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
    return this._scale[channel];
  }

  public hasDiscreteScale(channel: Channel) {
    const scale = this.scale(channel);
    return scale && hasDiscreteDomain(scale.type);
  }

  public renameScale(oldName: string, newName: string) {
    this._scaleNameMap.rename(oldName, newName);
  }


  /**
   * @return scale name for a given channel after the scale has been parsed and named.
   * (DO NOT USE THIS METHOD DURING SCALE PARSING, use model.name() instead)
   */
  public scaleName(originalScaleName: Channel|string, parse?: boolean): string {
    const channel = originalScaleName.replace(BIN_LEGEND_SUFFIX, '').replace(BIN_LEGEND_LABEL_SUFFIX, '');

    if (parse) {
      // During the parse phase always return a value
      // No need to refer to rename map because a scale can't be renamed
      // before it has the original name.
      return this.name(originalScaleName + '');
    }

    // If there is a scale for the channel, it should either
    // be in the _scale mapping or exist in the name map
    if (
        // in the scale map (the scale is not merged by its parent)
        (this._scale && this._scale[channel]) ||
        // in the scale name map (the the scale get merged by its parent)
        this._scaleNameMap.has(this.name(originalScaleName + ''))
      ) {
      return this._scaleNameMap.get(this.name(originalScaleName + ''));
    }
    return undefined;
  }

  public sort(channel: Channel): SortField | SortOrder {
    return (this.mapping()[channel] || {}).sort;
  }

  public abstract stack(): StackProperties;

  public axis(channel: Channel): Axis {
    return this._axis[channel];
  }

  public legend(channel: Channel): Legend {
    return this._legend[channel];
  }

  /**
   * Get the spec configuration.
   */
  public config(): Config {
    return this._config;
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
