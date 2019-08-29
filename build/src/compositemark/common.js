import * as tslib_1 from "tslib";
import { isArray, isBoolean, isString } from 'vega-util';
import { isContinuous, isFieldDef } from '../channeldef';
import { fieldDefs } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
export function filterTooltipWithAggregatedField(oldEncoding) {
    const { tooltip } = oldEncoding, filteredEncoding = tslib_1.__rest(oldEncoding, ["tooltip"]);
    if (!tooltip) {
        return { filteredEncoding: oldEncoding };
    }
    let customTooltipWithAggregatedField;
    let customTooltipWithoutAggregatedField;
    if (isArray(tooltip)) {
        tooltip.forEach((t) => {
            if (t.aggregate) {
                if (!customTooltipWithAggregatedField) {
                    customTooltipWithAggregatedField = [];
                }
                customTooltipWithAggregatedField.push(t);
            }
            else {
                if (!customTooltipWithoutAggregatedField) {
                    customTooltipWithoutAggregatedField = [];
                }
                customTooltipWithoutAggregatedField.push(t);
            }
        });
        if (customTooltipWithAggregatedField) {
            filteredEncoding.tooltip = customTooltipWithAggregatedField;
        }
    }
    else {
        if (tooltip['aggregate']) {
            filteredEncoding.tooltip = tooltip;
        }
        else {
            customTooltipWithoutAggregatedField = tooltip;
        }
    }
    if (isArray(customTooltipWithoutAggregatedField) && customTooltipWithoutAggregatedField.length === 1) {
        customTooltipWithoutAggregatedField = customTooltipWithoutAggregatedField[0];
    }
    return { customTooltipWithoutAggregatedField, filteredEncoding };
}
export function getCompositeMarkTooltip(tooltipSummary, continuousAxisChannelDef, encodingWithoutContinuousAxis, withFieldName = true) {
    if ('tooltip' in encodingWithoutContinuousAxis) {
        return { tooltip: encodingWithoutContinuousAxis.tooltip };
    }
    const fiveSummaryTooltip = tooltipSummary.map(({ fieldPrefix, titlePrefix }) => ({
        field: fieldPrefix + continuousAxisChannelDef.field,
        type: continuousAxisChannelDef.type,
        title: titlePrefix + (withFieldName ? ' of ' + continuousAxisChannelDef.field : '')
    }));
    return {
        tooltip: [
            ...fiveSummaryTooltip,
            // need to cast because TextFieldDef support fewer types of bin
            ...fieldDefs(encodingWithoutContinuousAxis)
        ]
    };
}
export function makeCompositeAggregatePartFactory(compositeMarkDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, compositeMarkConfig) {
    const { scale, axis } = continuousAxisChannelDef;
    return ({ partName, mark, positionPrefix, endPositionPrefix = undefined, extraEncoding = {} }) => {
        const title = axis && axis.title !== undefined
            ? undefined
            : continuousAxisChannelDef.title !== undefined
                ? continuousAxisChannelDef.title
                : continuousAxisChannelDef.field;
        return partLayerMixins(compositeMarkDef, partName, compositeMarkConfig, {
            mark,
            encoding: Object.assign({ [continuousAxis]: Object.assign({ field: positionPrefix + '_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, (title ? { title } : {}), (scale ? { scale } : {}), (axis ? { axis } : {})) }, (isString(endPositionPrefix)
                ? {
                    [continuousAxis + '2']: {
                        field: endPositionPrefix + '_' + continuousAxisChannelDef.field,
                        type: continuousAxisChannelDef.type
                    }
                }
                : {}), sharedEncoding, extraEncoding)
        });
    };
}
export function partLayerMixins(markDef, part, compositeMarkConfig, partBaseSpec) {
    const { clip, color, opacity } = markDef;
    const mark = markDef.type;
    if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
        return [
            Object.assign({}, partBaseSpec, { mark: Object.assign({}, compositeMarkConfig[part], (clip ? { clip } : {}), (color ? { color } : {}), (opacity ? { opacity } : {}), (isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : { type: partBaseSpec.mark }), { style: `${mark}-${part}` }, (isBoolean(markDef[part]) ? {} : markDef[part])) })
        ];
    }
    return [];
}
export function compositeMarkContinuousAxis(spec, orient, compositeMark) {
    const { encoding } = spec;
    const continuousAxis = orient === 'vertical' ? 'y' : 'x';
    const continuousAxisChannelDef = encoding[continuousAxis]; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
    const continuousAxisChannelDef2 = encoding[continuousAxis + '2'];
    const continuousAxisChannelDefError = encoding[continuousAxis + 'Error'];
    const continuousAxisChannelDefError2 = encoding[continuousAxis + 'Error2'];
    return {
        continuousAxisChannelDef: filterAggregateFromChannelDef(continuousAxisChannelDef, compositeMark),
        continuousAxisChannelDef2: filterAggregateFromChannelDef(continuousAxisChannelDef2, compositeMark),
        continuousAxisChannelDefError: filterAggregateFromChannelDef(continuousAxisChannelDefError, compositeMark),
        continuousAxisChannelDefError2: filterAggregateFromChannelDef(continuousAxisChannelDefError2, compositeMark),
        continuousAxis
    };
}
function filterAggregateFromChannelDef(continuousAxisChannelDef, compositeMark) {
    if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
        const { aggregate } = continuousAxisChannelDef, continuousAxisWithoutAggregate = tslib_1.__rest(continuousAxisChannelDef, ["aggregate"]);
        if (aggregate !== compositeMark) {
            log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
        }
        return continuousAxisWithoutAggregate;
    }
    else {
        return continuousAxisChannelDef;
    }
}
export function compositeMarkOrient(spec, compositeMark) {
    const { mark, encoding } = spec;
    if (isFieldDef(encoding.x) && isContinuous(encoding.x)) {
        // x is continuous
        if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
            // both x and y are continuous
            if (encoding.x.aggregate === undefined && encoding.y.aggregate === compositeMark) {
                return 'vertical';
            }
            else if (encoding.y.aggregate === undefined && encoding.x.aggregate === compositeMark) {
                return 'horizontal';
            }
            else if (encoding.x.aggregate === compositeMark && encoding.y.aggregate === compositeMark) {
                throw new Error('Both x and y cannot have aggregate');
            }
            else {
                if (isMarkDef(mark) && mark.orient) {
                    return mark.orient;
                }
                // default orientation = vertical
                return 'vertical';
            }
        }
        // x is continuous but y is not
        return 'horizontal';
    }
    else if (isFieldDef(encoding.y) && isContinuous(encoding.y)) {
        // y is continuous but x is not
        return 'vertical';
    }
    else {
        // Neither x nor y is continuous.
        throw new Error('Need a valid continuous axis for ' + compositeMark + 's');
    }
}
//# sourceMappingURL=common.js.map