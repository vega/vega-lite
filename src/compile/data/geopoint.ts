import {Field, FieldDef, isFieldDef, isGeoJSONFieldDef, isProjectionFieldDef} from '../../fielddef';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, duplicate, extend, keys} from '../../util';
import {VgGeoPointTransform} from '../../vega.schema';
import {ModelWithField} from '../model';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export class GeoPointNode extends DataFlowNode {
  public clone() {
    return new GeoPointNode(this.projection, duplicate(this.fields), duplicate(this.as));
  }

  constructor(private projection: string, private fields: string[], private as: string[]) {
    super();
  }

  public static make(model: ModelWithField): GeoPointNode {
    const coordinates = model.reduceFieldDef((geo, def, channel) => {
      if (isProjectionFieldDef(def)) {
        geo[def.type] = def.field;
      }
      return geo;
    }, {});

    if (keys(coordinates).length <= 0) { // lat lng not found
      return null;
    }

    return new GeoPointNode(model.getName('projection'), [coordinates[LONGITUDE], coordinates[LATITUDE]], [coordinates[LONGITUDE] + '_geo', coordinates[LATITUDE] + '_geo']);
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
