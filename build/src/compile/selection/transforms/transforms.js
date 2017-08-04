"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inputs_1 = require("./inputs");
var nearest_1 = require("./nearest");
var project_1 = require("./project");
var scales_1 = require("./scales");
var toggle_1 = require("./toggle");
var translate_1 = require("./translate");
var zoom_1 = require("./zoom");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3RyYW5zZm9ybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsbUNBQThCO0FBQzlCLHFDQUFnQztBQUNoQyxxQ0FBZ0M7QUFDaEMsbUNBQThCO0FBQzlCLG1DQUE4QjtBQUM5Qix5Q0FBb0M7QUFDcEMsK0JBQTBCO0FBQzFCLElBQU0sU0FBUyxHQUE0QixFQUFDLE9BQU8sbUJBQUEsRUFBRSxNQUFNLGtCQUFBLEVBQUUsTUFBTSxrQkFBQTtJQUNqRSxTQUFTLHFCQUFBLEVBQUUsSUFBSSxnQkFBQSxFQUFFLE1BQU0sa0JBQUEsRUFBRSxPQUFPLG1CQUFBLEVBQUMsQ0FBQztBQUVwQywwQkFBaUMsT0FBMkIsRUFBRSxFQUFtQztJQUMvRixHQUFHLENBQUMsQ0FBQyxJQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFORCw0Q0FNQyJ9