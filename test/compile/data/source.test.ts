/* tslint:disable:quotemark */

import {assert} from 'chai';

import {SourceNode} from '../../../src/compile/data/source';
import {Model} from '../../../src/compile/model';
import {parseUnitModel} from '../../util';

function parse(model: Model) {
  return new SourceNode(model).data;
}

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

      const source = parse(model);

      it('should have values', function() {
        assert.deepEqual(source.values, [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
      });

      it('should have source.format.type', function(){
        assert.deepEqual(source.format.type, 'json');
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

      const source = parse(model);

      it('should have format.type json', function() {
        assert.equal(source.format.type, 'json');
      });
      it('should have correct url', function() {
        assert.equal(source.url, 'http://foo.bar');
      });
    });

    describe('with no data specified', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {}
      });

      const source = parse(model);

      it('should provide placeholder source data', function() {
        assert.deepEqual(source, {name: 'source'});
      });
    });

    describe('with named data source provided', function() {
      const model = parseUnitModel({
        data: {name: 'foo'},
        mark: 'point',
        encoding: {}
      });

      const source = parse(model);

      it('should provide named source data', function() {
        assert.deepEqual(source, {name: 'foo'});
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

          const source = parse(model);

          assert.equal(source.format.property, 'baz');
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

          const source = parse(model);

          it('should have format.type topojson', function() {
            assert.equal(source.name, 'source');
            assert.equal(source.format.type, 'topojson');
          });
          it('should have format.feature baz', function() {
            assert.equal(source.format.feature, 'baz');
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

          const source = parse(model);

          it('should have format.type topojson', function() {
            assert.equal(source.name, 'source');
            assert.equal(source.format.type, 'topojson');
          });
          it('should have format.mesh baz', function() {
            assert.equal(source.format.mesh, 'baz');
          });
        });
      });
    });
  });

  describe('assemble', function() {
    // TODO: write test
  });
});

