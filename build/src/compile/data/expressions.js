import { parse } from 'vega-expression';
function getName(node) {
    var name = [];
    if (node.type === 'Identifier') {
        return [node.name];
    }
    if (node.type === 'Literal') {
        return [node.value];
    }
    if (node.type === 'MemberExpression') {
        name = name.concat(getName(node.object));
        name = name.concat(getName(node.property));
    }
    return name;
}
function startsWithDatum(node) {
    if (node.object.type === 'MemberExpression') {
        return startsWithDatum(node.object);
    }
    return node.object.name === 'datum';
}
export function getDependentFields(expression) {
    var ast = parse(expression);
    var dependents = {};
    ast.visit(function (node) {
        if (node.type === 'MemberExpression' && startsWithDatum(node)) {
            dependents[getName(node)
                .slice(1)
                .join('.')] = true;
        }
    });
    return dependents;
}
//# sourceMappingURL=expressions.js.map