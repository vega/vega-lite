"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSortField(sort) {
    return !!sort && !!sort['field'] && !!sort['op'];
}
exports.isSortField = isSortField;
//# sourceMappingURL=sort.js.map