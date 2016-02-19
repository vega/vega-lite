/** Miscellaneous enum declarations */

export enum SortOrder {
    ASCENDING = 'ascending' as any,
    DESCENDING = 'descending' as any,
    NONE = 'none' as any,
}

export enum ScaleType {
    LINEAR = 'linear' as any,
    LOG = 'log' as any,
    POW = 'pow' as any,
    SQRT = 'sqrt' as any,
    QUANTILE = 'quantile' as any,
    ORDINAL = 'ordinal' as any,
    TIME = 'time' as any,
}

export enum NiceTime {
    SECOND = 'second' as any,
    MINUTE = 'minute' as any,
    HOUR = 'hour' as any,
    DAY = 'day' as any,
    WEEK = 'week' as any,
    MONTH = 'month' as any,
    YEAR = 'year' as any,
}

export enum DataFormat {
    JSON = 'json' as any,
    CSV = 'csv' as any,
    TSV = 'tsv' as any,
}

export enum AxisOrient {
    TOP = 'top' as any,
    RIGHT = 'right' as any,
    LEFT = 'left' as any,
    BOTTOM = 'bottom' as any
}

export enum FontWeight {
    NORMAL = 'normal' as any,
    BOLD = 'bold' as any
}

export enum Shape {
    CIRCLE = 'circle' as any,
    SQUARE = 'square' as any,
    CROSS = 'cross' as any,
    DIAMOND = 'diamond' as any,
    TRIANGLEUP = 'triangle-up' as any,
    TRIANGLEDOWN = 'triangle-down' as any,
}

export enum HorizontalAlign {
    LEFT = 'left' as any,
    RIGHT = 'right' as any,
    CENTER = 'center' as any,
}

export enum VerticalAlign {
    TOP = 'top' as any,
    MIDDLE = 'middle' as any,
    BOTTOM = 'bottom' as any,
}

export enum FontStyle {
    NORMAL = 'normal' as any,
    ITALIC = 'italic' as any,
}

export enum StackOffset {
    ZERO = 'zero' as any,
    CENTER = 'center' as any,
    NORMALIZE = 'normalize' as any,
    NONE = 'none' as any,
}
