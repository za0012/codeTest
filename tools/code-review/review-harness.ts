import { execFile, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Severity = "P0" | "P1" | "P2" | "P3";

type Finding = {
  severity: Severity;
  title: string;
  file?: string;
  line?: number;
  impact: string;
  suggestedFix: string;
  verification: string;
  source: string;
  existingFailure: boolean;
};

type CheckResult = {
  name: string;
  command?: string;
  exitCode?: number;
  durationMs?: number;
  stdout?: string;
  stderr?: string;
  skipped?: boolean;
  reason?: string;
};

type AgentPrompt = {
  name: string;
  prompt: string;
  filePath: string;
};

type ReviewReport = {
  title: string;
  cadence: string;
  generatedAt: string;
  repoRoot: string;
  base: string;
  head: string;
  changedFiles: string[];
  checks: CheckResult[];
  findings: Finding[];
  warnings: string[];
};

type CliOptions = {
  base?: string;
  head?: string;
  title: string;
  cadence: string;
  failOn?: Severity;
  jsonOut: string;
  markdownOut: string;
  skipChecks: boolean;
  skipAgents: boolean;
  notion: boolean;
  githubComment: boolean;
  prNumber?: string;
  maxDiffBytes: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const severityRank: Record<Severity, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
const githubCommentMarker = "<!-- automated-code-review -->";

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const warnings: string[] = [];

  const agentsInstructions = await readOptionalFile(
    path.join(repoRoot, "AGENTS.md"),
  );
  if (!agentsInstructions.trim()) {
    warnings.push("AGENTS.md was not found or was empty.");
  }

  const agentPrompts = await readAgentPrompts(
    path.join(__dirname, "agents"),
    warnings,
  );
  const refs = await computeRefs(options);
  const diff = await collectDiff(
    refs.base,
    refs.head,
    options.maxDiffBytes,
    warnings,
  );
  const changedFiles = await collectChangedFiles(refs.base, refs.head);
  const checks = options.skipChecks ? [] : await runChecks(warnings);
  const agentFindings = options.skipAgents
    ? []
    : await runOpenAiReviewAgents({
        agentPrompts,
        agentsInstructions,
        base: refs.base,
        changedFiles,
        checks,
        diff,
        head: refs.head,
        warnings,
      });
  const findings = mergeAndSortFindings([
    ...checks.flatMap((check) => checkResultToFinding(check, changedFiles)),
    ...agentFindings,
  ]);

  const report: ReviewReport = {
    title: options.title,
    cadence: options.cadence,
    generatedAt: new Date().toISOString(),
    repoRoot,
    base: refs.base,
    head: refs.head,
    changedFiles,
    checks,
    findings,
    warnings,
  };

  await writeReport(report, options);

  if (options.notion) {
    await exportToNotion(report, warnings);
    await writeReport(report, options);
  }

  if (options.githubComment) {
    await commentOnGitHubPr(report, options.prNumber, warnings);
    await writeReport(report, options);
  }

  printSummary(report, options);

  const failOn = options.failOn;
  if (
    failOn &&
    findings.some(
      (finding) => severityRank[finding.severity] <= severityRank[failOn],
    )
  ) {
    process.exitCode = 1;
  }
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    base: process.env.REVIEW_BASE,
    head: process.env.REVIEW_HEAD,
    title: process.env.REVIEW_REPORT_TITLE ?? "자동 코드 리뷰",
    cadence: process.env.REVIEW_CADENCE ?? "pull-request",
    failOn: parseSeverity(process.env.REVIEW_FAIL_ON),
    jsonOut: path.resolve(
      repoRoot,
      process.env.REVIEW_JSON_OUT ?? "tools/code-review/output/report.json",
    ),
    markdownOut: path.resolve(
      repoRoot,
      process.env.REVIEW_MARKDOWN_OUT ?? "tools/code-review/output/report.md",
    ),
    skipChecks: process.env.REVIEW_SKIP_CHECKS === "1",
    skipAgents: process.env.REVIEW_SKIP_AGENTS === "1",
    notion: process.env.REVIEW_EXPORT_NOTION === "1",
    githubComment: process.env.REVIEW_GITHUB_COMMENT === "1",
    prNumber: process.env.PR_NUMBER,
    maxDiffBytes: Number(process.env.REVIEW_MAX_DIFF_BYTES ?? 180_000),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--base" && next) {
      options.base = next;
      index += 1;
    } else if (arg === "--head" && next) {
      options.head = next;
      index += 1;
    } else if (arg === "--title" && next) {
      options.title = next;
      index += 1;
    } else if (arg === "--cadence" && next) {
      options.cadence = next;
      index += 1;
    } else if (arg === "--fail-on" && next) {
      options.failOn = parseSeverity(next);
      index += 1;
    } else if (arg === "--json-out" && next) {
      options.jsonOut = path.resolve(repoRoot, next);
      index += 1;
    } else if (arg === "--markdown-out" && next) {
      options.markdownOut = path.resolve(repoRoot, next);
      index += 1;
    } else if (arg === "--max-diff-bytes" && next) {
      options.maxDiffBytes = Number(next);
      index += 1;
    } else if (arg === "--pr" && next) {
      options.prNumber = next;
      index += 1;
    } else if (arg === "--skip-checks") {
      options.skipChecks = true;
    } else if (arg === "--skip-agents") {
      options.skipAgents = true;
    } else if (arg === "--notion") {
      options.notion = true;
    } else if (arg === "--github-comment") {
      options.githubComment = true;
    }
  }

  return options;
}

async function computeRefs(options: CliOptions) {
  const head = options.head ?? (await git(["rev-parse", "HEAD"])).stdout.trim();
  const base = options.base ?? (await detectBaseRef(head));

  return { base, head };
}

async function detectBaseRef(head: string) {
  const candidates = [
    process.env.GITHUB_BASE_REF
      ? `origin/${process.env.GITHUB_BASE_REF}`
      : undefined,
    process.env.GITHUB_BASE_REF,
    "origin/main",
    "origin/master",
    "main",
    "master",
    `${head}~1`,
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const mergeBase = await git(["merge-base", head, candidate], {
      allowFailure: true,
    });
    if (mergeBase.exitCode === 0 && mergeBase.stdout.trim()) {
      return mergeBase.stdout.trim();
    }
  }

  throw new Error(
    "Could not detect a base ref. Pass --base <ref> or set REVIEW_BASE.",
  );
}

async function collectDiff(
  base: string,
  head: string,
  maxBytes: number,
  warnings: string[],
) {
  const diff = (
    await git([
      "diff",
      "--find-renames",
      "--find-copies",
      "--unified=80",
      `${base}...${head}`,
    ])
  ).stdout;

  if (Buffer.byteLength(diff, "utf8") <= maxBytes) {
    return diff;
  }

  warnings.push(
    `Diff was truncated to ${maxBytes} bytes for the model prompt.`,
  );
  return `${Buffer.from(diff, "utf8").subarray(0, maxBytes).toString("utf8")}\n\n[diff truncated]\n`;
}

async function collectChangedFiles(base: string, head: string) {
  const output = (
    await git(["diff", "--name-only", `${base}...${head}`])
  ).stdout.trim();
  return output ? output.split(/\r?\n/u).filter(Boolean) : [];
}

async function readAgentPrompts(agentDir: string, warnings: string[]) {
  if (!existsSync(agentDir)) {
    warnings.push("tools/code-review/agents directory was not found.");
    return [];
  }

  const entries = await readdir(agentDir, { withFileTypes: true });
  const prompts: AgentPrompt[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(agentDir, entry.name);
    const prompt = (await readOptionalFile(filePath)).trim();
    if (!prompt) {
      warnings.push(`${entry.name} is empty and was skipped.`);
      continue;
    }

    prompts.push({
      name: entry.name.replace(/\.md$/u, ""),
      prompt,
      filePath,
    });
  }

  return prompts;
}

async function runChecks(warnings: string[]) {
  const packageJson = await readPackageJson();
  const packageManager = detectPackageManager();
  const scripts = packageJson?.scripts ?? {};
  const requestedChecks = (
    process.env.REVIEW_CHECKS ?? "lint,typecheck,test,build"
  )
    .split(",")
    .map((check) => check.trim())
    .filter(Boolean);
  const results: CheckResult[] = [];

  for (const check of requestedChecks) {
    const command = resolveCheckCommand(check, scripts, packageManager);
    if (!command) {
      results.push({
        name: check,
        skipped: true,
        reason: `No ${check} script or safe fallback was found.`,
      });
      continue;
    }

    const startedAt = Date.now();
    const result = await runShellCommand(command, { allowFailure: true });
    results.push({
      name: check,
      command,
      exitCode: result.exitCode,
      durationMs: Date.now() - startedAt,
      stdout: trimOutput(result.stdout),
      stderr: trimOutput(result.stderr),
    });

    if (result.exitCode !== 0) {
      warnings.push(
        `${getCheckLabel(check)} 실패: exit code ${result.exitCode}.`,
      );
    }
  }

  return results;
}

function resolveCheckCommand(
  check: string,
  scripts: Record<string, string>,
  packageManager: string,
) {
  if (
    check === "lint" &&
    scripts.lint &&
    /\bbiome\b/u.test(scripts.lint) &&
    /--(?:apply|write)\b/u.test(scripts.lint)
  ) {
    return `${packageManager} biome check .`;
  }

  if (scripts[check]) {
    return `${packageManager} run ${check}`;
  }

  if (
    check === "typecheck" &&
    existsSync(path.join(repoRoot, "tsconfig.json"))
  ) {
    const localTsc = path.join(
      repoRoot,
      "node_modules",
      "typescript",
      "bin",
      "tsc",
    );
    if (existsSync(localTsc)) {
      return `${quote(process.execPath)} ${quote(localTsc)} --noEmit --pretty false`;
    }
  }

  return undefined;
}

async function runOpenAiReviewAgents(input: {
  agentPrompts: AgentPrompt[];
  agentsInstructions: string;
  base: string;
  head: string;
  changedFiles: string[];
  checks: CheckResult[];
  diff: string;
  warnings: string[];
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    input.warnings.push(
      "OpenAI review skipped because OPENAI_API_KEY is missing.",
    );
    return [];
  }

  if (input.agentPrompts.length === 0) {
    input.warnings.push(
      "OpenAI review skipped because there are no non-empty review agent prompts.",
    );
    return [];
  }

  const findings: Finding[] = [];

  for (const agentPrompt of input.agentPrompts) {
    const prompt = buildAgentPrompt({
      agentPrompt,
      agentsInstructions: input.agentsInstructions,
      base: input.base,
      changedFiles: input.changedFiles,
      checks: input.checks,
      diff: input.diff,
      head: input.head,
    });

    try {
      const rawOutput = await createOpenAiReview(prompt);
      findings.push(
        ...parseAgentFindings(rawOutput, agentPrompt.name, input.warnings),
      );
    } catch (error) {
      input.warnings.push(
        `${agentPrompt.name} OpenAI review failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return findings;
}

async function createOpenAiReview(prompt: string) {
  const model = process.env.OPENAI_REVIEW_MODEL ?? "gpt-5.5";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are a strict automated code review agent. Return only JSON that matches the requested shape. Do not include markdown fences.",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "code_review_findings",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              findings: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    severity: {
                      type: "string",
                      enum: ["P0", "P1", "P2", "P3"],
                    },
                    title: { type: "string" },
                    file: { type: "string" },
                    line: { type: "integer" },
                    impact: { type: "string" },
                    suggestedFix: { type: "string" },
                    verification: { type: "string" },
                    existingFailure: { type: "boolean" },
                  },
                  required: [
                    "severity",
                    "title",
                    "file",
                    "line",
                    "impact",
                    "suggestedFix",
                    "verification",
                    "existingFailure",
                  ],
                },
              },
            },
            required: ["findings"],
          },
        },
      },
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `OpenAI API returned ${response.status}: ${trimOutput(body, 1_000)}`,
    );
  }

  return extractOpenAiText(JSON.parse(body));
}

function buildAgentPrompt(input: {
  agentPrompt: AgentPrompt;
  agentsInstructions: string;
  base: string;
  head: string;
  changedFiles: string[];
  checks: CheckResult[];
  diff: string;
}) {
  return [
    input.agentsInstructions,
    "",
    `# Sub-agent role: ${input.agentPrompt.name}`,
    input.agentPrompt.prompt,
    "",
    "# Required output",
    "Return only JSON in this shape:",
    JSON.stringify(
      {
        findings: [
          {
            severity: "P1",
            title: "Short actionable title",
            file: "src/example.ts",
            line: 10,
            impact: "What breaks or what risk is introduced",
            suggestedFix: "Concrete fix",
            verification: "How to verify the fix",
            existingFailure: false,
          },
        ],
      },
      null,
      2,
    ),
    "Use an empty findings array if there are no actionable findings.",
    "Write title, impact, suggestedFix, and verification in Korean for the final report.",
    "",
    "# Review context",
    `Base: ${input.base}`,
    `Head: ${input.head}`,
    "",
    "# Changed files",
    input.changedFiles.join("\n") || "(none)",
    "",
    "# Check results",
    JSON.stringify(input.checks, null, 2),
    "",
    "# Diff",
    input.diff || "(empty diff)",
  ].join("\n");
}

function parseAgentFindings(
  rawOutput: string,
  source: string,
  warnings: string[],
) {
  const jsonText = extractJson(rawOutput);
  if (!jsonText) {
    warnings.push(`${source} did not return parseable JSON.`);
    return [];
  }

  try {
    const parsed = JSON.parse(jsonText) as { findings?: Partial<Finding>[] };
    if (!Array.isArray(parsed.findings)) {
      warnings.push(`${source} JSON did not include a findings array.`);
      return [];
    }

    return parsed.findings
      .map((finding) => normalizeFinding(finding, source))
      .filter((finding): finding is Finding => Boolean(finding));
  } catch (error) {
    warnings.push(
      `${source} JSON parse failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return [];
  }
}

function normalizeFinding(
  finding: Partial<Finding>,
  source: string,
): Finding | undefined {
  const severity = parseSeverity(finding.severity);
  const line = Number(finding.line);

  if (
    !severity ||
    !finding.title ||
    !finding.impact ||
    !finding.suggestedFix ||
    !finding.verification
  ) {
    return undefined;
  }

  return {
    severity,
    title: finding.title,
    file: finding.file,
    line: Number.isFinite(line) && line > 0 ? line : undefined,
    impact: finding.impact,
    suggestedFix: finding.suggestedFix,
    verification: finding.verification,
    source,
    existingFailure: Boolean(finding.existingFailure),
  };
}

function extractOpenAiText(response: unknown) {
  const maybe = response as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  if (maybe.output_text) {
    return maybe.output_text;
  }

  const parts =
    maybe.output?.flatMap(
      (item) =>
        item.content
          ?.filter((content) => content.type === "output_text" && content.text)
          .map((content) => content.text ?? "") ?? [],
    ) ?? [];

  return parts.join("\n");
}

function extractJson(rawOutput: string) {
  const fenced = rawOutput.match(/```(?:json)?\s*([\s\S]*?)```/u);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = rawOutput.indexOf("{");
  const end = rawOutput.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return rawOutput.slice(start, end + 1).trim();
  }

  return undefined;
}

function checkResultToFinding(
  check: CheckResult,
  changedFiles: string[],
): Finding[] {
  if (check.skipped || check.exitCode === undefined || check.exitCode === 0) {
    return [];
  }

  const severity: Severity =
    check.name === "build" ||
    check.name === "typecheck" ||
    check.name === "test"
      ? "P1"
      : "P2";
  const output = [check.stderr, check.stdout].filter(Boolean).join("\n").trim();
  const referencedFiles = extractReferencedFiles(output);
  const changedFileSet = new Set(changedFiles.map(normalizeFilePath));
  const changedReferencedFile = referencedFiles.find((file) =>
    changedFileSet.has(file),
  );
  const existingFailure =
    referencedFiles.length === 0 ||
    referencedFiles.every((file) => !changedFileSet.has(file));
  const location =
    changedReferencedFile ?? referencedFiles[0] ?? "package.json";
  const checkLabel = getCheckLabel(check.name);

  return [
    {
      severity,
      title: `${checkLabel} 실패`,
      file: location,
      suggestedFix: output
        ? `로컬에서 \`${check.command}\`를 실행한 뒤 아래 첫 출력부터 수정하세요.\n${trimOutput(output, 1_000)}`
        : `로컬에서 \`${check.command}\`를 실행하고 실패 원인을 수정한 뒤 하네스를 다시 실행하세요.`,
      impact: existingFailure
        ? `${checkLabel} 검증이 실패했지만, 출력에 나타난 파일이 이번 PR 변경 파일 밖에 있어 기존 실패일 가능성이 큽니다.`
        : `${checkLabel} 검증이 실패했고, 출력에 이번 PR 변경 파일이 포함되어 있어 변경 영향일 가능성이 있습니다.`,
      verification: `\`${check.command}\`가 exit code 0으로 종료되면 해결된 것입니다.`,
      source: "harness",
      existingFailure,
    },
  ];
}

function extractReferencedFiles(output: string) {
  const normalized = stripAnsi(output).replaceAll("\\", "/");
  const matches = normalized.matchAll(
    /(?:^|\s|["'(.])((?:\.\/)?(?:src|tools\/code-review|docs|\.github)\/[^\s"'()]+?\.(?:tsx|ts|jsx|js|json|md|yaml|yml|css|mjs|cjs))/gmu,
  );
  const files = Array.from(matches, (match) => normalizeFilePath(match[1]));

  return Array.from(new Set(files));
}

function normalizeFilePath(filePath: string) {
  const normalized = filePath
    .replaceAll("\\", "/")
    .replace(/^\.\//u, "")
    .replace(/^.*?(?=(src|tools\/code-review|docs|\.github)\/)/u, "");

  return normalized.replace(/[:),.]+$/u, "");
}

function getCheckLabel(checkName: string) {
  const labels: Record<string, string> = {
    lint: "Lint",
    typecheck: "TypeScript 타입 검사",
    test: "테스트",
    build: "빌드",
  };

  return labels[checkName] ?? checkName;
}

function mergeAndSortFindings(findings: Finding[]) {
  const merged = new Map<string, Finding>();

  for (const finding of findings) {
    const key = [
      finding.severity,
      finding.file ?? "",
      finding.line ?? "",
      normalizeText(finding.title),
    ].join("|");
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, finding);
      continue;
    }

    existing.source = Array.from(
      new Set([...existing.source.split(", "), finding.source]),
    ).join(", ");
  }

  return Array.from(merged.values()).sort((left, right) => {
    const severityDelta =
      severityRank[left.severity] - severityRank[right.severity];
    if (severityDelta !== 0) {
      return severityDelta;
    }

    return `${left.file ?? ""}:${left.line ?? 0}:${left.title}`.localeCompare(
      `${right.file ?? ""}:${right.line ?? 0}:${right.title}`,
    );
  });
}

async function exportToNotion(report: ReviewReport, warnings: string[]) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  const titleProperty = process.env.NOTION_TITLE_PROPERTY ?? "Name";

  if (!token || !databaseId) {
    warnings.push(
      "Notion export skipped because NOTION_TOKEN or NOTION_DATABASE_ID is missing.",
    );
    return;
  }

  const markdown = renderMarkdown(report);
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        [titleProperty]: {
          title: [
            {
              text: { content: `${report.title} ${shortSha(report.head)}` },
            },
          ],
        },
      },
      children: chunkText(markdown, 1_900)
        .slice(0, 90)
        .map((chunk) => ({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: chunk } }],
          },
        })),
    }),
  });

  if (!response.ok) {
    warnings.push(
      `Notion export failed: ${response.status} ${await response.text()}`,
    );
  }
}

async function commentOnGitHubPr(
  report: ReviewReport,
  prNumber: string | undefined,
  warnings: string[],
) {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const pullRequestNumber = prNumber ?? (await detectGitHubPrNumber());

  if (!token || !repository || !pullRequestNumber) {
    warnings.push(
      "GitHub PR comment skipped because GITHUB_TOKEN, GITHUB_REPOSITORY, or PR number is missing.",
    );
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const commentsUrl = `https://api.github.com/repos/${repository}/issues/${pullRequestNumber}/comments`;
  const commentBody = renderGitHubComment(report).slice(0, 60_000);
  const existingCommentId = await findExistingReviewComment(
    commentsUrl,
    headers,
  );
  const response = existingCommentId
    ? await fetch(
        `https://api.github.com/repos/${repository}/issues/comments/${existingCommentId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ body: commentBody }),
        },
      )
    : await fetch(commentsUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ body: commentBody }),
      });

  if (!response.ok) {
    warnings.push(
      `GitHub comment failed: ${response.status} ${await response.text()}`,
    );
  }
}

async function findExistingReviewComment(
  commentsUrl: string,
  headers: Record<string, string>,
) {
  const response = await fetch(`${commentsUrl}?per_page=100`, { headers });
  if (!response.ok) {
    return undefined;
  }

  const comments = (await response.json()) as Array<{
    id?: number;
    body?: string;
    user?: { type?: string };
  }>;
  const existing = comments.find(
    (comment) =>
      comment.body?.includes(githubCommentMarker) &&
      comment.user?.type === "Bot",
  );

  return existing?.id;
}

async function detectGitHubPrNumber() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !existsSync(eventPath)) {
    return undefined;
  }

  const event = JSON.parse(await readFile(eventPath, "utf8")) as {
    pull_request?: { number?: number };
  };
  return event.pull_request?.number
    ? String(event.pull_request.number)
    : undefined;
}

async function writeReport(report: ReviewReport, options: CliOptions) {
  await mkdir(path.dirname(options.jsonOut), { recursive: true });
  await mkdir(path.dirname(options.markdownOut), { recursive: true });
  await writeFile(
    options.jsonOut,
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
  await writeFile(options.markdownOut, renderMarkdown(report), "utf8");
}

function renderMarkdown(report: ReviewReport) {
  const newFindings = report.findings.filter(
    (finding) => !finding.existingFailure,
  );
  const existingFindings = report.findings.filter(
    (finding) => finding.existingFailure,
  );
  const lines = [
    `# ${report.title}`,
    "",
    `- 실행 유형: ${report.cadence}`,
    `- 생성 시각: ${report.generatedAt}`,
    `- 기준 커밋: \`${report.base}\``,
    `- 대상 커밋: \`${report.head}\``,
    `- 변경 파일 수: ${report.changedFiles.length}`,
    `- 발견 항목 수: ${report.findings.length}`,
    `- 이번 PR 영향 가능 항목: ${newFindings.length}`,
    `- 기존 실패 추정 항목: ${existingFindings.length}`,
    "",
    "## 검증 결과",
    "",
    ...report.checks.map((check) => {
      if (check.skipped) {
        return `- ${getCheckLabel(check.name)}: 건너뜀 (${check.reason})`;
      }

      return `- ${getCheckLabel(check.name)}: ${check.exitCode === 0 ? "통과" : `실패 (${check.exitCode})`} - \`${check.command}\``;
    }),
    "",
    "## 이번 PR 영향 가능 항목",
    "",
  ];

  if (newFindings.length === 0) {
    lines.push(
      "이번 PR 변경 파일에서 직접 발생한 것으로 보이는 항목은 없습니다.",
    );
  } else {
    appendFindings(lines, newFindings);
  }

  lines.push("", "## 기존 실패로 추정되는 항목", "");

  if (existingFindings.length === 0) {
    lines.push("기존 실패로 분류된 항목은 없습니다.");
  } else {
    appendFindings(lines, existingFindings);
  }

  if (report.warnings.length > 0) {
    lines.push(
      "",
      "## 경고",
      "",
      ...report.warnings.map((warning) => `- ${warning}`),
    );
  }

  return `${lines.join("\n")}\n`;
}

function appendFindings(lines: string[], findings: Finding[]) {
  for (const finding of findings) {
    const location = finding.file
      ? `${finding.file}${finding.line ? `:${finding.line}` : ""}`
      : "파일 위치 없음";
    lines.push(
      `### ${finding.severity} ${finding.title}`,
      "",
      `- 위치: ${location}`,
      `- 출처: ${finding.source}`,
      `- 분류: ${finding.existingFailure ? "기존 실패 추정" : "이번 PR 영향 가능"}`,
      `- 영향: ${finding.impact}`,
      `- 제안 수정: ${finding.suggestedFix}`,
      `- 확인 방법: ${finding.verification}`,
      "",
    );
  }
}

function renderGitHubComment(report: ReviewReport) {
  return `${githubCommentMarker}\n${renderMarkdown(report)}`;
}

function printSummary(report: ReviewReport, options: CliOptions) {
  console.log(renderMarkdown(report));
  console.log(`JSON report: ${options.jsonOut}`);
  console.log(`Markdown report: ${options.markdownOut}`);
}

async function readPackageJson() {
  const packagePath = path.join(repoRoot, "package.json");
  if (!existsSync(packagePath)) {
    return undefined;
  }

  return JSON.parse(await readFile(packagePath, "utf8")) as {
    scripts?: Record<string, string>;
  };
}

function detectPackageManager() {
  if (existsSync(path.join(repoRoot, "bun.lock"))) {
    return "bun";
  }

  if (existsSync(path.join(repoRoot, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (existsSync(path.join(repoRoot, "yarn.lock"))) {
    return "yarn";
  }

  return "npm";
}

async function readOptionalFile(filePath: string) {
  if (!existsSync(filePath)) {
    return "";
  }

  return readFile(filePath, "utf8");
}

async function git(args: string[], options: { allowFailure?: boolean } = {}) {
  return execFileCapture(
    "git",
    ["-c", `safe.directory=${repoRoot.replaceAll("\\", "/")}`, ...args],
    options,
  );
}

async function execFileCapture(
  command: string,
  args: string[],
  options: { allowFailure?: boolean } = {},
) {
  return new Promise<{ stdout: string; stderr: string; exitCode: number }>(
    (resolve, reject) => {
      execFile(
        command,
        args,
        { cwd: repoRoot, maxBuffer: 20 * 1024 * 1024 },
        (error, stdout, stderr) => {
          const exitCode =
            error &&
            typeof error === "object" &&
            "code" in error &&
            typeof error.code === "number"
              ? error.code
              : 0;
          const result = { stdout, stderr, exitCode };

          if (error && !options.allowFailure) {
            reject(Object.assign(error, result));
            return;
          }

          resolve(result);
        },
      );
    },
  );
}

async function runShellCommand(
  command: string,
  options: { allowFailure?: boolean; stdin?: string; timeoutMs?: number } = {},
) {
  return new Promise<{ stdout: string; stderr: string; exitCode: number }>(
    (resolve, reject) => {
      const child = spawn(command, {
        cwd: repoRoot,
        env: {
          ...process.env,
          FORCE_COLOR: "0",
          NEXT_TELEMETRY_DISABLED: "1",
          NO_COLOR: "1",
          TERM: "dumb",
        },
        shell: true,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: options.timeoutMs,
      });
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString("utf8");
      });

      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8");
      });

      child.on("error", (error) => {
        if (options.allowFailure) {
          resolve({
            stdout,
            stderr: `${stderr}\n${error.message}`.trim(),
            exitCode: 1,
          });
          return;
        }

        reject(error);
      });

      child.on("close", (code) => {
        const exitCode = code ?? 1;
        const result = { stdout, stderr, exitCode };

        if (exitCode !== 0 && !options.allowFailure) {
          reject(
            Object.assign(new Error(`Command failed: ${command}`), result),
          );
          return;
        }

        resolve(result);
      });

      if (options.stdin) {
        child.stdin.write(options.stdin);
      }
      child.stdin.end();
    },
  );
}

function parseSeverity(value: unknown): Severity | undefined {
  return value === "P0" || value === "P1" || value === "P2" || value === "P3"
    ? value
    : undefined;
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

function quote(value: string) {
  return `"${value.replace(/"/gu, '\\"')}"`;
}

function shortSha(value: string) {
  return value.slice(0, 7);
}

function chunkText(value: string, chunkSize: number) {
  const chunks: string[] = [];
  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize));
  }
  return chunks;
}

function stripAnsi(value: string) {
  const escapeCode = "\\x1B";
  const csiPattern = new RegExp(`${escapeCode}\\[[0-?]*[ -/]*[@-~]`, "gu");
  const escapePattern = new RegExp(`${escapeCode}[@-_]`, "gu");
  const c1Pattern = /\x9B[0-?]*[ -/]*[@-~]/gu;

  return value
    .replace(csiPattern, "")
    .replace(escapePattern, "")
    .replace(c1Pattern, "");
}

function trimOutput(value = "", maxLength = 4_000) {
  const normalized = stripAnsi(value)
    .replace(/\r/gmu, "")
    .replace(/[␍]/gmu, "")
    .replace(/[·]/gmu, " ")
    .trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}\n[output truncated]`;
}

main().catch((error) => {
  console.error(
    error instanceof Error ? (error.stack ?? error.message) : error,
  );
  process.exitCode = 1;
});
