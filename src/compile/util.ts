import {Model} from './Model';
import {FieldDef, OrderChannelDef} from '../schema/fielddef.schema';
import {COLUMN, ROW, X, Y, SIZE, COLOR, SHAPE, TEXT, LABEL, Channel} from '../channel';
import {field} from '../fielddef';
import {QUANTITATIVE, ORDINAL, TEMPORAL} from '../type';
import {format as timeFormatExpr} from './time';
import {contains} from '../util';

export enum ColorMode {
  ALWAYS_FILLED,
  ALWAYS_STROKED,
  FILLED_BY_DEFAULT,
  STROKED_BY_DEFAULT
}

export const FILL_STROKE_CONFIG = ['fill', 'fillOpacity',
  'stroke', 'strokeWidth', 'strokeDash', 'strokeDashOffset', 'strokeOpacity',
  'opacity'];

export function applyColorAndOpacity(p, model: Model, colorMode: ColorMode = ColorMode.STROKED_BY_DEFAULT) {
  const filled = colorMode === ColorMode.ALWAYS_FILLED ? true :
    colorMode === ColorMode.ALWAYS_STROKED ? false :
      model.config().mark.filled !== undefined ? model.config().mark.filled :
        colorMode === ColorMode.FILLED_BY_DEFAULT ? true :
          false; // ColorMode.STROKED_BY_DEFAULT

  const fieldDef = model.fieldDef(COLOR);
  if (filled) {
    if (model.has(COLOR)) {
      p.fill = {
        scale: model.scaleName(COLOR),
        field: model.field(COLOR, fieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
      };
    } else if (fieldDef.value) {
      p.fill = { value: fieldDef.value };
    } else {
      p.fill = { value: model.config().mark.color };
    }
  } else {
    if (model.has(COLOR)) {
      p.stroke = {
        scale: model.scaleName(COLOR),
        field: model.field(COLOR, fieldDef.type === ORDINAL ? {prefn: 'rank_'} : {})
      };
    } else if (fieldDef.value) {
      p.stroke = { value: fieldDef.value };
    } else {
      p.stroke = { value: model.config().mark.color };
    }
  }

  // Apply fill and stroke config later
  // `fill` and `stroke` config can override `color` config
  applyMarkConfig(p, model, FILL_STROKE_CONFIG);
}

export function applyMarkConfig(marksProperties, model: Model, propsList: string[]) {
  propsList.forEach(function(property) {
    const value = model.config().mark[property];
    if (value !== undefined) {
      marksProperties[property] = { value: value };
    }
  });
}


/**
 * Builds an object with format and formatType properties.
 *
 * @param format explicitly specified format
 */
export function formatMixins(model: Model, channel: Channel, format: string) {
  const fieldDef = model.fieldDef(channel);

  if(!contains([QUANTITATIVE, TEMPORAL], fieldDef.type)) {
    return {};
  }

  let def: any = {};

  if (fieldDef.type === TEMPORAL) {
    def.formatType = 'time';
  }

  if (format !== undefined) {
    def.format = format;
  } else {
    switch (fieldDef.type) {
      case QUANTITATIVE:
        def.format = model.config().numberFormat;
        break;
      case TEMPORAL:
        def.format = timeFormat(model, channel) || model.config().timeFormat;
        break;
    }
  }

  if (channel === TEXT) {
    // text does not support format and formatType
    // https://github.com/vega/vega/issues/505

    const filter = (def.formatType || 'number') + (def.format ? ':\'' + def.format + '\'' : '');
    return {
      text: {
        template: '{{' + model.field(channel, { datum: true }) + ' | ' + filter + '}}'
      }
    };
  }

  return def;
}

function isAbbreviated(model: Model, channel: Channel, fieldDef: FieldDef) {
  switch (channel) {
    case ROW:
    case COLUMN:
    case X:
    case Y:
      return model.axis(channel).shortTimeLabels;
    case COLOR:
    case SHAPE:
    case SIZE:
      return model.legend(channel).shortTimeLabels;
    case TEXT:
      return model.config().mark.shortTimeLabels;
    case LABEL:
      // TODO(#897): implement when we have label
  }
  return false;
}



/** Return field reference with potential "-" prefix for descending sort */
export function sortField(orderChannelDef: OrderChannelDef) {
  return (orderChannelDef.sort === 'descending' ? '-' : '') + field(orderChannelDef);
}

/**
 * Returns the time format used for axis labels for a time unit.
 */
export function timeFormat(model: Model, channel: Channel): string {
  const fieldDef = model.fieldDef(channel);
  return timeFormatExpr(fieldDef.timeUnit, isAbbreviated(model, channel, fieldDef));
}
