import {version} from '../package.json';
import {normalize} from './normalize';

export {compile} from './compile/compile';
export type {Config} from './config';
export type {TopLevelSpec} from './spec';
export * from './util';
export {normalize, version};
