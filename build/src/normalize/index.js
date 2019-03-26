import { initConfig } from '../config';
import { CoreNormalizer } from './core';
export function normalize(spec, config) {
    if (config === undefined) {
        config = initConfig(spec.config);
    }
    return normalizeGenericSpec(spec, config);
}
const normalizer = new CoreNormalizer();
/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
function normalizeGenericSpec(spec, config = {}) {
    return normalizer.map(spec, { config });
}
//# sourceMappingURL=index.js.map