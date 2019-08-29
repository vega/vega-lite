export function isAnyConcatSpec(spec) {
    return isVConcatSpec(spec) || isHConcatSpec(spec) || isConcatSpec(spec);
}
export function isConcatSpec(spec) {
    return spec['concat'] !== undefined;
}
export function isVConcatSpec(spec) {
    return spec['vconcat'] !== undefined;
}
export function isHConcatSpec(spec) {
    return spec['hconcat'] !== undefined;
}
//# sourceMappingURL=concat.js.map