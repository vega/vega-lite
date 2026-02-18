import {ExprRef} from 'vega';
import {UnitSpec} from '../spec/index.js';
import {TextConfig, getMarkType} from '../mark.js';
import {Field} from '../channeldef.js';
import {UnitModel} from '../compile/unit.js';
import {Padding} from '../spec/toplevel.js';
import {isExprRef} from '../expr.js';
// import * as log from '../log/index.js';

const DEFAULT_BG_COLOR = 'white';
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_PADDING = 2;
const DEFAULT_OPACITY = 1;
const DEFAULT_CORNER_RADIUS = 0;

// we use this instead of hash from util.js because we also want a hash for specs < 250 chars
function hashSpec(spec: object): string {
  const str = JSON.stringify(spec);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    h = (h << 5) - h + char;
    h = h & h;
  }
  return Math.abs(h).toString(32);
}

function getPadding(bgPadding: Padding, side: keyof Extract<Padding, object>) {
  if (typeof bgPadding === 'number') return bgPadding;
  if (typeof bgPadding === 'object' && side in bgPadding) {
    return bgPadding[side];
  }
  return DEFAULT_PADDING;
}

export function normalizeTextWithBackground(spec: UnitSpec<Field>) {
  const {mark} = spec;
  if (getMarkType(mark) === 'text') {
    const textMarkConfig = spec.mark as TextConfig<ExprRef>;
    const {background, outline} = textMarkConfig;

    if (!background && !outline) {
      return spec;
    }

    const hashedSpec = hashSpec(spec);
    const markName = spec.name || `text_${hashedSpec}`;
    const compositeLayer: [object] = [{...spec, name: `_fg_${markName}`}];

    // add a layer with rectangles behind the text marks
    if (background) {
      let color, opacity, padding, cornerRadius;
      if (typeof background === 'object' && !isExprRef(background)) {
        color = background.color;
        opacity = background.opacity;
        padding = background.padding;
        cornerRadius = background.cornerRadius;
      } else {
        color = background;
      }

      const backgroundMark = {
        name: `_bg_${markName}`,
        mark: {
          type: 'rect',
          fill: color || DEFAULT_BG_COLOR,
          opacity: opacity || DEFAULT_OPACITY,
          cornerRadius: cornerRadius || DEFAULT_CORNER_RADIUS,
          // because the rect mark in VL doesn't have padding we use binSpacing to pass padding to VG
          padding: padding || DEFAULT_PADDING,
        },
      };

      compositeLayer.push(backgroundMark);
    }

    // duplicate text mark with outline and larger stroke-width to create an outline
    if (outline) {
      let stroke;
      let strokeWidth;

      if (typeof outline === 'object' && !isExprRef(outline)) {
        stroke = outline.color;
        strokeWidth = outline.strokeWidth;
      } else {
        stroke = outline;
      }

      const outLineMark = {
        ...spec,
        mark: {
          ...textMarkConfig,
          stroke: stroke || DEFAULT_BG_COLOR,
          strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH,
        },
      };

      compositeLayer.push(outLineMark);
    }

    return {layer: compositeLayer};
  }

  return spec;
}

export function parseVgTextBackgroundMarks(markGroup: any[], model: UnitModel) {
  const markDef = markGroup[0];
  // add z-index to text foreground
  if (model.name.startsWith('_fg_text')) {
    markDef.zindex = 1;
  }
  // use vega's reactive geometry to position background rectangles relatively to foreground text
  if (model.name.startsWith('_bg_text')) {
    const {padding} = model.markDef;
    const dataSource = `${model.name.replace('bg', 'fg')}_marks`;
    markDef.from.data = dataSource;
    markDef.encode.update = {
      ...markDef.encode.update,
      x: {field: 'bounds.x1', offset: -getPadding(padding, 'left')},
      x2: {field: 'bounds.x2', offset: getPadding(padding, 'right')},
      y: {field: 'bounds.y1', offset: -getPadding(padding, 'top')},
      y2: {field: 'bounds.y2', offset: getPadding(padding, 'bottom')},
    };
  }
  return markGroup;
}
