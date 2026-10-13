export function loadJSON(file: string): Record<string, unknown>;

export function localeOptions(
  formatFile?: string,
  timeFormatFile?: string,
): {
  locale?: {
    number?: Record<string, unknown>;
    time?: Record<string, unknown>;
  };
};
