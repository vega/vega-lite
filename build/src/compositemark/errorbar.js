import { isContinuousFieldOrDatumDef, isFieldOrDatumDef, title } from '../channeldef';
import { extractTransformsFromEncoding, normalizeEncoding } from '../encoding';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { replaceAll, titleCase } from '../util';
import { CompositeMarkNormalizer } from './base';
import { compositeMarkContinuousAxis, compositeMarkOrient, getCompositeMarkTooltip, makeCompositeAggregatePartFactory } from './common';
export const ERRORBAR = 'errorbar';
export const ERRORBAR_PARTS = ['ticks', 'rule'];
export const errorBarNormalizer = new CompositeMarkNormalizer(ERRORBAR, normalizeErrorBar);
export function normalizeErrorBar(spec, { config }) {
    // Need to initEncoding first so we can infer type
    spec = {
        ...spec,
        encoding: normalizeEncoding(spec.encoding, config)
    };
    const { transform, continuousAxisChannelDef, continuousAxis, encodingWithoutContinuousAxis, ticksOrient, markDef, outerSpec, tooltipEncoding } = errorBarParams(spec, ERRORBAR, config);
    delete encodingWithoutContinuousAxis['size'];
    const makeErrorBarPart = makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorbar);
    const thickness = markDef.thickness;
    const size = markDef.size;
    const tick = {
        type: 'tick',
        orient: ticksOrient,
        aria: false,
        ...(thickness !== undefined ? { thickness } : {}),
        ...(size !== undefined ? { size } : {})
    };
    const layer = [
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
            mark: {
                type: 'rule',
                ariaRoleDescription: 'errorbar',
                ...(thickness !== undefined ? { size: thickness } : {})
            },
            positionPrefix: 'lower',
            endPositionPrefix: 'upper',
            extraEncoding: tooltipEncoding
        })
    ];
    return {
        ...outerSpec,
        transform,
        ...(layer.length > 1 ? { layer } : { ...layer[0] })
    };
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
            throw new Error(`${compositeMark} cannot be both type aggregated-upper-lower and aggregated-error`);
        }
        const x2 = encoding.x2;
        const y2 = encoding.y2;
        if (isFieldOrDatumDef(x2) && isFieldOrDatumDef(y2)) {
            // having both x, x2 and y, y2
            throw new Error(`${compositeMark} cannot have both x2 and y2`);
        }
        else if (isFieldOrDatumDef(x2)) {
            if (isContinuousFieldOrDatumDef(x)) {
                // having x, x2 quantitative and field y, y2 are not specified
                return { orient: 'horizontal', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having x, x2 that are not both quantitative
                throw new Error(`Both x and x2 have to be quantitative in ${compositeMark}`);
            }
        }
        else if (isFieldOrDatumDef(y2)) {
            // y2 is a FieldDef
            if (isContinuousFieldOrDatumDef(y)) {
                // having y, y2 quantitative and field x, x2 are not specified
                return { orient: 'vertical', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having y, y2 that are not both quantitative
                throw new Error(`Both y and y2 have to be quantitative in ${compositeMark}`);
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
        if (isFieldOrDatumDef(xError2) && !isFieldOrDatumDef(xError)) {
            // having xError2 without xError
            throw new Error(`${compositeMark} cannot have xError2 without xError`);
        }
        if (isFieldOrDatumDef(yError2) && !isFieldOrDatumDef(yError)) {
            // having yError2 without yError
            throw new Error(`${compositeMark} cannot have yError2 without yError`);
        }
        if (isFieldOrDatumDef(xError) && isFieldOrDatumDef(yError)) {
            // having both xError and yError
            throw new Error(`${compositeMark} cannot have both xError and yError with both are quantiative`);
        }
        else if (isFieldOrDatumDef(xError)) {
            if (isContinuousFieldOrDatumDef(x)) {
                // having x and xError that are all quantitative
                return { orient: 'horizontal', inputType: 'aggregated-error' };
            }
            else {
                // having x, xError, and xError2 that are not all quantitative
                throw new Error('All x, xError, and xError2 (if exist) have to be quantitative');
            }
        }
        else if (isFieldOrDatumDef(yError)) {
            if (isContinuousFieldOrDatumDef(y)) {
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
    return ((isFieldOrDatumDef(encoding.x) || isFieldOrDatumDef(encoding.y)) &&
        !isFieldOrDatumDef(encoding.x2) &&
        !isFieldOrDatumDef(encoding.y2) &&
        !isFieldOrDatumDef(encoding.xError) &&
        !isFieldOrDatumDef(encoding.xError2) &&
        !isFieldOrDatumDef(encoding.yError) &&
        !isFieldOrDatumDef(encoding.yError2));
}
function errorBarIsInputTypeAggregatedUpperLower(encoding) {
    return isFieldOrDatumDef(encoding.x2) || isFieldOrDatumDef(encoding.y2);
}
function errorBarIsInputTypeAggregatedError(encoding) {
    return (isFieldOrDatumDef(encoding.xError) ||
        isFieldOrDatumDef(encoding.xError2) ||
        isFieldOrDatumDef(encoding.yError) ||
        isFieldOrDatumDef(encoding.yError2));
}
export function errorBarParams(spec, compositeMark, config) {
    // TODO: use selection
    const { mark, encoding, params, projection: _p, ...outerSpec } = spec;
    const markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (params) {
        log.warn(log.message.selectionNotSupported(compositeMark));
    }
    const { orient, inputType } = errorBarOrientAndInputType(spec, compositeMark);
    const { continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, continuousAxis } = compositeMarkContinuousAxis(spec, orient, compositeMark);
    const { errorBarSpecificAggregate, postAggregateCalculates, tooltipSummary, tooltipTitleWithFieldName } = errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config);
    const { [continuousAxis]: oldContinuousAxisChannelDef, [continuousAxis === 'x' ? 'x2' : 'y2']: oldContinuousAxisChannelDef2, [continuousAxis === 'x' ? 'xError' : 'yError']: oldContinuousAxisChannelDefError, [continuousAxis === 'x' ? 'xError2' : 'yError2']: oldContinuousAxisChannelDefError2, ...oldEncodingWithoutContinuousAxis } = encoding;
    const { bins, timeUnits, aggregate: oldAggregate, groupby: oldGroupBy, encoding: encodingWithoutContinuousAxis } = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config);
    const aggregate = [...oldAggregate, ...errorBarSpecificAggregate];
    const groupby = inputType !== 'raw' ? [] : oldGroupBy;
    const tooltipEncoding = getCompositeMarkTooltip(tooltipSummary, continuousAxisChannelDef, encodingWithoutContinuousAxis, tooltipTitleWithFieldName);
    return {
        transform: [
            ...(outerSpec.transform ?? []),
            ...bins,
            ...timeUnits,
            ...(aggregate.length === 0 ? [] : [{ aggregate, groupby }]),
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
                { op: extent, field: continuousFieldName, as: `extent_${continuousFieldName}` },
                { op: center, field: continuousFieldName, as: `center_${continuousFieldName}` }
            ];
            postAggregateCalculates = [
                {
                    calculate: `datum["center_${continuousFieldName}"] + datum["extent_${continuousFieldName}"]`,
                    as: `upper_${continuousFieldName}`
                },
                {
                    calculate: `datum["center_${continuousFieldName}"] - datum["extent_${continuousFieldName}"]`,
                    as: `lower_${continuousFieldName}`
                }
            ];
            tooltipSummary = [
                { fieldPrefix: 'center_', titlePrefix: titleCase(center) },
                { fieldPrefix: 'upper_', titlePrefix: getTitlePrefix(center, extent, '+') },
                { fieldPrefix: 'lower_', titlePrefix: getTitlePrefix(center, extent, '-') }
            ];
            tooltipTitleWithFieldName = true;
        }
        else {
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
                { op: lowerExtentOp, field: continuousFieldName, as: `lower_${continuousFieldName}` },
                { op: upperExtentOp, field: continuousFieldName, as: `upper_${continuousFieldName}` },
                { op: centerOp, field: continuousFieldName, as: `center_${continuousFieldName}` }
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
                { calculate: `datum["${continuousAxisChannelDef2.field}"]`, as: `upper_${continuousFieldName}` },
                { calculate: `datum["${continuousFieldName}"]`, as: `lower_${continuousFieldName}` }
            ];
        }
        else if (inputType === 'aggregated-error') {
            tooltipSummary = [{ fieldPrefix: '', titlePrefix: continuousFieldName }];
            postAggregateCalculates = [
                {
                    calculate: `datum["${continuousFieldName}"] + datum["${continuousAxisChannelDefError.field}"]`,
                    as: `upper_${continuousFieldName}`
                }
            ];
            if (continuousAxisChannelDefError2) {
                postAggregateCalculates.push({
                    calculate: `datum["${continuousFieldName}"] + datum["${continuousAxisChannelDefError2.field}"]`,
                    as: `lower_${continuousFieldName}`
                });
            }
            else {
                postAggregateCalculates.push({
                    calculate: `datum["${continuousFieldName}"] - datum["${continuousAxisChannelDefError.field}"]`,
                    as: `lower_${continuousFieldName}`
                });
            }
        }
        for (const postAggregateCalculate of postAggregateCalculates) {
            tooltipSummary.push({
                fieldPrefix: postAggregateCalculate.as.substring(0, 6),
                titlePrefix: replaceAll(replaceAll(postAggregateCalculate.calculate, 'datum["', ''), '"]', '')
            });
        }
    }
    return { postAggregateCalculates, errorBarSpecificAggregate, tooltipSummary, tooltipTitleWithFieldName };
}
function getTitlePrefix(center, extent, operation) {
    return `${titleCase(center)} ${operation} ${extent}`;
}
//# sourceMappingURL=errorbar.js.map