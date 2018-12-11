/* tslint:disable quotemark */

import {FacetModel} from '../../../src/compile/facet';
import * as selection from '../../../src/compile/selection/selection';
import {UnitModel} from '../../../src/compile/unit';
import {parseModel} from '../../util';

describe('Faceted Selections', () => {
  const model = parseModel({
    data: {url: 'data/anscombe.json'},
    facet: {
      column: {field: 'Series', type: 'nominal'},
      row: {field: 'X', type: 'nominal', bin: true}
    },
    spec: {
      layer: [
        {
          mark: 'rule',
          encoding: {y: {value: 10}}
        },
        {
          selection: {
            one: {type: 'single'},
            twp: {type: 'multi'},
            three: {type: 'interval'}
          },
          mark: 'rule',
          encoding: {
            x: {value: 10}
          }
        }
      ]
    }
  });

  model.parse();
  const unit = model.children[0].children[1] as UnitModel;

  it('should assemble a facet signal', () => {
    expect(selection.assembleFacetSignals(model as FacetModel, [])).toContainEqual({
      name: 'facet',
      value: {},
      on: [
        {
          events: [{source: 'scope', type: 'mousemove'}],
          update: 'isTuple(facet) ? facet : group("cell").datum'
        }
      ]
    });
  });

  it('should name the unit with the facet keys', () => {
    expect(selection.unitName(unit)).toEqual(
      `"child_layer_1" + '_' + (facet["bin_maxbins_6_X"]) + '_' + (facet["Series"])`
    );
  });
});
