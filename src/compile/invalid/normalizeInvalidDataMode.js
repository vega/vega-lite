export function normalizeInvalidDataMode(mode, {isPath}) {
  if (mode === undefined || mode === 'break-paths-show-path-domains') {
    return isPath ? 'break-paths-show-domains' : 'filter';
  } else if (mode === null) {
    return 'show';
  }
  return mode;
}
//# sourceMappingURL=normalizeInvalidDataMode.js.map
