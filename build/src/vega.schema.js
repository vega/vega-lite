"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function isDataRefUnionedDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'fields' in domain && !('data' in domain);
    }
    return false;
}
exports.isDataRefUnionedDomain = isDataRefUnionedDomain;
function isFieldRefUnionDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'fields' in domain && 'data' in domain;
    }
    return false;
}
exports.isFieldRefUnionDomain = isFieldRefUnionDomain;
function isDataRefDomain(domain) {
    if (!util_1.isArray(domain)) {
        return !('fields' in domain);
    }
    return false;
}
exports.isDataRefDomain = isDataRefDomain;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVnYS5zY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmVnYS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQkFBK0I7QUF3Ri9CLGdDQUF1QyxNQUFnQjtJQUNyRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFMRCx3REFLQztBQUVELCtCQUFzQyxNQUFnQjtJQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQztJQUNoRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFMRCxzREFLQztBQUVELHlCQUFnQyxNQUFnQjtJQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBTEQsMENBS0M7QUE4RUEsQ0FBQyJ9