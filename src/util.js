function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('datalib/src/util'));
__export(require('datalib/src/generate'));
__export(require('datalib/src/stats'));
function contains(array, item) {
    return array.indexOf(item) > -1;
}
exports.contains = contains;
function forEach(obj, f, thisArg) {
    if (obj.forEach) {
        obj.forEach.call(thisArg, f);
    }
    else {
        for (var k in obj) {
            f.call(thisArg, obj[k], k, obj);
        }
    }
}
exports.forEach = forEach;
function reduce(obj, f, init, thisArg) {
    if (obj.reduce) {
        return obj.reduce.call(thisArg, f, init);
    }
    else {
        for (var k in obj) {
            init = f.call(thisArg, init, obj[k], k, obj);
        }
        return init;
    }
}
exports.reduce = reduce;
function map(obj, f, thisArg) {
    if (obj.map) {
        return obj.map.call(thisArg, f);
    }
    else {
        var output = [];
        for (var k in obj) {
            output.push(f.call(thisArg, obj[k], k, obj));
        }
        return output;
    }
}
exports.map = map;
function any(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (f(arr[k], k, i++))
            return true;
    }
    return false;
}
exports.any = any;
function all(arr, f) {
    var i = 0, k;
    for (k in arr) {
        if (!f(arr[k], k, i++))
            return false;
    }
    return true;
}
exports.all = all;
var dlBin = require('datalib/src/bins/bins');
function getbins(stats, maxbins) {
    return dlBin({
        min: stats.min,
        max: stats.max,
        maxbins: maxbins
    });
}
exports.getbins = getbins;
function error(message) {
    console.error('[VL Error]', message);
}
exports.error = error;
//# sourceMappingURL=util.js.map