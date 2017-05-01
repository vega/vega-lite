import { UnitModel } from '../unit';
import { Config } from '../../config';
import { MarkCompiler } from './base';
export declare function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square'): any;
export declare const point: MarkCompiler;
export declare const circle: MarkCompiler;
export declare const square: MarkCompiler;
