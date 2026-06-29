import {BIN_RANGE_DELIMITER} from '../../../../src/compile/common.js';
import {tooltip} from '../../../../src/compile/mark/encode/index.js';
import {tooltipData, tooltipRefForEncoding} from '../../../../src/compile/mark/encode/tooltip.js';
import {defaultConfig} from '../../../../src/config.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util.js';

function filteredTooltipSignal(field: string, test: string) {
  return `(${test}) ? merge((${test}) ? {"${field}": format(datum["${field}"], "")} : {}) : null`;
}

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

    it('omits encoding fields with tooltip false from generated tooltip objects', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: true},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          detail: {field: '__internal_key', type: 'nominal', tooltip: false},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal: '{"Horsepower": format(datum["Horsepower"], "")}',
      });
    });

    it('filters explicit tooltip fields by their unformatted values', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          tooltip: [
            {field: 'Date', type: 'nominal'},
            {field: 'type1', type: 'quantitative', tooltip: {filter: {operator: '!=', value: 0}}},
            {field: 'type2', type: 'quantitative', tooltip: {filter: 'valid'}},
            {field: 'type3', type: 'quantitative', tooltip: {filter: {operator: '>', value: 0}}},
          ],
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal:
          'merge({"Date": isValid(datum["Date"]) ? isArray(datum["Date"]) ? join(datum["Date"], \'\\n\') : datum["Date"] : ""+datum["Date"]}, (!(datum["type1"]===0)) ? {"type1": format(datum["type1"], "")} : {}, (isValid(datum["type2"]) && isFinite(+datum["type2"])) ? {"type2": format(datum["type2"], "")} : {}, (datum["type3"]>0) ? {"type3": format(datum["type3"], "")} : {})',
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
      model.encoding.tooltip = null;
      const props = tooltip(model);
      expect(props.tooltip).toBeUndefined();
    });

    it('uses mark tooltip strings as static tooltip values', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'point', tooltip: 'static tooltip'},
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({value: 'static tooltip'});
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

    it('generates tooltip signal with array check for discrete encodings without a format', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          tooltip: true,
        },
        encoding: {
          x: {
            field: 'Foo',
            type: 'nominal',
          },
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal:
          '{"Foo": isValid(datum["Foo"]) ? isArray(datum["Foo"]) ? join(datum["Foo"], \'\\n\') : datum["Foo"] : ""+datum["Foo"]}',
      });
    });

    it('generates tooltip signal without array check for non discrete encodings or encodings with a (custom) format', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'circle',
        },
        encoding: {
          tooltip: [
            {field: 'Foo', format: '.'},
            {field: 'Bar', type: 'quantitative'},
            {field: 'Baz', formatType: 'customFormat'},
          ],
        },
        config: {
          customFormatTypes: true,
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toEqual({
        signal:
          '{"Foo": format(datum["Foo"], "."), "Bar": format(datum["Bar"], ""), "Baz": customFormat(datum["Baz"])}',
      });
    });

    it('generates tooltip signal for discrete encodings without a format and reactiveGeom is true', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'circle',
          tooltip: true,
        },
        encoding: {
          color: {
            field: 'Foobar',
            type: 'nominal',
          },
        },
      });
      expect(tooltip(model, {reactiveGeom: true}).tooltip).toEqual({
        signal:
          '{"Foobar": isValid(datum.datum["Foobar"]) ? isArray(datum.datum["Foobar"]) ? join(datum.datum["Foobar"], \'\\n\') : datum.datum["Foobar"] : ""+datum.datum["Foobar"]}',
      });
    });

    it('filters generated tooltip objects with reactiveGeom references', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'circle',
          tooltip: true,
        },
        encoding: {
          color: {
            field: 'Foobar',
            type: 'quantitative',
            tooltip: {filter: {operator: '!=', value: 0}},
          },
        },
      });
      expect(tooltip(model, {reactiveGeom: true}).tooltip).toEqual({
        signal:
          '(!(datum.datum["Foobar"]===0)) ? merge((!(datum.datum["Foobar"]===0)) ? {"Foobar": format(datum.datum["Foobar"], "")} : {}) : null',
      });
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
        signal:
          '{"Foobar": isValid(datum["Foobar"]) ? isArray(datum["Foobar"]) ? join(datum["Foobar"], \'\\n\') : datum["Foobar"] : ""+datum["Foobar"]}',
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
        signal:
          '{"baz": isValid(datum["Foobar"]) ? isArray(datum["Foobar"]) ? join(datum["Foobar"], \'\\n\') : datum["Foobar"] : ""+datum["Foobar"]}',
      });
    });

    it('generates tooltip via textRef for discrete fields with timeUnit', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'bar', tooltip: true},
        encoding: {
          x: {field: 'date', timeUnit: 'yearmonth', type: 'nominal'},
          y: {aggregate: 'count', type: 'quantitative'},
        },
      });
      const props = tooltip(model);
      expect(props.tooltip).toBeDefined();
      const sig = (props.tooltip as {signal: string}).signal;
      // Should use the transformed field name (yearmonth_date) via textRef,
      // not the raw field name (date) from the shortcut path
      expect(sig).not.toContain('datum["date"]');
      expect(sig).toContain('yearmonth_date');
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
        signal:
          '{"\\"baz\\"": isValid(datum["Foobar"]) ? isArray(datum["Foobar"]) ? join(datum["Foobar"], \'\\n\') : datum["Foobar"] : ""+datum["Foobar"]}',
      });
    });
  });

  describe('tooltipForEncoding', () => {
    it('returns no tooltip when all encoding fields hide their tooltip', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              field: 'Horsepower',
              type: 'quantitative',
              tooltip: false,
            },
          },
          null,
          defaultConfig,
        ),
      ).toBeUndefined();
    });

    it('returns filtered values for tooltip data', () => {
      expect(
        tooltipData(
          {
            tooltip: [
              {field: 'visible', type: 'quantitative'},
              {field: 'positive', type: 'quantitative', tooltip: {filter: {operator: '>', value: 0}}},
            ],
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        visible: 'format(datum["visible"], "")',
        positive: '(datum["positive"]>0) ? format(datum["positive"], "") : ""',
      });
    });

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

    it('does not include the secondary binned field when the primary binned field hides its tooltip', () => {
      expect(
        tooltipRefForEncoding(
          {
            x: {
              bin: 'binned',
              field: 'bin_IMDB_rating',
              type: 'quantitative',
              tooltip: false,
            },
            x2: {
              field: 'bin_IMDB_rating_end',
            },
            y: {
              field: 'count',
              type: 'quantitative',
            },
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal: '{"count": format(datum["count"], "")}',
      });
    });

    it('returns null when all tooltip fields are filtered out at runtime', () => {
      expect(
        tooltipRefForEncoding(
          {
            tooltip: [
              {field: 'type1', type: 'quantitative', tooltip: {filter: {operator: '!=', value: 0}}},
              {field: 'type2', type: 'quantitative', tooltip: {filter: 'valid'}},
            ],
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal:
          '((!(datum["type1"]===0)) || (isValid(datum["type2"]) && isFinite(+datum["type2"]))) ? merge((!(datum["type1"]===0)) ? {"type1": format(datum["type1"], "")} : {}, (isValid(datum["type2"]) && isFinite(+datum["type2"])) ? {"type2": format(datum["type2"], "")} : {}) : null',
      });
    });

    it('filters tooltip fields with comparison operators', () => {
      const cases = [
        {field: 'eq', operator: '==', value: 10, test: 'datum["eq"]===10'},
        {field: 'lt', operator: '<', value: 10, test: 'datum["lt"]<10'},
        {field: 'lte', operator: '<=', value: 10, test: 'datum["lte"]<=10'},
        {field: 'gte', operator: '>=', value: 10, test: 'datum["gte"]>=10'},
      ] as const;

      for (const {field, operator, value, test} of cases) {
        expect(
          tooltipRefForEncoding(
            {
              tooltip: [{field, type: 'quantitative', tooltip: {filter: {operator, value}}}],
            },
            null,
            defaultConfig,
          ),
        ).toEqual({
          signal: filteredTooltipSignal(field, test),
        });
      }
    });

    it('filters tooltip fields against null values', () => {
      const cases = [
        {field: 'missing', operator: '==', test: 'datum["missing"]===null'},
        {field: 'present', operator: '!=', test: 'datum["present"]!==null'},
        {field: 'after', operator: '>', test: 'datum["after"]>null'},
      ] as const;

      for (const {field, operator, test} of cases) {
        expect(
          tooltipRefForEncoding(
            {
              tooltip: [{field, type: 'quantitative', tooltip: {filter: {operator, value: null}}}],
            },
            null,
            defaultConfig,
          ),
        ).toEqual({
          signal: filteredTooltipSignal(field, test),
        });
      }
    });

    it('ignores unsupported tooltip filters', () => {
      const unsupportedFilter = JSON.parse('"missing"');
      const unsupportedOperatorFilter = JSON.parse('{"operator":"===","value":0}');
      const missingValueFilter = JSON.parse('{"operator":"=="}');

      expect(
        tooltipRefForEncoding(
          {
            tooltip: [
              {field: 'unsupported', type: 'quantitative', tooltip: {filter: unsupportedFilter}},
              {field: 'operator', type: 'quantitative', tooltip: {filter: unsupportedOperatorFilter}},
              {field: 'missingValue', type: 'quantitative', tooltip: {filter: missingValueFilter}},
            ],
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal:
          '{"unsupported": format(datum["unsupported"], ""), "operator": format(datum["operator"], ""), "missingValue": format(datum["missingValue"], "")}',
      });
    });

    it('ignores ordered comparisons against boolean filter values', () => {
      expect(
        tooltipRefForEncoding(
          {
            tooltip: [
              {field: 'lt', type: 'quantitative', tooltip: {filter: {operator: '<', value: true}}},
              {field: 'lte', type: 'quantitative', tooltip: {filter: {operator: '<=', value: true}}},
              {field: 'gt', type: 'quantitative', tooltip: {filter: {operator: '>', value: true}}},
              {field: 'gte', type: 'quantitative', tooltip: {filter: {operator: '>=', value: true}}},
            ],
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal:
          '{"lt": format(datum["lt"], ""), "lte": format(datum["lte"], ""), "gt": format(datum["gt"], ""), "gte": format(datum["gte"], "")}',
      });
    });

    it('ignores tooltip filters on fieldless aggregate fields', () => {
      expect(
        tooltipRefForEncoding(
          {
            tooltip: [{aggregate: 'count', type: 'quantitative', tooltip: {filter: 'valid'}}],
          },
          null,
          defaultConfig,
        ),
      ).toEqual({
        signal: '{"Count of Records": format(datum["__count"], "")}',
      });
    });
  });
});
