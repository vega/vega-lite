"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var spec_1 = require("../spec");
var util_1 = require("../util");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var model_1 = require("./model");
var ConcatModel = (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.isVConcat = spec_1.isVConcatSpec(spec);
        _this.children = (spec_1.isVConcatSpec(spec) ? spec.vconcat : spec.hconcat).map(function (child, i) {
            return common_1.buildModel(child, _this, _this.getName('concat_' + i), undefined, repeater, config);
        });
        return _this;
    }
    ConcatModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.children.forEach(function (child) {
            child.parseData();
        });
    };
    ConcatModel.prototype.parseSelection = function () {
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
    ConcatModel.prototype.parseScale = function () {
        var model = this;
        var scaleComponent = this.component.scales = {};
        this.children.forEach(function (child) {
            child.parseScale();
        });
    };
    ConcatModel.prototype.parseMark = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMark();
        }
    };
    ConcatModel.prototype.parseAxisAndHeader = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
    };
    ConcatModel.prototype.parseAxisGroup = function () {
        return null;
    };
    ConcatModel.prototype.parseLegend = function () {
        var legendComponent = this.component.legends = {};
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseLegend();
        }
    };
    ConcatModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    ConcatModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    ConcatModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.children.reduce(function (sg, child) { return child.assembleSelectionTopLevelSignals(sg); }, signals);
    };
    ConcatModel.prototype.assembleSelectionSignals = function () {
        this.children.forEach(function (child) { return child.assembleSelectionSignals(); });
        return [];
    };
    ConcatModel.prototype.assembleLayoutSignals = function () {
        return this.children.reduce(function (signals, child) {
            return signals.concat(child.assembleLayoutSignals());
        }, []);
    };
    ConcatModel.prototype.assembleSelectionData = function (data) {
        return this.children.reduce(function (db, child) { return child.assembleSelectionData(db); }, []);
    };
    ConcatModel.prototype.assembleScales = function () {
        // combine with scales from children
        return this.children.reduce(function (scales, c) {
            return scales.concat(c.assembleScales());
        }, _super.prototype.assembleScales.call(this));
    };
    ConcatModel.prototype.assembleLayout = function () {
        // TODO: allow customization
        return tslib_1.__assign({ padding: { row: 10, column: 10 }, offset: 10 }, (this.isVConcat ? { columns: 1 } : {}), { bounds: 'full', align: 'all' });
    };
    ConcatModel.prototype.assembleMarks = function () {
        // only children have marks
        return this.children.map(function (child) {
            var encodeEntry = child.assembleParentGroupProperties();
            return tslib_1.__assign({ type: 'group', name: child.getName('group') }, (encodeEntry ? {
                encode: {
                    update: encodeEntry
                }
            } : {}), child.assembleGroup());
        });
    };
    return ConcatModel;
}(model_1.Model));
exports.ConcatModel = ConcatModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGdDQUE4RDtBQUM5RCxnQ0FBeUM7QUFFekMsbUNBQW9DO0FBQ3BDLDRDQUE2QztBQUM3QyxzQ0FBdUM7QUFDdkMsaUNBQThCO0FBSTlCO0lBQWlDLHVDQUFLO0lBTXBDLHFCQUFZLElBQWdCLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsUUFBdUIsRUFBRSxNQUFjO1FBQTdHLFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLFNBTzdDO1FBTEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJDLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxvQkFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9FLE1BQU0sQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzRixDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRU0sK0JBQVMsR0FBaEI7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sb0NBQWMsR0FBckI7UUFBQSxpQkFXQztRQVZDLG1F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