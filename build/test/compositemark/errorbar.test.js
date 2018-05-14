/* tslint:disable:quotemark */
import { assert } from 'chai';
import { normalize } from '../../src/spec';
import { defaultConfig } from '.././../src/config';
describe("normalizeErrorBar", function () {
    it("should produce correct layered specs for horizontal error bar", function () {
        assert.deepEqual(normalize({
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
        }, defaultConfig), {
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
        assert.throws(function () {
            normalize({
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
            }, defaultConfig);
        }, Error, 'Neither x2 or y2 provided');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JiYXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcG9zaXRlbWFyay9lcnJvcmJhci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUM5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTVCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHakQsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0lBRTFCLEVBQUUsQ0FBQywrREFBK0QsRUFBRTtRQUNsRSxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztZQUN6QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7WUFDdkMsSUFBSSxFQUFFLFdBQVc7WUFDakIsUUFBUSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztnQkFDdkMsR0FBRyxFQUFFO29CQUNILFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsUUFBUTtvQkFDakIsTUFBTSxFQUFFLGNBQWM7b0JBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7aUJBQ2hDO2dCQUNELElBQUksRUFBRTtvQkFDSixXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLE1BQU0sRUFBRSxjQUFjO2lCQUN2QjtnQkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO2FBQ3JCO1NBQ0YsRUFBRSxhQUFhLENBQUMsRUFBRTtZQUNqQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7WUFDdkMsT0FBTyxFQUFFO2dCQUNQO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQ3ZDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjOzRCQUN0QixNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO3lCQUNoQzt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osV0FBVyxFQUFFLEtBQUs7NEJBQ2xCLE9BQU8sRUFBRSxRQUFROzRCQUNqQixNQUFNLEVBQUUsY0FBYzt5QkFDdkI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLE1BQU07b0JBQ2QsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDdkMsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLOzRCQUNsQixPQUFPLEVBQUUsUUFBUTs0QkFDakIsTUFBTSxFQUFFLGNBQWM7NEJBQ3RCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUM7eUJBQ2hDO3dCQUNELE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUM7cUJBQ3JCO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQ3ZDLEdBQUcsRUFBRTs0QkFDSCxXQUFXLEVBQUUsS0FBSzs0QkFDbEIsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxjQUFjO3lCQUV2Qjt3QkFDRCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO3FCQUNyQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSixFQUFFLENBQUMsMkNBQTJDLEVBQUU7UUFDN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNaLFNBQVMsQ0FBQztnQkFDUixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsc0JBQXNCLEVBQUM7Z0JBQ3ZDLElBQUksRUFBRSxXQUFXO2dCQUNqQixRQUFRLEVBQUU7b0JBQ1IsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO29CQUN2QyxHQUFHLEVBQUU7d0JBQ0gsV0FBVyxFQUFFLEtBQUs7d0JBQ2xCLE9BQU8sRUFBRSxRQUFRO3dCQUNqQixNQUFNLEVBQUUsY0FBYzt3QkFDdEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQztxQkFDaEM7b0JBQ0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQztpQkFDckI7YUFDRixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsRUFBRSxLQUFLLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICcuLi8uLi9zcmMvc3BlYyc7XG5pbXBvcnQge2RlZmF1bHRDb25maWd9IGZyb20gJy4uLy4vLi4vc3JjL2NvbmZpZyc7XG5cblxuZGVzY3JpYmUoXCJub3JtYWxpemVFcnJvckJhclwiLCAoKSA9PiB7XG5cbiAgICBpdChcInNob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgaG9yaXpvbnRhbCBlcnJvciBiYXJcIiwgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIG1hcms6IFwiZXJyb3ItYmFyXCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIC8vIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgaXQoXCJzaG91bGQgdGhyb3cgZXJyb3Igd2hlbiBtaXNzaW5nIHgyIGFuZCB5MlwiLCAoKSA9PiB7XG4gICAgICBhc3NlcnQudGhyb3dzKCgpID0+IHtcbiAgICAgICAgbm9ybWFsaXplKHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgICAgbWFyazogXCJlcnJvci1iYXJcIixcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuICAgICAgfSwgRXJyb3IsICdOZWl0aGVyIHgyIG9yIHkyIHByb3ZpZGVkJyk7XG4gICAgfSk7XG4gfSk7XG4iXX0=