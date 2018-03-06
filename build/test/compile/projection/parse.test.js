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
                    "x": {
                        "field": "longitude",
                        "type": "longitude"
                    },
                    "y": {
                        "field": "latitude",
                        "type": "latitude"
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
                            "x": {
                                "field": "longitude",
                                "type": "longitude"
                            },
                            "y": {
                                "field": "latitude",
                                "type": "latitude"
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
                            "x": {
                                "field": "longitude",
                                "type": "longitude"
                            },
                            "y": {
                                "field": "latitude",
                                "type": "latitude"
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
                            "x": {
                                "field": "longitude",
                                "type": "longitude"
                            },
                            "y": {
                                "field": "latitude",
                                "type": "latitude"
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
                            "x": {
                                "field": "longitude",
                                "type": "longitude"
                            },
                            "y": {
                                "field": "latitude",
                                "type": "latitude"
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
                            "x": {
                                "field": "longitude",
                                "type": "longitude"
                            },
                            "y": {
                                "field": "latitude",
                                "type": "latitude"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsbUNBQWlGO0FBQ2pGLDhCQUE4QjtBQUU5QixRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLFlBQVksRUFBRTtvQkFDWixNQUFNLEVBQUUsV0FBVztpQkFDcEI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUUsVUFBVTt3QkFDbEIsU0FBUyxFQUFFLFFBQVE7cUJBQ3BCO2lCQUNGO2dCQUNELFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2QsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLFNBQVMsRUFBRSxRQUFRO3FCQUNwQjtpQkFDRjtnQkFDRCxVQUFVLEVBQUUsRUFBRTthQUNmLENBQUMsQ0FBQztZQUNILEtB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TGF5ZXJNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcbi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5kZXNjcmliZSgnc3JjL2NvbXBpbGUvcHJvamVjdGlvbi9wYXJzZScsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ3BhcnNlVW5pdFByb2plY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgcHJvamVjdGlvbiBmcm9tIHNwZWNpZmllZCBwcm9qZWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmV4cGxpY2l0LCB7dHlwZTogJ2FsYmVyc1VzYSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIHByb2plY3Rpb24gd2l0aCBubyBwcm9wcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LnByb2plY3Rpb24uZXhwbGljaXQsIHt9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIHByb2plY3Rpb24gZnJvbSBjb25maWcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmV4cGxpY2l0LCB7dHlwZTogJ2FsYmVyc1VzYSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGRhdGEgd2l0aCBzaWduYWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL2FpcnBvcnRzLmNzdlwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibG9uZ2l0dWRlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwibGF0aXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcbiAgICAgIGFzc2VydC5pc09iamVjdChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhWzBdKTtcbiAgICAgIGFzc2VydC5wcm9wZXJ0eShtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhWzBdLCAnc2lnbmFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBkYXRhIGZyb20gbWFpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcbiAgICAgIGFzc2VydC5pc1N0cmluZyhtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhWzBdKTtcbiAgICAgIGFzc2VydC5pc05vdE9iamVjdChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhWzBdKTtcbiAgICAgIGFzc2VydC5ub3RQcm9wZXJ0eShtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5kYXRhWzBdLCAnc2lnbmFsJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwYXJzZU5vblVuaXRQcm9qZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVyZ2UgdGhlIHNhbWUgcHJvamVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvYWlycG9ydHMuY3N2XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImxvbmdpdHVkZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibGF0aXR1ZGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmV4cGxpY2l0LCB7dHlwZTogJ2FsYmVyc1VzYSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgaW4gZW1wdHkgcHJvamVjdGlvbiB0byBzcGVjaWZpZWQgcHJvamVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGVtcHR5Rmlyc3QgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvYWlycG9ydHMuY3N2XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImxvbmdpdHVkZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibGF0aXR1ZGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIGVtcHR5Rmlyc3QucGFyc2UoKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZW1wdHlGaXJzdC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgICBjb25zdCBlbXB0eUxhc3QgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvYWlycG9ydHMuY3N2XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImxvbmdpdHVkZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibGF0aXR1ZGVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIGVtcHR5TGFzdC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChlbXB0eUxhc3QuY29tcG9uZW50LnByb2plY3Rpb24uZXhwbGljaXQsIHt0eXBlOiAnYWxiZXJzVXNhJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBwcm9qZWN0aW9ucyB3aXRoIHNhbWUgc2l6ZSwgZGlmZmVyZW50IGRhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL2FpcnBvcnRzLmNzdlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJsb25naXR1ZGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBtZXJnZSBkaWZmZXJlbnQgc3BlY2lmaWVkIHByb2plY3Rpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVyY2F0b3JcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL2FpcnBvcnRzLmNzdlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJsb25naXR1ZGVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==