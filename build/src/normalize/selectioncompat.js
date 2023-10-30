import { isArray } from 'vega';
import { isBinParams } from '../bin';
import { isConditionalDef, isFieldDef, isScaleFieldDef } from '../channeldef';
import { normalizeLogicalComposition } from '../logical';
import { SpecMapper } from '../spec/map';
import { isBin, isFilter, isLookup } from '../transform';
import { duplicate, entries, vals } from '../util';
export class SelectionCompatibilityNormalizer extends SpecMapper {
    map(spec, normParams) {
        normParams.emptySelections ?? (normParams.emptySelections = {});
        normParams.selectionPredicates ?? (normParams.selectionPredicates = {});
        spec = normalizeTransforms(spec, normParams);
        return super.map(spec, normParams);
    }
    mapLayerOrUnit(spec, normParams) {
        spec = normalizeTransforms(spec, normParams);
        if (spec.encoding) {
            const encoding = {};
            for (const [channel, enc] of entries(spec.encoding)) {
                encoding[channel] = normalizeChannelDef(enc, normParams);
            }
            spec = { ...spec, encoding };
        }
        return super.mapLayerOrUnit(spec, normParams);
    }
    mapUnit(spec, normParams) {
        const { selection, ...rest } = spec;
        if (selection) {
            return {
                ...rest,
                params: entries(selection).map(([name, selDef]) => {
                    const { init: value, bind, empty, ...select } = selDef;
                    if (select.type === 'single') {
                        select.type = 'point';
                        select.toggle = false;
                    }
                    else if (select.type === 'multi') {
                        select.type = 'point';
                    }
                    // Propagate emptiness forwards and backwards
                    normParams.emptySelections[name] = empty !== 'none';
                    for (const pred of vals(normParams.selectionPredicates[name] ?? {})) {
                        pred.empty = empty !== 'none';
                    }
                    return { name, value, select, bind };
                })
            };
        }
        return spec;
    }
}
function normalizeTransforms(spec, normParams) {
    const { transform: tx, ...rest } = spec;
    if (tx) {
        const transform = tx.map((t) => {
            if (isFilter(t)) {
                return { filter: normalizePredicate(t, normParams) };
            }
            else if (isBin(t) && isBinParams(t.bin)) {
                return {
                    ...t,
                    bin: normalizeBinExtent(t.bin)
                };
            }
            else if (isLookup(t)) {
                const { selection: param, ...from } = t.from;
                return param
                    ? {
                        ...t,
                        from: { param, ...from }
                    }
                    : t;
            }
            return t;
        });
        return { ...rest, transform };
    }
    return spec;
}
function normalizeChannelDef(obj, normParams) {
    const enc = duplicate(obj);
    if (isFieldDef(enc) && isBinParams(enc.bin)) {
        enc.bin = normalizeBinExtent(enc.bin);
    }
    if (isScaleFieldDef(enc) && enc.scale?.domain?.selection) {
        const { selection: param, ...domain } = enc.scale.domain;
        enc.scale.domain = { ...domain, ...(param ? { param } : {}) };
    }
    if (isConditionalDef(enc)) {
        if (isArray(enc.condition)) {
            enc.condition = enc.condition.map((c) => {
                const { selection, param, test, ...cond } = c;
                return param ? c : { ...cond, test: normalizePredicate(c, normParams) };
            });
        }
        else {
            const { selection, param, test, ...cond } = normalizeChannelDef(enc.condition, normParams);
            enc.condition = param
                ? enc.condition
                : {
                    ...cond,
                    test: normalizePredicate(enc.condition, normParams)
                };
        }
    }
    return enc;
}
function normalizeBinExtent(bin) {
    const ext = bin.extent;
    if (ext?.selection) {
        const { selection: param, ...rest } = ext;
        return { ...bin, extent: { ...rest, param } };
    }
    return bin;
}
function normalizePredicate(op, normParams) {
    // Normalize old compositions of selection names (e.g., selection: {and: ["one", "two"]})
    const normalizeSelectionComposition = (o) => {
        return normalizeLogicalComposition(o, param => {
            var _a;
            const empty = normParams.emptySelections[param] ?? true;
            const pred = { param, empty };
            (_a = normParams.selectionPredicates)[param] ?? (_a[param] = []);
            normParams.selectionPredicates[param].push(pred);
            return pred;
        });
    };
    return op.selection
        ? normalizeSelectionComposition(op.selection)
        : normalizeLogicalComposition(op.test || op.filter, o => o.selection ? normalizeSelectionComposition(o.selection) : o);
}
//# sourceMappingURL=selectioncompat.js.map