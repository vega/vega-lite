import {NonspatialScaleChannel, ScaleChannel} from '../channel';
import {CellConfig, Config} from '../config';
import {Repeat} from '../repeat';
import {ResolveMapping} from '../resolve';
import {Scale} from '../scale';
import {ConcatSpec, isVConcatSpec, RepeatSpec} from '../spec';
import {Dict, keys, vals} from '../util';
import {VgData, VgLayout, VgScale, VgSignal} from '../vega.schema';
import {buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutSignals} from './layout/assemble';
import {parseConcatLayoutSize} from './layout/parse';
import {parseNonUnitLegend} from './legend/parse';
import {Model} from './model';
import {RepeaterValue} from './repeat';
import {assembleScaleForModelAndChildren} from './scale/assemble';
import {ScaleComponentIndex} from './scale/component';

export class ConcatModel extends Model {

  public readonly children: Model[];

  public readonly isVConcat: boolean;

  constructor(spec: ConcatSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config, spec.resolve);

    this.isVConcat = isVConcatSpec(spec);

    this.children = (isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map((child, i) => {
      return buildModel(child, this, this.getName('concat_' + i), undefined, repeater, config);
    });
  }

  public parseData() {
    this.component.data = parseData(this);
    this.children.forEach((child) => {
      child.parseData();
    });
  }

  public parseLayoutSize() {
    parseConcatLayoutSize(this);
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
    for (const child of this.children) {
      child.parseAxisAndHeader();
    }

    // TODO(#2415): support shared axes
  }

  public parseAxisGroup(): void {
    return null;
  }

  public parseLegend() {
    parseNonUnitLegend(this);
  }

  public assembleData(): VgData[] {
     if (!this.parent) {
      // only assemble data in the root
      return assembleData(this.component.data);
    }

    return [];
  }

  public assembleParentGroupProperties(): any {
    return null;
  }

  public assembleScales(): VgScale[] {
    return assembleScaleForModelAndChildren(this);
  }

  public assembleSelectionTopLevelSignals(signals: any[]): VgSignal[] {
    return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
  }

  public assembleSelectionSignals(): VgSignal[] {
    this.children.forEach((child) => child.assembleSelectionSignals());
    return [];
  }

  public assembleLayoutSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleLayoutSignals());
    }, assembleLayoutSignals(this));
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return this.children.reduce((db, child) => child.assembleSelectionData(db), []);
  }

  public assembleLayout(): VgLayout {
    // TODO: allow customization
    return {
      padding: {row: 10, column: 10},
      offset: 10,
      ...(this.isVConcat ? {columns: 1} : {}),
      bounds: 'full',
      align: 'all'
    };
  }

  public assembleMarks(): any[] {
    // only children have marks
    return this.children.map(child => {
      const title = child.assembleTitle();

      const encodeEntry = child.assembleParentGroupProperties();
      return {
        type: 'group',
        name: child.getName('group'),
        ...(title ? {title} : {}),
        ...(encodeEntry ? {
          encode: {
            update: encodeEntry
          }
        } : {}),
        ...child.assembleGroup()
      };
    });
  }
}
