"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 * (Properties not listed are applicable for both)
 */
exports.AXIS_PROPERTY_TYPE = {
    grid: 'grid',
    labelOverlap: 'main',
    offset: 'main',
    title: 'main'
};
exports.AXIS_PROPERTIES = [
    'domain', 'format', 'grid', 'labelPadding', 'labels', 'labelOverlap', 'maxExtent', 'minExtent', 'offset', 'orient', 'position', 'tickCount', 'tickExtra', 'ticks', 'tickSize', 'title', 'titlePadding', 'values', 'zindex'
];
exports.VG_AXIS_PROPERTIES = [].concat(exports.AXIS_PROPERTIES, ['gridScale']);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXhpcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9heGlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBaUVBOzs7R0FHRztBQUNVLFFBQUEsa0JBQWtCLEdBRzNCO0lBQ0YsSUFBSSxFQUFFLE1BQU07SUFDWixZQUFZLEVBQUUsTUFBTTtJQUNwQixNQUFNLEVBQUUsTUFBTTtJQUNkLEtBQUssRUFBRSxNQUFNO0NBQ2QsQ0FBQztBQWtDVyxRQUFBLGVBQWUsR0FBMkI7SUFDckQsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsUUFBUTtDQUMzTixDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBcUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyx1QkFBZSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyJ9