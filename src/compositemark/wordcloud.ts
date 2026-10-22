import {isFieldDef, isValueDef} from '../channeldef.js';
import {Encoding} from '../encoding.js';
import {ExprRef} from '../expr.js';
import {NormalizerParams} from '../normalize/index.js';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec/index.js';
import {WordcloudTransform} from '../transform.js';
import {CompositeMarkNormalizer} from './base.js';
import {GenericCompositeMarkDef} from './common.js';

export const WORDCLOUD = 'wordcloud' as const;
export type WordCloud = typeof WORDCLOUD;

export const WORDCLOUD_PARTS = [] as const;

export interface WordcloudConfig {
  /**
   * The font family for words.
   * __Default value:__ `"sans-serif"`
   */
  font?: string;

  /**
   * The font style.
   * __Default value:__ `"normal"`
   */
  fontStyle?: string;

  /**
   * The font weight.
   * __Default value:__ `"normal"`
   */
  fontWeight?: string;

  /**
   * The [min, max] range of font sizes for scaling word sizes.
   * __Default value:__ `[10, 56]`
   */
  fontSizeRange?: [number, number];

  /**
   * Padding in pixels between words.
   * __Default value:__ `1`
   */
  padding?: number;

  /**
   * The spiral layout algorithm: `"archimedean"` or `"rectangular"`.
   * __Default value:__ `"archimedean"`
   */
  spiral?: 'archimedean' | 'rectangular';
}

export type WordcloudDef = GenericCompositeMarkDef<WordCloud> &
  WordcloudConfig & {
    /**
     * Type of the mark. For word clouds, this should always be `"wordcloud"`.
     */
    type: WordCloud;

    /**
     * A fixed font size for all words. When omitted, font sizes are scaled from
     * the `size` encoding channel using `fontSizeRange`.
     */
    fontSize?: number | ExprRef;

    /**
     * Rotation angle for all words in degrees, or an expression.
     * If the `angle` encoding channel is specified, it overrides this setting.
     * __Default value:__ `0`
     */
    rotate?: number | ExprRef;
  };

export interface WordcloudConfigMixins {
  /**
   * Wordcloud Config
   */
  wordcloud?: WordcloudConfig;
}

// Internal field name prefix to avoid collision with user data fields
const WC_PREFIX = '__wc_';
const WC_FIELDS = {
  x: `${WC_PREFIX}x`,
  y: `${WC_PREFIX}y`,
  font: `${WC_PREFIX}font`,
  fontSize: `${WC_PREFIX}fontSize`,
  fontStyle: `${WC_PREFIX}fontStyle`,
  fontWeight: `${WC_PREFIX}fontWeight`,
  angle: `${WC_PREFIX}angle`,
} as const;

const WC_AS: [string, string, string, string, string, string, string] = [
  WC_FIELDS.x,
  WC_FIELDS.y,
  WC_FIELDS.font,
  WC_FIELDS.fontSize,
  WC_FIELDS.fontStyle,
  WC_FIELDS.fontWeight,
  WC_FIELDS.angle,
];

export const wordcloudNormalizer = new CompositeMarkNormalizer(WORDCLOUD, normalizeWordcloud);

export function normalizeWordcloud(
  spec: GenericUnitSpec<Encoding<string>, WordCloud | WordcloudDef>,
  {config}: NormalizerParams,
): NormalizedUnitSpec {
  const {mark, encoding = {}, params, ...outerSpec} = spec;
  const markDef: WordcloudDef = typeof mark === 'string' ? {type: mark} : mark;

  const wcConfig: WordcloudConfig = config?.wordcloud ?? {};

  // Extract the text field (required for wordcloud)
  const textEncoding = encoding.text;
  const textField = textEncoding && isFieldDef(textEncoding) ? textEncoding.field : undefined;

  // Build the wordcloud transform
  const wcTransform: WordcloudTransform = {
    wordcloud: textField ?? 'text',
    as: WC_AS,
    font: markDef.font ?? wcConfig.font,
    fontStyle: markDef.fontStyle ?? wcConfig.fontStyle,
    fontWeight: markDef.fontWeight ?? wcConfig.fontWeight,
    padding: markDef.padding ?? wcConfig.padding,
    spiral: markDef.spiral ?? wcConfig.spiral,
  };

  // Handle fontSize: from size encoding field, markDef, or config
  const sizeEncoding = encoding.size;
  if (sizeEncoding && isFieldDef(sizeEncoding) && sizeEncoding.field) {
    wcTransform.fontSize = {field: sizeEncoding.field as string};
    wcTransform.fontSizeRange = markDef.fontSizeRange ?? wcConfig.fontSizeRange ?? [10, 56];
  } else if (markDef.fontSize !== undefined) {
    wcTransform.fontSize = markDef.fontSize as any;
  }

  // Handle rotation: from angle encoding or markDef
  const angleEncoding = encoding.angle;
  if (angleEncoding && isFieldDef(angleEncoding) && angleEncoding.field) {
    wcTransform.rotate = {field: angleEncoding.field as string};
  } else if (angleEncoding && isValueDef(angleEncoding)) {
    wcTransform.rotate = angleEncoding.value as number;
  } else if (markDef.rotate !== undefined) {
    wcTransform.rotate = markDef.rotate as any;
  }

  // Clean up undefined properties
  for (const key of Object.keys(wcTransform) as (keyof WordcloudTransform)[]) {
    if (wcTransform[key] === undefined) {
      delete wcTransform[key];
    }
  }

  // Build the output encoding for the text mark.
  // x and y use ExprRef values to bypass vega-lite's scale system — the
  // wordcloud transform already outputs pixel positions.  Using a field
  // encoding would apply a linear scale that distorts positions and inverts y.
  const outputEncoding: Encoding<string> = {
    x: {value: {expr: `datum["${WC_FIELDS.x}"]`} as ExprRef},
    y: {value: {expr: `datum["${WC_FIELDS.y}"]`} as ExprRef},
    // Re-use the text field from the original encoding
    text: textEncoding ?? {field: 'text', type: 'nominal'},
    // Font size from transform output via ExprRef to bypass size scale
    size: {value: {expr: `datum["${WC_FIELDS.fontSize}"]`} as ExprRef},
  };

  // Propagate color encoding if present
  if (encoding.color) {
    outputEncoding.color = encoding.color;
  } else if (markDef.color) {
    outputEncoding.color = {value: markDef.color} as any;
  }

  // Propagate opacity encoding if present
  if (encoding.opacity) {
    outputEncoding.opacity = encoding.opacity;
  }

  // Propagate tooltip encoding if present
  if (encoding.tooltip) {
    outputEncoding.tooltip = encoding.tooltip;
  }

  // Propagate href encoding if present
  if (encoding.href) {
    outputEncoding.href = encoding.href;
  }

  // Existing transforms in the spec are prepended; wordcloud runs first
  const transforms = [wcTransform, ...(outerSpec.transform ?? [])];

  const normalizedSpec: NormalizedUnitSpec = {
    ...outerSpec,
    transform: transforms,
    mark: {
      type: 'text',
      align: 'center',
      baseline: 'alphabetic',
      ...(markDef.clip !== undefined ? {clip: markDef.clip} : {}),
      ...(markDef.opacity !== undefined ? {opacity: markDef.opacity} : {}),
    },
    encoding: outputEncoding,
    ...(params ? {params} : {}),
  };

  return normalizedSpec;
}
