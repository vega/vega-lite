import {assert} from 'chai';
import {assembleScaleRange} from '../../../src/compile/scale/assemble';
import {parseUnitModel, parseUnitModelWithScale} from '../../util';

describe('compile/scale/assemble', () => {
  describe('assembleScaleRange', () => {
    it('replaces a range step constant with a signal', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'}
        }
      });

      assert.deepEqual(
        assembleScaleRange({step: 21}, 'x', model, 'x'),
        {step: {signal: 'x_step'}}
      );
    });

    it('updates width signal when renamed.', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'}
        }
      });

      // mock renaming
      model.renameLayoutSize('width', 'new_width');


      assert.deepEqual(
        assembleScaleRange([0, {signal: 'width'}], 'x', model, 'x'),
        [0, {signal: 'new_width'}]
      );
    });

    it('updates height signal when renamed.', () => {
      const model = parseUnitModelWithScale({
        mark: 'point',
        encoding: {
          x: {field: 'y', type: 'quantitative'}
        }
      });

      // mock renaming
      model.renameLayoutSize('height', 'new_height');

      assert.deepEqual(
        assembleScaleRange([0, {signal: 'height'}], 'x', model, 'x'),
        [0, {signal: 'new_height'}]
      );
    });
  });
});
