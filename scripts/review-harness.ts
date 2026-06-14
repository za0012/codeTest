// import { execFile, spawn } from "node:child_process";
// import { existsSync } from "node:fs";
// import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
// import path from "node:path";
// import { fileURLToPath } from "node:url";

// type Severity = "P0" | "P1" | "P2" | "P3";

// type Finding = {
//   severity: Severity;
//   title: string;
//   file?: string;
//   line?: number;
//   impact: string;
//   suggestedFix: string;
//   verification: string;
//   source: string;
//   existingFailure?: boolean;
// };

// type CheckResult = {
//   name: string;
//   command?: string;
//   exitCode?: number;
//   durationMs?: number;
//   stdout?: string;
//   stderr?: string;
//   skipped?: boolean;
//   reason?: string;
// };

// type AgentPrompt = {
//   name: string;
//   prompt: string;
//   filePath: string;
// };

// type ReviewReport = {
//   generatedAt: string;
//   repoRoot: string;
//   base: string;
//   head: string;
//   changedFiles: string[];
//   checks: CheckResult[];
//   findings: Finding[];
//   warnings: string[];
// };

// type CliOptions = {
//   base?: string;
//   head?: string;
//   agentCommand?: string;
//   failOn?: Severity;
//   jsonOut: string;
//   markdownOut: string;
//   skipChecks: boolean;
//   skipAgents: boolean;
//   notion: boolean;
//   githubComment: boolean;
//   prNumber?: string;
//   maxDiffBytes: number;
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const repoRoot = path.resolve(__dirname, "..");
// const severityRank: Record<Severity, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };

// async function main() {
//   const options = parseArgs(process.argv.slice(2));
//   const warnings: string[] = [];

//   // 1. Read AGENTS.md.
//   const agentsInstructions = await readOptionalFile(path.join(repoRoot, "AGENTS.md"));
//   if (!agentsInstructions) {
//     warnings.push("AGENTS.md was not found or was empty.");
//   }

//   // 2. Read sub-agent prompts.
//   const agentPrompts = await readAgentPrompts(path.join(repoRoot, "review-agents"), warnings);

//   // 3. Resolve base/head commits.
//   const refs = await computeRefs(options);

//   // 4. Collect git diff.
//   const diff = await collectDiff(refs.base, refs.head, options.maxDiffBytes, warnings);

//   // 5. Collect changed files.
//   const changedFiles = await collectChangedFiles(refs.base, refs.head);

//   // 6. Run lint/typecheck/test/build.
//   const checks = options.skipChecks ? [] : await runChecks(warnings);

//   // 7. Run each sub-agent review.
//   const agentFindings = options.skipAgents
//     ? []
//     : await runReviewAgents({
//         agentPrompts,
//         agentCommand: options.agentCommand,
//         agentsInstructions,
//         base: refs.base,
//         changedFiles,
//         checks,
//         diff,
//         head: refs.head,
//         warnings,
//       });

//   const findingsFromChecks = checks.flatMap(checkResultToFinding);

//   // 8. Merge duplicate findings.
//   // 9. Sort by severity.
//   const findings = mergeAndSortFindings([...findingsFromChecks, ...agentFindings]);

//   const report: ReviewReport = {
//     generatedAt: new Date().toISOString(),
//     repoRoot,
//     base: refs.base,
//     head: refs.head,
//     changedFiles,
//     checks,
//     findings,
//     warnings,
//   };

//   await mkdir(path.dirname(options.jsonOut), { recursive: true });
//   await mkdir(path.dirname(options.markdownOut), { recursive: true });
//   await writeFile(options.jsonOut, `${JSON.stringify(report, null, 2)}\n`, "utf8");
//   await writeFile(options.markdownOut, renderMarkdown(report), "utf8");

//   // 10. Export to Notion.
//   if (options.notion) {
//     await exportToNotion(report, warnings);
//     await writeFile(options.jsonOut, `${JSON.stringify(report, null, 2)}\n`, "utf8");
//     await writeFile(options.markdownOut, renderMarkdown(report), "utf8");
//   }

//   // 11. Write a GitHub comment when this is a PR.
//   if (options.githubComment) {
//     await commentOnGitHubPr(report, options.prNumber, warnings);
//     await writeFile(options.jsonOut, `${JSON.stringify(report, null, 2)}\n`, "utf8");
//     await writeFile(options.markdownOut, renderMarkdown(report), "utf8");
//   }

//   printSummary(report, options);

//   // 12. Optionally fail on P0/P1 or another configured threshold.
//   if (options.failOn && findings.some((finding) => severityRank[finding.severity] <= severityRank[options.failOn!])) {
//     process.exitCode = 1;
//   }
// }

// function parseArgs(args: string[]): CliOptions {
//   const options: CliOptions = {
//     base: process.env.REVIEW_BASE,
//     head: process.env.REVIEW_HEAD,
//     agentCommand: process.env.REVIEW_AGENT_CMD,
//     failOn: parseSeverity(process.env.REVIEW_FAIL_ON),
//     jsonOut: path.resolve(repoRoot, process.env.REVIEW_JSON_OUT ?? "review-output/report.json"),
//     markdownOut: path.resolve(repoRoot, process.env.REVIEW_MARKDOWN_OUT ?? "review-output/report.md"),
//     skipChecks: process.env.REVIEW_SKIP_CHECKS === "1",
//     skipAgents: process.env.REVIEW_SKIP_AGENTS === "1",
//     notion: process.env.REVIEW_EXPORT_NOTION === "1",
//     githubComment: process.env.REVIEW_GITHUB_COMMENT === "1",
//     prNumber: process.env.PR_NUMBER,
//     maxDiffBytes: Number(process.env.REVIEW_MAX_DIFF_BYTES ?? 180_000),
//   };

//   for (let index = 0; index < args.length; index += 1) {
//     const arg = args[index];
//     const next = args[index + 1];

//     if (arg === "--base" && next) {
//       options.base = next;
//       index += 1;
//     } else if (arg === "--head" && next) {
//       options.head = next;
//       index += 1;
//     } else if (arg === "--agent-cmd" && next) {
//       options.agentCommand = next;
//       index += 1;
//     } else if (arg === "--fail-on" && next) {
//       options.failOn = parseSeverity(next);
//       index += 1;
//     } else if (arg === "--json-out" && next) {
//       options.jsonOut = path.resolve(repoRoot, next);
//       index += 1;
//     } else if (arg === "--markdown-out" && next) {
//       options.markdownOut = path.resolve(repoRoot, next);
//       index += 1;
//     } else if (arg === "--max-diff-bytes" && next) {
//       options.maxDiffBytes = Number(next);
//       index += 1;
//     } else if (arg === "--pr" && next) {
//       options.prNumber = next;
//       index += 1;
//     } else if (arg === "--skip-checks") {
//       options.skipChecks = true;
//     } else if (arg === "--skip-agents") {
//       options.skipAgents = true;
//     } else if (arg === "--notion") {
//       options.notion = true;
//     } else if (arg === "--github-comment") {
//       options.githubComment = true;
//     }
//   }

//   return options;
// }

// async function computeRefs(options: CliOptions) {
//   const head = options.head ?? (await git(["rev-parse", "HEAD"])).stdout.trim();
//   const base = options.base ?? (await detectBaseRef(head));

//   return { base, head };
// }

// async function detectBaseRef(head: string) {
//   const candidates = [
//     process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : undefined,
//     process.env.GITHUB_BASE_REF,
//     "origin/main",
//     "origin/master",
//     "main",
//     "master",
//     `${head}~1`,
//   ].filter(Boolean) as string[];

//   for (const candidate of candidates) {
//     const mergeBase = await git(["merge-base", head, candidate], { allowFailure: true });
//     if (mergeBase.exitCode === 0 && mergeBase.stdout.trim()) {
//       return mergeBase.stdout.trim();
//     }
//   }

//   throw new Error("Could not detect a base ref. Pass --base <ref> or set REVIEW_BASE.");
// }

// async function collectDiff(base: string, head: string, maxBytes: number, warnings: string[]) {
//   const diff = (await git(["diff", "--find-renames", "--find-copies", "--unified=80", `${base}...${head}`])).stdout;

//   if (Buffer.byteLength(diff, "utf8") <= maxBytes) {
//     return diff;
//   }

//   warnings.push(`Diff was truncated to ${maxBytes} bytes for agent prompts.`);
//   return `${Buffer.from(diff, "utf8").subarray(0, maxBytes).toString("utf8")}\n\n[diff truncated]\n`;
// }

// async function collectChangedFiles(base: string, head: string) {
//   const output = (await git(["diff", "--name-only", `${base}...${head}`])).stdout.trim();
//   return output ? output.split(/\r?\n/).filter(Boolean) : [];
// }

// async function readAgentPrompts(agentDir: string, warnings: string[]) {
//   if (!existsSync(agentDir)) {
//     warnings.push("review-agents directory was not found.");
//     return [];
//   }

//   const entries = await readdir(agentDir, { withFileTypes: true });
//   const prompts: AgentPrompt[] = [];

//   for (const entry of entries) {
//     if (!entry.isFile() || !entry.name.endsWith(".md")) {
//       continue;
//     }

//     const filePath = path.join(agentDir, entry.name);
//     const prompt = (await readOptionalFile(filePath)).trim();
//     if (!prompt) {
//       warnings.push(`${entry.name} is empty and was skipped.`);
//       continue;
//     }

//     prompts.push({
//       name: entry.name.replace(/\.md$/u, ""),
//       prompt,
//       filePath,
//     });
//   }

//   return prompts;
// }

// async function runChecks(warnings: string[]) {
//   const packageJson = await readPackageJson();
//   const packageManager = detectPackageManager();
//   const scripts = packageJson?.scripts ?? {};
//   const requestedChecks = (process.env.REVIEW_CHECKS ?? "lint,typecheck,test,build")
//     .split(",")
//     .map((check) => check.trim())
//     .filter(Boolean);

//   const results: CheckResult[] = [];

//   for (const check of requestedChecks) {
//     const command = resolveCheckCommand(check, scripts, packageManager);
//     if (!command) {
//       results.push({
//         name: check,
//         skipped: true,
//         reason: `No ${check} script or safe fallback was found.`,
//       });
//       continue;
//     }

//     const startedAt = Date.now();
//     const result = await runShellCommand(command, { allowFailure: true });
//     const checkResult: CheckResult = {
//       name: check,
//       command,
//       exitCode: result.exitCode,
//       durationMs: Date.now() - startedAt,
//       stdout: trimOutput(result.stdout),
//       stderr: trimOutput(result.stderr),
//     };
//     results.push(checkResult);

//     if (result.exitCode !== 0) {
//       warnings.push(`${check} failed with exit code ${result.exitCode}.`);
//     }
//   }

//   return results;
// }

// function resolveCheckCommand(check: string, scripts: Record<string, string>, packageManager: string) {
//   if (check === "lint" && scripts.lint && /\bbiome\b/u.test(scripts.lint) && /--(?:apply|write)\b/u.test(scripts.lint)) {
//     return `${packageManager} biome check .`;
//   }

//   if (scripts[check]) {
//     return `${packageManager} run ${check}`;
//   }

//   if (check === "typecheck" && existsSync(path.join(repoRoot, "tsconfig.json"))) {
//     const localTsc = path.join(repoRoot, "node_modules", "typescript", "bin", "tsc");
//     if (existsSync(localTsc)) {
//       return `${quote(process.execPath)} ${quote(localTsc)} --noEmit --pretty false`;
//     }
//   }

//   return undefined;
// }

// async function runReviewAgents(input: {
//   agentPrompts: AgentPrompt[];
//   agentCommand?: string;
//   agentsInstructions: string;
//   base: string;
//   head: string;
//   changedFiles: string[];
//   checks: CheckResult[];
//   diff: string;
//   warnings: string[];
// }) {
//   if (!input.agentCommand) {
//     input.warnings.push("No REVIEW_AGENT_CMD or --agent-cmd was provided, so sub-agent review was skipped.");
//     return [];
//   }

//   const findings: Finding[] = [];

//   for (const agentPrompt of input.agentPrompts) {
//     const prompt = buildAgentPrompt({
//       agentPrompt,
//       agentsInstructions: input.agentsInstructions,
//       base: input.base,
//       changedFiles: input.changedFiles,
//       checks: input.checks,
//       diff: input.diff,
//       head: input.head,
//     });

//     const result = await runShellCommand(input.agentCommand, {
//       allowFailure: true,
//       stdin: prompt,
//       timeoutMs: Number(process.env.REVIEW_AGENT_TIMEOUT_MS ?? 300_000),
//     });

//     if (result.exitCode !== 0) {
//       input.warnings.push(`${agentPrompt.name} exited with code ${result.exitCode}.`);
//     }

//     const parsed = parseAgentFindings(result.stdout || result.stderr, agentPrompt.name, input.warnings);
//     findings.push(...parsed);
//   }

//   return findings;
// }

// function buildAgentPrompt(input: {
//   agentPrompt: AgentPrompt;
//   agentsInstructions: string;
//   base: string;
//   head: string;
//   changedFiles: string[];
//   checks: CheckResult[];
//   diff: string;
// }) {
//   return [
//     input.agentsInstructions,
//     "",
//     `# Sub-agent role: ${input.agentPrompt.name}`,
//     input.agentPrompt.prompt,
//     "",
//     "# Required output",
//     "Return only JSON in this shape:",
//     JSON.stringify(
//       {
//         findings: [
//           {
//             severity: "P1",
//             title: "Short actionable title",
//             file: "src/example.ts",
//             line: 10,
//             impact: "What breaks or what risk is introduced",
//             suggestedFix: "Concrete fix",
//             verification: "How to verify the fix",
//             existingFailure: false,
//           },
//         ],
//       },
//       null,
//       2,
//     ),
//     "Use an empty findings array if there are no actionable findings.",
//     "",
//     "# Review context",
//     `Base: ${input.base}`,
//     `Head: ${input.head}`,
//     "",
//     "# Changed files",
//     input.changedFiles.join("\n") || "(none)",
//     "",
//     "# Check results",
//     JSON.stringify(input.checks, null, 2),
//     "",
//     "# Diff",
//     input.diff || "(empty diff)",
//   ].join("\n");
// }

// function parseAgentFindings(rawOutput: string, source: string, warnings: string[]) {
//   const jsonText = extractJson(rawOutput);
//   if (!jsonText) {
//     warnings.push(`${source} did not return parseable JSON.`);
//     return [];
//   }

//   try {
//     const parsed = JSON.parse(jsonText) as { findings?: Partial<Finding>[] };
//     if (!Array.isArray(parsed.findings)) {
//       warnings.push(`${source} JSON did not include a findings array.`);
//       return [];
//     }

//     return parsed.findings
//       .map((finding) => normalizeFinding(finding, source))
//       .filter((finding): finding is Finding => Boolean(finding));
//   } catch (error) {
//     warnings.push(`${source} JSON parse failed: ${error instanceof Error ? error.message : String(error)}`);
//     return [];
//   }
// }

// function normalizeFinding(finding: Partial<Finding>, source: string): Finding | undefined {
//   const severity = parseSeverity(finding.severity);
//   if (!severity || !finding.title || !finding.impact || !finding.suggestedFix || !finding.verification) {
//     return undefined;
//   }

//   const line = Number(finding.line);

//   return {
//     severity,
//     title: finding.title,
//     file: finding.file,
//     line: Number.isFinite(line) ? line : undefined,
//     impact: finding.impact,
//     suggestedFix: finding.suggestedFix,
//     verification: finding.verification,
//     source,
//     existingFailure: Boolean(finding.existingFailure),
//   };
// }

// function extractJson(rawOutput: string) {
//   const fenced = rawOutput.match(/```(?:json)?\s*([\s\S]*?)```/u);
//   if (fenced?.[1]) {
//     return fenced[1].trim();
//   }

//   const start = rawOutput.indexOf("{");
//   const end = rawOutput.lastIndexOf("}");
//   if (start >= 0 && end > start) {
//     return rawOutput.slice(start, end + 1).trim();
//   }

//   return undefined;
// }

// function checkResultToFinding(check: CheckResult): Finding[] {
//   if (check.skipped || check.exitCode === undefined || check.exitCode === 0) {
//     return [];
//   }

//   const severity: Severity = check.name === "build" || check.name === "typecheck" || check.name === "test" ? "P1" : "P2";
//   const output = [check.stderr, check.stdout].filter(Boolean).join("\n").trim();

//   return [
//     {
//       severity,
//       title: `${check.name} failed`,
//       file: "package.json",
//       impact: `The ${check.name} check exits with code ${check.exitCode}, so the change is not currently passing CI-equivalent verification.`,
//       suggestedFix: `Run \`${check.command}\` locally, fix the reported failure, and rerun the harness.`,
//       verification: `\`${check.command}\` exits with code 0.`,
//       source: "harness",
//       existingFailure: false,
//       ...(output ? { suggestedFix: `Run \`${check.command}\` locally and fix the reported failure. First output:\n${trimOutput(output, 1_000)}` } : {}),
//     },
//   ];
// }

// function mergeAndSortFindings(findings: Finding[]) {
//   const merged = new Map<string, Finding>();

//   for (const finding of findings) {
//     const key = [
//       finding.severity,
//       finding.file ?? "",
//       finding.line ?? "",
//       normalizeText(finding.title),
//     ].join("|");

//     const existing = merged.get(key);
//     if (!existing) {
//       merged.set(key, finding);
//       continue;
//     }

//     existing.source = Array.from(new Set([...existing.source.split(", "), finding.source])).join(", ");
//   }

//   return Array.from(merged.values()).sort((left, right) => {
//     const severityDelta = severityRank[left.severity] - severityRank[right.severity];
//     if (severityDelta !== 0) {
//       return severityDelta;
//     }

//     return `${left.file ?? ""}:${left.line ?? 0}:${left.title}`.localeCompare(
//       `${right.file ?? ""}:${right.line ?? 0}:${right.title}`,
//     );
//   });
// }

// async function exportToNotion(report: ReviewReport, warnings: string[]) {
//   const token = process.env.NOTION_TOKEN;
//   const databaseId = process.env.NOTION_DATABASE_ID;
//   const titleProperty = process.env.NOTION_TITLE_PROPERTY ?? "Name";

//   if (!token || !databaseId) {
//     warnings.push("Notion export skipped because NOTION_TOKEN or NOTION_DATABASE_ID is missing.");
//     return;
//   }

//   const markdown = renderMarkdown(report);
//   const response = await fetch("https://api.notion.com/v1/pages", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//       "Notion-Version": "2022-06-28",
//     },
//     body: JSON.stringify({
//       parent: { database_id: databaseId },
//       properties: {
//         [titleProperty]: {
//           title: [{ text: { content: `Code review ${shortSha(report.head)}` } }],
//         },
//       },
//       children: chunkText(markdown, 1_900).slice(0, 90).map((chunk) => ({
//         object: "block",
//         type: "paragraph",
//         paragraph: {
//           rich_text: [{ type: "text", text: { content: chunk } }],
//         },
//       })),
//     }),
//   });

//   if (!response.ok) {
//     warnings.push(`Notion export failed: ${response.status} ${await response.text()}`);
//   }
// }

// async function commentOnGitHubPr(report: ReviewReport, prNumber: string | undefined, warnings: string[]) {
//   const token = process.env.GITHUB_TOKEN;
//   const repository = process.env.GITHUB_REPOSITORY;
//   const pullRequestNumber = prNumber ?? (await detectGitHubPrNumber());

//   if (!token || !repository || !pullRequestNumber) {
//     warnings.push("GitHub PR comment skipped because GITHUB_TOKEN, GITHUB_REPOSITORY, or PR number is missing.");
//     return;
//   }

//   const response = await fetch(`https://api.github.com/repos/${repository}/issues/${pullRequestNumber}/comments`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/vnd.github+json",
//       "Content-Type": "application/json",
//       "X-GitHub-Api-Version": "2022-11-28",
//     },
//     body: JSON.stringify({ body: renderMarkdown(report).slice(0, 60_000) }),
//   });

//   if (!response.ok) {
//     warnings.push(`GitHub comment failed: ${response.status} ${await response.text()}`);
//   }
// }

// async function detectGitHubPrNumber() {
//   const eventPath = process.env.GITHUB_EVENT_PATH;
//   if (!eventPath || !existsSync(eventPath)) {
//     return undefined;
//   }

//   const event = JSON.parse(await readFile(eventPath, "utf8")) as { pull_request?: { number?: number } };
//   return event.pull_request?.number ? String(event.pull_request.number) : undefined;
// }

// function renderMarkdown(report: ReviewReport) {
//   const lines = [
//     "# Automated Code Review",
//     "",
//     `- Generated: ${report.generatedAt}`,
//     `- Base: \`${report.base}\``,
//     `- Head: \`${report.head}\``,
//     `- Changed files: ${report.changedFiles.length}`,
//     `- Findings: ${report.findings.length}`,
//     "",
//     "## Checks",
//     "",
//     ...report.checks.map((check) => {
//       if (check.skipped) {
//         return `- ${check.name}: skipped (${check.reason})`;
//       }

//       return `- ${check.name}: ${check.exitCode === 0 ? "passed" : `failed (${check.exitCode})`} - \`${check.command}\``;
//     }),
//     "",
//     "## Findings",
//     "",
//   ];

//   if (report.findings.length === 0) {
//     lines.push("No actionable findings.");
//   } else {
//     for (const finding of report.findings) {
//       const location = finding.file ? `${finding.file}${finding.line ? `:${finding.line}` : ""}` : "No file";
//       lines.push(
//         `### ${finding.severity} ${finding.title}`,
//         "",
//         `- Location: ${location}`,
//         `- Source: ${finding.source}`,
//         `- Existing failure: ${finding.existingFailure ? "yes" : "no"}`,
//         `- Impact: ${finding.impact}`,
//         `- Suggested fix: ${finding.suggestedFix}`,
//         `- Verification: ${finding.verification}`,
//         "",
//       );
//     }
//   }

//   if (report.warnings.length > 0) {
//     lines.push("", "## Warnings", "", ...report.warnings.map((warning) => `- ${warning}`));
//   }

//   return `${lines.join("\n")}\n`;
// }

// function printSummary(report: ReviewReport, options: CliOptions) {
//   console.log(renderMarkdown(report));
//   console.log(`JSON report: ${options.jsonOut}`);
//   console.log(`Markdown report: ${options.markdownOut}`);
// }

// async function readPackageJson() {
//   const packagePath = path.join(repoRoot, "package.json");
//   if (!existsSync(packagePath)) {
//     return undefined;
//   }

//   return JSON.parse(await readFile(packagePath, "utf8")) as { scripts?: Record<string, string> };
// }

// function detectPackageManager() {
//   if (existsSync(path.join(repoRoot, "bun.lock"))) {
//     return "bun";
//   }

//   if (existsSync(path.join(repoRoot, "pnpm-lock.yaml"))) {
//     return "pnpm";
//   }

//   if (existsSync(path.join(repoRoot, "yarn.lock"))) {
//     return "yarn";
//   }

//   return "npm";
// }

// async function readOptionalFile(filePath: string) {
//   if (!existsSync(filePath)) {
//     return "";
//   }

//   return readFile(filePath, "utf8");
// }

// async function git(args: string[], options: { allowFailure?: boolean } = {}) {
//   return execFileCapture("git", ["-c", `safe.directory=${repoRoot.replaceAll("\\", "/")}`, ...args], options);
// }

// async function execFileCapture(command: string, args: string[], options: { allowFailure?: boolean } = {}) {
//   return new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
//     execFile(command, args, { cwd: repoRoot, maxBuffer: 20 * 1024 * 1024 }, (error, stdout, stderr) => {
//       const exitCode =
//         error && typeof error === "object" && "code" in error && typeof error.code === "number" ? error.code : 0;
//       const result = { stdout, stderr, exitCode };

//       if (error && !options.allowFailure) {
//         reject(Object.assign(error, result));
//         return;
//       }

//       resolve(result);
//     });
//   });
// }

// async function runShellCommand(
//   command: string,
//   options: { allowFailure?: boolean; stdin?: string; timeoutMs?: number } = {},
// ) {
//   return new Promise<{ stdout: string; stderr: string; exitCode: number }>((resolve, reject) => {
//     const child = spawn(command, {
//       cwd: repoRoot,
//       shell: true,
//       stdio: ["pipe", "pipe", "pipe"],
//       timeout: options.timeoutMs,
//     });

//     let stdout = "";
//     let stderr = "";

//     child.stdout.on("data", (chunk: Buffer) => {
//       stdout += chunk.toString("utf8");
//     });

//     child.stderr.on("data", (chunk: Buffer) => {
//       stderr += chunk.toString("utf8");
//     });

//     child.on("error", (error) => {
//       if (options.allowFailure) {
//         resolve({ stdout, stderr: `${stderr}\n${error.message}`.trim(), exitCode: 1 });
//         return;
//       }

//       reject(error);
//     });

//     child.on("close", (code) => {
//       const exitCode = code ?? 1;
//       const result = { stdout, stderr, exitCode };

//       if (exitCode !== 0 && !options.allowFailure) {
//         reject(Object.assign(new Error(`Command failed: ${command}`), result));
//         return;
//       }

//       resolve(result);
//     });

//     if (options.stdin) {
//       child.stdin.write(options.stdin);
//     }
//     child.stdin.end();
//   });
// }

// function parseSeverity(value: unknown): Severity | undefined {
//   return value === "P0" || value === "P1" || value === "P2" || value === "P3" ? value : undefined;
// }

// function normalizeText(value: string) {
//   return value.toLowerCase().replace(/\s+/gu, " ").trim();
// }

// function quote(value: string) {
//   return `"${value.replace(/"/gu, '\\"')}"`;
// }

// function shortSha(value: string) {
//   return value.slice(0, 7);
// }

// function chunkText(value: string, chunkSize: number) {
//   const chunks: string[] = [];
//   for (let index = 0; index < value.length; index += chunkSize) {
//     chunks.push(value.slice(index, index + chunkSize));
//   }
//   return chunks;
// }

// function trimOutput(value = "", maxLength = 4_000) {
//   const normalized = value.trim();
//   if (normalized.length <= maxLength) {
//     return normalized;
//   }

//   return `${normalized.slice(0, maxLength)}\n[output truncated]`;
// }

// main().catch((error) => {
//   console.error(error instanceof Error ? error.stack ?? error.message : error);
//   process.exitCode = 1;
// });
