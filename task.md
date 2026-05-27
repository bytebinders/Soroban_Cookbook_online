# Documentation: Contract Optimization Playbook

## Session Manifest
You are an expert smart contract engineer and technical writer. You write performance-focused guides that turn vague "optimize it" advice into repeatable, measurable workflows. You favor concrete numbers, copy-pasteable commands, and before/after comparisons over generic platitudes. You must follow the **Plan → Review → Execute** workflow.

## Global Constraints
- **NEVER** push to `main` directly. Branch: `docs/contract-optimization-playbook`.
- **NEVER** commit secrets, credentials, or benchmark artifacts.
- Match existing documentation style (tone, formatting, code block conventions, heading hierarchy).
- All code examples, benchmark commands, and profiling steps must be verified against the project's current contract SDK and toolchain.
- Cite or link to relevant source files where anti-patterns already exist or have been fixed in the codebase.
- Run documentation linters (markdownlint, Vale, or project equivalents) before finalizing.

## Mandatory Workflow
1. **Discover**: Read the issue, existing contract source files, current SDK tooling (CLI, RPC, sandbox), and any existing performance-related docs.
2. **Propose**: Post a detailed outline and **STOP** for maintainer review.
3. **Execute**: Only after receiving explicit "approved" or "LGTM".
4. **Validate**: Verify all commands and examples work in the local environment; paste a summary.
5. **Deliver**: Open a PR with `Closes #<issue-number>` and full verification steps.

---

## Issue Context
- **Type**: Documentation
- **Area**: Smart Contract Engineering / Performance
- **Complexity**: Medium-High
- **Impact**: Contributor efficiency and contract runtime cost reduction

### Objective
Author a practical optimization playbook that teaches contributors how to profile, benchmark, and improve contract performance systematically.

### Scope
- **Profiling and optimization workflow**: A repeatable loop from measurement to validation.
- **Benchmark methodology**: How to establish baselines, control variables, and interpret results.
- **Baseline metrics**: What numbers to capture before optimization begins.
- **Common performance anti-patterns**: Specific patterns to avoid, with before/after code examples.
- **Measurable improvements**: Every optimization technique must show how to prove it worked.

### Audience
Contributors who can write functional contracts but need guidance on making them efficient and cost-effective.

---

## Plan Requirements (Post This First)

Before writing, present a detailed outline covering:

1. **Guide Structure**
   - Proposed table of contents with heading hierarchy.
   - Estimated length and reading time.
   - Placement in the documentation tree (file path, sidebar position).

2. **Optimization Loop Definition**
   - The repeatable workflow you will document:
     - How to capture a baseline measurement.
     - How to identify the bottleneck.
     - How to apply a targeted change.
     - How to re-measure and compare.
   - Tools and commands for each step.

3. **Benchmark Methodology**
   - How to write a contract benchmark (test structure, transaction scenarios).
   - How to control for network conditions, ledger state, and compilation settings.
   - What metrics to collect (CPU instructions, memory usage, transaction size, gas cost).
   - How to store and compare benchmark results over time.

4. **Baseline Metrics Inventory**
   - Standard metrics contributors should record before optimizing:
     - Contract Wasm size.
     - Typical transaction cost (CPU, memory, entry reads/writes).
     - Cold vs. warm invocation costs.
   - Where to find these numbers in the project's tooling output.

5. **Performance Anti-Patterns**
   - List of anti-patterns you will cover (e.g., unbounded storage iteration, redundant deserialization, inefficient data structures, unnecessary cross-contract calls).
   - For each: the bad pattern, why it hurts, the optimized alternative, and a before/after code example with expected metric delta.

6. **Measurable Improvements Framework**
   - How every example in the playbook demonstrates improvement (percentage reduction, absolute cost savings).
   - Whether to include a "cost calculator" helper or reference table.
   - How contributors should document their own optimizations in PRs.

7. **Tooling & Environment**
   - SDK-specific profiling tools (e.g., `soroban-cli` cost simulation, RPC simulation endpoints, ledger entry inspection).
   - External tools if applicable (Wasm analyzers, flamegraph generators).
   - Required environment setup and versions.

8. **Validation Strategy (Docs)**
   - How you will verify all commands run successfully (local execution, CI doc tests, or manual QA).
   - How you will verify benchmark examples produce the stated results.
   - Target readability score or linting rules.

---

## Execution Rules

After plan approval:

- [ ] Draft the playbook with a clearly defined, repeatable optimization loop.
- [ ] Provide benchmark methodology with baseline metrics contributors should capture.
- [ ] Document common performance anti-patterns with before/after code examples.
- [ ] Ensure every optimization example demonstrates measurable improvement.
- [ ] Make guidance actionable: contributors should know exactly what to run and what to change.
- [ ] Do not introduce placeholder sections; all headings must have substantive content.
- [ ] Do not couple unrelated concepts into this PR.
- [ ] PR description must include:
  - `Closes #<issue-number>`
  - Table of contents of the final playbook
  - Validation steps confirming all commands and examples execute correctly
  - Any new dev-dependencies or scripts added for benchmarking

## Suggested Validation

Run these and include a summary in the PR:

```bash
# If examples include contract build/test commands
cargo build --release --target wasm32-unknown-unknown
soroban contract build  # or project-specific CLI

# If examples include benchmark tests
cargo test --release -- bench
# or project-specific benchmark runner

# Documentation linting
vale docs/
# or
markdownlint docs/
```

For manual review:
- Execute every CLI command in the playbook and confirm the output matches what is documented.
- Run at least one before/after benchmark pair and verify the delta is reproducible.
- Confirm all cross-references to existing contract source files are accurate.

## Acceptance Criteria
- [ ] Playbook includes a repeatable optimization loop.
- [ ] Examples demonstrate measurable improvements with before/after comparisons.
- [ ] Guidance is actionable for contributors (commands to run, files to modify, metrics to watch).
- [ ] Benchmark methodology and baseline metrics are clearly documented.
- [ ] Common performance anti-patterns are identified with concrete solutions.
- [ ] Implementation is complete and merge-ready (no placeholder sections).
- [ ] Reviewer can verify behavior without guesswork.

## Commit Message
```
docs: Add contract optimization playbook

- Documents repeatable profiling and optimization workflow
- Defines benchmark methodology and baseline metrics to capture
- Catalogs common performance anti-patterns with before/after examples
- Ensures every optimization shows measurable improvement
- Provides actionable commands and tooling setup for contributors

Closes #<issue-number>
```

---

## Context Discovery Checklist
Before proposing your plan, confirm you have read:
- [ ] Existing contract source files with known performance bottlenecks (or recent optimization PRs).
- [ ] Current SDK/tooling documentation for profiling, simulation, or cost estimation.
- [ ] Existing developer guides or README sections on testing, deployment, or performance.
- [ ] Any benchmark or test infrastructure already in the project (benchmark harnesses, CI jobs).
- [ ] Documentation style guide or template (heading conventions, code block labels, admonitions).
- [ ] How the project measures contract costs today (simulation output, gas tables, ledger entry fees).