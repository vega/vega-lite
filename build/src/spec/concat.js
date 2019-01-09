export function isConcatSpec(spec) {
    return isVConcatSpec(spec) || isHConcatSpec(spec);
}
export function isVConcatSpec(spec) {
    return spec['vconcat'] !== undefined;
}
export function isHConcatSpec(spec) {
    return spec['hconcat'] !== undefined;
}
//# sourceMappingURL=concat.js.map