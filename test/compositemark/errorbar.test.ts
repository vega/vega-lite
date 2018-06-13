/* tslint:disable:quotemark */
import {assert} from 'chai';

import {isFieldDef} from '../../src/fielddef';
import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {isLayerSpec, isUnitSpec, normalize} from '../../src/spec';
import {isAggregate, isCalculate, Transform} from '../../src/transform';
import {some} from '../../src/util';
import {defaultConfig} from '.././../src/config';

describe('normalizeErrorBar with raw data input', () => {
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
            {"op": "mean", "field": "people", "as": "center_people"}
          ],
          "groupby": ["age"]
        },
        {
          "calculate": "datum.center_people + datum.extent_people",
          "as": "upper_people"
        },
        {
          "calculate": "datum.center_people - datum.extent_people",
          "as": "lower_people"
        }
      ],
      "layer": [
        {
          "mark": {"type": "rule", "style": "errorbar-rule"},
          "encoding": {
            "y": {
              "field": "lower_people",
              "type": "quantitative",
              "title": "people"
            },
            "y2": {"field": "upper_people", "type": "quantitative"},
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

    assert.equal(localLogger.warns[0], 'median is not usually used with stderr for errorbar.');
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

    assert.equal(localLogger.warns[0], 'mean is not usually used with iqr for errorbar.');
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

  it("should aggregate y field for vertical errorbar with two quantitative axes and explicit orient", () => {
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
    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.field === "people" &&
          (aggregateFieldDef.op === "mean" || aggregateFieldDef.op === "median");
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should aggregate x field for horizontal errorbar with two quantitative axes and explicit orient", () => {
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.field === "age" &&
          (aggregateFieldDef.op === "mean" || aggregateFieldDef.op === "median");
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should aggregate y field for vertical errorbar with two quantitative axes and specify orientation with aggregate", () => {
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.field === "people" &&
          (aggregateFieldDef.op === "mean" || aggregateFieldDef.op === "median");
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should aggregate x field for horizontal errorbar with two quantitative axes and specify orientation with aggregate", () => {
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.field === "age" &&
          (aggregateFieldDef.op === "mean" || aggregateFieldDef.op === "median");
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should aggregate x field for horizontal errorbar with x as quantitative axis", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: "errorbar",
      encoding: {
        "x": {
          "field": "age",
          "type": "quantitative"
        },
        "y": {
          "field": "people",
          "type": "ordinal"
        }
      }
    }, defaultConfig);

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.field === "age" &&
          (aggregateFieldDef.op === "mean" || aggregateFieldDef.op === "median");
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should produce correct layered specs for vertical errorbar with stderr by default", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar"
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "stderr";
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "stderr";
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "stdev";
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "ci0";
      }));
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "ci1";
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
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

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "q1";
      }));
      assert.isTrue(some(aggregateTransform.aggregate, (aggregateFieldDef) => {
        return aggregateFieldDef.op === "q3";
      }));
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it("should produce correct layered specs for veritcal errorbar with ticks", () => {
    const color = "red";
    const opacity = 0.5;
    const size = 10;

    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar",
        ticks: {
          size,
          color,
          opacity
        }
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

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(some(layer, (unitSpec) => {
        return isUnitSpec(unitSpec) &&
              isMarkDef(unitSpec.mark) &&
              unitSpec.mark.type === "tick" &&
              unitSpec.mark.size === size &&
              unitSpec.mark.color === color &&
              unitSpec.mark.opacity === opacity;
      }));
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

  it("should produce correct layered specs with customized title", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorbar",
        point: false
      },
      encoding: {
        "x": {
          "field": "age",
          "type": "ordinal"
        },
        "y": {
          "field": "people",
          "type": "quantitative",
          "title": "population"
        }
      }
    }, defaultConfig);

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(some(layer, (unitSpec) => {
        return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.y) &&
              unitSpec.encoding.y.title === "population";
      }));
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });
});

describe('normalizeErrorBar with aggregated data input', () => {
  it('should produce correct layered specs for vertical errorbar with aggregated data input', () => {
    assert.deepEqual(normalize({
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "mark": "errorbar",
      "encoding": {
        "x": {"field": "age", "type": "ordinal"},
        "y": {"field": "people", "type": "quantitative"},
        "y2": {"field": "people2", "type": "quantitative"}
      }
    }, defaultConfig), {
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "transform": [
        {"calculate": "datum.people", "as": "lower_people"},
        {"calculate": "datum.people2", "as": "upper_people"}
      ],
      "layer": [
        {
          "mark": {"type": "rule", "style": "errorbar-rule"},
          "encoding": {
            "y": {
              "field": "lower_people",
              "type": "quantitative",
              "title": "people"
            },
            "y2": {"field": "upper_people", "type": "quantitative"},
            "x": {"field": "age", "type": "ordinal"}
          }
        }
      ]
    });
  });

  it('should produce correct layered specs for horizontal errorbar with aggregated data input', () => {
    const outputSpec = normalize({
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "mark": "errorbar",
      "encoding": {
        "y": {"field": "age", "type": "ordinal"},
        "x": {"field": "people", "type": "quantitative"},
        "x2": {"field": "people2", "type": "quantitative"}
      }
    }, defaultConfig);

    for (let i = 0; i < 2; i++) {
      const calculate: Transform = outputSpec.transform[i];

      if (isCalculate(calculate)) {
        assert.isTrue((calculate.calculate === "datum.people" && calculate.as === "lower_people") ||
        (calculate.calculate === "datum.people2" && calculate.as === "upper_people"));
      } else {
        assert.fail(isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
      }
    }

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(some(layer, (unitSpec) => {
        return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) &&
              unitSpec.encoding.x.field === "lower_people";
      }));
      assert.isTrue(some(layer, (unitSpec) => {
        return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) &&
              unitSpec.encoding.x2.field === "upper_people";
      }));
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

  it('should produce a warning if data are aggregated but center and/or extent is specified', log.wrap((localLogger) => {
    normalize({
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "mark": {
        "type": "errorbar",
        "extent": "stdev",
        "center": "mean"
      },
      "encoding": {
        "x": {"field": "age", "type": "ordinal"},
        "y": {"field": "people", "type": "quantitative"},
        "y2": {"field": "people2", "type": "quantitative"}
      }
    }, defaultConfig);

    assert.equal(localLogger.warns[0], 'center and extent are not needed when data are aggregated.');
  }));

  it("should produce an error if data are aggregated and have both x2 and y2 quantiative", () => {
    assert.throws(() => {
      normalize({
        "data": {
          "values": [
            {"age": 1, "age2": 1, "people": 1, "people2": 2},
            {"age": 2, "age2": 1, "people": 4, "people2": 8},
            {"age": 3, "age2": 1, "people": 13, "people2": 18},
            {"age": 4, "age2": 1, "people": 2, "people2": 28},
            {"age": 5, "age2": 1, "people": 19, "people2": 23},
            {"age": 6, "age2": 1, "people": 10, "people2": 20},
            {"age": 7, "age2": 1, "people": 2, "people2": 5}
          ]
        },
        "mark": {
          "type": "errorbar",
          "extent": "stdev",
          "center": "mean"
        },
        "encoding": {
          "x": {"field": "age", "type": "quantitative"},
          "x2": {"field": "age2", "type": "quantitative"},
          "y": {"field": "people", "type": "quantitative"},
          "y2": {"field": "people2", "type": "quantitative"}
        }
      }, defaultConfig);
    }, Error, 'Cannot have both x2 and y2 with both are quantiative');
  });

  it("should produce a warning if the second continuous axis has aggregate property", log.wrap((localLogger) => {
    normalize({
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "mark": "errorbar",
      "encoding": {
        "x": {"field": "age", "type": "ordinal"},
        "y": {"field": "people", "type": "quantitative"},
        "y2": {"field": "people2", "type": "quantitative", "aggregate": "min"}
      }
    }, defaultConfig);

    assert.equal(localLogger.warns[0], 'Continuous axis should not have customized aggregation function min');
  }));

  it("should produce a warning if there is an unsupported channel in encoding", log.wrap((localLogger) => {
    normalize({
      "data": {
        "values": [
          {"age": 1, "people": 1, "people2": 2},
          {"age": 2, "people": 4, "people2": 8},
          {"age": 3, "people": 13, "people2": 18},
          {"age": 4, "people": 2, "people2": 28},
          {"age": 5, "people": 19, "people2": 23},
          {"age": 6, "people": 10, "people2": 20},
          {"age": 7, "people": 2, "people2": 5}
        ]
      },
      "mark": "errorbar",
      "encoding": {
        "x": {"field": "age", "type": "ordinal"},
        "y": {"field": "people", "type": "quantitative"},
        "y2": {"field": "people2", "type": "quantitative", "aggregate": "min"},
        "size": {"value": 10}
      }
    }, defaultConfig);

    assert.equal(localLogger.warns[0], 'size dropped as it is incompatible with "errorbar".');
  }));
});
