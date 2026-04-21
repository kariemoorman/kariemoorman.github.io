---
layout: learning
title:  "dockerAudit"
subtitle: "A Container Security Auditing Toolkit"
summary: "A Golang-based container security auditing toolkit, with Trivy and Snyk CVE scanning integration. Aligned with CIS Docker Benchmark v1.8+, NIST SP 800-190, and DoDI 8510.01 RMF controls."
date:   2026-04-10 20:05:01 +0700
categories: ["edu"]
image: "../media/images/dockeraudit/dockeraudit.png"
tags: ["docker", "k8s", "container", "audit"]
author: "Karie Moorman"
page_type: pages
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<ul style='display: flex; flex-wrap: row; gap: 30px; margin-left: 10px; justify-content: center;'>
<li><a href='#intro'>Overview</a></li>
<li><a href='#architecture'>Architecture</a></li>
<li><a href='#modes'>Scan Modes</a></li>
<li><a href='#example'>Example Usage</a></li>
</ul>
</div>

--- 

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>

<p>Container security tooling is fragmented. Dockerfile linters (e.g., hadolint, dockerfilelint) catch build-time issues, image scanners (e.g., Trivy, Snyk, Grype) surface CVEs, Kubernetes validators (e.g., kube-score, kubesec, kube-linter, Snyk) check manifests, and Terraform tools (e.g., tfsec, Checkov, Snyk) analyze cloud IaC. Many offerings excel in a single layer, but only few unify the full container lifecycle into one audit with a single compliance view:</p>
<p><code>
Dockerfile → image → compose → Kubernetes manifests (and Helm charts) → Terraform → Managed Cloud Resources  
</code></p>

<p>This fragmentation creates gaps in visibility and compliance coverage. For AI agents, it increases orchestration overhead, driving more tool calls, higher token consumption, and larger context windows.</p>

<p>To address this friction point, I created dockerAudit, a unified, compliance-first container security auditing toolkit.</p>

<p>dockerAudit scans the full container lifecycle: Dockerfile and Docker Compose files, Docker images, Kubernetes manifests (with Helm rendering), and Terraform, against 80+ controls, returning actionable, interpretable findings mapped to CIS Docker Benchmark, NIST SP 800-53, NIST SP 800-190, ISO 27001, SOC 2, and DISA CCI. Its purpose is to produce one report that satisfies both an auditor and a platform engineer, from a single scan, in formats CI systems already understand (SARIF, JUnit, Markdown, JSON, table).</p>

<p>dockerAudit is designed for AI pentesting agents, security engineers running pre-merge checks in CI, platform teams hardening deployments before rollout, and compliance staff producing audit artifacts from the same underlying data. It runs self-hosted, requires no cloud account, and is suitable for air-gapped and regulated environments.</p>

</div>

<p align='center'>Github: <a href='https://github.com/kariemoorman/dockeraudit/' target='_blank'>dockeraudit</a></p>

---

<h3 id='architecture' align='center'>Architecture</h3>

```
 ┌──────────────────┐    ┌────────────────────┐    ┌────────────────────┐
 │  cmd/dockeraudit │───▶│  internal/scanner  │───▶│ internal/reporter  │
 │    (cobra CLI)   │    │  (per-target scan) │    │ (5 output formats) │
 └──────────────────┘    └─────────┬──────────┘    └────────────────────┘
                                   │
                         ┌─────────▼──────────┐
                         │  Control Registry  │
                         │   (metadata &      │
                         │  compliance map)   │
                         └─────────┬──────────┘
                                   │
                         ┌─────────▼──────────┐
                         │   Finding Model    │
                         │ · Control · Status │
                         │ · Target  · Detail │
                         │ · Evidence         │
                         └─────────┬──────────┘
                    ┌──────────────┼────────────┐
                    │              │            │
              ┌─────▼──────┐ ┌─────▼─────┐ ┌────▼──────┐
              │   Docker   │ │    K8s    │ │ Terraform │
              │ Dockerfile │ │ manifests │ │    .tf    │
              │   compose  │ │   Helm    │ │           │
              │   image    │ │  charts   │ │           │
              └─────┬──────┘ └─────┬─────┘ └─────┬─────┘
                    │              │             │
                    └──────────────┼─────────────┘
                                   │
                      ┌────────────▼─────────────┐
                      │     External Tools       │
                      │       (optional)         │
                      │  Trivy · Snyk · Helm     │
                      └──────────────────────────┘
```

#### Internal Components 

**Scanners** (`internal/scanner/`): each target type has its own scanner (`docker.go`, `k8s.go`, `image.go`, `terraform.go`). All implement the same `Scan(ctx)` (*ScanResult, error) signature, so they can be composed by the top-level scan command or invoked individually. 

#### Shared Types 

**Control Registry** (`internal/types/controls.go`): every control (e.g., RUNTIME-002, DB-K8S-001) is declared once with its title, severity, type (preventive/detective/corrective), and compliance mappings. Scanners reference controls by ID through `controlByID`, so mappings stay consistent across output formats and report types.

**Finding Model** (`internal/types/findings.go`): a single `Finding{Control, Status, Target, Detail, Evidence, Remediation}` struct represents every result. Status is one of PASS, FAIL, WARN, SKIPPED, ERROR. This uniformity lets the reporter render the same data to table, JSON, Markdown, SARIF, or JUnit without per-scanner logic.

#### External Tools

**Trivy**: provides image CVE scanning and IaC misconfiguration analysis.  
**Snyk**: offers an alternative CVE backend.  
**Helm**: renders charts for k8s scanning.  

Missing tools produce a `SKIPPED` finding with install hints rather than errors.


#### Control Classification

Controls carry three orthogonal classifications. Two are metadata used for filtering and compliance mapping, while the third governs how and where a control is evaluated.

1. Type: Preventive, Detective, or Corrective
Each control is assigned a type drawn from NIST control-family semantics. *Preventive* controls enforce a desired state before deviation occurs (non-root `USER`, dropped capabilities, digest pinning). *Detective* controls produce observations for subsequent review (vulnerability scans, audit logging, SBOM attestation). *Corrective* controls restore a desired state after deviation (operating-system patching, package upgrades). The type is displayed in the `TYPE` column of every report format and supports inclusion and exclusion filtering via the `--include-type` and `--exclude-type` flags.

2. Severity and Domain
Severity (CRITICAL, HIGH, MEDIUM, LOW) determines exit-code behavior under the `--fail-on` threshold and governs sort order in rendered output. Domain (Docker, Database, Kubernetes, Secrets, Terraform) groups related controls for the report controls summary and for dashboards in continuous-integration pipelines.

3. Evaluation Scope
The operational dimension that determines where a control is executed, how its findings are aggregated, and the set of outcomes it can produce. The three scopes are enumerated below:

<div style="display: flex; justify-content: center;">
<table>
  <thead>
    <tr>
      <th>Scope</th>
      <th>Where It Executes</th>
      <th>Typical Output</th>
      <th>Examples</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Per-resource</strong></td>
      <td>Evaluated against every Pod, container, Dockerfile instruction, or Terraform resource. Emits one finding per target.</td>
      <td><code>PASS</code> or <code>FAIL</code> per resource.</td>
      <td><code>RUNTIME-001</code> (non-root), <code>IMAGE-001</code> (digest pinning), <code>DB-K8S-001</code> (auth-disabling env vars)</td>
    </tr>
    <tr>
      <td><strong>Presence</strong></td>
      <td>Evaluated once after all per-resource checks finish. Passes if <em>any</em> resource in the scan satisfies it.</td>
      <td>Single <code>PASS</code> if satisfied, single cluster-level <code>WARN</code> if not.</td>
      <td><code>NETWORK-001</code> (default-deny policy exists), <code>SUPPLY-001</code> (image-signing policy exists), <code>MONITOR-001</code> (runtime-detection DaemonSet exists)</td>
    </tr>
    <tr>
      <td><strong>External-tool-delegated</strong></td>
      <td>Execution is forwarded to Trivy or Snyk. dockeraudit parses the tool's JSON and converts findings into the common <code>Finding</code> shape. Missing tool → <code>SKIPPED</code> with install hint.</td>
      <td>Zero-to-many <code>FAIL</code> findings per file, or a single <code>PASS</code>/<code>SKIPPED</code>.</td>
      <td><code>K8S-003</code> (Trivy config), <code>TF-009</code> (Trivy IaC), <code>IMAGE-003</code> (Trivy/Snyk CVEs)</td>
    </tr>
  </tbody>
</table>
</div>

<br>

This is the reason the user may see only one line for a given control in a scan that covered dozens of resources: it's a presence control. It's also why certain controls can't be evaluated offline (`external-tool-delegated`), and it tells the user where to look in the code when you want to extend a check: 
- per-resource checks live in the `check*` functions invoked from the per-resource loop.
- presence checks live in the scan-level aggregation block at the bottom of each scanner's `Scan(ctx)`.
- `external-tool-delegated` checks live in `vulnscan.go`.

<br> 

---

<h3 id='modes' align='center'>Scan Modes</h3>

dockerAudit currently supports 4 scan modes: `docker`, `image`, `k8s`, and `terraform`.

#### docker

`dockeraudit docker` 

Scans Dockerfiles and Docker Compose files for security misconfigurations.

Checks include non-root USER, image digest pinning, plaintext secrets in ENV/ARG, SUID/SGID files, ADD of remote URLs and curl/wget pipe-to-shell patterns, EOL base images, unnecessary debug/dev tools, package manager integrity flags, VOLUME declarations over sensitive paths, ADD vs COPY for local files, minimal base image and multi-stage build usage, broad COPY . . patterns, SSH daemon in CMD/ENTRYPOINT, privileged port EXPOSE, and HEALTHCHECK presence. Compose checks include privileged mode, dropped capabilities, read-only root filesystem, host PID/IPC/Network namespaces, resource limits, seccomp profiles, sensitive host volume mounts (docker.sock, /proc, /sys), ulimits, restart policy, plaintext credentials and AI/vectorizer API keys in environment variables, and allowPrivilegeEscalation.


Automatically detects file type:
  - Dockerfile, Dockerfile.*, *.dockerfile, Containerfile
  - docker-compose*.yml/yaml, compose.yml/yaml


**Usage:**
```
  dockeraudit docker [PATH...] [flags]
```

**Flags:**
```
      --exclude-check strings   Exclude specific control IDs from results (e.g. --exclude-check IMAGE-001,RUNTIME-010)
      --fail-on string          Exit non-zero on: critical, high, medium, low, any (default "high")
  -f, --format string           Output format: table, json, markdown, sarif, junit (default "table")
  -h, --help                    help for docker
      --include-check strings   Include only specific control IDs in results (e.g. --include-check IMAGE-001,IMAGE-005)
  -o, --output string           Write results to file
  -s, --scanner strings         Vulnerability scanners to use (trivy, snyk, none) (default [trivy,snyk])
```

**Examples:**
  ```
  dockeraudit docker ./
  dockeraudit docker Dockerfile docker-compose.yml --format json
  dockeraudit docker ./app/ ./infra/ --fail-on critical
  ```


#### image

`dockeraudit image` 

Scans Docker images for security misconfigurations and vulnerabilities.

Checks include non-root USER and runAsUser in config, digest pinning, plaintext credentials in ENV vars, secret and credential files in the image filesystem (SSH keys, AWS credentials, .netrc, kubeconfig), SUID/SGID and world-writable binaries, end-of-life base images, cryptominer artifacts (xmrig, nbminer, known pool endpoints), the xz-utils CVE-2024-3094 backdoor, SSH daemon in entrypoint/cmd, privileged port exposure (<1024), HEALTHCHECK definition, database-specific checks (admin/debug tools bundled in DB images, dangerous startup flags), SBOM generation and attestation, and CVE vulnerability scanning via Trivy and/or Snyk when available.

**Usage:**
```
  dockeraudit image [IMAGE...] [flags]
```

**Flags:**
```
      --eol-file string         Path to JSON file with custom end-of-life image definitions (overrides built-in list)
      --exclude-check strings   Exclude specific control IDs from results (e.g. --exclude-check IMAGE-001,RUNTIME-010)
      --fail-on string          Exit non-zero on: critical, high, medium, low, any (default "high")
  -f, --format string           Output format: table, json, markdown, sarif, junit (default "table")
  -h, --help                    help for image
      --include-check strings   Include only specific control IDs in results (e.g. --include-check IMAGE-001,IMAGE-005)
  -o, --output string           Write results to file
  -s, --scanner strings         Vulnerability scanners to use (trivy, snyk, none) (default [trivy,snyk])
      --timeout int             Timeout in seconds per image (default 180)
```

**Examples:**
```
  dockeraudit image nginx:latest
  dockeraudit image myapp:v1.0 --format json -o results.json
```


#### k8s

`dockeraudit k8s` 

Scans Kubernetes manifests including Helm charts (auto-rendered via helm template before scanning) for security misconfigurations and vulnerabilities.

Checks include pod security context, resource limits, host namespace and hostPath isolation, liveness/readiness probes, seccomp/AppArmor/SELinux profiles, default-deny NetworkPolicy and cloud metadata egress blocks, RBAC secret scoping, plaintext secrets in env vars or annotations, external secret management, database-specific hardening, image digest pinning and EOL base image detection in container specs, automountServiceAccountToken, dedicated namespace usage, pod anti-affinity/topology spread, admission-time image signature verification (Kyverno), API-server audit policies, and runtime threat-detection DaemonSets (Falco/Tetragon/Sysdig).


**Usage:**
```
  dockeraudit k8s [PATH...] [flags]
```

**Flags:**
```
      --exclude-check strings   Exclude specific control IDs from results (e.g. --exclude-check K8S-001,K8S-003)
      --fail-on string          Exit non-zero on: critical, high, medium, low, any (default "high")
  -f, --format string           Output format: table, json, markdown, sarif, junit (default "table")
  -h, --help                    help for k8s
      --include-check strings   Include only specific control IDs in results (e.g. --include-check K8S-001,K8S-005)
  -o, --output string           Write results to file
  -s, --scanner strings         Vulnerability scanners to use (trivy, snyk, none) (default [trivy,snyk])
```

**Examples:**
```
  dockeraudit k8s ./manifests/
  dockeraudit k8s helm_charts/
  dockeraudit k8s deployment.yaml service.yaml --format markdown
```


#### terraform

`dockeraudit terraform` 

Scans Terraform files for container security misconfigurations and vulnerabilities.

Checks include S3 public access and versioning, ECR tag immutability and scan-on-push, ECS task-definition hardening (non-privileged, non-root user, read-only root filesystem), security groups that allow unrestricted ingress or expose the unauthenticated Docker daemon TCP port (2375/2376), KMS encryption on EBS/RDS/S3, CloudTrail and VPC flow-log enablement, EKS audit logging and Bottlerocket AMI type, IMDSv2 enforcement, GKE NetworkPolicy enablement, RDS public-accessibility and encryption-at-rest, ElastiCache encryption-in-transit and auth-token configuration, managed NoSQL encryption (DynamoDB, DocumentDB, Neptune), and hardcoded secrets or credentials in resource attributes.

**Usage:**
```
  dockeraudit terraform [PATH...] [flags]
```

**Flags:**
```
      --exclude-check strings   Exclude specific control IDs from results (e.g. --exclude-check TF-001,TF-003)
      --fail-on string          Exit non-zero on: critical, high, medium, low, any (default "high")
  -f, --format string           Output format: table, json, markdown, sarif, junit (default "table")
  -h, --help                    help for terraform
      --include-check strings   Include only specific control IDs in results (e.g. --include-check TF-001,TF-005)
  -o, --output string           Write results to file
  -s, --scanner strings         Vulnerability scanners to use (trivy, snyk, none) (default [trivy,snyk])
```

**Examples:**
```
  dockeraudit terraform ./infrastructure/
  dockeraudit terraform ./aws/ ./gcp/ --format json
```

<br> 

---

<h3 id='example' align='center'>Example Usage</h3>


#### Dockerfile

<p align='center'><img src="{{ '/media/images/dockeraudit/dockerfile.png' | relative_url }}" width='80%'></p>

#### Docker Image

<p align='center'><img src="{{ '/media/images/dockeraudit/dockerimage.png' | relative_url }}" width='80%'></p>


#### Docker Image with Trivy Scan 

<p align='center'><img src="{{ '/media/images/dockeraudit/dockerimage_trivy.png' | relative_url }}" width='80%'></p>

#### Kubernetes

<p align='center'>
<img src="{{ '/media/images/dockeraudit/k8s_1.png' | relative_url }}" width='80%'>
<img src="{{ '/media/images/dockeraudit/k8s_2.png' | relative_url }}" width='80%'>
<img src="{{ '/media/images/dockeraudit/k8s_3.png' | relative_url }}" width='80%'>
<img src="{{ '/media/images/dockeraudit/k8s_4.png' | relative_url }}" width='80%'>
</p>

#### Terraform - AWS IAM

<p align='center'><img src="{{ '/media/images/dockeraudit/terraform_2.png' | relative_url }}" width='80%'></p>


#### Terraform - AWS S3

<p align='center'><img src="{{ '/media/images/dockeraudit/terraform_1.png' | relative_url }}" width='80%'></p>