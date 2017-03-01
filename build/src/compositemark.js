"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mark_1 = require("./mark");
exports.ERRORBAR = 'error-bar';
/**
 * Registry index for all composite mark's normalizer
 */
var normalizerRegistry = {};
function add(mark, normalizer) {
    normalizerRegistry[mark] = normalizer;
}
exports.add = add;
function remove(mark) {
    delete normalizerRegistry[mark];
}
exports.remove = remove;
/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec) {
    var mark = mark_1.isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
    var normalizer = normalizerRegistry[mark];
    if (normalizer) {
        return normalizer(spec);
    }
    throw new Error("Unregistered composite mark " + mark);
}
exports.normalize = normalize;
add(exports.ERRORBAR, function (spec) {
    var _m = spec.mark, encoding = spec.encoding, outerSpec = tslib_1.__rest(spec, ["mark", "encoding"]);
    var _s = encoding.size, encodingWithoutSize = tslib_1.__rest(encoding, ["size"]);
    var _x2 = encoding.x2, _y2 = encoding.y2, encodingWithoutX2Y2 = tslib_1.__rest(encoding, ["x2", "y2"]);
    return tslib_1.__assign({}, outerSpec, { layer: [
            {
                mark: 'rule',
                encoding: encodingWithoutSize
            }, {
                mark: 'tick',
                encoding: encodingWithoutX2Y2
            }, {
                mark: 'tick',
                encoding: tslib_1.__assign({}, encodingWithoutX2Y2, (encoding.x2 ? { x: encoding.x2 } : {}), (encoding.y2 ? { y: encoding.y2 } : {}))
            }
        ] });
});
//# sourceMappingURL=compositemark.js.map