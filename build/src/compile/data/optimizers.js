"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var formatparse_1 = require("./formatparse");
var source_1 = require("./source");
var timeunit_1 = require("./timeunit");
/**
 * Start optimization path at the leaves. Useful for merging up or removing things.
 *
 * If the callback returns true, the recursion continues.
 */
function iterateFromLeaves(f) {
    function optimizeNextFromLeaves(node) {
        if (node instanceof source_1.SourceNode) {
            return;
        }
        var next = node.parent;
        if (f(node)) {
            optimizeNextFromLeaves(next);
        }
    }
    return optimizeNextFromLeaves;
}
exports.iterateFromLeaves = iterateFromLeaves;
/**
 * Move parse nodes up to forks.
 */
function moveParseUp(node) {
    var parent = node.parent;
    // move parse up by merging or swapping
    if (node instanceof formatparse_1.ParseNode) {
        if (parent instanceof source_1.SourceNode) {
            return false;
        }
        if (parent.numChildren() > 1) {
            // don't move parse further up but continue with parent.
            return true;
        }
        if (parent instanceof formatparse_1.ParseNode) {
            parent.merge(node);
        }
        else {
            // don't swap with nodes that produce something that the parse node depends on (e.g. lookup)
            if (util_1.hasIntersection(parent.producedFields(), node.dependentFields())) {
                return true;
            }
            node.swapWithParent();
        }
    }
    return true;
}
exports.moveParseUp = moveParseUp;
/**
 * Repeatedly remove leaf nodes that are not output or facet nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 * Facet nodes are needed for the row or column domains.
 */
function removeUnusedSubtrees(node) {
    if (node instanceof dataflow_1.OutputNode || node.numChildren() > 0 || node instanceof facet_1.FacetNode) {
        // no need to continue with parent because it is output node or will have children (there was a fork)
        return false;
    }
    else {
        node.remove();
    }
    return true;
}
exports.removeUnusedSubtrees = removeUnusedSubtrees;
/**
 * Removes duplicate time unit nodes (as determined by the name of the
 * output field) that may be generated due to selections projected over
 * time units.
 */
function removeDuplicateTimeUnits(leaf) {
    var fields = {};
    return iterateFromLeaves(function (node) {
        if (node instanceof timeunit_1.TimeUnitNode) {
            var pfields = node.producedFields();
            var dupe = util_1.keys(pfields).every(function (k) { return !!fields[k]; });
            if (dupe) {
                node.remove();
            }
            else {
                fields = __assign({}, fields, pfields);
            }
        }
        return true;
    })(leaf);
}
exports.removeDuplicateTimeUnits = removeDuplicateTimeUnits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsbUNBQWlEO0FBQ2pELHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsNkNBQXdDO0FBQ3hDLG1DQUFvQztBQUNwQyx1Q0FBd0M7QUFHeEM7Ozs7R0FJRztBQUNILDJCQUFrQyxDQUFrQztJQUNsRSxnQ0FBZ0MsSUFBa0I7UUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLG1CQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDWixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQztBQUNoQyxDQUFDO0FBYkQsOENBYUM7QUFFRDs7R0FFRztBQUNILHFCQUE0QixJQUFrQjtJQUM1QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBRTNCLHVDQUF1QztJQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksdUJBQVMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLG1CQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0Isd0RBQXdEO1lBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxZQUFZLHVCQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sNEZBQTRGO1lBQzVGLEVBQUUsQ0FBQyxDQUFDLHNCQUFlLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckUsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7WUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQTNCRCxrQ0EyQkM7QUFFRDs7OztHQUlHO0FBQ0gsOEJBQXFDLElBQWtCO0lBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSxxQkFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksSUFBSSxZQUFZLGlCQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLHFHQUFxRztRQUNyRyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9EQVFDO0FBRUQ7Ozs7R0FJRztBQUNILGtDQUF5QyxJQUFrQjtJQUN6RCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQUMsSUFBa0I7UUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHVCQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QyxJQUFNLElBQUksR0FBRyxXQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQztZQUVyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxnQkFBTyxNQUFNLEVBQUssT0FBTyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDWCxDQUFDO0FBaEJELDREQWdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aGFzSW50ZXJzZWN0aW9uLCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlLCBPdXRwdXROb2RlfSBmcm9tICcuL2RhdGFmbG93JztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4vdGltZXVuaXQnO1xuXG5cbi8qKlxuICogU3RhcnQgb3B0aW1pemF0aW9uIHBhdGggYXQgdGhlIGxlYXZlcy4gVXNlZnVsIGZvciBtZXJnaW5nIHVwIG9yIHJlbW92aW5nIHRoaW5ncy5cbiAqXG4gKiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVlLCB0aGUgcmVjdXJzaW9uIGNvbnRpbnVlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVGcm9tTGVhdmVzKGY6IChub2RlOiBEYXRhRmxvd05vZGUpID0+IGJvb2xlYW4pIHtcbiAgZnVuY3Rpb24gb3B0aW1pemVOZXh0RnJvbUxlYXZlcyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0ID0gbm9kZS5wYXJlbnQ7XG4gICAgaWYgKGYobm9kZSkpIHtcbiAgICAgIG9wdGltaXplTmV4dEZyb21MZWF2ZXMobmV4dCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplTmV4dEZyb21MZWF2ZXM7XG59XG5cbi8qKlxuICogTW92ZSBwYXJzZSBub2RlcyB1cCB0byBmb3Jrcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdmVQYXJzZVVwKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcblxuICAvLyBtb3ZlIHBhcnNlIHVwIGJ5IG1lcmdpbmcgb3Igc3dhcHBpbmdcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBQYXJzZU5vZGUpIHtcbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQubnVtQ2hpbGRyZW4oKSA+IDEpIHtcbiAgICAgIC8vIGRvbid0IG1vdmUgcGFyc2UgZnVydGhlciB1cCBidXQgY29udGludWUgd2l0aCBwYXJlbnQuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgICBwYXJlbnQubWVyZ2Uobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRvbid0IHN3YXAgd2l0aCBub2RlcyB0aGF0IHByb2R1Y2Ugc29tZXRoaW5nIHRoYXQgdGhlIHBhcnNlIG5vZGUgZGVwZW5kcyBvbiAoZS5nLiBsb29rdXApXG4gICAgICBpZiAoaGFzSW50ZXJzZWN0aW9uKHBhcmVudC5wcm9kdWNlZEZpZWxkcygpLCBub2RlLmRlcGVuZGVudEZpZWxkcygpKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5zd2FwV2l0aFBhcmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIFJlcGVhdGVkbHkgcmVtb3ZlIGxlYWYgbm9kZXMgdGhhdCBhcmUgbm90IG91dHB1dCBvciBmYWNldCBub2Rlcy5cbiAqIFRoZSByZWFzb24gaXMgdGhhdCB3ZSBkb24ndCBuZWVkIHN1YnRyZWVzIHRoYXQgZG9uJ3QgaGF2ZSBhbnkgb3V0cHV0IG5vZGVzLlxuICogRmFjZXQgbm9kZXMgYXJlIG5lZWRlZCBmb3IgdGhlIHJvdyBvciBjb2x1bW4gZG9tYWlucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVVudXNlZFN1YnRyZWVzKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgfHwgbm9kZS5udW1DaGlsZHJlbigpID4gMCB8fCBub2RlIGluc3RhbmNlb2YgRmFjZXROb2RlKSB7XG4gICAgLy8gbm8gbmVlZCB0byBjb250aW51ZSB3aXRoIHBhcmVudCBiZWNhdXNlIGl0IGlzIG91dHB1dCBub2RlIG9yIHdpbGwgaGF2ZSBjaGlsZHJlbiAodGhlcmUgd2FzIGEgZm9yaylcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbm9kZS5yZW1vdmUoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGR1cGxpY2F0ZSB0aW1lIHVuaXQgbm9kZXMgKGFzIGRldGVybWluZWQgYnkgdGhlIG5hbWUgb2YgdGhlXG4gKiBvdXRwdXQgZmllbGQpIHRoYXQgbWF5IGJlIGdlbmVyYXRlZCBkdWUgdG8gc2VsZWN0aW9ucyBwcm9qZWN0ZWQgb3ZlclxuICogdGltZSB1bml0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUR1cGxpY2F0ZVRpbWVVbml0cyhsZWFmOiBEYXRhRmxvd05vZGUpIHtcbiAgbGV0IGZpZWxkcyA9IHt9O1xuICByZXR1cm4gaXRlcmF0ZUZyb21MZWF2ZXMoKG5vZGU6IERhdGFGbG93Tm9kZSkgPT4ge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgVGltZVVuaXROb2RlKSB7XG4gICAgICBjb25zdCBwZmllbGRzID0gbm9kZS5wcm9kdWNlZEZpZWxkcygpO1xuICAgICAgY29uc3QgZHVwZSA9IGtleXMocGZpZWxkcykuZXZlcnkoKGspID0+ICEhZmllbGRzW2tdKTtcblxuICAgICAgaWYgKGR1cGUpIHtcbiAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpZWxkcyA9IHsuLi5maWVsZHMsIC4uLnBmaWVsZHN9O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9KShsZWFmKTtcbn1cbiJdfQ==