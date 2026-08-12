# Provenance and similarity evidence protocol

Use this protocol when a submission asks “who made this?” or “was this AI-washed/remixed?” It organizes evidence; it does not automate a verdict.

## Evidence layers

1. **Embedded provenance** — Record whether a signed Content Credentials/C2PA manifest exists, which claims it contains, whether signature validation succeeds, and what remains unverifiable. Absence is not evidence of misconduct.
2. **Creator declaration** — Record a voluntary artist profile, portfolio links, dates, licenses, process files, and consent scope. A declaration is evidence supplied by a claimant, not independent proof.
3. **Source history** — Record publication URLs, timestamps, archive captures, contracts or licenses where lawful. Do not expose private records in public Issues.
4. **Similarity leads** — Retrieve visually similar candidates and document the regions, motifs, or structures that triggered the lead. Separate whole-image similarity from local-region similarity.
5. **Human adjudication** — Ask qualified reviewers to examine chronology, access, protectable expression, commonplace elements, licenses, transformative changes, and plausible independent creation.

## Reporting rules

- Say “candidate,” “signal,” or “requires review,” never “stolen,” “copied,” or “authored by” based only on a model score.
- Publish the evidence type, source, date, uncertainty, and known failure modes.
- Give affected creators a correction and appeal path.
- Do not infer identity from style alone.
- Do not treat missing metadata as suspicious: many platforms strip metadata.
- Do not upload private originals to external services without explicit consent.

## Interoperability references

- [C2PA specification](https://c2pa.org/specifications/specifications/2.2/specs/C2PA_Specification.html) for signed provenance manifests and validation concepts.
- [Content Credentials](https://contentcredentials.org/) for creator-facing provenance education.

Similarity implementations may change. Any future detector or optional submodule must be reviewed for license, privacy, dataset provenance, model size, false-positive behavior, and public disclosure before inclusion.
