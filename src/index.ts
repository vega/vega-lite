import pkg from '../package.json';
export const version = pkg.version;

export {compile} from './compile/compile.js';
export type {Config} from './config.js';
export {normalize} from './normalize/index.js';
export type {TopLevelSpec} from './spec/index.js';
export * from './util.js';
