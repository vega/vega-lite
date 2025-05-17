import {parseExpression} from 'vega-expression';
function getName(node) {
  const name = [];
  if (node.type === 'Identifier') {
    return [node.name];
  }
  if (node.type === 'Literal') {
    return [node.value];
  }
  if (node.type === 'MemberExpression') {
    name.push(...getName(node.object));
    name.push(...getName(node.property));
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
  const ast = parseExpression(expression);
  const dependents = new Set();
  // visit is missing in types https://github.com/vega/vega/issues/3298
  ast.visit((node) => {
    if (node.type === 'MemberExpression' && startsWithDatum(node)) {
      dependents.add(getName(node).slice(1).join('.'));
    }
  });
  return dependents;
}
//# sourceMappingURL=expressions.js.map
