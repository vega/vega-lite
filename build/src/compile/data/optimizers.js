import * as tslib_1 from "tslib";
import { MAIN } from '../../data';
import { fieldIntersection, flatten, hash, keys } from '../../util';
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
        var next = node.parent;
        var _a = f(node), continueFlag = _a.continueFlag, mutatedFlag = _a.mutatedFlag;
        var childFlag = false;
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
var MoveParseUp = /** @class */ (function (_super) {
    tslib_1.__extends(MoveParseUp, _super);
    function MoveParseUp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveParseUp.prototype.run = function (node) {
        var parent = node.parent;
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
    };
    return MoveParseUp;
}(BottomUpOptimizer));
export { MoveParseUp };
/**
 * Merge identical nodes at forks by comparing hashes.
 *
 * Does not need to iterate from leaves so we implement this with recursion as it's a bit simpler.
 */
var MergeIdenticalNodes = /** @class */ (function (_super) {
    tslib_1.__extends(MergeIdenticalNodes, _super);
    function MergeIdenticalNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MergeIdenticalNodes.prototype.mergeNodes = function (parent, nodes) {
        var mergedNode = nodes.shift();
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            parent.removeChild(node);
            node.parent = mergedNode;
            node.remove();
        }
    };
    MergeIdenticalNodes.prototype.run = function (node) {
        var hashes = node.children.map(function (x) { return x.hash(); });
        var buckets = {};
        for (var i = 0; i < hashes.length; i++) {
            if (buckets[hashes[i]] === undefined) {
                buckets[hashes[i]] = [node.children[i]];
            }
            else {
                buckets[hashes[i]].push(node.children[i]);
            }
        }
        for (var _i = 0, _a = keys(buckets); _i < _a.length; _i++) {
            var k = _a[_i];
            if (buckets[k].length > 1) {
                this.setMutated();
                this.mergeNodes(node, buckets[k]);
            }
        }
        for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
            var child = _c[_b];
            this.run(child);
        }
        return this.mutatedFlag;
    };
    return MergeIdenticalNodes;
}(TopDownOptimizer));
export { MergeIdenticalNodes };
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
var RemoveUnusedSubtrees = /** @class */ (function (_super) {
    tslib_1.__extends(RemoveUnusedSubtrees, _super);
    function RemoveUnusedSubtrees() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveUnusedSubtrees.prototype.run = function (node) {
        if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
            // no need to continue with parent because it is output node or will have children (there was a fork)
            return this.flags;
        }
        else {
            this.setMutated();
            node.remove();
        }
        return this.flags;
    };
    return RemoveUnusedSubtrees;
}(BottomUpOptimizer));
export { RemoveUnusedSubtrees };
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
var RemoveDuplicateTimeUnits = /** @class */ (function (_super) {
    tslib_1.__extends(RemoveDuplicateTimeUnits, _super);
    function RemoveDuplicateTimeUnits() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fields = {};
        return _this;
    }
    RemoveDuplicateTimeUnits.prototype.run = function (node) {
        var _this = this;
        this.setContinue();
        if (node instanceof TimeUnitNode) {
            var pfields = node.producedFields();
            var dupe = keys(pfields).every(function (k) { return !!_this.fields[k]; });
            if (dupe) {
                this.setMutated();
                node.remove();
            }
            else {
                this.fields = tslib_1.__assign({}, this.fields, pfields);
            }
        }
        return this.flags;
    };
    return RemoveDuplicateTimeUnits;
}(BottomUpOptimizer));
export { RemoveDuplicateTimeUnits };
/**
 * Clones the subtree and ignores output nodes except for the leaves, which are renamed.
 */
function cloneSubtree(facet) {
    function clone(node) {
        if (!(node instanceof FacetNode)) {
            var copy_1 = node.clone();
            if (copy_1 instanceof OutputNode) {
                var newName = FACET_SCALE_PREFIX + copy_1.getSource();
                copy_1.setSource(newName);
                facet.model.component.data.outputNodes[newName] = copy_1;
            }
            else if (copy_1 instanceof AggregateNode || copy_1 instanceof StackNode || copy_1 instanceof WindowTransformNode) {
                copy_1.addDimensions(facet.fields);
            }
            flatten(node.children.map(clone)).forEach(function (n) { return (n.parent = copy_1); });
            return [copy_1];
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
            var child = node.children[0];
            if (child instanceof AggregateNode || child instanceof StackNode || child instanceof WindowTransformNode) {
                child.addDimensions(node.fields);
            }
            child.swapWithParent();
            moveFacetDown(node);
        }
        else {
            // move main to facet
            var facetMain = node.model.component.data.main;
            moveMainDownToFacet(facetMain);
            // replicate the subtree and place it before the facet's main node
            var cloner = cloneSubtree(node);
            var copy = flatten(node.children.map(cloner));
            for (var _i = 0, copy_2 = copy; _i < copy_2.length; _i++) {
                var c = copy_2[_i];
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
            var child = node.children[0];
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
var RemoveUnnecessaryNodes = /** @class */ (function (_super) {
    tslib_1.__extends(RemoveUnnecessaryNodes, _super);
    function RemoveUnnecessaryNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RemoveUnnecessaryNodes.prototype.run = function (node) {
        // remove output nodes that are not required
        if (node instanceof OutputNode && !node.isRequired()) {
            this.setMutated();
            node.remove();
        }
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.run(child);
        }
        return this.mutatedFlag;
    };
    return RemoveUnnecessaryNodes;
}(TopDownOptimizer));
export { RemoveUnnecessaryNodes };
/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
var MergeParse = /** @class */ (function (_super) {
    tslib_1.__extends(MergeParse, _super);
    function MergeParse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MergeParse.prototype.run = function (node) {
        var parent = node.parent;
        var parseChildren = parent.children.filter(function (x) { return x instanceof ParseNode; });
        if (parseChildren.length > 1) {
            var commonParse = {};
            for (var _i = 0, parseChildren_1 = parseChildren; _i < parseChildren_1.length; _i++) {
                var parseNode = parseChildren_1[_i];
                var parse = parseNode.parse;
                for (var _a = 0, _b = keys(parse); _a < _b.length; _a++) {
                    var k = _b[_a];
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
                var mergedParseNode = new ParseNode(parent, commonParse);
                for (var _c = 0, parseChildren_2 = parseChildren; _c < parseChildren_2.length; _c++) {
                    var parseNode = parseChildren_2[_c];
                    for (var _d = 0, _e = keys(commonParse); _d < _e.length; _d++) {
                        var key = _e[_d];
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
    };
    return MergeParse;
}(BottomUpOptimizer));
export { MergeParse };
var MergeAggregateNodes = /** @class */ (function (_super) {
    tslib_1.__extends(MergeAggregateNodes, _super);
    function MergeAggregateNodes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MergeAggregateNodes.prototype.run = function (node) {
        var parent = node.parent;
        var aggChildren = parent.children.filter(function (x) { return x instanceof AggregateNode; });
        // Object which we'll use to map the fields which an aggregate is grouped by to
        // the set of aggregates with that grouping. This is useful as only aggregates
        // with the same group by can be merged
        var groupedAggregates = {};
        // Build groupedAggregates
        for (var _i = 0, aggChildren_1 = aggChildren; _i < aggChildren_1.length; _i++) {
            var agg = aggChildren_1[_i];
            var groupBys = hash(keys(agg.groupBy).sort());
            if (!(groupBys in groupedAggregates)) {
                groupedAggregates[groupBys] = [];
            }
            groupedAggregates[groupBys].push(agg);
        }
        // Merge aggregateNodes with same key in groupedAggregates
        for (var _a = 0, _b = keys(groupedAggregates); _a < _b.length; _a++) {
            var group = _b[_a];
            var mergeableAggs = groupedAggregates[group];
            if (mergeableAggs.length > 1) {
                var mergedAggs = mergeableAggs.pop();
                for (var _c = 0, mergeableAggs_1 = mergeableAggs; _c < mergeableAggs_1.length; _c++) {
                    var agg = mergeableAggs_1[_c];
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
    };
    return MergeAggregateNodes;
}(BottomUpOptimizer));
export { MergeAggregateNodes };
//# sourceMappingURL=optimizers.js.map