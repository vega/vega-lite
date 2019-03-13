import { SingleDefChannel } from '../../../channel';
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
    channel?: SingleDefChannel;
    signals?: {
        data?: string;
        visual?: string;
    };
}
export declare class SelectionProjectionComponent extends Array<SelectionProjection> {
    has: {
        [key in SingleDefChannel]?: SelectionProjection;
    };
    timeUnit?: TimeUnitNode;
    constructor(...items: SelectionProjection[]);
}
declare const project: TransformCompiler;
export default project;
