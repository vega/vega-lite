/* tslint:disable:quotemark */

import {assert} from 'chai';
import {assembleAxis} from '../../../src/compile/axis/assemble';
import {AxisComponent} from '../../../src/compile/axis/component';
import {defaultConfig} from '../../../src/config';



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
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      assert.isUndefined(axis.encode.labels);
    });

    it('outputs grid axis with custom zindex', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        zindex: 3
      });
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      assert.equal(axis.zindex, 3);
    });

    it('outputs main axis without grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}}
        }
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      assert.isUndefined(axis.encode.grid);
    });

    it('correctly assemble title fieldDefs', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        title: [{aggregate: 'max', field: 'a'}, {aggregate: 'min', field: 'b'}]
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      assert.equal(axis.title, 'Max of a, Min of b');
    });
  });

});
