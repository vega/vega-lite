/**
 * Utility for generating row / column headers
 */
import { TitleAnchor, TitleConfig } from 'vega';
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
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef;
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame?: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
};
export declare function defaultHeaderGuideAlign(headerChannel: HeaderChannel, angle: number, anchor?: TitleAnchor): {
    align: string;
} | {
    align?: undefined;
};
export declare function defaultHeaderGuideBaseline(angle: number, channel: FacetChannel): {
    baseline: string;
} | {
    baseline?: undefined;
};
export declare function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
export declare function assembleLabelTitle(facetFieldDef: FacetFieldDef<string>, channel: FacetChannel, config: Config): {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align: string | import("vega").SignalRef | {
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
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
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
        value: import("vega").TextBaseline;
    };
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient: string | import("vega").SignalRef;
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
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
        value: import("vega").TextBaseline;
    };
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient: string | import("vega").SignalRef;
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align: string | import("vega").SignalRef | {
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
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient: string | import("vega").SignalRef;
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient: string | import("vega").SignalRef;
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align: string | import("vega").SignalRef | {
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
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
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
        value: import("vega").TextBaseline;
    };
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
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
        value: import("vega").TextBaseline;
    };
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align: string | import("vega").SignalRef | {
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
        value: import("vega").Align;
    };
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
} | {
    text: string | import("vega").SignalRef | {
        signal: string;
    };
    name?: string;
    interactive?: boolean;
    style: string | string[];
    zindex?: number;
    encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
    anchor?: import("vega").AnchorValue;
    frame: import("vega").StringValue;
    offset?: import("vega").NumberValue;
    align?: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
    dx?: import("vega").NumberValue;
    dy?: import("vega").NumberValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
};
export declare function assembleHeaderGroup(model: Model, channel: HeaderChannel, headerType: HeaderType, layoutHeader: LayoutHeaderComponent, headerCmpt: HeaderComponent): {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    from: {
        data: string;
    };
    sort: VgComparator;
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    name: string;
    type: string;
    role: string;
} | {
    title: {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient: string | import("vega").SignalRef;
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
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
            value: import("vega").TextBaseline;
        };
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align: string | import("vega").SignalRef | {
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
            value: import("vega").Align;
        };
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    } | {
        text: string | import("vega").SignalRef | {
            signal: string;
        };
        name?: string;
        interactive?: boolean;
        style: string | string[];
        zindex?: number;
        encode?: Partial<Record<import("vega").EncodeEntryName, import("vega").TextEncodeEntry>>;
        anchor?: import("vega").AnchorValue;
        frame: import("vega").StringValue;
        offset?: import("vega").NumberValue;
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        dx?: import("vega").NumberValue;
        dy?: import("vega").NumberValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: import("vega").SignalRef | "left" | "right" | "top" | "bottom" | "none";
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    name: string;
    type: string;
    role: string;
} | {
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    name: string;
    type: string;
    role: string;
} | {
    name: string;
    type: string;
    role: string;
};
export declare function getLayoutTitleBand(titleAnchor: TitleAnchor, headerChannel: HeaderChannel): any;
export declare function assembleLayoutTitleBand(headerComponentIndex: LayoutHeaderComponentIndex, config: Config): RowCol<number>;
export declare function assembleHeaderProperties(config: Config, facetFieldDef: FacetFieldDef<string>, channel: FacetChannel, properties: (keyof CoreHeader)[], propertiesMap: {
    [k in keyof CoreHeader]: keyof TitleConfig;
}): Partial<VgTitle>;
//# sourceMappingURL=assemble.d.ts.map