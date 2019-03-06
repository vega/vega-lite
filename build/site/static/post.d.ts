import { Renderers } from 'vega';
import { Config as VgConfig } from 'vega';
import { Config as VlConfig } from '../../src/config';
export declare type Mode = 'vega' | 'vega-lite';
export declare type Config = VlConfig | VgConfig;
/**
 * Open editor url in a new window, and pass a message.
 */
export declare function post(window: Window, url: string, data: {
    config?: any;
    mode: any;
    renderer?: Renderers;
    spec: string;
}): void;
