import { isArray, isString } from 'vega-util';
import { pick } from './util';
export function extractTitleConfig(titleConfig) {
    const { 
    // These are non-mark title config that need to be hardcoded
    anchor, frame, offset, orient, angle, limit, 
    // color needs to be redirect to fill
    color, 
    // subtitle properties
    subtitleColor, subtitleFont, subtitleFontSize, subtitleFontStyle, subtitleFontWeight, subtitleLineHeight, subtitlePadding, 
    // The rest are mark config.
    ...rest } = titleConfig;
    const titleMarkConfig = {
        ...rest,
        ...(color ? { fill: color } : {})
    };
    // These are non-mark title config that need to be hardcoded
    const nonMarkTitleProperties = {
        ...(anchor ? { anchor } : {}),
        ...(frame ? { frame } : {}),
        ...(offset ? { offset } : {}),
        ...(orient ? { orient } : {}),
        ...(angle !== undefined ? { angle } : {}),
        ...(limit !== undefined ? { limit } : {})
    };
    // subtitle part can stay in config.title since header titles do not use subtitle
    const subtitle = {
        ...(subtitleColor ? { subtitleColor } : {}),
        ...(subtitleFont ? { subtitleFont } : {}),
        ...(subtitleFontSize ? { subtitleFontSize } : {}),
        ...(subtitleFontStyle ? { subtitleFontStyle } : {}),
        ...(subtitleFontWeight ? { subtitleFontWeight } : {}),
        ...(subtitleLineHeight ? { subtitleLineHeight } : {}),
        ...(subtitlePadding ? { subtitlePadding } : {})
    };
    const subtitleMarkConfig = pick(titleConfig, ['align', 'baseline', 'dx', 'dy', 'limit']);
    return { titleMarkConfig, subtitleMarkConfig, nonMarkTitleProperties, subtitle };
}
export function isText(v) {
    return isString(v) || (isArray(v) && isString(v[0]));
}
//# sourceMappingURL=title.js.map