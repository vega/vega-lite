import {AxisProperties} from '../axis';
import {Channel, X, Y, COLUMN} from '../channel';
import {Config, CellConfig} from '../config';
import {Data, DataTable} from '../data';
import {channelMappingReduce, channelMappingForEach} from '../encoding';
import {FieldDef, FieldRefOption, isRepeatRef, field, isCount, COUNT_DISPLAYNAME} from '../fielddef';
import {LegendProperties} from '../legend';
import {Scale, ScaleType} from '../scale';
import {BaseSpec} from '../spec';
import {Transform} from '../transform';
import {extend, flatten, vals, warning, contains, Dict, array} from '../util';
import {VgData, VgMarkGroup, VgScale, VgAxis, VgLegend, VgFieldRef, VgField} from '../vega.schema';

import {DataComponent} from './data/data';
import {LayoutComponent} from './layout';
import {ScaleComponents} from './scale';
import {RepeatModel, RepeatValues} from './repeat';
import {UnitModel} from './unit';
import {LayerModel} from './layer';

import * as selections from './selections';

/**
 * Composable Components that are intermediate results of the parsing phase of the
 * compilations.  These composable components will be assembled in the last
 * compilation step.
 */
export interface Component {
  data: DataComponent;
  layout: LayoutComponent;
  selection: selections.Selection[];
  scale: Dict<ScaleComponents>;

  /** Dictionary mapping channel to VgAxis definition */
  // TODO: if we allow multiple axes (e.g., dual axis), this will become VgAxis[]
  axis: Dict<VgAxis>;

  /** Dictionary mapping channel to VgLegend definition */
  legend: Dict<VgLegend>;

  /** Dictionary mapping channel to axis mark group for facet and concat */
  axisGroup: Dict<VgMarkGroup>;

  /** Dictionary mapping channel to grid mark group for facet (and concat?) */
  gridGroup: Dict<VgMarkGroup[]>;

  mark: VgMarkGroup[];
}

class NameMap {
  private _nameMap: Dict<string>;

  constructor() {
    this._nameMap = {} as Dict<string>;
  }

  public rename(oldName: string, newName: string) {
    if (oldName === newName) {
      return console.error('cannot rename ' + oldName + ' to itself');
    }
    this._nameMap[oldName] = newName;
  }

  public get(name: string): string {
    // If the name appears in the _nameMap, we need to read its new name.
    // We have to loop over the dict just in case, the new name also gets renamed.
    while (this._nameMap[name]) {
      name = this._nameMap[name];
    }

    return name;
  }
}

export abstract class Model {
  protected _parent: Model;
  protected _name: string;
  protected _description: string;

  protected _data: Data;

  /** Name map for data sources, which can be renamed by a model's parent. */
  protected _dataNameMap: NameMap;

  /** Name map for scales, which can be renamed by a model's parent. */
  protected _scaleNameMap: NameMap;

  /** Name map for size, which can be renamed by a model's parent. */
  protected _sizeNameMap: NameMap;

  protected _transform: Transform;
  protected _scale: Dict<Scale>;

  protected _axis: Dict<AxisProperties>;

  protected _legend: Dict<LegendProperties>;

  protected _config: Config;

  protected _warnings: string[] = [];

  protected _children: Model[];  // LayerModel | RepeatModel
  protected _child: Model;       // FacetModel

  /**
   * Current iterator value over the repeat value. Indexed by the channel we are repeating over (row, column).
   */
  private _repeatValues: RepeatValues = null;

  public component: Component;

  constructor(spec: BaseSpec, parent: Model, parentGivenName: string, repeatValues: RepeatValues) {
    this._parent = parent;

    // If name is not provided, always use parent's givenName to avoid name conflicts.
    this._name = spec.name || parentGivenName;

    this._repeatValues = repeatValues;

    // Shared name maps
    this._dataNameMap = parent ? parent._dataNameMap : new NameMap();
    this._scaleNameMap = parent ? parent._scaleNameMap : new NameMap();
    this._sizeNameMap = parent ? parent._sizeNameMap : new NameMap();

    this._data = spec.data;

    this._description = spec.description;
    this._transform = spec.transform;

    this.component = {data: null, layout: null, selection: null, mark: null, scale: null, axis: null, axisGroup: null, gridGroup: null, legend: null};
    this._children = [];
  }

  public parse() {
    this.parseSelection();
    this.parseData();
    this.parseLayoutData();
    this.parseScale(); // depends on data name
    this.parseAxis(); // depends on scale name
    this.parseLegend(); // depends on scale name
    this.parseAxisGroup(); // depends on child axis
    this.parseGridGroup();
    this.parseMark(); // depends on data name and scale name, axisGroup, gridGroup and children's scale, axis, legend and mark.
  }

  public parseSelection() {}

  public abstract parseData();

  public abstract parseLayoutData();

  public abstract parseScale();

  public abstract parseMark();

  public abstract parseAxis();

  public abstract parseLegend();

  // TODO: revise if these two methods make sense for shared scale concat
  public abstract parseAxisGroup();
  public abstract parseGridGroup();


  public abstract assembleData(data: VgData[]): VgData[];

  public abstract assembleLayout(layoutData: VgData[]): VgData[];

  public assemblePreSelectionData(data): VgData[] { return []; }
  public assemblePostSelectionData(data): VgData[] { return []; }
  public assembleSignals(signals) { return []; }

  public assembleScales(): VgScale[] {
    // FIXME: write assembleScales() in scale.ts that
    // help assemble scale domains with scale signature as well
    return flatten(vals(this.component.scale).map((scales: ScaleComponents) => {
      let arr = [scales.main];
      if (scales.colorLegend) {
        arr.push(scales.colorLegend);
      }
      if (scales.binColorLegend) {
        arr.push(scales.binColorLegend);
      }
      return arr;
    }));
  }

  public abstract assembleMarks(): any[]; // TODO: VgMarkGroup[]

  public assembleAxes(): VgAxis[] {
    return vals(this.component.axis);
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

  public abstract assembleParentGroupProperties(cellConfig: CellConfig);

  public abstract channels(): Channel[];

  protected abstract mapping();

  public reduce(f: (acc: any, fd: FieldDef, c: Channel) => any, init, t?: any) {
    const model = this;
    // wrap function to replace with correct fieldDef
    function func(acc: any, fd: FieldDef, c: Channel) {
      if (isRepeatRef(fd.field)) {
        return f(acc, model.fieldDef(c), c);
      } else {
        return f(acc, fd, c);
      }
    }
    return channelMappingReduce(this.channels(), this.mapping(), func, init, t);
  }

  public forEach(f: (fd: FieldDef, c: Channel, i:number) => void, t?: any) {
    const model = this;
    // wrap function to replace with correct fieldDef
    function func(fd: FieldDef, c: Channel, i:number) {
      if (isRepeatRef(fd.field)) {
        f(model.fieldDef(c), c, i);
      } else {
        f(fd, c, i);
      }
    }
    channelMappingForEach(this.channels(), this.mapping(), func, t);
  }

  public abstract has(channel: Channel): boolean;

  public parent(): Model {
    return this._parent;
  }

  public name(text?: string, delimiter: string = '_') {
    return (this._name ? this._name + delimiter : '') + (text || '');
  }

  public description() {
    return this._description;
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
  public dataName(dataSourceType: DataTable): string {
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

  public transform(): Transform {
    return this._transform || {};
  }

  /**
   * Just the raw field. Get's the value from the iterator if the parent is iterating.
   * TODO: this is the same as model.field(channel, {nofn: true}). We should maybe remove that option and use optional args.
   */
  public fieldOrig(channel: Channel): string {
    const fieldDef = this.fieldDef(channel);
    return fieldDef.field as string;
  }

  public abstract isRepeatRef(channel: Channel): boolean;

  /**
   * Get the field reference for vega
   */
  public field(channel: Channel, opt: FieldRefOption = {}, fieldDef = this.fieldDef(channel)): string {
    if (fieldDef.bin) { // bin has default suffix that depends on scaleType
      opt = extend({
        binSuffix: this.scale(channel).type === ScaleType.ORDINAL ? '_range' : '_start'
      }, opt);
    }

    return field(fieldDef, opt);
  }

  /**
   * Get the value of the repeater or undefined if the model des not have repeat values set.
   */
  public repeatValue(channel: Channel) {
    return this._repeatValues && this._repeatValues[channel];
  }

  public abstract fieldDef(channel: Channel): FieldDef;

  public scale(channel: Channel): Scale {
    return this._scale[channel];
  }

  // TODO: rename to hasOrdinalScale
  public isOrdinalScale(channel: Channel) {
    const scale = this.scale(channel);
    return scale && scale.type === ScaleType.ORDINAL;
  }

  public renameScale(oldName: string, newName: string) {
    this._scaleNameMap.rename(oldName, newName);
  }

  /**
   * returns scale name for a given channel
   */
  public scaleName(channel: Channel | string): string {
    return this._scaleNameMap.get(this.name(String(channel)));
  }

  public sort(channel: Channel) {
    return (this.fieldDef(channel) as any).sort;
  }

  public abstract stack();

  public axis(channel: Channel): AxisProperties {
    return this._axis[channel];
  }

  public legend(channel: Channel): LegendProperties {
    return this._legend[channel];
  }

  /**
   * Get the spec configuration.
   */
  public config(): Config {
    return this._config;
  }

  public addWarning(message: string) {
    warning(message);
    this._warnings.push(message);
  }

  public warnings(): string[] {
    return this._warnings;
  }

  public children() {
    return this._children.length ? this._children : array(this._child);
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
  public isRepeat() {
    return false;
  }
  public isConcat() {
    return false;
  }
}

export function isUnitModel(model: Model): model is UnitModel {
  return model.isUnit();
}

export function isLayerModel(model: Model): model is LayerModel {
  return model.isLayer();
}

export function isRepeatModel(model: Model): model is RepeatModel {
  return model.isRepeat();
}
