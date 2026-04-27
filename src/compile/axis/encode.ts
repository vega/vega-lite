import {getSecondaryRangeChannel, PositionScaleChannel} from '../../channel.js';
import {channelDefType, getFieldOrDatumDef, isFieldDef, isPositionFieldOrDatumDef} from '../../channeldef.js';
import {formatCustomType, isCustomFormatType} from '../format.js';
import {UnitModel} from '../unit.js';
import {defaultBandPosition} from './properties.js';

export function labels(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  const {encoding, config} = model;

  const fieldOrDatumDef =
    getFieldOrDatumDef<string>(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
  const axis = model.axis(channel) || {};
  const {format, formatType} = axis;

  if (isCustomFormatType(formatType)) {
    const labelsSpec = {
      text: formatCustomType({
        fieldOrDatumDef,
        field: 'datum.value',
        format,
        formatType,
        config,
      }),
      ...specifiedLabelsSpec,
    };
    return labelsPositionSpec(model, channel, labelsSpec);
  } else if (format === undefined && formatType === undefined && config.customFormatTypes) {
    if (channelDefType(fieldOrDatumDef) === 'quantitative') {
      if (
        isPositionFieldOrDatumDef(fieldOrDatumDef) &&
        fieldOrDatumDef.stack === 'normalize' &&
        config.normalizedNumberFormatType
      ) {
        const labelsSpec = {
          text: formatCustomType({
            fieldOrDatumDef,
            field: 'datum.value',
            format: config.normalizedNumberFormat,
            formatType: config.normalizedNumberFormatType,
            config,
          }),
          ...specifiedLabelsSpec,
        };
        return labelsPositionSpec(model, channel, labelsSpec);
      } else if (config.numberFormatType) {
        const labelsSpec = {
          text: formatCustomType({
            fieldOrDatumDef,
            field: 'datum.value',
            format: config.numberFormat,
            formatType: config.numberFormatType,
            config,
          }),
          ...specifiedLabelsSpec,
        };
        return labelsPositionSpec(model, channel, labelsSpec);
      }
    }
    if (
      channelDefType(fieldOrDatumDef) === 'temporal' &&
      config.timeFormatType &&
      isFieldDef(fieldOrDatumDef) &&
      !fieldOrDatumDef.timeUnit
    ) {
      const labelsSpec = {
        text: formatCustomType({
          fieldOrDatumDef,
          field: 'datum.value',
          format: config.timeFormat,
          formatType: config.timeFormatType,
          config,
        }),
        ...specifiedLabelsSpec,
      };
      return labelsPositionSpec(model, channel, labelsSpec);
    }
  }
  return labelsPositionSpec(model, channel, specifiedLabelsSpec);
}

function labelsPositionSpec(model: UnitModel, channel: PositionScaleChannel, specifiedLabelsSpec: any) {
  if ('x' in specifiedLabelsSpec || 'y' in specifiedLabelsSpec) {
    return specifiedLabelsSpec;
  }

  const scaleType = model.getScaleComponent(channel)?.get('type');
  const inferredBandPosition = defaultBandPosition({
    model,
    channel,
    mark: model.mark,
    scaleType,
  });
  const axis = model.axis(channel);
  const axisBandPosition = axis?.bandPosition ?? inferredBandPosition;

  if (axisBandPosition === undefined || axisBandPosition === 0.5) {
    return specifiedLabelsSpec;
  }

  const scaleName = model.scaleName(channel);
  const positionRef = {
    scale: scaleName,
    signal: 'datum.value',
    band: axisBandPosition,
  };

  return {
    ...(channel === 'x' ? {x: positionRef} : {y: positionRef}),
    ...specifiedLabelsSpec,
  };
}
