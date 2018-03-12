"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var axis_1 = require("../../axis");
var fielddef_1 = require("../../fielddef");
var util_2 = require("../../util");
function assembleTitle(title, config) {
    if (util_1.isArray(title)) {
        return title.map(function (fieldDef) { return fielddef_1.title(fieldDef, config); }).join(', ');
    }
    return title;
}
function assembleAxis(axisCmpt, kind, config, opt) {
    if (opt === void 0) { opt = { header: false }; }
    var _a = axisCmpt.combine(), orient = _a.orient, scale = _a.scale, title = _a.title, axis = __rest(_a, ["orient", "scale", "title"]);
    // Remove properties that are not valid for this kind of axis
    util_2.keys(axis).forEach(function (key) {
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
            axis.encode = __assign({}, (grid ? { grid: grid } : {}));
            if (util_2.keys(axis.encode).length === 0) {
                delete axis.encode;
            }
        }
        return __assign({ scale: scale,
            orient: orient }, axis, { domain: false, labels: false, 
            // Always set min/maxExtent to 0 to ensure that `config.axis*.minExtent` and `config.axis*.maxExtent`
            // would not affect gridAxis
            maxExtent: 0, minExtent: 0, ticks: false, zindex: 0 // put grid behind marks
         });
    }
    else {
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
            if (util_2.keys(axis.encode).length === 0) {
                delete axis.encode;
            }
        }
        var titleString = assembleTitle(title, config);
        return __assign({ scale: scale,
            orient: orient }, (titleString ? { title: titleString } : {}), axis, { zindex: 1 });
    }
}
exports.assembleAxis = assembleAxis;
function assembleAxes(axisComponents, config) {
    var _a = axisComponents.x, x = _a === void 0 ? [] : _a, _b = axisComponents.y, y = _b === void 0 ? [] : _b;
    return x.map(function (a) { return assembleAxis(a, 'main', config); }).concat(x.map(function (a) { return assembleAxis(a, 'grid', config); }), y.map(function (a) { return assembleAxis(a, 'main', config); }), y.map(function (a) { return assembleAxis(a, 'grid', config); })).filter(function (a) { return a; }); // filter undefined
}
exports.assembleAxes = assembleAxes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2QkFBNkI7QUFDN0IsbUNBQTBEO0FBRTFELDJDQUFvRTtBQUNwRSxtQ0FBZ0M7QUFJaEMsdUJBQXVCLEtBQXNDLEVBQUUsTUFBYztJQUMzRSxFQUFFLENBQUMsQ0FBQyxjQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsZ0JBQWEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQS9CLENBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsc0JBQ0UsUUFBdUIsRUFDdkIsSUFBcUIsRUFDckIsTUFBYyxFQUNkLEdBRW1CO0lBRm5CLG9CQUFBLEVBQUEsUUFFSyxNQUFNLEVBQUUsS0FBSyxFQUFDO0lBRW5CLElBQU0sdUJBQW9ELEVBQW5ELGtCQUFNLEVBQUUsZ0JBQUssRUFBRSxnQkFBSyxFQUFFLCtDQUE2QixDQUFDO0lBRTNELDZEQUE2RDtJQUM3RCxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztRQUNyQixJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMs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K0IsQ0FBQyxFQUMzQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsWUFBWSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQS9CLENBQStCLENBQUMsRUFDM0MsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLFlBQVksQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUEvQixDQUErQixDQUFDLEVBQzlDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQjtBQUN2QyxDQUFDO0FBUkQsb0NBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtBWElTX1BBUlRTLCBBWElTX1BST1BFUlRZX1RZUEV9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge0ZpZWxkRGVmQmFzZSwgdGl0bGUgYXMgZmllbGREZWZUaXRsZX0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdBeGlzfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0F4aXNDb21wb25lbnQsIEF4aXNDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5mdW5jdGlvbiBhc3NlbWJsZVRpdGxlKHRpdGxlOiBzdHJpbmcgfCBGaWVsZERlZkJhc2U8c3RyaW5nPltdLCBjb25maWc6IENvbmZpZykge1xuICBpZiAoaXNBcnJheSh0aXRsZSkpIHtcbiAgICByZXR1cm4gdGl0bGUubWFwKGZpZWxkRGVmID0+IGZpZWxkRGVmVGl0bGUoZmllbGREZWYsIGNvbmZpZykpLmpvaW4oJywgJyk7XG4gIH1cbiAgcmV0dXJuIHRpdGxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVBeGlzKFxuICBheGlzQ21wdDogQXhpc0NvbXBvbmVudCxcbiAga2luZDogJ21haW4nIHwgJ2dyaWQnLFxuICBjb25maWc6IENvbmZpZyxcbiAgb3B0OiB7XG4gICAgaGVhZGVyOiBib29sZWFuIC8vIHdoZXRoZXIgdGhpcyBpcyBjYWxsZWQgdmlhIGEgaGVhZGVyXG4gIH0gPSB7aGVhZGVyOiBmYWxzZX1cbik6IFZnQXhpcyB7XG4gIGNvbnN0IHtvcmllbnQsIHNjYWxlLCB0aXRsZSwgLi4uYXhpc30gPSBheGlzQ21wdC5jb21iaW5lKCk7XG5cbiAgLy8gUmVtb3ZlIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IHZhbGlkIGZvciB0aGlzIGtpbmQgb2YgYXhpc1xuICBrZXlzKGF4aXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IHByb3BUeXBlID0gQVhJU19QUk9QRVJUWV9UWVBFW2tleV07XG4gICAgaWYgKHByb3BUeXBlICYmIHByb3BUeXBlICE9PSBraW5kICYmIHByb3BUeXBlICE9PSAnYm90aCcpIHtcbiAgICAgIGRlbGV0ZSBheGlzW2tleV07XG4gICAgfVxuICB9KTtcblxuICBpZiAoa2luZCA9PT0gJ2dyaWQnKSB7XG4gICAgaWYgKCFheGlzLmdyaWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHVubmVjZXNzYXJ5IGVuY29kZSBibG9ja1xuICAgIGlmIChheGlzLmVuY29kZSkge1xuICAgICAgLy8gT25seSBuZWVkIHRvIGtlZXAgZW5jb2RlIGJsb2NrIGZvciBncmlkXG4gICAgICBjb25zdCB7Z3JpZH0gPSBheGlzLmVuY29kZTtcbiAgICAgIGF4aXMuZW5jb2RlID0ge1xuICAgICAgICAuLi4oZ3JpZCA/IHtncmlkfSA6IHt9KVxuICAgICAgfTtcblxuICAgICAgaWYgKGtleXMoYXhpcy5lbmNvZGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYXhpcy5lbmNvZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlLFxuICAgICAgb3JpZW50LFxuICAgICAgLi4uYXhpcyxcbiAgICAgIGRvbWFpbjogZmFsc2UsXG4gICAgICBsYWJlbHM6IGZhbHNlLFxuXG4gICAgICAvLyBBbHdheXMgc2V0IG1pbi9tYXhFeHRlbnQgdG8gMCB0byBlbnN1cmUgdGhhdCBgY29uZmlnLmF4aXMqLm1pbkV4dGVudGAgYW5kIGBjb25maWcuYXhpcyoubWF4RXh0ZW50YFxuICAgICAgLy8gd291bGQgbm90IGFmZmVjdCBncmlkQXhpc1xuICAgICAgbWF4RXh0ZW50OiAwLFxuICAgICAgbWluRXh0ZW50OiAwLFxuICAgICAgdGlja3M6IGZhbHNlLFxuXG4gICAgICB6aW5kZXg6IDAgLy8gcHV0IGdyaWQgYmVoaW5kIG1hcmtzXG4gICAgfTtcbiAgfSBlbHNlIHsgLy8ga2luZCA9PT0gJ21haW4nXG5cbiAgICBpZiAoIW9wdC5oZWFkZXIgJiYgYXhpc0NtcHQubWFpbkV4dHJhY3RlZCkge1xuICAgICAgLy8gaWYgbWFpbkV4dHJhY3RlZCBoYXMgYmVlbiBleHRyYWN0ZWQgdG8gYSBzZXBhcmF0ZSBmYWNldFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdW5uZWNlc3NhcnkgZW5jb2RlIGJsb2NrXG4gICAgaWYgKGF4aXMuZW5jb2RlKSB7XG4gICAgICBmb3IgKGNvbnN0IHBhcnQgb2YgQVhJU19QQVJUUykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIWF4aXNDbXB0Lmhhc0F4aXNQYXJ0KHBhcnQpXG4gICAgICAgICkge1xuICAgICAgICAgIGRlbGV0ZSBheGlzLmVuY29kZVtwYXJ0XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGtleXMoYXhpcy5lbmNvZGUpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYXhpcy5lbmNvZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGVTdHJpbmcgPSBhc3NlbWJsZVRpdGxlKHRpdGxlLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNjYWxlLFxuICAgICAgb3JpZW50LFxuICAgICAgLi4uKHRpdGxlU3RyaW5nID8ge3RpdGxlOiB0aXRsZVN0cmluZ30gOiB7fSksXG4gICAgICAuLi5heGlzLFxuICAgICAgemluZGV4OiAxXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVBeGVzKGF4aXNDb21wb25lbnRzOiBBeGlzQ29tcG9uZW50SW5kZXgsIGNvbmZpZzogQ29uZmlnKTogVmdBeGlzW10ge1xuICBjb25zdCB7eD1bXSwgeT1bXX0gPSBheGlzQ29tcG9uZW50cztcbiAgcmV0dXJuIFtcbiAgICAuLi54Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnbWFpbicsIGNvbmZpZykpLFxuICAgIC4uLngubWFwKGEgPT4gYXNzZW1ibGVBeGlzKGEsICdncmlkJywgY29uZmlnKSksXG4gICAgLi4ueS5tYXAoYSA9PiBhc3NlbWJsZUF4aXMoYSwgJ21haW4nLCBjb25maWcpKSxcbiAgICAuLi55Lm1hcChhID0+IGFzc2VtYmxlQXhpcyhhLCAnZ3JpZCcsIGNvbmZpZykpXG4gIF0uZmlsdGVyKGEgPT4gYSk7IC8vIGZpbHRlciB1bmRlZmluZWRcbn1cbiJdfQ==