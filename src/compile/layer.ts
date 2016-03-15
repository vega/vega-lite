import {X, Y, Channel} from '../channel';
import {SOURCE, SUMMARY} from '../data';
import {keys, duplicate, mergeDeep, Dict, forEach} from '../util';
import {defaultConfig, Config} from '../config';
import {LayerSpec} from '../spec';
import {assembleData, parseLayerData} from './data';
import {assembleLayout, parseLayerLayout, LayoutComponent} from './layout';
import {Model} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef} from '../fielddef';
import {ScaleComponent} from './scale';
import {ScaleType} from '../scale';
import {VgData,VgAxis} from '../vega.schema';


export class LayerModel extends Model {
  private _children: UnitModel[];

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    this._config = this._initConfig(spec.config, parent);
    this._children = spec.layers.map((layer, i) => {
      // we know that the model has to be a unit model beacuse we pass in a unit spec
      return buildModel(layer, this, this.name('layer' + i)) as UnitModel;
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

  public isOrdinalScale(channel: Channel) {
    // since we assume shared scales we can just ask the first child
    return this._children[0].isOrdinalScale(channel);
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
      console.log(child.component.data);
    });

    this.component.data = parseLayerData(this);
  }

  public parseSelectionData() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  private _mergeLayout(target: LayoutComponent, source: LayoutComponent, channel: Channel) {
    if (channel === X) {
      forEach(source.width.distinct, (_, field) => {
        target.width.distinct[field] = true;
      });
      source.width.formula.forEach((formula) => {
        target.width.formula.push(formula);
      });
    } else if (channel === Y) {
      // height
      forEach(source.height.distinct, (_, field) => {
        target.height.distinct[field] = true;
      });
      source.height.formula.forEach((formula) => {
        target.height.formula.push(formula);
      });
    }
    return target;
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    const model = this;
    let layoutComponent = this.component.layout = {
      width: {
        distinct: {},
        formula: []
      },
      height: {
        distinct: {},
        formula: []
      }
    };

    this._children.forEach((child, i) => {
      child.parseLayoutData();

      [X, Y].forEach((channel) => {
        if (model.isOrdinalScale(channel)) {
          if (i === 0) {
            if (channel === X) {
              layoutComponent.width = child.component.layout.width;
              layoutComponent.width.formula[0].field = 'width';
            } else {
              layoutComponent.height = child.component.layout.height;
              layoutComponent.height.formula[0].field = 'height';
            }
          }
        } else {
          layoutComponent = model._mergeLayout(layoutComponent, child.component.layout, channel);
        }
      });
    });

    [X, Y].forEach((channel) => {
      if (!model.isOrdinalScale(channel)) {
        layoutComponent = this._mergeLayout(layoutComponent, parseLayerLayout(this), channel);
      }
    });
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
            const existingDomain = existingScales[0].domain.fields ? existingScales[0].domain : { fields: [existingScales[0].domain] };
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
    return this._children.reduce((childData, child) => {
      return child.assembleData(childData);
    }, data);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    this._children.reduce((childLayoutData, child) => {
      return child.assembleLayout(childLayoutData);
    }, layoutData);
    return assembleLayout(this, layoutData);
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
