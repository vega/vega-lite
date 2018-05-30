"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var split_1 = require("../split");
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
}(split_1.Split));
exports.ProjectionComponent = ProjectionComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvcHJvamVjdGlvbi9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsa0NBQStCO0FBRS9CO0lBQXlDLCtDQUFtQjtJQUcxRCw2QkFBWSxJQUFZLEVBQVMsbUJBQStCLEVBQVMsSUFBbUIsRUFBUyxJQUE4QjtRQUFuSSxZQUNFLHVDQUNNLG1CQUFtQixHQUFJLHdDQUF3QztRQUNuRSxFQUFDLElBQUksTUFBQSxFQUFDLENBQUUsb0NBQW9DO1NBQzdDLFNBQ0Y7UUFMZ0MseUJBQW1CLEdBQW5CLG1CQUFtQixDQUFZO1FBQVMsVUFBSSxHQUFKLElBQUksQ0FBZTtRQUFTLFVBQUksR0FBSixJQUFJLENBQTBCO1FBRjVILFlBQU0sR0FBRyxLQUFLLENBQUM7O0lBT3RCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFURCxDQUF5QyxhQUFLLEdBUzdDO0FBVFksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm9qZWN0aW9ufSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uJztcbmltcG9ydCB7VmdQcm9qZWN0aW9uLCBWZ1NpZ25hbFJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtTcGxpdH0gZnJvbSAnLi4vc3BsaXQnO1xuXG5leHBvcnQgY2xhc3MgUHJvamVjdGlvbkNvbXBvbmVudCBleHRlbmRzIFNwbGl0PFZnUHJvamVjdGlvbj4ge1xuICBwdWJsaWMgbWVyZ2VkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBwdWJsaWMgc3BlY2lmaWVkUHJvamVjdGlvbjogUHJvamVjdGlvbiwgcHVibGljIHNpemU6IFZnU2lnbmFsUmVmW10sIHB1YmxpYyBkYXRhOiAoc3RyaW5nIHwgVmdTaWduYWxSZWYpW10pIHtcbiAgICBzdXBlcihcbiAgICAgIHsuLi5zcGVjaWZpZWRQcm9qZWN0aW9ufSwgIC8vIGFsbCBleHBsaWNpdCBwcm9wZXJ0aWVzIG9mIHByb2plY3Rpb25cbiAgICAgIHtuYW1lfSAgLy8gbmFtZSBhcyBpbml0aWFsIGltcGxpY2l0IHByb3BlcnR5XG4gICAgKTtcbiAgfVxufVxuIl19