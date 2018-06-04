"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
                fields = tslib_1.__assign({}, fields, pfields);
            }
        }
        return true;
    })(leaf);
}
exports.removeDuplicateTimeUnits = removeDuplicateTimeUnits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW1pemVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvb3B0aW1pemVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBaUQ7QUFDakQsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyw2Q0FBd0M7QUFDeEMsbUNBQW9DO0FBQ3BDLHVDQUF3QztBQUd4Qzs7OztHQUlHO0FBQ0gsMkJBQWtDLENBQWtDO0lBQ2xFLGdDQUFnQyxJQUFrQjtRQUNoRCxJQUFJLElBQUksWUFBWSxtQkFBVSxFQUFFO1lBQzlCLE9BQU87U0FDUjtRQUVELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDWCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUM7QUFiRCw4Q0FhQztBQUVEOztHQUVHO0FBQ0gscUJBQTRCLElBQWtCO0lBQzVDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFFM0IsdUNBQXVDO0lBQ3ZDLElBQUksSUFBSSxZQUFZLHVCQUFTLEVBQUU7UUFDN0IsSUFBSSxNQUFNLFlBQVksbUJBQVUsRUFBRTtZQUNoQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLHdEQUF3RDtZQUN4RCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxNQUFNLFlBQVksdUJBQVMsRUFBRTtZQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BCO2FBQU07WUFDTCw0RkFBNEY7WUFDNUYsSUFBSSxzQkFBZSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRTtnQkFDcEUsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN2QjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBM0JELGtDQTJCQztBQUVEOzs7O0dBSUc7QUFDSCw4QkFBcUMsSUFBa0I7SUFDckQsSUFBSSxJQUFJLFlBQVkscUJBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksWUFBWSxpQkFBUyxFQUFFO1FBQ3JGLHFHQUFxRztRQUNyRyxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU07UUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVJELG9EQVFDO0FBRUQ7Ozs7R0FJRztBQUNILGtDQUF5QyxJQUFrQjtJQUN6RCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsT0FBTyxpQkFBaUIsQ0FBQyxVQUFDLElBQWtCO1FBQzFDLElBQUksSUFBSSxZQUFZLHVCQUFZLEVBQUU7WUFDaEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RDLElBQU0sSUFBSSxHQUFHLFdBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsQ0FBQyxDQUFDO1lBRXJELElBQUksSUFBSSxFQUFFO2dCQUNSLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNmO2lCQUFNO2dCQUNMLE1BQU0sd0JBQU8sTUFBTSxFQUFLLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQWhCRCw0REFnQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2hhc0ludGVyc2VjdGlvbiwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcblxuXG4vKipcbiAqIFN0YXJ0IG9wdGltaXphdGlvbiBwYXRoIGF0IHRoZSBsZWF2ZXMuIFVzZWZ1bCBmb3IgbWVyZ2luZyB1cCBvciByZW1vdmluZyB0aGluZ3MuXG4gKlxuICogSWYgdGhlIGNhbGxiYWNrIHJldHVybnMgdHJ1ZSwgdGhlIHJlY3Vyc2lvbiBjb250aW51ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlRnJvbUxlYXZlcyhmOiAobm9kZTogRGF0YUZsb3dOb2RlKSA9PiBib29sZWFuKSB7XG4gIGZ1bmN0aW9uIG9wdGltaXplTmV4dEZyb21MZWF2ZXMobm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dCA9IG5vZGUucGFyZW50O1xuICAgIGlmIChmKG5vZGUpKSB7XG4gICAgICBvcHRpbWl6ZU5leHRGcm9tTGVhdmVzKG5leHQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZU5leHRGcm9tTGVhdmVzO1xufVxuXG4vKipcbiAqIE1vdmUgcGFyc2Ugbm9kZXMgdXAgdG8gZm9ya3MuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlUGFyc2VVcChub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgY29uc3QgcGFyZW50ID0gbm9kZS5wYXJlbnQ7XG5cbiAgLy8gbW92ZSBwYXJzZSB1cCBieSBtZXJnaW5nIG9yIHN3YXBwaW5nXG4gIGlmIChub2RlIGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50Lm51bUNoaWxkcmVuKCkgPiAxKSB7XG4gICAgICAvLyBkb24ndCBtb3ZlIHBhcnNlIGZ1cnRoZXIgdXAgYnV0IGNvbnRpbnVlIHdpdGggcGFyZW50LlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIFBhcnNlTm9kZSkge1xuICAgICAgcGFyZW50Lm1lcmdlKG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb24ndCBzd2FwIHdpdGggbm9kZXMgdGhhdCBwcm9kdWNlIHNvbWV0aGluZyB0aGF0IHRoZSBwYXJzZSBub2RlIGRlcGVuZHMgb24gKGUuZy4gbG9va3VwKVxuICAgICAgaWYgKGhhc0ludGVyc2VjdGlvbihwYXJlbnQucHJvZHVjZWRGaWVsZHMoKSwgbm9kZS5kZXBlbmRlbnRGaWVsZHMoKSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuc3dhcFdpdGhQYXJlbnQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXBlYXRlZGx5IHJlbW92ZSBsZWFmIG5vZGVzIHRoYXQgYXJlIG5vdCBvdXRwdXQgb3IgZmFjZXQgbm9kZXMuXG4gKiBUaGUgcmVhc29uIGlzIHRoYXQgd2UgZG9uJ3QgbmVlZCBzdWJ0cmVlcyB0aGF0IGRvbid0IGhhdmUgYW55IG91dHB1dCBub2Rlcy5cbiAqIEZhY2V0IG5vZGVzIGFyZSBuZWVkZWQgZm9yIHRoZSByb3cgb3IgY29sdW1uIGRvbWFpbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVVbnVzZWRTdWJ0cmVlcyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlIHx8IG5vZGUubnVtQ2hpbGRyZW4oKSA+IDAgfHwgbm9kZSBpbnN0YW5jZW9mIEZhY2V0Tm9kZSkge1xuICAgIC8vIG5vIG5lZWQgdG8gY29udGludWUgd2l0aCBwYXJlbnQgYmVjYXVzZSBpdCBpcyBvdXRwdXQgbm9kZSBvciB3aWxsIGhhdmUgY2hpbGRyZW4gKHRoZXJlIHdhcyBhIGZvcmspXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG5vZGUucmVtb3ZlKCk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGUgdGltZSB1bml0IG5vZGVzIChhcyBkZXRlcm1pbmVkIGJ5IHRoZSBuYW1lIG9mIHRoZVxuICogb3V0cHV0IGZpZWxkKSB0aGF0IG1heSBiZSBnZW5lcmF0ZWQgZHVlIHRvIHNlbGVjdGlvbnMgcHJvamVjdGVkIG92ZXJcbiAqIHRpbWUgdW5pdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVUaW1lVW5pdHMobGVhZjogRGF0YUZsb3dOb2RlKSB7XG4gIGxldCBmaWVsZHMgPSB7fTtcbiAgcmV0dXJuIGl0ZXJhdGVGcm9tTGVhdmVzKChub2RlOiBEYXRhRmxvd05vZGUpID0+IHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFRpbWVVbml0Tm9kZSkge1xuICAgICAgY29uc3QgcGZpZWxkcyA9IG5vZGUucHJvZHVjZWRGaWVsZHMoKTtcbiAgICAgIGNvbnN0IGR1cGUgPSBrZXlzKHBmaWVsZHMpLmV2ZXJ5KChrKSA9PiAhIWZpZWxkc1trXSk7XG5cbiAgICAgIGlmIChkdXBlKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZHMgPSB7Li4uZmllbGRzLCAuLi5wZmllbGRzfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSkobGVhZik7XG59XG4iXX0=