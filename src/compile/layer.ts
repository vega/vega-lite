import {Axis} from '../axis';
import {Channel} from '../channel';
import {CellConfig, Config} from '../config';
import {FieldDef} from '../fielddef';
import {Legend} from '../legend';
import {FILL_STROKE_CONFIG} from '../mark';
import {Scale} from '../scale';
import {LayerSpec} from '../spec';
import {StackProperties} from '../stack';
import {Dict, flatten, keys, vals} from '../util';
import {isSignalRefDomain, VgData, VgEncodeEntry, VgScale} from '../vega.schema';

import {applyConfig, buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayout, parseLayerLayout} from './layout';
import {Model} from './model';
import {unionDomains} from './scale/domain';
import {UnitModel} from './unit';


export class LayerModel extends Model {
  public readonly children: UnitModel[];

  protected readonly scales: Dict<Scale> = {};

  protected readonly axes: Dict<Axis> = {};

  protected readonly legends: Dict<Legend> = {};

  public readonly config: Config;

  public readonly stack: StackProperties = null;

  /**
   * Fixed width for the unit visualization.
   * If undefined (e.g., for ordinal scale), the width of the
   * visualization will be calculated dynamically.
   */
  public readonly width: number;

  /**
   * Fixed height for the unit visualization.
   * If undefined (e.g., for ordinal scale), the height of the
   * visualization will be calculated dynamically.
   */
  public readonly height: number;

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string, config: Config) {
    super(spec, parent, parentGivenName, config);

    this.width = spec.width;
    this.height = spec.height;

    this.children = spec.layer.map((layer, i) => {
      // FIXME: this is not always the case
      // we know that the model has to be a unit model because we pass in a unit spec
      return buildModel(layer, this, this.getName('layer_' + i), config) as UnitModel;
    });
  }

  public channelHasField(channel: Channel): boolean {
    // layer does not have any channels
    return false;
  }

  public hasDiscreteScale(channel: Channel) {
    // since we assume shared scales we can just ask the first child
    return this.children[0].hasDiscreteScale(channel);
  }

  public fieldDef(channel: Channel): FieldDef {
    return null; // layer does not have field defs
  }

  public parseData() {
    this.component.data = parseData(this);
    this.children.forEach((child) => {
      child.parseData();
    });
  }

  public parseSelection() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    // TODO: correctly union ordinal scales rather than just using the layout of the first child
    this.children.forEach(child => {
      child.parseLayoutData();
    });
    this.component.layout = parseLayerLayout(this);
  }

  public parseScale(this: LayerModel) {
    const model = this;

    const scaleComponent: Dict<VgScale> = this.component.scales = {};

    this.children.forEach(function(child) {
      child.parseScale();

      // FIXME(#1602): correctly implement independent scale
      // Also need to check whether the scales are actually compatible, e.g. use the same sort or throw error
      if (true) { // if shared/union scale
        keys(child.component.scales).forEach(function(channel) {
          const childScale = child.component.scales[channel];
          const modelScale = scaleComponent[channel];

          if (!childScale || isSignalRefDomain(childScale.domain) || (modelScale && isSignalRefDomain(modelScale.domain))) {
            // TODO: merge signal ref domains
            return;
          }

          if (modelScale) {
            modelScale.domain = unionDomains(modelScale.domain, childScale.domain);
          } else {
            scaleComponent[channel] = childScale;
          }

          // rename child scale to parent scales
          const scaleNameWithoutPrefix = childScale.name.substr(child.getName('').length);
          const newName = model.scaleName(scaleNameWithoutPrefix, true);
          child.renameScale(childScale.name, newName);
          childScale.name = newName;

          // remove merged scales from children
          delete child.component.scales[channel];
        });
      }
    });
  }

  public parseMark() {
    this.children.forEach(function(child) {
      child.parseMark();
    });
  }

  public parseAxis() {
    const axisComponent = this.component.axes = {};

    this.children.forEach(function(child) {
      child.parseAxis();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.axes).forEach(function(channel) {
          // TODO: support multiple axes for shared scale

          // just use the first axis definition for each channel
          if (!axisComponent[channel]) {
            axisComponent[channel] = child.component.axes[channel];
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
    const legendComponent = this.component.legends = {};

    this.children.forEach(function(child) {
      child.parseLegend();

      // TODO: correctly implement independent axes
      if (true) { // if shared/union scale
        keys(child.component.legends).forEach(function(channel) {
          // just use the first legend definition for each channel
          if (!legendComponent[channel]) {
            legendComponent[channel] = child.component.legends[channel];
          }
        });
      }
    });
  }

  public assembleParentGroupProperties(cellConfig: CellConfig): VgEncodeEntry {
    return applyConfig({}, cellConfig, FILL_STROKE_CONFIG.concat(['clip']));
  }

  public assembleSignals(signals: any[]): any[] {
    return [];
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return [];
  }

  public assembleData(): VgData[] {
     if (!this.parent) {
      // only assemble data in the root
      return assembleData(vals(this.component.data.sources));
    }
    return [];
  }

  public assembleScales(): VgScale[] {
    // combine with scales from children
    return this.children.reduce((scales, c) => {
      return scales.concat(c.assembleScales());
    }, super.assembleScales());
  }

  public assembleLayout(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this.children.forEach((child) => {
      child.assembleLayout(layoutData);
    });
    return assembleLayout(this, layoutData);
  }

  public assembleMarks(): any[] {
    // only children have marks
    return flatten(this.children.map((child) => {
      return child.assembleMarks();
    }));
  }

  public channels(): Channel[] {
    return [];
  }

  protected getMapping(): any {
    return null;
  }

  public isLayer() {
    return true;
  }
}
