"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcG9zaXRlbWFyay9lcnJvcmJhci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUU1Qix1Q0FBeUM7QUFDekMsNkNBQWlEO0FBR2pELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUUxQixFQUFFLENBQUMsK0RBQStELEVBQUU7UUFDbEUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBUyxDQUFDO1lBQ3pCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQztZQUN2QyxJQUFJLEVBQUUsV0FBVztZQUNqQixRQUFRLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUN2QyxHQUFHLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLEtBQUs7b0JBQ2xCLE9BQU8sRUFBRSxRQUFRO29CQUNqQixNQUFNLEVBQUUsY0FBYztvQkFDdEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQztpQkFDaEM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsUUFBUTtvQkFDakIsTUFBTSxFQUFFLGNBQWM7aUJBQ3ZCO2dCQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7YUFDckI7U0FDRixFQUFFLHNCQUFhLENBQUMsRUFBRTtZQUNqQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7WUFDdkMsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQ3ZDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjOzRCQUN0QixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO3lCQUNoQzt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDdkMsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLOzRCQUNsQixPQUFPLEVBQUUsUUFBUTs0QkFDakIsTUFBTSxFQUFFLGNBQWM7NEJBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7eUJBQ2hDO3dCQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7cUJBQ3JCO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQ3ZDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjO3lCQUV2Qjt3QkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO3FCQUNyQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSixFQUFFLENBQUMsMkNBQTJDLEVBQUU7UUFDN0MsYUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNaLGdCQUFTLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFDO2dCQUN2QyxJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFO29CQUNSLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDdkMsR0FBRyxFQUFFO3dCQUNILFdBQVcsRUFBRSxLQUFLO3dCQUNsQixPQUFPLEVBQUUsUUFBUTt3QkFDakIsTUFBTSxFQUFFLGNBQWM7d0JBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7cUJBQ2hDO29CQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7aUJBQ3JCO2FBQ0YsRUFBRSxzQkFBYSxDQUFDLENBQUM7UUFDcEIsQ0FBQyxFQUFFLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtub3JtYWxpemV9IGZyb20gJy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7ZGVmYXVsdENvbmZpZ30gZnJvbSAnLi4vLi8uLi9zcmMvY29uZmlnJztcblxuXG5kZXNjcmliZShcIm5vcm1hbGl6ZUVycm9yQmFyXCIsICgpID0+IHtcblxuICAgIGl0KFwic2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciBob3Jpem9udGFsIGVycm9yIGJhclwiLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbWFyazogXCJlcnJvci1iYXJcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgLy8gXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICBpdChcInNob3VsZCB0aHJvdyBlcnJvciB3aGVuIG1pc3NpbmcgeDIgYW5kIHkyXCIsICgpID0+IHtcbiAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xuICAgICAgICBub3JtYWxpemUoe1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgICBtYXJrOiBcImVycm9yLWJhclwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG4gICAgICB9LCBFcnJvciwgJ05laXRoZXIgeDIgb3IgeTIgcHJvdmlkZWQnKTtcbiAgICB9KTtcbiB9KTtcbiJdfQ==