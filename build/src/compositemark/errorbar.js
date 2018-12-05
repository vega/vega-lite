import * as tslib_1 from "tslib";
import { extractTransformsFromEncoding } from '../encoding';
import { isContinuous, isFieldDef } from '../fielddef';
import * as log from '../log';
import { isMarkDef } from '../mark';
import { keys } from '../util';
import { compositeMarkContinuousAxis, compositeMarkOrient, filterUnsupportedChannels, makeCompositeAggregatePartFactory } from './common';
export var ERRORBAR = 'errorbar';
var ERRORBAR_PART_INDEX = {
    ticks: 1,
    rule: 1
};
export var ERRORBAR_PARTS = keys(ERRORBAR_PART_INDEX);
export function normalizeErrorBar(spec, config) {
    var _a = errorBarParams(spec, ERRORBAR, config), transform = _a.transform, continuousAxisChannelDef = _a.continuousAxisChannelDef, continuousAxis = _a.continuousAxis, encodingWithoutContinuousAxis = _a.encodingWithoutContinuousAxis, ticksOrient = _a.ticksOrient, markDef = _a.markDef, outerSpec = _a.outerSpec;
    var makeErrorBarPart = makeCompositeAggregatePartFactory(markDef, continuousAxis, continuousAxisChannelDef, encodingWithoutContinuousAxis, config.errorbar);
    var tick = { type: 'tick', orient: ticksOrient };
    return tslib_1.__assign({}, outerSpec, { transform: transform, layer: makeErrorBarPart('ticks', tick, 'lower').concat(makeErrorBarPart('ticks', tick, 'upper'), makeErrorBarPart('rule', 'rule', 'lower', 'upper')) });
}
function errorBarOrientAndInputType(spec, compositeMark) {
    var encoding = spec.encoding;
    if (errorBarIsInputTypeRaw(encoding)) {
        return {
            orient: compositeMarkOrient(spec, compositeMark),
            inputType: 'raw'
        };
    }
    var isTypeAggregatedUpperLower = errorBarIsInputTypeAggregatedUpperLower(encoding);
    var isTypeAggregatedError = errorBarIsInputTypeAggregatedError(encoding);
    var x = encoding.x;
    var y = encoding.y;
    if (isTypeAggregatedUpperLower) {
        // type is aggregated-upper-lower
        if (isTypeAggregatedError) {
            throw new Error(compositeMark + ' cannot be both type aggregated-upper-lower and aggregated-error');
        }
        var x2 = encoding.x2;
        var y2 = encoding.y2;
        if (isFieldDef(x2) && isFieldDef(y2)) {
            // having both x, x2 and y, y2
            throw new Error(compositeMark + ' cannot have both x2 and y2');
        }
        else if (isFieldDef(x2)) {
            if (isContinuous(x2) && isFieldDef(x) && isContinuous(x)) {
                // having x, x2 quantitative and field y, y2 are not specified
                return { orient: 'horizontal', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having x, x2 that are not both quantitative
                throw new Error('Both x and x2 have to be quantitative in ' + compositeMark);
            }
        }
        else {
            // y2 is a FieldDef
            if (isContinuous(y2) && isFieldDef(y) && isContinuous(y)) {
                // having y, y2 quantitative and field x, x2 are not specified
                return { orient: 'vertical', inputType: 'aggregated-upper-lower' };
            }
            else {
                // having y, y2 that are not both quantitative
                throw new Error('Both y and y2 have to be quantitative in ' + compositeMark);
            }
        }
    }
    else {
        // type is aggregated-error
        var xError = encoding.xError;
        var xError2 = encoding.xError2;
        var yError = encoding.yError;
        var yError2 = encoding.yError2;
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
            if (isContinuous(xError) && isFieldDef(x) && isContinuous(x) && (!isFieldDef(xError2) || isContinuous(xError2))) {
                // having x, xError, xError2 that are all quantitative, or x and xError that are quantitative without xError2
                return { orient: 'horizontal', inputType: 'aggregated-error' };
            }
            else {
                // having x, xError, and xError2 that are not all quantitative
                throw new Error('All x, xError, and xError2 (if exist) have to be quantitative');
            }
        }
        else {
            if (isContinuous(yError) &&
                isFieldDef(y) &&
                isContinuous(y) &&
                (!isFieldDef(yError2) || isContinuous(yError2))) {
                // having y, yError, yError2 that are all quantitative, or y and yError that are quantitative without yError2
                return { orient: 'vertical', inputType: 'aggregated-error' };
            }
            else {
                // having y, yError, and yError2 that are not all quantitative
                throw new Error('All y, yError, and yError2 (if exist) have to be quantitative');
            }
        }
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
export var errorBarSupportedChannels = [
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
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    var markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported(compositeMark));
    }
    var _a = errorBarOrientAndInputType(spec, compositeMark), orient = _a.orient, inputType = _a.inputType;
    var _b = compositeMarkContinuousAxis(spec, orient, compositeMark), continuousAxisChannelDef = _b.continuousAxisChannelDef, continuousAxisChannelDef2 = _b.continuousAxisChannelDef2, continuousAxisChannelDefError = _b.continuousAxisChannelDefError, continuousAxisChannelDefError2 = _b.continuousAxisChannelDefError2, continuousAxis = _b.continuousAxis;
    var _c = errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config), errorBarSpecificAggregate = _c.errorBarSpecificAggregate, postAggregateCalculates = _c.postAggregateCalculates;
    var _d = continuousAxis, oldContinuousAxisChannelDef = encoding[_d], _e = continuousAxis + '2', oldContinuousAxisChannelDef2 = encoding[_e], _f = continuousAxis + 'Error', oldContinuousAxisChannelDefError = encoding[_f], _g = continuousAxis + 'Error2', oldContinuousAxisChannelDefError2 = encoding[_g], oldEncodingWithoutContinuousAxis = tslib_1.__rest(encoding, [typeof _d === "symbol" ? _d : _d + "", typeof _e === "symbol" ? _e : _e + "", typeof _f === "symbol" ? _f : _f + "", typeof _g === "symbol" ? _g : _g + ""]);
    var _h = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config), bins = _h.bins, timeUnits = _h.timeUnits, oldAggregate = _h.aggregate, oldGroupBy = _h.groupby, encodingWithoutContinuousAxis = _h.encoding;
    var aggregate = oldAggregate.concat(errorBarSpecificAggregate);
    var groupby = inputType !== 'raw' ? [] : oldGroupBy;
    return {
        transform: (outerSpec.transform || []).concat(bins, timeUnits, (!aggregate.length ? [] : [{ aggregate: aggregate, groupby: groupby }]), postAggregateCalculates),
        groupby: groupby,
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxis: continuousAxis,
        encodingWithoutContinuousAxis: encodingWithoutContinuousAxis,
        ticksOrient: orient === 'vertical' ? 'horizontal' : 'vertical',
        markDef: markDef,
        outerSpec: outerSpec
    };
}
function errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, continuousAxisChannelDefError, continuousAxisChannelDefError2, inputType, compositeMark, config) {
    var errorBarSpecificAggregate = [];
    var postAggregateCalculates = [];
    var continuousFieldName = continuousAxisChannelDef.field;
    if (inputType === 'raw') {
        var center = markDef.center
            ? markDef.center
            : markDef.extent
                ? markDef.extent === 'iqr'
                    ? 'median'
                    : 'mean'
                : config.errorbar.center;
        var extent = markDef.extent ? markDef.extent : center === 'mean' ? 'stderr' : 'iqr';
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
                    calculate: "datum.center_" + continuousFieldName + " + datum.extent_" + continuousFieldName,
                    as: 'upper_' + continuousFieldName
                },
                {
                    calculate: "datum.center_" + continuousFieldName + " - datum.extent_" + continuousFieldName,
                    as: 'lower_' + continuousFieldName
                }
            ];
        }
        else {
            if (markDef.center && markDef.extent) {
                log.warn(log.message.errorBarCenterIsNotNeeded(markDef.extent, compositeMark));
            }
            errorBarSpecificAggregate = [
                { op: extent === 'ci' ? 'ci0' : 'q1', field: continuousFieldName, as: 'lower_' + continuousFieldName },
                { op: extent === 'ci' ? 'ci1' : 'q3', field: continuousFieldName, as: 'upper_' + continuousFieldName }
            ];
        }
    }
    else {
        if (markDef.center || markDef.extent) {
            log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
        }
        if (inputType === 'aggregated-upper-lower') {
            postAggregateCalculates = [
                { calculate: "datum." + continuousFieldName, as: "lower_" + continuousFieldName },
                { calculate: "datum." + continuousAxisChannelDef2.field, as: "upper_" + continuousFieldName }
            ];
        }
        else if (inputType === 'aggregated-error') {
            postAggregateCalculates = [
                {
                    calculate: "datum." + continuousFieldName + " + datum." + continuousAxisChannelDefError.field,
                    as: "upper_" + continuousFieldName
                }
            ];
            if (continuousAxisChannelDefError2) {
                postAggregateCalculates.push({
                    calculate: "datum." + continuousFieldName + " + datum." + continuousAxisChannelDefError2.field,
                    as: "lower_" + continuousFieldName
                });
            }
            else {
                postAggregateCalculates.push({
                    calculate: "datum." + continuousFieldName + " - datum." + continuousAxisChannelDefError.field,
                    as: "lower_" + continuousFieldName
                });
            }
        }
    }
    return { postAggregateCalculates: postAggregateCalculates, errorBarSpecificAggregate: errorBarSpecificAggregate };
}
//# sourceMappingURL=errorbar.js.map