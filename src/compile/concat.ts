import {CellConfig, Config} from '../config';
import {Repeat} from '../repeat';
import {ConcatSpec, RepeatSpec} from '../spec';
import {Dict, vals} from '../util';
import {VgData, VgLayout, VgScale, VgSignal} from '../vega.schema';
import {buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {Model} from './model';
import {RepeaterValue} from './repeat';


export class ConcatModel extends Model {

  public readonly children: Model[];

  constructor(spec: ConcatSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config);

    this.children = spec.vconcat.map((child, i) => {
      return buildModel(child, this, this.getName('concat_' + i), repeater, config);
    });
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

  public parseScale() {
    const model = this;

    const scaleComponent: Dict<VgScale> = this.component.scales = {};

    this.children.forEach(function(child) {
      child.parseScale();
    });
  }

  public parseMark() {
    for (const child of this.children) {
      child.parseMark();
    }
  }

  public parseAxisAndHeader() {
    for (const child of this.children) {
      child.parseAxisAndHeader();
    }
  }

  public parseAxisGroup(): void {
    return null;
  }

  public parseLegend() {
    const legendComponent = this.component.legends = {};

    for (const child of this.children) {
      child.parseLegend();
    }
  }

  public assembleData(): VgData[] {
     if (!this.parent) {
      // only assemble data in the root
      return assembleData(vals(this.component.data.sources));
    }

    return [];
  }

  public assembleParentGroupProperties(cellConfig: CellConfig): any {
    return null;
  }

  public assembleSelectionSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleSelectionSignals());
    }, []);
  }


  public assembleLayoutSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return signals.concat(child.assembleLayoutSignals());
    }, []);
  }
  public assembleSelectionData(data: VgData[]): VgData[] {
    return [];
  }

  public assembleScales(): VgScale[] {
    // combine with scales from children
    return this.children.reduce((scales, c) => {
      return scales.concat(c.assembleScales());
    }, super.assembleScales());
  }

  public assembleLayout(): VgLayout {
    // TODO: allow customization
    return {
      padding: {row: 10, column: 10},
      offset: 10,
      columns: 1,
      bounds: 'full',
      align: 'all'
    };
  }

  public assembleMarks(): any[] {
    // only children have marks
    return this.children.map(child => ({
      type: 'group',
      name: child.getName('group'),
      encode: {
        update: {
          height: {signal: child.getName('height')},
          width: {signal: child.getName('width')}
        }
      },
      ...child.assembleGroup()
    }));
  }
}
