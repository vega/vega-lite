export function isAnyConcatSpec(spec) {
    return isVConcatSpec(spec) || isHConcatSpec(spec) || isConcatSpec(spec);
}
export function isConcatSpec(spec) {
    return 'concat' in spec;
}
export function isVConcatSpec(spec) {
    return 'vconcat' in spec;
}
export function isHConcatSpec(spec) {
    return 'hconcat' in spec;
}
//# sourceMappingURL=concat.js.map