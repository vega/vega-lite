/**
 * Utility for generating row / column headers
 */
import { SignalRef, TitleAnchor, TitleConfig } from 'vega';
import { FacetChannel } from '../../channel';
import { Config } from '../../config';
import { CoreHeader } from '../../header';
import { FacetFieldDef } from '../../spec/facet';
import { RowCol, VgComparator, VgMarkGroup, VgTitle } from '../../vega.schema';
import { Model } from '../model';
import { HeaderChannel, HeaderComponent, HeaderType, LayoutHeaderComponent, LayoutHeaderComponentIndex } from './component';
export declare function assembleTitleGroup(model: Model, channel: FacetChannel): {
    name: string;
    type: string;
    role: string;
    title: {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        };
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: "center" | "left" | "right" | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        };
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        };
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: "center" | "left" | "right" | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    };
};
export declare function defaultHeaderGuideAlign(headerChannel: HeaderChannel, angle: number, anchor?: TitleAnchor): {
    align: string;
} | {
    align: SignalRef | import("vega").Align;
} | {
    align?: undefined;
};
export declare function defaultHeaderGuideBaseline(angle: number, channel: FacetChannel): {
    baseline: string | {
        signal: string;
    };
} | {
    baseline?: undefined;
};
export declare function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
export declare function assembleLabelTitle(facetFieldDef: FacetFieldDef<string, SignalRef>, channel: FacetChannel, config: Config<SignalRef>): {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    };
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
} | {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align: "center" | "left" | "right" | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    };
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
} | {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    };
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
} | {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
} | {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align: "center" | "left" | "right" | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
} | {
    text: SignalRef | import("vega").Text;
    subtitle?: SignalRef | import("vega").Text;
    name?: string;
    interactive?: boolean;
    style: string | string[];
    encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: string | SignalRef | {
        field: import("vega").Field;
    } | {
        scale: import("vega").Field;
        value: string | number | boolean;
    } | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        scale: import("vega").Field;
        range: number | boolean;
    } | {
        value: string;
    };
    offset?: import("vega").NumberValue;
    orient?: string | SignalRef;
    aria?: boolean;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    limit?: import("vega").NumberValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").FontStyleValue;
    fontWeight?: import("vega").FontWeightValue;
    lineHeight?: import("vega").NumberValue;
    subtitleColor?: import("vega").ColorValue;
    subtitleFont?: import("vega").StringValue;
    subtitleFontSize?: import("vega").NumberValue;
    subtitleFontStyle?: import("vega").FontStyleValue;
    subtitleFontWeight?: import("vega").FontWeightValue;
    subtitleLineHeight?: import("vega").NumberValue;
    subtitlePadding?: import("vega").NumberValue;
    zindex?: number;
};
export declare function assembleHeaderGroup(model: Model, channel: HeaderChannel, headerType: HeaderType, layoutHeader: LayoutHeaderComponent, headerComponent: HeaderComponent): {
    axes?: import("vega").Axis[];
    encode?: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title?: {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        };
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        };
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    } | {
        text: SignalRef | import("vega").Text;
        subtitle?: SignalRef | import("vega").Text;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        encode?: import("vega").TitleEncode | Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: string | SignalRef | {
            field: import("vega").Field;
        } | {
            scale: import("vega").Field;
            value: string | number | boolean;
        } | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            scale: import("vega").Field;
            range: number | boolean;
        } | {
            value: string;
        };
        offset?: import("vega").NumberValue;
        orient?: string | SignalRef;
        aria?: boolean;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        limit?: import("vega").NumberValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").FontStyleValue;
        fontWeight?: import("vega").FontWeightValue;
        lineHeight?: import("vega").NumberValue;
        subtitleColor?: import("vega").ColorValue;
        subtitleFont?: import("vega").StringValue;
        subtitleFontSize?: import("vega").NumberValue;
        subtitleFontStyle?: import("vega").FontStyleValue;
        subtitleFontWeight?: import("vega").FontWeightValue;
        subtitleLineHeight?: import("vega").NumberValue;
        subtitlePadding?: import("vega").NumberValue;
        zindex?: number;
    };
    from?: {
        data: string;
    };
    sort?: VgComparator;
    name: string;
    type: string;
    role: string;
};
export declare function getLayoutTitleBand(titleAnchor: TitleAnchor, headerChannel: HeaderChannel): any;
export declare function assembleLayoutTitleBand(headerComponentIndex: LayoutHeaderComponentIndex, config: Config<SignalRef>): RowCol<number>;
export declare function assembleHeaderProperties(config: Config<SignalRef>, facetFieldDef: FacetFieldDef<string, SignalRef>, channel: FacetChannel, properties: (keyof CoreHeader<SignalRef>)[], propertiesMap: Partial<Record<keyof CoreHeader<SignalRef>, keyof TitleConfig>>): Partial<VgTitle>;
//# sourceMappingURL=assemble.d.ts.map