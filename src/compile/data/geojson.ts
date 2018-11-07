import {GeoPositionChannel, LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, SHAPE} from '../../channel';
import {GEOJSON} from '../../type';
import {duplicate} from '../../util';
import {VgGeoJSONTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class GeoJSONNode extends DataFlowNode {
  public clone() {
    return new GeoJSONNode(null, duplicate(this.fields), this.geojson, this.signal);
  }

  public static parseAll(parent: DataFlowNode, model: UnitModel): DataFlowNode {
    let geoJsonCounter = 0;

    [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach((coordinates: GeoPositionChannel[]) => {
      const pair = coordinates.map(channel =>
        model.channelHasField(channel) ? model.fieldDef(channel).field : undefined
      );

      if (pair[0] || pair[1]) {
        parent = new GeoJSONNode(parent, pair, null, model.getName(`geojson_${geoJsonCounter++}`));
      }
    });

    if (model.channelHasField(SHAPE)) {
      const fieldDef = model.fieldDef(SHAPE);
      if (fieldDef.type === GEOJSON) {
        parent = new GeoJSONNode(parent, null, fieldDef.field, model.getName(`geojson_${geoJsonCounter++}`));
      }
    }

    return parent;
  }

  constructor(parent: DataFlowNode, private fields?: string[], private geojson?: string, private signal?: string) {
    super(parent);
  }

  public assemble(): VgGeoJSONTransform {
    return {
      type: 'geojson',
      ...(this.fields ? {fields: this.fields} : {}),
      ...(this.geojson ? {geojson: this.geojson} : {}),
      signal: this.signal
    };
  }
}
