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
function errorBarOrientAndRange(spec, compositeMark) {
    var encoding = spec.encoding;
    if (isFieldDef(encoding.x2) && isFieldDef(encoding.x) && isContinuous(encoding.x)) {
        // having x and x2
        if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
            // having both x, x2 and y, y2
            throw new Error('Cannot have both x2 and y2 with both are quantiative');
        }
        else {
            // having x, x2 but not y, y2
            return { orient: 'horizontal', isRangedErrorBar: true };
        }
    }
    else if (isFieldDef(encoding.y2) && isFieldDef(encoding.y) && isContinuous(encoding.y)) {
        // having y, y2 but not x, x2
        return { orient: 'vertical', isRangedErrorBar: true };
    }
    return {
        orient: compositeMarkOrient(spec, compositeMark),
        isRangedErrorBar: false
    };
}
export var errorBarSupportedChannels = ['x', 'y', 'x2', 'y2', 'color', 'detail', 'opacity'];
export function errorBarParams(spec, compositeMark, config) {
    spec = filterUnsupportedChannels(spec, errorBarSupportedChannels, compositeMark);
    // TODO: use selection
    var mark = spec.mark, encoding = spec.encoding, selection = spec.selection, _p = spec.projection, outerSpec = tslib_1.__rest(spec, ["mark", "encoding", "selection", "projection"]);
    var markDef = isMarkDef(mark) ? mark : { type: mark };
    // TODO(https://github.com/vega/vega-lite/issues/3702): add selection support
    if (selection) {
        log.warn(log.message.selectionNotSupported(compositeMark));
    }
    var _a = errorBarOrientAndRange(spec, compositeMark), orient = _a.orient, isRangedErrorBar = _a.isRangedErrorBar;
    var _b = compositeMarkContinuousAxis(spec, orient, compositeMark), continuousAxisChannelDef = _b.continuousAxisChannelDef, continuousAxisChannelDef2 = _b.continuousAxisChannelDef2, continuousAxis = _b.continuousAxis;
    var _c = errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, isRangedErrorBar, compositeMark, config), errorBarSpecificAggregate = _c.errorBarSpecificAggregate, postAggregateCalculates = _c.postAggregateCalculates;
    var _d = continuousAxis, oldContinuousAxisChannelDef = encoding[_d], _e = continuousAxis + '2', oldContinuousAxisChannelDef2 = encoding[_e], oldEncodingWithoutContinuousAxis = tslib_1.__rest(encoding, [typeof _d === "symbol" ? _d : _d + "", typeof _e === "symbol" ? _e : _e + ""]);
    var _f = extractTransformsFromEncoding(oldEncodingWithoutContinuousAxis, config), bins = _f.bins, timeUnits = _f.timeUnits, oldAggregate = _f.aggregate, oldGroupBy = _f.groupby, encodingWithoutContinuousAxis = _f.encoding;
    var aggregate = oldAggregate.concat(errorBarSpecificAggregate);
    var groupby = isRangedErrorBar ? [] : oldGroupBy;
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
function errorBarAggregationAndCalculation(markDef, continuousAxisChannelDef, continuousAxisChannelDef2, isRangedErrorBar, compositeMark, config) {
    var errorBarSpecificAggregate = [];
    var postAggregateCalculates = [];
    var continuousFieldName = continuousAxisChannelDef.field;
    if (isRangedErrorBar) {
        if (markDef.center || markDef.extent) {
            log.warn(log.message.errorBarCenterAndExtentAreNotNeeded(markDef.center, markDef.extent));
        }
        postAggregateCalculates = [
            {
                calculate: "datum." + continuousFieldName,
                as: "lower_" + continuousFieldName
            },
            {
                calculate: "datum." + continuousAxisChannelDef2.field,
                as: "upper_" + continuousFieldName
            }
        ];
    }
    else {
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
                {
                    op: extent,
                    field: continuousFieldName,
                    as: 'extent_' + continuousFieldName
                },
                {
                    op: center,
                    field: continuousFieldName,
                    as: 'center_' + continuousFieldName
                }
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
                {
                    op: extent === 'ci' ? 'ci0' : 'q1',
                    field: continuousFieldName,
                    as: 'lower_' + continuousFieldName
                },
                {
                    op: extent === 'ci' ? 'ci1' : 'q3',
                    field: continuousFieldName,
                    as: 'upper_' + continuousFieldName
                }
            ];
        }
    }
    return { postAggregateCalculates: postAggregateCalculates, errorBarSpecificAggregate: errorBarSpecificAggregate };
}
//# sourceMappingURL=errorbar.js.map