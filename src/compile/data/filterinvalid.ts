import type {FilterTransform as VgFilterTransform} from 'vega';
import {isScaleChannel} from '../../channel.js';
import {TypedFieldDef, vgField as fieldRef} from '../../channeldef.js';
import {Dict, hash, keys} from '../../util.js';
import {getScaleInvalidDataMode} from '../invalid/ScaleInvalidDataMode.js';
import {DataSourcesForHandlingInvalidValues} from '../invalid/datasources.js';
import {UnitModel} from '../unit.js';
import {DataFlowNode} from './dataflow.js';
import {isCountingAggregateOp} from '../../aggregate.js';

export class FilterInvalidNode extends DataFlowNode {
  public clone() {
    return new FilterInvalidNode(null, {...this.filter});
  }

  constructor(
    parent: DataFlowNode,
    public readonly filter: Dict<TypedFieldDef<string>>,
  ) {
    super(parent);
  }

  public static make(
    parent: DataFlowNode,
    model: UnitModel,
    dataSourcesForHandlingInvalidValues: DataSourcesForHandlingInvalidValues,
  ): FilterInvalidNode {
    const {config, markDef} = model;

    const {marks, scales} = dataSourcesForHandlingInvalidValues;
    if (marks === 'include-invalid-values' && scales === 'include-invalid-values') {
      // If neither marks nor scale domains need data source to filter null values, then don't add the filter.
      return null;
    }

    const filter = model.reduceFieldDef(
      (aggregator: Dict<TypedFieldDef<string>>, fieldDef, channel) => {
        const scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);

        if (scaleComponent) {
          const scaleType = scaleComponent.get('type');
          const {aggregate} = fieldDef;
          const invalidDataMode = getScaleInvalidDataMode({
            scaleChannel: channel,
            markDef,
            config,
            scaleType,
            isCountAggregate: isCountingAggregateOp(aggregate),
          });

          // If the invalid data mode is include or always-valid, we don't need to filter invalid values as the scale can handle invalid values.
          if (invalidDataMode !== 'show' && invalidDataMode !== 'always-valid') {
            aggregator[fieldDef.field] = fieldDef as any; // we know that the fieldDef is a typed field def
          }
        }

        return aggregator;
      },
      {} as Dict<TypedFieldDef<string>>,
    );

    if (!keys(filter).length) {
      return null;
    }

    return new FilterInvalidNode(parent, filter);
  }

  public dependentFields() {
    return new Set(keys(this.filter));
  }

  public producedFields() {
    return new Set<string>(); // filter does not produce any new fields
  }

  public hash() {
    return `FilterInvalid ${hash(this.filter)}`;
  }

  /**
   * Create the VgTransforms for each of the filtered fields.
   */
  public assemble(): VgFilterTransform {
    const filters = keys(this.filter).reduce((vegaFilters, field) => {
      const fieldDef = this.filter[field];
      const ref = fieldRef(fieldDef, {expr: 'datum'});

      if (fieldDef !== null) {
        if (fieldDef.type === 'temporal') {
          vegaFilters.push(`(isDate(${ref}) || (${isValidFiniteNumberExpr(ref)}))`);
        } else if (fieldDef.type === 'quantitative') {
          vegaFilters.push(isValidFiniteNumberExpr(ref));
        } else {
          // should never get here
        }
      }
      return vegaFilters;
    }, [] as string[]);

    return filters.length > 0
      ? {
          type: 'filter',
          expr: filters.join(' && '),
        }
      : null;
  }
}

export function isValidFiniteNumberExpr(ref: string) {
  return `isValid(${ref}) && isFinite(+${ref})`;
}
