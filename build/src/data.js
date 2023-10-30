export function isUrlData(data) {
    return 'url' in data;
}
export function isInlineData(data) {
    return 'values' in data;
}
export function isNamedData(data) {
    return 'name' in data && !isUrlData(data) && !isInlineData(data) && !isGenerator(data);
}
export function isGenerator(data) {
    return data && (isSequenceGenerator(data) || isSphereGenerator(data) || isGraticuleGenerator(data));
}
export function isSequenceGenerator(data) {
    return 'sequence' in data;
}
export function isSphereGenerator(data) {
    return 'sphere' in data;
}
export function isGraticuleGenerator(data) {
    return 'graticule' in data;
}
export var DataSourceType;
(function (DataSourceType) {
    DataSourceType[DataSourceType["Raw"] = 0] = "Raw";
    DataSourceType[DataSourceType["Main"] = 1] = "Main";
    DataSourceType[DataSourceType["Row"] = 2] = "Row";
    DataSourceType[DataSourceType["Column"] = 3] = "Column";
    DataSourceType[DataSourceType["Lookup"] = 4] = "Lookup";
})(DataSourceType || (DataSourceType = {}));
//# sourceMappingURL=data.js.map