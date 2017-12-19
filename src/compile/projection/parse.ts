import {SHAPE, X, X2, Y, Y2} from '../../channel';
import {Config} from '../../config';
import {MAIN} from '../../data';
import {isFieldDef} from '../../fielddef';
import {GEOSHAPE} from '../../mark';
import {Projection, PROJECTION_PROPERTIES} from '../../projection';
import {LookupData} from '../../transform';
import {LATITUDE, LONGITUDE} from '../../type';
import {contains, duplicate, every, hash} from '../../util';
import {VgProjection, VgSignalRef} from '../../vega.schema';
import {isUnitModel, Model} from '../model';
import {UnitModel} from '../unit';
import {ProjectionComponent} from './component';

export function parseProjection(model: Model) {
  if (isUnitModel(model)) {
    model.component.projection = parseUnitProjection(model);
  } else {
    // because parse happens from leaves up (unit specs before layer spec),
    // we can be sure that the above if statement has already occured
    // and therefore we have access to child.component.projection
    // for each of model's children
    model.component.projection = parseNonUnitProjections(model);
  }
}

function parseUnitProjection(model: UnitModel): ProjectionComponent {
  const {specifiedProjection, markDef, config, encoding} = model;

  const isGeoShapeMark = markDef && markDef.type === GEOSHAPE;
  const isGeoPointMark = encoding && [X, Y, X2, Y2].some(
    (channel) => {
      const def = encoding[channel];
      return isFieldDef(def) && contains([LATITUDE, LONGITUDE], def.type);
  });

  if (isGeoShapeMark || isGeoPointMark) {
    let data: VgSignalRef | string;
    if (isGeoPointMark || (isGeoShapeMark && encoding[SHAPE])) {
      // if there is a shape encoding or latitude / longitude encoding,
      // the compiler added a geojson transform w/ a signal as specified
      data = {
        signal: model.getName('geojson')
      };
    } else {
      // main source is geojson, so we can just use that
      data = model.requestDataName(MAIN);
    }

    return new ProjectionComponent(model.projectionName(true), {
      ...(config.projection || {}),
      ...(specifiedProjection || {}),
    }, [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')], [data]);
  }

  return undefined;
}

function dryMerge(first: ProjectionComponent, second: ProjectionComponent): ProjectionComponent {
  const properties = every(PROJECTION_PROPERTIES, (prop) => {
    // neither has the poperty
    if (!first.explicit.hasOwnProperty(prop) &&
      !second.explicit.hasOwnProperty(prop)) {
      return true;
    }
    // both have property and an equal value for property
    if (first.explicit.hasOwnProperty(prop) &&
      second.explicit.hasOwnProperty(prop) &&
      hash(first.get(prop)) === hash(second.get(prop))) {
      return true;
    }
    return false;
  });

  const size = hash(first.size) === hash
    (second.size);
  if (size) {
    if (properties) {
      return first;
    } else if (hash(first.explicit) === hash
      ({})) {
      return second;
    } else if (hash(second.explicit) === hash
      ({})) {
      return first;
    }
  }
  return null;
}

function parseNonUnitProjections(model: Model): ProjectionComponent {
  if (model.children.length === 0) {
    return undefined;
  }

  let nonUnitProjection: ProjectionComponent;
  const mergable = every(model.children, (child) => {
    parseProjection(child);
    const projection = child.component.projection;
    if (!projection) {
      // child layer does not use a projection
      return true;
    } else if (!nonUnitProjection) {
      // cached 'projection' is null, cache this one
      nonUnitProjection = projection;
      return true;
    } else {
      const merge = dryMerge(nonUnitProjection, projection);
      if (merge) {
        nonUnitProjection = merge;
      }
      return !!merge;
    }
  });

  // it cached one and all other children share the same projection,
  if (nonUnitProjection && mergable) {
    // so we can elevate it to the layer level
    const name = model.projectionName(true);
    const modelProjection = new ProjectionComponent(
      name,
      nonUnitProjection.specifiedProjection,
      nonUnitProjection.size,
      duplicate(nonUnitProjection.data)
    );

    // rename and assign all others as merged
    model.children.forEach((child) => {
      if (child.component.projection) {
        modelProjection.data = modelProjection.data.concat(child.component.projection.data);
        child.renameProjection(child.component.projection.get('name'), name);
        child.component.projection.merged = true;
      }
    });

    return modelProjection;
  }

  return undefined;
}
