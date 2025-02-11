import {FacetModel} from '../../../src/compile/facet.js';
import {unitName} from '../../../src/compile/selection/index.js';
import {assembleFacetSignals} from '../../../src/compile/selection/assemble.js';
import {UnitModel} from '../../../src/compile/unit.js';
import {parseModel} from '../../util.js';

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
          params: [
            {name: 'one', select: 'point'},
            {name: 'two', select: 'interval'}
          ],
          mark: 'rule',
          encoding: {
            x: {field: 'a'},
            y: {field: 'b'}
          }
        }
      ]
    }
  });

  model.parse();
  const unit = model.children[0].children[1] as UnitModel;

  it('should assemble a facet signal', () => {
    expect(assembleFacetSignals(model as FacetModel, [])).toContainEqual({
      name: 'facet',
      value: {},
      on: [
        {
          events: [{source: 'scope', type: 'pointermove'}],
          update: 'isTuple(facet) ? facet : group("cell").datum'
        }
      ]
    });
  });

  it('should name the unit with the facet keys', () => {
    expect(unitName(unit)).toBe(
      `"child_layer_1" + '__facet_row_' + (facet["bin_maxbins_6_X"]) + '__facet_column_' + (facet["Series"])`
    );
  });
});
