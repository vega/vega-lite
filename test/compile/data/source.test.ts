/* tslint:disable:quotemark */

import {assert} from 'chai';

import {SourceNode} from '../../../src/compile/data/source';
import {Data} from '../../../src/data';

function parse(data: Data) {
  return new SourceNode(data);
}

describe('compile/data/source', () => {
  describe('compileUnit', () => {
    describe('with explicit values', () => {
      const source = parse({
        values: [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]
      });

      it('should have values', () => {
        assert.deepEqual(source.data.values, [{a: 1, b:2, c:3}, {a: 4, b:5, c:6}]);
      });

      it('should have no source.format.type', () => {
        assert.deepEqual(source.data.format, undefined);
      });
    });

    describe('with explicit values as CSV', () => {
      const source = parse({
        values: "a\n1\n2\n3",
        format: {type: 'csv'}
      });

      it('should have values', () => {
        assert.deepEqual(source.data.values, "a\n1\n2\n3");
      });

      it('should have correct type', () => {
        assert.equal(source.data.format.type, 'csv');
      });
    });

    describe('with link to url', () => {
      const source = parse({
        url: 'http://foo.bar/file.csv',
      });

      it('should have format.type csv', () => {
        assert.equal(source.data.format.type, 'csv');
      });
      it('should have correct url', () => {
        assert.equal(source.data.url, 'http://foo.bar/file.csv');
      });
    });

    describe('without file ending', () => {
      const source = parse({
        url: 'http://foo.bar/file.baz',
      });

      it('should have format.type json', () => {
        assert.equal(source.data.format.type, 'json');
      });
    });

    describe('with no data specified', () => {
      const source = parse(undefined);

      it('should provide placeholder source data', () => {
        assert.equal(source.dataName, 'source');
      });
    });

    describe('with named data source provided', () => {
      const source = parse({name: 'foo'});

      it('should provide named source data', () => {
        assert.equal(source.dataName, 'foo');
      });
    });

    describe('data format', () => {
      describe('json', () => {
        it('should include property if specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'json', property: 'baz'}
          });

          assert.equal(source.data.format.property, 'baz');
        });
      });

      describe('topojson', () => {
        describe('feature property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', feature: 'baz'}
          });

          it('should have format.type topojson', () => {
            assert.equal(source.data.format.type, 'topojson');
          });
          it('should have format.feature baz', () => {
            assert.equal(source.data.format.feature, 'baz');
          });
        });

        describe('mesh property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', mesh: 'baz'}
          });

          it('should have format.type topojson', () => {
            assert.equal(source.data.format.type, 'topojson');
          });
          it('should have format.mesh baz', () => {
            assert.equal(source.data.format.mesh, 'baz');
          });
        });
      });
    });
  });

  describe('assemble', () => {
    // TODO: write test
  });
});

