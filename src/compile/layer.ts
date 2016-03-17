import {X, Y, Channel} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import {keys, duplicate, mergeDeep, flatten, Dict} from '../util';
import {defaultConfig, Config} from '../config';
import {LayerSpec} from '../spec';
import {assembleData, parseLayerData} from './data';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef} from '../fielddef';
import {ScaleComponent} from './scale';
import {ScaleType} from '../scale';
import {VgData, VgAxis, VgLegend} from '../vega.schema';


export class LayerModel extends Model {
  private _children: UnitModel[];

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    this._config = this._initConfig(spec.config, parent);
    this._children = spec.layers.map((layer, i) => {
      // we know that the model has to be a unit model beacuse we pass in a unit spec
      return buildModel(layer, this, this.name('layer_' + i)) as UnitModel;
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
    // TODO: don't just use the first child
    const summary = this._children[0].component.data.summary;
    for (let i = 0; i < summary.length; i++) {
      if (keys(summary[i].measures).length > 0) {
        return true;
      }
    }
    return false;
  }

  public isOrdinalScale(channel: Channel) {
    // since we assume shared scales we can just ask the first child
    return this._children[0].isOrdinalScale(channel);
  }

  public dataTable(): string {
    // TODO: think about what this should return, used by layout
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
    console.log(this.component.data);
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    this._children.forEach((child, i) => {
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

          const existingScales = scaleComponent[channel];
          if (existingScales && newScales[0].type === ScaleType.ORDINAL) {
            // Ordinal scales are unioned by combining the domain of the first scale. Other scales are appended.
            const existingDomain = existingScales[0].domain.fields ? existingScales[0].domain : { fields: [existingScales[0].domain] };
            newScales[0].domain = {
              // assumes that the new scale domain is not a list
              fields: existingDomain.fields.concat([newScales[0].domain])
            };
            if (existingScales.length > 1) {
              delete existingScales[0];
              scaleComponent[channel] = newScales.concat(existingScales);
            } else {
              scaleComponent[channel] = newScales;
            }
          } else {
            // Use the first quantitative scale
            if (!scaleComponent[channel]) {
              scaleComponent[channel] = newScales;
            }
          }

          // for each new scale, need to rename old scales
          newScales.forEach(function(scale) {
            const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
            const newName = model.scaleName(scaleNameWithoutPrefix);
            child.renameScale(scale.name, newName);
            scale.name = newName;
          });
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
    let axisComponent = this.component.axis = {} as Dict<VgAxis[]>;

    this._children.forEach(function(child) {
      child.parseAxis();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.axis).forEach(function(channel) {
          // just use the first axis definition for each channel
          if (!axisComponent[channel]) {
            axisComponent[channel] = child.component.axis[channel];
          }
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
    let legendComponent = this.component.legend = {} as Dict<VgLegend>;

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

  public assembleParentGroupProperties() {
    return null;
  }

  public assembleData(data: VgData[]): VgData[] {
    assembleData(this, data);
    return this._children.reduce((aggregator, child) => {
      return child.assembleData(aggregator);
    }, data);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    layoutData = this._children.reduce((aggregator, child) => {
      return child.assembleLayout(aggregator);
    }, layoutData);
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    // only children have marks
    return flatten(this._children.map((child) => {
      return child.assembleMarks();
    }));
  }

  public channels() {
    return [];
  }

  protected mapping() {
    return null;
  }
}
