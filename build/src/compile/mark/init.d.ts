import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { Mark, MarkDef } from '../../mark';
export declare function normalizeMarkDef(mark: Mark | MarkDef, encoding: Encoding<string>, config: Config): MarkDef;
