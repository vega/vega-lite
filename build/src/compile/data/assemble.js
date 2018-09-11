import * as tslib_1 from "tslib";
import { isUrlData } from '../../data';
import { vals } from '../../util';
import { AggregateNode } from './aggregate';
import { BinNode } from './bin';
import { CalculateNode } from './calculate';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { FilterNode } from './filter';
import { FlattenTransformNode } from './flatten';
import { FoldTransformNode } from './fold';
import { ParseNode } from './formatparse';
import { GeoJSONNode } from './geojson';
import { GeoPointNode } from './geopoint';
import { IdentifierNode } from './identifier';
import { ImputeNode } from './impute';
import { LookupNode } from './lookup';
import { SampleTransformNode } from './sample';
import { SourceNode } from './source';
import { StackNode } from './stack';
import { TimeUnitNode } from './timeunit';
import { WindowTransformNode } from './window';
/**
 * Print debug information for dataflow tree.
 */
// tslint:disable-next-line
export function debug(node) {
    console.log("" + node.constructor.name + (node.debugName ? " (" + node.debugName + ")" : '') + " -> " + node.children.map(function (c) {
        return "" + c.constructor.name + (c.debugName ? " (" + c.debugName + ")" : '');
    }));
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
                dataSource.format = tslib_1.__assign({}, (dataSource.format || {}), { parse: node.assembleFormatParse() });
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
            node instanceof FoldTransformNode ||
            node instanceof FlattenTransformNode ||
            node instanceof IdentifierNode ||
            node instanceof SampleTransformNode) {
            dataSource.transform.push(node.assemble());
        }
        if (node instanceof BinNode ||
            node instanceof TimeUnitNode ||
            node instanceof ImputeNode ||
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
    root.children.forEach(function (child) {
        return walkTree(child, {
            source: root.name,
            name: null,
            transform: []
        });
    });
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
//# sourceMappingURL=assemble.js.map