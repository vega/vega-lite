import {readFileSync} from 'fs';

// CLI -c, -f and -t flags expect parsed JSON objects, not file contents.
export function loadJSON(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

// Omit the locale option if the user did not provide a locale flag. This
// preserves locale values set in the Vega specification.
export function localeOptions(formatFile, timeFormatFile) {
  const locale = {};
  if (formatFile) locale.number = loadJSON(formatFile);
  if (timeFormatFile) locale.time = loadJSON(timeFormatFile);
  return Object.keys(locale).length ? {locale} : {};
}
