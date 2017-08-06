import {MAIN, RAW} from '../../data';
import {GEOJSON} from '../../type';
import {Dict} from '../../util';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {isFacetModel, isLayerModel, isUnitModel, Model, ModelWithField} from '../model';
import {requiresSelectionId} from '../selection/selection';
import {UnitModel} from '../unit';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {GeoPointNode} from './geopoint';
import {DataComponent} from './index';
import {NonPositiveFilterNode} from './nonpositivefilter';
import {NullFilterNode} from './nullfilter';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {GeoJSONNode, IdentifierNode, parseTransformArray} from './transforms';


function parseRoot(model: Model, sources: Dict<SourceNode>): DataFlowNode {
  if (model.data || !model.parent) {
    // if the model defines a data source or is the root, create a source node
    const source = new SourceNode(model.data);
    const hash = source.hash();
    if (hash in sources) {
      // use a reference if we already have a source
      return sources[hash];
    } else {
      // otherwise add a new one
      sources[hash] = source;
      return source;
    }
  } else {
    // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
    return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
  }
}

/*
Description of the dataflow (http://asciiflow.com/):

     +--------+
     | Source |
     +---+----+
         |
         v
     Transforms
(Filter, Calculate, ...)
         |
         v
     FormatParse
         |
         v
     Null Filter
         |
         v
      Binning
         |
         v
      Timeunit
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
     Aggregate
         |
         v
       Stack
         |
         v
      >0 Filter
         |
         v
     Path Order
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
  const root = parseRoot(model, model.component.data.sources);

  const outputNodes = model.component.data.outputNodes;
  const outputNodeRefCounts = model.component.data.outputNodeRefCounts;

  // the current head of the tree that we are appending to
  let head = root;

  // Default discrete selections require an identifier transform to
  // uniquely identify data points as the _id field is volatile. Add
  // this transform at the head of our pipeline such that the identifier
  // field is available for all subsequent datasets. Additional identifier
  // transforms will be necessary when new tuples are constructed
  // (e.g., post-aggregation).
  if (requiresSelectionId(model) && !model.parent) {
    const ident = new IdentifierNode();
    ident.parent = head;
    head = ident;
  }

  // HACK: This is equivalent for merging bin extent for union scale.
  // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
  const parentIsLayer = model.parent && isLayerModel(model.parent);
  if (isUnitModel(model) || isFacetModel(model)) {
    if (parentIsLayer) {
      const bin = BinNode.makeBinFromEncoding(model);
      if (bin) {
        bin.parent = head;
        head = bin;
      }
    }
  }

  if (model.transforms.length > 0) {
    const {first, last} = parseTransformArray(model);
    first.parent = head;
    head = last;
  }

  const parse = ParseNode.make(model);
  if (parse) {
    parse.parent = head;
    head = parse;
  }

  if (isUnitModel(model) || isFacetModel(model)) {
    const nullFilter = NullFilterNode.make(model);
    if (nullFilter) {
      nullFilter.parent = head;
      head = nullFilter;
    }

    if (!parentIsLayer) {
      const bin = BinNode.makeBinFromEncoding(model);
      if (bin) {
        bin.parent = head;
        head = bin;
      }
    }

    const geopoint = GeoPointNode.make(model);
    if (geopoint) {
      geopoint.parent = head;
      head = geopoint;
    }

    const geojson = GeoJSONNode.make(model);
    if (geojson) {
      geojson.parent = head;
      head = geojson;
    }

    const tu = TimeUnitNode.makeFromEncoding(model);
    if (tu) {
      tu.parent = head;
      head = tu;
    }
  }

  // add an output node pre aggregation
  const rawName = model.getName(RAW);
  const raw = new OutputNode(rawName, RAW, outputNodeRefCounts);
  outputNodes[rawName] = raw;
  raw.parent = head;
  head = raw;

  if (isUnitModel(model)) {
    const agg = AggregateNode.makeFromEncoding(model);
    if (agg) {
      agg.parent = head;
      head = agg;

      if (requiresSelectionId(model)) {
        const ident = new IdentifierNode();
        ident.parent = head;
        head = ident;
      }
    }

    const stack = StackNode.make(model);
    if (stack) {
      stack.parent = head;
      head = stack;
    }

    const nonPosFilter = NonPositiveFilterNode.make(model);
    if (nonPosFilter) {
      nonPosFilter.parent = head;
      head = nonPosFilter;
    }
  }

  // output node for marks
  const mainName = model.getName(MAIN);
  const main = new OutputNode(mainName, MAIN, outputNodeRefCounts);
  outputNodes[mainName] = main;
  main.parent = head;
  head = main;

  // add facet marker
  let facetRoot = null;
  if (isFacetModel(model)) {
    const facetName = model.getName('facet');
    facetRoot = new FacetNode(model, facetName, main.getSource());
    outputNodes[facetName] = facetRoot;
    facetRoot.parent = head;
    head = facetRoot;
  }

  // add the format parse from this model so that children don't parse the same field again
  const ancestorParse = {...model.component.data.ancestorParse, ...(parse ? parse.parse : {})};

  return {
    ...model.component.data,
    outputNodes,
    outputNodeRefCounts,
    main,
    facetRoot,
    ancestorParse
  };
}
