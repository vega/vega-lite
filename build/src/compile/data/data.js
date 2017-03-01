"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var source_1 = require("./source");
var formatparse_1 = require("./formatparse");
var nullfilter_1 = require("./nullfilter");
var filter_1 = require("./filter");
var bin_1 = require("./bin");
var formula_1 = require("./formula");
var pathorder_1 = require("./pathorder");
var nonpositivefilter_1 = require("./nonpositivefilter");
var summary_1 = require("./summary");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
// TODO: split this file into multiple files and remove this linter flag
/* tslint:disable:no-use-before-declare */
function parseUnitData(model) {
    return {
        formatParse: formatparse_1.formatParse.parseUnit(model),
        nullFilter: nullfilter_1.nullFilter.parseUnit(model),
        filter: filter_1.filter.parseUnit(model),
        nonPositiveFilter: nonpositivefilter_1.nonPositiveFilter.parseUnit(model),
        pathOrder: pathorder_1.pathOrder.parseUnit(model),
        source: source_1.source.parseUnit(model),
        bin: bin_1.bin.parseUnit(model),
        calculate: formula_1.formula.parseUnit(model),
        timeUnit: timeunit_1.timeUnit.parseUnit(model),
        summary: summary_1.summary.parseUnit(model),
        stack: stack_1.stack.parseUnit(model)
    };
}
exports.parseUnitData = parseUnitData;
function parseFacetData(model) {
    return {
        formatParse: formatparse_1.formatParse.parseFacet(model),
        nullFilter: nullfilter_1.nullFilter.parseFacet(model),
        filter: filter_1.filter.parseFacet(model),
        nonPositiveFilter: nonpositivefilter_1.nonPositiveFilter.parseFacet(model),
        pathOrder: pathorder_1.pathOrder.parseFacet(model),
        source: source_1.source.parseFacet(model),
        bin: bin_1.bin.parseFacet(model),
        calculate: formula_1.formula.parseFacet(model),
        timeUnit: timeunit_1.timeUnit.parseFacet(model),
        summary: summary_1.summary.parseFacet(model),
        stack: stack_1.stack.parseFacet(model)
    };
}
exports.parseFacetData = parseFacetData;
function parseLayerData(model) {
    return {
        // filter and formatParse could cause us to not be able to merge into parent
        // so let's parse them first
        filter: filter_1.filter.parseLayer(model),
        formatParse: formatparse_1.formatParse.parseLayer(model),
        nullFilter: nullfilter_1.nullFilter.parseLayer(model),
        nonPositiveFilter: nonpositivefilter_1.nonPositiveFilter.parseLayer(model),
        pathOrder: pathorder_1.pathOrder.parseLayer(model),
        // everything after here does not affect whether we can merge child data into parent or not
        source: source_1.source.parseLayer(model),
        bin: bin_1.bin.parseLayer(model),
        calculate: formula_1.formula.parseLayer(model),
        timeUnit: timeunit_1.timeUnit.parseLayer(model),
        summary: summary_1.summary.parseLayer(model),
        stack: stack_1.stack.parseLayer(model)
    };
}
exports.parseLayerData = parseLayerData;
/* tslint:enable:no-use-before-declare */
/**
 * Creates Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
function assembleData(model, data) {
    var dataComponent = model.component.data;
    var sourceData = source_1.source.assemble(dataComponent);
    if (sourceData) {
        data.push(sourceData);
    }
    summary_1.summary.assemble(dataComponent.summary || [], model.dataName(data_1.SOURCE)).forEach(function (summaryData) {
        data.push(summaryData);
    });
    // nonPositiveFilter
    var nonPositiveFilterTransform = nonpositivefilter_1.nonPositiveFilter.assemble(dataComponent.nonPositiveFilter);
    if (nonPositiveFilterTransform.length > 0) {
        if (data.length > 0) {
            var dataTable = data[data.length - 1];
            dataTable.transform = (dataTable.transform || []).concat(nonPositiveFilterTransform);
        }
        else {
            throw new Error('Invalid nonPositiveFilter not merged');
        }
    }
    // stack
    var stackData = stack_1.stack.assemble(dataComponent.stack);
    if (stackData) {
        data.push(stackData);
    }
    // Path Order
    var pathOrderCollectTransform = pathorder_1.pathOrder.assemble(dataComponent.pathOrder);
    if (pathOrderCollectTransform) {
        var dataTable = data[data.length - 1];
        if (data.length > 0) {
            dataTable.transform = (dataTable.transform || []).concat([pathOrderCollectTransform]);
        }
        else {
            throw new Error('Invalid path order collect transform not added');
        }
    }
    return data;
}
exports.assembleData = assembleData;
//# sourceMappingURL=data.js.map