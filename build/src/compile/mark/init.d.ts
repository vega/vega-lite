import { SignalRef } from 'vega';
import { Config } from '../../config';
import { Encoding } from '../../encoding';
import { MarkDef } from '../../mark';
export declare function initMarkdef(originalMarkDef: MarkDef, encoding: Encoding<string>, config: Config<SignalRef>): MarkDef<"square" | "area" | "circle" | "image" | "line" | "rect" | "text" | "point" | "arc" | "rule" | "trail" | "geoshape" | "bar" | "tick", SignalRef>;
export declare function defaultFilled(markDef: MarkDef, config: Config<SignalRef>, { graticule }: {
    graticule: boolean;
}): boolean;
//# sourceMappingURL=init.d.ts.map