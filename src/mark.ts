export namespace Mark {
  export const AREA: 'area' = 'area';
  export type AREA = typeof AREA;
  export const BAR: 'bar' = 'bar';
  export type BAR = typeof BAR;
  export const LINE: 'line' = 'line';
  export type LINE = typeof LINE;
  export const POINT: 'point' = 'point';
  export type POINT = typeof POINT;
  export const TEXT: 'text' = 'text';
  export type TEXT = typeof TEXT;
  export const TICK: 'tick' = 'tick';
  export type TICK = typeof TICK;
  export const RECT: 'rect' = 'rect';
  export type RECT = typeof RECT;
  export const RULE: 'rule' = 'rule';
  export type RULE = typeof RULE;
  export const CIRCLE: 'circle' = 'circle';
  export type CIRCLE = typeof CIRCLE;
  export const SQUARE: 'square' = 'square';
  export type SQUARE = typeof SQUARE;
  export const ERRORBAR: 'errorBar' = 'errorBar';
  export type ERRORBAR = typeof ERRORBAR;
}
export type Mark = Mark.AREA | Mark.BAR | Mark.LINE | Mark.POINT | Mark.TEXT | Mark.TICK | Mark.RECT | Mark.RULE | Mark.CIRCLE | Mark.SQUARE | Mark.ERRORBAR;

export const AREA = Mark.AREA;
export const BAR = Mark.BAR;
export const LINE = Mark.LINE;
export const POINT = Mark.POINT;
export const TEXT = Mark.TEXT;
export const TICK = Mark.TICK;
export const RECT = Mark.RECT;
export const RULE = Mark.RULE;

export const CIRCLE = Mark.CIRCLE;
export const SQUARE = Mark.SQUARE;

export const ERRORBAR = Mark.ERRORBAR;
export const PRIMITIVE_MARKS = [AREA, BAR, LINE, POINT, TEXT, TICK, RULE, CIRCLE, SQUARE];
