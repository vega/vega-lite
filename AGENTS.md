# Vega-Lite Agent Guidelines

## Validating changes

After modifying the compiler, validate output using vitest (no build step needed):

```bash
# Run a specific test file
node_modules/.bin/vitest run test/compile/mark/treemap.test.ts

# Run all tests
node_modules/.bin/vitest run test/
```

To inspect the compiled Vega output, write a test that calls `compile()` and logs the result with `console.log(JSON.stringify(spec.spec, null, 2))`. Vitest shows stdout from passing tests too.

If the project builds successfully (`npm run build`), you can also use the CLI tools:

```bash
./bin/vl2vg examples/specs/your_spec.vl.json    # VL → Vega JSON
./bin/vl2svg examples/specs/your_spec.vl.json    # VL → SVG
```

## Adding new features

For new features (marks, transforms, etc.), always:

1. Add an example spec in `examples/specs/` (`.vl.json` file)
2. Add a documentation page in `site/docs/` (e.g. `site/docs/mark/treemap.md`)
3. Add the example to the gallery in `site/_data/examples.json`
4. Update relevant index pages (e.g. `site/docs/mark/mark.md` for new marks)

## Data and visual verification

Standard datasets (cars, flare, movies, etc.) are available locally in `node_modules/vega-datasets/data/`. Use these in tests and example specs — no need to fetch from a CDN.

To visually verify output, write a temporary vitest test that compiles a VL spec, renders with Vega, and writes the SVG to `/tmp/`. Do not commit generated files (SVGs, PNGs) into `examples/` or the source tree.

```typescript
import {readFileSync, writeFileSync} from 'fs';
import * as vega from 'vega';
import {compile} from '../../../src/index.js';

const data = JSON.parse(readFileSync('node_modules/vega-datasets/data/flare.json', 'utf8'));
const vegaSpec = compile({data: {values: data}, ...}).spec;
const view = new vega.View(vega.parse(vegaSpec), {renderer: 'none'});
const svg = await view.toSVG();
writeFileSync('/tmp/my_output.svg', svg);
```

## Coding conventions

- Avoid type casts (`as`). Prefer structuring code so TypeScript can infer types naturally (e.g. using discriminant properties, proper variable typing, or narrowing). Widen parameter types on helpers instead of casting at call sites. `as const` is fine.
- Don't export functions, types, or constants that are only used within the same file. Keep the public API surface minimal.
- Avoid optional properties in interfaces and type definitions, except for spec-facing props (user-authored JSON). Internal interfaces should use required properties with explicit union types (e.g. `field: string | undefined`) when needed. Similarly, generic type parameters should not use optional or default arguments — always require them explicitly at the call site.
- Use type-checking utilities from `vega-util` (`isObject`, `isArray`, `isNumber`, `isString`, `isBoolean`) instead of raw `typeof` / `Array.isArray` checks.
- Don't inline type-guard logic at call sites. Use dedicated type-guard functions (e.g. `isHierarchyStratifyDef(def)`) rather than ad-hoc `'key' in def && 'parentKey' in def` checks.
- Don't introduce noisy diffs — formatting-only changes that inflate the diff without changing behavior. For example, don't flatten `if (condition) { doSomething(); }` to `if (condition) doSomething();`, don't invert guard clauses (`if (x) { ... } return false;` → `if (!x) return false;`), and don't restructure existing if/else chains unless the restructuring is required by the new logic. Keep changes minimal and focused on the feature or fix.
- When the user says "guide:", treat the message as a request to update this file (`AGENTS.md`) with the new guideline.

## Schema

`build/vega-lite-schema.json` is a generated JSON Schema derived from the TypeScript types. It is committed to the repo and its changes are expected in diffs whenever type definitions change. Regenerate it with `npm run schema` after modifying any spec-facing types.

## Project structure

- `src/mark.ts` — Mark type definitions and the `Mark` enum
- `src/channel.ts` — Encoding channel definitions and `getSupportedMark`
- `src/encoding.ts` — `Encoding` interface and `initEncoding`
- `src/config.ts` — Default config for each mark type
- `src/compile/mark/` — Mark compilers (one per mark type)
- `src/compile/data/` — Dataflow nodes (transforms injected during compilation)
- `src/compile/data/parse.ts` — Wires dataflow nodes into the pipeline
- `src/compile/data/assemble.ts` — Walks the dataflow graph to emit Vega transforms
- `src/compile/scale/parse.ts` — Scale generation (some marks skip scales for certain channels)
- `examples/specs/` — Example VL specs (`.vl.json` files)
- `test/` — Tests (vitest)
