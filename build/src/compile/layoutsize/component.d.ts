import { Split } from '../split';
export type LayoutSize = number | 'container' | 'step' | 'merged';
export interface LayoutSizeIndex {
    width?: LayoutSize;
    childWidth?: LayoutSize;
    height?: LayoutSize;
    childHeight?: LayoutSize;
}
export type LayoutSizeType = keyof LayoutSizeIndex;
export type LayoutSizeComponent = Split<LayoutSizeIndex>;
export declare function getSizeTypeFromLayoutSizeType(layoutSizeType: LayoutSizeType): 'width' | 'height';
//# sourceMappingURL=component.d.ts.map