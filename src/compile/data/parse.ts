import {AncestorParse, DataComponent} from './index.js';
import {
  Data,
  isGenerator,
  isGraticuleGenerator,
  isInlineData,
  isNamedData,
  isSequenceGenerator,
  isUrlData,
  DataSourceType,
  ParseValue,
} from '../../data.js';
import {getDataSourcesForHandlingInvalidValues, DataSourcesForHandlingInvalidValues} from '../invalid/datasources.js';
import * as log from '../../log/index.js';
import {isPathMark} from '../../mark.js';
import {
  isAggregate,
  isBin,
  isCalculate,
  isDensity,
  isExtent,
  isFilter,
  isFlatten,
  isFold,
  isImpute,
  isJoinAggregate,
  isLoess,
  isLookup,
  isPivot,
  isQuantile,
  isRegression,
  isSample,
  isStack,
  isTimeUnit,
  isWindow,
} from '../../transform.js';
import {deepEqual, mergeDeep} from '../../util.js';
import {getMarkPropOrConfig} from '../common.js';
import {isFacetModel, isLayerModel, isUnitModel, Model} from '../model.js';
import {requiresSelectionId} from '../selection/index.js';
import {materializeSelections} from '../selection/parse.js';
import {AggregateNode} from './aggregate.js';
import {BinNode} from './bin.js';
import {CalculateNode} from './calculate.js';
import {DataFlowNode, OutputNode} from './dataflow.js';
import {DensityTransformNode} from './density.js';
import {ExtentTransformNode} from './extent.js';
import {FacetNode} from './facet.js';
import {FilterNode} from './filter.js';
import {FilterInvalidNode} from './filterinvalid.js';
import {FlattenTransformNode} from './flatten.js';
import {FoldTransformNode} from './fold.js';
import {
  getImplicitFromEncoding,
  getImplicitFromFilterTransform,
  getImplicitFromSelection,
  ParseNode,
} from './formatparse.js';
import {GeoJSONNode} from './geojson.js';
import {GeoPointNode} from './geopoint.js';
import {GraticuleNode} from './graticule.js';
import {IdentifierNode} from './identifier.js';
import {ImputeNode} from './impute.js';
import {JoinAggregateTransformNode} from './joinaggregate.js';
import {makeJoinAggregateFromFacet} from './joinaggregatefacet.js';
import {LoessTransformNode} from './loess.js';
import {LookupNode} from './lookup.js';
import {PivotTransformNode} from './pivot.js';
import {QuantileTransformNode} from './quantile.js';
import {RegressionTransformNode} from './regression.js';
import {SampleTransformNode} from './sample.js';
import {SequenceNode} from './sequence.js';
import {SourceNode} from './source.js';
import {StackNode} from './stack.js';
import {TimeUnitNode} from './timeunit.js';
import {WindowTransformNode} from './window.js';

export function findSource(data: Data, sources: SourceNode[]) {
  for (const other of sources) {
    const otherData = other.data;

    // if both datasets have a name defined, we cannot merge
    if (data.name && other.hasName() && data.name !== other.dataName) {
      continue;
    }

    const formatMesh = (data as any).format?.mesh;
    const otherFeature = otherData.format?.feature;

    // feature and mesh are mutually exclusive
    if (formatMesh && otherFeature) {
      continue;
    }

    // we have to extract the same feature or mesh
    const formatFeature = (data as any).format?.feature;
    if ((formatFeature || otherFeature) && formatFeature !== otherFeature) {
      continue;
    }

    const otherMesh = otherData.format?.mesh;
    if ((formatMesh || otherMesh) && formatMesh !== otherMesh) {
      continue;
    }

    if (isInlineData(data) && isInlineData(otherData)) {
      if (deepEqual(data.values, otherData.values)) {
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

    if (model.data === null) {
      // data: null means we should ignore the parent's data so we just create a new data source
      const source = new SourceNode({values: []});
      sources.push(source);
      return source;
    }

    const existingSource = findSource(model.data, sources);

    if (existingSource) {
      if (!isGenerator(model.data)) {
        existingSource.data.format = mergeDeep({}, model.data.format, existingSource.data.format);
      }

      // if the new source has a name but the existing one does not, we can set it
      if (!existingSource.hasName() && model.data.name) {
        existingSource.dataName = model.data.name;
      }

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
 * Parses a transform array into a chain of connected dataflow nodes.
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
      const implicit = getImplicitFromFilterTransform(t);
      transformNode = head = ParseNode.makeWithAncestors(head, {}, implicit, ancestorParse) ?? head;

      head = new FilterNode(head, model, t.filter);
    } else if (isBin(t)) {
      transformNode = head = BinNode.makeFromTransform(head, t, model);
      derivedType = 'number';
    } else if (isTimeUnit(t)) {
      derivedType = 'date';
      const parsedAs = ancestorParse.getWithExplicit(t.field);
      // Create parse node because the input to time unit is always date.
      if (parsedAs.value === undefined) {
        head = new ParseNode(head, {[t.field]: derivedType});
        ancestorParse.set(t.field, derivedType, false);
      }
      transformNode = head = TimeUnitNode.makeFromTransform(head, t);
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
    } else if (isJoinAggregate(t)) {
      transformNode = head = new JoinAggregateTransformNode(head, t);
      derivedType = 'number';
    } else if (isStack(t)) {
      transformNode = head = StackNode.makeFromTransform(head, t);
      derivedType = 'derived';
    } else if (isFold(t)) {
      transformNode = head = new FoldTransformNode(head, t);
      derivedType = 'derived';
    } else if (isExtent(t)) {
      transformNode = head = new ExtentTransformNode(head, t);
      derivedType = 'derived';
    } else if (isFlatten(t)) {
      transformNode = head = new FlattenTransformNode(head, t);
      derivedType = 'derived';
    } else if (isPivot(t)) {
      transformNode = head = new PivotTransformNode(head, t);
      derivedType = 'derived';
    } else if (isSample(t)) {
      head = new SampleTransformNode(head, t);
    } else if (isImpute(t)) {
      transformNode = head = ImputeNode.makeFromTransform(head, t);
      derivedType = 'derived';
    } else if (isDensity(t)) {
      transformNode = head = new DensityTransformNode(head, t);
      derivedType = 'derived';
    } else if (isQuantile(t)) {
      transformNode = head = new QuantileTransformNode(head, t);
      derivedType = 'derived';
    } else if (isRegression(t)) {
      transformNode = head = new RegressionTransformNode(head, t);
      derivedType = 'derived';
    } else if (isLoess(t)) {
      transformNode = head = new LoessTransformNode(head, t);
      derivedType = 'derived';
    } else {
      log.warn(log.message.invalidTransformIgnored(t));
      continue;
    }

    if (transformNode && derivedType !== undefined) {
      for (const field of transformNode.producedFields() ?? []) {
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
+- - - - - - - - - - -+
|   PreFilterInvalid  | - - - -> scale domains
|(when scales need it)|
+- - - - - - - - - - -+
         |
         v
  Invalid Filter (if the main data source needs it)
         |
         v
   +----------+
   |   Main   | - - - -> scale domains
   +----------+
         |
         v
+- - - - - - - - - - -+
|   PostFilterInvalid | - - - -> scale domains
|(when scales need it)|
+- - - - - - - - - - -+
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
  const data = model.data;

  const newData = data && (isGenerator(data) || isUrlData(data) || isInlineData(data));
  const ancestorParse =
    !newData && model.parent ? model.parent.component.data.ancestorParse.clone() : new AncestorParse();

  if (isGenerator(data)) {
    // insert generator transform
    if (isSequenceGenerator(data)) {
      head = new SequenceNode(head, data.sequence);
    } else if (isGraticuleGenerator(data)) {
      head = new GraticuleNode(head, data.graticule);
    }
    // no parsing necessary for generator
    ancestorParse.parseNothing = true;
  } else if (data?.format?.parse === null) {
    // format.parse: null means disable parsing
    ancestorParse.parseNothing = true;
  }

  head = ParseNode.makeExplicit(head, model, ancestorParse) ?? head;

  // Default discrete selections require an identifer transform to
  // uniquely identify data points. Add this transform at the head of
  // the pipeline such that the identifier field is available for all
  // subsequent datasets. During optimization, we will remove this
  // transform if it proves to be unnecessary. Additional identifier
  // transforms will be necessary when new tuples are constructed
  // (e.g., post-aggregation).
  head = new IdentifierNode(head);

  // HACK: This is equivalent for merging bin extent for union scale.
  // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
  const parentIsLayer = model.parent && isLayerModel(model.parent);
  if (isUnitModel(model) || isFacetModel(model)) {
    if (parentIsLayer) {
      head = BinNode.makeFromEncoding(head, model) ?? head;
    }
  }

  if (model.transforms.length > 0) {
    head = parseTransformArray(head, model, ancestorParse);
  }

  // create parse nodes for fields that need to be parsed (or flattened) implicitly
  const implicitSelection = getImplicitFromSelection(model);
  const implicitEncoding = getImplicitFromEncoding(model);
  head = ParseNode.makeWithAncestors(head, {}, {...implicitSelection, ...implicitEncoding}, ancestorParse) ?? head;

  if (isUnitModel(model)) {
    head = GeoJSONNode.parseAll(head, model);
    head = GeoPointNode.parseAll(head, model);
  }

  if (isUnitModel(model) || isFacetModel(model)) {
    if (!parentIsLayer) {
      head = BinNode.makeFromEncoding(head, model) ?? head;
    }

    head = TimeUnitNode.makeFromEncoding(head, model) ?? head;
    head = CalculateNode.parseAllForSortIndex(head, model);
  }

  // add an output node pre aggregation
  const raw = (head = makeOutputNode(DataSourceType.Raw, model, head));

  if (isUnitModel(model)) {
    const agg = AggregateNode.makeFromEncoding(head, model);
    if (agg) {
      head = agg;

      if (requiresSelectionId(model)) {
        head = new IdentifierNode(head);
      }
    }
    head = ImputeNode.makeFromEncoding(head, model) ?? head;
    head = StackNode.makeFromEncoding(head, model) ?? head;
  }

  let preFilterInvalid: OutputNode | undefined;
  let dataSourcesForHandlingInvalidValues: DataSourcesForHandlingInvalidValues | undefined;
  if (isUnitModel(model)) {
    const {markDef, mark, config} = model;
    const invalid = getMarkPropOrConfig('invalid', markDef, config);

    const {marks, scales} = (dataSourcesForHandlingInvalidValues = getDataSourcesForHandlingInvalidValues({
      invalid,
      isPath: isPathMark(mark),
    }));

    if (marks !== scales && scales === 'include-invalid-values') {
      // Create a seperate preFilterInvalid dataSource if scales need pre-filter data but marks needs post-filter.
      preFilterInvalid = head = makeOutputNode(DataSourceType.PreFilterInvalid, model, head);
    }

    if (marks === 'exclude-invalid-values') {
      head = FilterInvalidNode.make(head, model, dataSourcesForHandlingInvalidValues) ?? head;
    }
  }

  // output "main" node for marks
  const main = (head = makeOutputNode(DataSourceType.Main, model, head));

  let postFilterInvalid: OutputNode | undefined;
  if (isUnitModel(model) && dataSourcesForHandlingInvalidValues) {
    const {marks, scales} = dataSourcesForHandlingInvalidValues;
    if (marks === 'include-invalid-values' && scales === 'exclude-invalid-values') {
      // Create a seperate postFilterInvalid dataSource if scales need post-filter data but marks needs pre-filter.
      head = FilterInvalidNode.make(head, model, dataSourcesForHandlingInvalidValues) ?? head;

      postFilterInvalid = head = makeOutputNode(DataSourceType.PostFilterInvalid, model, head);
    }
  }

  if (isUnitModel(model)) {
    materializeSelections(model, main);
  }

  // add facet marker
  let facetRoot = null;
  if (isFacetModel(model)) {
    const facetName = model.getName('facet');

    // Derive new aggregate for facet's sort field
    // augment data source with new fields for crossed facet
    head = makeJoinAggregateFromFacet(head, model.facet) ?? head;

    facetRoot = new FacetNode(head, model, facetName, main.getSource());
    outputNodes[facetName] = facetRoot;
  }

  return {
    ...model.component.data,
    outputNodes,
    outputNodeRefCounts,
    raw,
    main,
    facetRoot,
    ancestorParse,
    preFilterInvalid,
    postFilterInvalid,
  };
}

function makeOutputNode(dataSourceType: DataSourceType, model: Model, head: DataFlowNode) {
  const {outputNodes, outputNodeRefCounts} = model.component.data;
  const name = model.getDataName(dataSourceType);
  const node = new OutputNode(head, name, dataSourceType, outputNodeRefCounts);
  outputNodes[name] = node;
  return node;
}
