import {Config} from '../config';
import {Encoding} from '../encoding';
import * as log from '../log';
import {GenericMarkDef, isMarkDef, MarkConfig} from '../mark';
import {GenericUnitSpec, LayerSpec} from '../spec';
import {Flag, keys} from '../util';
import {getMarkDefMixins} from './common';

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
   * __Default value: `"45"`
   */
  calloutAngle?: number;
  /**
   * Offset of callout line.
   * __Default value: `"0"`
   */
  calloutOffset?: number;
  /**
   * Length of callout length.
   * __Default value: `"30"`
   */
  calloutLength?: number;
  /**
   * Offset of callout label.
   * __Default value: `"0"`
   */
  labelOffset?: number;
}

export interface CalloutDef extends GenericMarkDef<Callout>, CalloutConfig {}

export interface CalloutConfigMixins {
  /**
   * Callout Rule Config
   * @hide
   */
  callout?: CalloutConfig;
}


export function normalizeCallout(spec: GenericUnitSpec<Encoding<string>, Callout | CalloutDef>, config: Config): LayerSpec {
  // TODO:  determine what's the general rule for applying selection for composite marks
  const {mark, selection: _sel, projection: _p, encoding, ...outerSpec} = spec;
  const markDef = isMarkDef(mark) ? mark : {type: mark};

  const calloutAngle: number = markDef.calloutAngle || config.callout.calloutAngle;
  const calloutOffset: number = markDef.calloutOffset || config.callout.calloutOffset;
  const calloutLength: number = markDef.calloutLength || config.callout.calloutLength;
  const labelOffset: number = markDef.labelOffset || config.callout.labelOffset;

  const calloutOffsetCoor1: {x: number, y: number} = getCoordinateFromAngleAndLength(calloutAngle, calloutOffset);
  const calloutOffsetCoor2: {x: number, y: number} = getCoordinateFromAngleAndLength(calloutAngle, calloutOffset + calloutLength);
  const labelTotalOffsetCoor: {x: number, y: number} = getCoordinateFromAngleAndLength(calloutAngle, calloutOffset + calloutLength + labelOffset);

  const {text: textEncoding, size: sizeEncoding, ...encodingWithoutTextAndSize} = encoding;
  if (!textEncoding) {
    log.warn('callout mark should have text encoding');
  }

  const returnedSpec: LayerSpec = {
    ...outerSpec,
    layer: [
      { // label
        mark: {
          type: 'text',
          xOffset: labelTotalOffsetCoor.x,
          yOffset: labelTotalOffsetCoor.y,
          ...getMarkDefMixins<CalloutPartsMinxins>(markDef, 'label', config.callout)
        },
        encoding
      }, { // callout
        mark: {
          type: 'rule',
          xOffset: calloutOffsetCoor1.x,
          yOffset: calloutOffsetCoor1.y,
          x2Offset: calloutOffsetCoor2.x,
          y2Offset: calloutOffsetCoor2.y,
          ...getMarkDefMixins<CalloutPartsMinxins>(markDef, 'line', config.callout)
        },
        encoding: {
          x2: encoding.x,
          y2: encoding.y,
          ...encodingWithoutTextAndSize
        }
      }
    ]
  };
  return returnedSpec;
}

function getCoordinateFromAngleAndLength(angle: number, length: number): {x: number, y: number} {
  const radian = angle * Math.PI / 180;
  return {x: length * Math.cos(radian), y: -1 * length * Math.sin(radian)};
}
