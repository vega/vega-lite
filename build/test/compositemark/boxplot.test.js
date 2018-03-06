"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var spec_1 = require("../../src/spec");
var config_1 = require(".././../src/config");
describe("normalizeBoxMinMax", function () {
    it("should produce an error if both axes have aggregate boxplot", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
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
            }, config_1.defaultConfig);
        }, Error, 'Both x and y cannot have aggregate');
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation", function () {
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.throws(function () {
            spec_1.normalize({
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
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce a warning if continuous axis has aggregate property", log.wrap(function (localLogger) {
        spec_1.normalize({
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
        }, config_1.defaultConfig);
        chai_1.assert.equal(localLogger.warns[0], 'Continuous axis should not have customized aggregation function min');
    }));
    it("should produce an error if build 1D boxplot with a discrete axis", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: "box-plot",
                encoding: {
                    "x": { "field": "age", "type": "ordinal" }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if both axes are discrete", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
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
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if in 2D boxplot both axes are not valid field definitions", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
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
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce an error if 1D boxplot only axis is discrete", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                "description": "A box plot showing median, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                mark: "box-plot",
                encoding: {
                    "x": { "field": "age", "type": "ordinal" },
                    "size": { "value": 5 },
                    "color": { "value": "skyblue" }
                }
            }, config_1.defaultConfig);
        }, Error, 'Need a valid continuous axis for boxplots');
    });
    it("should produce correct layered specs for vertical boxplot with two quantitative axes and specify orientation with orient", function () {
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
                    "calculate": "min(datum.upper_box_people + datum.iqr_people * " + config_1.defaultConfig.box.extent + ", datum.max_people)",
                    "as": "upper_whisker_people"
                },
                {
                    "calculate": "max(datum.lower_box_people - datum.iqr_people * " + config_1.defaultConfig.box.extent + ", datum.min_people)",
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize({
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
        }, config_1.defaultConfig), {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm94cGxvdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21wb3NpdGVtYXJrL2JveHBsb3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFHNUIsbUNBQXFDO0FBRXJDLHVDQUF1RTtBQUN2RSw2Q0FBaUQ7QUFFakQsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLEVBQUUsQ0FBQyw2REFBNkQsRUFBRTtRQUNoRSxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osZ0JBQVMsQ0FBQztnQkFDUixhQUFhLEVBQUUsa0dBQWtHO2dCQUNqSCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7Z0JBQ3ZDLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsVUFBVTtvQkFDaEIsTUFBTSxFQUFFLFNBQVM7aUJBQ2xCO2dCQUNELFFBQVEsRUFBRTtvQkFDUixHQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDeEUsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxVQUFVO3dCQUN2QixPQUFPLEVBQUUsUUFBUTt3QkFDakIsTUFBTSxFQUFFLGNBQWM7d0JBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7cUJBQ2hDO29CQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7b0JBQ3BCLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRyxTQUFTLEVBQUM7aUJBQy9CO2FBQ0YsRUFBRSxzQkFBYSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQyxDQUFDO0lBRUwsRUFBRSxDQUFDLGtIQUFrSCxFQUFFO1FBQ2xILGFBQU0sQ0FBQyxTQUFTLENBQWtFLGdCQUFT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Q0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uLy4uL3NyYy9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkfSBmcm9tICcuLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtNYXJrLCBNYXJrRGVmfSBmcm9tICcuLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge0dlbmVyaWNTcGVjLCBHZW5lcmljVW5pdFNwZWMsIG5vcm1hbGl6ZX0gZnJvbSAnLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtkZWZhdWx0Q29uZmlnfSBmcm9tICcuLi8uLy4uL3NyYy9jb25maWcnO1xuXG5kZXNjcmliZShcIm5vcm1hbGl6ZUJveE1pbk1heFwiLCAoKSA9PiB7XG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYW4gZXJyb3IgaWYgYm90aCBheGVzIGhhdmUgYWdncmVnYXRlIGJveHBsb3RcIiwgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJib3gtcGxvdFwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgfSwgRXJyb3IsICdCb3RoIHggYW5kIHkgY2Fubm90IGhhdmUgYWdncmVnYXRlJyk7XG4gIH0pO1xuXG5pdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgdXNlIGRlZmF1bHQgb3JpZW50YXRpb25cIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIHN0cmluZyB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYW4gZXJyb3IgaWYgbmVpdGhlciB0aGUgeCBheGlzIG9yIHkgYXhpcyBpcyBzcGVjaWZpZWRcIiwgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgfSwgRXJyb3IsICdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGEgd2FybmluZyBpZiBjb250aW51b3VzIGF4aXMgaGFzIGFnZ3JlZ2F0ZSBwcm9wZXJ0eVwiLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICB9XG4gICAgfSwgZGVmYXVsdENvbmZpZyk7XG5cbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sICdDb250aW51b3VzIGF4aXMgc2hvdWxkIG5vdCBoYXZlIGN1c3RvbWl6ZWQgYWdncmVnYXRpb24gZnVuY3Rpb24gbWluJyk7XG4gIH0pKTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGFuIGVycm9yIGlmIGJ1aWxkIDFEIGJveHBsb3Qgd2l0aCBhIGRpc2NyZXRlIGF4aXNcIiwgKCkgPT4ge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IFwiYm94LXBsb3RcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcbiAgICB9LCBFcnJvciwgJ05lZWQgYSB2YWxpZCBjb250aW51b3VzIGF4aXMgZm9yIGJveHBsb3RzJyk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgYW4gZXJyb3IgaWYgYm90aCBheGVzIGFyZSBkaXNjcmV0ZVwiLCAoKSA9PiB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICBub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFnZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwiYWdlXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuICAgIH0sIEVycm9yLCAnTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBhbiBlcnJvciBpZiBpbiAyRCBib3hwbG90IGJvdGggYXhlcyBhcmUgbm90IHZhbGlkIGZpZWxkIGRlZmluaXRpb25zXCIsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJvcmRpbmFsXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJhZ2VcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgfSwgRXJyb3IsICdOZWVkIGEgdmFsaWQgY29udGludW91cyBheGlzIGZvciBib3hwbG90cycpO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGFuIGVycm9yIGlmIDFEIGJveHBsb3Qgb25seSBheGlzIGlzIGRpc2NyZXRlXCIsICgpID0+IHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiBcImJveC1wbG90XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuICAgIH0sIEVycm9yLCAnTmVlZCBhIHZhbGlkIGNvbnRpbnVvdXMgYXhpcyBmb3IgYm94cGxvdHMnKTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHNwZWNpZnkgb3JpZW50YXRpb24gd2l0aCBvcmllbnRcIiwgKCkgPT4ge1xuICAgIGFzc2VydC5kZWVwRXF1YWw8R2VuZXJpY1NwZWM8R2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgTWFyayB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgb3JpZW50OiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciBob3Jpem9udGFsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHNwZWNpZnkgb3JpZW50YXRpb24gd2l0aCBvcmllbnRcIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIE1hcmsgfCBNYXJrRGVmPj4+KG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIG9yaWVudDogXCJob3Jpem9udGFsXCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcImdyb3VwYnlcIjogW1wiYWdlXCJdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiIDogXCJza3libHVlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgc3BlY2lmeSBvcmllbnRhdGlvbiB3aXRoIGFnZ3JlZ2F0ZVwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWw8R2VuZXJpY1NwZWM8R2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgc3RyaW5nIHwgTWFya0RlZj4+Pihub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIGhvcml6b250YWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgc3BlY2lmeSBvcmllbnRhdGlvbiB3aXRoIGFnZ3JlZ2F0ZVwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWw8R2VuZXJpY1NwZWM8R2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgc3RyaW5nIHwgTWFya0RlZj4+Pihub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciB2ZXJ0aWNhbCBib3hwbG90IHdpdGggbWluIGFuZCBtYXhcIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIHN0cmluZyB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxMVwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTNcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lZGlhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibWlkX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJncm91cGJ5XCI6IFtcImFnZVwiXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIGhvcml6b250YWwgYm94cGxvdCB3aXRoIG1pbiBhbmQgbWF4XCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbDxHZW5lcmljU3BlYzxHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBzdHJpbmcgfCBNYXJrRGVmPj4+KG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgaG9yaXpvbnRhbCB3aXRoIG5vIG5vbnBvc2l0aW9uYWwgZW5jb2RpbmcgcHJvcGVydGllcyBib3hwbG90IHdpdGggbWluIGFuZCBtYXhcIiwgKCkgPT4ge1xuICAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIHN0cmluZyB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IHtcbiAgICAgICAgICB0eXBlOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgZXh0ZW50OiBcIm1pbi1tYXhcIlxuICAgICAgICB9LFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDE0fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAndGljaycsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94TWlkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDE0fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG4gIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciAxRCBib3hwbG90IHdpdGggb25seSB4XCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbDxHZW5lcmljU3BlYzxHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBzdHJpbmcgfCBNYXJrRGVmPj4+KG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgdHlwZTogXCJib3gtcGxvdFwiLFxuICAgICAgICAgIGV4dGVudDogXCJtaW4tbWF4XCJcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxMVwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTNcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lZGlhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibWlkX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfd2hpc2tlcl9wZW9wbGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJncm91cGJ5XCI6IFtdXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hXaGlza2VyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAxNH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAxNH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgMUQgYm94cGxvdCB3aXRoIG9ubHkgeVwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWw8R2VuZXJpY1NwZWM8R2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgc3RyaW5nIHwgTWFya0RlZj4+Pihub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIHR5cGU6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBleHRlbnQ6IFwibWluLW1heFwiXG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYm94IHBsb3Qgc2hvd2luZyBtZWRpYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTFcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtZWRpYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pZF9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ2JhcicsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMTR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcIm1pZF9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMTR9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG59KTtcblxuXG5kZXNjcmliZShcIm5vcm1hbGl6ZUJveElRUlwiLCAoKSA9PiB7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIGJveHBsb3Qgd2l0aCB0d28gcXVhbnRpdGF0aXZlIGF4ZXMgYW5kIHVzZSBkZWZhdWx0IG9yaWVudGF0aW9uIGZvciBhIDEuNSAqIElRUiB3aGlza2VycyB3aXRoIGJveHBsb3QgbWFyayB0eXBlXCIsICgpID0+IHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIHN0cmluZyB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgIG1hcms6IFwiYm94LXBsb3RcIixcbiAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgfSxcbiAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgIH1cbiAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgICAgIHtcbiAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIFwib3BcIjogXCJxMVwiLFxuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgXCJvcFwiOiBcInEzXCIsXG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcImFzXCI6IFwibWlkX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1pbl9wZW9wbGVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1heF9wZW9wbGVcIlxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgXSxcbiAgICAgICAgICAgXCJncm91cGJ5XCI6IFtcImFnZVwiXVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgY2FsY3VsYXRlOiAnZGF0dW0udXBwZXJfYm94X3Blb3BsZSAtIGRhdHVtLmxvd2VyX2JveF9wZW9wbGUnLFxuICAgICAgICAgICBhczogJ2lxcl9wZW9wbGUnXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICBcImNhbGN1bGF0ZVwiOiBgbWluKGRhdHVtLnVwcGVyX2JveF9wZW9wbGUgKyBkYXR1bS5pcXJfcGVvcGxlICogJHtkZWZhdWx0Q29uZmlnLmJveC5leHRlbnR9LCBkYXR1bS5tYXhfcGVvcGxlKWAsXG4gICAgICAgICAgIFwiYXNcIjogXCJ1cHBlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICBcImNhbGN1bGF0ZVwiOiBgbWF4KGRhdHVtLmxvd2VyX2JveF9wZW9wbGUgLSBkYXR1bS5pcXJfcGVvcGxlICogJHtkZWZhdWx0Q29uZmlnLmJveC5leHRlbnR9LCBkYXR1bS5taW5fcGVvcGxlKWAsXG4gICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl93aGlza2VyX3Blb3BsZVwiXG4gICAgICAgICB9XG4gICAgICAgXSxcbiAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgIHtcbiAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgIHR5cGU6ICdydWxlJyxcbiAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvd2VyX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG4gICAgICAgICB9LFxuICAgICAgICAge1xuICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgIHR5cGU6ICdiYXInLFxuICAgICAgICAgICAgIHN0eWxlOiAnYm94J1xuICAgICAgICAgICB9LFxuICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgfVxuICAgICAgICAgfSxcbiAgICAgICAgIHtcbiAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICBdXG4gICAgIH0pO1xuICB9KTtcblxuICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgdmVydGljYWwgYm94cGxvdCB3aXRoIHR3byBxdWFudGl0YXRpdmUgYXhlcyBhbmQgdXNlIGRlZmF1bHQgb3JpZW50YXRpb24gZm9yIGEgMS41ICogSVFSIHdoaXNrZXJzXCIsICgpID0+IHtcbiAgICAgYXNzZXJ0LmRlZXBFcXVhbDxHZW5lcmljU3BlYzxHZW5lcmljVW5pdFNwZWM8RW5jb2Rpbmc8RmllbGQ+LCBzdHJpbmcgfCBNYXJrRGVmPj4+KG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYm94LXBsb3RcIixcbiAgICAgICAgICBcImV4dGVudFwiOiAxLjVcbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIiA6IFwic2t5Ymx1ZVwifVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxMVwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwicTNcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lZGlhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibWlkX2JveF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwibWluX3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtYXhfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLnVwcGVyX2JveF9wZW9wbGUgLSBkYXR1bS5sb3dlcl9ib3hfcGVvcGxlJyxcbiAgICAgICAgICAgIGFzOiAnaXFyX3Blb3BsZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWluKGRhdHVtLnVwcGVyX2JveF9wZW9wbGUgKyBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5tYXhfcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWF4KGRhdHVtLmxvd2VyX2JveF9wZW9wbGUgLSBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5taW5fcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCIgOiBcInNreWJsdWVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3RpY2snLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveE1pZCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJtaWRfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgaXQoXCJzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIHZlcnRpY2FsIElRUiBib3hwbG90IHdoZXJlIGNvbG9yIGVuY29kZXMgdGhlIG1lYW4gb2YgdGhlIHBlb3BsZSBmaWVsZFwiLCAoKSA9PiB7XG4gICAgIGFzc2VydC5kZWVwRXF1YWw8R2VuZXJpY1NwZWM8R2VuZXJpY1VuaXRTcGVjPEVuY29kaW5nPEZpZWxkPiwgc3RyaW5nIHwgTWFya0RlZj4+Pihub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBib3ggcGxvdCBzaG93aW5nIG1lZGlhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImJveC1wbG90XCIsXG4gICAgICAgICAgXCJleHRlbnRcIjogMS41XG4gICAgICAgIH0sXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGJveCBwbG90IHNob3dpbmcgbWVkaWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcInExXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJxM1wiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcImFzXCI6IFwidXBwZXJfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWVkaWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaWRfYm94X3Blb3BsZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm9wXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwiYXNcIjogXCJtaW5fcGVvcGxlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwib3BcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1heF9wZW9wbGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJvcFwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhc1wiOiBcIm1lYW5fcGVvcGxlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiZ3JvdXBieVwiOiBbXCJhZ2VcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZTogJ2RhdHVtLnVwcGVyX2JveF9wZW9wbGUgLSBkYXR1bS5sb3dlcl9ib3hfcGVvcGxlJyxcbiAgICAgICAgICAgIGFzOiAnaXFyX3Blb3BsZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWluKGRhdHVtLnVwcGVyX2JveF9wZW9wbGUgKyBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5tYXhfcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY2FsY3VsYXRlXCI6IFwibWF4KGRhdHVtLmxvd2VyX2JveF9wZW9wbGUgLSBkYXR1bS5pcXJfcGVvcGxlICogMS41LCBkYXR1bS5taW5fcGVvcGxlKVwiLFxuICAgICAgICAgICAgXCJhc1wiOiBcImxvd2VyX3doaXNrZXJfcGVvcGxlXCJcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3J1bGUnLFxuICAgICAgICAgICAgICBzdHlsZTogJ2JveFdoaXNrZXInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfd2hpc2tlcl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb3dlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAncnVsZScsXG4gICAgICAgICAgICAgIHN0eWxlOiAnYm94V2hpc2tlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInVwcGVyX3doaXNrZXJfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazoge1xuICAgICAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG93ZXJfYm94X3Blb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJ1cHBlcl9ib3hfcGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWVhbl9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICd0aWNrJyxcbiAgICAgICAgICAgICAgc3R5bGU6ICdib3hNaWQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibWlkX2JveF9wZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcInZhbHVlXCI6IFwid2hpdGVcIn0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gIH0pO1xuXG59KTtcbiJdfQ==