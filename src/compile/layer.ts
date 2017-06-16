import {NonspatialScaleChannel, ScaleChannel, SpatialScaleChannel} from '../channel';
import {Config} from '../config';
import * as log from '../log';
import {FILL_STROKE_CONFIG} from '../mark';
import {initLayerResolve, NonspatialResolve, ResolveMapping, SpatialResolve} from '../resolve';
import {isLayerSpec, isUnitSpec, LayerSpec, UnitSize} from '../spec';
import {Dict, flatten, keys, vals} from '../util';
import {isSignalRefDomain, VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal} from '../vega.schema';
import {AxisComponentIndex} from './axis/component';
import {applyConfig, buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutLayerSignals} from './layout/index';
import {moveSharedLegendUp} from './legend/parse';
import {Model} from './model';
import {RepeaterValue} from './repeat';
import {ScaleComponent, ScaleComponentIndex} from './scale/component';
import {unionDomains} from './scale/domain';
import {moveSharedScaleUp} from './scale/parse';
import {assembleLayerSelectionMarks} from './selection/selection';
import {UnitModel} from './unit';


export class LayerModel extends Model {

  // HACK: This should be (LayerModel | UnitModel)[], but setting the correct type leads to weird error.
  // So I'm just putting generic Model for now.
  public readonly children: Model[];

  private readonly resolve: ResolveMapping;

  constructor(spec: LayerSpec, parent: Model, parentGivenName: string,
    parentUnitSize: UnitSize, repeater: RepeaterValue, config: Config) {

    super(spec, parent, parentGivenName, config);

    this.resolve = initLayerResolve(spec.resolve || {});

    const unitSize = {
      ...parentUnitSize,
      ...(spec.width ? {width: spec.width} : {}),
      ...(spec.height ? {height: spec.height} : {})
    };

    this.children = spec.layer.map((layer, i) => {
      if (isLayerSpec(layer)) {
        return new LayerModel(layer, this, this.getName('layer_'+i), unitSize, repeater, config);
      }

      if (isUnitSpec(layer)) {
        return new UnitModel(layer, this, this.getName('layer_'+i), unitSize, repeater, config);
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

  public parseScale(this: LayerModel) {
    const scaleComponent: ScaleComponentIndex = this.component.scales = {};

    for (const child of this.children) {
      child.parseScale();

      keys(child.component.scales).forEach((channel: ScaleChannel) => {
        if (this.resolve[channel].scale === 'shared') {
          moveSharedScaleUp(this, scaleComponent, child, channel);
        }
      });
    }
  }

  public parseMark() {
    for (const child of this.children) {
      child.parseMark();
    }
  }

  public parseAxisAndHeader() {
    const axisComponent: AxisComponentIndex = this.component.axes = {};

    for (const child of this.children) {
      child.parseAxisAndHeader();

      keys(child.component.axes).forEach((channel: SpatialScaleChannel) => {
        if ((this.resolve[channel] as SpatialResolve).axis === 'shared') {
          // If shared/union axis

          // Just use the first axes definition for each channel
          // TODO: what if the axes from different children are not compatible
          if (!axisComponent[channel]) {
            axisComponent[channel] = child.component.axes[channel];
          }
        } else {
          // If axes are independent
          // TODO(#2251): correctly merge axis
          if (!axisComponent[channel]) {
            // copy the first axis
            axisComponent[channel] = child.component.axes[channel];
          } else {
            // put every odd numbered axis on the right/top
            axisComponent[channel].axes.push({
              ...child.component.axes[channel].axes[0],
              ...(axisComponent[channel].axes.length % 2 === 1 ? {orient: channel === 'y' ? 'right' : 'top'} : {})
            });
            if (child.component.axes[channel].gridAxes.length > 0) {
              axisComponent[channel].gridAxes.push({
                ...child.component.axes[channel].gridAxes[0]
              });
            }
          }
        }
        // delete child.component.axes[channel];
      });
    }
  }

  public parseLegend() {
    const legendComponent = this.component.legends = {};

    for (const child of this.children) {
      child.parseLegend();

      keys(child.component.legends).forEach((channel: NonspatialScaleChannel) => {
        if (this.resolve[channel].legend === 'shared') {
          moveSharedLegendUp(legendComponent, child, channel);
        }
      });
    }
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
    }, assembleLayoutLayerSignals(this));
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

  public assembleScales(): VgScale[] {
    // combine with scales from children
    return this.children.reduce((scales, c) => {
      return scales.concat(c.assembleScales());
    }, super.assembleScales());
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
