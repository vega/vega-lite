"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var axis_1 = require("../../axis");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
function assembleTitle(title, config) {
    if (vega_util_1.isArray(title)) {
        return title.map(function (fieldDef) { return fielddef_1.title(fieldDef, config); }).join(', ');
    }
    return title;
}
function assembleAxis(axisCmpt, kind, config, opt) {
    if (opt === void 0) { opt = { header: false }; }
    var _a = axisCmpt.combine(), orient = _a.orient, scale = _a.scale, title = _a.title, zindex = _a.zindex, axis = tslib_1.__rest(_a, ["orient", "scale", "title", "zindex"]);
    // Remove properties that are not valid for this kind of axis
    util_1.keys(axis).forEach(function (key) {
        var propType = axis_1.AXIS_PROPERTY_TYPE[key];
        if (propType && propType !== kind && propType !== 'both') {
            delete axis[key];
        }
    });
    if (kind === 'grid') {
        if (!axis.grid) {
            return undefined;
        }
        // Remove unnecessary encode block
        if (axis.encode) {
            // Only need to keep encode block for grid
            var grid = axis.encode.grid;
            axis.encode = tslib_1.__assign({}, (grid ? { grid: grid } : {}));
            if (util_1.keys(axis.encode).length === 0) {
                delete axis.encode;
            }
        }
        return tslib_1.__assign({ scale: scale,
            orient: orient }, axis, { domain: false, labels: false, 
            // Always set min/maxExtent to 0 to ensure that `config.axis*.minExtent` and `config.axis*.maxExtent`
            // would not affect gridAxis
            maxExtent: 0, minExtent: 0, ticks: false, zindex: zindex !== undefined ? zindex : 0 // put grid behind marks by default
         });
    }
    else { // kind === 'main'
        if (!opt.header && axisCmpt.mainExtracted) {
            // if mainExtracted has been extracted to a separate facet
            return undefined;
        }
        // Remove unnecessary encode block
        if (axis.encode) {
            for (var _i = 0, AXIS_PARTS_1 = axis_1.AXIS_PARTS; _i < AXIS_PARTS_1.length; _i++) {
                var part = AXIS_PARTS_1[_i];
                if (!axisCmpt.hasAxisPart(part)) {
                    delete axis.encode[part];
                }
            }
            if (util_1.keys(axis.encode).length === 0) {
                delete axis.encode;
            }
        }
        var titleString = assembleTitle(title, config);
        return tslib_1.__assign({ scale: scale,
            orient: orient, grid: false }, (titleString ? { title: titleString } : {}), axis, { zindex: zindex !== undefined ? zindex : 1 // put axis line above marks by default
         });
    }
}
exports.assembleAxis = assembleAxis;
function assembleAxes(axisComponents, config) {
    var _a = axisComponents.x, x = _a === void 0 ? [] : _a, _b = axisComponents.y, y = _b === void 0 ? [] : _b;
    return x.map(function (a) { return assembleAxis(a, 'main', config); }).concat(x.map(function (a) { return assembleAxis(a, 'grid', config); }), y.map(function (a) { return assembleAxis(a, 'main', config); }), y.map(function (a) { return assembleAxis(a, 'grid', config); })).filter(function (a) { return a; }); // filter undefined
}
exports.assembleAxes = assembleAxes;
//# sourceMappingURL=assemble.js.map