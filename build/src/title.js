import * as tslib_1 from "tslib";
export function extractTitleConfig(titleConfig) {
    var 
    // These are non-mark title config that need to be hardcoded
    anchor = titleConfig.anchor, frame = titleConfig.frame, offset = titleConfig.offset, orient = titleConfig.orient, 
    // color needs to be redirect to fill
    color = titleConfig.color, 
    // The rest are mark config.
    titleMarkConfig = tslib_1.__rest(titleConfig, ["anchor", "frame", "offset", "orient", "color"]);
    var mark = tslib_1.__assign({}, titleMarkConfig, (color ? { fill: color } : {}));
    var nonMark = tslib_1.__assign({}, (anchor ? { anchor: anchor } : {}), (offset ? { offset: offset } : {}), (orient ? { orient: orient } : {}));
    return { mark: mark, nonMark: nonMark };
}
//# sourceMappingURL=title.js.map