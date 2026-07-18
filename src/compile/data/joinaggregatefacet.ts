import {vgField} from '../../channeldef.js';
import {DEFAULT_SORT_OP, isSortField} from '../../sort.js';
import {FacetMapping} from '../../spec/facet.js';
import {facetSortFieldName} from '../facet.js';
import {DataFlowNode} from './dataflow.js';
import {JoinAggregateTransformNode} from './joinaggregate.js';

export function makeJoinAggregateFromFacet(
  parent: DataFlowNode,
  facet: FacetMapping<string>,
): JoinAggregateTransformNode {
  const {row, column} = facet;
  if (row && column) {
    let newParent = null;
    // only need to make one for crossed facet
    for (const fieldDef of [row, column]) {
      if (isSortField(fieldDef.sort)) {
        const {field, op = DEFAULT_SORT_OP} = fieldDef.sort;
        parent = newParent = new JoinAggregateTransformNode(parent, {
          joinaggregate: [
            {
              op,
              field,
              as: facetSortFieldName(fieldDef, fieldDef.sort, {forAs: true}),
            },
          ],
          groupby: [vgField(fieldDef)],
        });
      }
    }
    return newParent;
  }
  return null;
}
