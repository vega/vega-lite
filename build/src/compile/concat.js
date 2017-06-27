"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var resolve_1 = require("../resolve");
var spec_1 = require("../spec");
var util_1 = require("../util");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var parse_2 = require("./legend/parse");
var model_1 = require("./model");
var ConcatModel = (function (_super) {
    tslib_1.__extends(ConcatModel, _super);
    function ConcatModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, resolve_1.initConcatResolve(spec.resolve || {})) || this;
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
    ConcatModel.prototype.parseMarkGroup = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseMarkGroup();
        }
    };
    ConcatModel.prototype.parseAxisAndHeader = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.parseAxisAndHeader();
        }
        // TODO(#2415): support shared axes
    };
    ConcatModel.prototype.parseAxisGroup = function () {
        return null;
    };
    ConcatModel.prototype.parseLegend = function () {
        parse_2.parseNonUnitLegend(this);
    };
    ConcatModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(this.component.data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBpbGUvY29uY2F0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLHNDQUE2RDtBQUU3RCxnQ0FBOEQ7QUFDOUQsZ0NBQXlDO0FBRXpDLG1DQUFvQztBQUNwQyw0Q0FBNkM7QUFDN0Msc0NBQXVDO0FBQ3ZDLHdDQUFrRDtBQUNsRCxpQ0FBOEI7QUFLOUI7SUFBaUMsdUNBQUs7SUFNcEMscUJBQVksSUFBZ0IsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBN0csWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsMkJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxTQU9wRjtRQUxDLEtBQUksQ0FBQyxTQUFTLEdBQUcsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsb0JBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQztZQUMvRSxNQUFNLENBQUMsbUJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSSxFQUFFLEtBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7O0lBQ0wsQ0FBQztJQUVNLCtCQUFTLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDMUIsS0FBSyxDQUFDLFNBQVMsRUFB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