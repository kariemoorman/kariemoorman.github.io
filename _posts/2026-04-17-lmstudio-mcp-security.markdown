---
layout: learning
title:  "MCP Protocol"
subtitle: "Auditing MCP Security in LM Studio"
summary: "A reproduction of vulnerability behavior, documentation of the threat model, and a proposed set of actionable mitigations."
date:   2026-04-17 20:01:01 +0700
categories: ["edu"]
image: "../media/images/lmstudio.png"
tags: ["mcp", "lmstudio", "security"]
author: "Karie Moorman"
page_type: pages
---

<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<ul style='display: flex; flex-wrap: row; gap: 30px; margin-left: 10px; justify-content: center;'>
<li><a href='#intro'>Overview</a></li>
<li><a href='#audit'>Audit</a></li>
<li><a href='#mitigations'>Mitigations</a></li>
<li><a href='#next'>Next Steps</a></li>
</ul>
</div>

--- 

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>

<p><b>MCP</b></p>

<p>The Model Context Protocol (MCP) is an open standard introduced by Anthropic in 2024 for connecting AI assistants to external tools, data sources, and services. An MCP host (or client) reads a configuration file listing MCP servers to launch, spawns each one as a child process, and communicates with it over standard input/output using JSON-RPC 2.0.</p>

<p><b>Disclosed MCP Vulnerability</b></p>

<p>In April 2026, OX Security published <a href='https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/' target='_blank'>a supply-chain advisory</a> describing how the MCP protocol design is <i>execute-first, validate-later</i>: an MCP host spawns the configured command before the JSON-RPC handshake has a chance to verify that the process is a legitimate server. This means <i><b>any</b></i> code in the configured command runs first; validation failure is reported only after. This flaw enables Arbitrary Command Execution (RCE) on any system running a vulnerable MCP implementation, granting attackers direct access to sensitive user data, internal databases, API keys, and chat histories.</p>

<p>Scary right? Yes.</p>

<p>Anthropic's response? Unfortunately, Anthropic has declined to patch, despite repeated requests from OX Security (and others). Instead, Anthropic confirmed the behavior is "by design", stating that sanitization is the integrator's responsibility.</p>

<p><b>LM Studio</b></p>

<p><a href='https://lmstudio.ai/' target='_blank'>LM Studio</a> is a cross-platform desktop application for downloading and running local LLMs. LM Studio acts as an <a href='https://lmstudio.ai/docs/app/mcp' target='_blank'>MCP host</a>: users can add MCP servers through the UI, through the "Add to LM Studio" <a href='https://lmstudio.ai/docs/app/mcp/deeplink' target='_blank'>deeplink</a> button, or by directly editing the <code>mcp.json</code> configuration file. Because LM Studio is an MCP host that spawns configured servers via STDIO, it is structurally subject to the same execute-first/validate-later pattern described in the OX advisory. Why? The flaw is a property of the MCP protocol. However, the degree of user exposure depends on the UX guardrails each host chooses to add around it (i.e., "shared responsibility").</p>

<p>As a user of LM Studio I wanted to better understand how I am impacted. So, I conducted a simple reproduction in alignment with OX Security's responsible disclosure.</p>

</div>

<br>

---

<h3 id='audit' align='center'>Audit</h3>

This audit empirically reproduces the behavior on LM Studio using a deliberately benign payload (i.e., a timestamp written to a tempfile), documents the exact timing relationship between command execution and handshake validation, and proposes a set of mitigations to harden the LM Studio application. The goal is not to identify a new vulnerability, rather to surface where LM Studio's current UX leaves users exposed and to provide concrete recommendations for reducing that exposure.

#### Environment
- LM Studio: 0.4.12 with MCP support (Program → Install → Edit `mcp.json`)
- OS: macOS 
- MCP transport: STDIO (default for `command`/`args` entries in `mcp.json`)

#### Reproduction

<ol>
  <li>
    <p>Open LM Studio, add this entry to <code>mcp.json</code>:</p>
    <pre><code>{
  "mcpServers": {
    "rce-timing-test": {
      "command": "sh",
      "args": [
        "-c",
        "date '+%Y-%m-%dT%H:%M:%S' &gt;&gt; /tmp/mcp-test.log; echo not-a-real-mcp-server"
      ]
    }
  }
}</code></pre>
    <p>The <code>echo not-a-real-mcp-server</code> line is deliberately invalid MCP JSON-RPC, guaranteeing the handshake fails.</p>
  </li>
  <li>
    <p>Enable the server in LM Studio's MCP UI.</p>
  </li>
  <li>
    <p>Observe <code>/tmp/mcp-test.log</code> in Terminal:</p>
    <pre><code>$ tail -f /tmp/mcp-test.log
2026-04-17T12:43:39
2026-04-17T12:52:09   ← enabled the server
2026-04-17T12:53:54
2026-04-17T12:53:59
2026-04-17T12:54:36   ← LM Studio quit and reopened
2026-04-17T12:55:46   ← LM Studio re-launched the server</code></pre>
  </li>
  <li>
    <p>Observe LM Studio logs at the same time:</p>
    <pre><code>2026-04-17 12:55:46 [DEBUG] [LMSAuthenticator][Client=plugin:installed:mcp/rce-timing-test] Client created.
2026-04-17 12:55:47 [ERROR] [Plugin(mcp/rce-timing-test)] stderr: [MCPBridge/unexpected]
                            Bridge process failed: MCP error -32000: Connection closed
2026-04-17 12:55:47 [DEBUG] [LMSAuthenticator][Client=plugin:installed:mcp/rce-timing-test] Client disconnected.</code></pre>
  </li>
  <li>
    <p>Perform cleanup &mdash; remove <code>rce-timing-test</code> from <code>mcp.json</code>, then remove the log file:</p>
    <pre><code>rm /tmp/mcp-test.log</code></pre>
  </li>
</ol>

#### Observed Behavior

The timestamp in <code>/tmp/mcp-test.log</code> lands within the 1-second window between "Client created" and "Bridge process failed". The command ran. The handshake then failed. LM Studio surfaced the bridge failure but did not prevent (and could not have prevented) the command's execution.

<div style="display: flex; justify-content: center;">
<table>
<tr>
<th>Action</th>
<th>Result</th>
</tr>
<tr>
<td>Add entry, save `mcp.json` (server disabled)</td>
<td>Command does not run (GOOD)</td>
</tr>
<tr>
<td>Enable server toggle</td>
<td>Command runs once (BAD)</td>
</tr>
<tr>
<td>Quit + reopen LM Studio (server still enabled)</td>
<td>Command runs again on launch (BAD)</td>
</tr>
<tr>
<td>Disable server toggle</td>
<td>Command does not run on next launch (GOOD)</td>
</tr>
<tr>
<td>Confirmation prompt before first launch</td>
<td>None observed (BAD)</td>
</tr>
</table>
</div>

<br>

#### Impact 

The behavior itself is well-known and is by design at the MCP protocol level (Anthropic confirmed in the OX advisory that sanitization is the integrator's responsibility). The concern specific to LM Studio is the **lack of UI friction** at the point where the risk materializes:

- A malicious or typosquatted MCP server entry (e.g., added manually, by an "Add to LM Studio" deeplink, or by any process with write access to `mcp.json`) runs unconditionally on the next enable AND every subsequent launch.
- A real attacker would `nohup` / `setsid` / `fork` before producing invalid JSON-RPC, allowing the spawned child to **survive after LM Studio kills the bridge**. A more skilled attack would ensure the handshake succeeds. This makes `mcp.json` itself a free persistence mechanism: anything with write access to it gains boot-equivalent reliability without needing a separate persistence implant.
- The toggle being a real opt-out (verified above) is the **only** defense, and it places the entire burden on the user to never enable a malicious entry, including entries added via deeplinks where the user only sees a friendly name.

<br>

---

<h3 id='mitigations' align='center'>Mitigations</h3>

Below are a set of suggested mitigations that will increase safety for users of LM Studio. It's not exhaustive; it's actionable. 

**Tier 1: Easy to Implement**

**Consent Gates**
- **Confirmation dialog on first enable of a server**: Show the exact `command`, full `args` array, and resolved `cwd`. Cursor does this. It is the single most effective mitigation.
- **Re-prompt when command changes**: Detect via hash of `command + args` and re-confirm before next spawn.
- **Visible preview before saving `mcp.json`**: When a user types or pastes a server entry, show "this will run: `<resolved command line>`" before the save button is enabled.
- **Stronger UX for "Add to LM Studio" deeplinks**: Browser-launched deeplinks are the highest-risk vector — show a full-screen modal with the command, the source URL of the deeplink, and require a second click.

**Environment Hardening**
- **Strip dangerous env vars from the child process**: Strip env vars such as `LD_PRELOAD`, `LD_LIBRARY_PATH`, `DYLD_INSERT_LIBRARIES`, `DYLD_LIBRARY_PATH`, `PYTHONSTARTUP`, `NODE_OPTIONS`, `RUBYOPT`, `PERL5OPT`. These let an attacker hijack any spawned interpreter without modifying the configured `command`.
- **Use a clean minimal PATH by default**: Require explicit opt-in to inheriting the shell PATH.

**Documentation**
- **Document the threat model**: Add a description of the threat model in the MCP setup docs so users understand that (1) an enabled entry is equivalent to installed software, and (2) a deeplink is equivalent to a one-click installer.

**Tier 2: Moderate Effort**

**Lifecycle**
- **Kill the entire process group on bridge failure, not just the immediate child**: Today, a `nohup` / `setsid` / forked child survives after LM Studio kills the bridge. That is free persistence.
- **Don't auto-spawn on app launch**: Require explicit "Connect" per server per session, or at least per-launch confirmation. Today, enabled = automatic spawn forever.

**Source Restrictions**
- **Block obvious shell wrappers in `command`**: Proactively block `sh -c`, `bash -c`, `zsh -c`, `cmd /c`, `powershell -Command`, `powershell -EncodedCommand`. These have no legitimate MCP server use case.
- **Warn on suspicious paths**: Notify user in scenarios such as `command` pointing to `/tmp`, `~/Downloads`, `/Volumes/`, network mounts, etc.
- **Treat unrecognised launchers as advanced**: Package runners such as `npx`, `uvx`, `python -m`, `node`, `deno run` get the normal install flow. Any other command is labelled "advanced / arbitrary command" and requires an explicit "I understand the risk" click.

**User Visibility**
- **Show resolved binary path**: Surface resolved binary path after `PATH` lookup, not just what the user typed. `command: "python"` could resolve to anything.
- **Show process state**: Surface process state in the server pane: PID, spawn timestamp, handshake state, last activity.
- **Expand audit log**: Include of every spawn / kill / handshake event in a user-visible location with timestamps.
- **Detect binary change between sessions**: Hash the resolved binary; if it changes, re-prompt before launching.

**Tier 3: Harder to Implement**

**Process Isolation** (per-platform)
- **macOS**: spawn under `sandbox-exec` with a default profile (deny network, deny exec, restrict file access to a configurable workspace dir). Longer-term, ship as a properly sandboxed app with file-access entitlements.
- **Linux**: spawn under a `seccomp-bpf` filter, or under `bubblewrap` / `firejail` if available, or under a user namespace.
- **Windows**: spawn inside an AppContainer or as a low-integrity process. Restricted token at minimum.
- **All platforms**: separate the LM Studio app user from the MCP-server runner. Never spawn under the user's primary account if avoidable.

**Network Policy**
- **Default-deny outbound network from spawned children**: Most MCP servers don't need it; ones that do declare it in their manifest.
- **Refuse undeclared sockets on STDIO servers**: Do not let the child open any network sockets unless its manifest declares the need.

**Tier 4: Ecosystem-Level (i.e., Anthropic)**

Ox Security defines the required fix from Anthropic as follows: 
"Anthropic could implement manifest-only execution or a command allowlist in the official SDKs, a single protocol-level change that would instantly propagate protection to every downstream library and project" ([source](https://www.ox.security/blog/the-mother-of-all-ai-supply-chains-critical-systemic-vulnerability-at-the-core-of-the-mcp/)).

This solution may not be best, for at least two reasons: 
<ol>
<li>An allowlist at the SDK level is a breaking change that doesn't actually solve the problem. Today command accepts any executable; that's the documented contract. Every host (e.g., Cursor, Claude Desktop, LM Studio, LibreChat) depends on launching arbitrary binaries: uvx, npx, docker, user-authored servers. A hardcoded allowlist breaks legitimate deployments immediately, and gets worked around trivially (symlinks, wrapper scripts, renaming binaries), pushing the problem downstream rather than fixing it. The SDK becomes the bottleneck without being the solution.</li>
<li>Manifests and signing are correct, but they belong one layer up. The SDK receives a <code>StdioServerParameters</code> and spawns a process. It has no idea whether that object came from a user clicking "install" in a trusted marketplace, a hand-edited config file, a signed manifest, or an LLM's prompt injection. Only the host (i.e., the application embedding the SDK) has that trust context. Forcing manifest verification into the SDK would mean inventing a manifest format that the MCP spec doesn't define, creating a de-facto standard that other SDKs (TypeScript, Kotlin, Go) would have to reverse-engineer or ignore. That's a spec-level decision, not a library decision.</li>
</ol>

Instead, the SDK could reliably provide:
- **Hook Points**: Add a pre-spawn `command_validator` and a post-handshake `capability_validator` so that every host can plug in its own policy (e.g., allowlist, manifest check, user prompt, signing verification) in one place. These hooks fire before any subprocess is spawned and before any tool calls are allowed, giving hosts a guaranteed decision point that can't be accidentally bypassed.
- **MCP protocol specification**: Propose additions to the MCP protocol specification (i.e., the cross-language standard that all SDKs implement and all hosts build against) that define a manifest format, signing scheme, and OS capability vocabulary. Once ratified, hosts can adopt and enforce these through the same hooks without waiting for another SDK release.

This way, the SDK doesn't pick a policy (i.e., no hardcoded rules, no signed manifest requirements). Instead, it makes policy enforcement trivial for those who have the context to enforce it: `stdio_client()` calls the host's validator before spawning any process, and the host decides what's allowed based on its own trust model. A host might require marketplace signatures. A host might prompt the user. An enterprise deployment might enforce a centrally-managed allowlist. The SDK guarantees the decision point exists; the host makes the call.

MCP Server authors declare what they are and what they need (via manifests). Hosts decide whether to trust those declarations. The SDK makes sure the host gets asked.

<br>

---

<h3 id='next' align='center'>Next Steps</h3>


For LM Studio, I filed a bug report describing the issue and possible UX mitigations described above (see <a href='https://github.com/lmstudio-ai/lmstudio-bug-tracker/issues/1819' _target='blank'>bug report</a>). Hopefully LM Studio agrees to harden their MCP Server integration to help protect its users.

For MCP Protocol, as of April 2026 Anthropic's mission still mentions building AI that serves humanity's long-term well-being, with specific goals defined to ensure that transformative AI has a positive impact on humanity (see <a href='https://www.anthropic.com/company' target='_blank'>"(1) Act for Global Good", "(3) Be Good to Our Users", "(6) Be Helpful, Honest, and Harmless"</a>). Hopefully Anthropic agrees to address limitations in its original implementation, and help end users stay safe. 

