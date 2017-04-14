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
exports.MAIN = 'main';
exports.RAW = 'raw';
exports.LAYOUT = 'layout';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOzs7QUFxRUgsbUJBQTBCLElBQW1CO0lBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFGRCw4QkFFQztBQUVELHNCQUE2QixJQUFtQjtJQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRkQsb0NBRUM7QUFFRCxxQkFBNEIsSUFBbUI7SUFDN0MsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUZELGtDQUVDO0FBS1ksUUFBQSxJQUFJLEdBQVcsTUFBTSxDQUFDO0FBQ3RCLFFBQUEsR0FBRyxHQUFVLEtBQUssQ0FBQztBQUNuQixRQUFBLE1BQU0sR0FBYSxRQUFRLENBQUMifQ==