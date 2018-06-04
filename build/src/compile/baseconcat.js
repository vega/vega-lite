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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZWNvbmNhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21waWxlL2Jhc2Vjb25jYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsZ0NBQTZCO0FBRTdCLHNDQUF1QztBQUN2QyxrREFBNEQ7QUFDNUQsaUNBQThCO0FBRzlCO0lBQThDLDJDQUFLO0lBQ2pELHlCQUFZLElBQWMsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxNQUFjLEVBQUUsUUFBdUIsRUFBRSxPQUFnQjtlQUMzSCxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQztJQUNqRSxDQUFDO0lBRU0sbUNBQVMsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ00sd0NBQWMsR0FBckI7UUFBQSxpQkFXQztRQVZDLG1FQUFtRTtRQUNuRSxpRUFBaUU7UUFDakUsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQ0FDbkIsS0FBSztZQUNkLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixXQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUMxQyxLQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFMRCxLQUFvQixV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ZW50IjpbImltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtSZXNvbHZlfSBmcm9tICcuLi9yZXNvbHZlJztcbmltcG9ydCB7QmFzZVNwZWN9IGZyb20gJy4uL3NwZWMnO1xuaW1wb3J0IHtrZXlzfSBmcm9tICcuLi91dGlsJztcbmltcG9ydCB7VmdEYXRhLCBWZ1NpZ25hbH0gZnJvbSAnLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2Fzc2VtYmxlTGF5b3V0U2lnbmFsc30gZnJvbSAnLi9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCB7TW9kZWx9IGZyb20gJy4vbW9kZWwnO1xuaW1wb3J0IHtSZXBlYXRlclZhbHVlfSBmcm9tICcuL3JlcGVhdGVyJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VDb25jYXRNb2RlbCBleHRlbmRzIE1vZGVsIHtcbiAgY29uc3RydWN0b3Ioc3BlYzogQmFzZVNwZWMsIHBhcmVudDogTW9kZWwsIHBhcmVudEdpdmVuTmFtZTogc3RyaW5nLCBjb25maWc6IENvbmZpZywgcmVwZWF0ZXI6IFJlcGVhdGVyVmFsdWUsIHJlc29sdmU6IFJlc29sdmUpIHtcbiAgICBzdXBlcihzcGVjLCBwYXJlbnQsIHBhcmVudEdpdmVuTmFtZSwgY29uZmlnLCByZXBlYXRlciwgcmVzb2x2ZSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VEYXRhKCkge1xuICAgIHRoaXMuY29tcG9uZW50LmRhdGEgPSBwYXJzZURhdGEodGhpcyk7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQucGFyc2VEYXRhKCk7XG4gICAgfSk7XG4gIH1cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIC8vIE1lcmdlIHNlbGVjdGlvbnMgdXAgdGhlIGhpZXJhcmNoeSBzbyB0aGF0IHRoZXkgbWF5IGJlIHJlZmVyZW5jZWRcbiAgICAvLyBhY3Jvc3MgdW5pdCBzcGVjcy4gUGVyc2lzdCB0aGVpciBkZWZpbml0aW9ucyB3aXRoaW4gZWFjaCBjaGlsZFxuICAgIC8vIHRvIGFzc2VtYmxlIHNpZ25hbHMgd2hpY2ggcmVtYWluIHdpdGhpbiBvdXRwdXQgVmVnYSB1bml0IGdyb3Vwcy5cbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7fTtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcnNlU2VsZWN0aW9uKCk7XG4gICAgICBrZXlzKGNoaWxkLmNvbXBvbmVudC5zZWxlY3Rpb24pLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb25ba2V5XSA9IGNoaWxkLmNvbXBvbmVudC5zZWxlY3Rpb25ba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwYXJzZU1hcmtHcm91cCgpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcnNlTWFya0dyb3VwKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuICAgIH1cblxuICAgIC8vIFRPRE8oIzI0MTUpOiBzdXBwb3J0IHNoYXJlZCBheGVzXG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKHNnLCBjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2cpLCBzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCkpO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ucmVkdWNlKChzaWduYWxzLCBjaGlsZCkgPT4ge1xuICAgICAgcmV0dXJuIHNpZ25hbHMuY29uY2F0KGNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpKTtcbiAgICB9LCBhc3NlbWJsZUxheW91dFNpZ25hbHModGhpcykpO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5yZWR1Y2UoKGRiLCBjaGlsZCkgPT4gY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRiKSwgZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpOiBhbnlbXSB7XG4gICAgLy8gb25seSBjaGlsZHJlbiBoYXZlIG1hcmtzXG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubWFwKGNoaWxkID0+IHtcbiAgICAgIGNvbnN0IHRpdGxlID0gY2hpbGQuYXNzZW1ibGVUaXRsZSgpO1xuICAgICAgY29uc3Qgc3R5bGUgPSBjaGlsZC5hc3NlbWJsZUdyb3VwU3R5bGUoKTtcbiAgICAgIGNvbnN0IGxheW91dFNpemVFbmNvZGVFbnRyeSA9IGNoaWxkLmFzc2VtYmxlTGF5b3V0U2l6ZSgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2dyb3VwJyxcbiAgICAgICAgbmFtZTogY2hpbGQuZ2V0TmFtZSgnZ3JvdXAnKSxcbiAgICAgICAgLi4uKHRpdGxlID8ge3RpdGxlfSA6IHt9KSxcbiAgICAgICAgLi4uKHN0eWxlID8ge3N0eWxlfSA6IHt9KSxcbiAgICAgICAgLi4uKGxheW91dFNpemVFbmNvZGVFbnRyeSA/IHtcbiAgICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICAgIHVwZGF0ZTogbGF5b3V0U2l6ZUVuY29kZUVudHJ5XG4gICAgICAgICAgfVxuICAgICAgICB9IDoge30pLFxuICAgICAgICAuLi5jaGlsZC5hc3NlbWJsZUdyb3VwKClcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==