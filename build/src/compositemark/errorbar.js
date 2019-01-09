import * as tslib_1 from "tslib";
import { extractTransformsFromEncoding } from '../encoding';
import { isContinuous, isFieldDef, title } from '../fielddef';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { keys, titlecase } from '../util';
import { compositeMarkContinuousAxis, compositeMarkOrient, filterUnsupportedChannels, getCompositeMarkTooltip, makeCompositeAggregatePartFactory } from './common';
export const ERRORBAR = 'errorbar';
const ERRORBAR_PART_INDEX = {
    ticks: 1,
    rule: 1
};
export const ERRORBAR_PARTS = keys(ERRORBAR_PART_INDEX);
export function normalizeErrorBar(spec, config) {
    const { transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis, ticksOrient, markDef, outerSpec, tooltipEncoding } = errorBarParams(spec, ERRORBAR, config);
    const makeErrorBarPart = makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorbar);
    const tick = { type: 'tick', orient: ticksOrient };
    return Object.assign({}, outerSpec, { transform, layer: [
            ...makeErrorBarPart({
                partName: 'ticks',
                mark: tick,
                positionPrefix: 'lower',
                extraEncoding: tooltipEncoding
            }),
            ...makeErrorBarPart({
                partName: 'ticks',
                mark: tick,
                positionPrefix: 'upper',
                extraEncoding: tooltipEncoding
            }),
            ...makeErrorBarPart({
                partName: 'rule',
                mark: 'rule',
                positionPrefix: 'lower',
                endPositionPrefix: 'upper',
                extraEncoding: tooltipEncoding
            })
        ] });
}
function errorBarOrientAndInputType(spec, compositeMark) {
    const { encoding } = spec;
    if (errorBarIsInputTypeRaw(encoding)) {
        return {
            orient: compositeMarkOrient(spec, compositeMark),
            inputType: 'raw'
        };
    }
    const isTypeAggregatedUpperLower = errorBarIsInputTypeAggregatedUpperLower(encoding);
    const isTypeAggregatedError = errorBarIsInputTypeAggregatedError(encoding);
    const x = encoding.x;
    const y = encoding.y;
    if (isTypeAggregatedUpperLower) {
        // type is aggregated-upper-lower
        if (isTypeAggregatedError) {
            throw new Error(compositeMark + ' cannot be both type aggregated-upper-lower and aggregated-error');
        }
        const x2 = encoding.x2;
        const y2 = encoding.y2;
        if (isFieldDef(x2) && isFieldDef(y2)) {
            // having both x, x2 and y, y2
            throw new Error(compositeMark + ' cannot have both x2 and y2');
        }
        else if (isFieldDef(x2)) {
            if (isFieldDef(x) && isContinuous(x)) {
                // having x, x2 quantitative and field y, y2 are not specified
                return { orient: 'horizontal', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having x, x2 that are not both quantitative
                throw new Error('Both x and x2 have to be quantitative in ' + compositeMark);
            }
        }
        else if (isFieldDef(y2)) {
            // y2 is a FieldDef
            if (isFieldDef(y) && isContinuous(y)) {
                // having y, y2 quantitative and field x, x2 are not specified
                return { orient: 'vertical', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having y, y2 that are not both quantitative
                throw new Error('Both y and y2 have to be quantitative in ' + compositeMark);
            }
        }
        throw new Error('No ranged axis');
    }
    else {
        // type is aggregated-error
        const xError = encoding.xError;
        const xError2 = encoding.xError2;
        const yError = encoding.yError;
        const yError2 = encoding.yError2;
        if (isFieldDef(xError2) && !isFieldDef(xError)) {
            // having xError2 without xError
            throw new Error(compositeMark + ' cannot have xError2 without xError');
        }
        if (isFieldDef(yError2) && !isFieldDef(yError)) {
            // having yError2 without yError
            throw new Error(compositeMark + ' cannot have yError2 without yError');
        }
        if (isFieldDef(xError) && isFieldDef(yError)) {
            // having both xError and yError
            throw new Error(compositeMark + ' cannot have both xError and yError with both are quantiative');
        }
        else if (isFieldDef(xError)) {
            if (isFieldDef(x) && isContinuous(x)) {
                // having x and xError that are all quantitative
                return { orient: 'horizontal', inputType: 'aggregated-error' };
            }
            else {
                // having x, xError, and xError2 that are not all quantitative
                throw new Error('All x, xError, and xError2 (if exist) have to be quantitative');
            }
        }
        else if (isFieldDef(yError)) {
            if (isFieldDef(y) && isContinuous(y)) {
                // having y and yError that are all quantitative
                return { orient: 'vertical', inputType: 'aggregated-error' };
            }
            else {
                // having y, yError, and yError2 that are not all quantitative
                throw new Error('All y, yError, and yError2 (if exist) have to be quantitative');
            }
        }
        throw new Error('No ranged axis');
    }
}
function errorBarIsInputTypeRaw(encoding) {
    return ((isFieldDef(encoding.x) || isFieldDef(encoding.y)) &&
        !isFieldDef(encoding.x2) &&
        !isFieldDef(encoding.y2) &&
        !isFieldDef(encoding.xError) &&
        !isFieldDef(encoding.xError2) &&
        !isFieldDef(encoding.yError) &&
        !isFieldDef(encoding.yError2));
}
function errorBarIsInputTypeAggregatedUpperLower(encoding) {
    return isFieldDef(encoding.x2) || isFieldDef(encoding.y2);
}
function errorBarIsInputTypeAggregatedError(encoding) {
    return (isFieldDef(encoding.xError) ||
        isFieldDef(encoding.xError2) ||
        isFieldDef(encoding.yError) ||
        isFieldDef(encoding.yError2));
}
export const errorBarSupportedChannels = [
    'x',
    'y',
    'x2',
    'y2',
    'xError',
    'yError',
    'xError2',
    'yError2',
    'color',
    'detail',
    'opacity'
];
export function errorBarParams(spec, compositeMark, config) {
    spec = filterUnsupportedChannels(spec, errorBarSupportedChannels, compositeMark);
    // TODO: use selection
    const { mark, encoding, selection, projection: _p } = spec, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    const markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported(compositeMark));
    }
    const { orient, inputType } = errorBarOrientAndInputType(spec, compositeMark);
    const { continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, continuousAxis } = compositeMarkContinuousAxis(spec, orient, compositeMark);
    const { errorBarSpecificAggregate, postAggregateCalculates, tooltipSummary, tooltipTitleWithFieldName } = errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config);
    const _a = continuousAxis, oldContinuousAxisChannelDef = encoding[_a], _b = continuousAxis === 'x' ? 'x2' : 'y2', oldContinuousAxisChannelDef2 = encoding[_b], _c = continuousAxis === 'x' ? 'xError' : 'yError', oldContinuousAxisChannelDefError = encoding[_c], _d = continuousAxis === 'x' ? 'xError2' : 'yError2', oldContinuousAxisChannelDefError2 = encoding[_d], oldEncodingWithoutContinuousAxis = tslib_1.__rest(encoding, [typeof _a === "symbol" ? _a : _a + "", typeof _b === "symbol" ? _b : _b + "", typeof _c === "symbol" ? _c : _c + "", typeof _d === "symbol" ? _d : _d + ""]);
    const { bins, timeUnits, aggregate: oldAggregate, groupby: oldGroupBy, encoding: encodingWithoutContinuousAxis } = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config);
    const aggregate = [...oldAggregate, ...errorBarSpecificAggregate];
    const groupby = inputType !== 'raw' ? [] : oldGroupBy;
    const tooltipEncoding = getCompositeMarkTooltip(tooltipSummary, continuousAxisChannelDef, encodingWithoutContinuousAxis, tooltipTitleWithFieldName);
    return {
        transform: [
            ...(outerSpec.transform || []),
            ...bins,
            ...timeUnits,
            ...(!aggregate.length ? [] : [{ aggregate, groupby }]),
            ...postAggregateCalculates
        ],
        groupby,
        continuousAxisChannelDef,
        continuousAxis,
        encodingWithoutContinuousAxis,
        ticksOrient: orient === 'vertical' ? 'horizontal' : 'vertical',
        markDef,
        outerSpec,
        tooltipEncoding
    };
}
function errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config) {
    let errorBarSpecificAggregate = [];
    let postAggregateCalculates = [];
    const continuousFieldName = continuousAxisChannelDef.field;
    let tooltipSummary;
    let tooltipTitleWithFieldName = false;
    if (inputType === 'raw') {
        const center = markDef.center
            ? markDef.center
            : markDef.extent
                ? markDef.extent === 'iqr'
                    ? 'median'
                    : 'mean'
                : config.errorbar.center;
        const extent = markDef.extent ? markDef.extent : center === 'mean' ? 'stderr' : 'iqr';
        if ((center === 'median') !== (extent === 'iqr')) {
            log.warn(log.message.errorBarCenterIsUsedWithWrongExtent(center, extent, compositeMark));
        }
        if (extent === 'stderr' || extent === 'stdev') {
            errorBarSpecificAggregate = [
                { op: extent, field: continuousFieldName, as: 'extent_' + continuousFieldName },
                { op: center, field: continuousFieldName, as: 'center_' + continuousFieldName }
            ];
            postAggregateCalculates = [
                {
                    calculate: `datum.center_${continuousFieldName} + datum.extent_${continuousFieldName}`,
                    as: 'upper_' + continuousFieldName
                },
                {
                    calculate: `datum.center_${continuousFieldName} - datum.extent_${continuousFieldName}`,
                    as: 'lower_' + continuousFieldName
                }
            ];
            tooltipSummary = [
                { fieldPrefix: 'center_', titlePrefix: titlecase(center) },
                { fieldPrefix: 'upper_', titlePrefix: getTitlePrefix(center, extent, '+') },
                { fieldPrefix: 'lower_', titlePrefix: getTitlePrefix(center, extent, '-') }
            ];
            tooltipTitleWithFieldName = true;
        }
        else {
            if (markDef.center && markDef.extent) {
                log.warn(log.message.errorBarCenterIsNotNeeded(markDef.extent, compositeMark));
            }
            let centerOp;
            let lowerExtentOp;
            let upperExtentOp;
            if (extent === 'ci') {
                centerOp = 'mean';
                lowerExtentOp = 'ci0';
                upperExtentOp = 'ci1';
            }
            else {
                centerOp = 'median';
                lowerExtentOp = 'q1';
                upperExtentOp = 'q3';
            }
            errorBarSpecificAggregate = [
                { op: lowerExtentOp, field: continuousFieldName, as: 'lower_' + continuousFieldName },
                { op: upperExtentOp, field: continuousFieldName, as: 'upper_' + continuousFieldName },
                { op: centerOp, field: continuousFieldName, as: 'center_' + continuousFieldName }
            ];
            tooltipSummary = [
                {
                    fieldPrefix: 'upper_',
                    titlePrefix: title({ field: continuousFieldName, aggregate: upperExtentOp, type: 'quantitative' }, config, {
                        allowDisabling: false
                    })
                },
                {
                    fieldPrefix: 'lower_',
                    titlePrefix: title({ field: continuousFieldName, aggregate: lowerExtentOp, type: 'quantitative' }, config, {
                        allowDisabling: false
                    })
                },
                {
                    fieldPrefix: 'center_',
                    titlePrefix: title({ field: continuousFieldName, aggregate: centerOp, type: 'quantitative' }, config, {
                        allowDisabling: false
                    })
                }
            ];
        }
    }
    else {
        if (markDef.center || markDef.extent) {
            log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
        }
        if (inputType === 'aggregated-upper-lower') {
            tooltipSummary = [];
            postAggregateCalculates = [
                { calculate: `datum.${continuousAxisChannelDef2.field}`, as: `upper_` + continuousFieldName },
                { calculate: `datum.${continuousFieldName}`, as: `lower_` + continuousFieldName }
            ];
        }
        else if (inputType === 'aggregated-error') {
            tooltipSummary = [{ fieldPrefix: '', titlePrefix: continuousFieldName }];
            postAggregateCalculates = [
                {
                    calculate: `datum.${continuousFieldName} + datum.${continuousAxisChannelDefError.field}`,
                    as: `upper_` + continuousFieldName
                }
            ];
            if (continuousAxisChannelDefError2) {
                postAggregateCalculates.push({
                    calculate: `datum.${continuousFieldName} + datum.${continuousAxisChannelDefError2.field}`,
                    as: `lower_` + continuousFieldName
                });
            }
            else {
                postAggregateCalculates.push({
                    calculate: `datum.${continuousFieldName} - datum.${continuousAxisChannelDefError.field}`,
                    as: `lower_` + continuousFieldName
                });
            }
        }
        for (const postAggregateCalculate of postAggregateCalculates) {
            tooltipSummary.push({
                fieldPrefix: postAggregateCalculate.as.substring(0, 6),
                titlePrefix: postAggregateCalculate.calculate.replace(new RegExp('datum.', 'g'), '')
            });
        }
    }
    return { postAggregateCalculates, errorBarSpecificAggregate, tooltipSummary, tooltipTitleWithFieldName };
}
function getTitlePrefix(center, extent, operation) {
    return titlecase(center) + ' ' + operation + ' ' + extent;
}
//# sourceMappingURL=errorbar.js.map