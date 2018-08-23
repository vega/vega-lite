import * as tslib_1 from "tslib";
import { Split } from '../split';
/**
 * Class to track interesting properties (see https://15721.courses.cs.cmu.edu/spring2016/papers/graefe-ieee1995.pdf)
 * about how fields have been parsed or whether they have been derived in a transform. We use this to not parse the
 * same field again (or differently).
 */
var AncestorParse = /** @class */ (function (_super) {
    tslib_1.__extends(AncestorParse, _super);
    function AncestorParse(explicit, implicit, parseNothing) {
        if (explicit === void 0) { explicit = {}; }
        if (implicit === void 0) { implicit = {}; }
        if (parseNothing === void 0) { parseNothing = false; }
        var _this = _super.call(this, explicit, implicit) || this;
        _this.explicit = explicit;
        _this.implicit = implicit;
        _this.parseNothing = parseNothing;
        return _this;
    }
    AncestorParse.prototype.clone = function () {
        var clone = _super.prototype.clone.call(this);
        clone.parseNothing = this.parseNothing;
        return clone;
    };
    return AncestorParse;
}(Split));
export { AncestorParse };
//# sourceMappingURL=index.js.map