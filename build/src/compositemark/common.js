"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = tslib_1.__importStar(require("../log"));
var mark_1 = require("../mark");
function makeCompositeAggregatePartFactory(compositeMarkDef, continuousAxis, continuousAxisChannelDef, sharedEncoding, compositeMarkConfig) {
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
            encoding: tslib_1.__assign((_a = {}, _a[continuousAxis] = tslib_1.__assign({ field: positionPrefix + '_' + continuousAxisChannelDef.field, type: continuousAxisChannelDef.type }, (title ? { title: title } : {}), (scale ? { scale: scale } : {}), (axis ? { axis: axis } : {})), _a), (vega_util_1.isString(endPositionPrefix)
                ? (_b = {},
                    _b[continuousAxis + '2'] = {
                        field: endPositionPrefix + '_' + continuousAxisChannelDef.field,
                        type: continuousAxisChannelDef.type
                    },
                    _b) : {}), sharedEncoding, extraEncoding)
        });
    };
}
exports.makeCompositeAggregatePartFactory = makeCompositeAggregatePartFactory;
function partLayerMixins(markDef, part, compositeMarkConfig, partBaseSpec) {
    var color = markDef.color, opacity = markDef.opacity;
    var mark = markDef.type;
    if (markDef[part] || (markDef[part] === undefined && compositeMarkConfig[part])) {
        return [
            tslib_1.__assign({}, partBaseSpec, { mark: tslib_1.__assign({}, compositeMarkConfig[part], (color ? { color: color } : {}), (opacity ? { opacity: opacity } : {}), (mark_1.isMarkDef(partBaseSpec.mark) ? partBaseSpec.mark : { type: partBaseSpec.mark }), { style: mark + "-" + part }, (vega_util_1.isBoolean(markDef[part]) ? {} : markDef[part])) })
        ];
    }
    return [];
}
exports.partLayerMixins = partLayerMixins;
function compositeMarkContinuousAxis(spec, orient, compositeMark) {
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
exports.compositeMarkContinuousAxis = compositeMarkContinuousAxis;
function compositeMarkOrient(spec, compositeMark) {
    var mark = spec.mark, encoding = spec.encoding;
    if (fielddef_1.isFieldDef(encoding.x) && fielddef_1.isContinuous(encoding.x)) {
        // x is continuous
        if (fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y)) {
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
                if (mark_1.isMarkDef(mark) && mark.orient) {
                    return mark.orient;
                }
                // default orientation = vertical
                return 'vertical';
            }
        }
        // x is continuous but y is not
        return 'horizontal';
    }
    else if (fielddef_1.isFieldDef(encoding.y) && fielddef_1.isContinuous(encoding.y)) {
        // y is continuous but x is not
        return 'vertical';
    }
    else {
        // Neither x nor y is continuous.
        throw new Error('Need a valid continuous axis for ' + compositeMark + 's');
    }
}
exports.compositeMarkOrient = compositeMarkOrient;
function filterUnsupportedChannels(spec, supportedChannels, compositeMark) {
    return tslib_1.__assign({}, spec, { encoding: encoding_1.reduce(spec.encoding, function (newEncoding, fieldDef, channel) {
            if (supportedChannels.indexOf(channel) > -1) {
                newEncoding[channel] = fieldDef;
            }
            else {
                log.warn(log.message.incompatibleChannel(channel, compositeMark));
            }
            return newEncoding;
        }, {}) });
}
exports.filterUnsupportedChannels = filterUnsupportedChannels;
//# sourceMappingURL=common.js.map