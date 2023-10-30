export function isFacetMapping(f) {
    return 'row' in f || 'column' in f;
}
export function isFacetFieldDef(channelDef) {
    return !!channelDef && 'header' in channelDef;
}
export function isFacetSpec(spec) {
    return 'facet' in spec;
}
//# sourceMappingURL=facet.js.map