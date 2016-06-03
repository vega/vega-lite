/* tslint:disable:quotemark */

import {assert} from 'chai';

import {normalize} from '../src/spec';


describe('normalize()', function () {
  it('should convert single spec with row or column into a composite spec', function() {
    const spec: any = {
      "data": {"url": "data/movies.json"},
      "mark": "point",
      "encoding": {
        "column": {"field": "MPAA_Rating","type": "ordinal"},
        "x": {"field": "Worldwide_Gross","type": "quantitative"},
        "y": {"field": "US_DVD_Sales","type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/movies.json"},
      "facet": {
        "column": {"field": "MPAA_Rating","type": "ordinal"}
      },
      "spec": {
        "mark": "point",
        "encoding": {
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      }
    });
  });

  it('should convert y2 -> y if there is no y in the encoding', function() {
    const spec: any = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y2": {"field": "age","type": "ordinal"},
        "x": { "aggregate": "min", "field": "people", "type": "quantitative" },
        "x2": { "aggregate": "max", "field": "people", "type": "quantitative" }
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y": {"field": "age","type": "ordinal"},
        "x": { "aggregate": "min", "field": "people", "type": "quantitative" },
        "x2": { "aggregate": "max", "field": "people", "type": "quantitative" }
      }
    });
  });

  it('should convert x2 -> x if there is no x in the encoding', function() {
    const spec: any = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x2": {"field": "age","type": "ordinal"},
        "y": { "aggregate": "min", "field": "people", "type": "quantitative" },
        "y2": { "aggregate": "max", "field": "people", "type": "quantitative" }
      }
    };

    assert.deepEqual(normalize(spec), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x": {"field": "age","type": "ordinal"},
        "y": { "aggregate": "min", "field": "people", "type": "quantitative" },
        "y2": { "aggregate": "max", "field": "people", "type": "quantitative" }
      }
    });
  });

});
