"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mark_1 = require("../../../src/compile/mark/mark");
var util_1 = require("../../util");
describe('Mark', function () {
    describe('parseMarkGroup', function () {
        // PATH
        describe('Multi-series Line', function () {
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": { "type": "line", "style": "trend" },
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "symbol", "type": "nominal" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'pathgroup');
                chai_1.assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                chai_1.assert.equal(submarkGroup.name, 'marks');
                chai_1.assert.equal(submarkGroup.type, 'line');
                chai_1.assert.deepEqual(submarkGroup.style, ['line', 'trend']);
                chai_1.assert.equal(submarkGroup.from.data, 'faceted_path_main');
            });
        });
        describe('Single Line', function () {
            it('should have a facet directive and a nested mark group', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'marks');
                chai_1.assert.equal(markGroup.type, 'line');
                chai_1.assert.equal(markGroup.from.data, 'main');
            });
        });
        // NON-PATH
        describe('Aggregated Bar with a color with binned x', function () {
            it(' should use main stacked data source', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
                chai_1.assert.equal(markGroup[0].style, 'bar');
            });
        });
        describe('Faceted aggregated Bar with a color with binned x', function () {
            it('should use faceted data source', function () {
                var model = util_1.parseFacetModel({
                    facet: {
                        row: { field: 'a', type: 'nominal' }
                    },
                    spec: {
                        "mark": "bar",
                        "encoding": {
                            "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                            "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                            "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                        }
                    }
                });
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = mark_1.parseMarkGroup(model.child);
                chai_1.assert.equal(markGroup[0].from.data, 'child_main');
            });
        });
        describe('Aggregated bar', function () {
            it('should use main aggregated data source', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
            });
        });
        describe('Bar with tooltip', function () {
            it('should pass tooltip value to encoding', function () {
                var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "tooltip": { "value": "foo" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].encode.update.tooltip.value, 'foo');
            });
        });
    });
    describe('getPathSort', function () {
        describe('compileUnit', function () {
            it('should order by order field for line with order (connected scatterplot)', function () {
                var model = util_1.parseUnitModel({
                    "data": { "url": "data/driving.json" },
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                        "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                        "order": { "field": "year", "type": "temporal" }
                    }
                });
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
                    field: ['datum[\"year\"]'],
                    order: ['ascending']
                });
            });
            it('should order by x by default if x is the dimension', function () {
                var model = util_1.parseUnitModelWithScale({
                    "data": { "url": "data/movies.json" },
                    "mark": "line",
                    "encoding": {
                        "x": {
                            "bin": { "maxbins": 10 },
                            "field": "IMDB_Rating",
                            "type": "quantitative"
                        },
                        "color": {
                            "field": "Source",
                            "type": "nominal"
                        },
                        "y": {
                            "aggregate": "count",
                            "type": "quantitative"
                        }
                    }
                });
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
                    field: 'datum[\"bin_maxbins_10_IMDB_Rating\"]',
                    order: 'descending'
                });
            });
            it('should not order by a missing dimension', function () {
                var model = util_1.parseUnitModelWithScale({
                    "data": { "url": "data/movies.json" },
                    "mark": "line",
                    "encoding": {
                        "color": {
                            "field": "Source",
                            "type": "nominal"
                        },
                        "y": {
                            "aggregate": "count",
                            "type": "quantitative"
                        }
                    }
                });
                chai_1.assert.deepEqual(mark_1.getPathSort(model), undefined);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1Qix1REFBMkU7QUFFM0UsbUNBQTBIO0FBRTFILFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsT0FBTztRQUNQLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO29CQUNqRCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7b0JBQzFDLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO3dCQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDaEQ7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUMvQixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjt3QkFDekIsSUFBSSxFQUFFLE1BQU07d0JB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QUFDLENBQUM7Z0JBQ0gsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNuQyxLQUFLLEVBQUUsdUNBQXVDO29CQUM5QyxLQUFLLEVBQUUsWUFBWTtpQkFDcEIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUU7Z0JBQzVDLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO29CQUNwQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7b0JBQ25DLE1BQU0sRUFBRSxNQUFNO29CQUNkLFVBQVUsRUFBRTt3QkFDVixPQUFPLEVBQUU7NEJBQ1AsT0FBTyxFQUFFLFFBQVE7NEJBQ2pCLE1BQU0sRUFBRSxTQUFTO3lCQUNsQjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLE9BQU87NEJBQ3BCLE1BQU0sRUFBRSxjQUFjO3lCQUN2QjtxQkFDRjtpQkFDRixDQUFDLENBQUM7Z0JBQ0gsYUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtnZXRQYXRoU29ydCwgcGFyc2VNYXJrR3JvdXB9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWFyayc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyaycsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VNYXJrR3JvdXAnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBQQVRIXG4gICAgZGVzY3JpYmUoJ011bHRpLXNlcmllcyBMaW5lJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGEgZmFjZXQgZGlyZWN0aXZlIGFuZCBhIG5lc3RlZCBtYXJrIGdyb3VwIHRoYXQgdXNlcyB0aGUgZmFjZXRlZCBkYXRhLicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInN0eWxlXCI6IFwidHJlbmRcIn0sXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiYXhpc1wiOiB7XCJmb3JtYXRcIjogXCIlWVwifX0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAubmFtZSwgJ3BhdGhncm91cCcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG1hcmtHcm91cC5mcm9tLCB7XG4gICAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICAgIG5hbWU6ICdmYWNldGVkX3BhdGhfbWFpbicsXG4gICAgICAgICAgICBkYXRhOiAnbWFpbicsXG4gICAgICAgICAgICBncm91cGJ5OiBbJ3N5bWJvbCddXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgc3VibWFya0dyb3VwID0gbWFya0dyb3VwLm1hcmtzWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLm5hbWUsICdtYXJrcycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3VibWFya0dyb3VwLnR5cGUsICdsaW5lJyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc3VibWFya0dyb3VwLnN0eWxlLCBbJ2xpbmUnLCAndHJlbmQnXSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdWJtYXJrR3JvdXAuZnJvbS5kYXRhLCAnZmFjZXRlZF9wYXRoX21haW4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1NpbmdsZSBMaW5lJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGEgZmFjZXQgZGlyZWN0aXZlIGFuZCBhIG5lc3RlZCBtYXJrIGdyb3VwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImF4aXNcIjoge1wiZm9ybWF0XCI6IFwiJVlcIn19LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLm5hbWUsICdtYXJrcycpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwLnR5cGUsICdsaW5lJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtYXJrR3JvdXAuZnJvbS5kYXRhLCAnbWFpbicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBOT04tUEFUSFxuICAgIGRlc2NyaWJlKCdBZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGl0KCcgc2hvdWxkIHVzZSBtYWluIHN0YWNrZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ21haW4nKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5zdHlsZSwgJ2JhcicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnRmFjZXRlZCBhZ2dyZWdhdGVkIEJhciB3aXRoIGEgY29sb3Igd2l0aCBiaW5uZWQgeCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGZhY2V0ZWQgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgICBmYWNldDoge1xuICAgICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3BlYzoge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcIkNvc3RfX090aGVyXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiRWZmZWN0X19BbW91bnRfb2ZfZGFtYWdlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgICAgICBjb25zdCBtYXJrR3JvdXAgPSBwYXJzZU1hcmtHcm91cChtb2RlbC5jaGlsZCBhcyBVbml0TW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmZyb20uZGF0YSwgJ2NoaWxkX21haW4nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ0FnZ3JlZ2F0ZWQgYmFyJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgbWFpbiBhZ2dyZWdhdGVkIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fT3RoZXJcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYmluXCI6IHRydWUsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiQ29zdF9fVG90YWxfJFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IG1hcmtHcm91cCA9IHBhcnNlTWFya0dyb3VwKG1vZGVsKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1hcmtHcm91cFswXS5mcm9tLmRhdGEsICdtYWluJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdCYXIgd2l0aCB0b29sdGlwJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHRvb2x0aXAgdmFsdWUgdG8gZW5jb2RpbmcnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19PdGhlclwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJDb3N0X19Ub3RhbF8kXCJ9LFxuICAgICAgICAgICAgXCJ0b29sdGlwXCI6IHtcInZhbHVlXCI6IFwiZm9vXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbWFya0dyb3VwID0gcGFyc2VNYXJrR3JvdXAobW9kZWwpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobWFya0dyb3VwWzBdLmVuY29kZS51cGRhdGUudG9vbHRpcC52YWx1ZSwgJ2ZvbycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRQYXRoU29ydCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnc2hvdWxkIG9yZGVyIGJ5IG9yZGVyIGZpZWxkIGZvciBsaW5lIHdpdGggb3JkZXIgKGNvbm5lY3RlZCBzY2F0dGVycGxvdCknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvZHJpdmluZy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIm1pbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1wiemVyb1wiOiBmYWxzZX19LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImdhc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInplcm9cIjogZmFsc2V9fSxcbiAgICAgICAgICBcIm9yZGVyXCI6IHtcImZpZWxkXCI6IFwieWVhclwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRQYXRoU29ydChtb2RlbCksIHtcbiAgICAgICAgZmllbGQ6IFsnZGF0dW1bXFxcInllYXJcXFwiXSddLFxuICAgICAgICBvcmRlcjogWydhc2NlbmRpbmcnXVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG9yZGVyIGJ5IHggYnkgZGVmYXVsdCBpZiB4IGlzIHRoZSBkaW1lbnNpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgIFwiYmluXCI6IHtcIm1heGJpbnNcIjogMTB9LFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIklNREJfUmF0aW5nXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiU291cmNlXCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJub21pbmFsXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGdldFBhdGhTb3J0KG1vZGVsKSwge1xuICAgICAgICBmaWVsZDogJ2RhdHVtW1xcXCJiaW5fbWF4Ymluc18xMF9JTURCX1JhdGluZ1xcXCJdJyxcbiAgICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBvcmRlciBieSBhIG1pc3NpbmcgZGltZW5zaW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIlNvdXJjZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibm9taW5hbFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChnZXRQYXRoU29ydChtb2RlbCksIHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH0pO1xuICB9KTtcbn0pO1xuIl19