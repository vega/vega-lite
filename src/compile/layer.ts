import {Channel} from '../channel';
import {defaultConfig, CellConfig, Config} from '../config';
import {FieldDef} from '../fielddef';
import {LayerSpec} from '../spec';
import {StackProperties} from '../stack';
import {FILL_STROKE_CONFIG} from '../mark';
import {keys, duplicate, mergeDeep, flatten, vals} from '../util';
import {VgData, VgEncodeEntry} from '../vega.schema';
import {isUrlData} from '../data';

import {assembleData, parseLayerData} from './data/data';
import {applyConfig, buildModel} from './common';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model} from './model';
import {UnitModel} from './unit';

import {ScaleComponents} from './scale/scale';
import {unionDomains} from './scale/domain';


export class LayerModel extends Model {
  private _children: UnitModel[];

  /**
   * Fixed width for the unit visualization.
   * If undefined (e.g., for ordinal scale), the width of the
   * visualization will be calculated dynamically.
   */
  private readonly _width: number;

  /**
   * Fixed height for the unit visualization.
   * If undefined (e.g., for ordinal scale), the height of the
   * visualization will be calculated dynamically.
   */
  private readonly _height: number;


  constructor(spec: LayerSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    this._width = spec.width;
    this._height = spec.height;

    this._config = this._initConfig(spec.config, parent);
    this._children = spec.layer.map((layer, i) => {
      // we know that the model has to be a unit model because we pass in a unit spec
      return buildModel(layer, this, this.name('layer_' + i)) as UnitModel;
    });
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public channelHasField(_: Channel): boolean {
    // layer does not have any channels
    return false;
  }

  public children() {
    return this._children;
  }

  public hasDiscreteScale(channel: Channel) {
    // since we assume shared scales we can just ask the first child
    return this._children[0].hasDiscreteScale(channel);
  }

  public dataTable() {
    // FIXME: don't just use the first child
    return this._children[0].dataTable();
  }

  public fieldDef(_: Channel): FieldDef {
    return null; // layer does not have field defs
  }

  public stack(): StackProperties {
    return null; // this is only a property for UnitModel
  }

  public parseData() {
    this._children.forEach((child) => {
      child.parseData();
    });
    this.component.data = parseLayerData(this);
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    this._children.forEach(child => {
      child.parseLayoutData();
    });
    this.component.layout = parseLayerLayout(this);
  }

  public parseScale(this: LayerModel) {
    const model = this;

    let scaleComponent = this.component.scale = {};

    this._children.forEach(function(child) {
      child.parseScale();

      // FIXME(#1602): correctly implement independent scale
      // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error
      if (true) { // if shared/union scale
        keys(child.component.scale).forEach(function(channel) {
          let childScales: ScaleComponents = child.component.scale[channel];
          if (!childScales) {
            // the child does not have any scales so we have nothing to merge
            return;
          }

          const modelScales: ScaleComponents = scaleComponent[channel];
          if (modelScales && modelScales.main) {
            // Scales are unioned by combining the domain of the main scale.
            // Other scales that are used for ordinal legends are appended.

            modelScales.main.domain = unionDomains(modelScales.main.domain, childScales.main.domain);
            modelScales.binLegend = modelScales.binLegend ? modelScales.binLegend : childScales.binLegend;
            modelScales.binLegendLabel = modelScales.binLegendLabel ? modelScales.binLegendLabel : childScales.binLegendLabel;
          } else {
            scaleComponent[channel] = childScales;
          }

          // rename child scales to parent scales
          vals(childScales).forEach(function(scale: any) {
            const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
            const newName = model.scaleName(scaleNameWithoutPrefix, true);
            child.renameScale(scale.name, newName);
            scale.name = newName;
          });

          delete childScales[channel];
        });
      }
    });
  }

  public parseMark() {
    this._children.forEach(function(child) {
      child.parseMark();
    });
  }

  public parseAxis() {
    let axisComponent = this.component.axis = {};

    this._children.forEach(function(child) {
      child.parseAxis();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.axis).forEach(function(channel) {
          // TODO: support multiple axes for shared scale

          // just use the first axis definition for each channel
          if (!axisComponent[channel]) {
            axisComponent[channel] = child.component.axis[channel];
          }
        });
      }
    });
  }

  public parseAxisGroup(): void {
    return null;
  }

  public parseGridGroup(): void {
    return null;
  }

  public parseLegend() {
    let legendComponent = this.component.legend = {};

    this._children.forEach(function(child) {
      child.parseLegend();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.legend).forEach(function(channel) {
          // just use the first legend definition for each channel
          if (!legendComponent[channel]) {
            legendComponent[channel] = child.component.legend[channel];
          }
        });
      }
    });
  }

  public assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry {
    return applyConfig({}, cellConfig, FILL_STROKE_CONFIG.concat(['clip']));
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred to by children data
    assembleData(this, data);
    this._children.forEach((child) => {
      child.assembleData(data);
    });
    return data;
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this._children.forEach((child) => {
      child.assembleLayout(layoutData);
    });
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    // only children have marks
    return flatten(this._children.map((child) => {
      return child.assembleMarks();
    }));
  }

  public channels(): Channel[] {
    return [];
  }

  protected mapping(): any {
    return null;
  }

  public isLayer() {
    return true;
  }

  /**
   * Returns true if the child either has no source defined or uses the same url.
   * This is useful if you want to know whether it is possible to move a filter up.
   *
   * This function can only be called once th child has been parsed.
   */
  public compatibleSource(child: UnitModel) {
    const data = this.data();
    const childData = child.component.data;
    const compatible = !childData.source || (data && isUrlData(data) && data.url === childData.source.url);
    return compatible;
  }
}
