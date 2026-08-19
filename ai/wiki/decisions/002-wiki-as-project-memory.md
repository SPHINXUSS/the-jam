---
title: 002 — ai/wiki is the project memory; transcripts are frozen sources
type: decision
status: accepted
updated: 2026-08-19
---

## Context

Everything known about this project's intent lived in two chat
transcripts — a 1MB PDF and a 16KB text file — and in nothing else. Two
prior agent lineages lost that context and rebuilt from memory, which is
how the same complaints ("still seeing some English", "you didn't
implement all that I told you about") kept recurring.

## Decision

- `ai/wiki/` is the single source of truth for project state, design
  intent, decisions and gaps. Schema in [[WIKI]].
- `ai/source/` holds the transcripts, frozen. Read and quote; never edit.
- `CLAUDE.md` at the repo root points every future session at
  `ai/wiki/index.md` as the first read.

## Consequences

- Every session ends with a wiki ingest. Skipping it loses the session.
- PO statements of intent get a page or a checklist row, so "you didn't
  implement all that I told you" becomes a diffable list rather than a
  memory test.
- The 1MB PDF stays in the repo. It is large for a static-site repo but it
  is the only record of the design reasoning, and GitHub Pages does not
  serve or care about `ai/`.
