import { Legend as VgLegend } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { Legend } from '../../legend';
import { Split } from '../split';
export declare type LegendComponentProps = VgLegend & {
    labelExpr?: string;
};
export declare const LEGEND_COMPONENT_PROPERTIES: ("opacity" | "fill" | "stroke" | "strokeWidth" | "size" | "shape" | "values" | "type" | "title" | "columns" | "padding" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelOpacity" | "labelOverlap" | "titlePadding" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOpacity" | "labelSeparation" | "labelLimit" | "labelPadding" | "strokeDash" | "orient" | "cornerRadius" | "fillColor" | "offset" | "strokeColor" | "legendX" | "legendY" | "titleOrient" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolDash" | "symbolDashOffset" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelOffset" | "labelExpr" | "format" | "formatType" | "tickCount" | "tickMinStep" | "zindex" | "encode" | "direction")[];
export declare class LegendComponent extends Split<LegendComponentProps> {
}
export declare type LegendComponentIndex = {
    [P in NonPositionScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonPositionScaleChannel]?: Legend;
};
//# sourceMappingURL=component.d.ts.map