import {COLOR} from '../../channel';
import {ORDINAL} from '../../type';
import {extend, vals, flatten, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';


/**
 * We need to add a rank transform so that we can use the rank value as
 * input for color ramp's linear scale.
 */
export namespace colorRank {
  /**
   * Return hash dict from a color field's name to the sort and rank transforms
   */
  export function parseUnit(model: Model) {
    // FIXME: why is this an array?
    let colorRankComponent: Dict<VgTransform[]> = {};
    if (model.has(COLOR) && model.fieldDef(COLOR).type === ORDINAL) {
      colorRankComponent[model.field(COLOR)] = [{
        type: 'sort',
        by: model.field(COLOR)
      }, {
        type: 'rank',
        field: model.field(COLOR),
        output: {
          rank: model.field(COLOR, { prefn: 'rank_' })
        }
      }];
    }
    return colorRankComponent;
  }

  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    childDataComponents.forEach((data) => {
      extend(dataComponent.colorRank, data.colorRank);
      delete data.colorRank;
    });
  }

  export function assemble(component: DataComponent) {
    return flatten(vals(component.colorRank));
  }
}
