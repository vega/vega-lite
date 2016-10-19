import {COLOR} from '../../channel';
import {ORDINAL} from '../../type';
import {extend, vals, flatten, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {UnitModel} from '../unit';

import {DataComponent} from './data';


/**
 * We need to add a rank transform so that we can use the rank value as
 * input for color ramp's linear scale.
 */
export namespace colorRank {
  /**
   * Return hash dict from a color field's name to the sort and rank transforms
   */
  export function parseUnit(model: UnitModel) {
    let colorRankComponent: Dict<VgTransform[]> = {};
    if (model.has(COLOR) && model.encoding().color.type === ORDINAL) {
      colorRankComponent[model.field(COLOR)] = [{
        type: 'sort',
        by: model.field(COLOR)
      }, {
        type: 'rank',
        field: model.field(COLOR),
        output: {
          rank: model.field(COLOR, { prefix: 'rank' })
        }
      }];
    }
    return colorRankComponent;
  }

  export function parseFacet(model: FacetModel) {
    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // TODO: we have to see if color has union scale here

      // For now, let's assume it always has union scale
      const colorRankComponent = childDataComponent.colorRank;
      delete childDataComponent.colorRank;
      return colorRankComponent;
    }
    return {} as Dict<VgTransform[]>;
  }

  export function parseLayer(model: LayerModel) {
    let colorRankComponent = {} as Dict<VgTransform[]>;

    model.children().forEach((child) => {
      const childDataComponent = child.component.data;

      // If child doesn't have its own data source, then merge
      if (!childDataComponent.source) {
        extend(colorRankComponent, childDataComponent.colorRank);
        delete childDataComponent.colorRank;
      }
    });

    return colorRankComponent;
  }

  export function assemble(component: DataComponent) {
    return flatten(vals(component.colorRank));
  }
}
