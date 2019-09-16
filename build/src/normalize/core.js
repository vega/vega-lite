import { __rest } from "tslib";
import { isArray } from 'vega-util';
import { COLUMN, FACET, ROW } from '../channel';
import { boxPlotNormalizer } from '../compositemark/boxplot';
import { errorBandNormalizer } from '../compositemark/errorband';
import { errorBarNormalizer } from '../compositemark/errorbar';
import { channelHasField } from '../encoding';
import * as log from '../log';
import { isFacetMapping } from '../spec/facet';
import { SpecMapper } from '../spec/map';
import { isUnitSpec } from '../spec/unit';
import { keys, omit } from '../util';
import { PathOverlayNormalizer } from './pathoverlay';
import { RangeStepNormalizer } from './rangestep';
import { RuleForRangedLineNormalizer } from './ruleforrangedline';
export class CoreNormalizer extends SpecMapper {
    constructor() {
        super(...arguments);
        this.nonFacetUnitNormalizers = [
            boxPlotNormalizer,
            errorBarNormalizer,
            errorBandNormalizer,
            new PathOverlayNormalizer(),
            new RuleForRangedLineNormalizer(),
            new RangeStepNormalizer()
        ];
    }
    map(spec, params) {
        // Special handling for a faceted unit spec as it can return a facet spec, not just a layer or unit spec like a normal unit spec.
        if (isUnitSpec(spec)) {
            const hasRow = channelHasField(spec.encoding, ROW);
            const hasColumn = channelHasField(spec.encoding, COLUMN);
            const hasFacet = channelHasField(spec.encoding, FACET);
            if (hasRow || hasColumn || hasFacet) {
                return this.mapFacetedUnit(spec, params);
            }
        }
        return super.map(spec, params);
    }
    // This is for normalizing non-facet unit
    mapUnit(spec, params) {
        const { parentEncoding, parentProjection } = params;
        if (parentEncoding || parentProjection) {
            return this.mapUnitWithParentEncodingOrProjection(spec, params);
        }
        const normalizeLayerOrUnit = this.mapLayerOrUnit.bind(this);
        for (const unitNormalizer of this.nonFacetUnitNormalizers) {
            if (unitNormalizer.hasMatchingType(spec, params.config)) {
                return unitNormalizer.run(spec, params, normalizeLayerOrUnit);
            }
        }
        return spec;
    }
    mapRepeat(spec, params) {
        const { repeat } = spec;
        if (!isArray(repeat) && spec.columns) {
            // is repeat with row/column
            spec = omit(spec, ['columns']);
            log.warn(log.message.columnsNotSupportByRowCol('repeat'));
        }
        return Object.assign(Object.assign({}, spec), { spec: this.map(spec.spec, params) });
    }
    mapFacet(spec, params) {
        const { facet } = spec;
        if (isFacetMapping(facet) && spec.columns) {
            // is facet with row/column
            spec = omit(spec, ['columns']);
            log.warn(log.message.columnsNotSupportByRowCol('facet'));
        }
        return super.mapFacet(spec, params);
    }
    mapUnitWithParentEncodingOrProjection(spec, params) {
        const { encoding, projection } = spec;
        const { parentEncoding, parentProjection, config } = params;
        const mergedProjection = mergeProjection({ parentProjection, projection });
        const mergedEncoding = mergeEncoding({ parentEncoding, encoding });
        return this.mapUnit(Object.assign(Object.assign(Object.assign({}, spec), (mergedProjection ? { projection: mergedProjection } : {})), (mergedEncoding ? { encoding: mergedEncoding } : {})), { config });
    }
    mapFacetedUnit(spec, params) {
        // New encoding in the inside spec should not contain row / column
        // as row/column should be moved to facet
        const _a = spec.encoding, { row, column, facet } = _a, encoding = __rest(_a, ["row", "column", "facet"]);
        // Mark and encoding should be moved into the inner spec
        const { mark, width, projection, height, selection, encoding: _ } = spec, outerSpec = __rest(spec, ["mark", "width", "projection", "height", "selection", "encoding"]);
        const { facetMapping, layout } = this.getFacetMappingAndLayout({ row, column, facet });
        return this.mapFacet(Object.assign(Object.assign(Object.assign({}, outerSpec), layout), { 
            // row / column has higher precedence than facet
            facet: facetMapping, spec: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (projection ? { projection } : {})), { mark }), (width ? { width } : {})), (height ? { height } : {})), { encoding }), (selection ? { selection } : {})) }), params);
    }
    getFacetMappingAndLayout(facets) {
        const { row, column, facet } = facets;
        if (row || column) {
            if (facet) {
                log.warn(log.message.facetChannelDropped([...(row ? [ROW] : []), ...(column ? [COLUMN] : [])]));
            }
            const facetMapping = {};
            const layout = {};
            for (const channel of [ROW, COLUMN]) {
                const def = facets[channel];
                if (def) {
                    const { align, center, spacing, columns } = def, defWithoutLayout = __rest(def, ["align", "center", "spacing", "columns"]);
                    facetMapping[channel] = defWithoutLayout;
                    for (const prop of ['align', 'center', 'spacing']) {
                        if (def[prop] !== undefined) {
                            layout[prop] = layout[prop] || {};
                            layout[prop][channel] = def[prop];
                        }
                    }
                }
            }
            return { facetMapping, layout };
        }
        else {
            const { align, center, spacing, columns } = facet, facetMapping = __rest(facet, ["align", "center", "spacing", "columns"]);
            return {
                facetMapping,
                layout: Object.assign(Object.assign(Object.assign(Object.assign({}, (align ? { align } : {})), (center ? { center } : {})), (spacing ? { spacing } : {})), (columns ? { columns } : {}))
            };
        }
    }
    mapLayer(spec, _a) {
        // Special handling for extended layer spec
        var { parentEncoding, parentProjection } = _a, otherParams = __rest(_a, ["parentEncoding", "parentProjection"]);
        const { encoding, projection } = spec, rest = __rest(spec, ["encoding", "projection"]);
        const params = Object.assign(Object.assign({}, otherParams), { parentEncoding: mergeEncoding({ parentEncoding, encoding }), parentProjection: mergeProjection({ parentProjection, projection }) });
        return super.mapLayer(rest, params);
    }
}
function mergeEncoding(opt) {
    const { parentEncoding, encoding } = opt;
    if (parentEncoding && encoding) {
        const overriden = keys(parentEncoding).reduce((o, key) => {
            if (encoding[key]) {
                o.push(key);
            }
            return o;
        }, []);
        if (overriden.length > 0) {
            log.warn(log.message.encodingOverridden(overriden));
        }
    }
    const merged = Object.assign(Object.assign({}, (parentEncoding || {})), (encoding || {}));
    return keys(merged).length > 0 ? merged : undefined;
}
function mergeProjection(opt) {
    const { parentProjection, projection } = opt;
    if (parentProjection && projection) {
        log.warn(log.message.projectionOverridden({ parentProjection, projection }));
    }
    return projection || parentProjection;
}
//# sourceMappingURL=core.js.map