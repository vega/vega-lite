import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { isBinning } from '../bin';
import { isScaleChannel } from '../channel';
import { isScaleFieldDef, isTimeFieldDef, vgField } from '../fielddef';
import { ScaleType } from '../scale';
import { formatExpression } from '../timeunit';
import { QUANTITATIVE } from '../type';
import { contains, getFirstDefined, keys, stringify } from '../util';
import { wrapCondition } from './mark/mixins';
export function applyConfig(e, config, // TODO(#1842): consolidate MarkConfig | TextConfig?
propsList) {
    for (var _i = 0, propsList_1 = propsList; _i < propsList_1.length; _i++) {
        var property = propsList_1[_i];
        var value = config[property];
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
export function applyMarkConfig(e, model, propsList) {
    for (var _i = 0, propsList_2 = propsList; _i < propsList_2.length; _i++) {
        var property = propsList_2[_i];
        var value = getMarkConfig(property, model.markDef, model.config);
        if (value !== undefined) {
            e[property] = { value: value };
        }
    }
    return e;
}
export function getStyles(mark) {
    return [].concat(mark.type, mark.style || []);
}
/**
 * Return property value from style or mark specific config property if exists.
 * Otherwise, return general mark specific config.
 */
export function getMarkConfig(prop, mark, config, _a) {
    var _b = (_a === void 0 ? {} : _a).skipGeneralMarkConfig, skipGeneralMarkConfig = _b === void 0 ? false : _b;
    return getFirstDefined(
    // style config has highest precedence
    getStyleConfig(prop, mark, config.style), 
    // then mark-specific config
    config[mark.type][prop], 
    // then general mark config (if not skipped)
    skipGeneralMarkConfig ? undefined : config.mark[prop]);
}
export function getStyleConfig(prop, mark, styleConfigIndex) {
    var styles = getStyles(mark);
    var value;
    for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
        var style = styles_1[_i];
        var styleConfig = styleConfigIndex[style];
        // MarkConfig extends VgMarkConfig so a prop may not be a valid property for style
        // However here we also check if it is defined, so it is okay to cast here
        var p = prop;
        if (styleConfig && styleConfig[p] !== undefined) {
            value = styleConfig[p];
        }
    }
    return value;
}
export function formatSignalRef(fieldDef, specifiedFormat, expr, config) {
    var format = numberFormat(fieldDef, specifiedFormat, config);
    if (isBinning(fieldDef.bin)) {
        var startField = vgField(fieldDef, { expr: expr });
        var endField = vgField(fieldDef, { expr: expr, binSuffix: 'end' });
        return {
            signal: binFormatExpression(startField, endField, format, config)
        };
    }
    else if (fieldDef.type === 'quantitative') {
        return {
            signal: "" + formatExpr(vgField(fieldDef, { expr: expr, binSuffix: 'range' }), format)
        };
    }
    else if (isTimeFieldDef(fieldDef)) {
        var isUTCScale = isScaleFieldDef(fieldDef) && fieldDef['scale'] && fieldDef['scale'].type === ScaleType.UTC;
        return {
            signal: timeFormatExpression(vgField(fieldDef, { expr: expr }), fieldDef.timeUnit, specifiedFormat, config.text.shortTimeLabels, config.timeFormat, isUTCScale, true)
        };
    }
    else {
        return {
            signal: "''+" + vgField(fieldDef, { expr: expr })
        };
    }
}
/**
 * Returns number format for a fieldDef
 *
 * @param format explicitly specified format
 */
export function numberFormat(fieldDef, specifiedFormat, config) {
    if (fieldDef.type === QUANTITATIVE) {
        // add number format for quantitative type only
        // Specified format in axis/legend has higher precedence than fieldDef.format
        if (specifiedFormat) {
            return specifiedFormat;
        }
        // TODO: need to make this work correctly for numeric ordinal / nominal type
        return config.numberFormat;
    }
    return undefined;
}
function formatExpr(field, format) {
    return "format(" + field + ", \"" + (format || '') + "\")";
}
export function numberFormatExpr(field, specifiedFormat, config) {
    return formatExpr(field, specifiedFormat || config.numberFormat);
}
export function binFormatExpression(startField, endField, format, config) {
    return startField + " === null || isNaN(" + startField + ") ? \"null\" : " + numberFormatExpr(startField, format, config) + " + \" - \" + " + numberFormatExpr(endField, format, config);
}
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export function timeFormatExpression(field, timeUnit, format, shortTimeLabels, rawTimeFormat, // should be provided only for actual text and headers, not axis/legend labels
isUTCScale, alwaysReturn) {
    if (alwaysReturn === void 0) { alwaysReturn = false; }
    if (!timeUnit || format) {
        // If there is not time unit, or if user explicitly specify format for axis/legend/text.
        format = format || rawTimeFormat; // only use provided timeFormat if there is no timeUnit.
        if (format || alwaysReturn) {
            return (isUTCScale ? 'utc' : 'time') + "Format(" + field + ", '" + format + "')";
        }
        else {
            return undefined;
        }
    }
    else {
        return formatExpression(timeUnit, field, shortTimeLabels, isUTCScale);
    }
}
/**
 * Return Vega sort parameters (tuple of field and order).
 */
export function sortParams(orderDef, fieldRefOption) {
    return (isArray(orderDef) ? orderDef : [orderDef]).reduce(function (s, orderChannelDef) {
        s.field.push(vgField(orderChannelDef, fieldRefOption));
        s.order.push(orderChannelDef.sort || 'ascending');
        return s;
    }, { field: [], order: [] });
}
export function mergeTitleFieldDefs(f1, f2) {
    var merged = f1.slice();
    f2.forEach(function (fdToMerge) {
        for (var _i = 0, merged_1 = merged; _i < merged_1.length; _i++) {
            var fieldDef1 = merged_1[_i];
            // If already exists, no need to append to merged array
            if (stringify(fieldDef1) === stringify(fdToMerge)) {
                return;
            }
        }
        merged.push(fdToMerge);
    });
    return merged;
}
export function mergeTitle(title1, title2) {
    return title1 === title2
        ? title1 // if title is the same just use one of them
        : title1 + ', ' + title2; // join title with comma if different
}
export function mergeTitleComponent(v1, v2) {
    if (isArray(v1.value) && isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitleFieldDefs(v1.value, v2.value)
        };
    }
    else if (!isArray(v1.value) && !isArray(v2.value)) {
        return {
            explicit: v1.explicit,
            value: mergeTitle(v1.value, v2.value)
        };
    }
    /* istanbul ignore next: Condition should not happen -- only for warning in development. */
    throw new Error('It should never reach here');
}
/**
 * Checks whether a fieldDef for a particular channel requires a computed bin range.
 */
export function binRequiresRange(fieldDef, channel) {
    if (!isBinning(fieldDef.bin)) {
        console.warn('Only use this method with binned field defs');
        return false;
    }
    // We need the range only when the user explicitly forces a binned field to be use discrete scale. In this case, bin range is used in axis and legend labels.
    // We could check whether the axis or legend exists (not disabled) but that seems overkill.
    return isScaleChannel(channel) && contains(['ordinal', 'nominal'], fieldDef.type);
}
export function guideEncodeEntry(encoding, model) {
    return keys(encoding).reduce(function (encode, channel) {
        var valueDef = encoding[channel];
        return tslib_1.__assign({}, encode, wrapCondition(model, valueDef, channel, function (x) { return ({ value: x.value }); }));
    }, {});
}
//# sourceMappingURL=common.js.map