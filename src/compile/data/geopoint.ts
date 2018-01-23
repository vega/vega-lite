import {X, X2, Y, Y2} from '../../channel';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, Dict, duplicate} from '../../util';
import {VgGeoPointTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';


export class GeoPointNode extends DataFlowNode {
  public clone() {
    return new GeoPointNode(this.projection, duplicate(this.fields), duplicate(this.as));
  }

  constructor(private projection: string, private fields: string[], private as: string[]) {
    super();
  }

  public static makeAll(model: ModelWithField): GeoPointNode[] {
    const nodes: GeoPointNode[] = [];

    if (!model.projectionName()) {
      return nodes;
    }

    for (const coordinates of [[X, Y], [X2, Y2]]) {
      const pair: Dict<string> = {};
      for (const channel of coordinates) {
        if (model.channelHasField(channel)) {
          const fieldDef = model.fieldDef(channel);
          if (contains([LATITUDE, LONGITUDE], fieldDef.type)) {
            pair[fieldDef.type] = fieldDef.field;
          }
        }
      }

      if (LONGITUDE in pair || LATITUDE in pair) {
        nodes.push(new GeoPointNode(model.projectionName(), [pair[LONGITUDE], pair[LATITUDE]], [pair[LONGITUDE] + '_geo', pair[LATITUDE] + '_geo']));
      }
    }

    return nodes;
  }

  public assemble(): VgGeoPointTransform {
    return {
      type: 'geopoint',
      projection: this.projection,
      fields: this.fields,
      as: this.as
    };
  }
}
