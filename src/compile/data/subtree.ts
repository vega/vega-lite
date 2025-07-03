import {DataSourceType} from '../../data.js';
import {AggregateNode} from './aggregate.js';
import {DataFlowNode, OutputNode} from './dataflow.js';
import {FacetNode} from './facet.js';
import {JoinAggregateTransformNode} from './joinaggregate.js';
import {FACET_SCALE_PREFIX} from './optimize.js';
import {StackNode} from './stack.js';
import {WindowTransformNode} from './window.js';

/**
 * Clones the subtree and ignores output nodes except for the leaves, which are renamed.
 */
function cloneSubtree(facet: FacetNode) {
  function clone(node: DataFlowNode): DataFlowNode[] {
    if (!(node instanceof FacetNode)) {
      const copy = node.clone();

      if (copy instanceof OutputNode) {
        const newName = FACET_SCALE_PREFIX + copy.getSource();
        copy.setSource(newName);

        facet.model.component.data.outputNodes[newName] = copy;
      } else if (
        copy instanceof AggregateNode ||
        copy instanceof StackNode ||
        copy instanceof WindowTransformNode ||
        copy instanceof JoinAggregateTransformNode
      ) {
        copy.addDimensions(facet.fields);
      }
      for (const n of node.children.flatMap(clone)) {
        n.parent = copy;
      }

      return [copy];
    }

    return node.children.flatMap(clone);
  }
  return clone;
}

/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
export function moveFacetDown(node: DataFlowNode) {
  if (node instanceof FacetNode) {
    if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
      // move down until we hit a fork or output node
      const child = node.children[0];

      if (
        child instanceof AggregateNode ||
        child instanceof StackNode ||
        child instanceof WindowTransformNode ||
        child instanceof JoinAggregateTransformNode
      ) {
        child.addDimensions(node.fields);
      }

      child.swapWithParent();
      moveFacetDown(node);
    } else {
      // move main to facet

      const facetMain = node.model.component.data.main;
      moveMainDownToFacet(facetMain);

      // replicate the subtree and place it before the facet's main node
      const cloner = cloneSubtree(node);
      const copy: DataFlowNode[] = node.children.map(cloner).flat();
      for (const c of copy) {
        c.parent = facetMain;
      }
    }
  } else {
    node.children.map(moveFacetDown);
  }
}

function moveMainDownToFacet(node: DataFlowNode) {
  if (node instanceof OutputNode && node.type === DataSourceType.Main) {
    if (node.numChildren() === 1) {
      const child = node.children[0];
      if (!(child instanceof FacetNode)) {
        child.swapWithParent();
        moveMainDownToFacet(node);
      }
    }
  }
}
