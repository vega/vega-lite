import * as tslib_1 from "tslib";
import { isBoolean, isString } from 'vega-util';
import { reduce } from '../encoding';
import { isContinuous, isFieldDef } from '../fielddef';
import * as log from '../log';
import { isMarkDef } from '../mark';
export function makeCompositeAggregatePartFactory(compositeMarkDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, compositeMarkConfig) {
    var scale = continuousAxisChannelDef.scale, axis = continuousAxisChannelDef.axis;
    return function (partName, mark, positionPrefix, endPositionPrefix, extraEncoding) {
        if (endPositionPrefix === void 0) { endPositionPrefix = undefined; }
        if (extraEncoding === void 0) { extraEncoding = {}; }
        var _a, _b;
        var title = axis && axis.title !== undefined
            ? undefined
            : continuousAxisChannelDef.title !== undefined
                ? continuousAxisChannelDef.title
                : continuousAxisChannelDef.field;
        return partLayerMixins(compositeMarkDef, partName, compositeMarkConfig, {
            mark: mark,
            encoding: tslib_1.__assign((_a = {}, _a[continuousAxis] = tslib_1.__assign({ field: positionPrefix + '_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, (title ? { title: title } : {}), (scale ? { scale: scale } : {}), (axis ? { axis: axis } : {})), _a), (isString(endPositionPrefix)
                ? (_b = {},
                    _b[continuousAxis + '2'] = {
                        field: endPositionPrefix + '_' + continuousAxisChannelDef.field,
                        type: continuousAxisChannelDef.type
                    },
                    _b) : {}), sharedEncoding, extraEncoding)
        });
    };
}
export function partLayerMixins(markDef, part, compositeMarkConfig, partBaseSpec) {
    var color = markDef.color, opacity = markDef.opacity;
    var mark = markDef.type;
    if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
        return [
            tslib_1.__assign({}, partBaseSpec, { mark: tslib_1.__assign({}, compositeMarkConfig[part], (color ? { color: color } : {}), (opacity ? { opacity: opacity } : {}), (isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : { type: partBaseSpec.mark }), { style: mark + "-" + part }, (isBoolean(markDef[part]) ? {} : markDef[part])) })
        ];
    }
    return [];
}
export function compositeMarkContinuousAxis(spec, orient, compositeMark) {
    var encoding = spec.encoding;
    var continuousAxisChannelDef;
    var continuousAxisChannelDef2;
    var continuousAxis;
    if (orient === 'vertical') {
        continuousAxis = 'y';
        continuousAxisChannelDef = encoding.y; // Safe to cast because if y is not continuous fielddef, the orient would not be vertical.
        continuousAxisChannelDef2 = encoding.y2 ? encoding.y2 : undefined;
    }
    else {
        continuousAxis = 'x';
        continuousAxisChannelDef = encoding.x; // Safe to cast because if x is not continuous fielddef, the orient would not be horizontal.
        continuousAxisChannelDef2 = encoding.x2 ? encoding.x2 : undefined;
    }
    if (continuousAxisChannelDef && continuousAxisChannelDef.aggregate) {
        var aggregate = continuousAxisChannelDef.aggregate, continuousAxisWithoutAggregate = tslib_1.__rest(continuousAxisChannelDef, ["aggregate"]);
        if (aggregate !== compositeMark) {
            log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
        }
        continuousAxisChannelDef = continuousAxisWithoutAggregate;
    }
    if (continuousAxisChannelDef2 && continuousAxisChannelDef2.aggregate) {
        var aggregate = continuousAxisChannelDef2.aggregate, continuousAxisWithoutAggregate2 = tslib_1.__rest(continuousAxisChannelDef2, ["aggregate"]);
        if (aggregate !== compositeMark) {
            log.warn(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, compositeMark));
        }
        continuousAxisChannelDef2 = continuousAxisWithoutAggregate2;
    }
    return {
        continuousAxisChannelDef: continuousAxisChannelDef,
        continuousAxisChannelDef2: continuousAxisChannelDef2,
        continuousAxis: continuousAxis
    };
}
export function compositeMarkOrient(spec, compositeMark) {
    var mark = spec.mark, encoding = spec.encoding;
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
export function filterUnsupportedChannels(spec, supportedChannels, compositeMark) {
    return tslib_1.__assign({}, spec, { encoding: reduce(spec.encoding, function (newEncoding, fieldDef, channel) {
            if (supportedChannels.indexOf(channel) > -1) {
                newEncoding[channel] = fieldDef;
            }
            else {
                log.warn(log.message.incompatibleChannel(channel, compositeMark));
            }
            return newEncoding;
        }, {}) });
}
//# sourceMappingURL=common.js.map