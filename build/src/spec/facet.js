export function isFacetMapping(f) {
    return !!f['row'] || !!f['column'];
}
export function isFacetFieldDef(channelDef) {
    return !!channelDef && !!channelDef['header'];
}
export function isFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
//# sourceMappingURL=facet.js.map