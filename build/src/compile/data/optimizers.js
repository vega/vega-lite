import { MAIN } from '../../data';
import { fieldIntersection, flatten, hash, hasIntersection, keys } from '../../util';
import { AggregateNode } from './aggregate';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
import { FACET_SCALE_PREFIX } from './optimize';
import { BottomUpOptimizer, TopDownOptimizer } from './optimizer';
import { SourceNode } from './source';
import { StackNode } from './stack';
import { TimeUnitNode } from './timeunit';
import { WindowTransformNode } from './window';
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
export function iterateFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node instanceof SourceNode) {
            return false;
        }
        const next = node.parent;
        const { continueFlag, mutatedFlag } = f(node);
        let childFlag = false;
        if (continueFlag) {
            childFlag = optimizeNextFromLeaves(next);
        }
        return mutatedFlag || childFlag;
    }
    return optimizeNextFromLeaves;
}
/**
 * Move parse nodes up to forks.
 */
export class MoveParseUp extends BottomUpOptimizer {
    run(node) {
        const parent = node.parent;
        // move parse up by merging or swapping
        if (node instanceof ParseNode) {
            if (parent instanceof SourceNode) {
                return this.flags;
            }
            if (parent.numChildren() > 1) {
                // don't move parse further up but continue with parent.
                this.setContinue();
                return this.flags;
            }
            if (parent instanceof ParseNode) {
                this.setMutated();
                parent.merge(node);
            }
            else {
                // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
                if (fieldIntersection(parent.producedFields(), node.dependentFields())) {
                    this.setContinue();
                    return this.flags;
                }
                this.setMutated();
                node.swapWithParent();
            }
        }
        this.setContinue();
        return this.flags;
    }
}
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
                this.setMutated();
                this.mergeNodes(node, buckets[k]);
            }
        }
        for (const child of node.children) {
            this.run(child);
        }
        return this.mutatedFlag;
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
            return this.flags;
        }
        else {
            this.setMutated();
            node.remove();
        }
        return this.flags;
    }
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export class RemoveDuplicateTimeUnits extends BottomUpOptimizer {
    constructor() {
        super(...arguments);
        this.fields = new Set();
    }
    run(node) {
        this.setContinue();
        if (node instanceof TimeUnitNode) {
            const pfields = node.producedFields();
            if (hasIntersection(pfields, this.fields)) {
                this.setMutated();
                node.remove();
            }
            else {
                this.fields = new Set([...this.fields, ...pfields]);
            }
        }
        return this.flags;
    }
}
/**
 * Clones the subtree and ignores output nodes except for the leaves, which are renamed.
 */
function cloneSubtree(facet) {
    function clone(node) {
        if (!(node instanceof FacetNode)) {
            const copy = node.clone();
            if (copy instanceof OutputNode) {
                const newName = FACET_SCALE_PREFIX + copy.getSource();
                copy.setSource(newName);
                facet.model.component.data.outputNodes[newName] = copy;
            }
            else if (copy instanceof AggregateNode || copy instanceof StackNode || copy instanceof WindowTransformNode) {
                copy.addDimensions(facet.fields);
            }
            flatten(node.children.map(clone)).forEach((n) => (n.parent = copy));
            return [copy];
        }
        return flatten(node.children.map(clone));
    }
    return clone;
}
/**
 * Move facet nodes down to the next fork or output node. Also pull the main output with the facet node.
 * After moving down the facet node, make a copy of the subtree and make it a child of the main output.
 */
export function moveFacetDown(node) {
    if (node instanceof FacetNode) {
        if (node.numChildren() === 1 && !(node.children[0] instanceof OutputNode)) {
            // move down until we hit a fork or output node
            const child = node.children[0];
            if (child instanceof AggregateNode || child instanceof StackNode || child instanceof WindowTransformNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            const facetMain = node.model.component.data.main;
            moveMainDownToFacet(facetMain);
            // replicate the subtree and place it before the facet's main node
            const cloner = cloneSubtree(node);
            const copy = flatten(node.children.map(cloner));
            for (const c of copy) {
                c.parent = facetMain;
            }
        }
    }
    else {
        node.children.map(moveFacetDown);
    }
}
function moveMainDownToFacet(node) {
    if (node instanceof OutputNode && node.type === MAIN) {
        if (node.numChildren() === 1) {
            const child = node.children[0];
            if (!(child instanceof FacetNode)) {
                child.swapWithParent();
                moveMainDownToFacet(node);
            }
        }
    }
}
/**
 * Remove nodes that are not required starting from a root.
 */
export class RemoveUnnecessaryNodes extends TopDownOptimizer {
    run(node) {
        // remove output nodes that are not required
        if (node instanceof OutputNode && !node.isRequired()) {
            this.setMutated();
            node.remove();
        }
        for (const child of node.children) {
            this.run(child);
        }
        return this.mutatedFlag;
    }
}
/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export class MergeParse extends BottomUpOptimizer {
    run(node) {
        const parent = node.parent;
        const parseChildren = parent.children.filter((x) => x instanceof ParseNode);
        if (parseChildren.length > 1) {
            const commonParse = {};
            for (const parseNode of parseChildren) {
                const parse = parseNode.parse;
                for (const k of keys(parse)) {
                    if (commonParse[k] === undefined) {
                        commonParse[k] = parse[k];
                    }
                    else if (commonParse[k] !== parse[k]) {
                        delete commonParse[k];
                    }
                }
            }
            if (keys(commonParse).length !== 0) {
                this.setMutated();
                const mergedParseNode = new ParseNode(parent, commonParse);
                for (const parseNode of parseChildren) {
                    for (const key of keys(commonParse)) {
                        delete parseNode.parse[key];
                    }
                    parent.removeChild(parseNode);
                    parseNode.parent = mergedParseNode;
                    if (keys(parseNode.parse).length === 0) {
                        parseNode.remove();
                    }
                }
            }
        }
        this.setContinue();
        return this.flags;
    }
}
export class MergeAggregateNodes extends BottomUpOptimizer {
    run(node) {
        const parent = node.parent;
        const aggChildren = parent.children.filter((x) => x instanceof AggregateNode);
        // Object which we'll use to map the fields which an aggregate is grouped by to
        // the set of aggregates with that grouping. This is useful as only aggregates
        // with the same group by can be merged
        const groupedAggregates = {};
        // Build groupedAggregates
        for (const agg of aggChildren) {
            const groupBys = hash(keys(agg.groupBy).sort());
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
                        parent.removeChild(agg);
                        agg.parent = mergedAggs;
                        agg.remove();
                        this.setMutated();
                    }
                }
            }
        }
        this.setContinue();
        return this.flags;
    }
}
//# sourceMappingURL=optimizers.js.map