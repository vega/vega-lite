/* tslint:disable:quotemark */

import {assert} from 'chai';
import {normalize} from '../src/spec';

describe("normalizeErrorBar", () => {

    it("should produce correct layered specs for horizontal error bar", () => {
      assert.deepEqual(normalize({
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        mark: "error-bar",
        encoding: {
          "y": {"field": "age","type": "ordinal"},
          "x": {
            "aggregate": "min",
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "x2": {
            "aggregate": "max",
            "field": "people",
            "type": "quantitative"
          },
          "size": {"value": 5}
        }
      }), {
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": {"filter": "datum.year == 2000"},
        "layer": [
          {
            "mark": "rule",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "size": {"value": 5}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative",
                // "axis": {"title": "population"}
              },
              "size": {"value": 5}
            }
          }
        ]
      });
    });
  });
