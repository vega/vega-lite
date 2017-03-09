/*
 * Constants and utilities for data.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUrlData(data) {
    return !!data['url'];
}
exports.isUrlData = isUrlData;
function isInlineData(data) {
    return !!data['values'];
}
exports.isInlineData = isInlineData;
function isNamedData(data) {
    return !!data['name'];
}
exports.isNamedData = isNamedData;
exports.SUMMARY = 'summary';
exports.SOURCE = 'source';
exports.STACKED = 'stacked';
exports.LAYOUT = 'layout';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOzs7QUFxRUgsbUJBQTBCLElBQVU7SUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUZELDhCQUVDO0FBRUQsc0JBQTZCLElBQVU7SUFDckMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUZELG9DQUVDO0FBRUQscUJBQTRCLElBQVU7SUFDcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUZELGtDQUVDO0FBSVksUUFBQSxPQUFPLEdBQWMsU0FBUyxDQUFDO0FBQy9CLFFBQUEsTUFBTSxHQUFhLFFBQVEsQ0FBQztBQUM1QixRQUFBLE9BQU8sR0FBYyxTQUFTLENBQUM7QUFDL0IsUUFBQSxNQUFNLEdBQWEsUUFBUSxDQUFDIn0=