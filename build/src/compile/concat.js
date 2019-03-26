import * as log from '../log';
import { isHConcatSpec, isVConcatSpec } from '../spec';
import { BaseConcatModel } from './baseconcat';
import { buildModel } from './buildmodel';
import { parseConcatLayoutSize } from './layoutsize/parse';
export class ConcatModel extends BaseConcatModel {
    constructor(spec, parent, parentGivenName, repeater, config) {
        super(spec, 'concat', parent, parentGivenName, config, repeater, spec.resolve);
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.CONCAT_CANNOT_SHARE_AXIS);
        }
        this.concatType = isVConcatSpec(spec) ? 'vconcat' : isHConcatSpec(spec) ? 'hconcat' : 'concat';
        this.children = this.getChildren(spec).map((child, i) => {
            return buildModel(child, this, this.getName('concat_' + i), undefined, repeater, config, false);
        });
    }
    getChildren(spec) {
        if (isVConcatSpec(spec)) {
            return spec.vconcat;
        }
        else if (isHConcatSpec(spec)) {
            return spec.hconcat;
        }
        return spec.concat;
    }
    parseLayoutSize() {
        parseConcatLayoutSize(this);
    }
    parseAxisGroup() {
        return null;
    }
    assembleDefaultLayout() {
        return Object.assign({}, (this.concatType === 'vconcat' ? { columns: 1 } : {}), { bounds: 'full', 
            // Use align each so it can work with multiple plots with different size
            align: 'each' });
    }
}
//# sourceMappingURL=concat.js.map