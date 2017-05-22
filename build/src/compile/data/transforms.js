"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var filter_1 = require("../../filter");
var log = require("../../log");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var source_1 = require("./source");
var timeunit_1 = require("./timeunit");
var FilterNode = (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(model, filter) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.filter = filter;
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(this.model, util_1.duplicate(this.filter));
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: filter_1.expression(this.model, this.filter)
        };
    };
    return FilterNode;
}(dataflow_1.DataFlowNode));
exports.FilterNode = FilterNode;
/**
 * We don't know what a calculate node depends on so we should never move it beyond anything that produces fields.
 */
var CalculateNode = (function (_super) {
    tslib_1.__extends(CalculateNode, _super);
    function CalculateNode(transform) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        return _this;
    }
    CalculateNode.prototype.clone = function () {
        return new CalculateNode(util_1.duplicate(this.transform));
    };
    CalculateNode.prototype.producedFields = function () {
        var out = {};
        out[this.transform.as] = true;
        return out;
    };
    CalculateNode.prototype.assemble = function () {
        return {
            type: 'formula',
            expr: this.transform.calculate,
            as: this.transform.as
        };
    };
    return CalculateNode;
}(dataflow_1.DataFlowNode));
exports.CalculateNode = CalculateNode;
var LookupNode = (function (_super) {
    tslib_1.__extends(LookupNode, _super);
    function LookupNode(transform, secondary) {
        var _this = _super.call(this) || this;
        _this.transform = transform;
        _this.secondary = secondary;
        return _this;
    }
    LookupNode.make = function (model, transform, counter) {
        var sources = model.component.data.sources;
        var s = new source_1.SourceNode(transform.from.data);
        var fromSource = sources[s.hash()];
        if (!fromSource) {
            sources[s.hash()] = s;
            fromSource = s;
        }
        var fromOutputName = model.getName("lookup_" + counter);
        var fromOutputNode = new dataflow_1.OutputNode(fromOutputName, 'lookup');
        fromOutputNode.parent = fromSource;
        model.component.data.outputNodes[fromOutputName] = fromOutputNode;
        return new LookupNode(transform, fromOutputNode.source);
    };
    LookupNode.prototype.assemble = function () {
        var foreign;
        if (this.transform.from.fields) {
            // lookup a few fields and add create a flat output
            foreign = tslib_1.__assign({ values: this.transform.from.fields }, this.transform.as ? { as: ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]) } : {});
        }
        else {
            // lookup full record and nest it
            var asName = this.transform.as;
            if (!vega_util_1.isString(asName)) {
                log.warn(log.message.NO_FIELDS_NEEDS_AS);
                asName = '_lookup';
            }
            foreign = {
                as: [asName]
            };
        }
        return tslib_1.__assign({ type: 'lookup', from: this.secondary, key: this.transform.from.key, fields: [this.transform.lookup] }, foreign, (this.transform.default ? { default: this.transform.default } : {}));
    };
    return LookupNode;
}(dataflow_1.DataFlowNode));
exports.LookupNode = LookupNode;
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(model) {
    var first;
    var node;
    var previous;
    var lookupCounter = 0;
    model.transforms.forEach(function (t, i) {
        if (transform_1.isCalculate(t)) {
            node = new CalculateNode(t);
        }
        else if (transform_1.isFilter(t)) {
            node = new FilterNode(model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            node = bin_1.BinNode.makeBinFromTransform(model, t);
        }
        else if (transform_1.isTimeUnit(t)) {
            node = timeunit_1.TimeUnitNode.makeFromTransfrom(model, t);
        }
        else if (transform_1.isSummarize(t)) {
            node = aggregate_1.AggregateNode.makeFromTransform(model, t);
        }
        else if (transform_1.isLookup(t)) {
            node = LookupNode.make(model, t, lookupCounter++);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        if (i === 0) {
            first = node;
        }
        else {
            node.parent = previous;
        }
        previous = node;
    });
    var last = node;
    return { first: first, last: last };
}
exports.parseTransformArray = parseTransformArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBNEM7QUFDNUMsdUNBQWdEO0FBQ2hELCtCQUFpQztBQUNqQyw2Q0FBc0o7QUFDdEosbUNBQXFDO0FBSXJDLHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIsdUNBQW9EO0FBRXBELG1DQUFvQztBQUNwQyx1Q0FBd0M7QUFFeEM7SUFBZ0Msc0NBQVk7SUFLMUMsb0JBQTZCLEtBQVksRUFBVSxNQUFjO1FBQWpFLFlBQ0UsaUJBQU8sU0FDUjtRQUY0QixXQUFLLEdBQUwsS0FBSyxDQUFPO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBUTs7SUFFakUsQ0FBQztJQU5NLDBCQUFLLEdBQVo7UUFDRSxNQUFNLENBQUMsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFNTSw2QkFBUSxHQUFmO1FBQ0UsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsbUJBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDMUMsQ0FBQztJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFmRCxDQUFnQyx1QkFBWSxHQWUzQztBQWZZLGdDQUFVO0FBaUJ2Qjs7R0FFRztBQUNIO0lBQW1DLHlDQUFZO0lBSzdDLHVCQUFvQixTQUE2QjtRQUFqRCxZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsZUFBUyxHQUFULFNBQVMsQ0FBb0I7O0lBRWpELENBQUM7SUFOTSw2QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksYUFBYSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENB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