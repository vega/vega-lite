import {isVgSignalRef, VgProjection} from '../../vega.schema';
import {FacetModel} from '../facet';
import {Model, ModelWithField} from '../model';
import {UnitModel} from '../unit';

export function assembleProjections(model: Model): VgProjection[] {
  if (model instanceof UnitModel || model instanceof FacetModel) {
    const projection = assembleProjection(model);
    return projection ? [projection] : [];
  } else {
    return model.children.reduce((projections, child) => {
      return projections.concat(assembleProjections(child));
    }, []);
  }
}

export function assembleProjection(model: ModelWithField): VgProjection {
  const component = model.component.projection;
  return component ? {
    name: component.get('name'),
    fit: component.fit(model),
    size: component.size,
    ...component.explicit
  } : undefined;
}
