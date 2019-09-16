import { SelectionComponent } from '.';
import { LogicalOperand } from '../../logical';
import { SelectionDef } from '../../selection';
import { Dict } from '../../util';
import { DataFlowNode } from '../data/dataflow';
import { Model } from '../model';
import { UnitModel } from '../unit';
export declare function parseUnitSelection(model: UnitModel, selDefs: Dict<SelectionDef>): Dict<SelectionComponent<any>>;
export declare function parseSelectionPredicate(model: Model, selections: LogicalOperand<string>, dfnode?: DataFlowNode): string;
//# sourceMappingURL=parse.d.ts.map