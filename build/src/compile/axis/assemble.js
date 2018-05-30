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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUVsQyxtQ0FBMEQ7QUFFMUQsMkNBQW9FO0FBQ3BFLG1DQUFnQztBQUloQyx1QkFBdUIsS0FBc0MsRUFBRSxNQUFjO0lBQzNFLElBQUksbUJBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxnQkFBYSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxRTtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELHNCQUNFLFFBQXVCLEVBQ3ZCLElBQXFCLEVBQ3JCLE1BQWMsRUFDZCxHQUVtQjtJQUZuQixvQkFBQSxFQUFBLFFBRUssTUFBTSxFQUFFLEtBQUssRUFBQztJQUVuQixJQUFNLHVCQUE0RCxFQUEzRCxrQkFBTSxFQUFFLGdCQUFLLEVBQUUsZ0JBQUssRUFBRSxrQkFBTSxFQUFFLGlFQUE2QixDQUFDO0lBRW5FLDZEQUE2RDtJQUM3RCxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztRQUNyQixJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7WUFDeEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNkLE9BQU8sU0FB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RUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQS9CLENBQStCLENBQUMsRUFDOUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO0FBQ3ZDLENBQUM7QUFSRCxvQ0FRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHtBWElTX1BBUlRTLCBBWElTX1BST1BFUlRZX1RZUEV9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmQmFzZSwgdGl0bGUgYXMgZmllbGREZWZUaXRsZX0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdBeGlzfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0F4aXNDb21wb25lbnQsIEF4aXNDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZVRpdGxlKHRpdGxlOiBzdHJpbmcgfCBGaWVsZERlZkJhc2U8c3RyaW5nPltdLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoaXNBcnJheSh0aXRsZSkpIHtcbiAgICByZXR1cm4gdGl0bGUubWFwKGZpZWxkRGVmID0+IGZpZWxkRGVmVGl0bGUoZmllbGREZWYsIGNvbmZpZykpLmpvaW4oJywgJyk7XG4gIH1cbiAgcmV0dXJuIHRpdGxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVBeGlzKFxuICBheGlzQ21wdDogQXhpc0NvbXBvbmVudCxcbiAga2luZDogJ21haW4nIHwgJ2dyaWQnLFxuICBjb25maWc6IENvbmZpZyxcbiAgb3B0OiB7XG4gICAgaGVhZGVyOiBib29sZWFuIC8vIHdoZXRoZXIgdGhpcyBpcyBjYWxsZWQgdmlhIGEgaGVhZGVyXG4gIH0gPSB7aGVhZGVyOiBmYWxzZX1cbik6IFZnQXhpcyB7XG4gIGNvbnN0IHtvcmllbnQsIHNjYWxlLCB0aXRsZSwgemluZGV4LCAuLi5heGlzfSA9IGF4aXNDbXB0LmNvbWJpbmUoKTtcblxuICAvLyBSZW1vdmUgcHJvcGVydGllcyB0aGF0IGFyZSBub3QgdmFsaWQgZm9yIHRoaXMga2luZCBvZiBheGlzXG4gIGtleXMoYXhpcykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgY29uc3QgcHJvcFR5cGUgPSBBWElTX1BST1BFUlRZX1RZUEVba2V5XTtcbiAgICBpZiAocHJvcFR5cGUgJiYgcHJvcFR5cGUgIT09IGtpbmQgJiYgcHJvcFR5cGUgIT09ICdib3RoJykge1xuICAgICAgZGVsZXRlIGF4aXNba2V5XTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChraW5kID09PSAnZ3JpZCcpIHtcbiAgICBpZiAoIWF4aXMuZ3JpZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdW5uZWNlc3NhcnkgZW5jb2RlIGJsb2NrXG4gICAgaWYgKGF4aXMuZW5jb2RlKSB7XG4gICAgICAvLyBPbmx5IG5lZWQgdG8ga2VlcCBlbmNvZGUgYmxvY2sgZm9yIGdyaWRcbiAgICAgIGNvbnN0IHtncmlkfSA9IGF4aXMuZW5jb2RlO1xuICAgICAgYXhpcy5lbmNvZGUgPSB7XG4gICAgICAgIC4uLihncmlkID8ge2dyaWR9IDoge30pXG4gICAgICB9O1xuXG4gICAgICBpZiAoa2V5cyhheGlzLmVuY29kZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBheGlzLmVuY29kZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NhbGUsXG4gICAgICBvcmllbnQsXG4gICAgICAuLi5heGlzLFxuICAgICAgZG9tYWluOiBmYWxzZSxcbiAgICAgIGxhYmVsczogZmFsc2UsXG5cbiAgICAgIC8vIEFsd2F5cyBzZXQgbWluL21heEV4dGVudCB0byAwIHRvIGVuc3VyZSB0aGF0IGBjb25maWcuYXhpcyoubWluRXh0ZW50YCBhbmQgYGNvbmZpZy5heGlzKi5tYXhFeHRlbnRgXG4gICAgICAvLyB3b3VsZCBub3QgYWZmZWN0IGdyaWRBeGlzXG4gICAgICBtYXhFeHRlbnQ6IDAsXG4gICAgICBtaW5FeHRlbnQ6IDAsXG4gICAgICB0aWNrczogZmFsc2UsXG4gICAgICB6aW5kZXg6IHppbmRleCAhPT0gdW5kZWZpbmVkID8gemluZGV4IDogMCAvLyBwdXQgZ3JpZCBiZWhpbmQgbWFya3MgYnkgZGVmYXVsdFxuICAgIH07XG4gIH0gZWxzZSB7IC8vIGtpbmQgPT09ICdtYWluJ1xuXG4gICAgaWYgKCFvcHQuaGVhZGVyICYmIGF4aXNDbXB0Lm1haW5FeHRyYWN0ZWQpIHtcbiAgICAgIC8vIGlmIG1haW5FeHRyYWN0ZWQgaGFzIGJlZW4gZXh0cmFjdGVkIHRvIGEgc2VwYXJhdGUgZmFjZXRcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IGVuY29kZSBibG9ja1xuICAgIGlmIChheGlzLmVuY29kZSkge1xuICAgICAgZm9yIChjb25zdCBwYXJ0IG9mIEFYSVNfUEFSVFMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFheGlzQ21wdC5oYXNBeGlzUGFydChwYXJ0KVxuICAgICAgICApIHtcbiAgICAgICAgICBkZWxldGUgYXhpcy5lbmNvZGVbcGFydF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChrZXlzKGF4aXMuZW5jb2RlKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIGF4aXMuZW5jb2RlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlU3RyaW5nID0gYXNzZW1ibGVUaXRsZSh0aXRsZSwgY29uZmlnKTtcblxuICAgIHJldHVybiB7XG4gICAgICBzY2FsZSxcbiAgICAgIG9yaWVudCxcbiAgICAgIGdyaWQ6IGZhbHNlLFxuICAgICAgLi4uKHRpdGxlU3RyaW5nID8ge3RpdGxlOiB0aXRsZVN0cmluZ30gOiB7fSksXG4gICAgICAuLi5heGlzLFxuICAgICAgemluZGV4OiB6aW5kZXggIT09IHVuZGVmaW5lZCA/IHppbmRleCA6IDEgLy8gcHV0IGF4aXMgbGluZSBhYm92ZSBtYXJrcyBieSBkZWZhdWx0XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVBeGVzKGF4aXNDb21wb25lbnRzOiBBeGlzQ29tcG9uZW50SW5kZXgsIGNvbmZpZzogQ29uZmlnKTogVmdBeGlzW10ge1xuICBjb25zdCB7eD1bXSwgeT1bXX0gPSBheGlzQ29tcG9uZW50cztcbiAgcmV0dXJuIFtcbiAgICAuLi54Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnbWFpbicsIGNvbmZpZykpLFxuICAgIC4uLngubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdncmlkJywgY29uZmlnKSksXG4gICAgLi4ueS5tYXAoYSA9PiBhc3NlbWJsZUF4aXMoYSwgJ21haW4nLCBjb25maWcpKSxcbiAgICAuLi55Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnZ3JpZCcsIGNvbmZpZykpXG4gIF0uZmlsdGVyKGEgPT4gYSk7IC8vIGZpbHRlciB1bmRlZmluZWRcbn1cbiJdfQ==