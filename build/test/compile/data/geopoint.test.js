import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { GeoPointNode } from '../../../src/compile/data/geopoint';
import { contains, every } from '../../../src/util';
import { parseUnitModel } from '../../util';
describe('compile/data/geopoint', () => {
    describe('geojson', () => {
        it('should make transform and assemble correctly', () => {
            const model = parseUnitModel({
                data: {
                    url: 'data/zipcodes.csv',
                    format: {
                        type: 'csv'
                    }
                },
                mark: 'circle',
                encoding: {
                    longitude: {
                        field: 'longitude',
                        type: 'quantitative'
                    },
                    latitude: {
                        field: 'latitude',
                        type: 'quantitative'
                    }
                }
            });
            model.parse();
            const root = new DataFlowNode(null);
            GeoPointNode.parseAll(root, model);
            let node = root.children[0];
            while (node != null) {
                expect(node).toBeInstanceOf(GeoPointNode);
                const transform = node.assemble();
                expect(transform.type).toEqual('geopoint');
                expect(every(['longitude', 'latitude'], field => contains(transform.fields, field))).toBe(true);
                expect(every([model.getName('x'), model.getName('y')], a => contains(transform.as, a))).toBe(true);
                expect(transform.projection).toBeDefined();
                expect(node.children.length).toBeLessThanOrEqual(1);
                node = node.children[0];
            }
        });
    });
});
//# sourceMappingURL=geopoint.test.js.map