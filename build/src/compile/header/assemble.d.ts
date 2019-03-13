/**
 * Utility for generating row / column headers
 */
import { TitleAnchor, TitleConfig } from 'vega';
import { FacetChannel } from '../../channel';
import { Config } from '../../config';
import { HeaderConfig } from '../../header';
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: "left" | "right" | "center";
        } | ({
            value: "left" | "right" | "center";
        } & {
            scale: import("vega").Field;
        });
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: "left" | "right" | "center";
        } | ({
            value: "left" | "right" | "center";
        } & {
            scale: import("vega").Field;
        });
        angle?: import("vega").NumberValue;
        baseline?: import("vega").TextBaselineValue;
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
    };
};
export declare function titleAlign(titleAnchor: TitleAnchor): {
    align: string;
} | {
    align?: undefined;
};
export declare function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
export declare function labelAlign(angle: number, channel: FacetChannel): {
    align: "left" | "right" | "center";
} | {
    align?: undefined;
};
export declare function labelBaseline(angle: number, channel: FacetChannel): {
    baseline: string;
} | {
    baseline?: undefined;
};
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
    align: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
        field: import("vega").Field;
    } | {
        range: number | boolean;
    } | (import("vega").SignalRef & {
        scale: import("vega").Field;
    }) | ({
        field: import("vega").Field;
    } & {
        scale: import("vega").Field;
    }) | ({
        range: number | boolean;
    } & {
        scale: import("vega").Field;
    }) | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    } | ({
        value: import("vega").TextBaseline;
    } & {
        scale: import("vega").Field;
    });
    color?: import("vega").ColorValue;
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
        range: number | boolean;
    } | (import("vega").SignalRef & {
        scale: import("vega").Field;
    }) | ({
        field: import("vega").Field;
    } & {
        scale: import("vega").Field;
    }) | ({
        range: number | boolean;
    } & {
        scale: import("vega").Field;
    }) | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    } | ({
        value: import("vega").TextBaseline;
    } & {
        scale: import("vega").Field;
    });
    color?: import("vega").ColorValue;
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
    align: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
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
    align: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline: string | import("vega").SignalRef | {
        field: import("vega").Field;
    } | {
        range: number | boolean;
    } | (import("vega").SignalRef & {
        scale: import("vega").Field;
    }) | ({
        field: import("vega").Field;
    } & {
        scale: import("vega").Field;
    }) | ({
        range: number | boolean;
    } & {
        scale: import("vega").Field;
    }) | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    } | ({
        value: import("vega").TextBaseline;
    } & {
        scale: import("vega").Field;
    });
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        range: number | boolean;
    } | (import("vega").SignalRef & {
        scale: import("vega").Field;
    }) | ({
        field: import("vega").Field;
    } & {
        scale: import("vega").Field;
    }) | ({
        range: number | boolean;
    } & {
        scale: import("vega").Field;
    }) | {
        scale: import("vega").Field;
        band: number | boolean;
    } | {
        value: import("vega").TextBaseline;
    } | ({
        value: import("vega").TextBaseline;
    } & {
        scale: import("vega").Field;
    });
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
    align: import("vega").AlignValue;
    angle?: import("vega").NumberValue;
    baseline?: import("vega").TextBaselineValue;
    color?: import("vega").ColorValue;
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
    font?: import("vega").StringValue;
    fontSize?: import("vega").NumberValue;
    fontStyle?: import("vega").StringValue;
    fontWeight?: import("vega").FontWeightValue;
    limit?: import("vega").NumberValue;
    orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        align?: import("vega").AlignValue;
        angle?: import("vega").NumberValue;
        baseline: string | import("vega").SignalRef | {
            field: import("vega").Field;
        } | {
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
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
            range: number | boolean;
        } | (import("vega").SignalRef & {
            scale: import("vega").Field;
        }) | ({
            field: import("vega").Field;
        } & {
            scale: import("vega").Field;
        }) | ({
            range: number | boolean;
        } & {
            scale: import("vega").Field;
        }) | {
            scale: import("vega").Field;
            band: number | boolean;
        } | {
            value: import("vega").TextBaseline;
        } | ({
            value: import("vega").TextBaseline;
        } & {
            scale: import("vega").Field;
        });
        color?: import("vega").ColorValue;
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
        font?: import("vega").StringValue;
        fontSize?: import("vega").NumberValue;
        fontStyle?: import("vega").StringValue;
        fontWeight?: import("vega").FontWeightValue;
        limit?: import("vega").NumberValue;
        orient?: "left" | "right" | "none" | "top" | "bottom" | import("vega").SignalRef;
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
export declare function getLayoutTitleBand(titleAnchor: TitleAnchor): 1 | 0;
export declare function assembleLayoutTitleBand(headerComponentIndex: LayoutHeaderComponentIndex): RowCol<number>;
export declare function getHeaderProperties(config: Config, facetFieldDef: FacetFieldDef<string>, properties: (keyof HeaderConfig)[], propertiesMap: {
    [k in keyof HeaderConfig]: keyof TitleConfig;
}): Partial<VgTitle>;
