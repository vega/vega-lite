import {assembleRootData} from '../../../src/compile/data/assemble';
import {GraticuleNode} from '../../../src/compile/data/graticule';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/data/graticule', () => {
  describe('GraticuleNode', () => {
    describe('assemble', () => {
      it('should return a proper vg transform with object param', () => {
        const params = {
          stepMinor: [15, 10],
          precision: 2
        };
        const graticule = new GraticuleNode(null, params);
        expect(graticule.assemble()).toEqual({
          type: 'graticule',
          stepMinor: [15, 10],
          precision: 2
        });
      });

      it('should return a proper vg transform with true param', () => {
        const params = true;
        const graticule = new GraticuleNode(null, params);
        expect(graticule.assemble()).toEqual({
          type: 'graticule'
        });
      });
    });

    describe('dependentFields', () => {
      it('should return empty set', () => {
        const sequence = new GraticuleNode(null, true);
        expect(sequence.dependentFields()).toEqual(new Set());
      });
    });

    describe('producedFields', () => {
      it('should return undefined', () => {
        const sequence = new GraticuleNode(null, true);
        expect(sequence.producedFields()).toEqual(undefined);
      });
    });
  });

  it('should parse and add generator transform correctly', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        graticule: true
      },
      mark: 'geoshape'
    });
    model.parseData();

    const node = model.component.data.raw.parent;
    expect(node).toBeInstanceOf(GraticuleNode);

    expect(assembleRootData(model.component.data, {})).toEqual([
      {
        name: 'source_0',
        transform: [{type: 'graticule'}]
      }
    ]);
  });
});
