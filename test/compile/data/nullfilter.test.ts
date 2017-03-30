/* tslint:disable:quotemark */

import {assert} from 'chai';

import {nullFilter} from '../../../src/compile/data/nullfilter';
import {UnitSpec} from '../../../src/spec';

import {mergeDeep} from '../../../src/util';
import {parseUnitModel} from '../../util';

describe('compile/data/nullfilter', function() {
  describe('compileUnit', function() {
    const spec: UnitSpec = {
      mark: "point",
      encoding: {
        y: {field: 'qq', type: "quantitative"},
        x: {field: 'tt', type: "temporal"},
        color: {field: 'oo', type: "ordinal"}
      }
    };

    it('should add filterNull for Q and T by default', function () {
      const model = parseUnitModel(spec);
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"},
        oo: null
      });
    });

    it('should add filterNull for O when specified', function () {
      const model = parseUnitModel(mergeDeep(spec, {
        config: {
          filterInvalid: true
        }
      }));
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"},
        oo: {field: 'oo', type: "ordinal"}
      });
    });

    it('should add no null filter if filterInvalid is false', function () {
      const model = parseUnitModel(mergeDeep(spec, {
        config: {
          filterInvalid: false
        }
      }));
      assert.deepEqual(nullFilter.parseUnit(model), {
        qq: null,
        tt: null,
        oo: null
      });
    });

    it ('should add no null filter for count field', () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          y: {aggregate: 'count', field: '*', type: "quantitative"}
        }
      });

      assert.deepEqual(nullFilter.parseUnit(model), {});
    });
  });

  describe('parseLayer', function() {
    // TODO: write test
  });

  describe('parseFacet', function() {
    it('should produce child\'s filter if child has no source and the facet has no filter', function() {
      // TODO: write
    });

    it('should produce child\'s filter and its own filter if child has no source and the facet has filter', function() {
      // TODO: write
    });
  });

  describe('assemble', function() {
    // TODO: write
  });
});
