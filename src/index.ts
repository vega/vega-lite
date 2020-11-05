import pkg from '../package.json';
export const version = pkg.version;

export {compile} from './compile/compile';
export type {Config} from './config';
export {normalize} from './normalize';
export type {TopLevelSpec} from './spec';
export * from './util';
