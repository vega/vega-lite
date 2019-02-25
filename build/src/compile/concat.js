import * as log from '../log';
import { isVConcatSpec } from '../spec';
import { BaseConcatModel } from './baseconcat';
import { buildModel } from './buildmodel';
import { parseConcatLayoutSize } from './layoutsize/parse';
export class ConcatModel extends BaseConcatModel {
    constructor(spec, parent, parentGivenName, repeater, config) {
        super(spec, parent, parentGivenName, config, repeater, spec.resolve);
        this.type = 'concat';
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.CONCAT_CANNOT_SHARE_AXIS);
        }
        this.isVConcat = isVConcatSpec(spec);
        this.children = (isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map((child, i) => {
            return buildModel(child, this, this.getName('concat_' + i), undefined, repeater, config, false);
        });
    }
    parseLayoutSize() {
        parseConcatLayoutSize(this);
    }
    parseAxisGroup() {
        return null;
    }
    assembleDefaultLayout() {
        return Object.assign({}, (this.isVConcat ? { columns: 1 } : {}), { bounds: 'full', 
            // Use align each so it can work with multiple plots with different size
            align: 'each' });
    }
}
//# sourceMappingURL=concat.js.map