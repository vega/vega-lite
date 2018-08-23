import * as tslib_1 from "tslib";
import { hasIntersection, keys } from '../../util';
import { isTransformNode, OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { ParseNode } from './formatparse';
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
            return;
        }
        var next = node.parent;
        if (f(node)) {
            optimizeNextFromLeaves(next);
        }
    }
    return optimizeNextFromLeaves;
}
/**
 * Move parse nodes up to forks.
 */
export function moveParseUp(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof ParseNode) {
        if (parent instanceof SourceNode) {
            return false;
        }
        if (parent.numChildren() > 1) {
            // don't move parse further up but continue with parent.
            return true;
        }
        if (parent instanceof ParseNode) {
            parent.merge(node);
        }
        else {
            // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
            if (hasIntersection(parent.producedFields(), node.dependentFields())) {
                return true;
            }
            node.swapWithParent();
        }
    }
    return true;
}
function mergeBucket(parent, nodes) {
    var mergedTransform = nodes.shift();
    nodes.forEach(function (x) {
        parent.removeChild(x);
        x.parent = mergedTransform;
        x.remove();
    });
}
/**
 * Merge Identical Transforms at forks by comparing hashes.
 */
export function mergeIdenticalTransforms(node) {
    var transforms = node.children.filter(function (x) { return isTransformNode(x); });
    var hashes = transforms.map(function (x) { return x.hash(); });
    var buckets = {};
    for (var i = 0; i < hashes.length; i++) {
        if (buckets[hashes[i]] === undefined) {
            buckets[hashes[i]] = [transforms[i]];
        }
        else {
            buckets[hashes[i]].push(transforms[i]);
        }
    }
    for (var _i = 0, _a = keys(buckets); _i < _a.length; _i++) {
        var k = _a[_i];
        mergeBucket(node, buckets[k]);
    }
    node.children.forEach(mergeIdenticalTransforms);
}
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
export function removeUnusedSubtrees(node) {
    if (node instanceof OutputNode || node.numChildren() > 0 || node instanceof FacetNode) {
        // no need to continue with parent because it is output node or will have children (there was a fork)
        return false;
    }
    else {
        node.remove();
    }
    return true;
}
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
export function removeDuplicateTimeUnits(leaf) {
    var fields = {};
    return iterateFromLeaves(function (node) {
        if (node instanceof TimeUnitNode) {
            var pfields = node.producedFields();
            var dupe = keys(pfields).every(function (k) { return !!fields[k]; });
            if (dupe) {
                node.remove();
            }
            else {
                fields = tslib_1.__assign({}, fields, pfields);
            }
        }
        return true;
    })(leaf);
}
//# sourceMappingURL=optimizers.js.map