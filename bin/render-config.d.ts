export function loadConfig(file: string): Promise<Record<string, unknown>>;

export function localeOptions(
  formatFile?: string,
  timeFormatFile?: string,
): Promise<{
  locale?: {
    number?: Record<string, unknown>;
    time?: Record<string, unknown>;
  };
}>;
