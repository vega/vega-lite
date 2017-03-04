import { UnitModel } from '../unit';
import { MarkCompiler } from './base';
import { Config } from '../../config';
export declare function shapeMixins(model: UnitModel, config: Config, fixedShape?: 'circle' | 'square'): any;
export declare const point: MarkCompiler;
export declare const circle: MarkCompiler;
export declare const square: MarkCompiler;
