export function scaledZeroOrMinOrMax({scaleName, scale, mode}) {
  const domain = `domain('${scaleName}')`;
  if (!scale || !scaleName) {
    return undefined;
  }
  const min = `${domain}[0]`;
  const max = `peek(${domain})`; // peek = the last item of the array
  // If there is a scale (and hence its name)
  const domainHasZero = scale.domainHasZero();
  // zeroOrMin or zeroOrMax mode
  if (domainHasZero === 'definitely') {
    return {
      scale: scaleName,
      value: 0,
    };
  } else if (domainHasZero === 'maybe') {
    const nonZeroValue = mode === 'zeroOrMin' ? min : max;
    return {signal: `scale('${scaleName}', inrange(0, ${domain}) ? 0 : ${nonZeroValue})`};
  } else {
    // domainHasZero === 'definitely-not'
    return {signal: `scale('${scaleName}', ${mode === 'zeroOrMin' ? min : max})`};
  }
}
//# sourceMappingURL=scaledZeroOrMinOrMax.js.map
