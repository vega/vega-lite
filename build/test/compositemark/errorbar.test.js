"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var spec_1 = require("../../src/spec");
var config_1 = require(".././../src/config");
describe("normalizeErrorBar", function () {
    it("should produce correct layered specs for horizontal error bar", function () {
        chai_1.assert.deepEqual(spec_1.normalize({
            "data": { "url": "data/population.json" },
            mark: "error-bar",
            encoding: {
                "y": { "field": "age", "type": "ordinal" },
                "x": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": { "title": "population" }
                },
                "x2": {
                    "aggregate": "max",
                    "field": "people",
                    "type": "quantitative"
                },
                "size": { "value": 5 }
            }
        }, config_1.defaultConfig), {
            "data": { "url": "data/population.json" },
            "layer": [
                {
                    "mark": "rule",
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "aggregate": "min",
                            "field": "people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
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
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "aggregate": "min",
                            "field": "people",
                            "type": "quantitative",
                            "axis": { "title": "population" }
                        },
                        "size": { "value": 5 }
                    }
                },
                {
                    "mark": "tick",
                    "encoding": {
                        "y": { "field": "age", "type": "ordinal" },
                        "x": {
                            "aggregate": "max",
                            "field": "people",
                            "type": "quantitative",
                        },
                        "size": { "value": 5 }
                    }
                }
            ]
        });
    });
    it("should throw error when missing x2 and y2", function () {
        chai_1.assert.throws(function () {
            spec_1.normalize({
                "data": { "url": "data/population.json" },
                mark: "error-bar",
                encoding: {
                    "y": { "field": "age", "type": "ordinal" },
                    "x": {
                        "aggregate": "min",
                        "field": "people",
                        "type": "quantitative",
                        "axis": { "title": "population" }
                    },
                    "size": { "value": 5 }
                }
            }, config_1.defaultConfig);
        }, Error, 'Neither x2 or y2 provided');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcG9zaXRlbWFyay9lcnJvcmJhci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUk1Qix1Q0FBdUU7QUFDdkUsNkNBQWlEO0FBRWpELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUUxQixFQUFFLENBQUMsK0RBQStELEVBQUU7UUFDbEUsYUFBTSxDQUFDLFNBQVMsQ0FBa0UsZ0JBQVMsQ0FBQztZQUMxRixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7WUFDdkMsSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDdkMsR0FBRyxFQUFFO29CQUNILFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsUUFBUTtvQkFDakIsTUFBTSxFQUFFLGNBQWM7b0JBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7aUJBQ2hDO2dCQUNELElBQUksRUFBRTtvQkFDSixXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjtnQkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO2FBQ3JCO1NBQ0YsRUFBRSxzQkFBYSxDQUFDLEVBQUU7WUFDakIsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFDO1lBQ3ZDLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO3dCQUN2QyxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsY0FBYzs0QkFDdEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQzt5QkFDaEM7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKLFdBQVcsRUFBRSxLQUFLOzRCQUNsQixPQUFPLEVBQUUsUUFBUTs0QkFDakIsTUFBTSxFQUFFLGNBQWM7eUJBQ3ZCO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQ3ZDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjOzRCQUN0QixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO3lCQUNoQzt3QkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO3FCQUNyQjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO3dCQUN2QyxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsY0FBYzt5QkFFdkI7d0JBQ0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQztxQkFDckI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUosRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1FBQzdDLGFBQU0sQ0FBQyxNQUFNLENBQUM7WUFDWixnQkFBUyxDQUFDO2dCQUNSLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQztnQkFDdkMsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDUixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3ZDLEdBQUcsRUFBRTt3QkFDSCxXQUFXLEVBQUUsS0FBSzt3QkFDbEIsT0FBTyxFQUFFLFFBQVE7d0JBQ2pCLE1BQU0sRUFBRSxjQUFjO3dCQUN0QixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO3FCQUNoQztvQkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO2lCQUNyQjthQUNGLEVBQUUsc0JBQWEsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsRUFBRSxLQUFLLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RW5jb2Rpbmd9IGZyb20gJy4uLy4uL3NyYy9lbmNvZGluZyc7XG5pbXBvcnQge0ZpZWxkfSBmcm9tICcuLi8uLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9zcmMvbWFyayc7XG5pbXBvcnQge0dlbmVyaWNTcGVjLCBHZW5lcmljVW5pdFNwZWMsIG5vcm1hbGl6ZX0gZnJvbSAnLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtkZWZhdWx0Q29uZmlnfSBmcm9tICcuLi8uLy4uL3NyYy9jb25maWcnO1xuXG5kZXNjcmliZShcIm5vcm1hbGl6ZUVycm9yQmFyXCIsICgpID0+IHtcblxuICAgIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciBob3Jpem9udGFsIGVycm9yIGJhclwiLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPEdlbmVyaWNTcGVjPEdlbmVyaWNVbml0U3BlYzxFbmNvZGluZzxGaWVsZD4sIHN0cmluZyB8IE1hcmtEZWY+Pj4obm9ybWFsaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBtYXJrOiBcImVycm9yLWJhclwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAvLyBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgIGl0KFwic2hvdWxkIHRocm93IGVycm9yIHdoZW4gbWlzc2luZyB4MiBhbmQgeTJcIiwgKCkgPT4ge1xuICAgICAgYXNzZXJ0LnRocm93cygoKSA9PiB7XG4gICAgICAgIG5vcm1hbGl6ZSh7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICAgIG1hcms6IFwiZXJyb3ItYmFyXCIsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgfVxuICAgICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcbiAgICAgIH0sIEVycm9yLCAnTmVpdGhlciB4MiBvciB5MiBwcm92aWRlZCcpO1xuICAgIH0pO1xuIH0pO1xuIl19