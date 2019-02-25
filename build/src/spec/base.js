export const DEFAULT_SPACING = 20;
export function extractCompositionLayout(layout) {
    const { align = undefined, center = undefined, bounds = undefined, spacing = undefined } = layout || {};
    return { align, bounds, center, spacing };
}
//# sourceMappingURL=base.js.map