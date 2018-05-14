/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as log from '../../src/log';
import { normalize } from '../../src/spec';
import { defaultConfig } from '.././../src/config';
describe("normalizeBoxMinMax", function () {
    it("should produce an error if both axes have aggregate boxplot", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: {
                    type: "box-plot",
                    extent: "min-max"
                },
                encoding: {
                    "x": { "aggregate": "box-plot", "field": "people", "type": "quantitative" },
                    "y": {
                        "aggregate": "box-plot",
                        "field": "people",
                        "type": "quantitative",
                        "axis": { "title": "population" }
                    },
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, defaultConfig);
        }, Error, 'Both x and y cannot have aggregate');
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce an error if neither the x axis or y axis is specified", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: {
                    type: "box-plot",
                    extent: "min-max"
                },
                encoding: {
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce a warning if continuous axis has aggregate property", log.wrap(function (localLogger) {
        normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "x": { "field": "age", "type": "ordinal" },
                "y": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig);
        assert.equal(localLogger.warns[0], 'Continuous axis should not have customized aggregation function min');
    }));
    it("should produce an error if build 1D boxplot with a discrete axis", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: "box-plot",
                encoding: {
                    "x": { "field": "age", "type": "ordinal" }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if both axes are discrete", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: {
                    type: "box-plot",
                    extent: "min-max"
                },
                encoding: {
                    "x": { "field": "age", "type": "ordinal" },
                    "y": {
                        "field": "age",
                        "type": "ordinal",
                        "axis": { "title": "age" }
                    },
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if in 2D boxplot both axes are not valid field definitions", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: {
                    type: "box-plot",
                    extent: "min-max"
                },
                encoding: {
                    "x": { "field": "age", "type": "ordinal" },
                    "y": {
                        "type": "ordinal",
                        "axis": { "title": "age" }
                    },
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if 1D boxplot only axis is discrete", function () {
        assert.throws(function () {
            normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: "box-plot",
                encoding: {
                    "x": { "field": "age", "type": "ordinal" },
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with orient", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                orient: "vertical",
                extent: "min-max"
            },
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with orient", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                orient: "horizontal",
                extent: "min-max"
            },
            encoding: {
                "y": { "field": "age", "type": "quantitative" },
                "x": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "x2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 },
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with aggregate", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "aggregate": "box-plot",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for horizontal boxplot with two quantitative axes and specify orientation with aggregate", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "y": { "field": "age", "type": "quantitative" },
                "x": {
                    "field": "people",
                    "type": "quantitative",
                    "aggregate": "box-plot",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "x2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "quantitative" },
                        "x": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 },
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for vertical boxplot with min and max", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "x": { "field": "age", "type": "ordinal" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "ordinal" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "ordinal" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "ordinal" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "ordinal" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for horizontal boxplot with min and max", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "y": { "field": "age", "type": "ordinal" },
                "x": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "x2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 },
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for horizontal with no nonpositional encoding properties boxplot with min and max", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "y": { "field": "age", "type": "ordinal" },
                "x": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "x2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 14 }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 14 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for 1D boxplot with only x", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "x": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "x2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 14 }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 14 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for 1D boxplot with only y", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                type: "box-plot",
                extent: "min-max"
            },
            encoding: {
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 14 }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 14 }
                    }
                }
            ]
        });
    });
});
describe("normalizeBoxIQR", function () {
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers with boxplot mark type", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: "box-plot",
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                    "calculate": "min(datum.upper_box_people + datum.iqr_people * " + defaultConfig.box.extent + ", datum.max_people)",
                    "as": "upper_whisker_people"
                },
                {
                    "calculate": "max(datum.lower_box_people - datum.iqr_people * " + defaultConfig.box.extent + ", datum.min_people)",
                    "as": "lower_whisker_people"
                }
            ],
            "layer": [
                {
                    mark: {
                        type: 'rule',
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                "type": "box-plot",
                "extent": 1.5
            },
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": { "value": "skyblue" }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": { "value": "skyblue" }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should produce correct layered specs for vertical IQR boxplot where color encodes the mean of the people field", function () {
        assert.deepEqual(normalize({
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
            mark: {
                "type": "box-plot",
                "extent": 1.5
            },
            encoding: {
                "x": { "field": "age", "type": "quantitative" },
                "y": {
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "size": { "value": 5 },
                "color": {
                    "aggregate": "mean",
                    "field": "people",
                    "type": "quantitative"
                }
            }
        }, defaultConfig), {
            "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
            "data": { "url": "data/population.json" },
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
                        },
                        {
                            "op": "mean",
                            "field": "people",
                            "as": "mean_people"
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_whisker_people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        style: 'boxWhisker'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "upper_box_people",
                            "type": "quantitative"
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
                        style: 'box'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "lower_box_people",
                            "type": "quantitative"
                        },
                        "y2": {
                            "field": "upper_box_people",
                            "type": "quantitative"
                        },
                        "size": { "value": 5 },
                        "color": {
                            "field": "mean_people",
                            "type": "quantitative"
                        }
                    }
                },
                {
                    mark: {
                        type: 'tick',
                        style: 'boxMid'
                    },
                    "encoding": {
                        "x": { "field": "age", "type": "quantitative" },
                        "y": {
                            "field": "mid_box_people",
                            "type": "quantitative"
                        },
                        "color": { "value": "white" },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21wb3NpdGVtYXJrL2JveHBsb3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFDOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEtBQUssR0FBRyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBR2pELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixFQUFFLENBQUMsNkRBQTZELEVBQUU7UUFDaEUsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNaLFNBQVMsQ0FBQztnQkFDUixhQUFhLEVBQUUsa0dBQWtHO2dCQUNqSCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7Z0JBQ3ZDLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2dCQUNELFFBQVEsRUFBRTtvQkFDUixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDeEUsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxVQUFVO3dCQUN2QixPQUFPLEVBQUUsUUFBUTt3QkFDakIsTUFBTSxFQUFFLGNBQWM7d0JBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7cUJBQ2hDO29CQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7b0JBQ3BCLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRyxTQUFTLEVBQUM7aUJBQy9CO2FBQ0YsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwQixDQUFDLEVBQUUs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LEVBQUM7cUJBQ3JCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICcuLi8uLi9zcmMvc3BlYyc7XG5pbXBvcnQge2RlZmF1bHRDb25maWd9IGZyb20gJy4uLy4vLi4vc3JjL2NvbmZpZyc7XG5cblxuZGVzY3JpYmUoXCJub3JtYWxpemVCb3hNaW5NYXhcIiwgKCkgPT4ge1xuICBpdChcInNob3VsZCBwcm9kdWNlIGFuIGVycm9yIGlmIGJvdGggYXhlcyBoYXZlIGFnZ3JlZ2F0ZSBib3hwbG90XCIsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwiYm94LXBsb3RcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJib3gtcGxvdFwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuICAgIH0sIEVycm9yLCAnQm90aCB4IGFuZCB5IGNhbm5vdCBoYXZlIGFnZ3JlZ2F0ZScpO1xuICB9KTtcblxuaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHVzZSBkZWZhdWx0IG9yaWVudGF0aW9uXCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBhbiBlcnJvciBpZiBuZWl0aGVyIHRoZSB4IGF4aXMgb3IgeSBheGlzIGlzIHNwZWNpZmllZFwiLCAoKSA9PiB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICBub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcbiAgICB9LCBFcnJvciwgJ05lZWQgYSB2YWxpZCBjb250aW51b3VzIGF4aXMgZm9yIGJveHBsb3RzJyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYSB3YXJuaW5nIGlmIGNvbnRpbnVvdXMgYXhpcyBoYXMgYWdncmVnYXRlIHByb3BlcnR5XCIsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICB9LCBkZWZhdWx0Q29uZmlnKTtcblxuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgJ0NvbnRpbnVvdXMgYXhpcyBzaG91bGQgbm90IGhhdmUgY3VzdG9taXplZCBhZ2dyZWdhdGlvbiBmdW5jdGlvbiBtaW4nKTtcbiAgfSkpO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYW4gZXJyb3IgaWYgYnVpbGQgMUQgYm94cGxvdCB3aXRoIGEgZGlzY3JldGUgYXhpc1wiLCAoKSA9PiB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICBub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazogXCJib3gtcGxvdFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuICAgIH0sIEVycm9yLCAnTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBhbiBlcnJvciBpZiBib3RoIGF4ZXMgYXJlIGRpc2NyZXRlXCIsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiYWdlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJvcmRpbmFsXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJhZ2VcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgfSwgRXJyb3IsICdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGFuIGVycm9yIGlmIGluIDJEIGJveHBsb3QgYm90aCBheGVzIGFyZSBub3QgdmFsaWQgZmllbGQgZGVmaW5pdGlvbnNcIiwgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm9yZGluYWxcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcImFnZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcbiAgICB9LCBFcnJvciwgJ05lZWQgYSB2YWxpZCBjb250aW51b3VzIGF4aXMgZm9yIGJveHBsb3RzJyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYW4gZXJyb3IgaWYgMUQgYm94cGxvdCBvbmx5IGF4aXMgaXMgZGlzY3JldGVcIiwgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IFwiYm94LXBsb3RcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgfSwgRXJyb3IsICdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgc3BlY2lmeSBvcmllbnRhdGlvbiB3aXRoIG9yaWVudFwiLCAoKSA9PiB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBvcmllbnQ6IFwidmVydGljYWxcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIGhvcml6b250YWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgc3BlY2lmeSBvcmllbnRhdGlvbiB3aXRoIG9yaWVudFwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgb3JpZW50OiBcImhvcml6b250YWxcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciB2ZXJ0aWNhbCBib3hwbG90IHdpdGggdHdvIHF1YW50aXRhdGl2ZSBheGVzIGFuZCBzcGVjaWZ5IG9yaWVudGF0aW9uIHdpdGggYWdncmVnYXRlXCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIGhvcml6b250YWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgc3BlY2lmeSBvcmllbnRhdGlvbiB3aXRoIGFnZ3JlZ2F0ZVwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgYm94cGxvdCB3aXRoIG1pbiBhbmQgbWF4XCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIm1pZF9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgaG9yaXpvbnRhbCBib3hwbG90IHdpdGggbWluIGFuZCBtYXhcIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgaG9yaXpvbnRhbCB3aXRoIG5vIG5vbnBvc2l0aW9uYWwgZW5jb2RpbmcgcHJvcGVydGllcyBib3hwbG90IHdpdGggbWluIGFuZCBtYXhcIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAxNH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAxNH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgMUQgYm94cGxvdCB3aXRoIG9ubHkgeFwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW11cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDE0fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDE0fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciAxRCBib3hwbG90IHdpdGggb25seSB5XCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMTR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIm1pZF9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMTR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG59KTtcblxuXG5kZXNjcmliZShcIm5vcm1hbGl6ZUJveElRUlwiLCAoKSA9PiB7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHVzZSBkZWZhdWx0IG9yaWVudGF0aW9uIGZvciBhIDEuNSAqIElRUiB3aGlza2VycyB3aXRoIGJveHBsb3QgbWFyayB0eXBlXCIsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICBtYXJrOiBcImJveC1wbG90XCIsXG4gICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgIH0sXG4gICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICB9XG4gICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICB7XG4gICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFtcbiAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lZGlhblwiLFxuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaW5fcGVvcGxlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwiYXNcIjogXCJtYXhfcGVvcGxlXCJcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIF0sXG4gICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLnVwcGVyX2JveF9wZW9wbGUgLSBkYXR1bS5sb3dlcl9ib3hfcGVvcGxlJyxcbiAgICAgICAgICAgYXM6ICdpcXJfcGVvcGxlJ1xuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgXCJjYWxjdWxhdGVcIjogYG1pbihkYXR1bS51cHBlcl9ib3hfcGVvcGxlICsgZGF0dW0uaXFyX3Blb3BsZSAqICR7ZGVmYXVsdENvbmZpZy5ib3guZXh0ZW50fSwgZGF0dW0ubWF4X3Blb3BsZSlgLFxuICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgXCJjYWxjdWxhdGVcIjogYG1heChkYXR1bS5sb3dlcl9ib3hfcGVvcGxlIC0gZGF0dW0uaXFyX3Blb3BsZSAqICR7ZGVmYXVsdENvbmZpZy5ib3guZXh0ZW50fSwgZGF0dW0ubWluX3Blb3BsZSlgLFxuICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgfVxuICAgICAgIF0sXG4gICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICB7XG4gICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICB9LFxuICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgIH1cbiAgICAgICAgIH0sXG4gICAgICAgICB7XG4gICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIm1pZF9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9LFxuICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgXVxuICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHVzZSBkZWZhdWx0IG9yaWVudGF0aW9uIGZvciBhIDEuNSAqIElRUiB3aGlza2Vyc1wiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIFwiZXh0ZW50XCI6IDEuNVxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaW5fcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1heF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJncm91cGJ5XCI6IFtcImFnZVwiXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsY3VsYXRlOiAnZGF0dW0udXBwZXJfYm94X3Blb3BsZSAtIGRhdHVtLmxvd2VyX2JveF9wZW9wbGUnLFxuICAgICAgICAgICAgYXM6ICdpcXJfcGVvcGxlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJjYWxjdWxhdGVcIjogXCJtaW4oZGF0dW0udXBwZXJfYm94X3Blb3BsZSArIGRhdHVtLmlxcl9wZW9wbGUgKiAxLjUsIGRhdHVtLm1heF9wZW9wbGUpXCIsXG4gICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJjYWxjdWxhdGVcIjogXCJtYXgoZGF0dW0ubG93ZXJfYm94X3Blb3BsZSAtIGRhdHVtLmlxcl9wZW9wbGUgKiAxLjUsIGRhdHVtLm1pbl9wZW9wbGUpXCIsXG4gICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIm1pZF9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgSVFSIGJveHBsb3Qgd2hlcmUgY29sb3IgZW5jb2RlcyB0aGUgbWVhbiBvZiB0aGUgcGVvcGxlIGZpZWxkXCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgXCJleHRlbnRcIjogMS41XG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaW5fcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1heF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1lYW5fcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLnVwcGVyX2JveF9wZW9wbGUgLSBkYXR1bS5sb3dlcl9ib3hfcGVvcGxlJyxcbiAgICAgICAgICAgIGFzOiAnaXFyX3Blb3BsZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWluKGRhdHVtLnVwcGVyX2JveF9wZW9wbGUgKyBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5tYXhfcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWF4KGRhdHVtLmxvd2VyX2JveF9wZW9wbGUgLSBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5taW5fcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWVhbl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==