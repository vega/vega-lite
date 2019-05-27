export function isUrlData(data) {
    return !!data['url'];
}
export function isInlineData(data) {
    return !!data['values'];
}
export function isNamedData(data) {
    return !!data['name'] && !isUrlData(data) && !isInlineData(data) && !isGenerator(data);
}
export function isGenerator(data) {
    return data && (isSequenceGenerator(data) || isSphereGenerator(data) || isGraticuleGenerator(data));
}
export function isSequenceGenerator(data) {
    return !!data['sequence'];
}
export function isSphereGenerator(data) {
    return !!data['sphere'];
}
export function isGraticuleGenerator(data) {
    return !!data['graticule'];
}
export const MAIN = 'main';
export const RAW = 'raw';
//# sourceMappingURL=data.js.map