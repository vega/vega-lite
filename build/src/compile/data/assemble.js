import * as tslib_1 from "tslib";
import { isUrlData } from '../../data';
import { vals } from '../../util';
import { AggregateNode } from './aggregate';
import { BinNode } from './bin';
import { CalculateNode } from './calculate';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { FilterNode } from './filter';
import { FilterInvalidNode } from './filterinvalid';
import { ParseNode } from './formatparse';
import { GeoJSONNode } from './geojson';
import { GeoPointNode } from './geopoint';
import { IdentifierNode } from './indentifier';
import { LookupNode } from './lookup';
import { SourceNode } from './source';
import { StackNode } from './stack';
import { TimeUnitNode } from './timeunit';
import { WindowTransformNode } from './window';
/**
 * Print debug information for dataflow tree.
 */
// tslint:disable-next-line
function debug(node) {
    console.log("" + node.constructor.name + (node.debugName ? " (" + node.debugName + ")" : '') + " -> " + (node.children.map(function (c) {
        return "" + c.constructor.name + (c.debugName ? " (" + c.debugName + ")" : '');
    })));
    console.log(node);
    node.children.forEach(debug);
}
function makeWalkTree(data) {
    // to name datasources
    var datasetIndex = 0;
    /**
     * Recursively walk down the tree.
     */
    function walkTree(node, dataSource) {
        if (node instanceof SourceNode) {
            // If the source is a named data source or a data source with values, we need
            // to put it in a different data source. Otherwise, Vega may override the data.
            if (!isUrlData(node.data)) {
                data.push(dataSource);
                var newData = {
                    name: null,
                    source: dataSource.name,
                    transform: []
                };
                dataSource = newData;
            }
        }
        if (node instanceof ParseNode) {
            if (node.parent instanceof SourceNode && !dataSource.source) {
                // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
                dataSource.format = tslib_1.__assign({}, dataSource.format || {}, { parse: node.assembleFormatParse() });
                // add calculates for all nested fields
                dataSource.transform = dataSource.transform.concat(node.assembleTransforms(true));
            }
            else {
                // Otherwise use Vega expression to parse
                dataSource.transform = dataSource.transform.concat(node.assembleTransforms());
            }
        }
        if (node instanceof FacetNode) {
            if (!dataSource.name) {
                dataSource.name = "data_" + datasetIndex++;
            }
            if (!dataSource.source || dataSource.transform.length > 0) {
                data.push(dataSource);
                node.data = dataSource.name;
            }
            else {
                node.data = dataSource.source;
            }
            node.assemble().forEach(function (d) { return data.push(d); });
            // break here because the rest of the tree has to be taken care of by the facet.
            return;
        }
        if (node instanceof FilterNode ||
            node instanceof CalculateNode ||
            node instanceof GeoPointNode ||
            node instanceof GeoJSONNode ||
            node instanceof AggregateNode ||
            node instanceof LookupNode ||
            node instanceof WindowTransformNode ||
            node instanceof IdentifierNode) {
            dataSource.transform.push(node.assemble());
        }
        if (node instanceof FilterInvalidNode ||
            node instanceof BinNode ||
            node instanceof TimeUnitNode ||
            node instanceof StackNode) {
            dataSource.transform = dataSource.transform.concat(node.assemble());
        }
        if (node instanceof AggregateNode) {
            if (!dataSource.name) {
                dataSource.name = "data_" + datasetIndex++;
            }
        }
        if (node instanceof OutputNode) {
            if (dataSource.source && dataSource.transform.length === 0) {
                node.setSource(dataSource.source);
            }
            else if (node.parent instanceof OutputNode) {
                // Note that an output node may be required but we still do not assemble a
                // separate data source for it.
                node.setSource(dataSource.name);
            }
            else {
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }
                // Here we set the name of the datasource we generated. From now on
                // other assemblers can use it.
                node.setSource(dataSource.name);
                // if this node has more than one child, we will add a datasource automatically
                if (node.numChildren() === 1) {
                    data.push(dataSource);
                    var newData = {
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
                if (node instanceof OutputNode && (!dataSource.source || dataSource.transform.length > 0)) {
                    // do not push empty datasources that are simply references
                    data.push(dataSource);
                }
                break;
            case 1:
                walkTree(node.children[0], dataSource);
                break;
            default:
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }
                var source_1 = dataSource.name;
                if (!dataSource.source || dataSource.transform.length > 0) {
                    data.push(dataSource);
                }
                else {
                    source_1 = dataSource.source;
                }
                node.children.forEach(function (child) {
                    var newData = {
                        name: null,
                        source: source_1,
                        transform: []
                    };
                    walkTree(child, newData);
                });
                break;
        }
    }
    return walkTree;
}
/**
 * Assemble data sources that are derived from faceted data.
 */
export function assembleFacetData(root) {
    var data = [];
    var walkTree = makeWalkTree(data);
    root.children.forEach(function (child) { return walkTree(child, {
        source: root.name,
        name: null,
        transform: []
    }); });
    return data;
}
/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleRootData(dataComponent, datasets) {
    var roots = vals(dataComponent.sources);
    var data = [];
    // roots.forEach(debug);
    var walkTree = makeWalkTree(data);
    var sourceIndex = 0;
    roots.forEach(function (root) {
        // assign a name if the source does not have a name yet
        if (!root.hasName()) {
            root.dataName = "source_" + sourceIndex++;
        }
        var newData = root.assemble();
        walkTree(root, newData);
    });
    // remove empty transform arrays for cleaner output
    data.forEach(function (d) {
        if (d.transform.length === 0) {
            delete d.transform;
        }
    });
    // move sources without transforms (the ones that are potentially used in lookups) to the beginning
    var whereTo = 0;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if ((d.transform || []).length === 0 && !d.source) {
            data.splice(whereTo++, 0, data.splice(i, 1)[0]);
        }
    }
    // now fix the from references in lookup transforms
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var d = data_1[_i];
        for (var _a = 0, _b = d.transform || []; _a < _b.length; _a++) {
            var t = _b[_a];
            if (t.type === 'lookup') {
                t.from = dataComponent.outputNodes[t.from].getSource();
            }
        }
    }
    // inline values for datasets that are in the datastore
    for (var _c = 0, data_2 = data; _c < data_2.length; _c++) {
        var d = data_2[_c];
        if (d.name in datasets) {
            d.values = datasets[d.name];
        }
    }
    return data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwRCxPQUFPLEVBQU8sSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3RDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBZSxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNsQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN0QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDbEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN4QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFN0M7O0dBRUc7QUFDSCwyQkFBMkI7QUFD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QUFDLGFBQUE7UUFDVixLQUFnQixVQUFpQixFQUFqQixLQUFBLENBQUMsQ0FBQyxTQUFTLElBQUksRUFBRSxFQUFqQixjQUFpQixFQUFqQixJQUFpQjtZQUE1QixJQUFNLENBQUMsU0FBQTtZQUNWLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQ3ZCLENBQUMsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDeEQ7U0FDRjtLQUNGO0lBRUQsdURBQXVEO0lBQ3ZELEtBQWdCLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJO1FBQWYsSUFBTSxDQUFDLGFBQUE7UUFDVixJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO1lBQ3RCLENBQUMsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtLQUNGO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmxpbmVEYXRhc2V0LCBpc1VybERhdGF9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEaWN0LCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtCaW5Ob2RlfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NhbGN1bGF0ZU5vZGV9IGZyb20gJy4vY2FsY3VsYXRlJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlLCBPdXRwdXROb2RlfSBmcm9tICcuL2RhdGFmbG93JztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7RmlsdGVyTm9kZX0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHtGaWx0ZXJJbnZhbGlkTm9kZX0gZnJvbSAnLi9maWx0ZXJpbnZhbGlkJztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4vZ2VvanNvbic7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi9nZW9wb2ludCc7XG5pbXBvcnQge0lkZW50aWZpZXJOb2RlfSBmcm9tICcuL2luZGVudGlmaWVyJztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi9sb29rdXAnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQge1N0YWNrTm9kZX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4vd2luZG93JztcblxuLyoqXG4gKiBQcmludCBkZWJ1ZyBpbmZvcm1hdGlvbiBmb3IgZGF0YWZsb3cgdHJlZS5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBkZWJ1Zyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgY29uc29sZS5sb2coYCR7KG5vZGUuY29uc3RydWN0b3IgYXMgYW55KS5uYW1lfSR7bm9kZS5kZWJ1Z05hbWUgPyBgICgke25vZGUuZGVidWdOYW1lfSlgIDogJyd9IC0+ICR7XG4gICAgKG5vZGUuY2hpbGRyZW4ubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIGAkeyhjLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0ke2MuZGVidWdOYW1lID8gYCAoJHtjLmRlYnVnTmFtZX0pYCA6ICcnfWA7XG4gICAgfSkpXG4gIH1gKTtcbiAgY29uc29sZS5sb2cobm9kZSk7XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChkZWJ1Zyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VXYWxrVHJlZShkYXRhOiBWZ0RhdGFbXSkge1xuICAvLyB0byBuYW1lIGRhdGFzb3VyY2VzXG4gIGxldCBkYXRhc2V0SW5kZXggPSAwO1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSB3YWxrIGRvd24gdGhlIHRyZWUuXG4gICAqL1xuICBmdW5jdGlvbiB3YWxrVHJlZShub2RlOiBEYXRhRmxvd05vZGUsIGRhdGFTb3VyY2U6IFZnRGF0YSkge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBpcyBhIG5hbWVkIGRhdGEgc291cmNlIG9yIGEgZGF0YSBzb3VyY2Ugd2l0aCB2YWx1ZXMsIHdlIG5lZWRcbiAgICAgIC8vIHRvIHB1dCBpdCBpbiBhIGRpZmZlcmVudCBkYXRhIHNvdXJjZS4gT3RoZXJ3aXNlLCBWZWdhIG1heSBvdmVycmlkZSB0aGUgZGF0YS5cbiAgICAgIGlmICghaXNVcmxEYXRhKG5vZGUuZGF0YSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgIH07XG4gICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBTb3VyY2VOb2RlICYmICFkYXRhU291cmNlLnNvdXJjZSkge1xuICAgICAgICAvLyBJZiBub2RlJ3MgcGFyZW50IGlzIGEgcm9vdCBzb3VyY2UgYW5kIHRoZSBkYXRhIHNvdXJjZSBkb2VzIG5vdCByZWZlciB0byBhbm90aGVyIGRhdGEgc291cmNlLCB1c2Ugbm9ybWFsIGZvcm1hdCBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLmZvcm1hdCA9IHtcbiAgICAgICAgICAuLi5kYXRhU291cmNlLmZvcm1hdCB8fCB7fSxcbiAgICAgICAgICBwYXJzZTogbm9kZS5hc3NlbWJsZUZvcm1hdFBhcnNlKClcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBhZGQgY2FsY3VsYXRlcyBmb3IgYWxsIG5lc3RlZCBmaWVsZHNcbiAgICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0gPSBkYXRhU291cmNlLnRyYW5zZm9ybS5jb25jYXQobm9kZS5hc3NlbWJsZVRyYW5zZm9ybXModHJ1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHVzZSBWZWdhIGV4cHJlc3Npb24gdG8gcGFyc2VcbiAgICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0gPSBkYXRhU291cmNlLnRyYW5zZm9ybS5jb25jYXQobm9kZS5hc3NlbWJsZVRyYW5zZm9ybXMoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGYWNldE5vZGUpIHtcbiAgICAgIGlmICghZGF0YVNvdXJjZS5uYW1lKSB7XG4gICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhU291cmNlLnNvdXJjZSB8fCBkYXRhU291cmNlLnRyYW5zZm9ybS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgbm9kZS5kYXRhID0gZGF0YVNvdXJjZS5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5kYXRhID0gZGF0YVNvdXJjZS5zb3VyY2U7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuYXNzZW1ibGUoKS5mb3JFYWNoKGQgPT4gZGF0YS5wdXNoKGQpKTtcblxuICAgICAgLy8gYnJlYWsgaGVyZSBiZWNhdXNlIHRoZSByZXN0IG9mIHRoZSB0cmVlIGhhcyB0byBiZSB0YWtlbiBjYXJlIG9mIGJ5IHRoZSBmYWNldC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZpbHRlck5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBDYWxjdWxhdGVOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgR2VvUG9pbnROb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgR2VvSlNPTk5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgTG9va3VwTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBJZGVudGlmaWVyTm9kZSkge1xuICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0ucHVzaChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVySW52YWxpZE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBCaW5Ob2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgVGltZVVuaXROb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgU3RhY2tOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgaWYgKGRhdGFTb3VyY2Uuc291cmNlICYmIGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLnNvdXJjZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50IGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgYW4gb3V0cHV0IG5vZGUgbWF5IGJlIHJlcXVpcmVkIGJ1dCB3ZSBzdGlsbCBkbyBub3QgYXNzZW1ibGUgYVxuICAgICAgICAvLyBzZXBhcmF0ZSBkYXRhIHNvdXJjZSBmb3IgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhlcmUgd2Ugc2V0IHRoZSBuYW1lIG9mIHRoZSBkYXRhc291cmNlIHdlIGdlbmVyYXRlZC4gRnJvbSBub3cgb25cbiAgICAgICAgLy8gb3RoZXIgYXNzZW1ibGVycyBjYW4gdXNlIGl0LlxuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLm5hbWUpO1xuXG4gICAgICAgIC8vIGlmIHRoaXMgbm9kZSBoYXMgbW9yZSB0aGFuIG9uZSBjaGlsZCwgd2Ugd2lsbCBhZGQgYSBkYXRhc291cmNlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgaWYgKG5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gMSkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBkYXRhU291cmNlLm5hbWUsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBkYXRhU291cmNlID0gbmV3RGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAobm9kZS5udW1DaGlsZHJlbigpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8vIGRvbmVcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlICYmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAvLyBkbyBub3QgcHVzaCBlbXB0eSBkYXRhc291cmNlcyB0aGF0IGFyZSBzaW1wbHkgcmVmZXJlbmNlc1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgd2Fsa1RyZWUobm9kZS5jaGlsZHJlblswXSwgZGF0YVNvdXJjZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc291cmNlID0gZGF0YVNvdXJjZS5uYW1lO1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRhLnB1c2goZGF0YVNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlID0gZGF0YVNvdXJjZS5zb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHdhbGtUcmVlKGNoaWxkLCBuZXdEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3YWxrVHJlZTtcbn1cblxuLyoqXG4gKiBBc3NlbWJsZSBkYXRhIHNvdXJjZXMgdGhhdCBhcmUgZGVyaXZlZCBmcm9tIGZhY2V0ZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlRmFjZXREYXRhKHJvb3Q6IEZhY2V0Tm9kZSk6IFZnRGF0YVtdIHtcbiAgY29uc3QgZGF0YTogVmdEYXRhW10gPSBbXTtcbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgcm9vdC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHdhbGtUcmVlKGNoaWxkLCB7XG4gICAgc291cmNlOiByb290Lm5hbWUsXG4gICAgbmFtZTogbnVsbCxcbiAgICB0cmFuc2Zvcm06IFtdXG4gIH0pKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgVmVnYSBEYXRhIGFycmF5IGZyb20gYSBnaXZlbiBjb21waWxlZCBtb2RlbCBhbmQgYXBwZW5kIGFsbCBvZiB0aGVtIHRvIHRoZSBnaXZlbiBhcnJheVxuICpcbiAqIEBwYXJhbSAgbW9kZWxcbiAqIEBwYXJhbSAgZGF0YSBhcnJheVxuICogQHJldHVybiBtb2RpZmllZCBkYXRhIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVJvb3REYXRhKGRhdGFDb21wb25lbnQ6IERhdGFDb21wb25lbnQsIGRhdGFzZXRzOiBEaWN0PElubGluZURhdGFzZXQ+KTogVmdEYXRhW10ge1xuICBjb25zdCByb290czogU291cmNlTm9kZVtdID0gdmFscyhkYXRhQ29tcG9uZW50LnNvdXJjZXMpO1xuICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuXG4gIC8vIHJvb3RzLmZvckVhY2goZGVidWcpO1xuXG4gIGNvbnN0IHdhbGtUcmVlID0gbWFrZVdhbGtUcmVlKGRhdGEpO1xuXG4gIGxldCBzb3VyY2VJbmRleCA9IDA7XG5cbiAgcm9vdHMuZm9yRWFjaChyb290ID0+IHtcbiAgICAvLyBhc3NpZ24gYSBuYW1lIGlmIHRoZSBzb3VyY2UgZG9lcyBub3QgaGF2ZSBhIG5hbWUgeWV0XG4gICAgaWYgKCFyb290Lmhhc05hbWUoKSkge1xuICAgICAgcm9vdC5kYXRhTmFtZSA9IGBzb3VyY2VfJHtzb3VyY2VJbmRleCsrfWA7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0gcm9vdC5hc3NlbWJsZSgpO1xuXG4gICAgd2Fsa1RyZWUocm9vdCwgbmV3RGF0YSk7XG4gIH0pO1xuXG4gIC8vIHJlbW92ZSBlbXB0eSB0cmFuc2Zvcm0gYXJyYXlzIGZvciBjbGVhbmVyIG91dHB1dFxuICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgaWYgKGQudHJhbnNmb3JtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVsZXRlIGQudHJhbnNmb3JtO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gbW92ZSBzb3VyY2VzIHdpdGhvdXQgdHJhbnNmb3JtcyAodGhlIG9uZXMgdGhhdCBhcmUgcG90ZW50aWFsbHkgdXNlZCBpbiBsb29rdXBzKSB0byB0aGUgYmVnaW5uaW5nXG4gIGxldCB3aGVyZVRvID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZCA9IGRhdGFbaV07XG4gICAgaWYgKChkLnRyYW5zZm9ybSB8fCBbXSkubGVuZ3RoID09PSAwICYmICFkLnNvdXJjZSkge1xuICAgICAgZGF0YS5zcGxpY2Uod2hlcmVUbysrLCAwLCBkYXRhLnNwbGljZShpLCAxKVswXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IGZpeCB0aGUgZnJvbSByZWZlcmVuY2VzIGluIGxvb2t1cCB0cmFuc2Zvcm1zXG4gIGZvciAoY29uc3QgZCBvZiBkYXRhKSB7XG4gICAgZm9yIChjb25zdCB0IG9mIGQudHJhbnNmb3JtIHx8IFtdKSB7XG4gICAgICBpZiAodC50eXBlID09PSAnbG9va3VwJykge1xuICAgICAgICB0LmZyb20gPSBkYXRhQ29tcG9uZW50Lm91dHB1dE5vZGVzW3QuZnJvbV0uZ2V0U291cmNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gaW5saW5lIHZhbHVlcyBmb3IgZGF0YXNldHMgdGhhdCBhcmUgaW4gdGhlIGRhdGFzdG9yZVxuICBmb3IgKGNvbnN0IGQgb2YgZGF0YSkge1xuICAgIGlmIChkLm5hbWUgaW4gZGF0YXNldHMpIHtcbiAgICAgIGQudmFsdWVzID0gZGF0YXNldHNbZC5uYW1lXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cbiJdfQ==