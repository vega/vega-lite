import { SelectionComponent } from '.';
import { SelectionParameter, ParameterExtent } from '../../selection';
import { Dict } from '../../util';
import { DataFlowNode, OutputNode } from '../data/dataflow';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { ParameterPredicate } from '../../predicate';
export declare function parseUnitSelection(model: UnitModel, selDefs: SelectionParameter[]): Dict<SelectionComponent<any>>;
export declare function parseSelectionPredicate(model: Model, pred: ParameterPredicate, dfnode?: DataFlowNode, datum?: string): string;
export declare function parseSelectionExtent(model: Model, name: string, extent: ParameterExtent): string;
export declare function materializeSelections(model: UnitModel, main: OutputNode): void;
//# sourceMappingURL=parse.d.ts.map