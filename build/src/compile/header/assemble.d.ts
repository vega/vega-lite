/**
 * Utility for generating row / column headers
 */
import { TitleAnchor, TitleConfig } from 'vega';
import { FacetChannel } from '../../channel';
import { Config } from '../../config';
import { HeaderConfig } from '../../header';
import { FacetFieldDef } from '../../spec/facet';
import { RowCol, VgComparator, VgMarkGroup } from '../../vega.schema';
import { Model } from '../model';
import { HeaderChannel, HeaderComponent, HeaderType, LayoutHeaderComponent, LayoutHeaderComponentIndex } from './component';
export declare function assembleTitleGroup(model: Model, channel: FacetChannel): {
    name: string;
    type: string;
    role: string;
    title: {
        align: string;
        style: string;
        orient: string;
        text: string;
        offset: number;
    } | {
        align?: undefined;
        style: string;
        orient: string;
        text: string;
        offset: number;
    } | {
        align: string;
        style: string;
        text: string;
        offset: number;
    } | {
        align?: undefined;
        style: string;
        text: string;
        offset: number;
    };
};
export declare function titleAlign(titleAnchor: TitleAnchor): {
    align: string;
} | {
    align?: undefined;
};
export declare function assembleHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
export declare function labelAlign(angle: number): {
    align?: undefined;
} | {
    align: {
        value: string;
    };
};
export declare function labelBaseline(angle: number): {
    baseline: string;
};
export declare function assembleLabelTitle(facetFieldDef: FacetFieldDef<string>, channel: FacetChannel, config: Config): {
    encode: {
        update: {
            align?: undefined;
        } | {
            align: {
                value: string;
            };
        };
    };
    baseline: string;
    angle: number;
    style: string;
    frame: string;
    orient: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    baseline: string;
    angle: number;
    style: string;
    frame: string;
    orient: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    encode: {
        update: {
            align?: undefined;
        } | {
            align: {
                value: string;
            };
        };
    };
    baseline: string;
    style: string;
    frame: string;
    orient: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    baseline: string;
    style: string;
    frame: string;
    orient: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    encode: {
        update: {
            align?: undefined;
        } | {
            align: {
                value: string;
            };
        };
    };
    baseline: string;
    angle: number;
    style: string;
    frame: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    baseline: string;
    angle: number;
    style: string;
    frame: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    encode: {
        update: {
            align?: undefined;
        } | {
            align: {
                value: string;
            };
        };
    };
    baseline: string;
    style: string;
    frame: string;
    text: {
        signal: string;
    };
    offset: number;
} | {
    baseline: string;
    style: string;
    frame: string;
    text: {
        signal: string;
    };
    offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
    };
    from: {
        data: string;
    };
    name: string;
    type: string;
    role: string;
} | {
    title: {
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: import("vega").Axis[];
    title: {
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
    };
    name: string;
    type: string;
    role: string;
} | {
    title: {
        baseline: string;
        style: string;
        frame: string;
        text: {
            signal: string;
        };
        offset: number;
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
}): {};
