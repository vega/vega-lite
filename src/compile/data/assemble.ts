import {every, vals} from '../../util';
import {VgData} from '../../vega.schema';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {NonPositiveFilterNode} from './nonpositivefilter';
import {NullFilterNode} from './nullfilter';
import * as optimizers from './optimizers';
import {optimizeFromLeaves} from './optimizers';
import {OrderNode} from './pathorder';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {CalculateNode, FilterNode} from './transforms';

/**
 * Start optimization path from the root. Useful for removing nodes.
 */
function removeUnnecessaryNodes(node: DataFlowNode) {
  // remove empty non positive filter
  if (node instanceof NonPositiveFilterNode && every(vals(node.filter), b => b === false)) {
    node.remove();
  }

  // remove empty null filter nodes
  if (node instanceof NullFilterNode && every(vals(node.filteredFields), f => f === null)) {
    node.remove();
  }

  // remove output nodes that are not required
  if (node instanceof OutputNode && !node.required) {
    node.remove();
  }

  node.children.forEach(removeUnnecessaryNodes);
}
}


/**
 * Return all leaf nodes.
 */
function getLeaves(roots: DataFlowNode[]) {
  const leaves: DataFlowNode[] = [];
  function append(node: DataFlowNode) {
    if (node.numChildren() === 0) {
      leaves.push(node);
    } else {
      node.children.forEach(append);
    }
  }

  roots.forEach(append);
  return leaves;
}

/**
 * Print debug information for dataflow tree.
 */
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
    if (node instanceof ParseNode) {
      if (node.parent instanceof SourceNode && dataSource.format) {
        dataSource.format.parse = node.assemble();
      } else {
        throw new Error('Can only instantiate parse next to source.');
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

      node.assemble(dataSource.source).forEach(d => data.push(d));

      // break here because the rest of the tree has to be taken care of by the facet.
      return;
    }

    if (node instanceof FilterNode ||
      node instanceof NullFilterNode ||
      node instanceof CalculateNode ||
      node instanceof AggregateNode ||
      node instanceof OrderNode) {
      dataSource.transform.push(node.assemble());
    }

    if (node instanceof NonPositiveFilterNode ||
      node instanceof BinNode ||
      node instanceof TimeUnitNode ||
      node instanceof StackNode) {
      dataSource.transform = dataSource.transform.concat(node.assemble());
    }

    if (node instanceof OutputNode) {
      if (dataSource.source && dataSource.transform.length === 0) {
        node.source = dataSource.source;
      } else if (node.parent instanceof OutputNode) {
        // Note that an output node may be required but we still do not assemble a
        // separate data source for it.
        node.source = dataSource.name;
        throw new Error('cannot happen');
      } else {
        if (!dataSource.name) {
          dataSource.name = `data_${datasetIndex++}`;
        }

        // Here we set the name of the datasource we generated. From now on
        // other assemblers can use it.
        node.source = dataSource.name;

        // if this node has more than one child, we will add a datasource automatically
        if (node.numChildren() === 1 && dataSource.transform.length > 0) {
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
        if (!dataSource.source || dataSource.transform.length > 0) {
          // do not push empty datasources that are simply references
          data.push(dataSource);
        }
        break;
      case 1:
        walkTree(node.children[0], dataSource);
        break;
      default:
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
 * Creates Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleData(roots: SourceNode[]): VgData[] {
  const data: VgData[] = [];

  roots.forEach(removeUnnecessaryNodes);

  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.bin));
  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.timeUnit));

  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.nullfilter));
  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.transforms));

  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.aggregate));
  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.stack));

  getLeaves(roots).forEach(optimizeFromLeaves(optimizers.parse));

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

  return data;
}
