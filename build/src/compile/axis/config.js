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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSx1QkFBOEIsUUFBZ0IsRUFBRSxNQUFjLEVBQUUsT0FBNkIsRUFBRSxNQUFtQixFQUFFLFNBQW9CO0lBQXpDLHVCQUFBLEVBQUEsV0FBbUI7SUFDaEgsdURBQXVEO0lBQ3ZELElBQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3BFLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTztRQUNuQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUQsTUFBTTtLQUNQLENBQUMsQ0FBQztJQUNILEdBQUcsQ0FBQyxDQUFxQixVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVc7UUFBL0IsSUFBTSxVQUFVLG9CQUFBO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7S0FDRjtJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQWRELHNDQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQb3NpdGlvblNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBeGlzQ29uZmlnKHByb3BlcnR5OiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCBjaGFubmVsOiBQb3NpdGlvblNjYWxlQ2hhbm5lbCwgb3JpZW50OiBzdHJpbmcgPSAnJywgc2NhbGVUeXBlOiBTY2FsZVR5cGUpIHtcbiAgLy8gY29uZmlnVHlwZXMgdG8gbG9vcCwgc3RhcnRpbmcgZnJvbSBoaWdoZXIgcHJlY2VkZW5jZVxuICBjb25zdCBjb25maWdUeXBlcyA9IChzY2FsZVR5cGUgPT09ICdiYW5kJyA/IFsnYXhpc0JhbmQnXSA6IFtdKS5jb25jYXQoW1xuICAgIGNoYW5uZWwgPT09ICd4JyA/ICdheGlzWCcgOiAnYXhpc1knLFxuICAgICdheGlzJyArIG9yaWVudC5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpICsgb3JpZW50LnN1YnN0cigxKSwgLy8gYXhpc1RvcCwgYXhpc0JvdHRvbSwgLi4uXG4gICAgJ2F4aXMnXG4gIF0pO1xuICBmb3IgKGNvbnN0IGNvbmZpZ1R5cGUgb2YgY29uZmlnVHlwZXMpIHtcbiAgICBpZiAoY29uZmlnW2NvbmZpZ1R5cGVdICYmIGNvbmZpZ1tjb25maWdUeXBlXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGNvbmZpZ1tjb25maWdUeXBlXVtwcm9wZXJ0eV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==