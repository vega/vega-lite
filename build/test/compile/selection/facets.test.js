/* tslint:disable quotemark */
import { unitName } from '../../../src/compile/selection';
import { assembleFacetSignals } from '../../../src/compile/selection/assemble';
import { parseModel } from '../../util';
describe('Faceted Selections', () => {
    const model = parseModel({
        data: { url: 'data/anscombe.json' },
        facet: {
            column: { field: 'Series', type: 'nominal' },
            row: { field: 'X', type: 'nominal', bin: true }
        },
        spec: {
            layer: [
                {
                    mark: 'rule',
                    encoding: { y: { value: 10 } }
                },
                {
                    selection: {
                        one: { type: 'single' },
                        twp: { type: 'multi' },
                        three: { type: 'interval' }
                    },
                    mark: 'rule',
                    encoding: {
                        x: { value: 10 }
                    }
                }
            ]
        }
    });
    model.parse();
    const unit = model.children[0].children[1];
    it('should assemble a facet signal', () => {
        expect(assembleFacetSignals(model, [])).toContainEqual({
            name: 'facet',
            value: {},
            on: [
                {
                    events: [{ source: 'scope', type: 'mousemove' }],
                    update: 'isTuple(facet) ? facet : group("cell").datum'
                }
            ]
        });
    });
    it('should name the unit with the facet keys', () => {
        expect(unitName(unit)).toEqual(`"child_layer_1" + '__facet_row_' + (facet["bin_maxbins_6_X"]) + '__facet_column_' + (facet["Series"])`);
    });
});
//# sourceMappingURL=facets.test.js.map