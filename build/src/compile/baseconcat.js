"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../util");
var parse_1 = require("./data/parse");
var assemble_1 = require("./layoutsize/assemble");
var model_1 = require("./model");
var BaseConcatModel = /** @class */ (function (_super) {
    tslib_1.__extends(BaseConcatModel, _super);
    function BaseConcatModel(spec, parent, parentGivenName, config, repeater, resolve) {
        return _super.call(this, spec, parent, parentGivenName, config, repeater, resolve) || this;
    }
    BaseConcatModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    };
    BaseConcatModel.prototype.parseSelection = function () {
        var _this = this;
        // Merge selections up the hierarchy so that they may be referenced
        // across unit specs. Persist their definitions within each child
        // to assemble signals which remain within output Vega unit groups.
        this.component.selection = {};
        var _loop_1 = function (child) {
            child.parseSelection();
            util_1.keys(child.component.selection).forEach(function (key) {
                _this.component.selection[key] = child.component.selection[key];
            });
        };
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _loop_1(child);
        }
    };
    BaseConcatModel.prototype.parseMarkGroup = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMarkGroup();
        }
    };
    BaseConcatModel.prototype.parseAxisAndHeader = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
        // TODO(#2415): support shared axes
    };
    BaseConcatModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.children.reduce(function (sg, child) { return child.assembleSelectionTopLevelSignals(sg); }, signals);
    };
    BaseConcatModel.prototype.assembleSelectionSignals = function () {
        this.children.forEach(function (child) { return child.assembleSelectionSignals(); });
        return [];
    };
    BaseConcatModel.prototype.assembleLayoutSignals = function () {
        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, assemble_1.assembleLayoutSignals(this));
    };
    BaseConcatModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, data);
    };
    BaseConcatModel.prototype.assembleMarks = function () {
        // only children have marks
        return this.children.map(function (child) {
            var title = child.assembleTitle();
            var style = child.assembleGroupStyle();
            var layoutSizeEncodeEntry = child.assembleLayoutSize();
            return tslib_1.__assign({ type: 'group', name: child.getName('group') }, (title ? { title: title } : {}), (style ? { style: style } : {}), (layoutSizeEncodeEntry ? {
                encode: {
                    update: layoutSizeEncodeEntry
                }
            } : {}), child.assembleGroup());
        });
    };
    return BaseConcatModel;
}(model_1.Model));
exports.BaseConcatModel = BaseConcatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWNvbmNhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2Jhc2Vjb25jYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsZ0NBQTZCO0FBRTdCLHNDQUF1QztBQUN2QyxrREFBNEQ7QUFDNUQsaUNBQThCO0FBRzlCO0lBQThDLDJDQUFLO0lBQ2pELHlCQUFZLElBQWMsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxNQUFjLEVBQUUsUUFBdUIsRUFBRSxPQUFnQjtlQUMzSCxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztJQUNqRSxDQUFDO0lBRU0sbUNBQVMsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ00sd0NBQWMsR0FBckI7UUFBQSxpQkFXQztRQVZDLG1FQUFtRTtRQUNuRSxpRUFBaUU7UUFDakUsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQ0FDbkIsS0FBSztZQUNkLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixXQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUMxQyxLQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFMRCxLQUFvQixV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b3J0IHtDb25maWd9IGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQge1Jlc29sdmV9IGZyb20gJy4uL3Jlc29sdmUnO1xuaW1wb3J0IHtCYXNlU3BlY30gZnJvbSAnLi4vc3BlYyc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGEsIFZnU2lnbmFsfSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlRGF0YX0gZnJvbSAnLi9kYXRhL3BhcnNlJztcbmltcG9ydCB7YXNzZW1ibGVMYXlvdXRTaWduYWxzfSBmcm9tICcuL2xheW91dHNpemUvYXNzZW1ibGUnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWV9IGZyb20gJy4vcmVwZWF0ZXInO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZUNvbmNhdE1vZGVsIGV4dGVuZHMgTW9kZWwge1xuICBjb25zdHJ1Y3RvcihzcGVjOiBCYXNlU3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIGNvbmZpZzogQ29uZmlnLCByZXBlYXRlcjogUmVwZWF0ZXJWYWx1ZSwgcmVzb2x2ZTogUmVzb2x2ZSkge1xuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHJlcGVhdGVyLCByZXNvbHZlKTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZURhdGEoKSB7XG4gICAgdGhpcy5jb21wb25lbnQuZGF0YSA9IHBhcnNlRGF0YSh0aGlzKTtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5wYXJzZURhdGEoKTtcbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgcGFyc2VTZWxlY3Rpb24oKSB7XG4gICAgLy8gTWVyZ2Ugc2VsZWN0aW9ucyB1cCB0aGUgaGllcmFyY2h5IHNvIHRoYXQgdGhleSBtYXkgYmUgcmVmZXJlbmNlZFxuICAgIC8vIGFjcm9zcyB1bml0IHNwZWNzLiBQZXJzaXN0IHRoZWlyIGRlZmluaXRpb25zIHdpdGhpbiBlYWNoIGNoaWxkXG4gICAgLy8gdG8gYXNzZW1ibGUgc2lnbmFscyB3aGljaCByZW1haW4gd2l0aGluIG91dHB1dCBWZWdhIHVuaXQgZ3JvdXBzLlxuICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbiA9IHt9O1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICAgIGtleXMoY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbikuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMuY29tcG9uZW50LnNlbGVjdGlvbltrZXldID0gY2hpbGQuY29tcG9uZW50LnNlbGVjdGlvbltrZXldO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlTWFya0dyb3VwKCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VNYXJrR3JvdXAoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcGFyc2VBeGlzQW5kSGVhZGVyKCkge1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgY2hpbGQucGFyc2VBeGlzQW5kSGVhZGVyKCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETygjMjQxNSk6IHN1cHBvcnQgc2hhcmVkIGF4ZXNcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzOiBhbnlbXSk6IFZnU2lnbmFsW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoc2csIGNoaWxkKSA9PiBjaGlsZC5hc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzZyksIHNpZ25hbHMpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uU2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBjaGlsZC5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0U2lnbmFscygpOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKHNpZ25hbHMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gc2lnbmFscy5jb25jYXQoY2hpbGQuYXNzZW1ibGVMYXlvdXRTaWduYWxzKCkpO1xuICAgIH0sIGFzc2VtYmxlTGF5b3V0U2lnbmFscyh0aGlzKSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLnJlZHVjZSgoZGIsIGNoaWxkKSA9PiBjaGlsZC5hc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGIpLCBkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCk6IGFueVtdIHtcbiAgICAvLyBvbmx5IGNoaWxkcmVuIGhhdmUgbWFya3NcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5tYXAoY2hpbGQgPT4ge1xuICAgICAgY29uc3QgdGl0bGUgPSBjaGlsZC5hc3NlbWJsZVRpdGxlKCk7XG4gICAgICBjb25zdCBzdHlsZSA9IGNoaWxkLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuICAgICAgY29uc3QgbGF5b3V0U2l6ZUVuY29kZUVudHJ5ID0gY2hpbGQuYXNzZW1ibGVMYXlvdXRTaXplKCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgICBuYW1lOiBjaGlsZC5nZXROYW1lKCdncm91cCcpLFxuICAgICAgICAuLi4odGl0bGUgPyB7dGl0bGV9IDoge30pLFxuICAgICAgICAuLi4oc3R5bGUgPyB7c3R5bGV9IDoge30pLFxuICAgICAgICAuLi4obGF5b3V0U2l6ZUVuY29kZUVudHJ5ID8ge1xuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiBsYXlvdXRTaXplRW5jb2RlRW50cnlcbiAgICAgICAgICB9XG4gICAgICAgIH0gOiB7fSksXG4gICAgICAgIC4uLmNoaWxkLmFzc2VtYmxlR3JvdXAoKVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIl19