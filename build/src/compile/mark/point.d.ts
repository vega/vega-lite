import { Config } from '../../config';
import { VgEncodeEntry } from '../../vega.schema';
import { UnitModel } from '../unit';
import { MarkCompiler } from './base';
export declare function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square'): VgEncodeEntry;
export declare const point: MarkCompiler;
export declare const circle: MarkCompiler;
export declare const square: MarkCompiler;
