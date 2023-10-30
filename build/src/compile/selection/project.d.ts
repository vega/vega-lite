import { GeoPositionChannel, SingleDefUnitChannel } from '../../channel';
import { TimeUnitNode } from '../data/timeunit';
import { SelectionCompiler } from '.';
export declare const TUPLE_FIELDS = "_tuple_fields";
/**
 * Whether the selection tuples hold enumerated or ranged values for a field.
 */
export type TupleStoreType = 'E' | 'R' | 'R-RE';
export interface SelectionProjection {
    type: TupleStoreType;
    field: string;
    index: number;
    channel?: SingleDefUnitChannel;
    geoChannel?: GeoPositionChannel;
    signals?: {
        data?: string;
        visual?: string;
    };
    hasLegend?: boolean;
}
export declare class SelectionProjectionComponent {
    hasChannel: Partial<Record<SingleDefUnitChannel, SelectionProjection>>;
    hasField: Record<string, SelectionProjection>;
    hasSelectionId: boolean;
    timeUnit?: TimeUnitNode;
    items: SelectionProjection[];
    constructor(...items: SelectionProjection[]);
}
declare const project: SelectionCompiler;
export default project;
//# sourceMappingURL=project.d.ts.map