/* tslint:disable:quotemark */
import {assert} from 'chai';

import {normalize} from '../../src/spec';
import {defaultConfig} from '.././../src/config';


describe("normalizeErrorBar", () => {

    it("should produce correct layered specs for horizontal error bar", () => {
      assert.deepEqual(normalize({
        "data": {"url": "data/population.json"},
        mark: "errorbar",
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
      }, defaultConfig), {
        "data": {"url": "data/population.json"},
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

   it("should throw error when missing x2 and y2", () => {
      assert.throws(() => {
        normalize({
          "data": {"url": "data/population.json"},
          mark: "errorbar",
          encoding: {
            "y": {"field": "age","type": "ordinal"},
            "x": {
              "aggregate": "min",
              "field": "people",
              "type": "quantitative",
              "axis": {"title": "population"}
            },
            "size": {"value": 5}
          }
        }, defaultConfig);
      }, Error, 'Neither x2 or y2 provided');
    });
 });
