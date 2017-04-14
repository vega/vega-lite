/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var spec_1 = require("../src/spec");
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
        }), {
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
            });
        }, Error, 'Neither x2 or y2 provided');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlbWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9jb21wb3NpdGVtYXJrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRzVCLG9DQUFvRTtBQUVwRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFFMUIsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1FBQ2xFLGFBQU0sQ0FBQyxTQUFTLENBQTJELGdCQUFTLENBQUM7WUFDbkYsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFDO1lBQ3ZDLElBQUksRUFBRSxXQUFXO1lBQ2pCLFFBQVEsRUFBRTtnQkFDUixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQ3ZDLEdBQUcsRUFBRTtvQkFDSCxXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLE1BQU0sRUFBRSxjQUFjO29CQUN0QixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO2lCQUNoQztnQkFDRCxJQUFJLEVBQUU7b0JBQ0osV0FBVyxFQUFFLEtBQUs7b0JBQ2xCLE9BQU8sRUFBRSxRQUFRO29CQUNqQixNQUFNLEVBQUUsY0FBYztpQkFDdkI7Z0JBQ0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQzthQUNyQjtTQUNGLENBQUMsRUFBRTtZQUNGLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQztZQUN2QyxPQUFPLEVBQUU7Z0JBQ1A7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDdkMsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLOzRCQUNsQixPQUFPLEVBQUUsUUFBUTs0QkFDakIsTUFBTSxFQUFFLGNBQWM7NEJBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7eUJBQ2hDO3dCQUNELElBQUksRUFBRTs0QkFDSixXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjO3lCQUN2QjtxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO3dCQUN2QyxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsY0FBYzs0QkFDdEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQzt5QkFDaEM7d0JBQ0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQztxQkFDckI7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDdkMsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLOzRCQUNsQixPQUFPLEVBQUUsUUFBUTs0QkFDakIsTUFBTSxFQUFFLGNBQWM7eUJBRXZCO3dCQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7cUJBQ3JCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVKLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtRQUM3QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osZ0JBQVMsQ0FBQztnQkFDUixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7Z0JBQ3ZDLElBQUksRUFBRSxXQUFXO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO29CQUN2QyxHQUFHLEVBQUU7d0JBQ0gsV0FBVyxFQUFFLEtBQUs7d0JBQ2xCLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixNQUFNLEVBQUUsY0FBYzt3QkFDdEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQztxQkFDaEM7b0JBQ0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQztpQkFDckI7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9