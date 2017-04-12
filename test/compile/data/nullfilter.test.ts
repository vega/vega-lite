/* tslint:disable:quotemark */

import {assert} from 'chai';

import {UnitSpec} from '../../../src/spec';

import {NullFilterNode} from '../../../src/compile/data/nullfilter';
import {Model} from '../../../src/compile/model';
import {FieldDef} from '../../../src/fielddef';
import {Dict, mergeDeep} from '../../../src/util';
import {parseUnitModel} from '../../util';

function parse(model: Model) {
  return (new NullFilterNode(model)).filteredFields;
}

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
      assert.deepEqual<Dict<FieldDef>>(parse(model), {
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
      assert.deepEqual<Dict<FieldDef>>(parse(model), {
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
      assert.deepEqual(parse(model), {
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

      assert.deepEqual(parse(model), {});
    });
  });

  describe('assemble', function() {
    // TODO: write
  });
});
