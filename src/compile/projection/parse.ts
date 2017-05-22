import {Model} from '../model';
import {UnitModel} from '../unit';

import {PROJECTION_PROPERTIES} from '../../projection';
import {VgProjection} from '../../vega.schema';

export function parseProjectionComponent(model: UnitModel): VgProjection[] {
  const projection = parseProjection(model);
  return projection ? [projection] : [];
}

/**
 * Parse projection on a model.
 */
export function parseProjection(model: Model): VgProjection {
  const projection = model.projection;

  if (!projection) {
    return undefined;
  }

  const projectionComponent: VgProjection = {
    name: model.getName('projection')
  };

  PROJECTION_PROPERTIES.forEach((property) => {
    if (property in projection) {
      projectionComponent[property] = projection[property];
    }
  });

  return projectionComponent;
}
