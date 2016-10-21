"use strict";
var channel_1 = require('../channel');
var config_1 = require('../config');
var encoding_1 = require('../encoding');
var fielddef_1 = require('../fielddef');
var mark_1 = require('../mark');
var scale_1 = require('../scale');
var type_1 = require('../type');
var util_1 = require('../util');
var scale_2 = require('../compile/scale');
function initMarkConfig(mark, encoding, stacked, config) {
    return util_1.extend(['filled', 'opacity', 'orient', 'align'].reduce(function (cfg, property) {
        var value = config.mark[property];
        switch (property) {
            case 'filled':
                if (value === undefined) {
                    cfg[property] = mark !== mark_1.POINT && mark !== mark_1.LINE && mark !== mark_1.RULE;
                }
                break;
            case 'opacity':
                if (value === undefined) {
                    if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], mark)) {
                        if (!encoding_1.isAggregate(encoding) || encoding_1.has(encoding, channel_1.DETAIL)) {
                            cfg[property] = 0.7;
                        }
                    }
                    if (mark === mark_1.BAR && !stacked) {
                        if (encoding_1.has(encoding, channel_1.COLOR) || encoding_1.has(encoding, channel_1.DETAIL) || encoding_1.has(encoding, channel_1.SIZE)) {
                            cfg[property] = 0.7;
                        }
                    }
                    if (mark === mark_1.AREA) {
                        cfg[property] = 0.7;
                    }
                }
                break;
            case 'orient':
                cfg[property] = orient(mark, encoding, config.mark);
                break;
            case 'align':
                if (value === undefined) {
                    cfg[property] = encoding_1.has(encoding, channel_1.X) ? 'center' : 'right';
                }
        }
        return cfg;
    }, {}), config.mark);
}
exports.initMarkConfig = initMarkConfig;
function orient(mark, encoding, markConfig) {
    if (markConfig === void 0) { markConfig = {}; }
    switch (mark) {
        case mark_1.POINT:
        case mark_1.CIRCLE:
        case mark_1.SQUARE:
        case mark_1.TEXT:
            return undefined;
    }
    var yIsRange = encoding.y && encoding.y2;
    var xIsRange = encoding.x && encoding.x2;
    switch (mark) {
        case mark_1.TICK:
            var xScaleType = encoding.x ? scale_2.scaleType(encoding.x.scale || {}, encoding.x, channel_1.X, mark) : null;
            var yScaleType = encoding.y ? scale_2.scaleType(encoding.y.scale || {}, encoding.y, channel_1.Y, mark) : null;
            if (xScaleType !== scale_1.ScaleType.ORDINAL && (!encoding.y ||
                yScaleType === scale_1.ScaleType.ORDINAL) ||
                encoding.y.bin) {
                return config_1.Orient.VERTICAL;
            }
            return config_1.Orient.HORIZONTAL;
        case mark_1.RULE:
            if (xIsRange) {
                return config_1.Orient.HORIZONTAL;
            }
            if (yIsRange) {
                return config_1.Orient.VERTICAL;
            }
            if (encoding.y) {
                return config_1.Orient.HORIZONTAL;
            }
            if (encoding.x) {
                return config_1.Orient.VERTICAL;
            }
            return undefined;
        case mark_1.BAR:
        case mark_1.AREA:
            if (yIsRange) {
                return config_1.Orient.VERTICAL;
            }
            if (xIsRange) {
                return config_1.Orient.HORIZONTAL;
            }
        case mark_1.LINE:
            var xIsMeasure = fielddef_1.isMeasure(encoding.x) || fielddef_1.isMeasure(encoding.x2);
            var yIsMeasure = fielddef_1.isMeasure(encoding.y) || fielddef_1.isMeasure(encoding.y2);
            if (xIsMeasure && !yIsMeasure) {
                return config_1.Orient.HORIZONTAL;
            }
            else if (!xIsMeasure && yIsMeasure) {
                return config_1.Orient.VERTICAL;
            }
            else if (xIsMeasure && yIsMeasure) {
                if (encoding.x.type === type_1.TEMPORAL) {
                    return config_1.Orient.VERTICAL;
                }
                else if (encoding.y.type === type_1.TEMPORAL) {
                    return config_1.Orient.HORIZONTAL;
                }
            }
            return config_1.Orient.VERTICAL;
    }
    console.warn('orient unimplemented for mark', mark);
    return config_1.Orient.VERTICAL;
}
exports.orient = orient;
//# sourceMappingURL=config.js.map