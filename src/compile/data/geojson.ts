import {SHAPE, X, X2, Y, Y2} from '../../channel';
import {GEOJSON, LATITUDE, LONGITUDE} from '../../type';
import {contains, duplicate, keys} from '../../util';
import {VgGeoJSONTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

export class GeoJSONNode extends DataFlowNode {
  public clone() {
    return new GeoJSONNode(duplicate(this.fields), this.geojson, this.signal);
  }

  public static make(model: ModelWithField): GeoJSONNode {
    const geo = model.reduceFieldDef((rel, fieldDef, channel) => {
      if ((contains([X, Y, X2, Y2], channel) && contains([LATITUDE, LONGITUDE], fieldDef.type))
        || (channel === SHAPE && fieldDef.type === GEOJSON)) {
        rel[fieldDef.type] = fieldDef.field;
      }
      return rel;
    }, {});

    const types = keys(geo);

    let geojson;
    let fields;
    if (types.length === 1 && contains(types, GEOJSON)) {
      geojson = geo[GEOJSON];
    }
    if (types.length === 2 && contains(types, LATITUDE) && contains(types, LONGITUDE)) {
      fields = [geo[LONGITUDE], geo[LATITUDE]];
    }

    return (geojson || fields) ? new GeoJSONNode(fields, geojson, model.getName('geojson')) : null;
  }

  constructor(private fields?: string[], private geojson?: string, private signal?: string) {
    super();
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
