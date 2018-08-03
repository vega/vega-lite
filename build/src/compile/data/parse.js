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
var flatten_1 = require("./flatten");
var fold_1 = require("./fold");
var formatparse_1 = require("./formatparse");
var geojson_1 = require("./geojson");
var geopoint_1 = require("./geopoint");
var identifier_1 = require("./identifier");
var impute_1 = require("./impute");
var index_1 = require("./index");
var lookup_1 = require("./lookup");
var sample_1 = require("./sample");
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
        return model.parent.component.data.facetRoot
            ? model.parent.component.data.facetRoot
            : model.parent.component.data.main;
    }
}
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(head, model, ancestorParse) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        var derivedType = undefined;
        var transformNode;
        if (transform_1.isCalculate(t)) {
            transformNode = head = new calculate_1.CalculateNode(head, t);
            derivedType = 'derived';
        }
        else if (transform_1.isFilter(t)) {
            transformNode = head = formatparse_1.ParseNode.makeImplicitFromFilterTransform(head, t, ancestorParse) || head;
            head = new filter_1.FilterNode(head, model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            transformNode = head = bin_1.BinNode.makeFromTransform(head, t, model);
            derivedType = 'number';
        }
        else if (transform_1.isTimeUnit(t)) {
            transformNode = head = timeunit_1.TimeUnitNode.makeFromTransform(head, t);
            derivedType = 'date';
        }
        else if (transform_1.isAggregate(t)) {
            transformNode = head = aggregate_1.AggregateNode.makeFromTransform(head, t);
            derivedType = 'number';
            if (selection_1.requiresSelectionId(model)) {
                head = new identifier_1.IdentifierNode(head);
            }
        }
        else if (transform_1.isLookup(t)) {
            transformNode = head = lookup_1.LookupNode.make(head, model, t, lookupCounter++);
            derivedType = 'derived';
        }
        else if (transform_1.isWindow(t)) {
            transformNode = head = new window_1.WindowTransformNode(head, t);
            derivedType = 'number';
        }
        else if (transform_1.isStack(t)) {
            transformNode = head = stack_1.StackNode.makeFromTransform(head, t);
            derivedType = 'derived';
        }
        else if (transform_1.isFold(t)) {
            transformNode = head = new fold_1.FoldTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (transform_1.isFlatten(t)) {
            transformNode = head = new flatten_1.FlattenTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (transform_1.isSample(t)) {
            head = new sample_1.SampleTransformNode(head, t);
        }
        else if (transform_1.isImpute(t)) {
            transformNode = head = impute_1.ImputeNode.makeFromTransform(head, t);
            derivedType = 'derived';
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        if (transformNode && derivedType !== undefined) {
            for (var _i = 0, _a = util_1.keys(transformNode.producedFields()); _i < _a.length; _i++) {
                var field = _a[_i];
                ancestorParse.set(field, derivedType, false);
            }
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
        head = impute_1.ImputeNode.makeFromEncoding(head, model) || head;
        head = stack_1.StackNode.makeFromEncoding(head, model) || head;
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