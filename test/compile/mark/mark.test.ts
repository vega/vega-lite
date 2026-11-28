import {parse, View} from 'vega';
import {compile} from '../../../src/compile/compile.js';
import {getSort, parseMarkGroups} from '../../../src/compile/mark/mark.js';
import {UnitModel} from '../../../src/compile/unit.js';
import {GEOSHAPE} from '../../../src/mark.js';
import {UnitSpec} from '../../../src/spec/index.js';
import {
  parseFacetModel,
  parseUnitModel,
  parseUnitModelWithScale,
  parseUnitModelWithScaleAndLayoutSize,
  parseConcatModel,
  parseUnitModelWithScaleAndSelection,
} from '../../util.js';

describe('Mark', () => {
  describe('rounded stacked interval bars', () => {
    const cases: {name: string; encoding: UnitSpec<string>['encoding']}[] = [
      {
        name: 'pre-binned time units',
        encoding: {
          x: {field: 'day', type: 'temporal', timeUnit: 'binnedutcyearmonthdate'},
          y: {field: 'value', type: 'quantitative'},
        },
      },
      {
        name: 'shifted pre-binned time units',
        encoding: {
          x: {field: 'day', type: 'temporal', timeUnit: 'binnedutcyearmonthdate', bandPosition: 0},
          y: {field: 'value', type: 'quantitative'},
        },
      },
      {
        name: 'shifted generated time units',
        encoding: {
          x: {field: 'day', type: 'temporal', timeUnit: 'utcyearmonthdate', bandPosition: 0},
          y: {field: 'value', type: 'quantitative'},
        },
      },
      {
        name: 'explicit x2 intervals',
        encoding: {
          x: {field: 'day', type: 'temporal'},
          x2: {field: 'end'},
          y: {field: 'value', type: 'quantitative'},
        },
      },
      {
        name: 'explicit y2 intervals',
        encoding: {
          y: {field: 'day', type: 'temporal'},
          y2: {field: 'end'},
          x: {field: 'value', type: 'quantitative'},
        },
      },
    ];

    it.each(cases)('preserves bar dimensions and stacking for $name', async ({encoding}) => {
      const data = {
        values: [
          {day: '2026-10-01', end: '2026-10-02', value: 100, series: 'a'},
          {day: '2026-10-01', end: '2026-10-02', value: 50, series: 'b'},
          {day: '2026-10-02', end: '2026-10-03', value: 200, series: 'a'},
        ],
      };
      const render = async (cornerRadiusEnd: number) => {
        const {spec} = compile({
          width: 600,
          height: 300,
          data,
          mark: {type: 'bar', cornerRadiusEnd},
          encoding: {...encoding, color: {field: 'series', type: 'nominal'}},
        });
        const view = new View(parse(spec), {renderer: 'none'});
        try {
          await view.runAsync();
          const bars: {width: number; height: number; start: number; end: number}[] = [];
          let roundedGroups = 0;
          const visit = (item: any) => {
            if (item.mark?.marktype === 'rect' && item.mark.role === 'mark') {
              bars.push({
                width: item.width,
                height: item.height,
                start: item.datum.value_start,
                end: item.datum.value_end,
              });
            }
            if (
              item.clip &&
              [
                item.cornerRadiusTopLeft,
                item.cornerRadiusTopRight,
                item.cornerRadiusBottomLeft,
                item.cornerRadiusBottomRight,
              ].some((radius) => radius > 0)
            ) {
              roundedGroups++;
            }
            item.items?.forEach(visit);
          };
          visit((view.scenegraph() as unknown as {root: unknown}).root);
          return {bars, roundedGroups};
        } finally {
          view.finalize();
        }
      };

      const square = await render(0);
      const rounded = await render(3);
      expect(rounded.roundedGroups).toBe(2);
      expect(rounded.bars).toHaveLength(data.values.length);
      expect(rounded.bars.some((bar) => bar.start > 0)).toBe(true);
      for (const [index, bar] of rounded.bars.entries()) {
        expect(bar.width).toBeGreaterThan(0);
        expect(bar.height).toBeGreaterThan(0);
        expect(bar.width).toBeCloseTo(square.bars[index].width);
        expect(bar.height).toBeCloseTo(square.bars[index].height);
        expect(bar.start).toBe(square.bars[index].start);
        expect(bar.end).toBe(square.bars[index].end);
      }
    });
  });

  describe('parseMarkGroup', () => {
    // PATH
    describe('Multi-series Line', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'line', style: 'trend'},
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'},
          color: {field: 'symbol', type: 'nominal'},
        },
      });
      it('should have a facet directive and a nested mark group that uses the faceted data.', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('pathgroup');
        expect(markGroup.from).toEqual({
          facet: {
            name: 'faceted_path_main',
            data: 'main',
            groupby: ['symbol'],
          },
        });
        const submarkGroup = markGroup.marks[0];
        expect(submarkGroup.name).toBe('marks');
        expect(submarkGroup.type).toBe('line');
        expect(submarkGroup.style).toEqual(['line', 'trend']);
        expect(submarkGroup.from.data).toBe('faceted_path_main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('pathgroup');
        expect(markGroup.from).toEqual({
          facet: {
            name: 'faceted_path_main',
            data: 'main',
            groupby: ['symbol'],
          },
        });
        const submarkGroup = markGroup.marks[0];
        expect(submarkGroup.transform).toBeUndefined();
      });
    });

    describe('Single Line', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'line',
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'},
        },
      });
      it('should have mark group with proper data and key', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('marks');
        expect(markGroup.type).toBe('line');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).toBeUndefined();
      });

      // NON-PATH
    });
    describe('Points with key', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'},
          key: {field: 'k', type: 'quantitative'},
        },
      });
      it('should have mark group with proper data and key', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.type).toBe('symbol');
        expect(markGroup.key).toBe('k');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).toBeUndefined();
      });
    });

    it('Geoshape should have post encoding transform', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa',
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states',
          },
        },
        encoding: {},
      });
      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].transform).toBeDefined();
      expect(markGroup[0].transform[0].type).toEqual(GEOSHAPE);
    });

    describe('Aggregated Bar with a color with binned x', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
          y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'},
          color: {type: 'ordinal', field: 'Effect__Amount_of_damage'},
        },
      });
      it('should use main stacked data source', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].from.data).toBe('main');
        expect(markGroup[0].style).toEqual(['bar']);
      });
      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).toBeUndefined();
      });
    });

    describe('Faceted aggregated Bar with a color with binned x', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'},
        },
        spec: {
          mark: 'bar',
          encoding: {
            x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
            y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'},
            color: {type: 'ordinal', field: 'Effect__Amount_of_damage'},
          },
        },
      });
      it('should use faceted data source', () => {
        model.parseScale();
        model.parseLayoutSize();

        const markGroup = parseMarkGroups(model.child as UnitModel);
        expect(markGroup[0].from.data).toBe('child_main');
      });

      it('should not have post encoding transform', () => {
        model.parseScale();
        model.parseLayoutSize();

        const markGroup = parseMarkGroups(model.child as UnitModel);
        expect(markGroup[0].transform).toBeUndefined();
      });
    });

    describe('Aggregated bar', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
          y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'},
        },
      });

      it('should use main aggregated data source', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).toBeUndefined();
      });
    });

    it('should set aria to false for bar mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          aria: false,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].aria).toBe(false);
    });

    it('should set aria to false for rounded bar mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          aria: false,
          cornerRadius: 2,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].marks[0].marks[0].aria).toBe(false);
    });

    it('should set aria to false for line mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'line',
          aria: false,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].aria).toBe(false);
    });

    it('should group mark with corder radius by nominal field', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          cornerRadius: 2,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'nominal', field: 'bar'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].from.facet.groupby).toEqual(['bar']);
    });

    it('should round the left or right end of horizontal stacked bar groups', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          cornerRadiusEnd: 5,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo', aggregate: 'sum'},
          y: {type: 'nominal', field: 'bar'},
          color: {type: 'nominal', field: 'series'},
        },
      });

      const markGroup = parseMarkGroups(model);
      const update = markGroup[0].encode.update;

      const rightEnd = 'scale("x", datum["max_sum_foo_end"]) > scale("x", datum["max_sum_foo_start"])';
      const leftEnd = 'scale("x", datum["min_sum_foo_end"]) < scale("x", datum["min_sum_foo_start"])';
      const roundRight = [{test: rightEnd, value: 5}, {value: 0}];
      const roundLeft = [{test: leftEnd, value: 5}, {value: 0}];

      expect(update).toMatchObject({
        cornerRadiusTopRight: roundRight,
        cornerRadiusBottomRight: roundRight,
        cornerRadiusTopLeft: roundLeft,
        cornerRadiusBottomLeft: roundLeft,
      });
    });

    it('should round the top or bottom end of vertical stacked bar groups', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          cornerRadiusEnd: 5,
        },
        encoding: {
          x: {type: 'nominal', field: 'bar'},
          y: {type: 'quantitative', field: 'foo', aggregate: 'sum'},
          color: {type: 'nominal', field: 'series'},
        },
      });

      const markGroup = parseMarkGroups(model);
      const update = markGroup[0].encode.update;

      const topEnd = 'scale("y", datum["max_sum_foo_end"]) < scale("y", datum["max_sum_foo_start"])';
      const bottomEnd = 'scale("y", datum["min_sum_foo_end"]) > scale("y", datum["min_sum_foo_start"])';
      const roundTop = [{test: topEnd, value: 5}, {value: 0}];
      const roundBottom = [{test: bottomEnd, value: 5}, {value: 0}];

      expect(update).toMatchObject({
        cornerRadiusTopLeft: roundTop,
        cornerRadiusTopRight: roundTop,
        cornerRadiusBottomLeft: roundBottom,
        cornerRadiusBottomRight: roundBottom,
      });
    });

    it('should not let a config cornerRadiusEnd override a mark cornerRadius on stacked bar groups', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          cornerRadius: 2,
        },
        encoding: {
          x: {type: 'nominal', field: 'bar'},
          y: {type: 'quantitative', field: 'foo', aggregate: 'sum'},
          color: {type: 'nominal', field: 'series'},
        },
        config: {bar: {cornerRadiusEnd: 5}},
      });

      const markGroup = parseMarkGroups(model);
      const update = markGroup[0].encode.update;

      // The mark-level cornerRadius wins, so no conditional value-end rounding is emitted.
      expect(update.cornerRadius).toEqual({value: 2});
      expect(update.cornerRadiusTopLeft).toBeUndefined();
      expect(update.cornerRadiusBottomRight).toBeUndefined();
    });

    it('should not emit the raw markDef tooltip directive when the generated tooltip is empty', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          x: {field: 'a', type: 'quantitative', tooltip: false},
          y: {field: 'b', type: 'quantitative', tooltip: false},
        },
      });

      const update = parseMarkGroups(model)[0].encode.update;
      expect(update.tooltip).toBeUndefined();
    });

    it('should pass static markDef tooltip values through', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: 'static tooltip'},
        encoding: {
          x: {field: 'a', type: 'quantitative'},
        },
      });

      const update = parseMarkGroups(model)[0].encode.update;
      expect(update.tooltip).toEqual({value: 'static tooltip'});
    });

    describe('interactiveFlag', () => {
      it('should not contain flag if no selections', () => {
        const model = parseUnitModelWithScaleAndSelection({
          mark: 'point',
          encoding: {
            x: {type: 'quantitative', field: 'foo'},
            y: {type: 'nominal', field: 'bar'},
          },
        });

        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].interactive).toBeUndefined();
      });

      it('should be true for units with a selection', () => {
        const model = parseConcatModel({
          vconcat: [
            {
              params: [{name: 'brush', select: 'interval'}],
              mark: 'point',
              encoding: {
                x: {type: 'quantitative', field: 'foo'},
                y: {type: 'nominal', field: 'bar'},
              },
            },
            {
              mark: 'point',
              encoding: {
                x: {type: 'ordinal', field: 'baz'},
                y: {type: 'quantitative', field: 'world'},
              },
            },
          ],
        });

        model.parseScale();
        model.parseSelections();
        model.parseMarkGroup();
        expect(model.children[0].component.mark[0].interactive).toBeTruthy();
        expect(model.children[1].component.mark[0].interactive).toBeFalsy();
      });

      it('should be true for units with a selection or tooltip', () => {
        const model = parseConcatModel({
          vconcat: [
            {
              params: [{name: 'brush', select: {type: 'interval'}}],
              mark: 'point',
              encoding: {
                x: {type: 'quantitative', field: 'foo'},
                y: {type: 'nominal', field: 'bar'},
              },
            },
            {
              mark: 'point',
              encoding: {
                x: {type: 'ordinal', field: 'baz'},
                y: {type: 'quantitative', field: 'world'},
                tooltip: {type: 'nominal', field: 'hello'},
              },
            },
          ],
        });

        model.parseScale();
        model.parseSelections();
        model.parseMarkGroup();
        expect(model.children[0].component.mark[0].interactive).toBeTruthy();
        expect(model.children[1].component.mark[0].interactive).toBeTruthy();
      });
    });
  });

  describe('getSort', () => {
    it('should order by order field', () => {
      const model = parseUnitModel({
        data: {url: 'data/driving.json'},
        mark: 'line',
        encoding: {
          x: {field: 'miles', type: 'quantitative', scale: {zero: false}},
          y: {field: 'gas', type: 'quantitative', scale: {zero: false}},
          order: {field: 'year', type: 'temporal'},
        },
      });
      expect(getSort(model)).toEqual({
        field: ['datum["year"]'],
        order: ['ascending'],
      });
    });

    it('should have no sort if order = {value: null}', () => {
      const model = parseUnitModel({
        data: {url: 'data/driving.json'},
        mark: 'line',
        encoding: {
          x: {field: 'miles', type: 'quantitative', scale: {zero: false}},
          y: {field: 'gas', type: 'quantitative', scale: {zero: false}},
          order: {value: null},
        },
      });
      expect(getSort(model)).toBeUndefined();
    });

    it('should order by x by default if x is the dimension', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            bin: {maxbins: 10},
            field: 'IMDB_Rating',
            type: 'quantitative',
          },
          color: {
            field: 'Source',
            type: 'nominal',
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
          },
        },
      });
      expect(getSort(model)).toEqual({
        field: 'x',
      });
    });

    it('have order by x if the dimension field has sort:null', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            field: 'a',
            type: 'nominal',
            sort: null,
          },
          color: {
            field: 'Source',
            type: 'nominal',
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
          },
        },
      });
      expect(getSort(model)).toEqual({
        field: 'x',
      });
    });

    it("should order by x's custom sort order by default if x is the dimension", () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            type: 'nominal',
            field: 'Name',
            sort: ['Peter', 'Mary', 'Paul'],
          },
          y: {type: 'quantitative', field: 'Score'},
        },
      });
      expect(getSort(model)).toEqual({
        field: 'x',
      });
    });

    it('should order by the right channel when sort by encoding', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            type: 'nominal',
            field: 'Name',
            sort: 'y',
          },
          y: {type: 'quantitative', field: 'Score'},
        },
      });
      expect(getSort(model)).toEqual({
        field: 'x',
      });
    });

    it('should not order by a missing dimension', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          color: {
            field: 'Source',
            type: 'nominal',
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
          },
        },
      });
      expect(getSort(model)).toBeUndefined();
    });
  });

  describe('projection clipping', () => {
    it('should not clip if auto-fit', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa',
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states',
          },
        },
        encoding: {
          color: {
            value: 'black',
          },
          opacity: {
            value: 0.8,
          },
        },
        config: {mark: {tooltip: null}},
      });
      model.parse();
      const mark = parseMarkGroups(model);
      expect(mark[0].clip).toBeUndefined();
    });
    it('should clip if auto-fit', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa',
          scale: 1000,
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states',
          },
        },
        encoding: {
          color: {
            value: 'black',
          },
          opacity: {
            value: 0.8,
          },
        },
        config: {mark: {tooltip: null}},
      });
      model.parse();
      const mark = parseMarkGroups(model);
      expect(mark[0].clip).toBe(true);
    });
  });

  describe('signal clipping', () => {
    it('should pass clip as a signal if clip is an expression', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          clip: {expr: "datum['foo'] > 10"},
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].clip).toEqual({signal: "datum['foo'] > 10"});
    });

    it('should pass clip as a signal if clip is a signal', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          clip: {signal: "datum['foo'] > 10"},
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].clip).toEqual({signal: "datum['foo'] > 10"});
    });

    it('should pass clip as a boolean if clip is true', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          clip: true,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].clip).toBe(true);
    });

    it('should not have clip defined if clip is false', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          clip: false,
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
        },
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].clip).toBeUndefined();
    });
  });
});
