import { Config } from '../../config';
import { ChannelDef } from '../../fielddef';
import { VgValueRef } from '../../vega.schema';
import { MarkCompiler } from './base';
export declare const text: MarkCompiler;
export declare function textRef(textDef: ChannelDef, config: Config): VgValueRef;
