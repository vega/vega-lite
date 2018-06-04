import { NonPositionChannel } from '../channel';
import { MarkConfig } from '../mark';
export declare function getMarkSpecificConfigMixins(markSpecificConfig: MarkConfig, channel: NonPositionChannel): {
    [x: string]: {
        value: any;
    };
};
