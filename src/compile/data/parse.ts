import {Data, isInlineData, isNamedData, isUrlData, MAIN, ParseValue, RAW} from '../../data';
import * as log from '../../log';
import {
  isAggregate,
  isBin,
  isCalculate,
  isFilter,
  isFlatten,
  isFold,
  isImpute,
  isLookup,
  isSample,
  isStack,
  isTimeUnit,
  isWindow
} from '../../transform';
import {deepEqual, mergeDeep} from '../../util';
import {isFacetModel, isLayerModel, isUnitModel, Model} from '../model';
import {requiresSelectionId} from '../selection/selection';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {CalculateNode} from './calculate';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {FilterNode} from './filter';
import {FlattenTransformNode} from './flatten';
import {FoldTransformNode} from './fold';
import {ParseNode} from './formatparse';
import {GeoJSONNode} from './geojson';
import {GeoPointNode} from './geopoint';
import {IdentifierNode} from './identifier';
import {ImputeNode} from './impute';
import {AncestorParse, DataComponent} from './index';
import {LookupNode} from './lookup';
import {SampleTransformNode} from './sample';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {WindowTransformNode} from './window';
import {makeWindowFromFacet} from './windowfacet';

export function findSource(data: Data, sources: SourceNode[]) {
  for (const other of sources) {
    const otherData = other.data;
    if (isInlineData(data) && isInlineData(otherData)) {
      const srcVals = data.values;
      const otherVals = otherData.values;
      if (deepEqual(srcVals, otherVals)) {
        return other;
      }
    } else if (isUrlData(data) && isUrlData(otherData)) {
      if (data.url === otherData.url) {
        return other;
      }
    } else if (isNamedData(data)) {
      if (data.name === other.dataName) {
        return other;
      }
    }
  }
  return null;
}

function parseRoot(model: Model, sources: SourceNode[]): DataFlowNode {
  if (model.data || !model.parent) {
    // if the model defines a data source or is the root, create a source node

    const existingSource = findSource(model.data, sources);

    if (existingSource) {
      existingSource.data.format = mergeDeep({}, model.data.format, existingSource.data.format);

      return existingSource;
    } else {
      const source = new SourceNode(model.data);
      sources.push(source);
      return source;
    }
  } else {
    // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
    return model.parent.component.data.facetRoot
      ? model.parent.component.data.facetRoot
      : model.parent.component.data.main;
  }
}

/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(head: DataFlowNode, model: Model, ancestorParse: AncestorParse): DataFlowNode {
  let lookupCounter = 0;

  for (const t of model.transforms) {
    let derivedType: ParseValue = undefined;
    let transformNode: DataFlowNode;

    if (isCalculate(t)) {
      transformNode = head = new CalculateNode(head, t);
      derivedType = 'derived';
    } else if (isFilter(t)) {
      transformNode = head = ParseNode.makeImplicitFromFilterTransform(head, t, ancestorParse) || head;

      head = new FilterNode(head, model, t.filter);
    } else if (isBin(t)) {
      transformNode = head = BinNode.makeFromTransform(head, t, model);
      derivedType = 'number';
    } else if (isTimeUnit(t)) {
      transformNode = head = TimeUnitNode.makeFromTransform(head, t);
      derivedType = 'date';

      // Create parse node because the input to time unit is always date.
      const parsedAs = ancestorParse.getWithExplicit(t.field);
      if (parsedAs.value === undefined) {
        head = new ParseNode(head, {[t.field]: derivedType});
        ancestorParse.set(t.field, derivedType, false);
      }
    } else if (isAggregate(t)) {
      transformNode = head = AggregateNode.makeFromTransform(head, t);
      derivedType = 'number';
      if (requiresSelectionId(model)) {
        head = new IdentifierNode(head);
      }
    } else if (isLookup(t)) {
      transformNode = head = LookupNode.make(head, model, t, lookupCounter++);
      derivedType = 'derived';
    } else if (isWindow(t)) {
      transformNode = head = new WindowTransformNode(head, t);
      derivedType = 'number';
    } else if (isStack(t)) {
      transformNode = head = StackNode.makeFromTransform(head, t);
      derivedType = 'derived';
    } else if (isFold(t)) {
      transformNode = head = new FoldTransformNode(head, t);
      derivedType = 'derived';
    } else if (isFlatten(t)) {
      transformNode = head = new FlattenTransformNode(head, t);
      derivedType = 'derived';
    } else if (isSample(t)) {
      head = new SampleTransformNode(head, t);
    } else if (isImpute(t)) {
      transformNode = head = ImputeNode.makeFromTransform(head, t);
      derivedType = 'derived';
    } else {
      log.warn(log.message.invalidTransformIgnored(t));
      continue;
    }

    if (transformNode && derivedType !== undefined) {
      for (const field of transformNode.producedFields()) {
        ancestorParse.set(field, derivedType, false);
      }
    }
  }

  return head;
}

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

export function parseData(model: Model): DataComponent {
  let head = parseRoot(model, model.component.data.sources);

  const {outputNodes, outputNodeRefCounts} = model.component.data;
  const ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new AncestorParse();

  // format.parse: null means disable parsing
  if (model.data && model.data.format && model.data.format.parse === null) {
    ancestorParse.parseNothing = true;
  }

  head = ParseNode.makeExplicit(head, model, ancestorParse) || head;

  // Default discrete selections require an identifier transform to
  // uniquely identify data points as the _id field is volatile. Add
  // this transform at the head of our pipeline such that the identifier
  // field is available for all subsequent datasets. Additional identifier
  // transforms will be necessary when new tuples are constructed
  // (e.g., post-aggregation).
  if (requiresSelectionId(model) && (isUnitModel(model) || isLayerModel(model))) {
    head = new IdentifierNode(head);
  }

  // HACK: This is equivalent for merging bin extent for union scale.
  // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
  const parentIsLayer = model.parent && isLayerModel(model.parent);
  if (isUnitModel(model) || isFacetModel(model)) {
    if (parentIsLayer) {
      head = BinNode.makeFromEncoding(head, model) || head;
    }
  }

  if (model.transforms.length > 0) {
    head = parseTransformArray(head, model, ancestorParse);
  }

  head = ParseNode.makeImplicitFromEncoding(head, model, ancestorParse) || head;

  if (isUnitModel(model)) {
    head = GeoJSONNode.parseAll(head, model);
    head = GeoPointNode.parseAll(head, model);
  }

  if (isUnitModel(model) || isFacetModel(model)) {
    if (!parentIsLayer) {
      head = BinNode.makeFromEncoding(head, model) || head;
    }

    head = TimeUnitNode.makeFromEncoding(head, model) || head;
    head = CalculateNode.parseAllForSortIndex(head, model);
  }

  // add an output node pre aggregation
  const rawName = model.getName(RAW);
  const raw = new OutputNode(head, rawName, RAW, outputNodeRefCounts);
  outputNodes[rawName] = raw;
  head = raw;

  if (isUnitModel(model)) {
    const agg = AggregateNode.makeFromEncoding(head, model);
    if (agg) {
      head = agg;

      if (requiresSelectionId(model)) {
        head = new IdentifierNode(head);
      }
    }
    head = ImputeNode.makeFromEncoding(head, model) || head;
    head = StackNode.makeFromEncoding(head, model) || head;
  }

  // output node for marks
  const mainName = model.getName(MAIN);
  const main = new OutputNode(head, mainName, MAIN, outputNodeRefCounts);
  outputNodes[mainName] = main;
  head = main;

  // add facet marker
  let facetRoot = null;
  if (isFacetModel(model)) {
    const facetName = model.getName('facet');

    // Derive new sort index field for facet's sort array
    head = CalculateNode.parseAllForSortIndex(head, model);

    // Derive new aggregate (via window) for facet's sort field
    // TODO: use JoinAggregate once we have it
    // augment data source with new fields for crossed facet
    head = makeWindowFromFacet(head, model.facet) || head;

    facetRoot = new FacetNode(head, model, facetName, main.getSource());
    outputNodes[facetName] = facetRoot;
    head = facetRoot;
  }
  return {
    ...model.component.data,
    outputNodes,
    outputNodeRefCounts,
    raw,
    main,
    facetRoot,
    ancestorParse
  };
}
