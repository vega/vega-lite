import { Encoding } from '../encoding';
import { GenericSpec } from '../spec/index';
import { GenericUnitSpec } from '../spec/unit';
import { NonFacetUnitNormalizer } from './base';
declare type UnitSpecWithRangeStep = GenericUnitSpec<Encoding<string>, any>;
export declare class RangeStepNormalizer implements NonFacetUnitNormalizer<UnitSpecWithRangeStep> {
    name: string;
    hasMatchingType(spec: GenericSpec<any, any>): spec is UnitSpecWithRangeStep;
    run(spec: UnitSpecWithRangeStep): {
        encoding: {
            x?: import("../channeldef").ValueDef<number | "width"> | import("../channeldef").PositionFieldDef<string>;
            y?: import("../channeldef").ValueDef<number | "height"> | import("../channeldef").PositionFieldDef<string>;
            x2?: import("../channeldef").ValueDef<number | "width"> | import("../channeldef").SecondaryFieldDef<string>;
            y2?: import("../channeldef").ValueDef<number | "height"> | import("../channeldef").SecondaryFieldDef<string>;
            longitude?: import("../channeldef").ValueDef<number> | import("../channeldef").LatLongFieldDef<string>;
            latitude?: import("../channeldef").ValueDef<number> | import("../channeldef").LatLongFieldDef<string>;
            longitude2?: import("../channeldef").ValueDef<number> | import("../channeldef").SecondaryFieldDef<string>;
            latitude2?: import("../channeldef").ValueDef<number> | import("../channeldef").SecondaryFieldDef<string>;
            color?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient>;
            fill?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient>;
            stroke?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, string | import("vega-typings/types").LinearGradient | import("vega-typings/types").RadialGradient>;
            opacity?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number>;
            fillOpacity?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number>;
            strokeOpacity?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number>;
            strokeWidth?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number>;
            size?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../type").StandardType>, number>;
            shape?: import("../channeldef").FieldDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../channeldef").TypeForShape>, string> | import("../channeldef").ValueDefWithCondition<import("../channeldef").MarkPropFieldDef<string, import("../channeldef").TypeForShape>, string>;
            detail?: import("../channeldef").TypedFieldDef<string, import("../type").StandardType, boolean | import("../bin").BinParams | "binned"> | import("../channeldef").TypedFieldDef<string, import("../type").StandardType, boolean | import("../bin").BinParams | "binned">[];
            key?: import("../channeldef").TypedFieldDef<string, import("../type").StandardType, boolean | import("../bin").BinParams | "binned">;
            text?: import("../channeldef").FieldDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value> | import("../channeldef").ValueDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value>;
            tooltip?: import("../channeldef").FieldDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value> | import("../channeldef").ValueDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value> | import("../channeldef").TextFieldDef<string>[];
            href?: import("../channeldef").FieldDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value> | import("../channeldef").ValueDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value>;
            url?: import("../channeldef").FieldDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value> | import("../channeldef").ValueDefWithCondition<import("../channeldef").TextFieldDef<string>, import("../channeldef").Value>;
            order?: import("../channeldef").ValueDef<number> | import("../channeldef").OrderFieldDef<string> | import("../channeldef").OrderFieldDef<string>[];
        };
        mark: any;
        projection?: import("../projection").Projection;
        selection?: {
            [name: string]: import("../selection").SelectionDef;
        };
        title?: string | import("../title").TitleParams;
        name?: string;
        description?: string;
        data?: import("../data").Data;
        transform?: import("../transform").Transform[];
        view?: import("../spec/base").ViewBackground;
        width?: number | import("../spec/base").Step;
        height?: number | import("../spec/base").Step;
    };
}
export {};
//# sourceMappingURL=rangestep.d.ts.map