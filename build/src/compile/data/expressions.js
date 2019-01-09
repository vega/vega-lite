import { parse } from 'vega-expression';
function getName(node) {
    let name = [];
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
    const ast = parse(expression);
    const dependents = new Set();
    ast.visit((node) => {
        if (node.type === 'MemberExpression' && startsWithDatum(node)) {
            dependents.add(getName(node)
                .slice(1)
                .join('.'));
        }
    });
    return dependents;
}
//# sourceMappingURL=expressions.js.map