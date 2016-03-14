import {COLUMN, ROW, X, Y, Channel, UNIT_CHANNELS} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import {extend, keys, vals, flatten, duplicate, mergeDeep, Dict} from '../util';
import {defaultConfig, Config} from '../config';
import {LayerSpec} from '../spec';
import {assembleData, parseLayerData} from './data';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef, isDimension} from '../fielddef';
import {ScaleComponent} from './scale';
import {Scale, ScaleType} from '../scale';
import {VgData, VgMarkGroup, VgScale, VgAxis, VgLegend} from '../vega.schema';


export class LayerModel extends Model {
  private _children: UnitModel[];

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    this._config = this._initConfig(spec.config, parent);
    this._children = spec.layers.map((layer, i) => {
      // we know that the model has to be a unit model beacuse we pass in a unit spec
      return buildModel(layer, this, this.name('layer-' + i)) as UnitModel;
    });
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  public has(channel: Channel): boolean {
    // layer does not have any channels
    return false;
  }

  public children() {
    return this._children;
  }

  private hasSummary() {
    const summary = this.component.data.summary;
    for (let i = 0; i < summary.length; i++) {
      if (keys(summary[i].measures).length > 0) {
        return true;
      }
    }
    return false;
  }

  public dataTable(): string {
    return (this.hasSummary() ? SUMMARY : SOURCE) + '';
  }

  public fieldDef(channel: Channel): FieldDef {
    return null; // layer does not have field defs
  }

  public stack() {
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
    this._children.forEach((child) => {
      child.parseLayoutData();
    });
    this.component.layout = parseLayerLayout(this);
  }

  public parseScale() {
    const model = this;

    let scaleComponent = this.component.scale = {} as Dict<ScaleComponent[]>;

    this._children.forEach(function(child) {
      child.parseScale();

      // TODO: correctly implement independent scale
      if (true) { // if shared/union scale
        keys(child.component.scale).forEach(function(channel) {
          let newScales = child.component.scale[channel] as ScaleComponent[];
          if (!newScales) {
            return;
          }

          let allScales;

          const existingScales = scaleComponent[channel];
          if (existingScales && newScales[0].type === ScaleType.ORDINAL) {
            // Ordinal scales are unioned by combining the domain of the first scale. Other scales are appended.
            const existingDomain = existingScales[0].domain.fields ? existingScales[0].domain : {fields: [existingScales[0].domain]};
            newScales[0].domain = {
              // assumes that the new scale domain is not a list
              fields: existingDomain.fields.concat([newScales[0].domain])
            };
            if (existingScales.length > 1) {
              delete existingScales[0];
              allScales = newScales.concat(existingScales);
            } else {
              allScales = newScales;
            }
          } else {
            // Quantitative scales are simply overridden.
            allScales = newScales;
          }

          // for each new scale, need to rename old scales
          newScales.forEach(function(scale) {
            const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
            const newName = model.scaleName(scaleNameWithoutPrefix);
            child.renameScale(scale.name, newName);
            scale.name = newName;
          });

          scaleComponent[channel] = allScales;

          // Once put in parent, just remove the child's scale.
          delete child.component.scale[channel];
        });
      }
    });
  }

  public parseMark() {
    const model = this;
    this.component.mark = [];

    this._children.forEach(function(child) {
      child.parseMark();
      model.component.mark = model.component.mark.concat(child.component.mark);
    });
  }

  public parseAxis() {
    let axisComponent = this.component.axis = {} as Dict<VgAxis[]>;

    this._children.forEach(function(child) {
      child.parseAxis();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.axis).forEach(function(channel) {
          axisComponent[channel] = child.component.axis[channel];
        });
      }
    });
  }

  public parseAxisGroup() {
    return null;
  }

  public parseGridGroup() {
    return null;
  }

  public parseLegend() {
  }

  public assembleParentGroupProperties() {
    return null;
  }

  public assembleData(data: VgData[]): VgData[] {
    assembleData(this, data);
    return this._children.reduce((childData, child) => {
      return child.assembleData(childData);
    }, data);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    return layoutData;
    // this._children.reduce((childLayoutData, child) => {
    //   return child.assembleLayout(childLayoutData);
    // }, layoutData);
    // return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    return this.component.mark;
  }

  public channels() {
    return [];
  }

  protected mapping() {
    return null;
  }
}
