import { isArray } from 'vega-util';
import { isBinning } from '../../bin';
import { isColorChannel, isScaleChannel, rangeType } from '../../channel';
import * as log from '../../log';
import { channelSupportScaleType, scaleTypeSupportDataType } from '../../scale';
import * as util from '../../util';
/**
 * Determine if there is a specified scale type and if it is appropriate,
 * or determine default type if type is unspecified or inappropriate.
 */
// NOTE: CompassQL uses this method.
export function scaleType(specifiedScale, channel, fieldDef, mark, scaleConfig) {
    const defaultScaleType = defaultType(channel, fieldDef, mark, specifiedScale, scaleConfig);
    const { type } = specifiedScale;
    if (!isScaleChannel(channel)) {
        // There is no scale for these channels
        return null;
    }
    if (type !== undefined) {
        // Check if explicitly specified scale type is supported by the channel
        if (!channelSupportScaleType(channel, type)) {
            log.warn(log.message.scaleTypeNotWorkWithChannel(channel, type, defaultScaleType));
            return defaultScaleType;
        }
        // Check if explicitly specified scale type is supported by the data type
        if (!scaleTypeSupportDataType(type, fieldDef.type, fieldDef.bin)) {
            log.warn(log.message.scaleTypeNotWorkWithFieldDef(type, defaultScaleType));
            return defaultScaleType;
        }
        return type;
    }
    return defaultScaleType;
}
/**
 * Determine appropriate default scale type.
 */
// NOTE: Voyager uses this method.
function defaultType(channel, fieldDef, mark, specifiedScale, scaleConfig) {
    switch (fieldDef.type) {
        case 'nominal':
        case 'ordinal':
            if (isColorChannel(channel) || rangeType(channel) === 'discrete') {
                if (channel === 'shape' && fieldDef.type === 'ordinal') {
                    log.warn(log.message.discreteChannelCannotEncode(channel, 'ordinal'));
                }
                return 'ordinal';
            }
            if (util.contains(['x', 'y'], channel)) {
                if (util.contains(['rect', 'bar', 'rule'], mark)) {
                    // The rect/bar mark should fit into a band.
                    // For rule, using band scale to make rule align with axis ticks better https://github.com/vega/vega-lite/issues/3429
                    return 'band';
                }
                if (mark === 'bar') {
                    return 'band';
                }
            }
            // Otherwise, use ordinal point scale so we can easily get center positions of the marks.
            return 'point';
        case 'temporal':
            if (isColorChannel(channel)) {
                return 'time';
            }
            else if (rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'temporal'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            return 'time';
        case 'quantitative':
            if (isColorChannel(channel)) {
                if (isBinning(fieldDef.bin)) {
                    return 'bin-ordinal';
                }
                const { domain = undefined, range = undefined } = specifiedScale || {};
                if (domain && isArray(domain) && domain.length > 2 && (range && isArray(range) && range.length > 2)) {
                    // If there are piecewise domain and range specified, use linear as default color scale as sequential does not support piecewise domain
                    return 'linear';
                }
                // Use `sequential` as the default color scale for continuous data
                // since it supports both array range and scheme range.
                return 'sequential';
            }
            else if (rangeType(channel) === 'discrete') {
                log.warn(log.message.discreteChannelCannotEncode(channel, 'quantitative'));
                // TODO: consider using quantize (equivalent to binning) once we have it
                return 'ordinal';
            }
            // x and y use a linear scale because selections don't work with bin scales.
            // Binned scales apply discretization but pan/zoom apply transformations to a [min, max] extent domain.
            if (isBinning(fieldDef.bin) && channel !== 'x' && channel !== 'y') {
                return 'bin-linear';
            }
            return 'linear';
        case 'geojson':
            return undefined;
    }
    /* istanbul ignore next: should never reach this */
    throw new Error(log.message.invalidFieldType(fieldDef.type));
}
//# sourceMappingURL=type.js.map