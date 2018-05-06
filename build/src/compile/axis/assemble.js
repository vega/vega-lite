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
            orient: orient }, (titleString ? { title: titleString } : {}), axis, { zindex: zindex !== undefined ? zindex : 1 // put axis line above marks by default
         });
    }
}
exports.assembleAxis = assembleAxis;
function assembleAxes(axisComponents, config) {
    var _a = axisComponents.x, x = _a === void 0 ? [] : _a, _b = axisComponents.y, y = _b === void 0 ? [] : _b;
    return x.map(function (a) { return assembleAxis(a, 'main', config); }).concat(x.map(function (a) { return assembleAxis(a, 'grid', config); }), y.map(function (a) { return assembleAxis(a, 'main', config); }), y.map(function (a) { return assembleAxis(a, 'grid', config); })).filter(function (a) { return a; }); // filter undefined
}
exports.assembleAxes = assembleAxes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUVsQyxtQ0FBMEQ7QUFFMUQsMkNBQW9FO0FBQ3BFLG1DQUFnQztBQUloQyx1QkFBdUIsS0FBc0MsRUFBRSxNQUFjO0lBQzNFLElBQUksbUJBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxnQkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxRTtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELHNCQUNFLFFBQXVCLEVBQ3ZCLElBQXFCLEVBQ3JCLE1BQWMsRUFDZCxHQUVtQjtJQUZuQixvQkFBQSxFQUFBLFFBRUssTUFBTSxFQUFFLEtBQUssRUFBQztJQUVuQixJQUFNLHVCQUE0RCxFQUEzRCxrQkFBTSxFQUFFLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSxrQkFBTSxFQUFFLGlFQUE2QixDQUFDO0lBRW5FLDZEQUE2RDtJQUM3RCxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztRQUNyQixJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7WUFDeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE9BQU8sU0FB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Q0FBQyxFQUEvQixDQUErQixDQUFDLEVBQzlDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtBQUN2QyxDQUFDO0FBUkQsb0NBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5cbmltcG9ydCB7QVhJU19QQVJUUywgQVhJU19QUk9QRVJUWV9UWVBFfSBmcm9tICcuLi8uLi9heGlzJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtGaWVsZERlZkJhc2UsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGV9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7a2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQXhpc30gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtBeGlzQ29tcG9uZW50LCBBeGlzQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcblxuZnVuY3Rpb24gYXNzZW1ibGVUaXRsZSh0aXRsZTogc3RyaW5nIHwgRmllbGREZWZCYXNlPHN0cmluZz5bXSwgY29uZmlnOiBDb25maWcpIHtcbiAgaWYgKGlzQXJyYXkodGl0bGUpKSB7XG4gICAgcmV0dXJuIHRpdGxlLm1hcChmaWVsZERlZiA9PiBmaWVsZERlZlRpdGxlKGZpZWxkRGVmLCBjb25maWcpKS5qb2luKCcsICcpO1xuICB9XG4gIHJldHVybiB0aXRsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlQXhpcyhcbiAgYXhpc0NtcHQ6IEF4aXNDb21wb25lbnQsXG4gIGtpbmQ6ICdtYWluJyB8ICdncmlkJyxcbiAgY29uZmlnOiBDb25maWcsXG4gIG9wdDoge1xuICAgIGhlYWRlcjogYm9vbGVhbiAvLyB3aGV0aGVyIHRoaXMgaXMgY2FsbGVkIHZpYSBhIGhlYWRlclxuICB9ID0ge2hlYWRlcjogZmFsc2V9XG4pOiBWZ0F4aXMge1xuICBjb25zdCB7b3JpZW50LCBzY2FsZSwgdGl0bGUsIHppbmRleCwgLi4uYXhpc30gPSBheGlzQ21wdC5jb21iaW5lKCk7XG5cbiAgLy8gUmVtb3ZlIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IHZhbGlkIGZvciB0aGlzIGtpbmQgb2YgYXhpc1xuICBrZXlzKGF4aXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IHByb3BUeXBlID0gQVhJU19QUk9QRVJUWV9UWVBFW2tleV07XG4gICAgaWYgKHByb3BUeXBlICYmIHByb3BUeXBlICE9PSBraW5kICYmIHByb3BUeXBlICE9PSAnYm90aCcpIHtcbiAgICAgIGRlbGV0ZSBheGlzW2tleV07XG4gICAgfVxuICB9KTtcblxuICBpZiAoa2luZCA9PT0gJ2dyaWQnKSB7XG4gICAgaWYgKCFheGlzLmdyaWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IGVuY29kZSBibG9ja1xuICAgIGlmIChheGlzLmVuY29kZSkge1xuICAgICAgLy8gT25seSBuZWVkIHRvIGtlZXAgZW5jb2RlIGJsb2NrIGZvciBncmlkXG4gICAgICBjb25zdCB7Z3JpZH0gPSBheGlzLmVuY29kZTtcbiAgICAgIGF4aXMuZW5jb2RlID0ge1xuICAgICAgICAuLi4oZ3JpZCA/IHtncmlkfSA6IHt9KVxuICAgICAgfTtcblxuICAgICAgaWYgKGtleXMoYXhpcy5lbmNvZGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYXhpcy5lbmNvZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlLFxuICAgICAgb3JpZW50LFxuICAgICAgLi4uYXhpcyxcbiAgICAgIGRvbWFpbjogZmFsc2UsXG4gICAgICBsYWJlbHM6IGZhbHNlLFxuXG4gICAgICAvLyBBbHdheXMgc2V0IG1pbi9tYXhFeHRlbnQgdG8gMCB0byBlbnN1cmUgdGhhdCBgY29uZmlnLmF4aXMqLm1pbkV4dGVudGAgYW5kIGBjb25maWcuYXhpcyoubWF4RXh0ZW50YFxuICAgICAgLy8gd291bGQgbm90IGFmZmVjdCBncmlkQXhpc1xuICAgICAgbWF4RXh0ZW50OiAwLFxuICAgICAgbWluRXh0ZW50OiAwLFxuICAgICAgdGlja3M6IGZhbHNlLFxuICAgICAgemluZGV4OiB6aW5kZXggIT09IHVuZGVmaW5lZCA/IHppbmRleCA6IDAgLy8gcHV0IGdyaWQgYmVoaW5kIG1hcmtzIGJ5IGRlZmF1bHRcbiAgICB9O1xuICB9IGVsc2UgeyAvLyBraW5kID09PSAnbWFpbidcblxuICAgIGlmICghb3B0LmhlYWRlciAmJiBheGlzQ21wdC5tYWluRXh0cmFjdGVkKSB7XG4gICAgICAvLyBpZiBtYWluRXh0cmFjdGVkIGhhcyBiZWVuIGV4dHJhY3RlZCB0byBhIHNlcGFyYXRlIGZhY2V0XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSBlbmNvZGUgYmxvY2tcbiAgICBpZiAoYXhpcy5lbmNvZGUpIHtcbiAgICAgIGZvciAoY29uc3QgcGFydCBvZiBBWElTX1BBUlRTKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhYXhpc0NtcHQuaGFzQXhpc1BhcnQocGFydClcbiAgICAgICAgKSB7XG4gICAgICAgICAgZGVsZXRlIGF4aXMuZW5jb2RlW3BhcnRdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoa2V5cyhheGlzLmVuY29kZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBheGlzLmVuY29kZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZVN0cmluZyA9IGFzc2VtYmxlVGl0bGUodGl0bGUsIGNvbmZpZyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGUsXG4gICAgICBvcmllbnQsXG4gICAgICAuLi4odGl0bGVTdHJpbmcgPyB7dGl0bGU6IHRpdGxlU3RyaW5nfSA6IHt9KSxcbiAgICAgIC4uLmF4aXMsXG4gICAgICB6aW5kZXg6IHppbmRleCAhPT0gdW5kZWZpbmVkID8gemluZGV4IDogMSAvLyBwdXQgYXhpcyBsaW5lIGFib3ZlIG1hcmtzIGJ5IGRlZmF1bHRcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUF4ZXMoYXhpc0NvbXBvbmVudHM6IEF4aXNDb21wb25lbnRJbmRleCwgY29uZmlnOiBDb25maWcpOiBWZ0F4aXNbXSB7XG4gIGNvbnN0IHt4PVtdLCB5PVtdfSA9IGF4aXNDb21wb25lbnRzO1xuICByZXR1cm4gW1xuICAgIC4uLngubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdtYWluJywgY29uZmlnKSksXG4gICAgLi4ueC5tYXAoYSA9PiBhc3NlbWJsZUF4aXMoYSwgJ2dyaWQnLCBjb25maWcpKSxcbiAgICAuLi55Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnbWFpbicsIGNvbmZpZykpLFxuICAgIC4uLnkubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdncmlkJywgY29uZmlnKSlcbiAgXS5maWx0ZXIoYSA9PiBhKTsgLy8gZmlsdGVyIHVuZGVmaW5lZFxufVxuIl19