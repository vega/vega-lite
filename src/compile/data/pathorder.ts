import {isAggregate} from '../../encoding';
import {field} from '../../fielddef';
import {isSortField} from '../../sort';
import {contains, duplicate} from '../../util';

 import {VgCollectTransform, VgSort} from '../../vega.schema';
import {sortParams} from '../common';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class OrderNode extends DataFlowNode {
  public clone() {
    return new OrderNode(duplicate(this.sort));
  }

  constructor(private sort: VgSort) {
    super();
  }

  public static make(model: UnitModel) {
    let sort: VgSort = null;

    if (contains(['line', 'area'], model.mark())) {
      if (model.mark() === 'line' && model.channelHasField('order')) {
        // For only line, sort by the order field if it is specified.
        sort = sortParams(model.encoding.order);
      } else {
        // For both line and area, we sort values based on dimension by default
        const dimensionChannel: 'x' | 'y' = model.markDef.orient === 'horizontal' ? 'y' : 'x';
        const s = model.sort(dimensionChannel);
        const sortField = isSortField(s) ?
          field({
            // FIXME: this op might not already exist?
            // FIXME: what if dimensionChannel (x or y) contains custom domain?
            aggregate: isAggregate(model.encoding) ? s.op : undefined,
            field: s.field
          }) :
          model.field(dimensionChannel, {binSuffix: 'start'});

        sort = {
          field: sortField,
          order: 'descending'
        };
      }
    } else {
      return null;
    }

    return new OrderNode(sort);
  }

  public assemble(): VgCollectTransform {
    return {
      type: 'collect',
      sort: this.sort
    };
  }
}
