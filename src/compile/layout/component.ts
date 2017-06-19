import {Split} from '../split';
export interface LayoutSize {
  width?: number;
  height?: number;
}

export type LayoutSizeComponent = Split<LayoutSize>;
