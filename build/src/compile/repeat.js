"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var RepeatModel = /** @class */ (function (_super) {
    tslib_1.__extends(RepeatModel, _super);
    function RepeatModel(spec, parent, parentGivenName, repeatValues, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'repeat';
        _this.repeat = spec.repeat;
        _this.children = _this._initChildren(spec, _this.repeat, repeatValues, config);
        return _this;
    }
    RepeatModel.prototype._initChildren = function (spec, repeat, repeater, config) {
        var children = [];
        var row = repeat.row || [repeater ? repeater.row : null];
        var column = repeat.column || [repeater ? repeater.column : null];
        // cross product
        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var rowField = row_1[_i];
            for (var _a = 0, column_1 = column; _a < column_1.length; _a++) {
                var columnField = column_1[_a];
                var name_1 = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');
                var childRepeat = {
                    row: rowField,
                    column: columnField
                };
                children.push(buildmodel_1.buildModel(spec.spec, this, this.getName('child' + name_1), undefined, childRepeat, config, false));
            }
        }
        return children;
    };
    RepeatModel.prototype.parseLayoutSize = function () {
        parse_1.parseRepeatLayoutSize(this);
    };
    RepeatModel.prototype.assembleLayout = function () {
        // TODO: allow customization
        return {
            padding: { row: 10, column: 10 },
            offset: 10,
            columns: this.repeat && this.repeat.column ? this.repeat.column.length : 1,
            bounds: 'full',
            align: 'all'
        };
    };
    return RepeatModel;
}(baseconcat_1.BaseConcatModel));
exports.RepeatModel = RepeatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLDJDQUE2QztBQUM3QywyQ0FBd0M7QUFDeEMsNENBQXlEO0FBSXpEO0lBQWlDLHVDQUFlO0lBTTlDLHFCQUFZLElBQWdCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsWUFBMkIsRUFBRSxNQUFjO1FBQWpILFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FJM0Q7UUFWZSxVQUFJLEdBQWEsUUFBUSxDQUFDO1FBUXhDLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztJQUM5RSxDQUFDO0lBRU8sbUNBQWEsR0FBckIsVUFBc0IsSUFBZ0IsRUFBRSxNQUFjLEVBQUUsUUFBdUIsRUFBRSxNQUFjO1FBQzdGLElBQU0sUUFBUSxHQUFZLEVBQUUsQ0FBQztRQUM3QixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwRSxnQkFBZ0I7UUFDaEIsR0FBRyxDQUFDLENBQW1CLFVBQUcsRUFBSCxXQUFHLEVBQUgsaUJBQUcsRUFBSCxJQUFHO1lBQXJCLElBQU0sUUFBUSxZQUFBO1lBQ2pCLEdBQUcsQ0FBQyxDQUFzQixVQUFNLEVBQU4saUJBQU0sRUFBTixvQkFBTSxFQUFOLElBQU07Z0JBQTNCLElBQU0sV0FBVyxlQUFBO2dCQUNwQixJQUFNLE1BQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUV2RixJQUFNLFdBQVcsR0FBRztvQkFDbEIsR0FBRyxFQUFFLFFBQVE7b0JBQ2IsTUFBTSxFQUFFLFdBQVc7aUJBQ3BCLENBQUM7Z0JBRUYsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE1BQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakg7U0FDRjtRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVNLHFDQUFlLEdBQXRCO1FBQ0UsNkJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLG9DQUFjLEdBQXJCO1FBQ0UsNEJBQTRCO1FBQzVCLE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztZQUM5QixNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUUsS0FBSztTQUNiLENBQUM7SUFDSixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBakRELENBQWlDLDRCQUFlLEdBaUQvQztBQWpEWSxrQ0FBVyJ9