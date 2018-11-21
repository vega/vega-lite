import {GeoPositionChannel, LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2} from '../../channel';
import {duplicate} from '../../util';
import {VgGeoPointTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class GeoPointNode extends DataFlowNode {
  public clone() {
    return new GeoPointNode(null, this.projection, duplicate(this.fields), duplicate(this.as));
  }

  constructor(parent: DataFlowNode, private projection: string, private fields: string[], private as: string[]) {
    super(parent);
  }

  public static parseAll(parent: DataFlowNode, model: UnitModel): DataFlowNode {
    if (!model.projectionName()) {
      return parent;
    }

    [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach((coordinates: GeoPositionChannel[]) => {
      const pair = coordinates.map(channel =>
        model.channelHasField(channel) ? model.fieldDef(channel).field : undefined
      );

      const suffix = coordinates[0] === LONGITUDE2 ? '2' : '';

      if (pair[0] || pair[1]) {
        parent = new GeoPointNode(parent, model.projectionName(), pair, [
          model.getName('x' + suffix),
          model.getName('y' + suffix)
        ]);
      }
    });

    return parent;
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
