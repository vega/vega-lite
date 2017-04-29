import {FieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {contains, Dict, differ, differArray, duplicate, extend, hash, keys, stringValue} from '../../util';
import {VgFilterTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {Model} from './../model';
import {DataFlowNode} from './dataflow';


const DEFAULT_NULL_FILTERS = {
  nominal: false,
  ordinal: false,
  quantitative: true,
  temporal: true
};

export class NullFilterNode extends DataFlowNode {
  private _filteredFields: Dict<FieldDef<string>>;

  public clone() {
    return new NullFilterNode(duplicate(this._filteredFields));
  }

  constructor(fields: Dict<FieldDef<string>>) {
    super();

    this._filteredFields = fields;
  }

  public static make(model: ModelWithField) {
    const fields = model.reduceFieldDef((aggregator: Dict<FieldDef<string>>, fieldDef) => {
      if (fieldDef.aggregate !== 'count') { // Ignore * for count(*) fields.
        if (model.config.filterInvalid ||
          (model.config.filterInvalid === undefined && (fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type]))) {
          aggregator[fieldDef.field] = fieldDef;
        } else {
          // define this so we know that we don't filter nulls for this field
          // this makes it easier to merge into parents
          aggregator[fieldDef.field] = null;
        }
      }
      return aggregator;
    }, {} as Dict<FieldDef<string>>);

    if (Object.keys(fields).length === 0) {
      return null;
    }

    return new NullFilterNode(fields);
  }

  get filteredFields() {
      return this._filteredFields;
  }

  public merge(other: NullFilterNode) {
    const t = Object.keys(this._filteredFields).map(k => k + ' ' + hash(this._filteredFields[k]));
    const o = Object.keys(other.filteredFields).map(k => k + ' ' + hash(other.filteredFields[k]));

    if (!differArray(t, o)) {
      this._filteredFields = extend(this._filteredFields, other._filteredFields);
      other.remove();
    }
  }

  public assemble(): VgFilterTransform {
    const filters = keys(this._filteredFields).reduce((_filters, field) => {
      const fieldDef = this._filteredFields[field];
      if (fieldDef !== null) {
        _filters.push(`datum[${stringValue(fieldDef.field)}] !== null`);
        if (contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
          // TODO(https://github.com/vega/vega-lite/issues/1436):
          // We can be even smarter and add NaN filter for N,O that are numbers
          // based on the `parse` property once we have it.
          _filters.push(`!isNaN(datum[${stringValue(fieldDef.field)}])`);
        }
      }
      return _filters;
    }, []);

    return filters.length > 0 ?
      {
        type: 'filter',
        expr: filters.join(' && ')
      } : null;
  }
}
