(function (Type) {
    Type[Type["QUANTITATIVE"] = 'quantitative'] = "QUANTITATIVE";
    Type[Type["ORDINAL"] = 'ordinal'] = "ORDINAL";
    Type[Type["TEMPORAL"] = 'temporal'] = "TEMPORAL";
    Type[Type["NOMINAL"] = 'nominal'] = "NOMINAL";
})(exports.Type || (exports.Type = {}));
var Type = exports.Type;
exports.QUANTITATIVE = Type.QUANTITATIVE;
exports.ORDINAL = Type.ORDINAL;
exports.TEMPORAL = Type.TEMPORAL;
exports.NOMINAL = Type.NOMINAL;
exports.SHORT_TYPE = {
    quantitative: 'Q',
    temporal: 'T',
    nominal: 'N',
    ordinal: 'O'
};
exports.TYPE_FROM_SHORT_TYPE = {
    Q: exports.QUANTITATIVE,
    T: exports.TEMPORAL,
    O: exports.ORDINAL,
    N: exports.NOMINAL
};
function getFullName(type) {
    var typeString = type;
    return exports.TYPE_FROM_SHORT_TYPE[typeString.toUpperCase()] ||
        typeString.toLowerCase();
}
exports.getFullName = getFullName;
//# sourceMappingURL=type.js.map