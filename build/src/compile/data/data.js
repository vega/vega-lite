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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQVdsQyxtQ0FBZ0M7QUFDaEMsNkNBQTBDO0FBQzFDLDJDQUF3QztBQUN4QyxtQ0FBZ0M7QUFDaEMsNkJBQTBCO0FBQzFCLHFDQUFrQztBQUNsQyx5Q0FBc0M7QUFDdEMseURBQXNEO0FBQ3RELHFDQUFrQztBQUNsQyxpQ0FBOEM7QUFDOUMsdUNBQW9DO0FBdURwQyx3RUFBd0U7QUFDeEUsMENBQTBDO0FBRTFDLHVCQUE4QixLQUFnQjtJQUM1QyxNQUFNLENBQUM7UUFDTCxXQUFXLEVBQUUseUJBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3pDLFVBQVUsRUFBRSx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDdkMsTUFBTSxFQUFFLGVBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQy9CLGlCQUFpQixFQUFFLHFDQUFpQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDckQsU0FBUyxFQUFFLHFCQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUVyQyxNQUFNLEVBQUUsZUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDL0IsR0FBRyxFQUFFLFNBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3pCLFNBQVMsRUFBRSxpQkFBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDbkMsUUFBUSxFQUFFLG1CQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUNuQyxPQUFPLEVBQUUsaUJBQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ2pDLEtBQUssRUFBRSxhQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztLQUM5QixDQUFDO0FBQ0osQ0FBQztBQWZELHNDQWVDO0FBRUQsd0JBQStCLEtB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