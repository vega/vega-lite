"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
function isVgSignalRef(o) {
    return !!o['signal'];
}
exports.isVgSignalRef = isVgSignalRef;
function isVgRangeStep(range) {
    return !!range['step'];
}
exports.isVgRangeStep = isVgRangeStep;
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
        return 'field' in domain && 'data' in domain;
    }
    return false;
}
exports.isDataRefDomain = isDataRefDomain;
function isSignalRefDomain(domain) {
    if (!util_1.isArray(domain)) {
        return 'signal' in domain;
    }
    return false;
}
exports.isSignalRefDomain = isSignalRefDomain;
var VG_MARK_CONFIG_INDEX = {
    opacity: 1,
    fill: 1,
    fillOpacity: 1,
    stroke: 1,
    strokeWidth: 1,
    strokeOpacity: 1,
    strokeDash: 1,
    strokeDashOffset: 1,
    size: 1,
    shape: 1,
    interpolate: 1,
    tension: 1,
    orient: 1,
    align: 1,
    baseline: 1,
    text: 1,
    limit: 1,
    dx: 1,
    dy: 1,
    radius: 1,
    theta: 1,
    angle: 1,
    font: 1,
    fontSize: 1,
    fontWeight: 1,
    fontStyle: 1
    // commented below are vg channel that do not have mark config.
    // 'x'|'x2'|'xc'|'width'|'y'|'y2'|'yc'|'height'
    // cursor: 1,
    // clip: 1,
    // dir: 1,
    // ellipsis: 1,
    // endAngle: 1,
    // path: 1,
    // innerRadius: 1,
    // outerRadius: 1,
    // startAngle: 1,
    // url: 1,
};
exports.VG_MARK_CONFIGS = util_1.flagKeys(VG_MARK_CONFIG_INDEX);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVnYS5zY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmVnYS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSwrQkFBK0M7QUFnRC9DLHVCQUE4QixDQUFNO0lBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFGRCxzQ0FFQztBQW1DRCx1QkFBOEIsS0FBYztJQUMxQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRkQsc0NBRUM7QUF1REQsZ0NBQXVDLE1BQWdCO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUxELHdEQUtDO0FBRUQsK0JBQXNDLE1BQWdCO0lBQ3BELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDO0lBQ2hELENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUxELHNEQUtDO0FBRUQseUJBQWdDLE1BQWdCO0lBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDO0lBQ2hELENBQUM7SUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUxELDBDQUtDO0FBRUQsMkJBQWtDLE1BQWdCO0lBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENBQUM7QUFMRCw4Q0FLQztBQXMzQkQsSUFBTSxvQkFBb0IsR0FBNkI7SUFDckQsT0FBTyxFQUFFLENBQUM7SUFDVixJQUFJLEVBQUUsQ0FBQztJQUNQLFdBQVcsRUFBRSxDQUFDO0lBQ2QsTUFBTSxFQUFFLENBQUM7SUFDVCxXQUFXLEVBQUUsQ0FBQztJQUNkLGFBQWEsRUFBRSxDQUFDO0lBQ2hCLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQixJQUFJLEVBQUUsQ0FBQztJQUNQLEtBQUssRUFBRSxDQUFDO0lBQ1IsV0FBVyxFQUFFLENBQUM7SUFDZCxPQUFPLEVBQUUsQ0FBQztJQUNWLE1BQU0sRUFBRSxDQUFDO0lBQ1QsS0FBSyxFQUFFLENBQUM7SUFDUixRQUFRLEVBQUUsQ0FBQztJQUNYLElBQUksRUFBRSxDQUFDO0lBQ1AsS0FBSyxFQUFFLENBQUM7SUFDUixFQUFFLEVBQUUsQ0FBQztJQUNMLEVBQUUsRUFBRSxDQUFDO0lBQ0wsTUFBTSxFQUFFLENBQUM7SUFDVCxLQUFLLEVBQUUsQ0FBQztJQUNSLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxFQUFFLENBQUM7SUFDUCxRQUFRLEVBQUUsQ0FBQztJQUNYLFVBQVUsRUFBRSxDQUFDO0lBQ2IsU0FBUyxFQUFFLENBQUM7SUFDWiwrREFBK0Q7SUFDL0QsK0NBQStDO0lBQy9DLGFBQWE7SUFDYixXQUFXO0lBQ1gsVUFBVTtJQUNWLGVBQWU7SUFDZixlQUFlO0lBQ2YsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLFVBQVU7Q0FDWCxDQUFDO0FBRVcsUUFBQSxlQUFlLEdBQUcsZUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMifQ==