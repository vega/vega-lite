import {ScaleChannel} from '../../channel';
import {VgScale} from '../../vega.schema';

export type ScaleComponent = VgScale;

export type ScaleComponentIndex = {[P in ScaleChannel]?: ScaleComponent};
