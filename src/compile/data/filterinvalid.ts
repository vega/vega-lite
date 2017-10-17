import {isScaleChannel} from '../../channel';
import {field as fieldRef, FieldDef} from '../../fielddef';
import {hasContinuousDomain, ScaleType} from '../../scale';
import {Dict, keys} from '../../util';
import {VgFilterTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

export class FilterInvalidNode extends DataFlowNode {
  public clone() {
    return new FilterInvalidNode({...this.fieldDefs});
  }

  constructor(private fieldDefs: Dict<FieldDef<string>>) {
   super();
  }

  public static make(model: ModelWithField): FilterInvalidNode {
    if (model.config.invalidValues !== 'filter' ) {
      return null;
    }

    const filter = model.reduceFieldDef((aggregator: Dict<FieldDef<string>>, fieldDef, channel) => {
      const scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
      if (scaleComponent) {
        const scaleType = scaleComponent.get('type');

        // only automatically filter null for continuous domain since discrete domain scales can handle invalid values.
        if (hasContinuousDomain(scaleType) && !fieldDef.aggregate) {
          aggregator[fieldDef.field] = fieldDef;
        }
      }
      return aggregator;
    }, {} as Dict<FieldDef<string>>);

    if (!keys(filter).length) {
      return null;
    }

    return new FilterInvalidNode(filter);
  }

  get filter() {
    return this.fieldDefs;
  }

  // create the VgTransforms for each of the filtered fields
  public assemble(): VgFilterTransform {

    const filters = keys(this.filter).reduce((vegaFilters, field) => {
      const fieldDef = this.fieldDefs[field];
      const ref = fieldRef(fieldDef, {expr: 'datum'});

      if (fieldDef !== null) {
        vegaFilters.push(`${ref} !== null`);
        vegaFilters.push(`!isNaN(${ref})`);
      }
      return vegaFilters;
    }, []);

    return filters.length > 0 ?
    {
        type: 'filter',
        expr: filters.join(' && ')
    } : null;
  }
}
