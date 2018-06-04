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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUVsQyxtQ0FBMEQ7QUFFMUQsMkNBQW9FO0FBQ3BFLG1DQUFnQztBQUloQyx1QkFBdUIsS0FBc0MsRUFBRSxNQUFjO0lBQzNFLElBQUksbUJBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxnQkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxRTtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELHNCQUNFLFFBQXVCLEVBQ3ZCLElBQXFCLEVBQ3JCLE1BQWMsRUFDZCxHQUVtQjtJQUZuQixvQkFBQSxFQUFBLFFBRUssTUFBTSxFQUFFLEtBQUssRUFBQztJQUVuQixJQUFNLHVCQUE0RCxFQUEzRCxrQkFBTSxFQUFFLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSxrQkFBTSxFQUFFLGlFQUE2QixDQUFDO0lBRW5FLDZEQUE2RDtJQUM3RCxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztRQUNyQixJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7WUFDeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE9BQU8sU0FB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Q0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxFQUM5QyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7QUFDdkMsQ0FBQztBQVJELG9DQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuXG5pbXBvcnQge0FYSVNfUEFSVFMsIEFYSVNfUFJPUEVSVFlfVFlQRX0gZnJvbSAnLi4vLi4vYXhpcyc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7RmllbGREZWZCYXNlLCB0aXRsZSBhcyBmaWVsZERlZlRpdGxlfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0F4aXN9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QXhpc0NvbXBvbmVudCwgQXhpc0NvbXBvbmVudEluZGV4fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlVGl0bGUodGl0bGU6IHN0cmluZyB8IEZpZWxkRGVmQmFzZTxzdHJpbmc+W10sIGNvbmZpZzogQ29uZmlnKSB7XG4gIGlmIChpc0FycmF5KHRpdGxlKSkge1xuICAgIHJldHVybiB0aXRsZS5tYXAoZmllbGREZWYgPT4gZmllbGREZWZUaXRsZShmaWVsZERlZiwgY29uZmlnKSkuam9pbignLCAnKTtcbiAgfVxuICByZXR1cm4gdGl0bGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUF4aXMoXG4gIGF4aXNDbXB0OiBBeGlzQ29tcG9uZW50LFxuICBraW5kOiAnbWFpbicgfCAnZ3JpZCcsXG4gIGNvbmZpZzogQ29uZmlnLFxuICBvcHQ6IHtcbiAgICBoZWFkZXI6IGJvb2xlYW4gLy8gd2hldGhlciB0aGlzIGlzIGNhbGxlZCB2aWEgYSBoZWFkZXJcbiAgfSA9IHtoZWFkZXI6IGZhbHNlfVxuKTogVmdBeGlzIHtcbiAgY29uc3Qge29yaWVudCwgc2NhbGUsIHRpdGxlLCB6aW5kZXgsIC4uLmF4aXN9ID0gYXhpc0NtcHQuY29tYmluZSgpO1xuXG4gIC8vIFJlbW92ZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCB2YWxpZCBmb3IgdGhpcyBraW5kIG9mIGF4aXNcbiAga2V5cyhheGlzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCBwcm9wVHlwZSA9IEFYSVNfUFJPUEVSVFlfVFlQRVtrZXldO1xuICAgIGlmIChwcm9wVHlwZSAmJiBwcm9wVHlwZSAhPT0ga2luZCAmJiBwcm9wVHlwZSAhPT0gJ2JvdGgnKSB7XG4gICAgICBkZWxldGUgYXhpc1trZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGtpbmQgPT09ICdncmlkJykge1xuICAgIGlmICghYXhpcy5ncmlkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSBlbmNvZGUgYmxvY2tcbiAgICBpZiAoYXhpcy5lbmNvZGUpIHtcbiAgICAgIC8vIE9ubHkgbmVlZCB0byBrZWVwIGVuY29kZSBibG9jayBmb3IgZ3JpZFxuICAgICAgY29uc3Qge2dyaWR9ID0gYXhpcy5lbmNvZGU7XG4gICAgICBheGlzLmVuY29kZSA9IHtcbiAgICAgICAgLi4uKGdyaWQgPyB7Z3JpZH0gOiB7fSlcbiAgICAgIH07XG5cbiAgICAgIGlmIChrZXlzKGF4aXMuZW5jb2RlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGF4aXMuZW5jb2RlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzY2FsZSxcbiAgICAgIG9yaWVudCxcbiAgICAgIC4uLmF4aXMsXG4gICAgICBkb21haW46IGZhbHNlLFxuICAgICAgbGFiZWxzOiBmYWxzZSxcblxuICAgICAgLy8gQWx3YXlzIHNldCBtaW4vbWF4RXh0ZW50IHRvIDAgdG8gZW5zdXJlIHRoYXQgYGNvbmZpZy5heGlzKi5taW5FeHRlbnRgIGFuZCBgY29uZmlnLmF4aXMqLm1heEV4dGVudGBcbiAgICAgIC8vIHdvdWxkIG5vdCBhZmZlY3QgZ3JpZEF4aXNcbiAgICAgIG1heEV4dGVudDogMCxcbiAgICAgIG1pbkV4dGVudDogMCxcbiAgICAgIHRpY2tzOiBmYWxzZSxcbiAgICAgIHppbmRleDogemluZGV4ICE9PSB1bmRlZmluZWQgPyB6aW5kZXggOiAwIC8vIHB1dCBncmlkIGJlaGluZCBtYXJrcyBieSBkZWZhdWx0XG4gICAgfTtcbiAgfSBlbHNlIHsgLy8ga2luZCA9PT0gJ21haW4nXG5cbiAgICBpZiAoIW9wdC5oZWFkZXIgJiYgYXhpc0NtcHQubWFpbkV4dHJhY3RlZCkge1xuICAgICAgLy8gaWYgbWFpbkV4dHJhY3RlZCBoYXMgYmVlbiBleHRyYWN0ZWQgdG8gYSBzZXBhcmF0ZSBmYWNldFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdW5uZWNlc3NhcnkgZW5jb2RlIGJsb2NrXG4gICAgaWYgKGF4aXMuZW5jb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgQVhJU19QQVJUUykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWF4aXNDbXB0Lmhhc0F4aXNQYXJ0KHBhcnQpXG4gICAgICAgICkge1xuICAgICAgICAgIGRlbGV0ZSBheGlzLmVuY29kZVtwYXJ0XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGtleXMoYXhpcy5lbmNvZGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYXhpcy5lbmNvZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGVTdHJpbmcgPSBhc3NlbWJsZVRpdGxlKHRpdGxlLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlLFxuICAgICAgb3JpZW50LFxuICAgICAgZ3JpZDogZmFsc2UsXG4gICAgICAuLi4odGl0bGVTdHJpbmcgPyB7dGl0bGU6IHRpdGxlU3RyaW5nfSA6IHt9KSxcbiAgICAgIC4uLmF4aXMsXG4gICAgICB6aW5kZXg6IHppbmRleCAhPT0gdW5kZWZpbmVkID8gemluZGV4IDogMSAvLyBwdXQgYXhpcyBsaW5lIGFib3ZlIG1hcmtzIGJ5IGRlZmF1bHRcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUF4ZXMoYXhpc0NvbXBvbmVudHM6IEF4aXNDb21wb25lbnRJbmRleCwgY29uZmlnOiBDb25maWcpOiBWZ0F4aXNbXSB7XG4gIGNvbnN0IHt4PVtdLCB5PVtdfSA9IGF4aXNDb21wb25lbnRzO1xuICByZXR1cm4gW1xuICAgIC4uLngubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdtYWluJywgY29uZmlnKSksXG4gICAgLi4ueC5tYXAoYSA9PiBhc3NlbWJsZUF4aXMoYSwgJ2dyaWQnLCBjb25maWcpKSxcbiAgICAuLi55Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnbWFpbicsIGNvbmZpZykpLFxuICAgIC4uLnkubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdncmlkJywgY29uZmlnKSlcbiAgXS5maWx0ZXIoYSA9PiBhKTsgLy8gZmlsdGVyIHVuZGVmaW5lZFxufVxuIl19