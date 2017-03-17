/* tslint:disable:quotemark */

import {assert} from 'chai';
import {Encoding} from '../src/encoding';
import {Field} from '../src/fielddef';
import {MarkDef} from '../src/mark';
import {GenericSpec, GenericUnitSpec, normalize} from '../src/spec';
import {Config, defaultConfig} from './../src/config';

describe("normalizeErrorBar", () => {

    it("should produce correct layered specs for horizontal error bar", () => {
      assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "data": {"url": "data/population.json"},
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
          mark: "error-bar",
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

describe("normalizeBox", () => {
  it("should produce an error if both axes are continuous", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "people","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need one continuous and one discrete axis for 2D boxplots');
  });

  it("should produce an error if continuous axis has aggregate property", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "aggregate": "min",
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Continuous axis should not be aggregate');
  });

  it("should produce an error if build 1D boxplot with a discrete axis", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age", "type": "ordinal"}
        }
      }, defaultConfig);
    }, Error, 'Need a continuous axis for 1D boxplot');
  });

  it("should produce an error if both axes are discrete", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "field": "age",
            "type": "ordinal",
            "axis": {"title": "age"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need one continuous and one discrete axis');
  });

  it("should produce correct layered specs for vertical boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "layer": [
          {
            "mark": "rule",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "y2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "bar",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              },
              "y2": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "median",
                "field": "people",
                "type": "quantitative"
              },
              "color": {"value" : "white"},
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "y": {"field": "age","type": "ordinal"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
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
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "bar",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "median",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "white"}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal with no nonpositional encoding properties boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "y": {"field": "age","type": "ordinal"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          }
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
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
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "bar",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "aggregate": "median",
                "field": "people",
                "type": "quantitative"
              },
              "color": {"value" : "white"}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only x", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          }
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "layer": [
          {
            "mark": "rule",
            "encoding": {
              "x": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "x": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "bar",
            "encoding": {
              "x": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              },
              "x2": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "x": {
                "aggregate": "median",
                "field": "people",
                "type": "quantitative"
              },
              "color": {"value": "white"}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only y", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<string | MarkDef, Encoding<Field>>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          }
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "layer": [
          {
            "mark": "rule",
            "encoding": {
              "y": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "rule",
            "encoding": {
              "y": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "y2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              }
            }
          },
          {
            "mark": "bar",
            "encoding": {
              "y": {
                "aggregate": "q1",
                "field": "people",
                "type": "quantitative"
              },
              "y2": {
                "aggregate": "q3",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            "mark": "tick",
            "encoding": {
              "y": {
                "aggregate": "median",
                "field": "people",
                "type": "quantitative"
              },
              "color": {"value": "white"}
            }
          }
        ]
      });
  });

});
