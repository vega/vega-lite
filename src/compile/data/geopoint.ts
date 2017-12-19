import {SingleDefChannel, X, X2, Y, Y2} from '../../channel';
import {LATITUDE, LONGITUDE} from '../../type';
import {Dict, duplicate, keys} from '../../util';
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
    if (!model.projectionName()) {
      return null;
    }

    const points: Dict<string>[] = [];

    const possiblePairs: SingleDefChannel[][] = [[X, Y], [X2, Y2]];
    possiblePairs.forEach((posssiblePair) => {
      if (model.channelHasField(posssiblePair[0]) || model.channelHasField(posssiblePair[1])) {
        const pair: Dict<string> = {};
        posssiblePair.forEach((channel) => {
          if (model.channelHasField(channel)) {
            const fieldDef = model.fieldDef(channel);
            pair[fieldDef.type] = fieldDef.field;
          }
        });
        points.push(pair);
      }
    });

    if (points.length <= 0 || keys(points[0]).length <= 0) { // no points found
      return null;
    }

    return points.map((coordinates) => new GeoPointNode(model.projectionName(), [coordinates[LONGITUDE], coordinates[LATITUDE]], [coordinates[LONGITUDE] + '_geo', coordinates[LATITUDE] + '_geo']));
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
