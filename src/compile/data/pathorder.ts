import {isAggregate} from '../../encoding';
import {field} from '../../fielddef';
import {isSortField} from '../../sort';
import {contains, duplicate} from '../../util';

 import {VgCollectTransform, VgSort} from '../../vega.schema';
import {sortParams} from '../common';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class OrderNode extends DataFlowNode {
  private sort: VgSort = null;

  public clone(): this {
    const cloneObj = new (<any>this.constructor);
    cloneObj.sort = duplicate(this.sort);
    return cloneObj;
  }

  constructor(model: UnitModel) {
    super();

    if (!model) {
      // when cloning we may not have a model
      return;
    }

    if (contains(['line', 'area'], model.mark())) {
      if (model.mark() === 'line' && model.channelHasField('order')) {
        // For only line, sort by the order field if it is specified.
        this.sort = sortParams(model.encoding.order);
      } else {
        // For both line and area, we sort values based on dimension by default
        const dimensionChannel: 'x' | 'y' = model.markDef.orient === 'horizontal' ? 'y' : 'x';
        const sort = model.sort(dimensionChannel);
        const sortField = isSortField(sort) ?
          field({
            // FIXME: this op might not already exist?
            // FIXME: what if dimensionChannel (x or y) contains custom domain?
            aggregate: isAggregate(model.encoding) ? sort.op : undefined,
            field: sort.field
          }) :
          model.field(dimensionChannel, {binSuffix: 'start'});

        this.sort = {
          field: sortField,
          order: 'descending'
        };
      }
    }
  }

  public hasSort() {
    return !!this.sort;
  }

  public assemble(): VgCollectTransform {
    return {
      type: 'collect',
      sort: this.sort
    };
  }
}
