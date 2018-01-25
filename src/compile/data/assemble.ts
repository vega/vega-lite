import {isUrlData} from '../../data';
import {vals} from '../../util';
import {VgData} from '../../vega.schema';
import {DataComponent} from './';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {CalculateNode} from './calculate';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {FilterNode} from './filter';
import {FilterInvalidNode} from './filterinvalid';
import {ParseNode} from './formatparse';
import {GeoJSONNode} from './geojson';
import {GeoPointNode} from './geopoint';
import {IdentifierNode} from './indentifier';
import {LookupNode} from './lookup';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';

/**
 * Print debug information for dataflow tree.
 */
// tslint:disable-next-line
function debug(node: DataFlowNode) {
  console.log(`${(node.constructor as any).name}${node.debugName ? ` (${node.debugName})` : ''} -> ${
    (node.children.map(c => {
      return `${(c.constructor as any).name}${c.debugName ? ` (${c.debugName})` : ''}`;
    }))
  }`);
  console.log(node);
  node.children.forEach(debug);
}

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
      if (!isUrlData(node.data)) {
        data.push(dataSource);
        const newData: VgData = {
          name: null,
          source: dataSource.name,
          transform: []
        };
        dataSource = newData;
      }
    }

    if (node instanceof ParseNode) {
      if (node.parent instanceof SourceNode && !dataSource.source) {
        // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
        dataSource.format = {
          ...dataSource.format || {},
          parse: node.assembleFormatParse()
        };
      } else {
        // Otherwise use Vega expression to parse
        dataSource.transform = dataSource.transform.concat(node.assembleTransforms());
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

      node.assemble().forEach(d => data.push(d));

      // break here because the rest of the tree has to be taken care of by the facet.
      return;
    }

    if (node instanceof FilterNode ||
      node instanceof CalculateNode ||
      node instanceof GeoPointNode ||
      node instanceof GeoJSONNode ||
      node instanceof AggregateNode ||
      node instanceof LookupNode ||
      node instanceof IdentifierNode) {
      dataSource.transform.push(node.assemble());
    }

    if (node instanceof FilterInvalidNode ||
      node instanceof BinNode ||
      node instanceof TimeUnitNode ||
      node instanceof StackNode) {
      dataSource.transform = dataSource.transform.concat(node.assemble());
    }

    if (node instanceof AggregateNode) {
      if (!dataSource.name) {
        dataSource.name = `data_${datasetIndex++}`;
      }
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
            transform: []
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
      default:
        if (!dataSource.name) {
          dataSource.name = `data_${datasetIndex++}`;
        }

        let source = dataSource.name;
        if (!dataSource.source || dataSource.transform.length > 0) {
          data.push(dataSource);
        } else {
          source = dataSource.source;
        }

        node.children.forEach(child => {
          const newData: VgData = {
            name: null,
            source: source,
            transform: []
          };
          walkTree(child, newData);
        });
        break;
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

  root.children.forEach(child => walkTree(child, {
    source: root.name,
    name: null,
    transform: []
  }));

  return data;
}

/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleRootData(dataComponent: DataComponent): VgData[] {
  const roots: SourceNode[] = vals(dataComponent.sources);
  const data: VgData[] = [];

  // roots.forEach(debug);

  const walkTree = makeWalkTree(data);

  let sourceIndex = 0;

  roots.forEach(root => {
    // assign a name if the source does not have a name yet
    if (!root.hasName()) {
      root.dataName = `source_${sourceIndex++}`;
    }

    const newData: VgData = root.assemble();

    walkTree(root, newData);
  });

  // remove empty transform arrays for cleaner output
  data.forEach(d => {
    if (d.transform.length === 0) {
      delete d.transform;
    }
  });

  // move sources without transforms (the ones that are potentially used in lookups) to the beginning
  data.sort((a, b) => (a.transform || []).length === 0 ? -1 : ((b.transform || []).length === 0 ? 1 : 0));

  // now fix the from references in lookup transforms
  for (const d of data) {
    for (const t of d.transform || []) {
      if (t.type === 'lookup') {
        t.from = dataComponent.outputNodes[t.from].getSource();
      }
    }
  }

  return data;
}
