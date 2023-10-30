import { isArray, isBoolean, isString } from 'vega-util';
import { isContinuousFieldOrDatumDef, isFieldDef, isFieldOrDatumDefForTimeFormat } from '../channeldef';
import { fieldDefs } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { getFirstDefined, hash, unique } from '../util';
import { isSignalRef } from '../vega.schema';
import { toStringFieldDef } from './../channeldef';
export function filterTooltipWithAggregatedField(oldEncoding) {
    const { tooltip, ...filteredEncoding } = oldEncoding;
    if (!tooltip) {
        return { filteredEncoding };
    }
    let customTooltipWithAggregatedField;
    let customTooltipWithoutAggregatedField;
    if (isArray(tooltip)) {
        for (const t of tooltip) {
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
        }
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
    const fiveSummaryTooltip = tooltipSummary.map(({ fieldPrefix, titlePrefix }) => {
        const mainTitle = withFieldName ? ` of ${getTitle(continuousAxisChannelDef)}` : '';
        return {
            field: fieldPrefix + continuousAxisChannelDef.field,
            type: continuousAxisChannelDef.type,
            title: isSignalRef(titlePrefix) ? { signal: `${titlePrefix}"${escape(mainTitle)}"` } : titlePrefix + mainTitle
        };
    });
    const tooltipFieldDefs = fieldDefs(encodingWithoutContinuousAxis).map(toStringFieldDef);
    return {
        tooltip: [
            ...fiveSummaryTooltip,
            // need to cast because TextFieldDef supports fewer types of bin
            ...unique(tooltipFieldDefs, hash)
        ]
    };
}
export function getTitle(continuousAxisChannelDef) {
    const { title, field } = continuousAxisChannelDef;
    return getFirstDefined(title, field);
}
export function makeCompositeAggregatePartFactory(compositeMarkDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, compositeMarkConfig) {
    const { scale, axis } = continuousAxisChannelDef;
    return ({ partName, mark, positionPrefix, endPositionPrefix = undefined, extraEncoding = {} }) => {
        const title = getTitle(continuousAxisChannelDef);
        return partLayerMixins(compositeMarkDef, partName, compositeMarkConfig, {
            mark,
            encoding: {
                [continuousAxis]: {
                    field: `${positionPrefix}_${continuousAxisChannelDef.field}`,
                    type: continuousAxisChannelDef.type,
                    ...(title !== undefined ? { title } : {}),
                    ...(scale !== undefined ? { scale } : {}),
                    ...(axis !== undefined ? { axis } : {})
                },
                ...(isString(endPositionPrefix)
                    ? {
                        [`${continuousAxis}2`]: {
                            field: `${endPositionPrefix}_${continuousAxisChannelDef.field}`
                        }
                    }
                    : {}),
                ...sharedEncoding,
                ...extraEncoding
            }
        });
    };
}
export function partLayerMixins(markDef, part, compositeMarkConfig, partBaseSpec) {
    const { clip, color, opacity } = markDef;
    const mark = markDef.type;
    if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
        return [
            {
                ...partBaseSpec,
                mark: {
                    ...compositeMarkConfig[part],
                    ...(clip ? { clip } : {}),
                    ...(color ? { color } : {}),
                    ...(opacity ? { opacity } : {}),
                    ...(isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : { type: partBaseSpec.mark }),
                    style: `${mark}-${String(part)}`,
                    ...(isBoolean(markDef[part]) ? {} : markDef[part])
                }
            }
        ];
    }
    return [];
}
export function compositeMarkContinuousAxis(spec, orient, compositeMark) {
    const { encoding } = spec;
    const continuousAxis = orient === 'vertical' ? 'y' : 'x';
    const continuousAxisChannelDef = encoding[continuousAxis]; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
    const continuousAxisChannelDef2 = encoding[`${continuousAxis}2`];
    const continuousAxisChannelDefError = encoding[`${continuousAxis}Error`];
    const continuousAxisChannelDefError2 = encoding[`${continuousAxis}Error2`];
    return {
        continuousAxisChannelDef: filterAggregateFromChannelDef(continuousAxisChannelDef, compositeMark),
        continuousAxisChannelDef2: filterAggregateFromChannelDef(continuousAxisChannelDef2, compositeMark),
        continuousAxisChannelDefError: filterAggregateFromChannelDef(continuousAxisChannelDefError, compositeMark),
        continuousAxisChannelDefError2: filterAggregateFromChannelDef(continuousAxisChannelDefError2, compositeMark),
        continuousAxis
    };
}
function filterAggregateFromChannelDef(continuousAxisChannelDef, compositeMark) {
    if (continuousAxisChannelDef?.aggregate) {
        const { aggregate, ...continuousAxisWithoutAggregate } = continuousAxisChannelDef;
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
    const { x, y } = encoding;
    if (isMarkDef(mark) && mark.orient) {
        return mark.orient;
    }
    if (isContinuousFieldOrDatumDef(x)) {
        // x is continuous
        if (isContinuousFieldOrDatumDef(y)) {
            // both x and y are continuous
            const xAggregate = isFieldDef(x) && x.aggregate;
            const yAggregate = isFieldDef(y) && y.aggregate;
            if (!xAggregate && yAggregate === compositeMark) {
                return 'vertical';
            }
            else if (!yAggregate && xAggregate === compositeMark) {
                return 'horizontal';
            }
            else if (xAggregate === compositeMark && yAggregate === compositeMark) {
                throw new Error('Both x and y cannot have aggregate');
            }
            else {
                if (isFieldOrDatumDefForTimeFormat(y) && !isFieldOrDatumDefForTimeFormat(x)) {
                    // y is temporal but x is not
                    return 'horizontal';
                }
                // default orientation for two continuous
                return 'vertical';
            }
        }
        return 'horizontal';
    }
    else if (isContinuousFieldOrDatumDef(y)) {
        // y is continuous but x is not
        return 'vertical';
    }
    else {
        // Neither x nor y is continuous.
        throw new Error(`Need a valid continuous axis for ${compositeMark}s`);
    }
}
//# sourceMappingURL=common.js.map