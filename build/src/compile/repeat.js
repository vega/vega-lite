"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var baseconcat_1 = require("./baseconcat");
var buildmodel_1 = require("./buildmodel");
var parse_1 = require("./layoutsize/parse");
var RepeatModel = /** @class */ (function (_super) {
    __extends(RepeatModel, _super);
    function RepeatModel(spec, parent, parentGivenName, repeatValues, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUVBLDRCQUE4QjtBQUk5QiwyQ0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUF5RDtBQUl6RDtJQUFpQywrQkFBZTtJQU05QyxxQkFBWSxJQUEwQixFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFlBQTJCLEVBQUUsTUFBYztRQUEzSCxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBUTNEO1FBZGUsVUFBSSxHQUFhLFFBQVEsQ0FBQztRQVF4QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hILEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQzs7SUFDOUUsQ0FBQztJQUVPLG1DQUFhLEdBQXJCLFVBQXNCLElBQTBCLEVBQUUsTUFBYyxFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUN2RyxJQUFNLFFBQVEsR0FBWSxFQUFFLENBQUM7UUFDN0IsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEUsZ0JBQWdCO1FBQ2hCLEdBQUcsQ0FBQyxDQUFtQixVQUFHLEVBQUgsV0FBRyxFQUFILGlCQUFHLEVBQUgsSUFBRztZQUFyQixJQUFNLFFBQVEsWUFBQTtZQUNqQixHQUFHLENBQUMsQ0FBc0IsVUFBTSxFQUFOLGlCQUFNLEVBQU4sb0JBQU0sRUFBTixJQUFNO2dCQUEzQixJQUFNLFdBQVcsZUFBQTtnQkFDcEIsSUFBTSxNQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFdkYsSUFBTSxXQUFXLEdBQUc7b0JBQ2xCLEdBQUcsRUFBRSxRQUFRO29CQUNiLE1BQU0sRUFBRSxXQUFXO2lCQUNwQixDQUFDO2dCQUVGLFFBQVEsQ0FBQyxJQUFJLENBQUMsdUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFJLENBQUMsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2pIO1NBQ0Y7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxxQ0FBZSxHQUF0QjtRQUNFLDZCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxvQ0FBYyxHQUFyQjtRQUNFLDRCQUE0QjtRQUM1QixNQUFNLENBQUM7WUFDTCxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7WUFDOUIsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXJERCxDQUFpQyw0QkFBZSxHQXFEL0M7QUFyRFksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL2xvZyc7XG5pbXBvcnQge1JlcGVhdH0gZnJvbSAnLi4vcmVwZWF0JztcbmltcG9ydCB7Tm9ybWFsaXplZFJlcGVhdFNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtWZ0xheW91dH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtCYXNlQ29uY2F0TW9kZWx9IGZyb20gJy4vYmFzZWNvbmNhdCc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge3BhcnNlUmVwZWF0TGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlfSBmcm9tICcuL3JlcGVhdGVyJztcblxuZXhwb3J0IGNsYXNzIFJlcGVhdE1vZGVsIGV4dGVuZHMgQmFzZUNvbmNhdE1vZGVsIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICdyZXBlYXQnID0gJ3JlcGVhdCc7XG4gIHB1YmxpYyByZWFkb25seSByZXBlYXQ6IFJlcGVhdDtcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZFJlcGVhdFNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLCByZXBlYXRWYWx1ZXM6IFJlcGVhdGVyVmFsdWUsIGNvbmZpZzogQ29uZmlnKSB7XG4gICAgc3VwZXIoc3BlYywgcGFyZW50LCBwYXJlbnRHaXZlbk5hbWUsIGNvbmZpZywgc3BlYy5yZXNvbHZlKTtcblxuICAgIGlmIChzcGVjLnJlc29sdmUgJiYgc3BlYy5yZXNvbHZlLmF4aXMgJiYgKHNwZWMucmVzb2x2ZS5heGlzLnggPT09ICdzaGFyZWQnIHx8IHNwZWMucmVzb2x2ZS5heGlzLnkgPT09ICdzaGFyZWQnKSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuUkVQRUFUX0NBTk5PVF9TSEFSRV9BWElTKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlcGVhdCA9IHNwZWMucmVwZWF0O1xuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLl9pbml0Q2hpbGRyZW4oc3BlYywgdGhpcy5yZXBlYXQsIHJlcGVhdFZhbHVlcywgY29uZmlnKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRDaGlsZHJlbihzcGVjOiBOb3JtYWxpemVkUmVwZWF0U3BlYywgcmVwZWF0OiBSZXBlYXQsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZyk6IE1vZGVsW10ge1xuICAgIGNvbnN0IGNoaWxkcmVuOiBNb2RlbFtdID0gW107XG4gICAgY29uc3Qgcm93ID0gcmVwZWF0LnJvdyB8fCBbcmVwZWF0ZXIgPyByZXBlYXRlci5yb3cgOiBudWxsXTtcbiAgICBjb25zdCBjb2x1bW4gPSByZXBlYXQuY29sdW1uIHx8IFtyZXBlYXRlciA/IHJlcGVhdGVyLmNvbHVtbiA6IG51bGxdO1xuXG4gICAgLy8gY3Jvc3MgcHJvZHVjdFxuICAgIGZvciAoY29uc3Qgcm93RmllbGQgb2Ygcm93KSB7XG4gICAgICBmb3IgKGNvbnN0IGNvbHVtbkZpZWxkIG9mIGNvbHVtbikge1xuICAgICAgICBjb25zdCBuYW1lID0gKHJvd0ZpZWxkID8gJ18nICsgcm93RmllbGQgOiAnJykgKyAoY29sdW1uRmllbGQgPyAnXycgKyBjb2x1bW5GaWVsZCA6ICcnKTtcblxuICAgICAgICBjb25zdCBjaGlsZFJlcGVhdCA9IHtcbiAgICAgICAgICByb3c6IHJvd0ZpZWxkLFxuICAgICAgICAgIGNvbHVtbjogY29sdW1uRmllbGRcbiAgICAgICAgfTtcblxuICAgICAgICBjaGlsZHJlbi5wdXNoKGJ1aWxkTW9kZWwoc3BlYy5zcGVjLCB0aGlzLCB0aGlzLmdldE5hbWUoJ2NoaWxkJyArIG5hbWUpLCB1bmRlZmluZWQsIGNoaWxkUmVwZWF0LCBjb25maWcsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTGF5b3V0U2l6ZSgpIHtcbiAgICBwYXJzZVJlcGVhdExheW91dFNpemUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXQoKTogVmdMYXlvdXQge1xuICAgIC8vIFRPRE86IGFsbG93IGN1c3RvbWl6YXRpb25cbiAgICByZXR1cm4ge1xuICAgICAgcGFkZGluZzoge3JvdzogMTAsIGNvbHVtbjogMTB9LFxuICAgICAgb2Zmc2V0OiAxMCxcbiAgICAgIGNvbHVtbnM6IHRoaXMucmVwZWF0ICYmIHRoaXMucmVwZWF0LmNvbHVtbiA/IHRoaXMucmVwZWF0LmNvbHVtbi5sZW5ndGggOiAxLFxuICAgICAgYm91bmRzOiAnZnVsbCcsXG4gICAgICBhbGlnbjogJ2FsbCdcbiAgICB9O1xuICB9XG59XG4iXX0=