"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAxisConfig(property, config, channel, orient, scaleType) {
    if (orient === void 0) { orient = ''; }
    // configTypes to loop, starting from higher precedence
    var configTypes = (scaleType === 'band' ? ['axisBand'] : []).concat([
        channel === 'x' ? 'axisX' : 'axisY',
        'axis' + orient.substr(0, 1).toUpperCase() + orient.substr(1),
        'axis'
    ]);
    for (var _i = 0, configTypes_1 = configTypes; _i < configTypes_1.length; _i++) {
        var configType = configTypes_1[_i];
        if (config[configType] && config[configType][property] !== undefined) {
            return config[configType][property];
        }
    }
    return undefined;
}
exports.getAxisConfig = getAxisConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSx1QkFBOEIsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsT0FBNkIsRUFBRSxNQUFtQixFQUFFLFNBQW9CO0lBQXpDLHVCQUFBLEVBQUEsV0FBbUI7SUFDaEgsdURBQXVEO0lBQ3ZELElBQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3BFLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztRQUNuQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUQsTUFBTTtLQUNQLENBQUMsQ0FBQztJQUNILEtBQXlCLFVBQVcsRUFBWCwyQkFBVyxFQUFYLHlCQUFXLEVBQVgsSUFBVyxFQUFFO1FBQWpDLElBQU0sVUFBVSxvQkFBQTtRQUNuQixJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3BFLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO0tBQ0Y7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBZEQsc0NBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Bvc2l0aW9uU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF4aXNDb25maWcocHJvcGVydHk6IHN0cmluZywgY29uZmlnOiBDb25maWcsIGNoYW5uZWw6IFBvc2l0aW9uU2NhbGVDaGFubmVsLCBvcmllbnQ6IHN0cmluZyA9ICcnLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSkge1xuICAvLyBjb25maWdUeXBlcyB0byBsb29wLCBzdGFydGluZyBmcm9tIGhpZ2hlciBwcmVjZWRlbmNlXG4gIGNvbnN0IGNvbmZpZ1R5cGVzID0gKHNjYWxlVHlwZSA9PT0gJ2JhbmQnID8gWydheGlzQmFuZCddIDogW10pLmNvbmNhdChbXG4gICAgY2hhbm5lbCA9PT0gJ3gnID8gJ2F4aXNYJyA6ICdheGlzWScsXG4gICAgJ2F4aXMnICsgb3JpZW50LnN1YnN0cigwLDEpLnRvVXBwZXJDYXNlKCkgKyBvcmllbnQuc3Vic3RyKDEpLCAvLyBheGlzVG9wLCBheGlzQm90dG9tLCAuLi5cbiAgICAnYXhpcydcbiAgXSk7XG4gIGZvciAoY29uc3QgY29uZmlnVHlwZSBvZiBjb25maWdUeXBlcykge1xuICAgIGlmIChjb25maWdbY29uZmlnVHlwZV0gJiYgY29uZmlnW2NvbmZpZ1R5cGVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY29uZmlnW2NvbmZpZ1R5cGVdW3Byb3BlcnR5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIl19