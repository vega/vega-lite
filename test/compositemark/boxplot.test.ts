/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as log from '../../src/log';
import {normalize} from '../../src/spec';
import {defaultConfig} from '.././../src/config';


describe("normalizeBoxMinMax", () => {
  it("should produce an error if both axes have aggregate boxplot", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "x": {"aggregate": "boxplot", "field": "people","type": "quantitative"},
          "y": {
            "aggregate": "boxplot",
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Both x and y cannot have aggregate');
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max",
          size: 5
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 5
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'horizontal',
              style: 'boxplot-median',
              color: 'white',
              size: 5
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
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
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce a warning if continuous axis has aggregate property", log.wrap((localLogger) => {
    const aggregate = 'min';
    const type = 'boxplot';

    normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type,
          extent: "min-max",
          size: 14
        },
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            aggregate,
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
    }, defaultConfig);

    assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, type));
  }));

  it("should produce an error if build 1D boxplot with a discrete axis", () => {
    assert.throws(() => {
      normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: "boxplot",
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
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "field": "age",
            "type": "ordinal",
            "axis": {"title": "age"}
          },
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
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "type": "ordinal",
            "axis": {"title": "age"}
          },
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
        mark: "boxplot",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for boxplots');
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with orient", () => {
    assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
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
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'horizontal',
              style: 'boxplot-median',
              size: 14,
              color: 'white'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with orient", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          orient: "horizontal",
          extent: "min-max"
        },
        encoding: {
          "y": {"field": "age","type": "quantitative"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'vertical',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with aggregate", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "aggregate": "boxplot",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'horizontal',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with aggregate", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "y": {"field": "age","type": "quantitative"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "aggregate": "boxplot",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'vertical',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "quantitative"},
              "x": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical boxplot with min and max", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'horizontal',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal boxplot with min and max", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
        encoding: {
          "y": {"field": "age","type": "ordinal"},
          "x": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [
          {
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_box_people",
                "type": "quantitative"
              },
              "color": {"value" : "skyblue"}
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'vertical',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for horizontal with no nonpositional encoding properties boxplot with min and max", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
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
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": ["age"]
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'vertical',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "y": {"field": "age","type": "ordinal"},
              "x": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only x", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
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
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": []
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "x": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "x": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "x2": {
                "field": "upper_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'vertical',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "x": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for 1D boxplot with only y", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          type: "boxplot",
          extent: "min-max"
        },
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
            "aggregate": [
              {
                "op": "q1",
                "field": "people",
                "as": "lower_box_people"
              },
              {
                "op": "q3",
                "field": "people",
                "as": "upper_box_people"
              },
              {
                "op": "median",
                "field": "people",
                "as": "mid_box_people"
              },
              {
                "op": "min",
                "field": "people",
                "as": "lower_whisker_people"
              },
              {
                "op": "max",
                "field": "people",
                "as": "upper_whisker_people"
              }
            ],
            "groupby": []
          }
        ],
        "layer": [
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {
                "field": "lower_whisker_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "lower_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'rule',
              style: 'boxplot-rule'
            },
            "encoding": {
              "y": {
                "field": "upper_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_whisker_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'bar',
              style: 'boxplot-box',
              size: 14
            },
            "encoding": {
              "y": {
                "field": "lower_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "field": "upper_box_people",
                "type": "quantitative"
              }
            }
          },
          {
            mark: {
              type: 'tick',
              orient: 'horizontal',
              style: 'boxplot-median',
              color: 'white',
              size: 14
            },
            "encoding": {
              "y": {
                "field": "mid_box_people",
                "type": "quantitative",
                "axis": {"title": "population"}
              }
            }
          }
        ]
      });
  });
});


describe("normalizeBoxIQR", () => {

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers with boxplot mark type", () => {
    assert.deepEqual(normalize({
       "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
       "data": {"url": "data/population.json"},
       mark: "boxplot",
       encoding: {
         "x": {"field": "age","type": "quantitative"},
         "y": {
           "field": "people",
           "type": "quantitative",
           "axis": {"title": "population"}
         },
         "color": {"value" : "skyblue"}
       }
     }, defaultConfig), {
       "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
       "data": {"url": "data/population.json"},
       "layer": [
        {
          "transform": [
            {
              "aggregate": [
                {
                  "op": "q1",
                  "field": "people",
                  "as": "lower_box_people"
                },
                {
                  "op": "q3",
                  "field": "people",
                  "as": "upper_box_people"
                },
                {
                  "op": "median",
                  "field": "people",
                  "as": "mid_box_people"
                },
                {
                  "op": "min",
                  "field": "people",
                  "as": "min_people"
                },
                {
                  "op": "max",
                  "field": "people",
                  "as": "max_people"
                }
              ],
              "groupby": ["age"]
            },
            {
              calculate: 'datum.upper_box_people - datum.lower_box_people',
              as: 'iqr_people'
            },
            {
              "calculate": `min(datum.upper_box_people + datum.iqr_people * ${defaultConfig.boxplot.extent}, datum.max_people)`,
              "as": "upper_whisker_people"
            },
            {
              "calculate": `max(datum.lower_box_people - datum.iqr_people * ${defaultConfig.boxplot.extent}, datum.min_people)`,
              "as": "lower_whisker_people"
            }
          ],
          "layer": [
            {
              mark: {
                type: 'rule',
                style: 'boxplot-rule'
              },
              "encoding": {
                "x": {"field": "age","type": "quantitative"},
                "y": {
                  "field": "lower_whisker_people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "y2": {
                  "field": "lower_box_people",
                  "type": "quantitative"
                }
              }
            },
            {
              mark: {
                type: 'rule',
                style: 'boxplot-rule'
              },
              "encoding": {
                "x": {"field": "age","type": "quantitative"},
                "y": {
                  "field": "upper_box_people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "y2": {
                  "field": "upper_whisker_people",
                  "type": "quantitative"
                }
              }
            },
            {
              mark: {
                type: 'bar',
                style: 'boxplot-box',
                size: 14
              },
              "encoding": {
                "x": {"field": "age","type": "quantitative"},
                "y": {
                  "field": "lower_box_people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "y2": {
                  "field": "upper_box_people",
                  "type": "quantitative"
                },
                "color": {"value" : "skyblue"}
              }
            },
            {
              mark: {
                type: 'tick',
                orient: 'horizontal',
                style: 'boxplot-median',
                color: 'white',
                size: 14
              },
              "encoding": {
                "x": {"field": "age","type": "quantitative"},
                "y": {
                  "field": "mid_box_people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                }
              }
            }
          ]
        },
        {
          transform: [
            {
              window: [
                {
                  "op": "q1",
                  "field": "people",
                  "as": "lower_box_people"
                },
                {
                  "op": "q3",
                  "field": "people",
                  "as": "upper_box_people"
                }
              ],
              groupby: ["age"],
              frame: [null, null]
            },
            {
              "filter": "(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))"
            }
          ],
          mark: {
            type: "point",
            style: "boxplot-outliers"
          },
          encoding: {
            "x": {"field": "age","type": "quantitative"},
            "y": {
              "field": "people",
              "type": "quantitative"
            }
          }
        }
       ]
     });
  });

  it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          "type": "boxplot",
          "extent": 1.5
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "layer": [
          {
            "transform": [
              {
                "aggregate": [
                  {
                    "op": "q1",
                    "field": "people",
                    "as": "lower_box_people"
                  },
                  {
                    "op": "q3",
                    "field": "people",
                    "as": "upper_box_people"
                  },
                  {
                    "op": "median",
                    "field": "people",
                    "as": "mid_box_people"
                  },
                  {
                    "op": "min",
                    "field": "people",
                    "as": "min_people"
                  },
                  {
                    "op": "max",
                    "field": "people",
                    "as": "max_people"
                  }
                ],
                "groupby": ["age"]
              },
              {
                calculate: 'datum.upper_box_people - datum.lower_box_people',
                as: 'iqr_people'
              },
              {
                "calculate": "min(datum.upper_box_people + datum.iqr_people * 1.5, datum.max_people)",
                "as": "upper_whisker_people"
              },
              {
                "calculate": "max(datum.lower_box_people - datum.iqr_people * 1.5, datum.min_people)",
                "as": "lower_whisker_people"
              }
            ],
            "layer": [
              {
                mark: {
                  type: 'rule',
                  style: 'boxplot-rule'
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "lower_whisker_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "lower_box_people",
                    "type": "quantitative"
                  }
                }
              },
              {
                mark: {
                  type: 'rule',
                  style: 'boxplot-rule'
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "upper_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "upper_whisker_people",
                    "type": "quantitative"
                  }
                }
              },
              {
                mark: {
                  type: 'bar',
                  style: 'boxplot-box',
                  size: 14
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "lower_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "upper_box_people",
                    "type": "quantitative"
                  },
                  "color": {"value" : "skyblue"}
                }
              },
              {
                mark: {
                  type: 'tick',
                  orient: 'horizontal',
                  style: 'boxplot-median',
                  color: 'white',
                  size: 14
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "mid_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  }
                }
              }
            ]
          },
          {
            transform: [
              {
                window: [
                  {
                    "op": "q1",
                    "field": "people",
                    "as": "lower_box_people"
                  },
                  {
                    "op": "q3",
                    "field": "people",
                    "as": "upper_box_people"
                  }
                ],
                groupby: ["age"],
                frame: [null, null]
              },
              {
                "filter": "(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))"
              }
            ],
            mark: {
              type: "point",
              style: "boxplot-outliers"
            },
            encoding: {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "people",
                "type": "quantitative"
              }
            }
          }
        ]
      });
  });

  it("should produce correct layered specs for vertical IQR boxplot where color encodes the mean of the people field", () => {
     assert.deepEqual(normalize({
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        mark: {
          "type": "boxplot",
          "extent": 1.5
        },
        encoding: {
          "x": {"field": "age","type": "quantitative"},
          "y": {
            "field": "people",
            "type": "quantitative",
            "axis": {"title": "population"}
          },
          "color": {
            "aggregate": "mean",
            "field": "people",
            "type": "quantitative"
          }
        }
      }, defaultConfig), {
        "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "layer": [
          {
            "transform": [
              {
                "aggregate": [
                  {
                    "op": "mean",
                    "field": "people",
                    "as": "mean_people"
                  },
                  {
                    "op": "q1",
                    "field": "people",
                    "as": "lower_box_people"
                  },
                  {
                    "op": "q3",
                    "field": "people",
                    "as": "upper_box_people"
                  },
                  {
                    "op": "median",
                    "field": "people",
                    "as": "mid_box_people"
                  },
                  {
                    "op": "min",
                    "field": "people",
                    "as": "min_people"
                  },
                  {
                    "op": "max",
                    "field": "people",
                    "as": "max_people"
                  }
                ],
                "groupby": ["age"]
              },
              {
                calculate: 'datum.upper_box_people - datum.lower_box_people',
                as: 'iqr_people'
              },
              {
                "calculate": "min(datum.upper_box_people + datum.iqr_people * 1.5, datum.max_people)",
                "as": "upper_whisker_people"
              },
              {
                "calculate": "max(datum.lower_box_people - datum.iqr_people * 1.5, datum.min_people)",
                "as": "lower_whisker_people"
              }
            ],
            "layer": [
              {
                mark: {
                  type: 'rule',
                  style: 'boxplot-rule'
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "lower_whisker_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "lower_box_people",
                    "type": "quantitative"
                  }
                }
              },
              {
                mark: {
                  type: 'rule',
                  style: 'boxplot-rule'
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "upper_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "upper_whisker_people",
                    "type": "quantitative"
                  }
                }
              },
              {
                mark: {
                  type: 'bar',
                  style: 'boxplot-box',
                  size: 14
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "lower_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "field": "upper_box_people",
                    "type": "quantitative"
                  },
                  "color": {
                    "field": "mean_people",
                    "type": "quantitative"
                  }
                }
              },
              {
                mark: {
                  type: 'tick',
                  orient: 'horizontal',
                  style: 'boxplot-median',
                  color: 'white',
                  size: 14
                },
                "encoding": {
                  "x": {"field": "age","type": "quantitative"},
                  "y": {
                    "field": "mid_box_people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  }
                }
              }
            ]
          },
          {
            transform: [
              {
                window: [
                  {
                    "op": "q1",
                    "field": "people",
                    "as": "lower_box_people"
                  },
                  {
                    "op": "q3",
                    "field": "people",
                    "as": "upper_box_people"
                  }
                ],
                groupby: ["age"],
                frame: [null, null]
              },
              {
                "filter": "(datum.people < datum.lower_box_people - 1.5 * (datum.upper_box_people - datum.lower_box_people)) || (datum.people > datum.upper_box_people + 1.5 * (datum.upper_box_people - datum.lower_box_people))"
              }
            ],
            mark: {
              type: "point",
              style: "boxplot-outliers"
            },
            encoding: {
              "x": {"field": "age","type": "quantitative"},
              "y": {
                "field": "people",
                "type": "quantitative"
              }
            }
          }
        ]
      });
  });

});
