/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as log from '../../src/log';
import {normalize} from '../../src/spec';
import {defaultConfig} from '.././../src/config';

describe('normalizeLayer', () => {
  it('should produce correct layered specs for mean point and vertical error bar', () => {
    assert.deepEqual(normalize({
      "data": {
        "url": "data/population.json"
      },
      mark: "errorbar",
      encoding: {
        "x": {
          "field": "age",
          "type": "ordinal"
        },
        "y": {
          "field": "people",
          "type": "quantitative",
          "axis": {
            "title": "population"
          }
        }
      }
    }, defaultConfig), {
      "data": {"url": "data/population.json"},
      "transform": [
        {
          "aggregate": [
            {"op": "stderr", "field": "people", "as": "extent_people"},
            {"op": "mean", "field": "people", "as": "mean_people"}
          ],
          "groupby": ["age"]
        },
        {
          "calculate": "datum.mean_people + datum.extent_people",
          "as": "upper_rule_people"
        },
        {
          "calculate": "datum.mean_people - datum.extent_people",
          "as": "lower_rule_people"
        }
      ],
      "layer": [
        {
          "mark": {"type": "rule", "style": "errorbar-rule"},
          "encoding": {
            "y": {
              "field": "lower_rule_people",
              "type": "quantitative",
              "axis": {"title": "population"}
            },
            "y2": {"field": "upper_rule_people", "type": "quantitative"},
            "x": {"field": "age", "type": "ordinal"}
          }
        },
        {
          "mark": {
            "opacity": 1,
            "filled": true,
            "type": "point",
            "style": "errorbar-point"
          },
          "encoding": {
            "y": {
              "field": "mean_people",
              "type": "quantitative",
              "axis": {"title": "population"}
            },
            "x": {"field": "age", "type": "ordinal"}
          }
        }
      ]
    });
  });
});
