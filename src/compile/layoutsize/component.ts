import {Split} from '../split.js';

export type LayoutSize = number | 'container' | 'step' | 'merged';

export interface LayoutSizeIndex {
  width?: LayoutSize;

  childWidth?: LayoutSize;

  height?: LayoutSize;

  childHeight?: LayoutSize;
}

export type LayoutSizeType = keyof LayoutSizeIndex;

export type LayoutSizeComponent = Split<LayoutSizeIndex>;

export function getSizeTypeFromLayoutSizeType(layoutSizeType: LayoutSizeType): 'width' | 'height' {
  return layoutSizeType === 'childWidth' ? 'width' : layoutSizeType === 'childHeight' ? 'height' : layoutSizeType;
}
