import {Model} from '../model';
import {UnitModel} from '../unit';

import {PROJECTION_PROPERTIES} from '../../projection';
import {vals} from '../../util';
import {VgProjection, VgProjectionFit} from '../../vega.schema';
import {SourceNode} from '../data/source';

export function parseProjectionComponent(model: UnitModel): VgProjection[] {
  const projection = parseProjection(model);
  return projection ? [projection] : [];
}

/**
 * Parse projection on a model.
 */
export function parseProjection(model: UnitModel): VgProjection {
  const projection = model.projection;

  if (!projection) {
    return undefined;
  }

  if (vals(model.component.data.sources).length > 1) {
    console.log('Should this ever happen?');
  }

  const fit: VgProjectionFit = {
    signal: `data('${model.requestDataName('main')}')`
  };

  const projectionComponent: VgProjection = {
    name: model.getName('projection'),
    fit: fit,
    size: [model.width, model.height]
  };

  PROJECTION_PROPERTIES.forEach((property) => {
    if (property in projection) {
      projectionComponent[property] = projection[property];
    }
  });

  return projectionComponent;
}
