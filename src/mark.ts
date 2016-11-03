export namespace Mark {
  export const AREA: 'area' = 'area';
  export const BAR: 'bar' = 'bar';
  export const LINE: 'line' = 'line';
  export const POINT: 'point' = 'point';
  export const TEXT: 'text' = 'text';
  export const TICK: 'tick' = 'tick';
  export const RECT: 'rect' = 'rect';
  export const RULE: 'rule' = 'rule';
  export const CIRCLE: 'circle' = 'circle';
  export const SQUARE: 'square' = 'square';
  export const ERRORBAR: 'errorBar' = 'errorBar';
}
export type Mark = typeof Mark.AREA | typeof Mark.BAR | typeof Mark.LINE | typeof Mark.POINT | typeof Mark.TEXT | typeof Mark.TICK | typeof Mark.RECT | typeof Mark.RULE | typeof Mark.CIRCLE | typeof Mark.SQUARE | typeof Mark.ERRORBAR;

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
