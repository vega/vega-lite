"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../log"));
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var RepeatModel = /** @class */ (function (_super) {
    tslib_1.__extends(RepeatModel, _super);
    function RepeatModel(spec, parent, parentGivenName, repeatValues, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeatValues, spec.resolve) || this;
        _this.type = 'repeat';
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.REPEAT_CANNOT_SHARE_AXIS);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGtEQUE4QjtBQUk5QiwyQ0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUF5RDtBQUl6RDtJQUFpQyx1Q0FBZTtJQU05QyxxQkFBWSxJQUEwQixFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFlBQTJCLEVBQUUsTUFBYztRQUEzSCxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQVF6RTtRQWRlLFVBQUksR0FBYSxRQUFRLENBQUM7UUFReEMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLEVBQUU7WUFDL0csR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDaEQ7UUFFRCxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQzs7SUFDOUUsQ0FBQztJQUVPLG1DQUFhLEdBQXJCLFVBQXNCLElBQTBCLEVBQUUsTUFBYyxFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUN2RyxJQUFNLFFBQVEsR0FBWSxFQUFFLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEUsZ0JBQWdCO1FBQ2hCLEtBQXVCLFVBQUcsRUFBSCxXQUFHLEVBQUgsaUJBQUcsRUFBSCxJQUFHLEVBQUU7WUFBdkIsSUFBTSxRQUFRLFlBQUE7WUFDakIsS0FBMEIsVUFBTSxFQUFOLGlCQUFNLEVBQU4sb0JBQU0sRUFBTixJQUFNLEVBQUU7Z0JBQTdCLElBQU0sV0FBVyxlQUFBO2dCQUNwQixJQUFNLE1BQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUV2RixJQUFNLFdBQVcsR0FBRztvQkFDbEIsR0FBRyxFQUFFLFFBQVE7b0JBQ2IsTUFBTSxFQUFFLFdBQVc7aUJBQ3BCLENBQUM7Z0JBRUYsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLE1BQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDakg7U0FDRjtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxxQ0FBZSxHQUF0QjtRQUNFLDZCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxvQ0FBYyxHQUFyQjtRQUNFLDRCQUE0QjtRQUM1QixPQUFPO1lBQ0wsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO1lBQzlCLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQztJQUNKLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFyREQsQ0FBaUMsNEJBQWUsR0FxRC9DO0FBckRZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtSZXBlYXR9IGZyb20gJy4uL3JlcGVhdCc7XG5pbXBvcnQge05vcm1hbGl6ZWRSZXBlYXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7VmdMYXlvdXR9IGZyb20gJy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7QmFzZUNvbmNhdE1vZGVsfSBmcm9tICcuL2Jhc2Vjb25jYXQnO1xuaW1wb3J0IHtidWlsZE1vZGVsfSBmcm9tICcuL2J1aWxkbW9kZWwnO1xuaW1wb3J0IHtwYXJzZVJlcGVhdExheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZX0gZnJvbSAnLi9yZXBlYXRlcic7XG5cbmV4cG9ydCBjbGFzcyBSZXBlYXRNb2RlbCBleHRlbmRzIEJhc2VDb25jYXRNb2RlbCB7XG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiAncmVwZWF0JyA9ICdyZXBlYXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVwZWF0OiBSZXBlYXQ7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBNb2RlbFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IE5vcm1hbGl6ZWRSZXBlYXRTcGVjLCBwYXJlbnQ6IE1vZGVsLCBwYXJlbnRHaXZlbk5hbWU6IHN0cmluZywgcmVwZWF0VmFsdWVzOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHJlcGVhdFZhbHVlcywgc3BlYy5yZXNvbHZlKTtcblxuICAgIGlmIChzcGVjLnJlc29sdmUgJiYgc3BlYy5yZXNvbHZlLmF4aXMgJiYgKHNwZWMucmVzb2x2ZS5heGlzLnggPT09ICdzaGFyZWQnIHx8IHNwZWMucmVzb2x2ZS5heGlzLnkgPT09ICdzaGFyZWQnKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcGVhdCA9IHNwZWMucmVwZWF0O1xuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLl9pbml0Q2hpbGRyZW4oc3BlYywgdGhpcy5yZXBlYXQsIHJlcGVhdFZhbHVlcywgY29uZmlnKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRDaGlsZHJlbihzcGVjOiBOb3JtYWxpemVkUmVwZWF0U3BlYywgcmVwZWF0OiBSZXBlYXQsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZyk6IE1vZGVsW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBNb2RlbFtdID0gW107XG4gICAgY29uc3Qgcm93ID0gcmVwZWF0LnJvdyB8fCBbcmVwZWF0ZXIgPyByZXBlYXRlci5yb3cgOiBudWxsXTtcbiAgICBjb25zdCBjb2x1bW4gPSByZXBlYXQuY29sdW1uIHx8IFtyZXBlYXRlciA/IHJlcGVhdGVyLmNvbHVtbiA6IG51bGxdO1xuXG4gICAgLy8gY3Jvc3MgcHJvZHVjdFxuICAgIGZvciAoY29uc3Qgcm93RmllbGQgb2Ygcm93KSB7XG4gICAgICBmb3IgKGNvbnN0IGNvbHVtbkZpZWxkIG9mIGNvbHVtbikge1xuICAgICAgICBjb25zdCBuYW1lID0gKHJvd0ZpZWxkID8gJ18nICsgcm93RmllbGQgOiAnJykgKyAoY29sdW1uRmllbGQgPyAnXycgKyBjb2x1bW5GaWVsZCA6ICcnKTtcblxuICAgICAgICBjb25zdCBjaGlsZFJlcGVhdCA9IHtcbiAgICAgICAgICByb3c6IHJvd0ZpZWxkLFxuICAgICAgICAgIGNvbHVtbjogY29sdW1uRmllbGRcbiAgICAgICAgfTtcblxuICAgICAgICBjaGlsZHJlbi5wdXNoKGJ1aWxkTW9kZWwoc3BlYy5zcGVjLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2NoaWxkJyArIG5hbWUpLCB1bmRlZmluZWQsIGNoaWxkUmVwZWF0LCBjb25maWcsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZVJlcGVhdExheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIC8vIFRPRE86IGFsbG93IGN1c3RvbWl6YXRpb25cbiAgICByZXR1cm4ge1xuICAgICAgcGFkZGluZzoge3JvdzogMTAsIGNvbHVtbjogMTB9LFxuICAgICAgb2Zmc2V0OiAxMCxcbiAgICAgIGNvbHVtbnM6IHRoaXMucmVwZWF0ICYmIHRoaXMucmVwZWF0LmNvbHVtbiA/IHRoaXMucmVwZWF0LmNvbHVtbi5sZW5ndGggOiAxLFxuICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICBhbGlnbjogJ2FsbCdcbiAgICB9O1xuICB9XG59XG4iXX0=