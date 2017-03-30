import {Projection, PROJECTION_PROPERTIES} from '../../projection';
import {VgProjection} from '../../vega.schema';

import {UnitModel} from '../unit';

export function parseLegend(model: UnitModel): VgProjection {
  const projection = model.projection;

  let def: VgProjection = {};

  PROJECTION_PROPERTIES.forEach(function(property) {
    const value = projection[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const encodeSpec = legend.encode || {};
  ['labels', 'legend', 'title', 'symbols'].forEach(function(part) {
    let value = encode[part] ?
      encode[part](fieldDef, encodeSpec[part], model, channel) : // apply rule
      encodeSpec[part]; // no rule -- just default values
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[part] = {update: value};
    }
  });

  return def;
}