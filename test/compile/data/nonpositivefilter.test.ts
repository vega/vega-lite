/* tslint:disable:quotemark */

import {assert} from 'chai';

import {DataComponent} from '../../../src/compile/data/data';
import {nonPositiveFilter} from '../../../src/compile/data/nonpositivefilter';
import {parseUnitModel} from '../../util';

describe('compile/data/nonpositivefilter', function () {
  const model = parseUnitModel({
    mark: "point",
    encoding: {
      x: {field: 'a', type: "temporal"},
      y: {field: 'b', type: "quantitative", scale: {type: 'log'}}
    }
  });
  describe('parseUnit & assemble', function() {
    it('should produce the correct nonPositiveFilter component' ,function () {
      model.component.data = {} as DataComponent;
      model.component.data.nonPositiveFilter = nonPositiveFilter.parseUnit(model);
      assert.deepEqual(model.component.data.nonPositiveFilter, {
        b: true,
        a: false
      });
    });

    it('should assemble the correct filter transform', function() {
      const filterTransform = nonPositiveFilter.assemble(model.component.data.nonPositiveFilter)[0];
      assert.deepEqual(filterTransform, {
        type: 'filter',
        expr: 'datum["b"] > 0'
      });
    });

    // it('unit (with aggregated log scale)', function() {
    //   // TODO: write
    // });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    // TODO: write test
  });

  describe('assemble', function() {
    // TODO: write test
  });
});
