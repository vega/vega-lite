"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var log = tslib_1.__importStar(require("../../log"));
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var calculate_1 = require("./calculate");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var filter_1 = require("./filter");
var filterinvalid_1 = require("./filterinvalid");
var formatparse_1 = require("./formatparse");
var geojson_1 = require("./geojson");
var geopoint_1 = require("./geopoint");
var identifier_1 = require("./identifier");
var index_1 = require("./index");
var lookup_1 = require("./lookup");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var window_1 = require("./window");
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        var source = new source_1.SourceNode(model.data);
        var hash = source.hash();
        if (hash in sources) {
            // use a reference if we already have a source
            return sources[hash];
        }
        else {
            // otherwise add a new one
            sources[hash] = source;
            return source;
        }
    }
    else {
        // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
        return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
    }
}
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(head, model, ancestorParse) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        if (transform_1.isCalculate(t)) {
            head = new calculate_1.CalculateNode(head, t);
            ancestorParse.set(t.as, 'derived', false);
        }
        else if (transform_1.isFilter(t)) {
            head = formatparse_1.ParseNode.makeImplicitFromFilterTransform(head, t, ancestorParse) || head;
            head = new filter_1.FilterNode(head, model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            var bin = head = bin_1.BinNode.makeFromTransform(head, t, model);
            for (var _i = 0, _a = util_1.keys(bin.producedFields()); _i < _a.length; _i++) {
                var field = _a[_i];
                ancestorParse.set(field, 'number', false);
            }
        }
        else if (transform_1.isTimeUnit(t)) {
            head = timeunit_1.TimeUnitNode.makeFromTransform(head, t);
            ancestorParse.set(t.as, 'date', false);
        }
        else if (transform_1.isAggregate(t)) {
            var agg = head = aggregate_1.AggregateNode.makeFromTransform(head, t);
            if (selection_1.requiresSelectionId(model)) {
                head = new identifier_1.IdentifierNode(head);
            }
            for (var _b = 0, _c = util_1.keys(agg.producedFields()); _b < _c.length; _b++) {
                var field = _c[_b];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isLookup(t)) {
            var lookup = head = lookup_1.LookupNode.make(head, model, t, lookupCounter++);
            for (var _d = 0, _e = util_1.keys(lookup.producedFields()); _d < _e.length; _d++) {
                var field = _e[_d];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isWindow(t)) {
            var window_2 = head = new window_1.WindowTransformNode(head, t);
            for (var _f = 0, _g = util_1.keys(window_2.producedFields()); _f < _g.length; _f++) {
                var field = _g[_f];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isStack(t)) {
            var stack = head = stack_1.StackNode.makeFromTransform(head, t);
            for (var _h = 0, _j = util_1.keys(stack.producedFields()); _h < _j.length; _h++) {
                var field = _j[_h];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
    });
    return head;
}
exports.parseTransformArray = parseTransformArray;
/*
Description of the dataflow (http://asciiflow.com/):
     +--------+
     | Source |
     +---+----+
         |
         v
     FormatParse
     (explicit)
         |
         v
     Transforms
(Filter, Calculate, Binning, TimeUnit, Aggregate, Window, ...)
         |
         v
     FormatParse
     (implicit)
         |
         v
 Binning (in `encoding`)
         |
         v
 Timeunit (in `encoding`)
         |
         v
Formula From Sort Array
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
  Aggregate (in `encoding`)
         |
         v
  Stack (in `encoding`)
         |
         v
  Invalid Filter
         |
         v
   +----------+
   |   Main   |
   +----------+
         |
         v
     +-------+
     | Facet |----> "column", "column-layout", and "row"
     +-------+
         |
         v
  ...Child data...
*/
function parseData(model) {
    var head = parseRoot(model, model.component.data.sources);
    var _a = model.component.data, outputNodes = _a.outputNodes, outputNodeRefCounts = _a.outputNodeRefCounts;
    var ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new index_1.AncestorParse();
    // format.parse: null means disable parsing
    if (model.data && model.data.format && model.data.format.parse === null) {
        ancestorParse.parseNothing = true;
    }
    head = formatparse_1.ParseNode.makeExplicit(head, model, ancestorParse) || head;
    // Default discrete selections require an identifier transform to
    // uniquely identify data points as the _id field is volatile. Add
    // this transform at the head of our pipeline such that the identifier
    // field is available for all subsequent datasets. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    if (selection_1.requiresSelectionId(model) && (model_1.isUnitModel(model) || model_1.isLayerModel(model))) {
        head = new identifier_1.IdentifierNode(head);
    }
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    var parentIsLayer = model.parent && model_1.isLayerModel(model.parent);
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (parentIsLayer) {
            head = bin_1.BinNode.makeFromEncoding(head, model) || head;
        }
    }
    if (model.transforms.length > 0) {
        head = parseTransformArray(head, model, ancestorParse);
    }
    head = formatparse_1.ParseNode.makeImplicitFromEncoding(head, model, ancestorParse) || head;
    if (model_1.isUnitModel(model)) {
        head = geojson_1.GeoJSONNode.parseAll(head, model);
        head = geopoint_1.GeoPointNode.parseAll(head, model);
    }
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (!parentIsLayer) {
            head = bin_1.BinNode.makeFromEncoding(head, model) || head;
        }
        head = timeunit_1.TimeUnitNode.makeFromEncoding(head, model) || head;
        head = calculate_1.CalculateNode.parseAllForSortIndex(head, model);
    }
    // add an output node pre aggregation
    var rawName = model.getName(data_1.RAW);
    var raw = new dataflow_1.OutputNode(head, rawName, data_1.RAW, outputNodeRefCounts);
    outputNodes[rawName] = raw;
    head = raw;
    if (model_1.isUnitModel(model)) {
        var agg = aggregate_1.AggregateNode.makeFromEncoding(head, model);
        if (agg) {
            head = agg;
            if (selection_1.requiresSelectionId(model)) {
                head = new identifier_1.IdentifierNode(head);
            }
        }
        head = stack_1.StackNode.makeFromEncoding(head, model) || head;
    }
    if (model_1.isUnitModel(model)) {
        head = filterinvalid_1.FilterInvalidNode.make(head, model) || head;
    }
    // output node for marks
    var mainName = model.getName(data_1.MAIN);
    var main = new dataflow_1.OutputNode(head, mainName, data_1.MAIN, outputNodeRefCounts);
    outputNodes[mainName] = main;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (model_1.isFacetModel(model)) {
        var facetName = model.getName('facet');
        // Derive new sort index field for facet's sort array
        head = calculate_1.CalculateNode.parseAllForSortIndex(head, model);
        // Derive new aggregate (via window) for facet's sort field
        // TODO: use JoinAggregate once we have it
        // augment data source with new fields for crossed facet
        head = window_1.WindowTransformNode.makeFromFacet(head, model.facet) || head;
        facetRoot = new facet_1.FacetNode(head, model, facetName, main.getSource());
        outputNodes[facetName] = facetRoot;
        head = facetRoot;
    }
    return tslib_1.__assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
exports.parseData = parseData;
//# sourceMappingURL=parse.js.map