import { SingleDefUnitChannel } from '../../../channel';
import { TimeUnitNode } from '../../data/timeunit';
import { TransformCompiler } from './transforms';
export declare const TUPLE_FIELDS = "_tuple_fields";
/**
 * Do the selection tuples hold enumerated or ranged values for a field?
 * Ranged values can be left-right inclusive (R) or left-inclusive, right-exclusive (R-LE).
 */
export declare type TupleStoreType = 'E' | 'R' | 'R-RE';
export interface SelectionProjection {
    type: TupleStoreType;
    field: string;
    channel?: SingleDefUnitChannel;
    signals?: {
        data?: string;
        visual?: string;
    };
}
export declare class SelectionProjectionComponent {
    has: {
        [key in SingleDefUnitChannel]?: SelectionProjection;
    };
    timeUnit?: TimeUnitNode;
    items: SelectionProjection[];
    constructor(...items: SelectionProjection[]);
}
declare const project: TransformCompiler;
export default project;
//# sourceMappingURL=project.d.ts.map