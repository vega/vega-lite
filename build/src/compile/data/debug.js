import { entries, keys, uniqueId } from './../../util';
/**
 * Print debug information for dataflow tree.
 */
export function debug(node) {
    console.log("" + node.constructor.name + (node.debugName ? "(" + node.debugName + ")" : '') + " -> " + node.children.map(function (c) {
        return "" + c.constructor.name + (c.debugName ? " (" + c.debugName + ")" : '');
    }));
    console.log(node);
    node.children.forEach(debug);
}
/**
 * Print the dataflow tree as graphviz.
 *
 * Render the output in http://viz-js.com/.
 */
export function draw(roots) {
    // check the graph before printing it since the logic below assumes a consistent graph
    checkLinks(roots);
    var nodes = {};
    var edges = [];
    function getId(node) {
        var id = node['__uniqueid'];
        if (id === undefined) {
            id = uniqueId();
            node['__uniqueid'] = id;
        }
        return id;
    }
    function getLabel(node) {
        var out = [node.constructor.name.slice(0, -4)];
        if (node.debugName) {
            out.push("<i>" + node.debugName + "</i>");
        }
        var dep = node.dependentFields();
        if (keys(dep).length) {
            out.push("<font color=\"grey\" point-size=\"10\">IN:</font> " + keys(node.dependentFields()).join(', '));
        }
        var prod = node.producedFields();
        if (keys(prod).length) {
            out.push("<font color=\"grey\" point-size=\"10\">OUT:</font> " + keys(node.producedFields()).join(', '));
        }
        return out.join('<br/>');
    }
    function collector(node) {
        var id = getId(node);
        nodes[id] = {
            id: id,
            label: getLabel(node),
            hash: String(node.hash()).replace(/"/g, '')
        };
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            edges.push([id, getId(child)]);
            collector(child);
        }
    }
    roots.forEach(function (n) { return collector(n); });
    var dot = "digraph DataFlow {\n  rankdir = TB;\n  node [shape=record]\n  " + entries(nodes)
        .map(function (_a) {
        var key = _a.key, value = _a.value;
        return "  \"" + key + "\" [\n    label = <" + value.label + ">;\n    tooltip = \"[" + value.id + "]&#010;" + value.hash + "\"\n  ]";
    })
        .join('\n') + "\n\n  " + edges.map(function (_a) {
        var source = _a[0], target = _a[1];
        return "\"" + source + "\" -> \"" + target + "\"";
    }).join(' ') + "\n}";
    console.log(dot);
    return dot;
}
/**
 * Iterates over a dataflow graph and checks whether all links are consistent.
 */
export function checkLinks(nodes) {
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        for (var _a = 0, _b = node.children; _a < _b.length; _a++) {
            var child = _b[_a];
            if (child.parent !== node) {
                console.error('Dataflow graph is inconsistent.', parent, child);
                return false;
            }
        }
        if (!checkLinks(node.children)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=debug.js.map