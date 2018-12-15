import {NewSignal} from 'vega';
import {Config} from '../config';
import {Resolve} from '../resolve';
import {BaseSpec} from '../spec';
import {keys} from '../util';
import {VgData} from '../vega.schema';
import {parseData} from './data/parse';
import {assembleLayoutSignals} from './layoutsize/assemble';
import {Model} from './model';
import {RepeaterValue} from './repeater';

export abstract class BaseConcatModel extends Model {
  constructor(
    spec: BaseSpec,
    parent: Model,
    parentGivenName: string,
    config: Config,
    repeater: RepeaterValue,
    resolve: Resolve
  ) {
    super(spec, parent, parentGivenName, config, repeater, resolve);
  }

  public parseData() {
    this.component.data = parseData(this);
    this.children.forEach(child => {
      child.parseData();
    });
  }
  public parseSelection() {
    // Merge selections up the hierarchy so that they may be referenced
    // across unit specs. Persist their definitions within each child
    // to assemble signals which remain within output Vega unit groups.
    this.component.selection = {};
    for (const child of this.children) {
      child.parseSelection();
      keys(child.component.selection).forEach(key => {
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

  public assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[] {
    return this.children.reduce((sg, child) => child.assembleSelectionTopLevelSignals(sg), signals);
  }

  public assembleSelectionSignals(): NewSignal[] {
    this.children.forEach(child => child.assembleSelectionSignals());
    return [];
  }

  public assembleLayoutSignals(): NewSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleLayoutSignals());
    }, assembleLayoutSignals(this));
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return this.children.reduce((db, child) => child.assembleSelectionData(db), data);
  }

  public assembleMarks(): any[] {
    // only children have marks
    return this.children.map(child => {
      const title = child.assembleTitle();
      const style = child.assembleGroupStyle();
      const layoutSizeEncodeEntry = child.assembleLayoutSize();
      return {
        type: 'group',
        name: child.getName('group'),
        ...(title ? {title} : {}),
        ...(style ? {style} : {}),
        ...(layoutSizeEncodeEntry
          ? {
              encode: {
                update: layoutSizeEncodeEntry
              }
            }
          : {}),
        ...child.assembleGroup()
      };
    });
  }
}
