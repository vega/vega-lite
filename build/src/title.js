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
function extractTitleConfig(titleConfig) {
    var 
    // These are non-mark title config that need to be hardcoded
    anchor = titleConfig.anchor, offset = titleConfig.offset, orient = titleConfig.orient, 
    // color needs to be redirect to fill
    color = titleConfig.color, 
    // The rest are mark config.
    titleMarkConfig = __rest(titleConfig, ["anchor", "offset", "orient", "color"]);
    var mark = __assign({}, titleMarkConfig, color ? { fill: color } : {});
    var nonMark = __assign({}, anchor ? { anchor: anchor } : {}, offset ? { offset: offset } : {}, orient ? { orient: orient } : {});
    return { mark: mark, nonMark: nonMark };
}
exports.extractTitleConfig = extractTitleConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdDQSw0QkFBbUMsV0FBMEI7SUFNekQ7SUFEQSw0REFBNEQ7SUFDNUQsMkJBQU0sRUFBRSwyQkFBTSxFQUFFLDJCQUFNO0lBQ3RCLHFDQUFxQztJQUNyQyx5QkFBSztJQUNMLDRCQUE0QjtJQUM1Qiw4RUFBa0IsQ0FDSjtJQUVoQixJQUFNLElBQUksZ0JBQ0wsZUFBZSxFQUNmLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDOUIsQ0FBQztJQUVGLElBQU0sT0FBTyxnQkFDUixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUMxQixDQUFDO0lBRUYsTUFBTSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQztBQUN6QixDQUFDO0FBekJELGdEQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QW5jaG9yLCBUaXRsZU9yaWVudCwgVmdNYXJrQ29uZmlnLCBWZ1RpdGxlQ29uZmlnfSBmcm9tICcuL3ZlZ2Euc2NoZW1hJztcblxuZXhwb3J0IGludGVyZmFjZSBUaXRsZUJhc2Uge1xuICAvKipcbiAgICogVGhlIG9yaWVudGF0aW9uIG9mIHRoZSB0aXRsZSByZWxhdGl2ZSB0byB0aGUgY2hhcnQuIE9uZSBvZiBgXCJ0b3BcImAgKHRoZSBkZWZhdWx0KSwgYFwiYm90dG9tXCJgLCBgXCJsZWZ0XCJgLCBvciBgXCJyaWdodFwiYC5cbiAgICovXG4gIG9yaWVudD86IFRpdGxlT3JpZW50O1xuXG4gIC8qKlxuICAgKiBUaGUgYW5jaG9yIHBvc2l0aW9uIGZvciBwbGFjaW5nIHRoZSB0aXRsZS4gT25lIG9mIGBcInN0YXJ0XCJgLCBgXCJtaWRkbGVcImAsIG9yIGBcImVuZFwiYC4gRm9yIGV4YW1wbGUsIHdpdGggYW4gb3JpZW50YXRpb24gb2YgdG9wIHRoZXNlIGFuY2hvciBwb3NpdGlvbnMgbWFwIHRvIGEgbGVmdC0sIGNlbnRlci0sIG9yIHJpZ2h0LWFsaWduZWQgdGl0bGUuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJtaWRkbGVcImAgZm9yIFtzaW5nbGVdKHNwZWMuaHRtbCkgYW5kIFtsYXllcmVkXShsYXllci5odG1sKSB2aWV3cy5cbiAgICogYFwic3RhcnRcImAgZm9yIG90aGVyIGNvbXBvc2l0ZSB2aWV3cy5cbiAgICpcbiAgICogX19Ob3RlOl9fIFtGb3Igbm93XShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI4NzUpLCBgYW5jaG9yYCBpcyBvbmx5IGN1c3RvbWl6YWJsZSBvbmx5IGZvciBbc2luZ2xlXShzcGVjLmh0bWwpIGFuZCBbbGF5ZXJlZF0obGF5ZXIuaHRtbCkgdmlld3MuICBGb3Igb3RoZXIgY29tcG9zaXRlIHZpZXdzLCBgYW5jaG9yYCBpcyBhbHdheXMgYFwic3RhcnRcImAuXG4gICAqL1xuICBhbmNob3I/OiBBbmNob3I7XG5cbiAgLyoqXG4gICAqIFRoZSBvcnRob2dvbmFsIG9mZnNldCBpbiBwaXhlbHMgYnkgd2hpY2ggdG8gZGlzcGxhY2UgdGhlIHRpdGxlIGZyb20gaXRzIHBvc2l0aW9uIGFsb25nIHRoZSBlZGdlIG9mIHRoZSBjaGFydC5cbiAgICovXG4gIG9mZnNldD86IG51bWJlcjtcblxuICAvKipcbiAgICogQSBbbWFyayBzdHlsZSBwcm9wZXJ0eV0oY29uZmlnLmh0bWwjc3R5bGUpIHRvIGFwcGx5IHRvIHRoZSB0aXRsZSB0ZXh0IG1hcmsuXG4gICAqXG4gICAqIF9fRGVmYXVsdCB2YWx1ZTpfXyBgXCJncm91cC10aXRsZVwiYC5cbiAgICovXG4gIHN0eWxlPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLy8gVE9ETzogbmFtZSwgZW5jb2RlLCBpbnRlcmFjdGl2ZSwgemluZGV4XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGl0bGVQYXJhbXMgZXh0ZW5kcyBUaXRsZUJhc2Uge1xuICAvKipcbiAgICogVGhlIHRpdGxlIHRleHQuXG4gICAqL1xuICB0ZXh0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VGl0bGVDb25maWcodGl0bGVDb25maWc6IFZnVGl0bGVDb25maWcpOiB7XG4gIG1hcms6IFZnTWFya0NvbmZpZyxcbiAgbm9uTWFyazogVGl0bGVCYXNlXG59IHtcbiAgY29uc3Qge1xuICAgIC8vIFRoZXNlIGFyZSBub24tbWFyayB0aXRsZSBjb25maWcgdGhhdCBuZWVkIHRvIGJlIGhhcmRjb2RlZFxuICAgIGFuY2hvciwgb2Zmc2V0LCBvcmllbnQsXG4gICAgLy8gY29sb3IgbmVlZHMgdG8gYmUgcmVkaXJlY3QgdG8gZmlsbFxuICAgIGNvbG9yLFxuICAgIC8vIFRoZSByZXN0IGFyZSBtYXJrIGNvbmZpZy5cbiAgICAuLi50aXRsZU1hcmtDb25maWdcbiAgfSA9IHRpdGxlQ29uZmlnO1xuXG4gIGNvbnN0IG1hcms6IFZnTWFya0NvbmZpZyA9IHtcbiAgICAuLi50aXRsZU1hcmtDb25maWcsXG4gICAgLi4uY29sb3IgPyB7ZmlsbDogY29sb3J9IDoge31cbiAgfTtcblxuICBjb25zdCBub25NYXJrOiBUaXRsZUJhc2UgPSB7XG4gICAgLi4uYW5jaG9yID8ge2FuY2hvcn0gOiB7fSxcbiAgICAuLi5vZmZzZXQgPyB7b2Zmc2V0fSA6IHt9LFxuICAgIC4uLm9yaWVudCA/IHtvcmllbnR9IDoge31cbiAgfTtcblxuICByZXR1cm4ge21hcmssIG5vbk1hcmt9O1xufVxuIl19