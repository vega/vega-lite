"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var project_1 = require("./project");
var toggle_1 = require("./toggle");
var translate_1 = require("./translate");
var zoom_1 = require("./zoom");
var scales_1 = require("./scales");
var inputs_1 = require("./inputs");
var nearest_1 = require("./nearest");
var compilers = { project: project_1.default, toggle: toggle_1.default, scales: scales_1.default,
    translate: translate_1.default, zoom: zoom_1.default, inputs: inputs_1.default, nearest: nearest_1.default };
function forEachTransform(selCmpt, cb) {
    for (var t in compilers) {
        if (compilers[t].has(selCmpt)) {
            cb(compilers[t]);
        }
    }
}
exports.forEachTransform = forEachTransform;
//# sourceMappingURL=transforms.js.map