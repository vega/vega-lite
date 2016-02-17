export function mergeDeep(dest, ...src: any[]) {
  for (var i = 0; i < src.length; i++) {
    dest = deepMerge_(dest, src[i]);
  }
  return dest;
};

// recursively merges src into dest
function deepMerge_(dest, src) {
  if (typeof src !== 'object' || src === null) {
    return dest;
  }

  for (var p in src) {
    if (!src.hasOwnProperty(p)) {
      continue;
    }
    if (src[p] === undefined) {
      continue;
    }
    if (typeof src[p] !== 'object' || src[p] === null) {
      dest[p] = src[p];
    } else if (typeof dest[p] !== 'object' || dest[p] === null) {
      dest[p] = mergeDeep(src[p].constructor === Array ? [] : {}, src[p]);
    } else {
      mergeDeep(dest[p], src[p]);
    }
  }
  return dest;
}
