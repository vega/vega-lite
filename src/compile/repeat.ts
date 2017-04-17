import {Channel} from '../channel';
import {CellConfig, Config} from '../config';
import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {Field, FieldDef, isRepeatRef} from '../fielddef';
import * as log from '../log';
import {Repeat} from '../repeat';
import {RepeatSpec} from '../spec';
import {Dict, duplicate, vals} from '../util';
import {VgData, VgLayout, VgScale} from '../vega.schema';
import {buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutData} from './layout';
import {Model} from './model';


export type RepeatValues = {
  row?: string,
  column?: string
};

export function facetRepeatResolve(facet: Facet<Field>, repeatValues: RepeatValues): Facet<string> {
  return resolveRepeat(facet, repeatValues);
}

export function encodingRepeatResolve(encoding: Encoding<Field>, repeatValues: RepeatValues): Encoding<string> {
  return resolveRepeat(encoding, repeatValues);
}

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

function resolveRepeat(encoding: EncodingOrFacet<Field>, repeatValues: RepeatValues): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in encoding) {
    if (encoding.hasOwnProperty(channel)) {
      const fieldDef: FieldDef<Field> = encoding[channel];
      out[channel] = {...fieldDef};

      const field = fieldDef.field;
      if (isRepeatRef(field)) {
        if (field.repeat in repeatValues) {
          out[channel].field = repeatValues[field.repeat];
        } else {
          log.warn(log.message.noSuchRepeatedValue(field.repeat));
          delete out[channel].field;
        }
      }
    }
  }
  return out;
}

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
      columns: this.repeat && this.repeat.row ? this.repeat.row.length : 1,
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
}
