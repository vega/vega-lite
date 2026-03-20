# Word Cloud Support in Vega-Lite: Design Document

## Summary

We propose adding word cloud visualization support to Vega-Lite via `"mark": "wordcloud"` — a new first-class mark (like `geoshape`). Under the hood, it compiles to a Vega `text` mark and automatically injects Vega's [`wordcloud`](https://vega.github.io/vega/docs/transforms/wordcloud/) layout transform as a post-encoding transform. The user never writes the layout transform directly. (See [Decision: Wordcloud as mark](#wordcloud-as-mark-preferred-vs-exposing-wordcloud-transform).)

Unlike `treemap`, the wordcloud mark does not require hierarchy transforms — it operates on flat data where each row represents a word (or phrase) with optional frequency/weight fields. This makes it the simplest instance of the "mark as layout" pattern described in the [treemap design doc](2026-03-18-treemap.md#beyond-hierarchies-the-mark-as-layout-pattern).

**Proposed Vega-Lite spec:**

```json
{
  "data": {
    "values": [
      {"word": "Vega", "count": 120},
      {"word": "Lite", "count": 95},
      {"word": "Data", "count": 80},
      {"word": "Visual", "count": 65},
      {"word": "Grammar", "count": 50},
      "..."
    ]
  },
  "mark": "wordcloud",
  "encoding": {
    "text": {"field": "word", "type": "nominal"},
    "size": {"field": "count", "type": "quantitative", "scale": {"range": [10, 56]}}
  }
}
```

**Compiled Vega output:**

```json
{
  "marks": [
    {
      "type": "text",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "text": {"field": "word"},
          "align": {"value": "center"},
          "baseline": {"value": "alphabetic"}
        }
      },
      "transform": [
        {
          "type": "wordcloud",
          "size": [{"signal": "width"}, {"signal": "height"}],
          "text": {"field": "datum.word"},
          "fontSize": {"field": "datum.count"},
          "fontSizeRange": [10, 56],
          "padding": 2
        }
      ]
    }
  ]
}
```

---

## How it works under the hood

### The `wordcloud` mark

The proposed `wordcloud` mark would compile to a Vega `text` mark. It injects Vega's `wordcloud` transform as a **post-encoding transform** — the same mechanism `geoshape` uses to inject its `geoshape` transform. This is different from `treemap`, which injects transforms into the data pipeline.

| Aspect              | `geoshape` (existing)             | `wordcloud` (proposed)                |
| ------------------- | --------------------------------- | ------------------------------------- |
| Mark enum           | `Mark.geoshape`                   | `Mark.wordcloud`                      |
| Vega mark type      | `shape`                           | `text`                                |
| Transform location  | `postEncodingTransform`           | `postEncodingTransform`               |
| Internal transforms | `geoshape`                        | `wordcloud`                           |
| Layout sizing       | projection                        | `size: [{signal: "width"}, {signal: "height"}]` |

The Vega `wordcloud` transform computes `x`, `y`, `fontSize`, `fontStyle`, `fontWeight`, `angle`, and `font` for each word. It reads its sizing from the `size` parameter (set to `[{signal: "width"}, {signal: "height"}]` so the layout fills the view). The layout algorithm places words to avoid overlap using a spiral placement strategy.

**Alignment constraint:** Vega's wordcloud layout requires `align: "center"` and `baseline: "alphabetic"` on the text mark. The mark compiler would always set these values, overriding any user encoding. This is an internal implementation detail documented in [Vega's wordcloud docs](https://vega.github.io/vega/docs/transforms/wordcloud/).

### Encoding channels

The wordcloud mark would support the following encoding channels:

| Channel     | Required | Maps to                         | Scale generated |
| ----------- | -------- | ------------------------------- | --------------- |
| `text`      | Yes      | Wordcloud `text` param + text mark `text` encoding | No |
| `size`      | No       | Wordcloud `fontSize` param; `scale.range` → `fontSizeRange` | Yes (range only — see [Decision: Size mapping](#size-mapping-scale-range-to-fontsizerange)) |
| `color`     | No       | Text mark `fill`                | Yes (standard)  |
| `angle`     | No       | Wordcloud `rotate` param        | No              |
| `opacity`   | No       | Text mark `fillOpacity`         | Yes (standard)  |
| `tooltip`   | No       | Standard tooltip                | —               |
| `href`      | No       | Standard href                   | —               |

**Blocked channels:** `x`, `y`, `x2`, `y2`, `xOffset`, `yOffset`, `latitude`, `longitude` — positions come from the layout, not from user encoding. This follows the same pattern as `treemap` blocking `x`/`y`.

The `text` encoding is the only encoding specific to wordcloud. It serves double duty: it both sets the visible text on the Vega `text` mark and tells the wordcloud transform which field to lay out. All other supported channels (`color`, `opacity`, `tooltip`, `href`) work the same as they do on regular text marks.

If `size` is omitted, all words are rendered at the same font size (using the mark def's `fontSize` or the config default). When `size` is present, `scale.range` (default `[10, 56]`) controls the font size range — the mark compiler reads this range and passes it to the Vega transform's `fontSizeRange` parameter. If `angle` is omitted, all words are horizontal (0 degrees), unless the mark def specifies a `rotate` value.

### Mark definition properties

These layout parameters would go on the mark def (e.g. `"mark": {"type": "wordcloud", "spiral": "rectangular"}`). They control the wordcloud layout algorithm. All defaults match Vega's defaults.

| Property        | Type                           | Default         | Description |
| --------------- | ------------------------------ | --------------- | ----------- |
| `font`          | String                         | `"Helvetica Neue, Arial"` | Font family for all words |
| `fontStyle`     | String                         | `"normal"`      | Font style for all words |
| `fontWeight`    | String \| Number               | `"normal"`      | Font weight for all words |
| `fontSize`      | Number                         | `14`            | Uniform font size when no `size` encoding is specified |
| `padding`       | Number                         | `2`             | Pixel padding between words |
| `spiral`        | `"archimedean"` \| `"rectangular"` | `"archimedean"` | Spiral layout method for word placement |
| `rotate`        | Number                         | `0`             | Default rotation angle (degrees) when no `angle` encoding is specified |

Font size scaling range is controlled via `scale.range` on the `size` encoding (e.g. `"size": {"field": "count", "scale": {"range": [10, 56]}}`), not via a mark def property. The mark compiler reads this range and passes it to the Vega transform's `fontSizeRange`. Default range is `[10, 56]`.

#### Per-datum properties via encoding vs mark def

Vega's wordcloud transform allows several properties (`fontSize`, `rotate`, `font`, `fontWeight`, `fontStyle`) to vary per datum via field references or expressions. In Vega-Lite, we propose mapping these through encoding channels where VL already has matching channels:

- **`fontSize`** ← `size` encoding (per-datum via field, scaled by `scale.range`) or mark def `fontSize` (constant)
- **`rotate`** ← `angle` encoding (per-datum via field) or mark def `rotate` (constant)
- **`font`**, **`fontWeight`**, **`fontStyle`** ← mark def only (constant for all words)

Per-datum `font`/`fontWeight`/`fontStyle` via encoding would require new VL channels that don't exist today. This is out of scope for the initial implementation — constant values via the mark def cover the common case. Per-datum typography channels can be added later without breaking the constant-value API.

---

## Encoding examples

### Minimal: words with uniform size

```json
{
  "data": {
    "values": [
      {"word": "Vega"},
      {"word": "Lite"},
      {"word": "Data"},
      {"word": "Visualization"},
      {"word": "Grammar"}
    ]
  },
  "mark": "wordcloud",
  "encoding": {
    "text": {"field": "word", "type": "nominal"}
  }
}
```

All words are rendered at the default font size (14px) with no scaling.

### Size by frequency

```json
{
  "data": {
    "values": [
      {"word": "Vega", "count": 120},
      {"word": "Lite", "count": 95},
      {"word": "Data", "count": 80},
      {"word": "Visual", "count": 65},
      {"word": "Grammar", "count": 50}
    ]
  },
  "mark": "wordcloud",
  "encoding": {
    "text": {"field": "word", "type": "nominal"},
    "size": {"field": "count", "type": "quantitative"}
  }
}
```

Word font sizes are scaled to the `size` channel's default `scale.range` of `[10, 56]`, which the mark compiler passes to the Vega transform's `fontSizeRange`. The transform applies a sqrt scale internally.

### Color by category

```json
{
  "data": {
    "values": [
      {"word": "Vega", "count": 120, "category": "core"},
      {"word": "Lite", "count": 95, "category": "core"},
      {"word": "React", "count": 80, "category": "frontend"},
      {"word": "D3", "count": 65, "category": "vis"},
      {"word": "SVG", "count": 50, "category": "frontend"}
    ]
  },
  "mark": "wordcloud",
  "encoding": {
    "text": {"field": "word", "type": "nominal"},
    "size": {"field": "count", "type": "quantitative"},
    "color": {"field": "category", "type": "nominal"}
  }
}
```

Words are colored by category using a standard ordinal color scale (generated by VL's normal scale infrastructure — `color` is not consumed by the transform).

### Rotation via angle encoding

```json
{
  "data": {
    "values": [
      {"word": "Vega", "count": 120, "tilt": 0},
      {"word": "Lite", "count": 95, "tilt": -45},
      {"word": "Data", "count": 80, "tilt": 45},
      {"word": "Visual", "count": 65, "tilt": 0},
      {"word": "Grammar", "count": 50, "tilt": -45}
    ]
  },
  "mark": "wordcloud",
  "encoding": {
    "text": {"field": "word", "type": "nominal"},
    "size": {"field": "count", "type": "quantitative"},
    "angle": {"field": "tilt", "type": "quantitative"}
  }
}
```

The `angle` encoding field is passed to the wordcloud transform's `rotate` parameter so each word is rotated individually. Alternatively, for simple cases, a constant rotation can be set via the mark def: `"mark": {"type": "wordcloud", "rotate": -45}`.

### Custom layout

```json
{
  "mark": {
    "type": "wordcloud",
    "font": "Georgia",
    "fontWeight": "bold",
    "padding": 4,
    "spiral": "rectangular"
  },
  "encoding": {
    "text": {"field": "word", "type": "nominal"},
    "size": {"field": "count", "type": "quantitative", "scale": {"range": [8, 72]}},
    "color": {"field": "count", "type": "quantitative", "scale": {"scheme": "blues"}}
  }
}
```

**Compiled Vega output:**

```json
{
  "marks": [
    {
      "type": "text",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "text": {"field": "word"},
          "align": {"value": "center"},
          "baseline": {"value": "alphabetic"},
          "fill": {"scale": "color", "field": "count"}
        }
      },
      "transform": [
        {
          "type": "wordcloud",
          "size": [{"signal": "width"}, {"signal": "height"}],
          "text": {"field": "datum.word"},
          "fontSize": {"field": "datum.count"},
          "fontSizeRange": [8, 72],
          "font": "Georgia",
          "fontWeight": "bold",
          "padding": 4,
          "spiral": "rectangular"
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "color",
      "type": "linear",
      "domain": {"data": "source", "field": "count"},
      "range": {"scheme": "blues"}
    }
  ]
}
```

---

## Decisions

### Wordcloud as mark (preferred) vs exposing wordcloud transform

**Proposed:** Expose word cloud as `"mark": "wordcloud"` — a high-level mark that internally handles the Vega `wordcloud` layout transform. The user never writes the transform directly.

This follows the same rationale as the [treemap design](2026-03-18-treemap.md#treemap-as-mark-preferred-vs-exposing-treemap-transform). Exposing Vega's `wordcloud` transform directly would require users to:

- Understand that word cloud is a `text` mark with a mark-level transform
- Wire `fontSize`, `rotate`, and `text` field references with `datum.` prefixes
- Set `align: "center"` and `baseline: "alphabetic"` manually (required by the layout)
- Set `size: [{signal: "width"}, {signal: "height"}]` for layout sizing

VL already hides this kind of plumbing for `geoshape` (auto-injecting the `geoshape` post-encoding transform) and for `bar`/`area` stacking (auto-injecting the `stack` data transform). The wordcloud mark would follow the same principle.

**Rejected alternative: User-facing wordcloud transform.** Would require users to manually compose a `text` mark with the transform, wire field references, and set required alignment values — all of which are mechanical and error-prone. No benefit over a declarative mark.

#### Sub-decision: First-class mark (preferred) vs composite mark

We propose implementing wordcloud as a **first-class mark** (with its own mark compiler, like `geoshape`) rather than a **composite mark** (like `boxplot`).

Wordcloud is a particularly clean fit for a first-class mark because:

1. **Post-encoding transform pattern.** Vega's `wordcloud` transform sits on the mark object (not in the data pipeline), which maps directly to `postEncodingTransform` in VL's mark compiler — exactly how `geoshape` works.

2. **Width/height signals.** The wordcloud transform requires `size: [{signal: "width"}, {signal: "height"}]`, which is only available after model construction. A composite mark normalizer runs before model construction and would not have access to these signals.

3. **Single output mark.** Unlike treemap (which may eventually emit both rect + text for labels), wordcloud produces only a `text` mark. There is no shared encoding namespace problem. A first-class mark compiler is the simplest and most direct implementation.

### Encoding channels consumed by the transform: `size` and `angle`

**Proposed:** The `size` and `angle` encodings on wordcloud pass field values to the Vega transform's `fontSize` and `rotate` parameters respectively. No VL-generated Vega scales are emitted for these channels — the transform consumes the values directly.

For `size`, the user specifies the font size range via VL's standard `scale.range`:

```json
"size": {"field": "count", "type": "quantitative", "scale": {"range": [10, 56]}}
```

This compiles to `"fontSize": {"field": "datum.count"}, "fontSizeRange": [10, 56]` on the Vega transform. The transform applies a sqrt scale internally to map raw values into the range. The `scale.range` default is `[10, 56]`.

For `angle`, the raw field values are passed to the transform's `rotate` parameter. For the common case of random rotation from a fixed set of angles (e.g., `[-45, 0, 45]`), users would pre-compute the angle field using VL's `calculate` transform:

```json
{
  "transform": [
    {"calculate": "[-45, 0, 45][floor(random() * 3)]", "as": "angle"}
  ],
  "encoding": {
    "angle": {"field": "angle", "type": "quantitative"}
  }
}
```

**Rationale:** Both `size` and `angle` are consumed by the wordcloud transform for layout computation. The transform reads raw `datum` values and handles scaling internally (via `fontSizeRange` for font size). Interposing a VL-generated Vega scale would create double-scaling for `size` and add unnecessary complexity for `angle`. Using `scale.range` for the font size range keeps the API consistent with how other channels specify their output range, without needing a wordcloud-specific `fontSizeRange` mark def property.

**Rejected alternative: Dedicated mark def properties** (e.g., `fontSizeRange`, `rotateValues`). These would duplicate what `scale.range` and `calculate` already express using standard VL primitives.

---

## Extensibility

### Data preparation: tokenization and counting

The wordcloud mark assumes pre-tokenized data — each row contains a word/phrase and optional frequency. Vega has a [`countpattern`](https://vega.github.io/vega/docs/transforms/countpattern/) transform that tokenizes raw text into word-frequency pairs, but VL does not currently expose it.

For the initial implementation, users would prepare word-frequency data externally or use VL's `aggregate` transform on pre-tokenized data. Exposing `countpattern` as a VL transform is a natural future extension but is orthogonal to the wordcloud mark itself.

### Relationship to the treemap design

The wordcloud mark is the second instance of the "mark as layout" pattern proposed in the [treemap design doc](2026-03-18-treemap.md#beyond-hierarchies-the-mark-as-layout-pattern). It validates the pattern by demonstrating that it works for non-hierarchical layouts:

| Aspect              | `treemap`                    | `wordcloud`                  |
| ------------------- | ---------------------------- | ---------------------------- |
| Input data          | Hierarchical (flat + hierarchy encoding) | Flat (no hierarchy needed) |
| Layout transform    | Data pipeline (`treemap`)    | Post-encoding (`wordcloud`)  |
| Vega mark type      | `rect`                       | `text`                       |
| Position channels   | `x`/`y` blocked              | `x`/`y` blocked              |
| Size channel        | Area of rectangle            | Font size                    |
| Scale for size      | Skipped (layout handles it)  | `scale.range` → transform `fontSizeRange` |

---

## Implementation

1. Add `'wordcloud'` to `Mark` enum in [`src/mark.ts`](../src/mark.ts) and related config types (`MarkConfigMixins`, `MARK_CONFIG_INDEX`)
2. Add `wordcloud: {}` to `defaultConfig` in [`src/config.ts`](../src/config.ts)
3. Update [`src/channel.ts`](../src/channel.ts) — add `wordcloud` to `getSupportedMark` for `text`, `size`, `color`, `angle`, `opacity`, `tooltip`, `href`; exclude from `x`/`y` position channels (like `geoshape`)
4. Create mark compiler in `src/compile/mark/wordcloud.ts`:
   - `vgMark: 'text'`
   - `encodeEntry()` — maps `text`, `color`/`fill`, `opacity` via `baseEncodeEntry`; forces `align: "center"`, `baseline: "alphabetic"`
   - `postEncodingTransform()` — emits Vega `wordcloud` transform with `size: [{signal: "width"}, {signal: "height"}]`, `text` from encoding, `fontSize` from `size` encoding field, `fontSizeRange` from `size` encoding's `scale.range`, `rotate` from `angle` encoding or mark def, plus `font`/`fontWeight`/`fontStyle`/`padding`/`spiral` from mark def
5. Register in [`src/compile/mark/mark.ts`](../src/compile/mark/mark.ts) — add to `markCompiler` registry
6. Update [`src/compile/scale/parse.ts`](../src/compile/scale/parse.ts) — skip Vega scale emission for `size` on wordcloud (mark compiler reads `scale.range` and passes to transform's `fontSizeRange`); skip scale for `angle`
7. Add example specs in `examples/specs/` — `wordcloud_simple.vl.json`, `wordcloud_color.vl.json`
8. Add tests in `test/compile/mark/wordcloud.test.ts`
9. Add documentation page at `site/docs/mark/wordcloud.md`
10. Update `site/_data/examples.json` and `site/docs/mark/mark.md`
