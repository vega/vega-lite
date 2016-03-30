import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {RepeatModel} from '../repeat';
import {ConcatModel} from './../concat';
import {Model} from '../model';
import {unique} from '../../util';

import {DataComponent} from './data';


export namespace filter {
  function parse(model: Model): string {
    return model.transform().filter;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let filterComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source but has filter, then merge
    if (!childDataComponent.source && childDataComponent.filter) {
      // merge by adding &&
      filterComponent =
        (filterComponent ? filterComponent + ' && ' : '') +
        childDataComponent.filter;
      delete childDataComponent.filter;
    }
    return filterComponent;
  }

  export function parseLayer(model: LayerModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`
    let filterComponent = parse(model);
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && childDataComponent.filter && childDataComponent.filter === filterComponent) {
        // same filter in child so we can just delete it
        delete childDataComponent.filter;
      }
    });
    return filterComponent;
  }

  export function parseRepeat(model: RepeatModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`

    const filters = model.children().map((child) => child.component.data.filter);
    if (unique(filters).length === 1) {
      // all filters are the same
      model.children().forEach((child) => {
        const childDataComponent = child.component.data;
        delete childDataComponent.filter;
      });
      return filters[0];
    }

    return null;
  }

  export function parseConcat(model: ConcatModel) {
    const filters = model.children().map((child) => child.component.data.filter);
    if (unique(filters).length === 1) {
      // all filters are the same
      model.children().forEach((child) => {
        const childDataComponent = child.component.data;
        delete childDataComponent.filter;
      });
      return filters[0];
    }

    return null;
  }

  export function assemble(component: DataComponent) {
    const filter = component.filter;
    return filter ? [{
      type: 'filter',
      test: filter
    }] : [];
  }
}
