import {assembleRootData} from '../../../src/compile/data/assemble';
import {SequenceNode} from '../../../src/compile/data/sequence';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/data/sequence', () => {
  describe('assemble', () => {
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

  describe('dependentFields', () => {
    it('should return empty set', () => {
      const params = {
        start: 1,
        stop: 10,
        step: 2
      };
      const sequence = new SequenceNode(null, params);
      expect(sequence.dependentFields()).toEqual(new Set());
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

    const data = assembleRootData(model.component.data, {});
    expect(data[0].transform[0]).toEqual({type: 'sequence', start: 0, stop: 20, step: 2});
  });
});
