import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Render options accept both JSON files and exported JavaScript objects.
export async function loadConfig(file) {
  const extension = path.extname(file).toLowerCase();
  if (['.js', '.mjs', '.cjs'].includes(extension)) {
    const module = await import(pathToFileURL(path.resolve(file)).href);
    return module.default ?? module;
  }
  return JSON.parse(readFileSync(file, 'utf8'));
}

export async function localeOptions(formatFile, timeFormatFile) {
  if (!formatFile && !timeFormatFile) return {};
  const [number, time] = await Promise.all([
    formatFile ? loadConfig(formatFile) : undefined,
    timeFormatFile ? loadConfig(timeFormatFile) : undefined,
  ]);
  return {
    locale: {
      ...(formatFile ? {number} : {}),
      ...(timeFormatFile ? {time} : {}),
    },
  };
}
