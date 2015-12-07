var channel_1 = require('./channel');
function countRetinal(encoding) {
    var count = 0;
    if (encoding.color) {
        count++;
    }
    if (encoding.size) {
        count++;
    }
    if (encoding.shape) {
        count++;
    }
    return count;
}
exports.countRetinal = countRetinal;
function has(encoding, channel) {
    var fieldDef = encoding && encoding[channel];
    return fieldDef && fieldDef.field;
}
exports.has = has;
function isAggregate(encoding) {
    for (var k in encoding) {
        if (has(encoding, k) && encoding[k].aggregate) {
            return true;
        }
    }
    return false;
}
exports.isAggregate = isAggregate;
function fieldDefs(encoding) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (k) {
        if (has(encoding, k)) {
            arr.push(encoding[k]);
        }
    });
    return arr;
}
exports.fieldDefs = fieldDefs;
;
function forEach(encoding, f) {
    var i = 0;
    channel_1.CHANNELS.forEach(function (channel) {
        if (has(encoding, channel)) {
            f(encoding[channel], channel, i++);
        }
    });
}
exports.forEach = forEach;
function map(encoding, f) {
    var arr = [];
    channel_1.CHANNELS.forEach(function (k) {
        if (has(encoding, k)) {
            arr.push(f(encoding[k], k, encoding));
        }
    });
    return arr;
}
exports.map = map;
function reduce(encoding, f, init) {
    var r = init;
    channel_1.CHANNELS.forEach(function (k) {
        if (has(encoding, k)) {
            r = f(r, encoding[k], k, encoding);
        }
    });
    return r;
}
exports.reduce = reduce;
//# sourceMappingURL=encoding.js.map