var util = require('../util');
var channel_1 = require('../channel');
function cardinality(fieldDef, stats, filterNull, type) {
    var timeUnit = fieldDef.timeUnit;
    switch (timeUnit) {
        case 'seconds': return 60;
        case 'minutes': return 60;
        case 'hours': return 24;
        case 'day': return 7;
        case 'date': return 31;
        case 'month': return 12;
        case 'year':
            var stat = stats[fieldDef.field], yearstat = stats['year_' + fieldDef.field];
            if (!yearstat) {
                return null;
            }
            return yearstat.distinct -
                (stat.missing > 0 && filterNull[type] ? 1 : 0);
    }
    return null;
}
exports.cardinality = cardinality;
function formula(timeUnit, field) {
    var fn = 'utc' + timeUnit;
    return fn + '(' + field + ')';
}
exports.formula = formula;
var scale;
(function (scale) {
    function type(timeUnit, channel) {
        if (channel === channel_1.COLOR) {
            return 'linear';
        }
        if (channel === channel_1.COLUMN || channel === channel_1.ROW) {
            return 'ordinal';
        }
        switch (timeUnit) {
            case 'hours':
            case 'day':
            case 'date':
            case 'month':
                return 'ordinal';
            case 'year':
            case 'second':
            case 'minute':
                return 'linear';
        }
        return 'time';
    }
    scale.type = type;
    function domain(timeUnit, channel) {
        var isColor = channel === channel_1.COLOR;
        switch (timeUnit) {
            case 'seconds':
            case 'minutes': return isColor ? [0, 59] : util.range(0, 60);
            case 'hours': return isColor ? [0, 23] : util.range(0, 24);
            case 'day': return isColor ? [0, 6] : util.range(0, 7);
            case 'date': return isColor ? [1, 31] : util.range(1, 32);
            case 'month': return isColor ? [0, 11] : util.range(0, 12);
        }
        return null;
    }
    scale.domain = domain;
})(scale = exports.scale || (exports.scale = {}));
function labelTemplate(timeUnit, abbreviated) {
    if (abbreviated === void 0) { abbreviated = false; }
    var postfix = abbreviated ? '-abbrev' : '';
    switch (timeUnit) {
        case 'day':
            return 'day' + postfix;
        case 'month':
            return 'month' + postfix;
    }
    return null;
}
exports.labelTemplate = labelTemplate;
//# sourceMappingURL=time.js.map