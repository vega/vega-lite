import {Config} from '../config';
import {Encoding} from '../encoding';
import * as log from '../log';
import {GenericMarkDef, isMarkDef, MarkConfig} from '../mark';
import {GenericUnitSpec, NormalizedLayerSpec} from '../spec';
import {Flag, keys} from '../util';
import {partLayerMixins} from './common';

export const CALLOUT: 'callout' = 'callout';
export type Callout = typeof CALLOUT;

export type CalloutPart = 'line' | 'label';

const CALLOUT_PART_INDEX: Flag<CalloutPart> = {
  line: 1,
  label: 1
};

export const CALLOUT_PARTS = keys(CALLOUT_PART_INDEX);

// TODO: Currently can't use `PartsMixins<CalloutPart>`
// as the schema generator will fail
export type CalloutPartsMinxins = {
  [part in CalloutPart]?: MarkConfig
};

export interface CalloutConfig extends CalloutPartsMinxins {
  /**
   * Angle of callout line.
   * __Default value:__ `45`
   */
  angle?: number;

  /**
   * Offset distance between the data point and the callout line.
   * __Default value:__ `0`
   */
  lineOffset?: number;

  /**
   * Length of callout line.
   * __Default value:__ `30`
   */
  lineLength?: number;

  /**
   * Offset distance between callout line and label
   * __Default value:__ `2`
   */
  labelOffset?: number;
}

export const DEFAULT_CALLOUT_CONFIG: CalloutConfig = {
  angle: 45,
  lineOffset: 0,
  lineLength: 30,
  labelOffset: 2,
  label: {
    align: 'left',
    baseline: 'middle'
  },
  line: {}
};

export interface CalloutDef extends GenericMarkDef<Callout>, CalloutConfig {}

export interface CalloutConfigMixins {
  /**
   * Callout Rule Config
   */
  callout?: CalloutConfig;
}

export function normalizeCallout(spec: GenericUnitSpec<Encoding<string>, Callout | CalloutDef>, config: Config): NormalizedLayerSpec {
  // TODO:  determine what's the general rule for applying selection for composite marks
  const {mark, selection: _sel, projection: _p, encoding, ...outerSpec} = spec;
  const markDef = {
    ...config.callout,
    ...isMarkDef(mark) ? mark : {type: mark}
  };

  const {angle, lineOffset, lineLength, labelOffset} = markDef;

  const calloutOffsetCoor1 = getCoordinateFromAngleAndLength(angle, lineOffset);
  const calloutOffsetCoor2 = getCoordinateFromAngleAndLength(angle, lineOffset + lineLength);
  const labelTotalOffsetCoor = getCoordinateFromAngleAndLength(angle, lineOffset + lineLength + labelOffset);

  const {text, size, ...encodingWithoutTextAndSize} = encoding;
  if (!text) {
    log.warn('callout mark should have text encoding');
  }

  return {
    ...outerSpec,
    layer: [
      ...partLayerMixins<CalloutPartsMinxins>(
        markDef, 'line', config.callout,
        { // callout
          mark: {
            type: 'rule',
            xOffset: calloutOffsetCoor1.x,
            yOffset: calloutOffsetCoor1.y,
            x2Offset: calloutOffsetCoor2.x,
            y2Offset: calloutOffsetCoor2.y
          },
          encoding: {
            x2: encoding.x,
            y2: encoding.y,
            ...encodingWithoutTextAndSize
          }
        }
      ),
      ...partLayerMixins<CalloutPartsMinxins>(
        markDef, 'label', config.callout,
        { // label
          mark: {
            type: 'text',
            xOffset: labelTotalOffsetCoor.x,
            yOffset: labelTotalOffsetCoor.y,
          },
          encoding
        }
      )
    ]
  };
}

function getCoordinateFromAngleAndLength(angle: number, length: number): {x: number, y: number} {
  const radian = angle * Math.PI / 180;
  return {x: length * Math.cos(radian), y: -1 * length * Math.sin(radian)};
}
