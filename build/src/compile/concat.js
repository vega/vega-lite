import * as tslib_1 from "tslib";
import * as log from '../log';
import { isVConcatSpec } from '../spec';
import { BaseConcatModel } from './baseconcat';
import { buildModel } from './buildmodel';
import { parseConcatLayoutSize } from './layoutsize/parse';
var ConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
        _this.type = 'concat';
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.CONCAT_CANNOT_SHARE_AXIS);
        }
        _this.isVConcat = isVConcatSpec(spec);
        _this.children = (isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map(function (child, i) {
            return buildModel(child, _this, _this.getName('concat_' + i), undefined, repeater, config, false);
        });
        return _this;
    }
    ConcatModel.prototype.parseLayoutSize = function () {
        parseConcatLayoutSize(this);
    };
    ConcatModel.prototype.parseAxisGroup = function () {
        return null;
    };
    ConcatModel.prototype.assembleDefaultLayout = function () {
        return tslib_1.__assign({}, (this.isVConcat ? { columns: 1 } : {}), { bounds: 'full', 
            // Use align each so it can work with multiple plots with different size
            align: 'each' });
    };
    return ConcatModel;
}(BaseConcatModel));
export { ConcatModel };
//# sourceMappingURL=concat.js.map