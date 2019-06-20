"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var inputs_1 = tslib_1.__importDefault(require("./inputs"));
var nearest_1 = tslib_1.__importDefault(require("./nearest"));
var project_1 = tslib_1.__importDefault(require("./project"));
var scales_1 = tslib_1.__importDefault(require("./scales"));
var toggle_1 = tslib_1.__importDefault(require("./toggle"));
var translate_1 = tslib_1.__importDefault(require("./translate"));
var zoom_1 = tslib_1.__importDefault(require("./zoom"));
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