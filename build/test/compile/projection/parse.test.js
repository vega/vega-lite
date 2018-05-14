import { assert } from 'chai';
import { parseLayerModel, parseUnitModelWithScaleAndLayoutSize } from '../../util';
/* tslint:disable:quotemark */
describe('src/compile/projection/parse', function () {
    describe('parseUnitProjection', function () {
        it('should create projection from specified projection', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should create projection with no props', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            assert.deepEqual(model.component.projection.explicit, {});
        });
        it('should create projection from config', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should add data with signal', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            assert.isObject(model.component.projection.data[0]);
            assert.property(model.component.projection.data[0], 'signal');
        });
        it('should add data from main', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
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
            assert.isString(model.component.projection.data[0]);
            assert.isNotObject(model.component.projection.data[0]);
            assert.notProperty(model.component.projection.data[0], 'signal');
        });
    });
    describe('parseNonUnitProjection', function () {
        it('should merge the same projection', function () {
            var model = parseLayerModel({
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
            assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should merge in empty projection to specified projection', function () {
            var emptyFirst = parseLayerModel({
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
            assert.deepEqual(emptyFirst.component.projection.explicit, { type: 'albersUsa' });
            var emptyLast = parseLayerModel({
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
            assert.deepEqual(emptyLast.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should merge projections with same size, different data', function () {
            var model = parseLayerModel({
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
            assert.deepEqual(model.component.projection.explicit, { type: 'albersUsa' });
        });
        it('should not merge different specified projections', function () {
            var model = parseLayerModel({
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
            assert.isUndefined(model.component.projection);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9wcm9qZWN0aW9uL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsZUFBZSxFQUFFLG9DQUFvQyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2pGLDhCQUE4QjtBQUU5QixRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLFlBQVksRUFBRTtvQkFDWixNQUFNLEVBQUUsV0FBVztpQkFDcEI7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxrQkFBa0I7b0JBQ3pCLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUUsVUFBVTt3QkFDbEIsU0FBUyxFQUFFLFFBQVE7cUJBQ3BCO2lCQUNGO2dCQUNELFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLEtBQUssR0FBRyxvQ0FBb0MsQ0FBQztnQkFDakQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLFNBQVMs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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG4vKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuZGVzY3JpYmUoJ3NyYy9jb21waWxlL3Byb2plY3Rpb24vcGFyc2UnLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdwYXJzZVVuaXRQcm9qZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIHByb2plY3Rpb24gZnJvbSBzcGVjaWZpZWQgcHJvamVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBwcm9qZWN0aW9uIHdpdGggbm8gcHJvcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImdlb3NoYXBlXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmV4cGxpY2l0LCB7fSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBwcm9qZWN0aW9uIGZyb20gY29uZmlnJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fSxcbiAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBkYXRhIHdpdGggc2lnbmFsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS9haXJwb3J0cy5jc3ZcIixcbiAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJjc3ZcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJsb25naXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmlzT2JqZWN0KG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGFbMF0pO1xuICAgICAgYXNzZXJ0LnByb3BlcnR5KG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGFbMF0sICdzaWduYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGRhdGEgZnJvbSBtYWluJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmlzU3RyaW5nKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGFbMF0pO1xuICAgICAgYXNzZXJ0LmlzTm90T2JqZWN0KG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGFbMF0pO1xuICAgICAgYXNzZXJ0Lm5vdFByb3BlcnR5KG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmRhdGFbMF0sICdzaWduYWwnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3BhcnNlTm9uVW5pdFByb2plY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZXJnZSB0aGUgc2FtZSBwcm9qZWN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvdXMtMTBtLmpzb25cIixcbiAgICAgICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInRvcG9qc29uXCIsXG4gICAgICAgICAgICAgICAgXCJmZWF0dXJlXCI6IFwic3RhdGVzXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge31cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS9haXJwb3J0cy5jc3ZcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJsb25naXR1ZGVcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsb25naXR1ZGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcImxhdGl0dWRlXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibGF0aXR1ZGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5wcm9qZWN0aW9uLmV4cGxpY2l0LCB7dHlwZTogJ2FsYmVyc1VzYSd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgaW4gZW1wdHkgcHJvamVjdGlvbiB0byBzcGVjaWZpZWQgcHJvamVjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGVtcHR5Rmlyc3QgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvYWlycG9ydHMuY3N2XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG9uZ2l0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJsYXRpdHVkZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBlbXB0eUZpcnN0LnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGVtcHR5Rmlyc3QuY29tcG9uZW50LnByb2plY3Rpb24uZXhwbGljaXQsIHt0eXBlOiAnYWxiZXJzVXNhJ30pO1xuICAgICAgY29uc3QgZW1wdHlMYXN0ID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL2FpcnBvcnRzLmNzdlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcImxvbmdpdHVkZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgZW1wdHlMYXN0LnBhcnNlKCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGVtcHR5TGFzdC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1lcmdlIHByb2plY3Rpb25zIHdpdGggc2FtZSBzaXplLCBkaWZmZXJlbnQgZGF0YScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiZ2Vvc2hhcGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0b3BvanNvblwiLFxuICAgICAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICBcInVybFwiOiBcImRhdGEvYWlycG9ydHMuY3N2XCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwibG9uZ2l0dWRlXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwibG9uZ2l0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJsYXRpdHVkZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxhdGl0dWRlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgICBtb2RlbC5wYXJzZSgpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbi5leHBsaWNpdCwge3R5cGU6ICdhbGJlcnNVc2EnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBtZXJnZSBkaWZmZXJlbnQgc3BlY2lmaWVkIHByb2plY3Rpb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWVyY2F0b3JcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgIFwidXJsXCI6IFwiZGF0YS91cy0xMG0uanNvblwiLFxuICAgICAgICAgICAgICBcImZvcm1hdFwiOiB7XG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgICAgICBcImZlYXR1cmVcIjogXCJzdGF0ZXNcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7fVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL2FpcnBvcnRzLmNzdlwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgICAgICBcInR5cGVcIjogXCJhbGJlcnNVc2FcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcImxvbmdpdHVkZVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwibGF0aXR1ZGVcIjoge1xuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJsYXRpdHVkZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2UoKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChtb2RlbC5jb21wb25lbnQucHJvamVjdGlvbik7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=