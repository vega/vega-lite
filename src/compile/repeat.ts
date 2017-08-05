import {isArray} from 'vega-util';
import {Config} from '../config';
import {Encoding} from '../encoding';
import {Facet} from '../facet';
import {Field, FieldDef, isRepeatRef} from '../fielddef';
import * as log from '../log';
import {Repeat} from '../repeat';
import {RepeatSpec} from '../spec';
import {Dict, keys} from '../util';
import {VgLayout} from '../vega.schema';
import {BaseConcatModel} from './baseconcat';
import {buildModel} from './common';
import {parseRepeatLayoutSize} from './layout/parse';
import {Model} from './model';

export type RepeaterValue = {
  row?: string,
  column?: string
};

export function replaceRepeaterInFacet(facet: Facet<Field>, repeater: RepeaterValue): Facet<string> {
  return replaceRepeater(facet, repeater) as Facet<string>;
}

export function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string> {
  return replaceRepeater(encoding, repeater) as Encoding<string>;
}

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

type EncodingOrFacet<F> = Encoding<F> | Facet<F>;

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

export class RepeatModel extends BaseConcatModel {
  public readonly type = 'repeat';
  public readonly repeat: Repeat;

  public readonly children: Model[];

  constructor(spec: RepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config, spec.resolve);

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

        children.push(buildModel(spec.spec, this, this.getName('child' + name), undefined, childRepeat, config));
      }
    }

    return children;
  }

  public parseLayoutSize() {
    parseRepeatLayoutSize(this);
  }

  public assembleLayout(): VgLayout {
    // TODO: allow customization
    return {
      padding: {row: 10, column: 10},
      offset: 10,
      columns: this.repeat && this.repeat.column ? this.repeat.column.length : 1,
      bounds: 'full',
      align: 'all'
    };
  }
}
