import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel.js';
import {channelDefType, getFieldOrDatumDef, isFieldDef, isPositionFieldOrDatumDef} from '../../channeldef.js';
import {formatCustomType, isCustomFormatType} from '../format.js';
import {UnitModel} from '../unit.js';
import {defaultBandPosition} from './properties.js';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  return labelsPositionSpec(model, channel, labelsTextSpec(model, channel, specifiedLabelsSpec));
}

function labelsTextSpec(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const {encoding, config} = model;

  const fieldOrDatumDef =
    getFieldOrDatumDef<string>(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
  const axis = model.axis(channel) || {};
  const {format, formatType} = axis;

  if (isCustomFormatType(formatType)) {
    return {
      text: formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format,
        formatType,
        config,
      }),
      ...specifiedLabelsSpec,
    };
  } else if (format === undefined && formatType === undefined && config.customFormatTypes) {
    if (channelDefType(fieldOrDatumDef) === 'quantitative') {
      if (
        isPositionFieldOrDatumDef(fieldOrDatumDef) &&
        fieldOrDatumDef.stack === 'normalize' &&
        config.normalizedNumberFormatType
      ) {
        return {
          text: formatCustomType({
            fieldOrDatumDef,
            field: 'datum.value',
            format: config.normalizedNumberFormat,
            formatType: config.normalizedNumberFormatType,
            config,
          }),
          ...specifiedLabelsSpec,
        };
      } else if (config.numberFormatType) {
        return {
          text: formatCustomType({
            fieldOrDatumDef,
            field: 'datum.value',
            format: config.numberFormat,
            formatType: config.numberFormatType,
            config,
          }),
          ...specifiedLabelsSpec,
        };
      }
    }
    if (
      channelDefType(fieldOrDatumDef) === 'temporal' &&
      config.timeFormatType &&
      isFieldDef(fieldOrDatumDef) &&
      !fieldOrDatumDef.timeUnit
    ) {
      return {
        text: formatCustomType({
          fieldOrDatumDef,
          field: 'datum.value',
          format: config.timeFormat,
          formatType: config.timeFormatType,
          config,
        }),
        ...specifiedLabelsSpec,
      };
    }
  }
  return specifiedLabelsSpec;
}

/**
 * Vega positions band-scale axis labels at the band center regardless of the axis `bandPosition`
 * (only ticks and grid lines move), so ranged offset marks need an explicit label position
 * override to anchor the labels at the in-band baseline.
 */
function labelsPositionSpec(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  if ('x' in specifiedLabelsSpec || 'y' in specifiedLabelsSpec) {
    return specifiedLabelsSpec;
  }

  const inferredBandPosition = defaultBandPosition(model, channel);

  if (inferredBandPosition === undefined) {
    // Without an offset-driven band position, Vega's axis handles any specified bandPosition natively.
    return specifiedLabelsSpec;
  }

  const bandPosition = model.axis(channel)?.bandPosition ?? inferredBandPosition;

  if (bandPosition === 0.5) {
    return specifiedLabelsSpec;
  }

  const positionRef = {
    scale: model.scaleName(channel),
    signal: 'datum.value',
    band: bandPosition,
  };

  return {
    ...(channel === 'x' ? {x: positionRef} : {y: positionRef}),
    ...specifiedLabelsSpec,
  };
}
