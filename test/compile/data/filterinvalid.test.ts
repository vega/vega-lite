/* tslint:disable:quotemark */

import {assert} from 'chai';

import {TopLevel, UnitSpec} from '../../../src/spec';

import {FilterInvalidNode} from '../../../src/compile/data/filterinvalid';
import {ModelWithField} from '../../../src/compile/model';
import {FieldDef} from '../../../src/fielddef';
import {Dict, mergeDeep} from '../../../src/util';
import {parseUnitModelWithScale} from '../../util';

function parse(model: ModelWithField) {
  return FilterInvalidNode.make(model);
}

describe('compile/data/nullfilter', function() {
  describe('compileUnit', function() {
    const spec: UnitSpec = {
      mark: "point",
      encoding: {
        y: {field: 'qq', type: "quantitative"},
        x: {field: 'tt', type: "temporal"},
        color: {field: 'oo', type: "ordinal"},
        shape: {field: 'nn', type: "nominal"}
      }
    };

    it('should add filterNull for Q and T by default', function () {
      const model = parseUnitModelWithScale(spec);
      assert.deepEqual<Dict<FieldDef<string>>>(parse(model).filter, {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"}
      });
    });

    it('should add filterNull for Q and T when invalidValues is "filter".', function () {
      const model = parseUnitModelWithScale(mergeDeep<TopLevel<UnitSpec>>(spec, {
        config: {
          invalidValues: 'filter'
        }
      }));
      assert.deepEqual<Dict<FieldDef<string>>>(parse(model).filter, {
        qq: {field: 'qq', type: "quantitative"},
        tt: {field: 'tt', type: "temporal"}
      });
    });

    it('should add no null filter if when invalidValues is null', function () {
      const model = parseUnitModelWithScale(mergeDeep<TopLevel<UnitSpec>>(spec, {
        config: {
          invalidValues: null
        }
      }));
      assert.deepEqual(parse(model), null);
    });

    it ('should add no null filter for count field', () => {
      const model = parseUnitModelWithScale({
        mark: "point",
        encoding: {
          y: {aggregate: 'count', field: '*', type: "quantitative"}
        }
      });

      assert.deepEqual(parse(model), null);
    });
  });

  describe('assemble', function() {
    // TODO: write
  });
});
