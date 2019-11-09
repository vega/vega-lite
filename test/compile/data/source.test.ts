import {SourceNode} from '../../../src/compile/data/source';
import {Data} from '../../../src/data';

function parse(data: Data) {
  return new SourceNode(data);
}

describe('compile/data/source', () => {
  describe('compileUnit', () => {
    describe('with explicit values', () => {
      const source = parse({
        values: [
          {a: 1, b: 2, c: 3},
          {a: 4, b: 5, c: 6}
        ]
      });

      it('should have values', () => {
        expect(source.data.values).toEqual([
          {a: 1, b: 2, c: 3},
          {a: 4, b: 5, c: 6}
        ]);
      });

      it('should have no source.format.type', () => {
        expect(source.data).not.toHaveProperty('format');
      });
    });

    describe('with explicit values as CSV', () => {
      const source = parse({
        values: 'a\n1\n2\n3',
        format: {type: 'csv'}
      });

      it('should have values', () => {
        expect(source.data.values).toBe('a\n1\n2\n3');
      });

      it('should have correct type', () => {
        expect(source.data.format.type).toBe('csv');
      });
    });

    describe('with link to url', () => {
      const source = parse({
        url: 'http://foo.bar/file.csv'
      });

      it('should have format.type csv', () => {
        expect(source.data.format.type).toBe('csv');
      });
      it('should have correct url', () => {
        expect(source.data.url).toBe('http://foo.bar/file.csv');
      });
    });

    describe('without file ending', () => {
      const source = parse({
        url: 'http://foo.bar/file.baz'
      });

      it('should have format.type json', () => {
        expect(source.data.format.type).toBe('json');
      });
    });

    describe('with no data specified', () => {
      const source = parse(undefined);

      it('should provide placeholder source data', () => {
        expect(source.dataName).toBe('source');
      });
    });

    describe('with named data source provided', () => {
      const source = parse({name: 'foo'});

      it('should provide named source data', () => {
        expect(source.dataName).toBe('foo');
      });
    });

    describe('data format', () => {
      describe('json', () => {
        it('should include property if specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'json', property: 'baz'}
          });

          expect(source.data.format.property).toBe('baz');
        });
      });

      describe('topojson', () => {
        describe('feature property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', feature: 'baz'}
          });

          it('should have format.type topojson', () => {
            expect(source.data.format.type).toBe('topojson');
          });
          it('should have format.feature baz', () => {
            expect(source.data.format.feature).toBe('baz');
          });
        });

        describe('mesh property is specified', () => {
          const source = parse({
            url: 'http://foo.bar',
            format: {type: 'topojson', mesh: 'baz'}
          });

          it('should have format.type topojson', () => {
            expect(source.data.format.type).toBe('topojson');
          });
          it('should have format.mesh baz', () => {
            expect(source.data.format.mesh).toBe('baz');
          });
        });
      });
    });
  });

  describe('assemble', () => {
    // TODO: write test
  });
});
