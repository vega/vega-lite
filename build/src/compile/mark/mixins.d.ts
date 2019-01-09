import { NonPositionScaleChannel } from '../../channel';
import { ChannelDef, SecondaryFieldDef, TypedFieldDef, ValueDef } from '../../fielddef';
import { VgEncodeEntry, VgValueRef } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function color(model: UnitModel): VgEncodeEntry;
export declare type Ignore = Record<'size' | 'orient', 'ignore' | 'include'>;
export declare function baseEncodeEntry(model: UnitModel, ignore: Ignore): {
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontSize?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontStyle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontWeight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
} | {
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip: VgValueRef | (VgValueRef & {
        test?: string;
    })[] | {
        signal: string;
    };
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontSize?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontStyle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontWeight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
export declare function valueIfDefined(prop: string, value: string | number | boolean): VgEncodeEntry;
export declare function defined(model: UnitModel): VgEncodeEntry;
/**
 * Return mixins for non-positional channels with scales.  (Text doesn't have scale.)
 */
export declare function nonPosition(channel: NonPositionScaleChannel, model: UnitModel, opt?: {
    defaultValue?: number | string | boolean;
    vgChannel?: string;
    defaultRef?: VgValueRef;
}): VgEncodeEntry;
/**
 * Return a mixin that include a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
export declare function wrapCondition(model: UnitModel, channelDef: ChannelDef, vgChannel: string, refFn: (cDef: ChannelDef) => VgValueRef): VgEncodeEntry;
export declare function tooltip(model: UnitModel): VgEncodeEntry | {
    tooltip: {
        signal: string;
    };
};
export declare function text(model: UnitModel, channel?: 'text' | 'href'): VgEncodeEntry;
export declare function bandPosition(fieldDef: TypedFieldDef<string>, channel: 'x' | 'y', model: UnitModel): {
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontSize?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontStyle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontWeight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
export declare function centeredBandPosition(channel: 'x' | 'y', model: UnitModel, defaultPosRef: VgValueRef, defaultSizeRef: VgValueRef): {
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontSize?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontStyle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fontWeight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
export declare function binPosition(fieldDef: TypedFieldDef<string>, fieldDef2: ValueDef | SecondaryFieldDef<string>, channel: 'x' | 'y', scaleName: string, spacing: number, reverse: boolean): {
    [x: string]: VgValueRef;
};
/**
 * Return mixins for point (non-band) position channels.
 */
export declare function pointPosition(channel: 'x' | 'y', model: UnitModel, defaultRef: VgValueRef | 'zeroOrMin' | 'zeroOrMax', vgChannel?: 'x' | 'y' | 'xc' | 'yc'): {
    [x: string]: {
        offset: any;
        value?: string | number | boolean;
        field?: string | {
            datum?: string;
            group?: string;
            parent?: string;
        };
        signal?: string;
        scale?: string;
        mult?: number;
        band?: number | boolean | VgValueRef;
    } | {
        value?: string | number | boolean;
        field?: string | {
            datum?: string;
            group?: string;
            parent?: string;
        };
        signal?: string;
        scale?: string;
        mult?: number;
        offset?: number | VgValueRef;
        band?: number | boolean | VgValueRef;
    };
};
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
export declare function pointPosition2(model: UnitModel, defaultRef: 'zeroOrMin' | 'zeroOrMax', channel: 'x2' | 'y2'): {
    [x: string]: {
        offset: any;
        value?: string | number | boolean;
        field?: string | {
            datum?: string;
            group?: string;
            parent?: string;
        };
        signal?: string;
        scale?: string;
        mult?: number;
        band?: number | boolean | VgValueRef;
    } | {
        value?: string | number | boolean;
        field?: string | {
            datum?: string;
            group?: string;
            parent?: string;
        };
        signal?: string;
        scale?: string;
        mult?: number;
        offset?: number | VgValueRef;
        band?: number | boolean | VgValueRef;
    };
};
