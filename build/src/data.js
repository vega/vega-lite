export function isUrlData(data) {
    return !!data['url'];
}
export function isInlineData(data) {
    return !!data['values'];
}
export function isNamedData(data) {
    return !!data['name'] && !isUrlData(data) && !isInlineData(data);
}
export var MAIN = 'main';
export var RAW = 'raw';
//# sourceMappingURL=data.js.map