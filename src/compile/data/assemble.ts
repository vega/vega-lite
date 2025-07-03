import {InlineDataset, isUrlData} from '../../data.js';
import {Dict} from '../../util.js';
import {VgData} from '../../vega.schema.js';
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
import {ParseNode} from './formatparse.js';
import {GeoJSONNode} from './geojson.js';
import {GeoPointNode} from './geopoint.js';
import {GraticuleNode} from './graticule.js';
import {IdentifierNode} from './identifier.js';
import {ImputeNode} from './impute.js';
import {JoinAggregateTransformNode} from './joinaggregate.js';
import {LoessTransformNode} from './loess.js';
import {LookupNode} from './lookup.js';
import {QuantileTransformNode} from './quantile.js';
import {RegressionTransformNode} from './regression.js';
import {PivotTransformNode} from './pivot.js';
import {SampleTransformNode} from './sample.js';
import {SequenceNode} from './sequence.js';
import {SourceNode} from './source.js';
import {StackNode} from './stack.js';
import {TimeUnitNode} from './timeunit.js';
import {WindowTransformNode} from './window.js';
import {DataComponent} from './index.js';

function makeWalkTree(data: VgData[]) {
  // to name datasources
  let datasetIndex = 0;

  /**
   * Recursively walk down the tree.
   */
  function walkTree(node: DataFlowNode, dataSource: VgData) {
    if (node instanceof SourceNode) {
      // If the source is a named data source or a data source with values, we need
      // to put it in a different data source. Otherwise, Vega may override the data.
      if (!node.isGenerator && !isUrlData(node.data)) {
        data.push(dataSource);
        const newData: VgData = {
          name: null,
          source: dataSource.name,
          transform: [],
        };
        dataSource = newData;
      }
    }

    if (node instanceof ParseNode) {
      if (node.parent instanceof SourceNode && !dataSource.source) {
        // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
        dataSource.format = {
          ...dataSource.format,
          parse: node.assembleFormatParse(),
        };

        // add calculates for all nested fields
        dataSource.transform.push(...node.assembleTransforms(true));
      } else {
        // Otherwise use Vega expression to parse
        dataSource.transform.push(...node.assembleTransforms());
      }
    }

    if (node instanceof FacetNode) {
      if (!dataSource.name) {
        dataSource.name = `data_${datasetIndex++}`;
      }

      if (!dataSource.source || dataSource.transform.length > 0) {
        data.push(dataSource);
        node.data = dataSource.name;
      } else {
        node.data = dataSource.source;
      }

      data.push(...node.assemble());

      // break here because the rest of the tree has to be taken care of by the facet.
      return;
    }

    if (
      node instanceof GraticuleNode ||
      node instanceof SequenceNode ||
      node instanceof FilterInvalidNode ||
      node instanceof FilterNode ||
      node instanceof CalculateNode ||
      node instanceof GeoPointNode ||
      node instanceof AggregateNode ||
      node instanceof LookupNode ||
      node instanceof WindowTransformNode ||
      node instanceof JoinAggregateTransformNode ||
      node instanceof FoldTransformNode ||
      node instanceof FlattenTransformNode ||
      node instanceof DensityTransformNode ||
      node instanceof LoessTransformNode ||
      node instanceof QuantileTransformNode ||
      node instanceof RegressionTransformNode ||
      node instanceof IdentifierNode ||
      node instanceof SampleTransformNode ||
      node instanceof PivotTransformNode ||
      node instanceof ExtentTransformNode
    ) {
      dataSource.transform.push(node.assemble());
    }

    if (
      node instanceof BinNode ||
      node instanceof TimeUnitNode ||
      node instanceof ImputeNode ||
      node instanceof StackNode ||
      node instanceof GeoJSONNode
    ) {
      dataSource.transform.push(...node.assemble());
    }

    if (node instanceof OutputNode) {
      if (dataSource.source && dataSource.transform.length === 0) {
        node.setSource(dataSource.source);
      } else if (node.parent instanceof OutputNode) {
        // Note that an output node may be required but we still do not assemble a
        // separate data source for it.
        node.setSource(dataSource.name);
      } else {
        if (!dataSource.name) {
          dataSource.name = `data_${datasetIndex++}`;
        }

        // Here we set the name of the datasource we generated. From now on
        // other assemblers can use it.
        node.setSource(dataSource.name);

        // if this node has more than one child, we will add a datasource automatically
        if (node.numChildren() === 1) {
          data.push(dataSource);
          const newData: VgData = {
            name: null,
            source: dataSource.name,
            transform: [],
          };
          dataSource = newData;
        }
      }
    }

    switch (node.numChildren()) {
      case 0:
        // done
        if (node instanceof OutputNode && (!dataSource.source || dataSource.transform.length > 0)) {
          // do not push empty datasources that are simply references
          data.push(dataSource);
        }
        break;
      case 1:
        walkTree(node.children[0], dataSource);
        break;
      default: {
        if (!dataSource.name) {
          dataSource.name = `data_${datasetIndex++}`;
        }

        let source = dataSource.name;
        if (!dataSource.source || dataSource.transform.length > 0) {
          data.push(dataSource);
        } else {
          source = dataSource.source;
        }

        for (const child of node.children) {
          const newData: VgData = {
            name: null,
            source,
            transform: [],
          };
          walkTree(child, newData);
        }
        break;
      }
    }
  }

  return walkTree;
}

/**
 * Assemble data sources that are derived from faceted data.
 */
export function assembleFacetData(root: FacetNode): VgData[] {
  const data: VgData[] = [];
  const walkTree = makeWalkTree(data);

  for (const child of root.children) {
    walkTree(child, {
      source: root.name,
      name: null,
      transform: [],
    });
  }

  return data;
}

/**
 * Create Vega data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleRootData(dataComponent: DataComponent, datasets: Dict<InlineDataset>): VgData[] {
  const data: VgData[] = [];

  // dataComponent.sources.forEach(debug);
  // draw(dataComponent.sources);

  const walkTree = makeWalkTree(data);

  let sourceIndex = 0;

  for (const root of dataComponent.sources) {
    // assign a name if the source does not have a name yet
    if (!root.hasName()) {
      root.dataName = `source_${sourceIndex++}`;
    }

    const newData: VgData = root.assemble();

    walkTree(root, newData);
  }

  // remove empty transform arrays for cleaner output
  for (const d of data) {
    if (d.transform.length === 0) {
      delete d.transform;
    }
  }

  // move sources without transforms (the ones that are potentially used in lookups) to the beginning
  let whereTo = 0;
  for (const [i, d] of data.entries()) {
    if ((d.transform ?? []).length === 0 && !d.source) {
      data.splice(whereTo++, 0, data.splice(i, 1)[0]);
    }
  }

  // now fix the from references in lookup transforms
  for (const d of data) {
    for (const t of d.transform ?? []) {
      if (t.type === 'lookup') {
        t.from = dataComponent.outputNodes[t.from].getSource();
      }
    }
  }

  // inline values for datasets that are in the datastore
  for (const d of data) {
    if (d.name in datasets) {
      d.values = datasets[d.name];
    }
  }

  return data;
}
