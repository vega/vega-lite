import { isArray } from 'vega-util';
import { COLUMN, FACET, ROW } from '../channel';
import { hasConditionalFieldOrDatumDef, isFieldOrDatumDef, isValueDef } from '../channeldef';
import { boxPlotNormalizer } from '../compositemark/boxplot';
import { errorBandNormalizer } from '../compositemark/errorband';
import { errorBarNormalizer } from '../compositemark/errorbar';
import { channelHasField } from '../encoding';
import * as log from '../log';
import { isFacetMapping } from '../spec/facet';
import { SpecMapper } from '../spec/map';
import { isLayerRepeatSpec } from '../spec/repeat';
import { isUnitSpec } from '../spec/unit';
import { isEmpty, keys, omit, varName } from '../util';
import { isSignalRef } from '../vega.schema';
import { PathOverlayNormalizer } from './pathoverlay';
import { replaceRepeaterInEncoding, replaceRepeaterInFacet } from './repeater';
import { RuleForRangedLineNormalizer } from './ruleforrangedline';
export class CoreNormalizer extends SpecMapper {
    constructor() {
        super(...arguments);
        this.nonFacetUnitNormalizers = [
            boxPlotNormalizer,
            errorBarNormalizer,
            errorBandNormalizer,
            new PathOverlayNormalizer(),
            new RuleForRangedLineNormalizer()
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
        const encoding = replaceRepeaterInEncoding(spec.encoding, params.repeater);
        const specWithReplacedEncoding = {
            ...spec,
            ...(spec.name ? { name: [params.repeaterPrefix, spec.name].filter(n => n).join('_') } : {}),
            ...(encoding ? { encoding } : {})
        };
        if (parentEncoding || parentProjection) {
            return this.mapUnitWithParentEncodingOrProjection(specWithReplacedEncoding, params);
        }
        const normalizeLayerOrUnit = this.mapLayerOrUnit.bind(this);
        for (const unitNormalizer of this.nonFacetUnitNormalizers) {
            if (unitNormalizer.hasMatchingType(specWithReplacedEncoding, params.config)) {
                return unitNormalizer.run(specWithReplacedEncoding, params, normalizeLayerOrUnit);
            }
        }
        return specWithReplacedEncoding;
    }
    mapRepeat(spec, params) {
        if (isLayerRepeatSpec(spec)) {
            return this.mapLayerRepeat(spec, params);
        }
        else {
            return this.mapNonLayerRepeat(spec, params);
        }
    }
    mapLayerRepeat(spec, params) {
        const { repeat, spec: childSpec, ...rest } = spec;
        const { row, column, layer } = repeat;
        const { repeater = {}, repeaterPrefix = '' } = params;
        if (row || column) {
            return this.mapRepeat({
                ...spec,
                repeat: {
                    ...(row ? { row } : {}),
                    ...(column ? { column } : {})
                },
                spec: {
                    repeat: { layer },
                    spec: childSpec
                }
            }, params);
        }
        else {
            return {
                ...rest,
                layer: layer.map(layerValue => {
                    const childRepeater = {
                        ...repeater,
                        layer: layerValue
                    };
                    const childName = `${(childSpec.name ? `${childSpec.name}_` : '') + repeaterPrefix}child__layer_${varName(layerValue)}`;
                    const child = this.mapLayerOrUnit(childSpec, { ...params, repeater: childRepeater, repeaterPrefix: childName });
                    child.name = childName;
                    return child;
                })
            };
        }
    }
    mapNonLayerRepeat(spec, params) {
        const { repeat, spec: childSpec, data, ...remainingProperties } = spec;
        if (!isArray(repeat) && spec.columns) {
            // is repeat with row/column
            spec = omit(spec, ['columns']);
            log.warn(log.message.columnsNotSupportByRowCol('repeat'));
        }
        const concat = [];
        const { repeater = {}, repeaterPrefix = '' } = params;
        const row = (!isArray(repeat) && repeat.row) || [repeater ? repeater.row : null];
        const column = (!isArray(repeat) && repeat.column) || [repeater ? repeater.column : null];
        const repeatValues = (isArray(repeat) && repeat) || [repeater ? repeater.repeat : null];
        // cross product
        for (const repeatValue of repeatValues) {
            for (const rowValue of row) {
                for (const columnValue of column) {
                    const childRepeater = {
                        repeat: repeatValue,
                        row: rowValue,
                        column: columnValue,
                        layer: repeater.layer
                    };
                    const childName = (childSpec.name ? `${childSpec.name}_` : '') +
                        repeaterPrefix +
                        'child__' +
                        (isArray(repeat)
                            ? `${varName(repeatValue)}`
                            : (repeat.row ? `row_${varName(rowValue)}` : '') +
                                (repeat.column ? `column_${varName(columnValue)}` : ''));
                    const child = this.map(childSpec, { ...params, repeater: childRepeater, repeaterPrefix: childName });
                    child.name = childName;
                    // we move data up
                    concat.push(omit(child, ['data']));
                }
            }
        }
        const columns = isArray(repeat) ? spec.columns : repeat.column ? repeat.column.length : 1;
        return {
            data: childSpec.data ?? data,
            align: 'all',
            ...remainingProperties,
            columns,
            concat
        };
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
        const mergedEncoding = mergeEncoding({
            parentEncoding,
            encoding: replaceRepeaterInEncoding(encoding, params.repeater)
        });
        return this.mapUnit({
            ...spec,
            ...(mergedProjection ? { projection: mergedProjection } : {}),
            ...(mergedEncoding ? { encoding: mergedEncoding } : {})
        }, { config });
    }
    mapFacetedUnit(spec, normParams) {
        // New encoding in the inside spec should not contain row / column
        // as row/column should be moved to facet
        const { row, column, facet, ...encoding } = spec.encoding;
        // Mark and encoding should be moved into the inner spec
        const { mark, width, projection, height, view, params, encoding: _, ...outerSpec } = spec;
        const { facetMapping, layout } = this.getFacetMappingAndLayout({ row, column, facet }, normParams);
        const newEncoding = replaceRepeaterInEncoding(encoding, normParams.repeater);
        return this.mapFacet({
            ...outerSpec,
            ...layout,
            // row / column has higher precedence than facet
            facet: facetMapping,
            spec: {
                ...(width ? { width } : {}),
                ...(height ? { height } : {}),
                ...(view ? { view } : {}),
                ...(projection ? { projection } : {}),
                mark,
                encoding: newEncoding,
                ...(params ? { params } : {})
            }
        }, normParams);
    }
    getFacetMappingAndLayout(facets, params) {
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
                    const { align, center, spacing, columns, ...defWithoutLayout } = def;
                    facetMapping[channel] = defWithoutLayout;
                    for (const prop of ['align', 'center', 'spacing']) {
                        if (def[prop] !== undefined) {
                            layout[prop] ?? (layout[prop] = {});
                            layout[prop][channel] = def[prop];
                        }
                    }
                }
            }
            return { facetMapping, layout };
        }
        else {
            const { align, center, spacing, columns, ...facetMapping } = facet;
            return {
                facetMapping: replaceRepeaterInFacet(facetMapping, params.repeater),
                layout: {
                    ...(align ? { align } : {}),
                    ...(center ? { center } : {}),
                    ...(spacing ? { spacing } : {}),
                    ...(columns ? { columns } : {})
                }
            };
        }
    }
    mapLayer(spec, { parentEncoding, parentProjection, ...otherParams }) {
        // Special handling for extended layer spec
        const { encoding, projection, ...rest } = spec;
        const params = {
            ...otherParams,
            parentEncoding: mergeEncoding({ parentEncoding, encoding, layer: true }),
            parentProjection: mergeProjection({ parentProjection, projection })
        };
        return super.mapLayer({
            ...rest,
            ...(spec.name ? { name: [params.repeaterPrefix, spec.name].filter(n => n).join('_') } : {})
        }, params);
    }
}
function mergeEncoding({ parentEncoding, encoding = {}, layer }) {
    let merged = {};
    if (parentEncoding) {
        const channels = new Set([...keys(parentEncoding), ...keys(encoding)]);
        for (const channel of channels) {
            const channelDef = encoding[channel];
            const parentChannelDef = parentEncoding[channel];
            if (isFieldOrDatumDef(channelDef)) {
                // Field/Datum Def can inherit properties from its parent
                // Note that parentChannelDef doesn't have to be a field/datum def if the channelDef is already one.
                const mergedChannelDef = {
                    ...parentChannelDef,
                    ...channelDef
                };
                merged[channel] = mergedChannelDef;
            }
            else if (hasConditionalFieldOrDatumDef(channelDef)) {
                merged[channel] = {
                    ...channelDef,
                    condition: {
                        ...parentChannelDef,
                        ...channelDef.condition
                    }
                };
            }
            else if (channelDef || channelDef === null) {
                merged[channel] = channelDef;
            }
            else if (layer ||
                isValueDef(parentChannelDef) ||
                isSignalRef(parentChannelDef) ||
                isFieldOrDatumDef(parentChannelDef) ||
                isArray(parentChannelDef)) {
                merged[channel] = parentChannelDef;
            }
        }
    }
    else {
        merged = encoding;
    }
    return !merged || isEmpty(merged) ? undefined : merged;
}
function mergeProjection(opt) {
    const { parentProjection, projection } = opt;
    if (parentProjection && projection) {
        log.warn(log.message.projectionOverridden({ parentProjection, projection }));
    }
    return projection ?? parentProjection;
}
//# sourceMappingURL=core.js.map