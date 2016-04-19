import {Channel, CHANNELS} from '../channel';
import {keys, flatten, unique, Dict, forEach, extend} from '../util';
import {defaultConfig, Config} from '../config';
import {LayerSpec, ResolveMapping, Resolve, INDEPENDENT, SHARED} from '../spec';
import {assembleData, parseLayerData} from './data/data';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model} from './model';
import {UnitModel} from './unit';
import {buildModel} from './common';
import {FieldDef} from '../fielddef';
import {ScaleComponents, mergeScales} from './scale';
import {VgData, VgAxis, VgLegend} from '../vega.schema';


export class LayerModel extends Model {
  private _children: UnitModel[];

  // resolve for every channel used in children
  private _resolve: ResolveMapping;

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string) {
    super(spec, parent, parentGivenName);

    this._children = spec.layers.map((layer, i) => {
      // we know that the model has to be a unit model beacuse we pass in a unit spec
      return buildModel(layer, this, this.name('layer_' + i)) as UnitModel;
    });

    this._resolve = this._initResolve(spec.resolve || {});
  }

  private _initResolve(resolve: ResolveMapping): ResolveMapping {
    // Figure out which fields have different field types and make those independent.
    // Use resolve for all other fields with default shared.

    for (var i = 0; i < CHANNELS.length; i++) {
      var channel = CHANNELS[i];
      var types = unique(this.children().map((child: UnitModel) => {
        const fd = child.fieldDef(channel);
        if (fd) {
          return fd.type;
        }
        return undefined;
      }).filter((type) => !!type));

      if (types.length > 1) {
        resolve[channel] = {
          scale: INDEPENDENT,
          guide: INDEPENDENT
        };
      } else if (types.length === 1) {
        resolve[channel] = extend({
          scale: SHARED,
          guide: SHARED
        }, resolve[channel]);
      }
    }

    return resolve;
  }

  public has(channel: Channel): boolean {
    // layer does not have any channels
    console.error('weird');
    return false;
  }

  public children() {
    return this._children;
  }

  public isOrdinalScale(channel: Channel) {
    // doesn't make sense to ask this
    console.error('weird');
    return this._children[0].isOrdinalScale(channel);
  }

  public dataTable(): string {
    // FIXME: don't just use the first child
    return this._children[0].dataTable();
  }

  public fieldDef(channel: Channel): FieldDef {
    console.error('weird');
    return null; // layer does not have field defs
  }

  public stack() {
    console.error('weird');
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
    this._children.forEach((child, i) => {
      child.parseLayoutData();
    });
    this.component.layout = parseLayerLayout(this);
  }

  public parseScale() {
    this._children.forEach(function (child) {
      child.parseScale();
    });

    let scaleComponent = this.component.scale = {} as Dict<ScaleComponents>;

    forEach(this._resolve, (resolve: Resolve, channel: string) => {
      if (resolve.scale === INDEPENDENT) {
        // independent scales are simply moved up with a new key that includes the child name
        this.children().forEach((child)=> {
          scaleComponent[child.name(channel)] = child.component.scale[channel];
          delete child.component.scale[channel];
        });
      } else {
        scaleComponent[channel] = mergeScales(this, channel);
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
    return null;
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

  public channels() {
    return [];
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
