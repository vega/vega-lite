/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleAxis} from '../../../src/compile/axis/assemble';
import {AxisComponent} from '../../../src/compile/axis/component';



describe('compile/axis/assemble', () => {
  describe('assembleAxis()', () => {
    it('outputs grid axis with only grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}}
        }
      });
      const axis = assembleAxis(axisCmpt, 'grid');
      assert.isUndefined(axis.encode.labels);
    });

    it('outputs main axis without grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}}
        }
      });
      const axis = assembleAxis(axisCmpt, 'main');
      assert.isUndefined(axis.encode.grid);
    });
  });

});
