import {MarkInvalidDataMode} from '../../invalid';

type NormalizedMarkInvalidDataMode = Exclude<MarkInvalidDataMode, 'break-paths-and-keep-path-domains'>;

export function normalizeInvalidDataMode(
  mode: MarkInvalidDataMode | null | undefined,
  {isPath}: {isPath: boolean}
): NormalizedMarkInvalidDataMode {
  if (mode === undefined || mode === 'break-paths-and-keep-path-domains') {
    return isPath ? 'break-paths-keep-domains' : 'filter';
  } else if (mode === null) {
    return 'show';
  }
  return mode;
}
