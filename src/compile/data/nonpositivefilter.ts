import {SCALE_CHANNELS} from '../../channel';
import {ScaleType} from '../../scale';
import {Dict, extend, keys, stringValue} from '../../util';
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
    const filter = SCALE_CHANNELS.reduce(function(nonPositiveComponent, channel) {
      const scale = model.getScaleComponent(channel);
      if (!scale || !model.field(channel)) {
        // don't set anything
        return nonPositiveComponent;
      }
      nonPositiveComponent[model.field(channel)] = scale.get('type') === ScaleType.LOG;
      return nonPositiveComponent;
    }, {});

    if (!keys(filter).length) {
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
        expr: `datum[${stringValue(field)}] > 0`
      } as VgFilterTransform;
    });
  }
}
