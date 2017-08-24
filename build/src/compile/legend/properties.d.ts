import { Channel } from '../../channel';
import { DateTime } from '../../datetime';
import { Legend } from '../../legend';
import { ScaleType } from '../../scale';
import { Type } from '../../type';
export declare function values(legend: Legend): string[] | number[] | DateTime[] | {
    signal: string;
}[];
export declare function type(type: Type, channel: Channel, scaleType: ScaleType): 'gradient';
