/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as log from '../../src/log';
import {normalize} from '../../src/spec';
import {defaultConfig} from '.././../src/config';

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
        "type": "quantitative"
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
            "title": "people"
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
            "title": "people"
          },
          "x": {"field": "age", "type": "ordinal"}
        }
      }
    ]
  });
});

it("should produce an error if both axes have aggregate errorbar", () => {
  assert.throws(() => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar"
      },
      encoding: {
        "x": {"aggregate": "errorbar", "field": "people","type": "quantitative"},
        "y": {
          "aggregate": "errorbar",
          "field": "people",
          "type": "quantitative"
        },
        "color": {"value" : "skyblue"}
      }
    }, defaultConfig);
  }, Error, 'Both x and y cannot have aggregate');
});

it("should produce a warning if center is median and extent is not iqr", log.wrap((localLogger) => {
  normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      center: "median",
      extent: "stderr"
    },
    encoding: {
      "x": {"field": "people","type": "quantitative"},
      "y": {
        "field": "people",
        "type": "quantitative"
      },
      "color": {"value" : "skyblue"}
    }
  }, defaultConfig);

  assert.equal(localLogger.warns[0], 'median is not usually used with stderr for error bar.');
}));

it("should produce a warning if center is mean and extent is iqr", log.wrap((localLogger) => {
  normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      center: "mean",
      extent: "iqr"
    },
    encoding: {
      "x": {"field": "people","type": "quantitative"},
      "y": {
        "field": "people",
        "type": "quantitative"
      },
      "color": {"value" : "skyblue"}
    }
  }, defaultConfig);

  assert.equal(localLogger.warns[0], 'mean is not usually used with iqr for error bar.');
}));

it("should produce a warning if continuous axis has aggregate property", log.wrap((localLogger) => {
  normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar"
      },
      encoding: {
        "x": {"field": "age","type": "ordinal"},
        "y": {
          "aggregate": "min",
          "field": "people",
          "type": "quantitative"
        },
        "color": {"value" : "skyblue"}
      }
  }, defaultConfig);

  assert.equal(localLogger.warns[0], 'Continuous axis should not have customized aggregation function min');
}));

it("should produce an error if build 1D errorbar with a discrete axis", () => {
  assert.throws(() => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: "errorbar",
      encoding: {
        "x": {"field": "age", "type": "ordinal"}
      }
    }, defaultConfig);
  }, Error, 'Need a valid continuous axis for errorbars');
});

it("should produce an error if both axes are discrete", () => {
  assert.throws(() => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar"
      },
      encoding: {
        "x": {"field": "age","type": "ordinal"},
        "y": {
          "field": "age",
          "type": "ordinal"
        },
        "color": {"value" : "skyblue"}
      }
    }, defaultConfig);
  }, Error, 'Need a valid continuous axis for errorbars');
});

it("should produce an error if in 2D errobar both axes are not valid field definitions", () => {
  assert.throws(() => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar"
      },
      encoding: {
        "x": {"field": "age","type": "ordinal"},
        "y": {
          "type": "ordinal"
        },
        "color": {"value" : "skyblue"}
      }
    }, defaultConfig);
  }, Error, 'Need a valid continuous axis for errorbars');
});

it("should produce an error if 1D errorbar only axis is discrete", () => {
  assert.throws(() => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: "errorbar",
      encoding: {
        "x": {"field": "age","type": "ordinal"},
        "color": {"value" : "skyblue"}
      }
    }, defaultConfig);
  }, Error, 'Need a valid continuous axis for errorbars');
});

it("should produce correct layered specs for vertical errorbar with two quantitative axes and specify orientation with orient", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      "type": "errorbar",
      "orient": "vertical"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "quantitative"
      },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].field, "people");
});

it("should produce correct layered specs for horizontal errorbar with two quantitative axes and specify orientation with orient", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      "type": "errorbar",
      "orient": "horizontal"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "quantitative"
      },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].field, "age");
});

it("should produce correct layered specs for vertical errorbar with two quantitative axes and specify orientation with aggregate", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: "errorbar",
    encoding: {
      "x": {
        "field": "age",
        "type": "quantitative"
      },
      "y": {
        "aggregate": "errorbar",
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].field, "people");
});

it("should produce correct layered specs for horizontal errorbar with two quantitative axes and specify orientation with aggregate", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: "errorbar",
    encoding: {
      "x": {
        "aggregate": "errorbar",
        "field": "age",
        "type": "quantitative"
      },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].field, "age");
});

it("should produce correct layered specs for vertical errorbar with stderr", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      extent: "stderr"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "ordinal"
       },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].op, "stderr");
});

it("should produce correct layered specs for vertical errorbar with stdev", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      extent: "stdev"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "ordinal"
       },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].op, "stdev");
});

it("should produce correct layered specs for vertical errorbar with ci", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      extent: "ci"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "ordinal"
       },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].op, "ci0");
});

it("should produce correct layered specs for vertical errorbar with iqr", () => {
  const outputSpec = normalize({
    "data": {"url": "data/population.json"},
    mark: {
      type: "errorbar",
      center: "median",
      extent: "iqr"
    },
    encoding: {
      "x": {
        "field": "age",
        "type": "ordinal"
       },
      "y": {
        "field": "people",
        "type": "quantitative"
      }
    }
  }, defaultConfig);

  assert.deepEqual(outputSpec.transform[0]["aggregate"][0].op, "q1");
});
