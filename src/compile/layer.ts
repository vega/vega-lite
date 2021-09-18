import {Legend as VgLegend, NewSignal, SignalRef, Title as VgTitle} from 'vega';
import {array} from 'vega-util';
import {Config} from '../config';
import * as log from '../log';
import {isLayerSpec, isUnitSpec, LayoutSizeMixins, NormalizedLayerSpec} from '../spec';
import {keys} from '../util';
import {VgData, VgLayout} from '../vega.schema';
import {assembleAxisSignals} from './axis/assemble';
import {parseLayerAxes} from './axis/parse';
import {parseData} from './data/parse';
import {assembleLayoutSignals} from './layoutsize/assemble';
import {parseLayerLayoutSize} from './layoutsize/parse';
import {assembleLegends} from './legend/assemble';
import {isLabelMark} from './mark/mark';
import {Model} from './model';
import {assembleLayerSelectionMarks} from './selection/assemble';
import {UnitModel} from './unit';

export class LayerModel extends Model {
  // HACK: This should be (LayerModel | UnitModel)[], but setting the correct type leads to weird error.
  // So I'm just putting generic Model for now
  public readonly children: Model[];

  constructor(
    spec: NormalizedLayerSpec,
    parent: Model,
    parentGivenName: string,
    parentGivenSize: LayoutSizeMixins,
    config: Config<SignalRef>
  ) {
    super(spec, 'layer', parent, parentGivenName, config, spec.resolve, spec.view);

    const layoutSize = {
      ...parentGivenSize,
      ...(spec.width ? {width: spec.width} : {}),
      ...(spec.height ? {height: spec.height} : {})
    };

    this.children = spec.layer.map((layer, i) => {
      if (isLayerSpec(layer)) {
        return new LayerModel(layer, this, this.getName(`layer_${i}`), layoutSize, config);
      } else if (isUnitSpec(layer)) {
        return new UnitModel(layer, this, this.getName(`layer_${i}`), layoutSize, config);
      }

      throw new Error(log.message.invalidSpec(layer));
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

  public parseSelections() {
    // Merge selections up the hierarchy so that they may be referenced
    // across unit specs. Persist their definitions within each child
    // to assemble signals which remain within output Vega unit groups.
    this.component.selection = {};
    for (const child of this.children) {
      child.parseSelections();
      for (const key of keys(child.component.selection)) {
        this.component.selection[key] = child.component.selection[key];
      }
    }
  }

  public parseMarkGroup() {
    for (const child of this.children) {
      child.parseMarkGroup();
    }

    const markNames = this.children.map((child: UnitModel | LayerModel) => child.getMarkNames());
    const labelNames: string[][] = [];
    this.children.forEach((child: UnitModel | LayerModel, idx) => {
      child.avoidMarks([markNames.slice(0, idx), markNames.slice(idx + 1)].flat(3));
      child.avoidMarks(labelNames.flat(), -Infinity);
      labelNames.push(child.getLabelNames());
    });
  }

  public parseAxesAndHeaders() {
    parseLayerAxes(this);
  }

  public assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[] {
    return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
  }

  // TODO: Support same named selections across children.
  public assembleSignals(): NewSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleSignals());
    }, assembleAxisSignals(this));
  }

  public assembleLayoutSignals(): NewSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleLayoutSignals());
    }, assembleLayoutSignals(this));
  }

  public assembleSelectionData(data: readonly VgData[]): readonly VgData[] {
    return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
  }

  public assembleGroupStyle(): string | string[] {
    const uniqueStyles = new Set<string>();
    for (const child of this.children) {
      for (const style of array(child.assembleGroupStyle())) {
        uniqueStyles.add(style);
      }
    }
    const styles = Array.from(uniqueStyles);
    return styles.length > 1 ? styles : styles.length === 1 ? styles[0] : undefined;
  }

  public assembleTitle(): VgTitle {
    let title = super.assembleTitle();
    if (title) {
      return title;
    }
    // If title does not provide layer, look into children
    for (const child of this.children) {
      title = child.assembleTitle();
      if (title) {
        return title;
      }
    }
    return undefined;
  }

  public assembleLayout(): VgLayout {
    return null;
  }

  public assembleMarks(): any[] {
    const marks = assembleLayerSelectionMarks(
      this,
      this.children.flatMap(child => {
        return child.assembleMarks();
      })
    );

    // Move label marks to the top
    // In Vega, a text mark with label transform can only avoid the marks that comes
    // before itself. To be able to avoid the marks that comes after itself, we need
    // to push the text mark to the top.
    return [...marks.filter(mark => !isLabelMark(mark)), ...marks.filter(isLabelMark)];
  }

  public assembleLegends(): VgLegend[] {
    return this.children.reduce((legends, child) => {
      return legends.concat(child.assembleLegends());
    }, assembleLegends(this));
  }

  public getMarkNames(): string[] {
    return this.children.flatMap((child: UnitModel | LayerModel) => child.getMarkNames());
  }

  public getLabelNames(): string[] {
    return this.children.flatMap((child: UnitModel | LayerModel) => child.getLabelNames());
  }

  public avoidMarks(names: string[], level = 0) {
    this.children.forEach((child: UnitModel | LayerModel) => child.avoidMarks(names, level + 1));
  }
}
