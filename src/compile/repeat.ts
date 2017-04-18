import {isArray} from 'vega-util';
import {CellConfig, Config} from '../config';
import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {Field, FieldDef, isRepeatRef} from '../fielddef';
import * as log from '../log';
import {Repeat} from '../repeat';
import {RepeatSpec} from '../spec';
import {keys, vals} from '../util';
import {VgData, VgLayout, VgScale, VgSignal} from '../vega.schema';
import {buildModel} from './common';
import {assembleData} from './data/assemble';
import {parseData} from './data/parse';
import {assembleLayoutLayerSignals} from './layout/index';
import {Model} from './model';


export type RepeaterValue = {
  row?: string,
  column?: string
};

export function replaceRepeaterInFacet(facet: Facet<Field>, repeater: RepeaterValue): Facet<string> {
  return replaceRepeater(facet, repeater);
}

export function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string> {
  return replaceRepeater(encoding, repeater);
}

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

/**
 * Replace repeater values in a field def with the concrete field name.
 */
function replaceRepeaterInFieldDef(fieldDef: FieldDef<Field>, repeater: RepeaterValue): FieldDef<string> | null {
  const field = fieldDef.field;
  if (isRepeatRef(field)) {
    if (field.repeat in repeater) {
      return {
        ...fieldDef,
        field: repeater[field.repeat]
      };
    } else {
      log.warn(log.message.noSuchRepeatedValue(field.repeat));
      return null;
    }
  } else {
    // field is not a repeat ref so we can just return the field def
    return fieldDef as FieldDef<string>;
  }
}

function replaceRepeater(mapping: EncodingOrFacet<Field>, repeater: RepeaterValue): EncodingOrFacet<string> {
  const out: EncodingOrFacet<string> = {};
  for (const channel in mapping) {
    if (mapping.hasOwnProperty(channel)) {
      const fieldDef: FieldDef<Field> | FieldDef<Field>[] = mapping[channel];

      if (isArray(fieldDef)) {
        out[channel] = fieldDef.map(fd => replaceRepeaterInFieldDef(fd, repeater))
          .filter((fd: FieldDef<string> | null) => fd !== null);
      } else {
        const fd = replaceRepeaterInFieldDef(fieldDef, repeater);
        if (fd !== null) {
          out[channel] = fd;
        }
      }
    }
  }
  return out;
}

export class RepeatModel extends Model {
  public readonly repeat: Repeat;

  public readonly children: Model[];

  constructor(spec: RepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config);

    this.repeat = spec.repeat;
    this.children = this._initChildren(spec, this.repeat, repeatValues, config);
  }

  private _initChildren(spec: RepeatSpec, repeat: Repeat, repeater: RepeaterValue, config: Config): Model[] {
    const children: Model[] = [];
    const row = repeat.row || [repeater ? repeater.row : null];
    const column = repeat.column || [repeater ? repeater.column : null];

    // cross product
    for (const rowField of row) {
      for (const columnField of column) {
        const name = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');

        const childRepeat = {
          row: rowField,
          column: columnField
        };

        children.push(buildModel(spec.spec, this, this.getName('child' + name), childRepeat, config));
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

  public assembleSignals(): VgSignal[] {
    return this.children.reduce((signals, child) => {
      return [].concat(
        child.assembleLayoutSignals(),
        child.assembleSignals(),
        signals
      );
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
      padding: {row: 10, column: 10, header: 10},
      columns: this.repeat && this.repeat.row ? this.repeat.row.length : 1,
      bounds: 'full',
      align: 'all'
    };
  }

  public assembleLayoutSignals(): VgSignal[] {
    return [];
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
