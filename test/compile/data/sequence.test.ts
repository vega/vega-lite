import {assembleRootData} from '../../../src/compile/data/assemble';
import {SequenceNode} from '../../../src/compile/data/sequence';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/data/sequence', () => {
  describe('assembled', () => {
    it('should return a proper vg transform', () => {
      const params = {
        start: 1,
        stop: 10,
        step: 2
      };
      const sequence = new SequenceNode(null, params);
      expect(sequence.assemble()).toEqual({
        type: 'sequence',
        start: 1,
        stop: 10,
        step: 2
      });
    });
  });

  describe('producedFields', () => {
    it('should return correct default', () => {
      const params = {
        start: 1,
        stop: 10,
        step: 2
      };
      const sequence = new SequenceNode(null, params);
      expect(sequence.producedFields()).toEqual(new Set(['data']));
    });

    it('should return specified field', () => {
      const params = {
        start: 1,
        stop: 10,
        step: 2,
        as: 'foo'
      };
      const sequence = new SequenceNode(null, params);
      expect(sequence.producedFields()).toEqual(new Set(['foo']));
    });
  });

  it('should parse and add generator transform correctly', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {
        sequence: {start: 0, stop: 20, step: 2}
      },
      mark: 'line'
    });
    model.parseData();

    const node = model.component.data.raw.parent;
    expect(node).toBeInstanceOf(SequenceNode);

    expect(assembleRootData(model.component.data, {})).toEqual([
      {
        name: 'source_0',
        transform: [{type: 'sequence', start: 0, stop: 20, step: 2}]
      }
    ]);
  });
});
