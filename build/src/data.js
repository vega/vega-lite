export function isUrlData(data) {
    return !!data['url'];
}
export function isInlineData(data) {
    return !!data['values'];
}
export function isNamedData(data) {
    return !!data['name'] && !isUrlData(data) && !isInlineData(data);
}
export const MAIN = 'main';
export const RAW = 'raw';
//# sourceMappingURL=data.js.map