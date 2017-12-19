import {error} from 'util';
import {contains} from '../../util';
import {isVgSignalRef, VgProjection, VgSignalRef} from '../../vega.schema';
import {FacetModel} from '../facet';
import {isConcatModel, isLayerModel, isRepeatModel, isUnitModel, Model, ModelWithField} from '../model';
import {UnitModel} from '../unit';

export function assembleProjections(model: Model): VgProjection[] {
  if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
    return assembleProjectionsForModelAndChildren(model);
  } else {
    return assembleProjectionForModel(model);
  }
}

export function assembleProjectionsForModelAndChildren(model: Model): VgProjection[] {
  return model.children.reduce((projections, child) => {
    return projections.concat(child.assembleProjections());
  }, assembleProjectionForModel(model));
}

export function assembleProjectionForModel(model: Model): VgProjection[] {
  const component = model.component.projection;
  if (!component || component.merged) {
    return [];
  }

  const projection = component.combine();
  const {name, ...rest} = projection;

  const size: VgSignalRef = {
    signal: `[${component.size.map((ref) => ref.signal).join(', ')}]`
  };

  const fit: string[] = component.data.reduce((sources, data) => {
    const source: string = isVgSignalRef(data) ? data.signal : `data('${model.lookupDataSource(data)}')`;
    if (!contains(sources, source)) {
      // build a unique list of sources
      sources.push(source);
    }
    return sources;
  }, []);

  if (fit.length <= 0) {
    error("Projection's fit didn't find any data sources");
  }

  return [{
    name,
    size,
    fit: {
      signal: fit.length > 1 ? `[${fit.join(', ')}]` : fit[0]
    },
    ...rest
  }];
}
