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

  const sources: SourceNode[] = vals(model.component.data.sources);
  const geodata: SourceNode = sources[sources.length - 1];
  const fit: VgProjectionFit = {
    signal: `data('${geodata.dataName}')`
  };

  const projectionComponent: VgProjection = {
    name: model.getName('projection'),
    fit:  fit
  };

  PROJECTION_PROPERTIES.forEach((property) => {
    if (property in projection) {
      projectionComponent[property] = projection[property];
    }
  });

  return projectionComponent;
}
