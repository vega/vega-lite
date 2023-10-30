import { fieldIntersection, hash, hasIntersection, isEmpty, keys, some } from '../../util';
import { requiresSelectionId } from '../selection';
import { AggregateNode } from './aggregate';
import { BinNode } from './bin';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { FilterNode } from './filter';
import { ParseNode } from './formatparse';
import { IdentifierNode } from './identifier';
import { BottomUpOptimizer, isDataSourceNode, Optimizer, TopDownOptimizer } from './optimizer';
import { SourceNode } from './source';
import { TimeUnitNode } from './timeunit';
/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
export class MergeIdenticalNodes extends TopDownOptimizer {
    mergeNodes(parent, nodes) {
        const mergedNode = nodes.shift();
        for (const node of nodes) {
            parent.removeChild(node);
            node.parent = mergedNode;
            node.remove();
        }
    }
    run(node) {
        const hashes = node.children.map(x => x.hash());
        const buckets = {};
        for (let i = 0; i < hashes.length; i++) {
            if (buckets[hashes[i]] === undefined) {
                buckets[hashes[i]] = [node.children[i]];
            }
            else {
                buckets[hashes[i]].push(node.children[i]);
            }
        }
        for (const k of keys(buckets)) {
            if (buckets[k].length > 1) {
                this.setModified();
                this.mergeNodes(node, buckets[k]);
            }
        }
    }
}
/**
 * Optimizer that removes identifier nodes that are not needed for selections.
 */
export class RemoveUnnecessaryIdentifierNodes extends TopDownOptimizer {
    constructor(model) {
        super();
        this.requiresSelectionId = model && requiresSelectionId(model);
    }
    run(node) {
        if (node instanceof IdentifierNode) {
            // Only preserve IdentifierNodes if we have default discrete selections
            // in our model tree, and if the nodes come after tuple producing nodes.
            if (!(this.requiresSelectionId &&
                (isDataSourceNode(node.parent) || node.parent instanceof AggregateNode || node.parent instanceof ParseNode))) {
                this.setModified();
                node.remove();
            }
        }
    }
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the output field) that may be generated due to
 * selections projected over time units. Only keeps the first time unit in any branch.
 *
 * This optimizer is a custom top down optimizer that keep track of produced fields in a branch.
 */
export class RemoveDuplicateTimeUnits extends Optimizer {
    optimize(node) {
        this.run(node, new Set());
        return this.modifiedFlag;
    }
    run(node, timeUnitFields) {
        let producedFields = new Set();
        if (node instanceof TimeUnitNode) {
            producedFields = node.producedFields();
            if (hasIntersection(producedFields, timeUnitFields)) {
                this.setModified();
                node.removeFormulas(timeUnitFields);
                if (node.producedFields.length === 0) {
                    node.remove();
                }
            }
        }
        for (const child of node.children) {
            this.run(child, new Set([...timeUnitFields, ...producedFields]));
        }
    }
}
/**
 * Remove output nodes that are not required.
 */
export class RemoveUnnecessaryOutputNodes extends TopDownOptimizer {
    constructor() {
        super();
    }
    run(node) {
        if (node instanceof OutputNode && !node.isRequired()) {
            this.setModified();
            node.remove();
        }
    }
}
/**
 * Move parse nodes up to forks and merges them if possible.
 */
export class MoveParseUp extends BottomUpOptimizer {
    run(node) {
        if (isDataSourceNode(node)) {
            return;
        }
        if (node.numChildren() > 1) {
            // Don't move parse further up but continue with parent.
            return;
        }
        for (const child of node.children) {
            if (child instanceof ParseNode) {
                if (node instanceof ParseNode) {
                    this.setModified();
                    node.merge(child);
                }
                else {
                    // Don't swap with nodes that produce something that the parse node depends on (e.g. lookup).
                    if (fieldIntersection(node.producedFields(), child.dependentFields())) {
                        continue;
                    }
                    this.setModified();
                    child.swapWithParent();
                }
            }
        }
        return;
    }
}
/**
 * Inserts an intermediate ParseNode containing all non-conflicting parse fields and removes the empty ParseNodes.
 *
 * We assume that dependent paths that do not have a parse node can be just merged.
 */
export class MergeParse extends BottomUpOptimizer {
    run(node) {
        const originalChildren = [...node.children];
        const parseChildren = node.children.filter((child) => child instanceof ParseNode);
        if (node.numChildren() > 1 && parseChildren.length >= 1) {
            const commonParse = {};
            const conflictingParse = new Set();
            for (const parseNode of parseChildren) {
                const parse = parseNode.parse;
                for (const k of keys(parse)) {
                    if (!(k in commonParse)) {
                        commonParse[k] = parse[k];
                    }
                    else if (commonParse[k] !== parse[k]) {
                        conflictingParse.add(k);
                    }
                }
            }
            for (const field of conflictingParse) {
                delete commonParse[field];
            }
            if (!isEmpty(commonParse)) {
                this.setModified();
                const mergedParseNode = new ParseNode(node, commonParse);
                for (const childNode of originalChildren) {
                    if (childNode instanceof ParseNode) {
                        for (const key of keys(commonParse)) {
                            delete childNode.parse[key];
                        }
                    }
                    node.removeChild(childNode);
                    childNode.parent = mergedParseNode;
                    // remove empty parse nodes
                    if (childNode instanceof ParseNode && keys(childNode.parse).length === 0) {
                        childNode.remove();
                    }
                }
            }
        }
    }
}
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export class RemoveUnusedSubtrees extends BottomUpOptimizer {
    run(node) {
        if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
            // no need to continue with parent because it is output node or will have children (there was a fork)
        }
        else if (node instanceof SourceNode) {
            // ignore empty unused sources as they will be removed in optimizationDataflowHelper
        }
        else {
            this.setModified();
            node.remove();
        }
    }
}
/**
 * Merge adjacent time unit nodes.
 */
export class MergeTimeUnits extends BottomUpOptimizer {
    run(node) {
        const timeUnitChildren = node.children.filter((x) => x instanceof TimeUnitNode);
        const combination = timeUnitChildren.pop();
        for (const timeUnit of timeUnitChildren) {
            this.setModified();
            combination.merge(timeUnit);
        }
    }
}
export class MergeAggregates extends BottomUpOptimizer {
    run(node) {
        const aggChildren = node.children.filter((child) => child instanceof AggregateNode);
        // Object which we'll use to map the fields which an aggregate is grouped by to
        // the set of aggregates with that grouping. This is useful as only aggregates
        // with the same group by can be merged
        const groupedAggregates = {};
        // Build groupedAggregates
        for (const agg of aggChildren) {
            const groupBys = hash(agg.groupBy);
            if (!(groupBys in groupedAggregates)) {
                groupedAggregates[groupBys] = [];
            }
            groupedAggregates[groupBys].push(agg);
        }
        // Merge aggregateNodes with same key in groupedAggregates
        for (const group of keys(groupedAggregates)) {
            const mergeableAggs = groupedAggregates[group];
            if (mergeableAggs.length > 1) {
                const mergedAggs = mergeableAggs.pop();
                for (const agg of mergeableAggs) {
                    if (mergedAggs.merge(agg)) {
                        node.removeChild(agg);
                        agg.parent = mergedAggs;
                        agg.remove();
                        this.setModified();
                    }
                }
            }
        }
    }
}
/**
 * Merge bin nodes and move them up through forks. Stop at filters, parse, identifier as we want them to stay before the bin node.
 */
export class MergeBins extends BottomUpOptimizer {
    constructor(model) {
        super();
        this.model = model;
    }
    run(node) {
        const moveBinsUp = !(isDataSourceNode(node) ||
            node instanceof FilterNode ||
            node instanceof ParseNode ||
            node instanceof IdentifierNode);
        const promotableBins = [];
        const remainingBins = [];
        for (const child of node.children) {
            if (child instanceof BinNode) {
                if (moveBinsUp && !fieldIntersection(node.producedFields(), child.dependentFields())) {
                    promotableBins.push(child);
                }
                else {
                    remainingBins.push(child);
                }
            }
        }
        if (promotableBins.length > 0) {
            const promotedBin = promotableBins.pop();
            for (const bin of promotableBins) {
                promotedBin.merge(bin, this.model.renameSignal.bind(this.model));
            }
            this.setModified();
            if (node instanceof BinNode) {
                node.merge(promotedBin, this.model.renameSignal.bind(this.model));
            }
            else {
                promotedBin.swapWithParent();
            }
        }
        if (remainingBins.length > 1) {
            const remainingBin = remainingBins.pop();
            for (const bin of remainingBins) {
                remainingBin.merge(bin, this.model.renameSignal.bind(this.model));
            }
            this.setModified();
        }
    }
}
/**
 * This optimizer takes output nodes that are at a fork and moves them before the fork.
 *
 * The algorithm iterates over the children and tries to find the last output node in a chain of output nodes.
 * It then moves all output nodes before that main output node. All other children (and the children of the output nodes)
 * are inserted after the main output node.
 */
export class MergeOutputs extends BottomUpOptimizer {
    run(node) {
        const children = [...node.children];
        const hasOutputChild = some(children, child => child instanceof OutputNode);
        if (!hasOutputChild || node.numChildren() <= 1) {
            return;
        }
        const otherChildren = [];
        // The output node we will connect all other nodes to.
        // Output nodes will be added before the new node, other nodes after.
        let mainOutput;
        for (const child of children) {
            if (child instanceof OutputNode) {
                let lastOutput = child;
                while (lastOutput.numChildren() === 1) {
                    const [theChild] = lastOutput.children;
                    if (theChild instanceof OutputNode) {
                        lastOutput = theChild;
                    }
                    else {
                        break;
                    }
                }
                otherChildren.push(...lastOutput.children);
                if (mainOutput) {
                    // Move the output nodes before the mainOutput. We do this by setting
                    // the parent of the first not to the parent of the main output and
                    // the main output's parent to the last output.
                    // note: the child is the first output
                    node.removeChild(child);
                    child.parent = mainOutput.parent;
                    mainOutput.parent.removeChild(mainOutput);
                    mainOutput.parent = lastOutput;
                    this.setModified();
                }
                else {
                    mainOutput = lastOutput;
                }
            }
            else {
                otherChildren.push(child);
            }
        }
        if (otherChildren.length) {
            this.setModified();
            for (const child of otherChildren) {
                child.parent.removeChild(child);
                child.parent = mainOutput;
            }
        }
    }
}
//# sourceMappingURL=optimizers.js.map