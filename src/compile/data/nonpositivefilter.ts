import {ScaleType} from '../../scale';
import {Dict, duplicate, extend, keys} from '../../util';
import {VgFilterTransform, VgTransform} from '../../vega.schema';
import {UnitModel} from './../unit';
import {DataFlowNode} from './dataflow';

export class NonPositiveFilterNode extends DataFlowNode {
  private _filter: Dict<boolean>;

  public clone() {
    return new NonPositiveFilterNode(extend({}, this._filter));
  }

  constructor(filter: Dict<boolean>) {
    super();

    this._filter = filter;
  }

  public static make(model: UnitModel) {
    const filter = model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (!scale || !model.field(channel)) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.type === ScaleType.LOG;
      return nonPositiveComponent;
    }, {});

    if (!Object.keys(filter).length) {
      return null;
    }

    return new NonPositiveFilterNode(filter);
  }

  get filter() {
    return this._filter;
  }

  public assemble(): VgTransform[] {
    return keys(this._filter).filter((field) => {
      // Only filter fields (keys) with value = true
      return this._filter[field];
    }).map(function(field) {
      return {
        type: 'filter',
        expr: 'datum["' + field + '"] > 0'
      } as VgFilterTransform;
    });
  }
}
