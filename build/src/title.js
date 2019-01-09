import * as tslib_1 from "tslib";
export function extractTitleConfig(titleConfig) {
    const { 
    // These are non-mark title config that need to be hardcoded
    anchor, frame, offset, orient, 
    // color needs to be redirect to fill
    color } = titleConfig, 
    // The rest are mark config.
    titleMarkConfig = tslib_1.__rest(titleConfig, ["anchor", "frame", "offset", "orient", "color"]);
    const mark = Object.assign({}, titleMarkConfig, (color ? { fill: color } : {}));
    const nonMark = Object.assign({}, (anchor ? { anchor } : {}), (offset ? { offset } : {}), (orient ? { orient } : {}));
    return { mark, nonMark };
}
//# sourceMappingURL=title.js.map