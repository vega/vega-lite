# Design Docs

Design documents should be named with the convention: `YYYY-MM-DD-<feature-name>.md` (e.g, `2026-03-18-treemap.md`)

## Structure

- Start with a summary of the design upfront so the reader quickly understands what is being proposed
- List explicit decisions in a `## Decisions` section at the end
- Each decision header should name the options being compared: `### Option A (preferred) vs Option B`
- Order decisions from larger/more fundamental to smaller/more specific — sub-decisions should follow the parent decision they depend on
- Design details earlier in the doc can link to decisions for rationale (e.g., "see [Decision: X](#decision-x)")

## Tone

- Use proposal tone throughout — these are proposals for discussion, not finalized specs
- Make it clear what already exists in the codebase vs what is being proposed
- Use language like "we propose", "this design would", "the proposed approach" rather than new additions as fact

## Readability

- Design docs should be standalone and require minimal external lookups
- Show actual data shapes in raw JSON inline — don't link to an imaginary CSV/JSON data file
