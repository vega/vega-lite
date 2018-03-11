import {SHAPE, X, X2, Y, Y2} from '../../channel';
import {GEOJSON, LATITUDE, LONGITUDE} from '../../type';
import {contains, Dict, duplicate} from '../../util';
import {VgGeoJSONTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class GeoJSONNode extends DataFlowNode {
  public clone() {
    return new GeoJSONNode(null, duplicate(this.fields), this.geojson, this.signal);
  }

  public static parseAll(parent: DataFlowNode, model: UnitModel): DataFlowNode {
    let geoJsonCounter = 0;

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
        parent = new GeoJSONNode(parent, [pair[LONGITUDE], pair[LATITUDE]], null, model.getName(`geojson_${geoJsonCounter++}`));
      }
    }

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
