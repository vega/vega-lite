import {Axis, AxisPart} from '../../axis';
import {duplicate} from '../../util';
import {VgAxis} from '../../vega.schema';
import {Split} from '../split';


function isFalseOrNull(v: boolean | null) {
  return v === false || v === null;
}


export class AxisComponent extends Split<Partial<VgAxis>> {
  constructor(
    public readonly explicit: Partial<VgAxis> = {},
    public readonly implicit: Partial<VgAxis> = {},
    public mainExtracted = false
  ) {
    super();
  }

  public clone() {
    return new AxisComponent(
      duplicate(this.explicit),
      duplicate(this.implicit), this.mainExtracted
    );
  }

  public hasAxisPart(part: AxisPart) {
    // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.

    if (part === 'axis') { // always has the axis container part
      return true;
    }

    if (part === 'grid' || part === 'title') {
      return !!this.get(part);
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(this.get(part));
  }
}

export interface AxisComponentIndex {
  x?: AxisComponent[];
  y?: AxisComponent[];
}

export interface AxisIndex {
  x?: Axis;
  y?: Axis;
}
