import {ScaleChannel} from '../../channel';
import {Scale} from '../../scale';
import {VgScale} from '../../vega.schema';

export type ScaleComponent = VgScale;

export type ScaleComponentIndex = {[P in ScaleChannel]?: ScaleComponent};

export type ScaleIndex = {[P in ScaleChannel]?: Scale};
