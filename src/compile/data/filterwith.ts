import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {RepeatModel} from '../repeat';
import {ConcatModel} from './../concat';
import {UnitModel} from '../unit';
import {Model} from '../model';
import {unique} from '../../util';
import {compileSelectionPredicate} from '../common';

import {DataComponent} from './data';

export namespace filterWith {
  function parse(model: UnitModel): string {
    var fw = model.transform().filterWith;
    return fw ? compileSelectionPredicate(model, model.transform().filterWith) : null;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    // todo
    return null;
  }

  export function parseLayer(model: LayerModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`
    let filterComponent = '';
    model.children().forEach((child) => {
      const childDataComponent = child.component.data;
      if (model.compatibleSource(child) && childDataComponent.filterWith && childDataComponent.filterWith === filterComponent) {
        // same filter in child so we can just delete it
        delete childDataComponent.filterWith;
      }
    });
    return filterComponent;
  }

  export function parseRepeat(model: RepeatModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`

    const filters = model.children().map((child) => child.component.data.filterWith);
    if (unique(filters).length === 1) {
      // all filters are the same
      model.children().forEach((child) => {
        const childDataComponent = child.component.data;
        delete childDataComponent.filterWith;
      });
      return filters[0];
    }

    return null;
  }

  export function parseConcat(model: ConcatModel) {
    // Note that this `filter.parseLayer` method is called before `source.parseLayer`

    const filters = model.children().map((child) => child.component.data.filterWith);
    if (unique(filters).length === 1) {
      // all filters are the same
      model.children().forEach((child) => {
        const childDataComponent = child.component.data;
        delete childDataComponent.filterWith;
      });
      return filters[0];
    }

    return null;
  }

  export function assemble(component: DataComponent) {
    const filter = component.filterWith;
    return filter ? [{
      type: 'filter',
      test: filter
    }] : [];
  }
}
