"use strict";
function isSortField(sort) {
    return !!sort && !!sort['field'] && !!sort['op'];
}
exports.isSortField = isSortField;
//# sourceMappingURL=sort.js.map