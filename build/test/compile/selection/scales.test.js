/* tslint:disable:quotemark */
import { assert } from 'chai';
import { assembleScalesForModel } from '../../../src/compile/scale/assemble';
import { parseConcatModel, parseRepeatModel } from '../../util';
describe('Selection + Scales', function () {
    it('assembles domainRaw from selection parameter', function () {
        var model = parseConcatModel({
            vconcat: [
                {
                    mark: "area",
                    selection: {
                        brush: { type: "interval", encodings: ["x"] },
                        brush2: { type: "multi", fields: ["price"], resolve: "intersect" }
                    },
                    encoding: {
                        x: { field: "date", type: "temporal" },
                        y: { field: "price", type: "quantitative" }
                    }
                },
                {
                    selection: {
                        brush3: { type: "interval" }
                    },
                    mark: "area",
                    encoding: {
                        x: {
                            field: "date", type: "temporal",
                            scale: { domain: { selection: "brush", encoding: "x" } }
                        },
                        y: {
                            field: "price", type: "quantitative",
                            scale: { domain: { selection: "brush2", field: "price" } }
                        },
                        color: {
                            field: "symbol", type: "nominal",
                            scale: { domain: { selection: "brush2" } }
                        },
                        opacity: {
                            field: "symbol", type: "nominal",
                            scale: { domain: { selection: "brush3" } }
                        }
                    }
                }
            ],
            resolve: {
                scale: {
                    color: 'independent',
                    opacity: 'independent'
                }
            }
        });
        model.parseScale();
        model.parseSelection();
        var scales = assembleScalesForModel(model.children[1]);
        var xscale = scales[0];
        var yscale = scales[1];
        var cscale = scales[2];
        var oscale = scales[3];
        assert.isObject(xscale.domain);
        assert.property(xscale, 'domainRaw');
        assert.propertyVal(xscale.domainRaw, 'signal', "vlIntervalDomain(\"brush_store\", \"x\", null)");
        assert.isObject(yscale.domain);
        assert.property(yscale, 'domainRaw');
        assert.deepPropertyVal(yscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        assert.isObject(cscale.domain);
        assert.property(cscale, 'domainRaw');
        assert.propertyVal(cscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        assert.isObject(oscale.domain);
        assert.property(oscale, 'domainRaw');
        assert.propertyVal(oscale.domainRaw, 'signal', 'null');
    });
    it('should bind both scales in diagonal repeated views', function () {
        var model = parseRepeatModel({
            repeat: {
                row: ["Horsepower", "Acceleration"],
                column: ["Miles_per_Gallon", "Acceleration"]
            },
            spec: {
                data: { url: "data/cars.json" },
                mark: "point",
                selection: {
                    grid: {
                        type: "interval",
                        resolve: "global",
                        bind: "scales"
                    }
                },
                encoding: {
                    x: { field: { repeat: "column" }, type: "quantitative" },
                    y: { field: { repeat: "row" }, type: "quantitative" },
                    color: { field: "Origin", type: "nominal" }
                }
            }
        });
        model.parseScale();
        model.parseSelection();
        var scales = assembleScalesForModel(model.children[3]);
        assert.isTrue(scales.length === 2);
        assert.property(scales[0], 'domainRaw');
        assert.property(scales[1], 'domainRaw');
        assert.propertyVal(scales[0].domainRaw, 'signal', 'grid_Acceleration');
        assert.propertyVal(scales[1].domainRaw, 'signal', 'grid_Acceleration');
    });
    it('should merge domainRaw for layered views', function () {
        var model = parseConcatModel({
            data: { url: "data/sp500.csv" },
            vconcat: [
                {
                    layer: [
                        {
                            mark: "point",
                            encoding: {
                                x: {
                                    field: "date", type: "temporal",
                                    scale: { domain: { selection: "brush" } }
                                },
                                y: { field: "price", type: "quantitative" }
                            }
                        }
                    ]
                },
                {
                    mark: "area",
                    selection: {
                        brush: { type: "interval", encodings: ["x"] }
                    },
                    encoding: {
                        x: { field: "date", type: "temporal" },
                        y: { field: "price", type: "quantitative" }
                    }
                }
            ]
        });
        model.parseScale();
        model.parseSelection();
        var scales = assembleScalesForModel(model.children[0]);
        assert.property(scales[0], 'domainRaw');
        assert.propertyVal(scales[0].domainRaw, 'signal', 'vlIntervalDomain("brush_store", null, "date")');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3NjYWxlcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBRTNFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU5RCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDO1lBQzdCLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsTUFBTTtvQkFDWixTQUFTLEVBQUU7d0JBQ1QsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQzt3QkFDM0MsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFDO3FCQUNqRTtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO3dCQUNwQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7cUJBQzFDO2lCQUNGO2dCQUNEO29CQUNFLFNBQVMsRUFBRTt3QkFDVCxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDO3FCQUMzQjtvQkFDRCxJQUFJLEVBQUUsTUFBTTtvQkFDWixRQUFRLEVBQUU7d0JBQ1IsQ0FBQyxFQUFFOzRCQUNELEtBQUssRUFB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QUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsK0NBQStDLENBQUMsQ0FBQztJQUNyRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXNzZW1ibGVTY2FsZXNGb3JNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvYXNzZW1ibGUnO1xuaW1wb3J0IHtEb21haW59IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3BhcnNlQ29uY2F0TW9kZWwsIHBhcnNlUmVwZWF0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnU2VsZWN0aW9uICsgU2NhbGVzJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdhc3NlbWJsZXMgZG9tYWluUmF3IGZyb20gc2VsZWN0aW9uIHBhcmFtZXRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICB2Y29uY2F0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBtYXJrOiBcImFyZWFcIixcbiAgICAgICAgICBzZWxlY3Rpb246IHtcbiAgICAgICAgICAgIGJydXNoOiB7dHlwZTogXCJpbnRlcnZhbFwiLCBlbmNvZGluZ3M6IFtcInhcIl19LFxuICAgICAgICAgICAgYnJ1c2gyOiB7dHlwZTogXCJtdWx0aVwiLCBmaWVsZHM6IFtcInByaWNlXCJdLCByZXNvbHZlOiBcImludGVyc2VjdFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogXCJkYXRlXCIsIHR5cGU6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6IFwicHJpY2VcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3Rpb246IHtcbiAgICAgICAgICAgIGJydXNoMzoge3R5cGU6IFwiaW50ZXJ2YWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIG1hcms6IFwiYXJlYVwiLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICBzY2FsZToge2RvbWFpbjoge3NlbGVjdGlvbjogXCJicnVzaFwiLCBlbmNvZGluZzogXCJ4XCJ9fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgZmllbGQ6IFwicHJpY2VcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiYnJ1c2gyXCIsIGZpZWxkOiBcInByaWNlXCJ9fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiYnJ1c2gyXCJ9IGFzIERvbWFpbn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgIGZpZWxkOiBcInN5bWJvbFwiLCB0eXBlOiBcIm5vbWluYWxcIixcbiAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiYnJ1c2gzXCJ9IGFzIERvbWFpbn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgY29sb3I6ICdpbmRlcGVuZGVudCcsXG4gICAgICAgICAgb3BhY2l0eTogJ2luZGVwZW5kZW50J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VTZWxlY3Rpb24oKTtcblxuICAgIGNvbnN0IHNjYWxlcyA9IGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwuY2hpbGRyZW5bMV0pO1xuICAgIGNvbnN0IHhzY2FsZSA9IHNjYWxlc1swXTtcbiAgICBjb25zdCB5c2NhbGUgPSBzY2FsZXNbMV07XG4gICAgY29uc3QgY3NjYWxlID0gc2NhbGVzWzJdO1xuICAgIGNvbnN0IG9zY2FsZSA9IHNjYWxlc1szXTtcblxuICAgIGFzc2VydC5pc09iamVjdCh4c2NhbGUuZG9tYWluKTtcbiAgICBhc3NlcnQucHJvcGVydHkoeHNjYWxlLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHhzY2FsZS5kb21haW5SYXcsICdzaWduYWwnLFxuICAgICAgXCJ2bEludGVydmFsRG9tYWluKFxcXCJicnVzaF9zdG9yZVxcXCIsIFxcXCJ4XFxcIiwgbnVsbClcIik7XG5cbiAgICBhc3NlcnQuaXNPYmplY3QoeXNjYWxlLmRvbWFpbik7XG4gICAgYXNzZXJ0LnByb3BlcnR5KHlzY2FsZSwgJ2RvbWFpblJhdycpO1xuICAgIGFzc2VydC5kZWVwUHJvcGVydHlWYWwoeXNjYWxlLmRvbWFpblJhdywgJ3NpZ25hbCcsXG4gICAgICBcInZsTXVsdGlEb21haW4oXFxcImJydXNoMl9zdG9yZVxcXCIsIG51bGwsIFxcXCJwcmljZVxcXCIsIFxcXCJpbnRlcnNlY3RcXFwiKVwiKTtcblxuICAgIGFzc2VydC5pc09iamVjdChjc2NhbGUuZG9tYWluKTtcbiAgICBhc3NlcnQucHJvcGVydHkoY3NjYWxlLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKGNzY2FsZS5kb21haW5SYXcsICdzaWduYWwnLFxuICAgICAgXCJ2bE11bHRpRG9tYWluKFxcXCJicnVzaDJfc3RvcmVcXFwiLCBudWxsLCBcXFwicHJpY2VcXFwiLCBcXFwiaW50ZXJzZWN0XFxcIilcIik7XG5cbiAgICBhc3NlcnQuaXNPYmplY3Qob3NjYWxlLmRvbWFpbik7XG4gICAgYXNzZXJ0LnByb3BlcnR5KG9zY2FsZSwgJ2RvbWFpblJhdycpO1xuICAgIGFzc2VydC5wcm9wZXJ0eVZhbChvc2NhbGUuZG9tYWluUmF3LCAnc2lnbmFsJywgJ251bGwnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiaW5kIGJvdGggc2NhbGVzIGluIGRpYWdvbmFsIHJlcGVhdGVkIHZpZXdzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVJlcGVhdE1vZGVsKHtcbiAgICAgIHJlcGVhdDoge1xuICAgICAgICByb3c6IFtcIkhvcnNlcG93ZXJcIiwgXCJBY2NlbGVyYXRpb25cIl0sXG4gICAgICAgIGNvbHVtbjogW1wiTWlsZXNfcGVyX0dhbGxvblwiLCBcIkFjY2VsZXJhdGlvblwiXVxuICAgICAgfSxcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgZGF0YToge3VybDogXCJkYXRhL2NhcnMuanNvblwifSxcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBzZWxlY3Rpb246IHtcbiAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICB0eXBlOiBcImludGVydmFsXCIsXG4gICAgICAgICAgICByZXNvbHZlOiBcImdsb2JhbFwiLFxuICAgICAgICAgICAgYmluZDogXCJzY2FsZXNcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IHtyZXBlYXQ6IFwiY29sdW1uXCJ9LCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICB5OiB7ZmllbGQ6IHtyZXBlYXQ6IFwicm93XCJ9LCB0eXBlOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBjb2xvcjoge2ZpZWxkOiBcIk9yaWdpblwiLCB0eXBlOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgIG1vZGVsLnBhcnNlU2VsZWN0aW9uKCk7XG5cbiAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlc0Zvck1vZGVsKG1vZGVsLmNoaWxkcmVuWzNdKTtcbiAgICBhc3NlcnQuaXNUcnVlKHNjYWxlcy5sZW5ndGggPT09IDIpO1xuICAgIGFzc2VydC5wcm9wZXJ0eShzY2FsZXNbMF0sICdkb21haW5SYXcnKTtcbiAgICBhc3NlcnQucHJvcGVydHkoc2NhbGVzWzFdLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHNjYWxlc1swXS5kb21haW5SYXcsICdzaWduYWwnLCAnZ3JpZF9BY2NlbGVyYXRpb24nKTtcbiAgICBhc3NlcnQucHJvcGVydHlWYWwoc2NhbGVzWzFdLmRvbWFpblJhdywgJ3NpZ25hbCcsICdncmlkX0FjY2VsZXJhdGlvbicpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpblJhdyBmb3IgbGF5ZXJlZCB2aWV3cycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICBkYXRhOiB7dXJsOiBcImRhdGEvc3A1MDAuY3N2XCJ9LFxuICAgICAgdmNvbmNhdDogW1xuICAgICAgICB7XG4gICAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICAgIGZpZWxkOiBcImRhdGVcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLFxuICAgICAgICAgICAgICAgICAgc2NhbGU6IHtkb21haW46IHtzZWxlY3Rpb246IFwiYnJ1c2hcIn19XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB5OiB7ZmllbGQ6IFwicHJpY2VcIiwgdHlwZTogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG1hcms6IFwiYXJlYVwiLFxuICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgYnJ1c2g6IHt0eXBlOiBcImludGVydmFsXCIsIGVuY29kaW5nczogW1wieFwiXX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6IFwiZGF0ZVwiLCB0eXBlOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiBcInByaWNlXCIsIHR5cGU6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgbW9kZWwucGFyc2VTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlc0Zvck1vZGVsKG1vZGVsLmNoaWxkcmVuWzBdKTtcbiAgICBhc3NlcnQucHJvcGVydHkoc2NhbGVzWzBdLCAnZG9tYWluUmF3Jyk7XG4gICAgYXNzZXJ0LnByb3BlcnR5VmFsKHNjYWxlc1swXS5kb21haW5SYXcsICdzaWduYWwnLCAndmxJbnRlcnZhbERvbWFpbihcImJydXNoX3N0b3JlXCIsIG51bGwsIFwiZGF0ZVwiKScpO1xuICB9KTtcbn0pO1xuIl19