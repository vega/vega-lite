import {assert} from 'chai';
import {AncestorParse} from '../../../src/compile/data';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {parseTransformArray} from '../../../src/compile/data/parse';
import {Dict} from '../../../src/util';
import {parseUnitModel} from '../../util';
import {FilterNode} from './../../../src/compile/data/filter';

describe('compile/data/filter', () => {
  it('should create parse for filtered fields', () => {
    const model = parseUnitModel({
      data: {url: 'a.json'},
      transform: [
        {filter: {field: 'a', equal: {year: 2000}}},
        {filter: {field: 'b', oneOf: ['a', 'b']}},
        {filter: {field: 'c', range: [{year: 2000}, {year: 2001}]}},
        {filter: {field: 'd', range: [1, 2]}}
      ],
      mark: 'point',
      encoding: {}
    });

    let parse: Dict<string> = {};

    // extract the parse from the parse nodes that were generated along with the filter nodes
    const root = new DataFlowNode(null);
    parseTransformArray(root, model, new AncestorParse());
    let node = root.children[0];

    while (node.numChildren() > 0) {
      if (node instanceof ParseNode) {
        parse = {...parse, ...node.parse};
      }
      assert.equal(node.numChildren(), 1);
      node = node.children[0];
    }

    assert.deepEqual(parse, {
      a: 'date',
      b: 'string',
      c: 'date',
      d: 'number'
    });
  });

  describe('dependentFields and producedFields', () => {
    it('returns the right fields', () => {
      const node = new FilterNode(null, null, 'datum.foo > 2');

      expect(node.dependentFields()).toEqual({foo: true});
      expect(node.producedFields()).toEqual({});
    });
  });
});
