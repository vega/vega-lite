"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
/* tslint:disable:quotemark */
describe('src/compile/projection/parse', function () {
    describe('parseUnitProjection', function () {
        it('should create projection from specified projection', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {}
            });
            model.parse();
            chai_1.assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should create projection with no props', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {}
            });
            model.parse();
            chai_1.assert.deepEqual(model.component.projection.explicit, {});
        });
        it('should create projection from config', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {},
                "config": {
                    "projection": {
                        "type": "albersUsa"
                    }
                }
            });
            model.parse();
            chai_1.assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should add data with signal', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": {
                    "url": "data/airports.csv",
                    "format": {
                        "type": "csv"
                    }
                },
                "mark": "circle",
                "projection": {
                    "type": "albersUsa"
                },
                "encoding": {
                    "longitude": {
                        "field": "longitude",
                        "type": "quantitative"
                    },
                    "latitude": {
                        "field": "latitude",
                        "type": "quantitative"
                    }
                }
            });
            model.parse();
            chai_1.assert.isObject(model.component.projection.data[0]);
            chai_1.assert.property(model.component.projection.data[0], 'signal');
        });
        it('should add data from main', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {}
            });
            model.parse();
            chai_1.assert.isString(model.component.projection.data[0]);
            chai_1.assert.isNotObject(model.component.projection.data[0]);
            chai_1.assert.notProperty(model.component.projection.data[0], 'signal');
        });
    });
    describe('parseNonUnitProjection', function () {
        it('should merge the same projection', function () {
            var model = util_1.parseLayerModel({
                "layer": [
                    {
                        "mark": "geoshape",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "data": {
                            "url": "data/us-10m.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "encoding": {}
                    },
                    {
                        "data": {
                            "url": "data/airports.csv"
                        },
                        "mark": "circle",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            model.parse();
            chai_1.assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should merge in empty projection to specified projection', function () {
            var emptyFirst = util_1.parseLayerModel({
                "layer": [
                    {
                        "mark": "geoshape",
                        "data": {
                            "url": "data/us-10m.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "encoding": {}
                    },
                    {
                        "data": {
                            "url": "data/airports.csv"
                        },
                        "mark": "circle",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            emptyFirst.parse();
            chai_1.assert.deepEqual(emptyFirst.component.projection.explicit, { type: 'albersUsa' });
            var emptyLast = util_1.parseLayerModel({
                "layer": [
                    {
                        "mark": "geoshape",
                        "data": {
                            "url": "data/us-10m.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "encoding": {}
                    },
                    {
                        "data": {
                            "url": "data/airports.csv"
                        },
                        "mark": "circle",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            emptyLast.parse();
            chai_1.assert.deepEqual(emptyLast.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should merge projections with same size, different data', function () {
            var model = util_1.parseLayerModel({
                "layer": [
                    {
                        "mark": "geoshape",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "data": {
                            "url": "data/us-10m.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "encoding": {}
                    },
                    {
                        "data": {
                            "url": "data/airports.csv"
                        },
                        "mark": "circle",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            model.parse();
            chai_1.assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should not merge different specified projections', function () {
            var model = util_1.parseLayerModel({
                "layer": [
                    {
                        "mark": "geoshape",
                        "projection": {
                            "type": "mercator"
                        },
                        "data": {
                            "url": "data/us-10m.json",
                            "format": {
                                "type": "topojson",
                                "feature": "states"
                            }
                        },
                        "encoding": {}
                    },
                    {
                        "data": {
                            "url": "data/airports.csv"
                        },
                        "mark": "circle",
                        "projection": {
                            "type": "albersUsa"
                        },
                        "encoding": {
                            "longitude": {
                                "field": "longitude",
                                "type": "quantitative"
                            },
                            "latitude": {
                                "field": "latitude",
                                "type": "quantitative"
                            }
                        }
                    }
                ]
            });
            model.parse();
            chai_1.assert.isUndefined(model.component.projection);
        });
    });
});
//# sourceMappingURL=parse.test.js.map