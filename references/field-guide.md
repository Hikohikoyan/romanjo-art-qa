# Romanjo Review field guide

Use this guide to calibrate schema fields. The JSON Schema remains authoritative.

## Coordinates and confidence

- Express `x`, `y`, `radius`, widths, and heights as fractions of image dimensions.
- Interpret `(0, 0)` as the top-left and `(1, 1)` as the bottom-right.
- Use confidence as epistemic certainty: `0.9+` for visually explicit evidence, `0.6–0.89` for strong interpretation, and below `0.6` for tentative hypotheses.
- Keep evidence descriptions observable: contrast boundaries, saturation, luminance, detail density, isolation, faces, text, leading lines, or repeated forms.

## Gaze simulation

Rank likely first fixations using local contrast, luminance contrast, saturation, edge/detail density, semantic distinctiveness, isolation, size, faces, and readable text. Do not imply eye-tracking measurement. Produce one dominant early fixation and up to seven supporting points. Let point radii expand across the sequence to simulate the transition from foveal focus to scene comprehension.

## Depth

Describe semantic regions (foreground object, subject plane, background architecture, sky) with polygons. Never model depth as a full-frame linear ramp. Use `near`, `mid`, `far`, or `unknown`; use `depth_order` to state the ordinal stack.

## Composition

Record visible anchors and inferred structural lines. Use a golden spiral only when its pole aligns with a salient anchor and its sweep follows visible mass or directional flow. The overlay is an analytical fit, not proof of author intent.

## Histogram

Report 16 normalized bins for luminance and each RGB channel. These are visual estimates unless a deterministic pixel tool is available. Set `measurement` accordingly. The sum of each channel should be approximately 1.0.

## Language

Use the user's language for prose fields. Keep IDs, enum values, and schema keys unchanged. Keywords should be short, distinct, and useful for retrieval or generation control.
