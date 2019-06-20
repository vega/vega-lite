"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/scale/assemble");
var util_1 = require("../../util");
describe('Selection + Scales', function () {
    it('assembles domainRaw from selection parameter', function () {
        var model = util_1.parseConcatModel({
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
        var scales = assemble_1.assembleScalesForModel(model.children[1]);
        var xscale = scales[0];
        var yscale = scales[1];
        var cscale = scales[2];
        var oscale = scales[3];
        chai_1.assert.isObject(xscale.domain);
        chai_1.assert.property(xscale, 'domainRaw');
        chai_1.assert.propertyVal(xscale.domainRaw, 'signal', "vlIntervalDomain(\"brush_store\", \"x\", null)");
        chai_1.assert.isObject(yscale.domain);
        chai_1.assert.property(yscale, 'domainRaw');
        chai_1.assert.deepPropertyVal(yscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        chai_1.assert.isObject(cscale.domain);
        chai_1.assert.property(cscale, 'domainRaw');
        chai_1.assert.propertyVal(cscale.domainRaw, 'signal', "vlMultiDomain(\"brush2_store\", null, \"price\", \"intersect\")");
        chai_1.assert.isObject(oscale.domain);
        chai_1.assert.property(oscale, 'domainRaw');
        chai_1.assert.propertyVal(oscale.domainRaw, 'signal', 'null');
    });
    it('should bind both scales in diagonal repeated views', function () {
        var model = util_1.parseRepeatModel({
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
        var scales = assemble_1.assembleScalesForModel(model.children[3]);
        chai_1.assert.isTrue(scales.length === 2);
        chai_1.assert.property(scales[0], 'domainRaw');
        chai_1.assert.property(scales[1], 'domainRaw');
        chai_1.assert.propertyVal(scales[0].domainRaw, 'signal', 'grid_Acceleration');
        chai_1.assert.propertyVal(scales[1].domainRaw, 'signal', 'grid_Acceleration');
    });
    it('should merge domainRaw for layered views', function () {
        var model = util_1.parseConcatModel({
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
        var scales = assemble_1.assembleScalesForModel(model.children[0]);
        chai_1.assert.property(scales[0], 'domainRaw');
        chai_1.assert.propertyVal(scales[0].domainRaw, 'signal', 'vlIntervalDomain("brush_store", null, "date")');
    });
});
//# sourceMappingURL=scales.test.js.map