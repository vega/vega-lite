import { extractTransformsFromEncoding } from './encoding';
import { SpecMapper } from './spec/map';
class TransformExtractMapper extends SpecMapper {
    mapUnit(spec, { config }) {
        if (spec.encoding) {
            const { encoding: oldEncoding, transform: oldTransforms } = spec;
            const { bins, timeUnits, aggregate, groupby, encoding } = extractTransformsFromEncoding(oldEncoding, config);
            const transform = [
                ...(oldTransforms ? oldTransforms : []),
                ...bins,
                ...timeUnits,
                ...(!aggregate.length ? [] : [{ aggregate, groupby }])
            ];
            return Object.assign({}, spec, (transform.length > 0 ? { transform } : {}), { encoding });
        }
        else {
            return spec;
        }
    }
}
const extractor = new TransformExtractMapper();
/**
 * Modifies spec extracting transformations from encoding and moving them to the transforms array
 */
export function extractTransforms(spec, config) {
    return extractor.map(spec, { config });
}
//# sourceMappingURL=transformextract.js.map