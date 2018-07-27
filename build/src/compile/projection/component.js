import * as tslib_1 from "tslib";
import { Split } from '../split';
var ProjectionComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ProjectionComponent, _super);
    function ProjectionComponent(name, specifiedProjection, size, data) {
        var _this = _super.call(this, tslib_1.__assign({}, specifiedProjection), // all explicit properties of projection
        { name: name } // name as initial implicit property
        ) || this;
        _this.specifiedProjection = specifiedProjection;
        _this.size = size;
        _this.data = data;
        _this.merged = false;
        return _this;
    }
    return ProjectionComponent;
}(Split));
export { ProjectionComponent };
//# sourceMappingURL=component.js.map