import {Channel} from '../channel';
import {keys, duplicate, mergeDeep, flatten, unique, isArray, vals, forEach, hash, Dict, extend} from '../util';
import {defaultConfig, Config} from '../config';
import {LayerSpec, isUnitSpec} from '../spec';
import {assembleData, parseLayerData} from './data/data';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model, isUnitModel} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef} from '../fielddef';
import {ScaleComponents} from './scale';
import {VgData, VgAxis, VgLegend, isUnionedDomain, isDataRefDomain, VgDataRef} from '../vega.schema';
import {RepeatValues} from './repeat';
import * as selections from './selections';

export class LayerModel extends Model {
  public _select: any;  // To collate all the child selections

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string, repeatValues: RepeatValues) {
    super(spec, parent, parentGivenName, repeatValues);

    this._select = {};

    this._config = this._initConfig(spec.config, parent);
    this._children = spec.layers.map((layer, i) => {
      if (isUnitSpec(layer)) {
        layer.select = extend(this._select, layer.select);
        extend(this._select, layer.select);
      }

      // we know that the model has to be a unit model beacuse we pass in a unit spec
      return buildModel(layer, this, this.name('layer_' + i), repeatValues) as UnitModel;
    });
  }

  private _initConfig(specConfig: Config, parent: Model) {
    return mergeDeep(duplicate(defaultConfig), specConfig, parent ? parent.config() : {});
  }

  public has(channel: Channel): boolean {
    // layer does not have any channels
    return false;
  }

  public isOrdinalScale(channel: Channel) {
    // since we assume shared scales we can just ask the first child
    return this._children[0].isOrdinalScale(channel);
  }

  public dataTable(): string {
    // FIXME: don't just use the first child
    return this._children[0].dataTable();
  }

  public isRepeatRef(channel: Channel) {
    // todo
    return false;
  }

  public fieldDef(channel: Channel): FieldDef {
    return null; // layer does not have field defs
  }

  public stack() {
    return null; // this is only a property for UnitModel
  }

  public parseSelection() {
    this._select = {};
    this.component.selection = [];
    this._children.forEach((child) => {
      // Children within layers can reference selections defined prior.
      // We first parse a child's selections, then extend them with their siblings'.
      child.parseSelection();
      if (isUnitModel(child)) {
        extend(this._select, child._select);
        this.component.selection.push.apply(this.component.selection, child.selection());
      }
    });
  }

  public parseData() {
    this._children.forEach((child) => {
      child.parseData();
    });
    this.component.data = parseLayerData(this);
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    this._children.forEach((child, i) => {
      child.parseLayoutData();
    });
    this.component.layout = parseLayerLayout(this);
  }

  public parseScale() {
    // TODO:(kanitw): move logic of this function to `scale.ts` for easier readability.
    const model = this;

    let scaleComponent = this.component.scale = {} as Dict<ScaleComponents>;

    this._children.forEach(function(child) {
      child.parseScale();

      // FIXME: correctly implement independent scale
      if (true) { // if shared/union scale
        forEach(child.component.scale, function(value, channel) {
          let childScales: ScaleComponents = value;
          if (!childScales) {
            // the child does not have any scales so we have nothing to merge
            return;
          }

          const modelScales: ScaleComponents = scaleComponent[channel];
          if (modelScales && modelScales.main) {
            // Scales are unioned by combining the domain of the main scale.
            // Other scales that are used for ordinal legends are appended.
            const modelDomain = modelScales.main.domain;
            const childDomain = childScales.main.domain;

            if (isArray(modelDomain)) {
              if (isArray(childScales.main.domain)) {
                modelScales.main.domain = modelDomain.concat(childDomain);
              } else {
                model.addWarning('custom domain scale cannot be unioned with default field-based domain');
              }
            } else {
              const unionedFields = isUnionedDomain(modelDomain) ? modelDomain.fields : [modelDomain] as VgDataRef[];

              if (isArray(childDomain)) {
                model.addWarning('custom domain scale cannot be unioned with default field-based domain');
              }

              let fields = isDataRefDomain(childDomain) ? unionedFields.concat([childDomain]) :
                // if the domain is itself a union domain, concat
                isUnionedDomain(childDomain) ? unionedFields.concat(childDomain.fields) :
                  // we have to ignore explicit data domains for now because vega does not support unioning them
                  unionedFields;
              fields = unique(fields, hash);
              // TODO: if all domains use the same data, we can merge them
              if (fields.length > 1) {
                modelScales.main.domain = { fields: fields };
              } else {
                modelScales.main.domain = fields[0];
              }
            }

            // create color legend and color legend bin scales if we don't have them yet
            if (childScales.colorLegend) {
              modelScales.colorLegend = modelScales.colorLegend ? modelScales.colorLegend : childScales.colorLegend;
            }
            if (childScales.binColorLegend) {
              modelScales.binColorLegend = modelScales.binColorLegend ? modelScales.binColorLegend : childScales.binColorLegend;
            }
          } else {
            scaleComponent[channel] = childScales;
          }

          // rename child scales to parent scales
          [childScales.main, childScales.colorLegend, childScales.binColorLegend]
            .filter((x) => !!x)
            .forEach(function(scale) {
              const scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
              const newName = model.scaleName(scaleNameWithoutPrefix);
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
    let axisComponent = this.component.axis = {} as Dict<VgAxis[]>;

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
    return {
      unitName: { value: this.name() }
    };
  }

  public assembleData(data: VgData[]): VgData[] {
    // Prefix traversal – parent data might be referred to by children data
    assembleData(this, data);
    this._children.forEach((child) => {
      child.assembleData(data);
    });
    return data;
  }

  public assemblePreSelectionData(data: VgData[]): VgData[] {
    this._children.forEach((child) => child.assemblePreSelectionData(data));
    return selections.assembleCompositeData(this, data);
  }

  public assemblePostSelectionData(data: VgData[]): VgData[] {
    this._children.forEach((child) => child.assemblePostSelectionData(data));
    return selections.assembleCompositeData(this, data);
  }

  public assembleSignals(signals) {
    this._children.forEach((child) => child.assembleSignals(signals));
    return selections.assembleCompositeSignals(this, signals);
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this._children.forEach((child) => {
      child.assembleLayout(layoutData);
    });
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    var children = this._children;

    // First get the actual marks
    var marks = flatten(children.map((child) => {
      return child.assembleMarks();
    }));

    children.forEach(function(child) {
      if (isUnitModel(child)) {
        child.assembleSelectionMarks(marks);
      }
    });

    return marks;
  }

  public channels() {
    return [];
  }

  public selection(name?: string) {
    return (this._select && this._select[name]) || this.component.selection || [];
  }

  protected mapping() {
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
    const sourceUrl = this.data() && this.data().url;
    const childData = child.component.data;
    const compatible = !childData.source || (sourceUrl && sourceUrl === childData.source.url);
    return compatible;
  }
}
