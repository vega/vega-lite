import { FacetedCompositeUnitSpec } from './spec';
export interface RequiredChannelMap {
    [mark: string]: string[];
}
/**
 * Required Encoding Channels for each mark type
 */
export declare const DEFAULT_REQUIRED_CHANNEL_MAP: RequiredChannelMap;
export interface SupportedChannelMap {
    [mark: string]: {
        [channel: string]: boolean;
    };
}
/**
 * Supported Encoding Channel for each mark type
 */
export declare const DEFAULT_SUPPORTED_CHANNEL_TYPE: SupportedChannelMap;
/**
 * Further check if encoding mapping of a spec is invalid and
 * return error if it is invalid.
 *
 * This checks if
 * (1) all the required encoding channels for the mark type are specified
 * (2) all the specified encoding channels are supported by the mark type
 * @param  {[type]} spec [description]
 * @param  {RequiredChannelMap = DefaultRequiredChannelMap}  requiredChannelMap
 * @param  {SupportedChannelMap = DefaultSupportedChannelMap} supportedChannelMap
 * @return {String} Return one reason why the encoding is invalid,
 *                  or null if the encoding is valid.
 */
export declare function getEncodingMappingError(spec: FacetedCompositeUnitSpec, requiredChannelMap?: RequiredChannelMap, supportedChannelMap?: SupportedChannelMap): string;
