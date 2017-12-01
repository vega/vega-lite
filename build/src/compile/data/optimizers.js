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
 * Repeatedly remove leaf nodes that are not output nodes.
 * The reason is that we don't need subtrees that don't have any output nodes.
 */
function removeUnusedSubtrees(node) {
    if (node instanceof dataflow_1.OutputNode || node.numChildren() > 0) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsbUNBQWlEO0FBQ2pELHVDQUFvRDtBQUNwRCw2Q0FBd0M7QUFDeEMsbUNBQW9DO0FBQ3BDLHVDQUF3QztBQUd4Qzs7OztHQUlHO0FBQ0gsMkJBQWtDLENBQWtDO0lBQ2xFLGdDQUFnQyxJQUFrQjtRQUNoRCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksbUJBQVUsQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7QUFiRCw4Q0FhQztBQUVEOztHQUVHO0FBQ0gscUJBQTRCLElBQWtCO0lBQzVDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsdUNBQXVDO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSx1QkFBUyxDQUFDLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksbUJBQVUsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3Qix3REFBd0Q7WUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLFlBQVksdUJBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTiw0RkFBNEY7WUFDNUYsRUFBRSxDQUFDLENBQUMsc0JBQWUsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2QsQ0FBQztZQUVELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBM0JELGtDQTJCQztBQUVEOzs7R0FHRztBQUNILDhCQUFxQyxJQUFrQjtJQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVkscUJBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxxR0FBcUc7UUFDckcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFSRCxvREFRQztBQUVEOzs7O0dBSUc7QUFDSCxrQ0FBeUMsSUFBa0I7SUFDekQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFDLElBQWtCO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSx1QkFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEMsSUFBTSxJQUFJLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFDLENBQUM7WUFFckQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sZ0JBQU8sTUFBTSxFQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQWhCRCw0REFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hhc0ludGVyc2VjdGlvbiwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcblxuXG4vKipcbiAqIFN0YXJ0IG9wdGltaXphdGlvbiBwYXRoIGF0IHRoZSBsZWF2ZXMuIFVzZWZ1bCBmb3IgbWVyZ2luZyB1cCBvciByZW1vdmluZyB0aGluZ3MuXG4gKlxuICogSWYgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZSwgdGhlIHJlY3Vyc2lvbiBjb250aW51ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlRnJvbUxlYXZlcyhmOiAobm9kZTogRGF0YUZsb3dOb2RlKSA9PiBib29sZWFuKSB7XG4gIGZ1bmN0aW9uIG9wdGltaXplTmV4dEZyb21MZWF2ZXMobm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dCA9IG5vZGUucGFyZW50O1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICBvcHRpbWl6ZU5leHRGcm9tTGVhdmVzKG5leHQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZU5leHRGcm9tTGVhdmVzO1xufVxuXG4vKipcbiAqIE1vdmUgcGFyc2Ugbm9kZXMgdXAgdG8gZm9ya3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlUGFyc2VVcChub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgLy8gbW92ZSBwYXJzZSB1cCBieSBtZXJnaW5nIG9yIHN3YXBwaW5nXG4gIGlmIChub2RlIGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50Lm51bUNoaWxkcmVuKCkgPiAxKSB7XG4gICAgICAvLyBkb24ndCBtb3ZlIHBhcnNlIGZ1cnRoZXIgdXAgYnV0IGNvbnRpbnVlIHdpdGggcGFyZW50LlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFBhcnNlTm9kZSkge1xuICAgICAgcGFyZW50Lm1lcmdlKG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb24ndCBzd2FwIHdpdGggbm9kZXMgdGhhdCBwcm9kdWNlIHNvbWV0aGluZyB0aGF0IHRoZSBwYXJzZSBub2RlIGRlcGVuZHMgb24gKGUuZy4gbG9va3VwKVxuICAgICAgaWYgKGhhc0ludGVyc2VjdGlvbihwYXJlbnQucHJvZHVjZWRGaWVsZHMoKSwgbm9kZS5kZXBlbmRlbnRGaWVsZHMoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuc3dhcFdpdGhQYXJlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXBlYXRlZGx5IHJlbW92ZSBsZWFmIG5vZGVzIHRoYXQgYXJlIG5vdCBvdXRwdXQgbm9kZXMuXG4gKiBUaGUgcmVhc29uIGlzIHRoYXQgd2UgZG9uJ3QgbmVlZCBzdWJ0cmVlcyB0aGF0IGRvbid0IGhhdmUgYW55IG91dHB1dCBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVVudXNlZFN1YnRyZWVzKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgfHwgbm9kZS5udW1DaGlsZHJlbigpID4gMCkge1xuICAgIC8vIG5vIG5lZWQgdG8gY29udGludWUgd2l0aCBwYXJlbnQgYmVjYXVzZSBpdCBpcyBvdXRwdXQgbm9kZSBvciB3aWxsIGhhdmUgY2hpbGRyZW4gKHRoZXJlIHdhcyBhIGZvcmspXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG5vZGUucmVtb3ZlKCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGUgdGltZSB1bml0IG5vZGVzIChhcyBkZXRlcm1pbmVkIGJ5IHRoZSBuYW1lIG9mIHRoZVxuICogb3V0cHV0IGZpZWxkKSB0aGF0IG1heSBiZSBnZW5lcmF0ZWQgZHVlIHRvIHNlbGVjdGlvbnMgcHJvamVjdGVkIG92ZXJcbiAqIHRpbWUgdW5pdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVUaW1lVW5pdHMobGVhZjogRGF0YUZsb3dOb2RlKSB7XG4gIGxldCBmaWVsZHMgPSB7fTtcbiAgcmV0dXJuIGl0ZXJhdGVGcm9tTGVhdmVzKChub2RlOiBEYXRhRmxvd05vZGUpID0+IHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFRpbWVVbml0Tm9kZSkge1xuICAgICAgY29uc3QgcGZpZWxkcyA9IG5vZGUucHJvZHVjZWRGaWVsZHMoKTtcbiAgICAgIGNvbnN0IGR1cGUgPSBrZXlzKHBmaWVsZHMpLmV2ZXJ5KChrKSA9PiAhIWZpZWxkc1trXSk7XG5cbiAgICAgIGlmIChkdXBlKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZHMgPSB7Li4uZmllbGRzLCAuLi5wZmllbGRzfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSkobGVhZik7XG59XG4iXX0=