import {SignalRef} from 'vega';
import {isBinning} from '../../../bin';
import {getSizeChannel} from '../../../channel';
import {RelativePointSize} from '../../../mark';
import {getBinSignalName} from '../../data/bin';
import {SignalRefWrapper} from '../../signal';
import {UnitModel} from '../../unit';
import {hasDiscreteDomain} from '../../../scale';
import {isStep} from '../../../spec/base';
import {isObject} from 'vega-util';

export function relativePointSize({
  size,
  model
}: {
  size: RelativePointSize<SignalRef>;
  model: UnitModel;
}): SignalRefWrapper {
  const widthStep = getSizeStep(model, 'x');
  const heightStep = getSizeStep(model, 'y');

  return new SignalRefWrapper(
    () => `PI * pow(${size.relative} * sqrt(${widthStep.signal} * ${heightStep.signal})/2, 2)`
  );
}

function getSizeStep(model: UnitModel, channel: 'x' | 'y'): SignalRefWrapper | SignalRef {
  const binStep = getBinStepSignal(model, channel);
  if (binStep) {
    return binStep;
  }

  const scaleType = model.getScaleType(channel);
  const sizeChannel = getSizeChannel(channel);
  const sizeSignalRef = model.getSizeSignalRef(sizeChannel);

  if (hasDiscreteDomain(scaleType)) {
    // For discrete axis, check for steps
    const size = model.size[sizeChannel];
    if (isStep(size)) {
      return {signal: `${size.step}`};
    }
    return {signal: `${sizeSignalRef.signal} / length(domain("${model.scaleName(channel)}"))`};
  }
  return sizeSignalRef;
}

export function getBinStepSignal(model: UnitModel, channel: 'x' | 'y'): SignalRefWrapper {
  const fieldDef = model.fieldDef(channel);

  if (fieldDef?.bin) {
    const {bin, field} = fieldDef;
    const sizeType = getSizeChannel(channel);
    const sizeSignal = model.getName(sizeType);

    if (isObject(bin) && bin.binned && bin.step !== undefined) {
      return new SignalRefWrapper(() => {
        const scaleName = model.scaleName(channel);
        const binCount = `(domain("${scaleName}")[1] - domain("${scaleName}")[0]) / ${bin.step}`;
        return `${model.getSignalName(sizeSignal)} / (${binCount})`;
      });
    } else if (isBinning(bin)) {
      const binSignal = getBinSignalName(model, field, bin);

      // TODO: extract this to be range step signal
      return new SignalRefWrapper(() => {
        const updatedName = model.getSignalName(binSignal);
        const binCount = `(${updatedName}.stop - ${updatedName}.start) / ${updatedName}.step`;
        return `${model.getSignalName(sizeSignal)} / (${binCount})`;
      });
    }
  }
  return undefined;
}
