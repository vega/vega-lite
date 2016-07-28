/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel} from '../../util';
import {SOURCE} from '../../../src/data';
import {source} from '../../../src/compile/data/source';
import {mockRenameModel} from './datatestutil';

describe('compile/data/source', () => {
  describe('parseUnit', function() {
    describe('with explicit values', function() {
      const model = parseUnitModel({
        "data": {
          "values": [{"a": 1,"b": 2,"c": 3},{"a": 4,"b": 5,"c": 6}]
        }
      });

      const sourceComponent = source.parseUnit(model);

      it('should have values', function() {
        assert.deepEqual(sourceComponent.values, [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
      });

      it('should have source.format.type', function(){
        assert.deepEqual(sourceComponent.format.type, 'json');
      });
    });

    describe('with link to url', function() {
      const model = parseUnitModel({
          data: {
            url: 'http://foo.bar',
          }
        });

      const sourceComponent = source.parseUnit(model);

      it('should have format.type json', function() {
        assert.equal(sourceComponent.format.type, 'json');
      });
      it('should have correct url', function() {
        assert.equal(sourceComponent.url, 'http://foo.bar');
      });
    });

    describe('with no data specified', function() {
      const model = parseUnitModel({mark: "point"});
      const sourceComponent = source.parseUnit(model);
      it('should be undefined', function() {
        assert.deepEqual(sourceComponent, undefined);
      });
    });

    describe('data format', function() {
      describe('json', () => {
        it('should include property if specified', function() {
          const model = parseUnitModel({
            data: {
              url: 'http://foo.bar',
              format: {type: 'json', property: 'baz'}
            }
          });
          const sourceComponent = source.parseUnit(model);
          assert.equal(sourceComponent.format.property, 'baz');
        });
      });

      describe('topojson', () => {
        describe('feature property is specified', function() {
          const model = parseUnitModel({
              data: {
                url: 'http://foo.bar',
                format: {type: 'topojson', feature: 'baz'}
              }
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.format.type, 'topojson');
          });
          it('should have format.feature baz', function() {
            assert.equal(sourceComponent.format.feature, 'baz');
          });
        });

        describe('mesh property is specified', function() {
          const model = parseUnitModel({
              data: {
                url: 'http://foo.bar',
                format: {type: 'topojson', mesh: 'baz'}
              }
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.format.type, 'topojson');
          });
          it('should have format.mesh baz', function() {
            assert.equal(sourceComponent.format.mesh, 'baz');
          });
        });
      });
    });
  });

  describe('assemble', function () {
    it('should add parse', function () {
      const component: any = {
        source: {
          url: 'www.bar.baz'
        },
        formatParse: {
          a: 'number',
          b: 'date'
        }
      };
      const data = source.assemble(mockRenameModel(), component);
      assert.deepEqual(data, {
        url: 'www.bar.baz',
        name: 'source',
        format: { parse: { a: 'number', b: 'date' } }
      });
    });

    it('should rename the source', function () {
      const component: any = {
        source: {},
        formatParse: {}
      };
      const data = source.assemble(mockRenameModel(SOURCE, 'src'), component);
      assert.deepEqual(data, {
        name: 'src'
      });
    });
  });
});
