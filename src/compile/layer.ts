import {NonspatialScaleChannel, ScaleChannel, SpatialScaleChannel} from '../channel';
import {Config} from '../config';
import * as log from '../log';
import {FILL_STROKE_CONFIG} from '../mark';
import {NonspatialResolve, ResolveMapping, SpatialResolve} from '../resolve';
import {isLayerSpec, isUnitSpec, LayerSpec, LayoutSizeMixins} from '../spec';
import {Dict, flatten, keys, vals} from '../util';
import {isSignalRefDomain, VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal, VgTitle} from '../vega.schema';
import {AxisComponentIndex} from './axis/component';
import {parseLayerAxis} from './axis/parse';
import {applyConfig, buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutSignals} from './layout/assemble';
import {parseLayerLayoutSize} from './layout/parse';
import {parseNonUnitLegend} from './legend/parse';
import {Model} from './model';
import {RepeaterValue} from './repeat';
import {assembleScaleForModelAndChildren} from './scale/assemble';
import {ScaleComponent, ScaleComponentIndex} from './scale/component';
import {assembleLayerSelectionMarks} from './selection/selection';
import {UnitModel} from './unit';


export class LayerModel extends Model {

  // HACK: This should be (LayerModel | UnitModel)[], but setting the correct type leads to weird error.
  // So I'm just putting generic Model for now.
  public readonly children: Model[];



  constructor(spec: LayerSpec, parent: Model, parentGivenName: string,
    parentGivenSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config) {

    super(spec, parent, parentGivenName, config, spec.resolve);

    const layoutSize = {
      ...parentGivenSize,
      ...(spec.width ? {width: spec.width} : {}),
      ...(spec.height ? {height: spec.height} : {})
    };

    this.initSize(layoutSize);

    this.children = spec.layer.map((layer, i) => {
      if (isLayerSpec(layer)) {
        return new LayerModel(layer, this, this.getName('layer_'+i), layoutSize, repeater, config);
      }

      if (isUnitSpec(layer)) {
        return new UnitModel(layer, this, this.getName('layer_'+i), layoutSize, repeater, config);
      }

      throw new Error(log.message.INVALID_SPEC);
    });
  }

  public parseData() {
    this.component.data = parseData(this);
    for (const child of this.children) {
      child.parseData();
    }
  }

  public parseLayoutSize() {
    parseLayerLayoutSize(this);
  }

  public parseSelection() {
    // Merge selections up the hierarchy so that they may be referenced
    // across unit specs. Persist their definitions within each child
    // to assemble signals which remain within output Vega unit groups.
    this.component.selection = {};
    for (const child of this.children) {
      child.parseSelection();
      keys(child.component.selection).forEach((key) => {
        this.component.selection[key] = child.component.selection[key];
      });
    }
  }

  public parseMarkGroup() {
    for (const child of this.children) {
      child.parseMarkGroup();
    }
  }

  public parseAxisAndHeader() {
    parseLayerAxis(this);
  }

  public parseLegend() {
    parseNonUnitLegend(this);
  }

  public assembleParentGroupProperties(): VgEncodeEntry {
    return {
      width: this.getSizeSignalRef('width'),
      height: this.getSizeSignalRef('height'),
      ...applyConfig({}, this.config.cell, FILL_STROKE_CONFIG.concat(['clip']))
    };
  }

  public assembleSelectionTopLevelSignals(signals: any[]): VgSignal[] {
    return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
  }

  // TODO: Support same named selections across children.
  public assembleSelectionSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleSelectionSignals());
    }, []);
  }


  public assembleLayoutSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleLayoutSignals());
    }, assembleLayoutSignals(this));
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return this.children.reduce((db, child) => child.assembleSelectionData(db), []);
  }

  public assembleData(): VgData[] {
     if (!this.parent) {
      // only assemble data in the root
      return assembleData(this.component.data);
    }
    return [];
  }

  public assembleTitle(): VgTitle {
    if (this.title) {
      return this.title;
    }
    // If title does not provide layer, look into children
    for (const child of this.children) {
      if (child.title) {
        return child.title;
      }
    }
    return undefined;
  }

  public assembleScales(): VgScale[] {
    return assembleScaleForModelAndChildren(this);
  }

  public assembleLayout(): VgLayout {
    return null;
  }

  public assembleMarks(): any[] {
    return assembleLayerSelectionMarks(this, flatten(this.children.map((child) => {
      return child.assembleMarks();
    })));
  }
}
