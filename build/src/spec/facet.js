export function isFacetFieldDef(channelDef) {
    return !!channelDef && !!channelDef['header'];
}
export function isFacetSpec(spec) {
    return spec['facet'] !== undefined;
}
//# sourceMappingURL=facet.js.map