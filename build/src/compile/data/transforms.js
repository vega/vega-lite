"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var datetime_1 = require("../../datetime");
var filter_1 = require("../../filter");
var log = require("../../log");
var selection_1 = require("../../selection");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var selection_2 = require("../selection/selection");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
var timeunit_1 = require("./timeunit");
var FilterNode = (function (_super) {
    tslib_1.__extends(FilterNode, _super);
    function FilterNode(model, filter) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.filter = filter;
        _this.expr = filter_1.expression(_this.model, _this.filter, _this);
        return _this;
    }
    FilterNode.prototype.clone = function () {
        return new FilterNode(this.model, util_1.duplicate(this.filter));
    };
    FilterNode.prototype.assemble = function () {
        return {
            type: 'filter',
            expr: this.expr
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
        var fromOutputNode = new dataflow_1.OutputNode(fromOutputName, 'lookup', model.component.data.outputNodeRefCounts);
        fromOutputNode.parent = fromSource;
        model.component.data.outputNodes[fromOutputName] = fromOutputNode;
        return new LookupNode(transform, fromOutputNode.getSource());
    };
    LookupNode.prototype.producedFields = function () {
        return util_1.toSet(this.transform.from.fields || ((this.transform.as instanceof Array) ? this.transform.as : [this.transform.as]));
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
var IdentifierNode = (function (_super) {
    tslib_1.__extends(IdentifierNode, _super);
    function IdentifierNode() {
        return _super.call(this) || this;
    }
    IdentifierNode.prototype.clone = function () {
        return new IdentifierNode();
    };
    IdentifierNode.prototype.producedFields = function () {
        return _a = {}, _a[selection_1.SELECTION_ID] = true, _a;
        var _a;
    };
    IdentifierNode.prototype.assemble = function () {
        return { type: 'identifier', as: selection_1.SELECTION_ID };
    };
    return IdentifierNode;
}(dataflow_1.DataFlowNode));
exports.IdentifierNode = IdentifierNode;
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(model) {
    var first = null;
    var node;
    var previous;
    var lookupCounter = 0;
    function insert(newNode) {
        if (!first) {
            // A parent may be inserted during node construction
            // (e.g., selection FilterNodes may add a TimeUnitNode).
            first = newNode.parent || newNode;
        }
        else if (newNode.parent) {
            previous.insertAsParentOf(newNode);
        }
        else {
            newNode.parent = previous;
        }
        previous = newNode;
    }
    model.transforms.forEach(function (t) {
        if (transform_1.isCalculate(t)) {
            node = new CalculateNode(t);
        }
        else if (transform_1.isFilter(t)) {
            // Automatically add a parse node for filters with filter objects
            var parse = {};
            var filter = t.filter;
            var val = null;
            // For EqualFilter, just use the equal property.
            // For RangeFilter and OneOfFilter, all array members should have
            // the same type, so we only use the first one.
            if (filter_1.isEqualFilter(filter)) {
                val = filter.equal;
            }
            else if (filter_1.isRangeFilter(filter)) {
                val = filter.range[0];
            }
            else if (filter_1.isOneOfFilter(filter)) {
                val = (filter.oneOf || filter['in'])[0];
            } // else -- for filter expression, we can't infer anything
            if (val) {
                if (datetime_1.isDateTime(val)) {
                    parse[filter['field']] = 'date';
                }
                else if (vega_util_1.isNumber(val)) {
                    parse[filter['field']] = 'number';
                }
                else if (vega_util_1.isString(val)) {
                    parse[filter['field']] = 'string';
                }
            }
            if (util_1.keys(parse).length > 0) {
                var parseNode = new formatparse_1.ParseNode(parse);
                insert(parseNode);
            }
            node = new FilterNode(model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            node = bin_1.BinNode.makeFromTransform(model, t);
        }
        else if (transform_1.isTimeUnit(t)) {
            node = timeunit_1.TimeUnitNode.makeFromTransform(model, t);
        }
        else if (transform_1.isSummarize(t)) {
            node = aggregate_1.AggregateNode.makeFromTransform(model, t);
            if (selection_2.requiresSelectionId(model)) {
                insert(node);
                node = new IdentifierNode();
            }
        }
        else if (transform_1.isLookup(t)) {
            node = LookupNode.make(model, t, lookupCounter++);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        insert(node);
    });
    var last = node;
    return { first: first, last: last };
}
exports.parseTransformArray = parseTransformArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBc0Q7QUFDdEQsMkNBQW9EO0FBQ3BELHVDQUE2RjtBQUM3RiwrQkFBaUM7QUFFakMsNkNBQTZDO0FBQzdDLDZDQVV5QjtBQUN6QixtQ0FBNkQ7QUFJN0Qsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIsdUNBQW9EO0FBRXBELDZDQUF3QztBQUN4QyxtQ0FBb0M7QUFDcEMsdUNBQXdDO0FBR3hDO0lBQWdDLHNDQUFZO0lBTTFDLG9CQUE2QixLQUFZLEVBQVUsTUFBOEI7UUFBakYsWUFDRSxpQkFBTyxTQUVSO1FBSDRCLFdBQUssR0FBTCxLQUFLLENBQU87UUFBVSxZQUFNLEdBQU4sTUFBTSxDQUF3QjtRQUUvRSxLQUFJLENBQUMsSUFBSSxHQUFHLG1CQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxDQUFDOztJQUN4RCxDQUFDO0lBUE0sMEJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQU9NLDZCQUFRLEdBQWY7UUFDRSxNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUFnQyx1QkFBWSxHQWlCM0M7QUFqQlksZ0NBQVU7QUFtQnZCOztHQUVHO0FBQ0g7SUFBbUMseUNBQVk7SUFLN0MsdUJBQW9CLFNBQTZCO1FBQWpELFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixlQUFT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