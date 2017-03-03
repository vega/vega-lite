/* tslint:disable:quotemark */

import {assert} from 'chai';

import {source} from '../../../src/compile/data/source';

import {parseUnitModel} from '../../util';

describe('compile/data/source', function() {
  describe('compileUnit', function() {
    describe('with explicit values', function() {
      const model = parseUnitModel({
        data: {
          values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
        },
        mark: 'point',
        encoding: {}
      });

      const sourceComponent = source.parseUnit(model);

      it('should have values', function() {
        assert.equal(sourceComponent.name, 'source');
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
          },
          mark: 'point',
          encoding: {}
        });

      const sourceComponent = source.parseUnit(model);

      it('should have format.type json', function() {
        assert.equal(sourceComponent.name, 'source');
        assert.equal(sourceComponent.format.type, 'json');
      });
      it('should have correct url', function() {
        assert.equal(sourceComponent.url, 'http://foo.bar');
      });
    });

    describe('with no data specified', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {}
      });
      const sourceComponent = source.parseUnit(model);
      it('should provide placeholder source data', function() {
        assert.deepEqual(sourceComponent, {name: 'source'});
      });
    });

    describe('with named data source provided', function() {
      const model = parseUnitModel({
        data: {name: 'foo'},
        mark: 'point',
        encoding: {}
      });
      const sourceComponent = source.parseUnit(model);
      it('should provide named source data', function() {
        assert.deepEqual(sourceComponent, {name: 'foo'});
      });
    });

    describe('data format', function() {
      describe('json', () => {
        it('should include property if specified', function() {
          const model = parseUnitModel({
            data: {
              url: 'http://foo.bar',
              format: {type: 'json', property: 'baz'}
            },
            mark: 'point',
            encoding: {}
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
              },
              mark: 'point',
              encoding: {}
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.name, 'source');
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
              },
              mark: 'point',
              encoding: {}
            });

          const sourceComponent = source.parseUnit(model);

          it('should have format.type topojson', function() {
            assert.equal(sourceComponent.name, 'source');
            assert.equal(sourceComponent.format.type, 'topojson');
          });
          it('should have format.mesh baz', function() {
            assert.equal(sourceComponent.format.mesh, 'baz');
          });
        });
      });
    });
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
