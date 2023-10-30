import { VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
export { color } from './color';
export { wrapCondition } from './conditional';
export { nonPosition } from './nonposition';
export { pointPosition } from './position-point';
export { pointOrRangePosition, rangePosition } from './position-range';
export { rectPosition } from './position-rect';
export { text } from './text';
export { tooltip } from './tooltip';
export type Ignore = Record<'color' | 'size' | 'orient' | 'align' | 'baseline' | 'theta', 'ignore' | 'include'>;
export declare function baseEncodeEntry(model: UnitModel, ignore: Ignore): {
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ariaRoleDescription?: undefined;
    aria?: true | import("vega-typings").SignalRef;
} | {
    description: import("vega-typings").SignalRef | {
        value: string;
    };
    ariaRoleDescription?: undefined;
    aria?: true | import("vega-typings").SignalRef;
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
} | {
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ariaRoleDescription: {
        value: string | import("vega-typings").SignalRef;
    };
    aria?: true | import("vega-typings").SignalRef;
} | {
    description: import("vega-typings").SignalRef | {
        value: string;
    };
    ariaRoleDescription: {
        value: string | import("vega-typings").SignalRef;
    };
    aria?: true | import("vega-typings").SignalRef;
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
} | {
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip: VgValueRef | (VgValueRef & {
        test?: string;
    })[] | {
        signal: string;
    };
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ariaRoleDescription?: undefined;
    aria?: true | import("vega-typings").SignalRef;
} | {
    description: import("vega-typings").SignalRef | {
        value: string;
    };
    ariaRoleDescription?: undefined;
    aria?: true | import("vega-typings").SignalRef;
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip: VgValueRef | (VgValueRef & {
        test?: string;
    })[] | {
        signal: string;
    };
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
} | {
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip: VgValueRef | (VgValueRef & {
        test?: string;
    })[] | {
        signal: string;
    };
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ariaRoleDescription: {
        value: string | import("vega-typings").SignalRef;
    };
    aria?: true | import("vega-typings").SignalRef;
} | {
    description: import("vega-typings").SignalRef | {
        value: string;
    };
    ariaRoleDescription: {
        value: string | import("vega-typings").SignalRef;
    };
    aria?: true | import("vega-typings").SignalRef;
    fill?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    stroke?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    angle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    height?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    width?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    url?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    clip?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cursor?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    fillOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    font?: VgValueRef | (VgValueRef & {
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
    opacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOpacity?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeWidth?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dir?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    path?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    text?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    size?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    x2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    xc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    y2?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    yc?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDash?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeDashOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeCap?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeJoin?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeMiterLimit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tooltip: VgValueRef | (VgValueRef & {
        test?: string;
    })[] | {
        signal: string;
    };
    startAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    endAngle?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    innerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    outerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    orient?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    interpolate?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    tension?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    defined?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeForeground?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    strokeOffset?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusTopRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomRight?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    cornerRadiusBottomLeft?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    baseline?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    align?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleX?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    scaleY?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    shape?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dx?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    dy?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    ellipsis?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    limit?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    radius?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    theta?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
    href?: VgValueRef | (VgValueRef & {
        test?: string;
    })[];
};
//# sourceMappingURL=base.d.ts.map