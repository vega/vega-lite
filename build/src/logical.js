export function isLogicalOr(op) {
    return !!op.or;
}
export function isLogicalAnd(op) {
    return !!op.and;
}
export function isLogicalNot(op) {
    return !!op.not;
}
export function forEachLeaf(op, fn) {
    if (isLogicalNot(op)) {
        forEachLeaf(op.not, fn);
    }
    else if (isLogicalAnd(op)) {
        for (const subop of op.and) {
            forEachLeaf(subop, fn);
        }
    }
    else if (isLogicalOr(op)) {
        for (const subop of op.or) {
            forEachLeaf(subop, fn);
        }
    }
    else {
        fn(op);
    }
}
export function normalizeLogicalComposition(op, normalizer) {
    if (isLogicalNot(op)) {
        return { not: normalizeLogicalComposition(op.not, normalizer) };
    }
    else if (isLogicalAnd(op)) {
        return { and: op.and.map(o => normalizeLogicalComposition(o, normalizer)) };
    }
    else if (isLogicalOr(op)) {
        return { or: op.or.map(o => normalizeLogicalComposition(o, normalizer)) };
    }
    else {
        return normalizer(op);
    }
}
//# sourceMappingURL=logical.js.map