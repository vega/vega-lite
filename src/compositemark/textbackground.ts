import {UnitSpec} from '../spec/index.js';
import {TextConfig, getMarkType} from '../mark.js';
import {Field} from '../channeldef.js';
import {ExprRef} from 'vega';
import {UnitModel} from '../compile/unit.js';
import {Padding} from '../spec/toplevel.js';

const DEFAULT_BG_COLOR = 'white';
const DEFAULT_PADDING = 2;
const DEFAULT_OPACITY = 1;
const DEFAULT_CORNER_RADIUS = 0;

let textLayerId = 0;

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
    const {bgType, bgColor, bgOpacity, bgPadding, bgCornerRadius} = textMarkConfig;
    const strokeWidth = getPadding(bgPadding, 'top');

    // duplicate text mark with bgColor as color and larger stroke-width to create an outline
    if (bgType === 'outline') {
      textMarkConfig.align = 'center';
      return {
        layer: [
          {
            ...spec,
            mark: {
              ...textMarkConfig,
              stroke: bgColor || DEFAULT_BG_COLOR,
              strokeWidth,
            },
          },
          {...spec},
        ],
      };
    }
    // add a layer with rectangles behind the text marks
    if (bgColor) {
      const markName = spec.name || `text_${textLayerId}`;
      textLayerId++;
      return {
        layer: [
          {...spec, name: `_fg_${markName}`},
          {
            name: `_bg_${markName}`,
            mark: {
              type: 'rect',
              fill: bgColor,
              opacity: bgOpacity || DEFAULT_OPACITY,
              cornerRadius: bgCornerRadius || DEFAULT_CORNER_RADIUS,
              bgPadding,
            },
          },
        ],
      };
    }
  }
  return spec;
}

export function parseVgTextBackgroundMarks(markGroup: any[], model: UnitModel) {
  const markDef = markGroup[0];
  // add z-index to text foreground
  if (model.name.startsWith('_fg_text')) {
    markDef.zindex = 1;
  }
  // use vega's reactive geometry to position backgroundv rectangles relatively to foreground text
  if (model.name.startsWith('_bg_text')) {
    const {bgPadding} = model.markDef;
    const dataSource = `${model.name.replace('bg', 'fg')}_marks`;
    markDef.from.data = dataSource;
    markDef.encode.update = {
      ...markDef.encode.update,
      x: {field: 'bounds.x1', offset: -getPadding(bgPadding, 'left')},
      x2: {field: 'bounds.x2', offset: getPadding(bgPadding, 'right')},
      y: {field: 'bounds.y1', offset: -getPadding(bgPadding, 'top')},
      y2: {field: 'bounds.y2', offset: getPadding(bgPadding, 'bottom')},
    };
  }
  return markGroup;
}
