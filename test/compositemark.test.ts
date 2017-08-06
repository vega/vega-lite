/* tslint:disable:quotemark */

import {assert} from 'chai';
import {Encoding} from '../src/encoding';
import {Field} from '../src/fielddef';
import * as log from '../src/log';
import {Mark, MarkDef} from '../src/mark';
import {GenericSpec, GenericUnitSpec, normalize} from '../src/spec';
import {Config, defaultConfig} from './../src/config';

describe("normalizeErrorBar", () => {

    it("should produce correct layered specs for horizontal error bar", () => {
      assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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

describe("normalizeBoxMinMax", () => {
  it("should produce an error if both axes have aggregate boxplot", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"aggregate": "box-plot", "field": "people","type": "quantitative"},
          "y": {
            "aggregate": "box-plot",
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Both x and y cannot have aggregate');
  });

it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "quantitative"},
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce an error if neither the x axis or y axis is specified", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce a warning if continuous axis has aggregate property", log.wrap((localLogger) => {
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

    assert.equal(localLogger.warns[0], 'Continuous axis should not have customized aggregation function min');
  }));

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
    }, Error, 'Need a valid continuous axis for boxplots');
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
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce an error if in 2D boxplot both axes are not valid field definitions", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "type": "ordinal",
            "axis": {"title": "age"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce an error if 1D boxplot only axis is discrete", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with orient", () => {
    assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, Mark | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "box-plot",
          orient: "vertical",
          extent: "min-max"
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker',
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with orient", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, Mark | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "box-plot",
          orient: "horizontal"
        },
        encoding: {
          "y": {"field": "age","type": "quantitative"},
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with aggregate", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "aggregate": "box-plot",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with aggregate", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "box-plot",
        encoding: {
          "y": {"field": "age","type": "quantitative"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "aggregate": "box-plot",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal with no nonpositional encoding properties boxplot with min and max", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only x", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": []
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "x2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only y", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "min",
                "field": "people",
                "as": "lowerWhisker"
              },
              {
                "aggregate": "max",
                "field": "people",
                "as": "upperWhisker"
              }
            ],
            "groupby": []
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 14}
            }
          }
        ]
      });
  });
});


describe("normalizeBoxIQR", () => {

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          "type": "box-plot",
          "extent": 1.5
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
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
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              }
            ],
            "groupby": ["age"]
          },
          {
            calculate: 'datum.upperBox - datum.lowerBox',
            as: 'IQR'
          },
          {
            calculate: 'datum.lowerBox - datum.IQR * 1.5',
            as: 'lowerWhisker'
          },
          {
            calculate: 'datum.upperBox + datum.IQR * 1.5',
            as: 'lowerWhisker'
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical IQR boxplot where color encodes the mean of the people field", () => {
     assert.deepEqual<GenericSpec<GenericUnitSpec<Encoding<Field>, string | MarkDef>>>(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          "type": "box-plot",
          "extent": 1.5
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "size": {"value": 5},
          "color": {
            "aggregate": "mean",
            "field": "people",
            "type": "quantitative"
          }
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "summarize": [
              {
                "aggregate": "q1",
                "field": "people",
                "as": "lowerBox"
              },
              {
                "aggregate": "q3",
                "field": "people",
                "as": "upperBox"
              },
              {
                "aggregate": "median",
                "field": "people",
                "as": "midBox"
              },
              {
                "aggregate": "mean",
                "field": "people",
                "as": "mean_people"
              }
            ],
            "groupby": ["age"]
          },
          {
            calculate: 'datum.upperBox - datum.lowerBox',
            as: 'IQR'
          },
          {
            calculate: 'datum.lowerBox - datum.IQR * 1.5',
            as: 'lowerWhisker'
          },
          {
            calculate: 'datum.upperBox + datum.IQR * 1.5',
            as: 'lowerWhisker'
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerWhisker",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lowerBox",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              role: 'boxWhisker', style: 'boxWhisker'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperWhisker",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              role: 'box', style: 'box'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lowerBox",
                "type": "quantitative"
              },
              "y2": {
                "field": "upperBox",
                "type": "quantitative"
              },
              "size": {"value": 5},
              "color": {
                "field": "mean_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'tick',
              role: 'boxMid', style: 'boxMid'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "midBox",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      });
  });

});
