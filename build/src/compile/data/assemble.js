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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWdCLFNBQVMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwRCxPQUFPLEVBQU8sSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBR3RDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBZSxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNsQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUN0QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDbEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN4QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFN0M7O0dBRUc7QUFDSCwyQkFBMkI7QUFD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QUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUN2QixDQUFDLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ3hEO1NBQ0Y7S0FDRjtJQUVELHVEQUF1RDtJQUN2RCxLQUFnQixVQUFJLEVBQUosYUFBSSxFQUFKLGtCQUFJLEVBQUosSUFBSTtRQUFmLElBQU0sQ0FBQyxhQUFBO1FBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtZQUN0QixDQUFDLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5saW5lRGF0YXNldCwgaXNVcmxEYXRhfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RGljdCwgdmFsc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuLyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0xvb2t1cE5vZGV9IGZyb20gJy4vbG9va3VwJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtTdGFja05vZGV9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtXaW5kb3dUcmFuc2Zvcm1Ob2RlfSBmcm9tICcuL3dpbmRvdyc7XG5cbi8qKlxuICogUHJpbnQgZGVidWcgaW5mb3JtYXRpb24gZm9yIGRhdGFmbG93IHRyZWUuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gZGVidWcobm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gIGNvbnNvbGUubG9nKGAkeyhub2RlLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0ke25vZGUuZGVidWdOYW1lID8gYCAoJHtub2RlLmRlYnVnTmFtZX0pYCA6ICcnfSAtPiAke1xuICAgIChub2RlLmNoaWxkcmVuLm1hcChjID0+IHtcbiAgICAgIHJldHVybiBgJHsoYy5jb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWV9JHtjLmRlYnVnTmFtZSA/IGAgKCR7Yy5kZWJ1Z05hbWV9KWAgOiAnJ31gO1xuICAgIH0pKVxuICB9YCk7XG4gIGNvbnNvbGUubG9nKG5vZGUpO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goZGVidWcpO1xufVxuXG5mdW5jdGlvbiBtYWtlV2Fsa1RyZWUoZGF0YTogVmdEYXRhW10pIHtcbiAgLy8gdG8gbmFtZSBkYXRhc291cmNlc1xuICBsZXQgZGF0YXNldEluZGV4ID0gMDtcblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgd2FsayBkb3duIHRoZSB0cmVlLlxuICAgKi9cbiAgZnVuY3Rpb24gd2Fsa1RyZWUobm9kZTogRGF0YUZsb3dOb2RlLCBkYXRhU291cmNlOiBWZ0RhdGEpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIC8vIElmIHRoZSBzb3VyY2UgaXMgYSBuYW1lZCBkYXRhIHNvdXJjZSBvciBhIGRhdGEgc291cmNlIHdpdGggdmFsdWVzLCB3ZSBuZWVkXG4gICAgICAvLyB0byBwdXQgaXQgaW4gYSBkaWZmZXJlbnQgZGF0YSBzb3VyY2UuIE90aGVyd2lzZSwgVmVnYSBtYXkgb3ZlcnJpZGUgdGhlIGRhdGEuXG4gICAgICBpZiAoIWlzVXJsRGF0YShub2RlLmRhdGEpKSB7XG4gICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0ge1xuICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgc291cmNlOiBkYXRhU291cmNlLm5hbWUsXG4gICAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgICAgICB9O1xuICAgICAgICBkYXRhU291cmNlID0gbmV3RGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFBhcnNlTm9kZSkge1xuICAgICAgaWYgKG5vZGUucGFyZW50IGluc3RhbmNlb2YgU291cmNlTm9kZSAmJiAhZGF0YVNvdXJjZS5zb3VyY2UpIHtcbiAgICAgICAgLy8gSWYgbm9kZSdzIHBhcmVudCBpcyBhIHJvb3Qgc291cmNlIGFuZCB0aGUgZGF0YSBzb3VyY2UgZG9lcyBub3QgcmVmZXIgdG8gYW5vdGhlciBkYXRhIHNvdXJjZSwgdXNlIG5vcm1hbCBmb3JtYXQgcGFyc2VcbiAgICAgICAgZGF0YVNvdXJjZS5mb3JtYXQgPSB7XG4gICAgICAgICAgLi4uZGF0YVNvdXJjZS5mb3JtYXQgfHwge30sXG4gICAgICAgICAgcGFyc2U6IG5vZGUuYXNzZW1ibGVGb3JtYXRQYXJzZSgpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UgdXNlIFZlZ2EgZXhwcmVzc2lvbiB0byBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlVHJhbnNmb3JtcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZhY2V0Tm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5hc3NlbWJsZSgpLmZvckVhY2goZCA9PiBkYXRhLnB1c2goZCkpO1xuXG4gICAgICAvLyBicmVhayBoZXJlIGJlY2F1c2UgdGhlIHJlc3Qgb2YgdGhlIHRyZWUgaGFzIHRvIGJlIHRha2VuIGNhcmUgb2YgYnkgdGhlIGZhY2V0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVyTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIENhbGN1bGF0ZU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBHZW9Qb2ludE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBHZW9KU09OTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBMb29rdXBOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIElkZW50aWZpZXJOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybS5wdXNoKG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGaWx0ZXJJbnZhbGlkTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEJpbk5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBUaW1lVW5pdE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBTdGFja05vZGUpIHtcbiAgICAgIGRhdGFTb3VyY2UudHJhbnNmb3JtID0gZGF0YVNvdXJjZS50cmFuc2Zvcm0uY29uY2F0KG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICBpZiAoZGF0YVNvdXJjZS5zb3VyY2UgJiYgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2Uuc291cmNlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCBhbiBvdXRwdXQgbm9kZSBtYXkgYmUgcmVxdWlyZWQgYnV0IHdlIHN0aWxsIGRvIG5vdCBhc3NlbWJsZSBhXG4gICAgICAgIC8vIHNlcGFyYXRlIGRhdGEgc291cmNlIGZvciBpdC5cbiAgICAgICAgbm9kZS5zZXRTb3VyY2UoZGF0YVNvdXJjZS5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5uYW1lKSB7XG4gICAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBzZXQgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2Ugd2UgZ2VuZXJhdGVkLiBGcm9tIG5vdyBvblxuICAgICAgICAvLyBvdGhlciBhc3NlbWJsZXJzIGNhbiB1c2UgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG5cbiAgICAgICAgLy8gaWYgdGhpcyBub2RlIGhhcyBtb3JlIHRoYW4gb25lIGNoaWxkLCB3ZSB3aWxsIGFkZCBhIGRhdGFzb3VyY2UgYXV0b21hdGljYWxseVxuICAgICAgICBpZiAobm9kZS5udW1DaGlsZHJlbigpID09PSAxKSB7XG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChub2RlLm51bUNoaWxkcmVuKCkpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgLy8gZG9uZVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgJiYgKCFkYXRhU291cmNlLnNvdXJjZSB8fCBkYXRhU291cmNlLnRyYW5zZm9ybS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgIC8vIGRvIG5vdCBwdXNoIGVtcHR5IGRhdGFzb3VyY2VzIHRoYXQgYXJlIHNpbXBseSByZWZlcmVuY2VzXG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB3YWxrVHJlZShub2RlLmNoaWxkcmVuWzBdLCBkYXRhU291cmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzb3VyY2UgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3VyY2UgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0ge1xuICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgd2Fsa1RyZWUoY2hpbGQsIG5ld0RhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdhbGtUcmVlO1xufVxuXG4vKipcbiAqIEFzc2VtYmxlIGRhdGEgc291cmNlcyB0aGF0IGFyZSBkZXJpdmVkIGZyb20gZmFjZXRlZCBkYXRhLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVGYWNldERhdGEocm9vdDogRmFjZXROb2RlKTogVmdEYXRhW10ge1xuICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuICBjb25zdCB3YWxrVHJlZSA9IG1ha2VXYWxrVHJlZShkYXRhKTtcblxuICByb290LmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gd2Fsa1RyZWUoY2hpbGQsIHtcbiAgICBzb3VyY2U6IHJvb3QubmFtZSxcbiAgICBuYW1lOiBudWxsLFxuICAgIHRyYW5zZm9ybTogW11cbiAgfSkpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIENyZWF0ZSBWZWdhIERhdGEgYXJyYXkgZnJvbSBhIGdpdmVuIGNvbXBpbGVkIG1vZGVsIGFuZCBhcHBlbmQgYWxsIG9mIHRoZW0gdG8gdGhlIGdpdmVuIGFycmF5XG4gKlxuICogQHBhcmFtICBtb2RlbFxuICogQHBhcmFtICBkYXRhIGFycmF5XG4gKiBAcmV0dXJuIG1vZGlmaWVkIGRhdGEgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUm9vdERhdGEoZGF0YUNvbXBvbmVudDogRGF0YUNvbXBvbmVudCwgZGF0YXNldHM6IERpY3Q8SW5saW5lRGF0YXNldD4pOiBWZ0RhdGFbXSB7XG4gIGNvbnN0IHJvb3RzOiBTb3VyY2VOb2RlW10gPSB2YWxzKGRhdGFDb21wb25lbnQuc291cmNlcyk7XG4gIGNvbnN0IGRhdGE6IFZnRGF0YVtdID0gW107XG5cbiAgLy8gcm9vdHMuZm9yRWFjaChkZWJ1Zyk7XG5cbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgbGV0IHNvdXJjZUluZGV4ID0gMDtcblxuICByb290cy5mb3JFYWNoKHJvb3QgPT4ge1xuICAgIC8vIGFzc2lnbiBhIG5hbWUgaWYgdGhlIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgbmFtZSB5ZXRcbiAgICBpZiAoIXJvb3QuaGFzTmFtZSgpKSB7XG4gICAgICByb290LmRhdGFOYW1lID0gYHNvdXJjZV8ke3NvdXJjZUluZGV4Kyt9YDtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSByb290LmFzc2VtYmxlKCk7XG5cbiAgICB3YWxrVHJlZShyb290LCBuZXdEYXRhKTtcbiAgfSk7XG5cbiAgLy8gcmVtb3ZlIGVtcHR5IHRyYW5zZm9ybSBhcnJheXMgZm9yIGNsZWFuZXIgb3V0cHV0XG4gIGRhdGEuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoZC50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWxldGUgZC50cmFuc2Zvcm07XG4gICAgfVxuICB9KTtcblxuICAvLyBtb3ZlIHNvdXJjZXMgd2l0aG91dCB0cmFuc2Zvcm1zICh0aGUgb25lcyB0aGF0IGFyZSBwb3RlbnRpYWxseSB1c2VkIGluIGxvb2t1cHMpIHRvIHRoZSBiZWdpbm5pbmdcbiAgbGV0IHdoZXJlVG8gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkID0gZGF0YVtpXTtcbiAgICBpZiAoKGQudHJhbnNmb3JtIHx8IFtdKS5sZW5ndGggPT09IDAgJiYgIWQuc291cmNlKSB7XG4gICAgICBkYXRhLnNwbGljZSh3aGVyZVRvKyssIDAsIGRhdGEuc3BsaWNlKGksIDEpWzBdKTtcbiAgICB9XG4gIH1cblxuICAvLyBub3cgZml4IHRoZSBmcm9tIHJlZmVyZW5jZXMgaW4gbG9va3VwIHRyYW5zZm9ybXNcbiAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICBmb3IgKGNvbnN0IHQgb2YgZC50cmFuc2Zvcm0gfHwgW10pIHtcbiAgICAgIGlmICh0LnR5cGUgPT09ICdsb29rdXAnKSB7XG4gICAgICAgIHQuZnJvbSA9IGRhdGFDb21wb25lbnQub3V0cHV0Tm9kZXNbdC5mcm9tXS5nZXRTb3VyY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBpbmxpbmUgdmFsdWVzIGZvciBkYXRhc2V0cyB0aGF0IGFyZSBpbiB0aGUgZGF0YXN0b3JlXG4gIGZvciAoY29uc3QgZCBvZiBkYXRhKSB7XG4gICAgaWYgKGQubmFtZSBpbiBkYXRhc2V0cykge1xuICAgICAgZC52YWx1ZXMgPSBkYXRhc2V0c1tkLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuIl19