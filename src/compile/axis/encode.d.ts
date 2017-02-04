import { Channel } from '../../channel';
import { VgAxis } from '../../vega.schema';
import { Model } from '../model';
export declare function domain(model: Model, channel: Channel, domainPropsSpec: any, _?: VgAxis): any;
export declare function grid(model: Model, channel: Channel, gridPropsSpec: any, _?: VgAxis): any;
export declare function labels(model: Model, channel: Channel, labelsSpec: any, def: VgAxis): any;
export declare function ticks(model: Model, channel: Channel, ticksPropsSpec: any, _?: VgAxis): any;
export declare function title(model: Model, channel: Channel, titlePropsSpec: any, _?: VgAxis): any;
