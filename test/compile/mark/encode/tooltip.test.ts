import {BIN_RANGE_DELIMITER} from '../../../../src/compile/common.js';
import {tooltip, tooltipRefForEncoding} from '../../../../src/compile/mark/encode/index.js';
import {defaultConfig} from '../../../../src/config.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util.js';

describe('compile/mark/encode/tooltip', () => {
  describe('tooltip', () => {
    it('generates tooltip object signal for all encoding fields', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          tooltip: [
            {field: 'Horsepower', type: 'quantitative'},
            {field: 'Acceleration', type: 'quantitative'},
          ],
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}',
      });
    });

    it('generates tooltip object signal for all encoding fields when explicitly enabled', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}',
      });
    });

    it('generates no tooltip if encoding.tooltip === null', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
          tooltip: null,
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toBeUndefined();
    });

    it('generates tooltip object signal for all data if specified', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({signal: 'datum'});
    });
    it('uses tooltip signal if specified', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {signal: 'a'}},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({signal: 'a'});
    });

    it('generates tooltip object signal for all data if specified and reactiveGeom is true', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'line', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Acceleration', type: 'quantitative'},
        },
      });
      const props = tooltip(model, {reactiveGeom: true});
      expect(props.tooltip).toEqual({signal: 'datum.datum'});
    });

    it('priorizes tooltip field def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: [
            {field: 'Horsepower', type: 'quantitative'},
            {field: 'Acceleration', type: 'quantitative'},
          ],
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], ""), "Acceleration": format(datum["Acceleration"], "")}',
      });
    });

    it('priorizes tooltip value def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: {content: 'data'}},
        encoding: {
          x: {field: 'Cylinders', type: 'quantitative'},
          y: {field: 'Displacement', type: 'quantitative'},
          tooltip: {value: 'haha'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({value: 'haha'});
    });

    it('generates correct keys and values for channels with axis', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          x: {field: 'Date', type: 'quantitative', axis: {title: 'foo', format: '%y'}},
          y: {field: 'Displacement', type: 'quantitative', axis: {title: 'bar'}},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Date": format(datum["Date"], "%y"), "Displacement": format(datum["Displacement"], "")}',
      });
    });

    it('generates correct keys and values for channels with legend title', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          color: {field: 'Foobar', type: 'nominal', legend: {title: 'baz'}},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Foobar": isValid(datum["Foobar"]) ? datum["Foobar"] : ""+datum["Foobar"]}',
      });
    });
    it('generates correct keys and values for channels with title', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          color: {field: 'Foobar', type: 'nominal', title: 'baz'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"baz": isValid(datum["Foobar"]) ? datum["Foobar"] : ""+datum["Foobar"]}',
      });
    });

    it('generates correct keys and values for channels with title with quotes', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          color: {field: 'Foobar', type: 'nominal', title: '"baz"'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"\\"baz\\"": isValid(datum["Foobar"]) ? datum["Foobar"] : ""+datum["Foobar"]}',
      });
    });
  });

  describe('tooltipForEncoding', () => {
    it('returns correct tooltip signal for binned field', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              bin: true,
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal: `{"IMDB_Rating (binned)": !isValid(datum["bin_maxbins_10_IMDB_Rating"]) || !isFinite(+datum["bin_maxbins_10_IMDB_Rating"]) ? "null" : format(datum["bin_maxbins_10_IMDB_Rating"], "") + "${BIN_RANGE_DELIMITER}" + format(datum["bin_maxbins_10_IMDB_Rating_end"], "")}`,
      });
    });

    it('returns correct tooltip signal for normalized x|y stacked field', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              aggregate: 'sum',
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          {
            fieldChannel: 'x',
            groupbyChannels: [],
            groupbyFields: new Set(),
            offset: 'normalize',
            impute: false,
            stackBy: [],
          },
          defaultConfig,
        ),
      ).toEqual({
        signal: `{"Sum of IMDB_Rating": format(datum["sum_IMDB_Rating_end"]-datum["sum_IMDB_Rating_start"], ".0%")}`,
      });
    });

    it('returns correct tooltip signal for normalized theta stacked field', () => {
      expect(
        tooltipRefForEncoding(
          {
            theta: {
              aggregate: 'sum',
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          {
            fieldChannel: 'theta',
            groupbyChannels: [],
            groupbyFields: new Set(),
            offset: 'normalize',
            impute: false,
            stackBy: [],
          },
          defaultConfig,
        ),
      ).toEqual({
        signal: `{"Sum of IMDB_Rating": format(datum["sum_IMDB_Rating_end"]-datum["sum_IMDB_Rating_start"], ".0%")}`,
      });
    });

    it('returns correct tooltip signal for formatted normalized stacked field', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              aggregate: 'sum',
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          {
            fieldChannel: 'x',
            groupbyChannels: [],
            groupbyFields: new Set(),
            offset: 'normalize',
            impute: false,
            stackBy: [],
          },
          {...defaultConfig, normalizedNumberFormat: '.4%', customFormatTypes: true},
        ),
      ).toEqual({
        signal: `{"Sum of IMDB_Rating": format(datum["sum_IMDB_Rating_end"]-datum["sum_IMDB_Rating_start"], ".4%")}`,
      });
    });

    it('returns correct tooltip signal for formatted normalized stacked field using tooltipFormat', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              aggregate: 'sum',
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          {
            fieldChannel: 'x',
            groupbyChannels: [],
            groupbyFields: new Set(),
            offset: 'normalize',
            impute: false,
            stackBy: [],
          },
          {...defaultConfig, tooltipFormat: {normalizedNumberFormat: '.4%'}, customFormatTypes: true},
        ),
      ).toEqual({
        signal: `{"Sum of IMDB_Rating": format(datum["sum_IMDB_Rating_end"]-datum["sum_IMDB_Rating_start"], ".4%")}`,
      });
    });

    it('returns correct tooltip signal for formatted normalized stacked field preferring tooltipFormat', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              aggregate: 'sum',
              field: 'IMDB_Rating',
              type: 'quantitative',
            },
          },
          {
            fieldChannel: 'x',
            groupbyChannels: [],
            groupbyFields: new Set(),
            offset: 'normalize',
            impute: false,
            stackBy: [],
          },
          {
            ...defaultConfig,
            tooltipFormat: {normalizedNumberFormat: '.4%'},
            normalizedNumberFormat: '.2%',
            customFormatTypes: true,
          },
        ),
      ).toEqual({
        signal: `{"Sum of IMDB_Rating": format(datum["sum_IMDB_Rating_end"]-datum["sum_IMDB_Rating_start"], ".4%")}`,
      });
    });

    it('returns correct tooltip signal for binned field with custom title', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              bin: 'binned',
              field: 'bin_IMDB_rating',
              type: 'quantitative',
              title: 'IMDB_Rating (binned)',
            },
            x2: {
              field: 'bin_IMDB_rating_end',
            },
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal: `{"IMDB_Rating (binned)": !isValid(datum["bin_IMDB_rating"]) || !isFinite(+datum["bin_IMDB_rating"]) ? "null" : format(datum["bin_IMDB_rating"], "") + "${BIN_RANGE_DELIMITER}" + format(datum["bin_IMDB_rating_end"], "")}`,
      });
    });
  });
});
