/* tslint:disable:quotemark */

import {SourceNode} from '../../../src/compile/data/source';
import {Data} from '../../../src/data';

function parse(data: Data) {
  return new SourceNode(data);
}

describe('compile/data/source', () => {
  describe('compileUnit', () => {
    describe('with explicit values', () => {
      const source = parse({
        values: [{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}]
      });

      it('should have values', () => {
        expect(source.data.values).toEqual([{a: 1, b: 2, c: 3}, {a: 4, b: 5, c: 6}]);
      });

      it('should have no source.format.type', () => {
        expect(source.data.format).toEqual(undefined);
      });
    });

    describe('with explicit values as CSV', () => {
      const source = parse({
        values: 'a\n1\n2\n3',
        format: {type: 'csv'}
      });

      it('should have values', () => {
        expect(source.data.values).toEqual('a\n1\n2\n3');
      });

      it('should have correct type', () => {
        expect(source.data.format.type).toEqual('csv');
      });
    });

    describe('with link to url', () => {
      const source = parse({
        url: 'http://foo.bar/file.csv'
      });

      it('should have format.type csv', () => {
        expect(source.data.format.type).toEqual('csv');
      });
      it('should have correct url', () => {
        expect(source.data.url).toEqual('http://foo.bar/file.csv');
      });
    });

    describe('without file ending', () => {
      const source = parse({
        url: 'http://foo.bar/file.baz'
      });

      it('should have format.type json', () => {
        expect(source.data.format.type).toEqual('json');
      });
    });

    describe('with no data specified', () => {
      const source = parse(undefined);

      it('should provide placeholder source data', () => {
        expect(source.dataName).toEqual('source');
      });
    });

    describe('with named data source provided', () => {
      const source = parse({name: 'foo'});

      it('should provide named source data', () => {
        expect(source.dataName).toEqual('foo');
      });
    });

    describe('data format', () => {
      describe('json', () => {
        it('should include property if specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'json', property: 'baz'}
          });

          expect(source.data.format.property).toEqual('baz');
        });
      });

      describe('topojson', () => {
        describe('feature property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', feature: 'baz'}
          });

          it('should have format.type topojson', () => {
            expect(source.data.format.type).toEqual('topojson');
          });
          it('should have format.feature baz', () => {
            expect(source.data.format.feature).toEqual('baz');
          });
        });

        describe('mesh property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', mesh: 'baz'}
          });

          it('should have format.type topojson', () => {
            expect(source.data.format.type).toEqual('topojson');
          });
          it('should have format.mesh baz', () => {
            expect(source.data.format.mesh).toEqual('baz');
          });
        });
      });
    });
  });

  describe('assemble', () => {
    // TODO: write test
  });
});
