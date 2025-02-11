import {Axis as VgAxis, SignalRef, Text} from 'vega';
import {
  AxisInternal,
  AxisPart,
  AxisPropsWithCondition,
  COMMON_AXIS_PROPERTIES_INDEX,
  ConditionalAxisProp,
} from '../../axis.js';
import {FieldDefBase} from '../../channeldef.js';
import {duplicate, Flag, keys} from '../../util.js';
import {isSignalRef} from '../../vega.schema.js';
import {Split} from '../split.js';

function isFalseOrNull(v: any) {
  return v === false || v === null;
}

export type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> &
  Omit<AxisPropsWithCondition<SignalRef>, 'title'> & {
    title: Text | FieldDefBase<string>[] | SignalRef;
    labelExpr: string;
    disable: boolean;
  };

const AXIS_COMPONENT_PROPERTIES_INDEX: Flag<keyof AxisComponentProps> = {
  disable: 1,
  gridScale: 1,
  scale: 1,
  ...COMMON_AXIS_PROPERTIES_INDEX,
  labelExpr: 1,
  encode: 1,
};

export const AXIS_COMPONENT_PROPERTIES = keys(AXIS_COMPONENT_PROPERTIES_INDEX);

export class AxisComponent extends Split<AxisComponentProps> {
  constructor(
    public readonly explicit: Partial<AxisComponentProps> = {},
    public readonly implicit: Partial<AxisComponentProps> = {},
    public mainExtracted = false,
  ) {
    super();
  }

  public clone() {
    return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
  }

  public hasAxisPart(part: AxisPart) {
    // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.

    if (part === 'axis') {
      // always has the axis container part
      return true;
    }

    if (part === 'grid' || part === 'title') {
      return !!this.get(part);
    }
    // Other parts are enabled by default, so they should not be false or null.
    return !isFalseOrNull(this.get(part));
  }

  public hasOrientSignalRef() {
    return isSignalRef(this.explicit.orient);
  }
}

export interface AxisComponentIndex {
  x?: AxisComponent[];
  y?: AxisComponent[];
}

export interface AxisInternalIndex {
  x?: AxisInternal;
  y?: AxisInternal;
}
