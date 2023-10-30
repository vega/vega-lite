import { getSecondaryRangeChannel } from '../../channel';
import { channelDefType, getFieldOrDatumDef, isFieldDef, isPositionFieldOrDatumDef } from '../../channeldef';
import { formatCustomType, isCustomFormatType } from '../format';
export function labels(model, channel, specifiedLabelsSpec) {
    const { encoding, config } = model;
    const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]) ?? getFieldOrDatumDef(encoding[getSecondaryRangeChannel(channel)]);
    const axis = model.axis(channel) || {};
    const { format, formatType } = axis;
    if (isCustomFormatType(formatType)) {
        return {
            text: formatCustomType({
                fieldOrDatumDef,
                field: 'datum.value',
                format,
                formatType,
                config
            }),
            ...specifiedLabelsSpec
        };
    }
    else if (format === undefined && formatType === undefined && config.customFormatTypes) {
        if (channelDefType(fieldOrDatumDef) === 'quantitative') {
            if (isPositionFieldOrDatumDef(fieldOrDatumDef) &&
                fieldOrDatumDef.stack === 'normalize' &&
                config.normalizedNumberFormatType) {
                return {
                    text: formatCustomType({
                        fieldOrDatumDef,
                        field: 'datum.value',
                        format: config.normalizedNumberFormat,
                        formatType: config.normalizedNumberFormatType,
                        config
                    }),
                    ...specifiedLabelsSpec
                };
            }
            else if (config.numberFormatType) {
                return {
                    text: formatCustomType({
                        fieldOrDatumDef,
                        field: 'datum.value',
                        format: config.numberFormat,
                        formatType: config.numberFormatType,
                        config
                    }),
                    ...specifiedLabelsSpec
                };
            }
        }
        if (channelDefType(fieldOrDatumDef) === 'temporal' &&
            config.timeFormatType &&
            isFieldDef(fieldOrDatumDef) &&
            !fieldOrDatumDef.timeUnit) {
            return {
                text: formatCustomType({
                    fieldOrDatumDef,
                    field: 'datum.value',
                    format: config.timeFormat,
                    formatType: config.timeFormatType,
                    config
                }),
                ...specifiedLabelsSpec
            };
        }
    }
    return specifiedLabelsSpec;
}
//# sourceMappingURL=encode.js.map