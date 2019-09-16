import { Legend as VgLegend } from 'vega';
import { NonPositionScaleChannel } from '../../channel';
import { Legend } from '../../legend';
import { Split } from '../split';
export declare type LegendComponentProps = VgLegend & {
    labelExpr?: string;
};
export declare const LEGEND_COMPONENT_PROPERTIES: ("padding" | "stroke" | "type" | "shape" | "values" | "fill" | "opacity" | "strokeWidth" | "size" | "format" | "strokeDash" | "orient" | "cornerRadius" | "direction" | "formatType" | "title" | "tickCount" | "tickMinStep" | "zindex" | "encode" | "fillColor" | "offset" | "strokeColor" | "legendX" | "legendY" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleOpacity" | "titleOrient" | "titlePadding" | "gradientLength" | "gradientOpacity" | "gradientThickness" | "gradientStrokeColor" | "gradientStrokeWidth" | "clipHeight" | "columns" | "columnPadding" | "rowPadding" | "gridAlign" | "symbolDash" | "symbolDashOffset" | "symbolFillColor" | "symbolOffset" | "symbolOpacity" | "symbolSize" | "symbolStrokeColor" | "symbolStrokeWidth" | "symbolType" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelLimit" | "labelOpacity" | "labelPadding" | "labelOffset" | "labelOverlap" | "labelSeparation" | "labelExpr")[];
export declare class LegendComponent extends Split<LegendComponentProps> {
}
export declare type LegendComponentIndex = {
    [P in NonPositionScaleChannel]?: LegendComponent;
};
export declare type LegendIndex = {
    [P in NonPositionScaleChannel]?: Legend;
};
//# sourceMappingURL=component.d.ts.map