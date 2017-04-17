import {Channel} from '../channel';
import {CellConfig, Config} from '../config';
import {FieldDef} from '../fielddef';
import {FILL_STROKE_CONFIG} from '../mark';
import {Repeat} from '../repeat';
import {RepeatSpec} from '../spec';
import {Dict, duplicate, flatten, vals} from '../util';
import {VgData, VgEncodeEntry, VgLayout, VgScale} from '../vega.schema';
import {applyConfig, buildModel} from './common';
import {assembleData} from './data/assemble';
import {assembleLayoutData} from './layout';
import {Model} from './model';


export type RepeatValues = {
  row: string,
  column: string
};

export class RepeatModel extends Model {
  public readonly repeat: Repeat;

  public readonly children: Model[];

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

  constructor(spec: RepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeatValues, config: Config) {
    super(spec, parent, parentGivenName, config);

    this.repeat = spec.repeat;
    this.children = this._initChildren(spec, this.repeat, repeatValues, config);
  }

  private _initChildren(spec: RepeatSpec, repeat: Repeat, repeatValues: RepeatValues, config: Config): Model[] {
    const children: Model[] = [];
    const row = repeat.row || [repeatValues ? repeatValues.row : null];
    const column = repeat.column || [repeatValues ? repeatValues.column : null];

    // cross product
    for (const r in row) {
      if (row.hasOwnProperty(r)) {
        const rowField = row[r];
        for (const c in column) {
          if (column.hasOwnProperty(c)) {
            const columnField = column[c];

            const name = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');

            const childRepRepeatValues = {
              row: rowField,
              column: columnField
            };

            children.push(buildModel(duplicate(spec.spec), this, this.getName('child' + name), childRepRepeatValues, config));
          }
        }
      }
    }

    return children;
  }

  public channelHasField(channel: Channel): boolean {
    // repeat does not have any channels
    return false;
  }

  public parseData() {
    this.children.forEach((child) => {
      child.parseData();
    });
  }

  public parseSelection() {
    // TODO: @arvind can write this
    // We might need to split this into compileSelectionData and compileSelectionSignals?
  }

  public parseLayoutData() {
    this.children.forEach(child => {
      child.parseLayoutData();
    });
    this.component.layout = {
      width: null,
      height: null
    };
  }

  public parseScale(this: RepeatModel) {
    const model = this;

    this.component.scales = {};

    this.children.forEach(function(child) {
      child.parseScale();
    });
  }

  public parseMark() {
    for (const child of this.children) {
      child.parseMark();
    }
  }

  public parseAxis() {
    for (const child of this.children) {
      child.parseAxis();
    }
  }

  public parseAxisGroup(): void {
    return null;
  }

  public parseLegend() {
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

  public assembleSignals(signals: any[]): any[] {
    return [];
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
    return {
      padding: {row: 10, column: 10, header: 10},
      columns: 1,
      bounds: 'full'
    };
  }

  public assembleLayoutData(layoutData: VgData[]): VgData[] {
    // Postfix traversal – layout is assembled bottom-up
    this.children.forEach((child) => {
      child.assembleLayoutData(layoutData);
    });
    return assembleLayoutData(this, layoutData);
  }

  public assembleMarks(): any[] {
    // only children have marks
    return this.children.map(child => ({
      name: child.getName('group'),
      encode: {
        enter: {
          height: {
            // FIXME
            value: 200
          },
          width: {
            // FIXME
            value: 200
          }
        }
      },
      ...child.assembleGroup()
    }));
  }

  public channels(): Channel[] {
    return [];
  }

  protected getMapping(): any {
    return null;
  }
}
