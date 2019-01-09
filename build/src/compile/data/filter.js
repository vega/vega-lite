import { duplicate } from '../../util';
import { expression } from '../predicate';
import { DataFlowNode } from './dataflow';
import { getDependentFields } from './expressions';
export class FilterNode extends DataFlowNode {
    constructor(parent, model, filter) {
        super(parent);
        this.model = model;
        this.filter = filter;
        // TODO: refactor this to not take a node and
        // then add a static function makeFromOperand and make the constructor take only an expression
        this.expr = expression(this.model, this.filter, this);
        this._dependentFields = getDependentFields(this.expr);
    }
    clone() {
        return new FilterNode(null, this.model, duplicate(this.filter));
    }
    dependentFields() {
        return this._dependentFields;
    }
    assemble() {
        return {
            type: 'filter',
            expr: this.expr
        };
    }
    hash() {
        return `Filter ${this.expr}`;
    }
}
//# sourceMappingURL=filter.js.map