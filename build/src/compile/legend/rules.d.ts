import { Channel } from '../../channel';
import { Config } from '../../config';
import { DateTime } from '../../datetime';
import { FieldDef } from '../../fielddef';
import { Legend } from '../../legend';
export declare function title(legend: Legend, fieldDef: FieldDef, config: Config): string;
export declare function values(legend: Legend): string[] | number[] | DateTime[];
export declare function type(legend: Legend, fieldDef: FieldDef, channel: Channel): "symbol" | "gradient";
