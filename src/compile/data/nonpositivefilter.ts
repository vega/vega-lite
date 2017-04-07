import {ScaleType} from '../../scale';
import {Dict, keys} from '../../util';
import {VgFilterTransform, VgTransform} from '../../vega.schema';
import {Model} from './../model';
import {DataFlowNode} from './dataflow';

export class NonPositiveFilterNode extends DataFlowNode {
  private _filter: Dict<boolean>;

  constructor(model: Model) {
    super();

    this._filter = model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (!scale || !model.field(channel)) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.type === ScaleType.LOG;
      return nonPositiveComponent;
    }, {});
  }

  public size() {
    return Object.keys(this._filter).length;
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
