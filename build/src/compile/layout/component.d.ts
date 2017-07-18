import { Split } from '../split';
export declare type LayoutSize = number | 'range-step' | 'merged';
export interface LayoutSizeIndex {
    width?: LayoutSize;
    height?: LayoutSize;
}
export declare type LayoutSizeComponent = Split<LayoutSizeIndex>;
