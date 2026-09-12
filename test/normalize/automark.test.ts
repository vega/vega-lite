import * as log from '../../src/log/index.js';
import {LocalLogger} from '../../src/log/index.js';
import {chooseMark} from '../../src/normalize/automark.js';
import {normalize} from '../../src/normalize/index.js';
import {TopLevelSpec} from '../../src/spec/index.js';

function resolvedMark(encoding: any, mark: any = 'auto'): any {
  const spec: TopLevelSpec = {
    data: {url: 'data/values.json'},
    mark,
    encoding,
  } as TopLevelSpec;
  return (normalize(spec as any) as any).mark;
}

describe('AutoMarkNormalizer', () => {
  describe('mark selection from x/y types', () => {
    it('chooses point for quantitative × quantitative (scatterplot)', () => {
      expect(
        resolvedMark({
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'quantitative'},
        }),
      ).toBe('point');
    });

    it('chooses line when one continuous axis is temporal (time series)', () => {
      expect(
        resolvedMark({
          x: {field: 'date', type: 'temporal'},
          y: {field: 'b', type: 'quantitative'},
        }),
      ).toBe('line');
      expect(
        resolvedMark({
          x: {field: 'b', type: 'quantitative'},
          y: {field: 'date', type: 'temporal'},
        }),
      ).toBe('line');
    });

    it('chooses bar for one continuous and one discrete axis', () => {
      expect(
        resolvedMark({
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'c', type: 'nominal'},
        }),
      ).toBe('bar');
      expect(
        resolvedMark({
          x: {field: 'c', type: 'ordinal'},
          y: {field: 'a', type: 'quantitative'},
        }),
      ).toBe('bar');
    });

    it('does not aggregate when crossing a measure with a category', () => {
      const spec: TopLevelSpec = {
        data: {url: 'data/values.json'},
        mark: 'auto',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'c', type: 'nominal'},
        },
      } as TopLevelSpec;
      const normalized = normalize(spec as any) as any;
      expect(normalized.encoding.x.aggregate).toBeUndefined();
    });
  });

  describe('both-discrete axes', () => {
    it('chooses rect (heatmap) when color carries a measure', () => {
      expect(
        resolvedMark({
          x: {field: 'c', type: 'nominal'},
          y: {field: 'd', type: 'ordinal'},
          color: {aggregate: 'mean', field: 'a', type: 'quantitative'},
        }),
      ).toBe('rect');
    });

    it('chooses point (bubble) when size carries a measure', () => {
      expect(
        resolvedMark({
          x: {field: 'c', type: 'nominal'},
          y: {field: 'd', type: 'ordinal'},
          size: {field: 'a', type: 'quantitative'},
        }),
      ).toBe('point');
    });

    it('chooses point for two discrete axes with no measure', () => {
      expect(
        resolvedMark({
          x: {field: 'c', type: 'nominal'},
          y: {field: 'd', type: 'ordinal'},
        }),
      ).toBe('point');
    });
  });

  describe('1D histogram / count injection', () => {
    it('bins a single quantitative field and counts on the empty axis', () => {
      const {mark, encoding} = chooseMark({x: {field: 'a', type: 'quantitative'}}, undefined);
      expect(mark).toBe('bar');
      expect((encoding as any).x.bin).toBe(true);
      expect((encoding as any).y).toEqual({aggregate: 'count', type: 'quantitative'});
    });

    it('counts a single discrete field without binning', () => {
      const {mark, encoding} = chooseMark({x: {field: 'c', type: 'nominal'}}, undefined);
      expect(mark).toBe('bar');
      expect((encoding as any).x.bin).toBeUndefined();
      expect((encoding as any).y).toEqual({aggregate: 'count', type: 'quantitative'});
    });

    it('counts a single temporal field without binning', () => {
      const {mark, encoding} = chooseMark({y: {field: 'date', type: 'temporal'}}, undefined);
      expect(mark).toBe('bar');
      expect((encoding as any).y.bin).toBeUndefined();
      expect((encoding as any).x).toEqual({aggregate: 'count', type: 'quantitative'});
    });

    it('does not re-bin an already-binned field', () => {
      const {encoding} = chooseMark({x: {field: 'a', bin: true, type: 'quantitative'}}, undefined);
      expect((encoding as any).x.bin).toBe(true);
      expect((encoding as any).y).toEqual({aggregate: 'count', type: 'quantitative'});
    });
  });

  describe('geo and polar', () => {
    it('chooses geoshape for a geojson field', () => {
      const {mark} = chooseMark({shape: {field: 'geo', type: 'geojson'}}, undefined);
      expect(mark).toBe('geoshape');
    });

    it('chooses point for latitude/longitude', () => {
      const {mark} = chooseMark(
        {latitude: {field: 'lat', type: 'quantitative'}, longitude: {field: 'lon', type: 'quantitative'}},
        undefined,
      );
      expect(mark).toBe('point');
    });

    it('chooses arc for theta with no positional channel (pie)', () => {
      const {mark} = chooseMark(
        {theta: {field: 'a', type: 'quantitative'}, color: {field: 'c', type: 'nominal'}},
        undefined,
      );
      expect(mark).toBe('arc');
    });
  });

  describe('prefer', () => {
    it('promotes quantitative × quantitative to line', () => {
      expect(
        resolvedMark(
          {x: {field: 'a', type: 'quantitative'}, y: {field: 'b', type: 'quantitative'}},
          {type: 'auto', prefer: 'line'},
        ),
      ).toBe('line');
    });

    it('allows area, which is never inferred otherwise', () => {
      expect(
        resolvedMark(
          {x: {field: 'date', type: 'temporal'}, y: {field: 'b', type: 'quantitative'}},
          {type: 'auto', prefer: 'area'},
        ),
      ).toBe('area');
    });

    it('still applies 1D count/bin injection under prefer', () => {
      const {mark, encoding} = chooseMark({x: {field: 'a', type: 'quantitative'}}, 'line');
      expect(mark).toBe('line');
      expect((encoding as any).x.bin).toBe(true);
      expect((encoding as any).y).toEqual({aggregate: 'count', type: 'quantitative'});
    });

    it(
      'warns and infers when prefer is invalid',
      log.wrap((localLogger: LocalLogger) => {
        const mark = resolvedMark(
          {x: {field: 'a', type: 'quantitative'}, y: {field: 'b', type: 'quantitative'}},
          {type: 'auto', prefer: 'banana'},
        );
        expect(mark).toBe('point');
        expect(localLogger.warns[0]).toEqual(log.message.autoMarkInvalidPrefer('banana'));
      }),
    );
  });

  describe('edge cases', () => {
    it('accepts the object form {type: "auto"}', () => {
      expect(
        resolvedMark({x: {field: 'a', type: 'quantitative'}, y: {field: 'b', type: 'quantitative'}}, {type: 'auto'}),
      ).toBe('point');
    });

    it(
      'warns and defaults to point when no positional/geo encoding is found',
      log.wrap((localLogger: LocalLogger) => {
        const {mark} = chooseMark({color: {field: 'c', type: 'nominal'}}, undefined);
        expect(mark).toBe('point');
        expect(localLogger.warns[0]).toEqual(log.message.autoMarkUndetermined());
      }),
    );

    // Gradual specification: an intermediate mark:"auto" spec must still normalize.
    it('normalizes a mark:"auto" spec with no encoding without throwing', () => {
      const normalized = normalize({data: {url: 'data/values.json'}, mark: 'auto'} as any) as any;
      expect(normalized.mark).toBe('point');
    });
  });

  describe('equivalence with explicit marks', () => {
    it('produces the same Vega-Lite normalized output as the explicit mark', () => {
      const encoding = {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'quantitative'},
      };
      const auto = normalize({data: {url: 'data/values.json'}, mark: 'auto', encoding} as any) as any;
      const explicit = normalize({data: {url: 'data/values.json'}, mark: 'point', encoding} as any) as any;
      expect(auto).toEqual(explicit);
    });
  });
});
