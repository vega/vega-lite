/* tslint:disable:quotemark */
import {assert} from 'chai';

import {isFieldDef} from '../../src/fielddef';
import * as log from '../../src/log';
import {isLayerSpec, isUnitSpec, normalize} from '../../src/spec';
import {isAggregate} from '../../src/transform';
import {some} from '../../src/util';
import {defaultConfig} from '.././../src/config';

describe('normalizeErrorBand', () => {
  it('should produce correct layered specs for mean point and vertical error band', () => {
    assert.deepEqual(normalize({
      "data": {
        "url": "data/population.json"
      },
      mark: "errorband",
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
      "data": {
        "url": "data/population.json"
      },
      "transform": [
        {
          "aggregate": [
            {
              "op": "stderr",
              "field": "people",
              "as": "extent_people"
            },
            {
              "op": "mean",
              "field": "people",
              "as": "mean_people"
            }
          ],
          "groupby": [
            "age"
          ]
        },
        {
          "calculate": "datum.mean_people + datum.extent_people",
          "as": "upper_people"
        },
        {
          "calculate": "datum.mean_people - datum.extent_people",
          "as": "lower_people"
        }
      ],
      "layer": [
        {
          "mark": {
            "opacity": 0.5,
            "type": "area",
            "style": "errorband-band"
          },
          "encoding": {
            "y": {
              "field": "lower_people",
              "type": "quantitative",
              "title": "people"
            },
            "y2": {
              "field": "upper_people",
              "type": "quantitative"
            },
            "x": {
              "field": "age",
              "type": "ordinal"
            }
          }
        }
      ]
    });
  });

  it("should produce an error if both axes have aggregate errorband", () => {
    assert.throws(() => {
      normalize({
        "data": {"url": "data/population.json"},
        mark: {
          type: "errorband"
        },
        encoding: {
          "x": {"aggregate": "errorband", "field": "people","type": "quantitative"},
          "y": {
            "aggregate": "errorband",
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
        type: "errorband",
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

    assert.equal(localLogger.warns[0], 'median is not usually used with stderr for error band.');
  }));

  it("should produce a warning if center is mean and extent is iqr", log.wrap((localLogger) => {
    normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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

    assert.equal(localLogger.warns[0], 'mean is not usually used with iqr for error band.');
  }));

  it("should produce a warning if continuous axis has aggregate property", log.wrap((localLogger) => {
    normalize({
        "data": {"url": "data/population.json"},
        mark: {
          type: "errorband"
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

  it("should produce an error if build 1D errorband with a discrete axis", () => {
    assert.throws(() => {
      normalize({
        "data": {"url": "data/population.json"},
        mark: "errorband",
        encoding: {
          "x": {"field": "age", "type": "ordinal"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for errorbands');
  });

  it("should produce an error if both axes are discrete", () => {
    assert.throws(() => {
      normalize({
        "data": {"url": "data/population.json"},
        mark: {
          type: "errorband"
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
    }, Error, 'Need a valid continuous axis for errorbands');
  });

  it("should produce an error if in 2D erroband both axes are not valid field definitions", () => {
    assert.throws(() => {
      normalize({
        "data": {"url": "data/population.json"},
        mark: {
          type: "errorband"
        },
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "y": {
            "type": "ordinal"
          },
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for errorbands');
  });

  it("should produce an error if 1D errorband only axis is discrete", () => {
    assert.throws(() => {
      normalize({
        "data": {"url": "data/population.json"},
        mark: "errorband",
        encoding: {
          "x": {"field": "age","type": "ordinal"},
          "color": {"value" : "skyblue"}
        }
      }, defaultConfig);
    }, Error, 'Need a valid continuous axis for errorbands');
  });

  it("should aggregate y field for vertical errorband with two quantitative axes and explicit orient", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        "type": "errorband",
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

  it("should aggregate x field for horizontal errorband with two quantitative axes and explicit orient", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        "type": "errorband",
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

  it("should aggregate y field for vertical errorband with two quantitative axes and specify orientation with aggregate", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: "errorband",
      encoding: {
        "x": {
          "field": "age",
          "type": "quantitative"
        },
        "y": {
          "aggregate": "errorband",
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

  it("should aggregate x field for horizontal errorband with two quantitative axes and specify orientation with aggregate", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: "errorband",
      encoding: {
        "x": {
          "aggregate": "errorband",
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

  it("should aggregate x field for horizontal errorband with x as quantitative axis", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: "errorband",
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

  it("should produce correct layered specs for vertical errorband with stderr by default", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband"
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

  it("should produce correct layered specs for vertical errorband with stderr", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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

  it("should produce correct layered specs for vertical errorband with stdev", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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

  it("should produce correct layered specs for vertical errorband with ci", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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

  it("should produce correct layered specs for vertical errorband with iqr", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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

  it("should produce correct layered specs with customized title", () => {
    const outputSpec = normalize({
      "data": {"url": "data/population.json"},
      mark: {
        type: "errorband",
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
