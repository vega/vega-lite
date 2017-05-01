import {NonspatialScaleChannel, ScaleChannel, SpatialScaleChannel} from '../channel';
import {Config} from '../config';
import {FILL_STROKE_CONFIG} from '../mark';
import {initLayerResolve, NonspatialResolve, ResolveMapping, SpatialResolve} from '../resolve';
import {LayerSpec, UnitSize} from '../spec';
import {Dict, flatten, keys, vals} from '../util';
import {isSignalRefDomain, VgData, VgEncodeEntry, VgLayout, VgScale, VgSignal} from '../vega.schema';
import {AxesComponent} from './axis/index';
import {applyConfig, buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutLayerSignals} from './layout/index';
import {Model} from './model';
import {RepeaterValue} from './repeat';
import {unionDomains} from './scale/domain';
import {assembleLayerSelectionMarks} from './selection/selection';
import {UnitModel} from './unit';


export class LayerModel extends Model {
  public readonly children: UnitModel[];

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
      // FIXME: this is not always the case
      // we know that the model has to be a unit model because we pass in a unit spec
      return buildModel(layer, this, this.getName('layer_' + i), unitSize, repeater, config) as UnitModel;
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
    const model = this;

    const scaleComponent: Dict<VgScale> = this.component.scales = {};

    for (const child of this.children) {
      child.parseScale();

      // Check whether the scales are actually compatible, e.g. use the same sort or throw error
      keys(child.component.scales).forEach((channel: ScaleChannel) => {
        if (this.resolve[channel].scale === 'shared') {
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
    const axisComponent: AxesComponent = this.component.axes = {};

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

      // TODO: correctly implement independent axes
      keys(child.component.legends).forEach((channel: NonspatialScaleChannel) => {
        if ((this.resolve[channel] as NonspatialResolve).legend === 'shared') { // if shared/union scale
          // just use the first legend definition for each channel
          if (!legendComponent[channel]) {
            legendComponent[channel] = child.component.legends[channel];
          }
        } else {
          // TODO: support independent legends
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

  public assembleLayout(): VgLayout {
    return null;
  }

  public assembleMarks(): any[] {
    return assembleLayerSelectionMarks(this, flatten(this.children.map((child) => {
      return child.assembleMarks();
    })));
  }
}
