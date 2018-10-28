import * as tslib_1 from "tslib";
import { fieldIntersection, keys } from '../../util';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
import { BottomUpOptimizer, TopDownOptimizer } from './optimizer';
import { SourceNode } from './source';
import { TimeUnitNode } from './timeunit';
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
//# sourceMappingURL=optimizers.js.map