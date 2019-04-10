import {SourceNode} from '../../../src/compile/data/source';
import {Data} from '../../../src/data';

function parse(data: Data) {
  return new SourceNode(data);
}

describe('compile/data/source', () => {
  describe('SphereGenerator', () => {
    it('should parse and add assemble with boolean param', () => {
      const node = parse({name: 'foo', sphere: true});
      expect(node.assemble()).toEqual({
        name: 'foo',
        values: [{type: 'Sphere'}],
        transform: []
      });
    });
    it('should parse and add assemble with object param', () => {
      const node = parse({name: 'foo', sphere: {}});
      expect(node.assemble()).toEqual({
        name: 'foo',
        values: [{type: 'Sphere'}],
        transform: []
      });
    });
  });
});
