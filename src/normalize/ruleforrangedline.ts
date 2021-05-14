import {isObject} from 'vega-util';
import {isBinned} from '../bin';
import {getMainRangeChannel, SECONDARY_RANGE_CHANNEL} from '../channel';
import {Field, isDatumDef, isFieldDef} from '../channeldef';
import {Encoding} from '../encoding';
import * as log from '../log';
import {isMarkDef} from '../mark';
import {GenericSpec} from '../spec';
import {GenericUnitSpec, isUnitSpec} from '../spec/unit';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base';

interface EncodingX2Mixins {
  x2: Encoding<Field>['x2'];
}

interface EncodingY2Mixins {
  y2: Encoding<Field>['y2'];
}

type RangedLineSpec = GenericUnitSpec<Encoding<Field> & (EncodingX2Mixins | EncodingY2Mixins), 'line' | {mark: 'line'}>;

export class RuleForRangedLineNormalizer implements NonFacetUnitNormalizer<RangedLineSpec> {
  public name = 'RuleForRangedLine';

  public hasMatchingType(spec: GenericSpec<any, any, any, any>): spec is RangedLineSpec {
    if (isUnitSpec(spec)) {
      const {encoding, mark} = spec;
      if (mark === 'line' || (isMarkDef(mark) && mark.type === 'line')) {
        for (const channel of SECONDARY_RANGE_CHANNEL) {
          const mainChannel = getMainRangeChannel(channel);
          const mainChannelDef = encoding[mainChannel];

          if (encoding[channel]) {
            if ((isFieldDef(mainChannelDef) && !isBinned(mainChannelDef.bin)) || isDatumDef(mainChannelDef)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  public run(spec: RangedLineSpec, params: NormalizerParams, normalize: NormalizeLayerOrUnit) {
    const {encoding, mark} = spec;
    log.warn(log.message.lineWithRange(!!encoding.x2, !!encoding.y2));

    return normalize(
      {
        ...spec,
        mark: isObject(mark) ? {...mark, type: 'rule'} : 'rule'
      },
      params
    );
  }
}
