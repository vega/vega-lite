/**
 * Utility for generating row / column headers
 */
import { Axis as VgAxis, AxisOrient, TitleConfig as VgTitleConfig } from 'vega';
import { Config } from '../../config';
import { HeaderConfig } from '../../header';
import { FacetFieldDef } from '../../spec/facet';
import { VgComparator, VgMarkGroup } from '../../vega.schema';
import { Model } from '../model';
export declare type HeaderChannel = 'row' | 'column';
export declare const HEADER_CHANNELS: HeaderChannel[];
export declare type HeaderType = 'header' | 'footer';
export declare const HEADER_TYPES: HeaderType[];
/**
 * A component that represents all header, footers and title of a Vega group with layout directive.
 */
export interface LayoutHeaderComponent {
    title?: string;
    facetFieldDef?: FacetFieldDef<string>;
    /**
     * An array of header components for headers.
     * For facet, there should be only one header component, which is data-driven.
     * For repeat and concat, there can be multiple header components that explicitly list different axes.
     */
    header?: HeaderComponent[];
    /**
     * An array of header components for footers.
     * For facet, there should be only one header component, which is data-driven.
     * For repeat and concat, there can be multiple header components that explicitly list different axes.
     */
    footer?: HeaderComponent[];
}
/**
 * A component that represents one group of row/column-header/footer.
 */
export interface HeaderComponent {
    labels: boolean;
    sizeSignal: {
        signal: string;
    };
    axes: VgAxis[];
}
export declare function getHeaderType(orient: AxisOrient): "footer" | "header";
export declare function getTitleGroup(model: Model, channel: HeaderChannel): {
    name: string;
    type: string;
    role: string;
    title: {
        style: string;
        orient: string;
        text: string;
        offset: number;
    } | {
        style: string;
        text: string;
        offset: number;
    };
};
export declare function getHeaderGroups(model: Model, channel: HeaderChannel): VgMarkGroup[];
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
export declare function getHeaderGroup(model: Model, channel: HeaderChannel, headerType: HeaderType, layoutHeader: LayoutHeaderComponent, headerCmpt: HeaderComponent): {
    axes: VgAxis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
    axes: VgAxis[];
    title: {
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
    axes: VgAxis[];
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
    axes: VgAxis[];
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
    axes: VgAxis[];
    encode: {
        update: {
            [x: string]: {
                signal: string;
            };
        };
    };
    title: {
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
        text: {
            signal: string;
        };
        offset: number;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: VgAxis[];
    title: {
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        orient: string;
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        angle: number;
        style: string;
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
        text: {
            signal: string;
        };
        offset: number;
    } | {
        baseline: string;
        style: string;
        text: {
            signal: string;
        };
        offset: number;
    };
    name: string;
    type: string;
    role: string;
} | {
    axes: VgAxis[];
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
    axes: VgAxis[];
    name: string;
    type: string;
    role: string;
} | {
    name: string;
    type: string;
    role: string;
};
export declare function getHeaderProperties(config: Config, facetFieldDef: FacetFieldDef<string>, properties: (keyof HeaderConfig)[], propertiesMap: {
    [k in keyof HeaderConfig]: keyof VgTitleConfig;
}): {};
