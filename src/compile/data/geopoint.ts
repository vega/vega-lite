import {isFieldDef} from '../../fielddef';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, duplicate, keys} from '../../util';
import {VgGeoPointTransform} from '../../vega.schema';
import {UnitModel} from '../unit';
import {DataFlowNode} from './dataflow';

export interface GeoPointTransform {
  projection: string;
  fields: string[];
  as?: string[];
}

export class GeoPointNode extends DataFlowNode {
  public clone() {
    return new GeoPointNode(duplicate(this.transform));
  }

  constructor(private transform: GeoPointTransform) {
    super();
  }

  public static make(model: UnitModel) {
    const {encoding} = model;

    const geo = {};
    keys(encoding).forEach(key => {
      const def = encoding[key];
      if (isFieldDef(def) && contains([LONGITUDE, LATITUDE], def.type)) {
        geo[def.type] = def;
      }
    });

    if (keys(geo).length <= 0) { // lat lng not found
      return null;
    }

    const geopoint = {
      projection: model.getName('projection'),
      fields: [geo[LONGITUDE].field, geo[LATITUDE].field],
      as: [model.getName(LONGITUDE), model.getName(LATITUDE)]
    };

    return new GeoPointNode(geopoint);
  }

  public merge(other: GeoPointNode) {
    this.remove();
  }

  public assemble(): VgGeoPointTransform {
    return {
      type: 'geopoint',
      projection: this.transform.projection,
      fields: this.transform.fields,
      as: this.transform.as
    };
  }
}
