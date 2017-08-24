
import {isScaleChannel} from '../../channel';
import {FieldDef} from '../../fielddef';
import {hasContinuousDomain} from '../../scale';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {contains, Dict, differArray, duplicate, extend, hash, keys, stringValue} from '../../util';
import {VgFilterTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

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
    const fields = model.reduceFieldDef((aggregator: Dict<FieldDef<string>>, fieldDef, channel) => {
      if (model.config.invalidValues === 'filter' && !fieldDef.aggregate && fieldDef.field) {
        // Vega's aggregate operator already handle invalid values, so we only have to consider non-aggregate field here.

        const scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
        if (scaleComponent) {
          const scaleType = scaleComponent.get('type');

          // only automatically filter null for continuous domain since discrete domain scales can handle invalid values.
          if (hasContinuousDomain(scaleType)) {
            aggregator[fieldDef.field] = fieldDef;
          }
        }
      }
      return aggregator;
    }, {} as Dict<FieldDef<string>>);

    if (keys(fields).length === 0) {
      return null;
    }

    return new NullFilterNode(fields);
  }

  get filteredFields() {
      return this._filteredFields;
  }

  public merge(other: NullFilterNode) {
    const t = keys(this._filteredFields).map(k => k + ' ' + hash(this._filteredFields[k]));
    const o = keys(other.filteredFields).map(k => k + ' ' + hash(other.filteredFields[k]));

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
