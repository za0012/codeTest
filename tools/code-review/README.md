# Code Review Harness

This repository uses an LLM-backed review harness to review pull request diffs
and publish structured feedback.

## Flow

1. A pull request is opened, synchronized, reopened, or marked ready for review.
2. GitHub Actions checks out the repository and installs dependencies with Bun.
3. `bun run review` collects the base/head diff and changed files.
4. The harness runs local verification checks such as lint, typecheck, test, and build.
5. `AGENTS.md` and `tools/code-review/agents/*.md` are sent with the diff to the OpenAI Responses API.
6. Findings are normalized into JSON and Markdown reports.
7. The workflow creates or updates a single automated PR comment.
8. Scheduled runs can publish the same report format to Notion.

## Review Criteria

The primary review criteria are:

1. Meaningful variable and function naming
2. Early returns where they improve readability and reduce nesting
3. Runtime performance and complexity risks

The harness also reviews bugs, regressions, security issues, auth/CORS risks,
token exposure, missing validation, missing tests, broken API contracts, and
maintainability risks.

## Required Secrets

- `OPENAI_API_KEY`: required for LLM review.
- `NOTION_TOKEN`: required only when Notion publishing is enabled.
- `NOTION_DATABASE_ID`: required only when Notion publishing is enabled.

## Optional Variables

- `OPENAI_REVIEW_MODEL`: defaults to `gpt-5.5`.
- `REVIEW_EXPORT_NOTION`: set to `1` to publish scheduled or PR reports to Notion.
- `NOTION_TITLE_PROPERTY`: defaults to `Name`.

## Workflows

- `.github/workflows/automated-code-review.yml` runs on pull requests and posts
  a review comment.
- `.github/workflows/scheduled-study-report.yml` runs every morning and once
  again on Friday morning for a weekly study report cadence.

## Layout

- `review-harness.ts`: main review runner.
- `agents/*.md`: reviewer prompts used by the harness.
- `integrations/`: placeholders for external publishing integrations.
- `output/`: generated JSON and Markdown reports. This directory is ignored by Git.

## Local Verification

Run the harness without calling OpenAI:

```bash
bun run review -- --skip-checks --skip-agents --base HEAD~1 --head HEAD
```

Run the full review locally after setting `OPENAI_API_KEY`:

```bash
bun run review -- --base HEAD~1 --head HEAD
```
