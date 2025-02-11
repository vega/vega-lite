import {MarkInvalidDataMode} from '../../invalid.js';

type NormalizedMarkInvalidDataMode = Exclude<MarkInvalidDataMode, 'break-paths-show-path-domains'>;

export function normalizeInvalidDataMode(
  mode: MarkInvalidDataMode | null | undefined,
  {isPath}: {isPath: boolean},
): NormalizedMarkInvalidDataMode {
  if (mode === undefined || mode === 'break-paths-show-path-domains') {
    return isPath ? 'break-paths-show-domains' : 'filter';
  } else if (mode === null) {
    return 'show';
  }
  return mode;
}
