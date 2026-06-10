---
layout: learning
title:  "Agent Harness"
subtitle: "Agent Infrastructure for Homelabs"
summary: "A high-level overview of the agent harness I built for my homelab, including multi-agent orchestration, memory management, tool management, artifact and secrets management, experimentation, observability, and network monitoring."
date:   2026-06-02 15:12:41 +0700
categories: ["edu"]
image: "../media/images/agent_harness/agent_harness.png"
tags: ["llms", "agents", "homelab"]
author: "Karie Moorman"
page_type: pages
---

<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<div class='centered-list'>
<ul>
<li><a href='#intro'>Overview</a></li>
<li><a href='#design'>System Design</a></li>
<li><a href='#faq'>FAQs</a></li>
</ul>
</div>
</div>


---

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>

<p>After many years, generative transformer models have finally matured into practical development tools. LLMs can now forage for information, take actions autonomously, and operate with whatever permissions their host process grants them. Without deliberate constraints, that capability becomes a liability. To quote the great Stan Lee, "with great power there must also come -- great responsibility." So, I built an agent harness for my homelab.</p>

<p><b>Agent Harness</b></p>

<p>An agent harness is the infrastructure that surrounds an AI model and enables it to perform tasks reliably and efficiently. This includes managing context, tool usage, governance, and security. Without one, the model operates with implicit trust and unbounded capability: it can call any tool, access any resource, and act on any input, including attacker-controlled input, with whatever privileges the runtime grants it. The harness exists to close that gap.</p>

<p><b>Zero Trust: Agent Autonomy and Security</b></p>

<p>Zero trust is a security model that eliminates the concept of a trusted internal network. The core principle is <i>never trust, always verify</i>. Instead of "trust everything inside the perimeter, distrust everything outside," every request is authenticated, authorized, and verified regardless of where it originates.</p>

<p>In the context of an agent harness, zero trust means the harness assumes every input is hostile and every action is unauthorized until proven otherwise, rather than trusting the model's intent. The model decides <i>what</i> it wants to do; the harness decides whether that is <i>allowed</i>. In practice this translates to concrete controls, e.g., mediated execution through a policy broker that authorizes every tool call, credential isolation so the model never holds or sees secrets, network egress control that allowlists only the endpoints the agent needs, and irreversibility gating that requires human approval for actions that cannot be undone.</p>

<p><b>Agents and Homelabs</b></p>

<p>A homelab changes the threat model and constraints compared to a managed cloud
deployment. While owning the hardware and the network removes some multi-tenancy concerns, it also removes the guardrails a cloud platform provides (e.g., managed secrets storage and rotation, IAM and scoped service identities, network segmentation and egress proxies, audit logging pipelines, DLP controls on what data leaves the environment). In an enterprise setting the harness (hopefully) inherits these; in a homelab you either build them or consciously accept their absence.</p>

<p>For a homelab, two controls carry much weight: containment and observability. Containment includes isolating the agent runtime environment and scoping each tool to the narrowest permissions it needs, so a compromised agent cannot reach beyond its boundary. Observability includes append-only logging of every model request, tool invocation, and policy decision, so you can detect, interrupt, and reconstruct what happened after an incident. Without containment there is no blast-radius limit. Without observability there is no way to know a breach occurred.</p>

<p>The constraints of a homelab may create pressure to cut exactly the controls that contain a compromised agent. Resist it. Running any LLM adjacent to services you actually care about (e.g., NAS, media, home automation, your own workstation) is high-risk; blast-radius containment matters more, not less.</p>

</div>

<br>


---

<h3 id='design' align='center'>System Design</h3>

<br>

<p align='center'><img src="{{ '/media/images/agent_harness/agent_harness_plugins.png' | relative_url }}" height='800px' width='auto'></p>

<br>


### Interactive Agents

In addition to dashboards, the end user (e.g., me) can interact with scope-specific LLMs to learn about and engage with particular layers of the development ecosystem: network, projects, memory, observability, and CICD. These particular LLMs don't talk to each other; their purpose is to support communication and operations about that specific layer of the development ecosystem.

### Development Environment

The development environment contains the core infrastructure of the agent harness: Network Operations, Agent Orchestration, and Memory Operations.

#### Network Operations

The Network Operations module oversees provisioning, management, and monitoring of the infrastructure on which multi-agent systems run. The Network Fabric defines the connectivity and segmentation between agents, services, and modules.

The Hypervisor Operations module manages the virtualization layer beneath that fabric, allocating and isolating the compute on which workloads run. NetCore translates a project specification into a concrete deployment, validating the spec against policy before provisioning. Each project is instantiated into its own network segment and isolated compute boundary. Isolation is enforced continuously at the fabric and runtime, enforced based on per-project workload identity, ensuring each project's environment matches its declared shape and cannot reach another.

Network Operations also serves as the infrastructure monitoring plane for the platform, collecting health and telemetry from the network fabric, the hypervisors, and the underlying compute and hosts, providing a single vantage point over the health of the substrate on which the platform runs.


#### Agent Orchestration

The Agent Orchestration module acts as the harness's coordination layer, mediating between interactive agents and the platform's tools and services. It decomposes a project into tasks, assigns work across agents, routes messages between them, and assembles their results. Security, observability, and resilience are treated as first-class concerns in the orchestration design, embedded in the coordination model rather than layered over it.

Agents are provider-agnostic: local and external models are interchangeable behind a common interface, with fallback chains and circuit breakers maintaining availability when a provider degrades.

Orchestration supports multiple coordination patterns (e.g., sequential, supervisor delegation, hierarchical delegation, consensus/voting, DAG execution) and communication topologies (hub-and-spoke, mesh, publish/subscribe, hierarchical), selected independently per project to match the workflow's parallelism and messaging requirements.

Coordination is governed rather than open-ended. Each agent carries a trust level and a set of capabilities, and actions are authorized against those capabilities before they execute, so an agent can only perform work it is explicitly entitled to. All coordination activity is traced with correlation IDs and emitted as structured logs, giving the platform end-to-end visibility into how a task flowed across agents.


#### Memory Operations

The Memory Operations module owns the creation, maintenance, and governance of the platform's persistent memory across two scopes: project-specific memory, isolated to a single project and visible only to that project's agents, and global memory, shared platform-wide. It is also the substrate for model-specific reinforcement learning via MemOS, capturing task experience and feedback (outcomes, rewards, and signals tied to a given model and task) and retrieving relevant prior traces into the reasoning context at inference to improve agent reasoning.

Governance is enforced per scope: writes and reads are authorized through the gateway against the caller's role, project memory is partitioned so one project cannot read or write another's, and global memory is treated as a controlled, audited resource given its platform-wide reach. Memory is versioned so prior state is recoverable and changes are attributable.


### Development Tools

Core development tools available to to every Agent in a project development process include Artifactory, Identity Access Management, Database Operations, Project Management, Observability Platform, and CICD Platform.

#### Artifactory

The Artifactory is a centralized repository that contains validated software packages, containers, LLM and ML models, and other build artifacts. It acts as the single gated source from which projects pull dependencies. 

Artifacts enter only after passing validation (e.g., provenance and signature checks, vulnerability and license scanning, evaluation against the experimentation platform's metrics), undergo versioning, and become immutable once published. Consumers (i.e., humans, agents, skills, MCP servers, and CI pipelines) resolve dependencies exclusively through the Artifactory rather than arbitrary external registries, giving the system a controlled supply chain with a single point for access control, audit, and revocation.

#### Identity Access Managment

The Identity Access Management Module is the authority for credentials and access across the platform. It issues, stores, rotates, and revokes the secrets that agents, skills, MCP servers, and human operators present to reach resources and services. Callers authenticate against the platform identity provider and request access at point of use, and the module issues short-lived, narrowly scoped, dynamically generated credentials valid only for the specific resource, action, and window the caller's grant allows. 

Every issuance is bound to the caller's identity and the capability scope the gateway enforces, ensuring the same least-privilege model governs human and non-human callers alike. Secrets are encrypted at rest and in transit, never exposed to the agent context or logs, and every issue, use, rotation, and revocation is recorded in an append-only audit trail. Because credentials are short-lived and centrally revocable, a leaked or compromised secret has a bounded blast radius and can be cut off without redeploying the consumers that depend on it.

#### Database Operations

The Database Operations module is the controlled path through which agents and human operators perform CRUD operations on databases and tables across a predefined set of supported database engines. Each operation is authorized at the gateway and executed using a short-lived, scoped credential issued by the Identity Access Management Module at point of use, so a caller reaches only the databases, tables, and actions its grant allows. Before any mutating operation, affected tables are versioned to bound data loss and allow fast rollback to a known-good state in the event an operation corrupts or destroys data.

#### Project Management

The Project Management module scaffolds secure, production-ready project repositories. An end user specifies the project details (e.g., project use case, programming language(s), database(s), developer platform), via LLM or CLI, and a project-specific directory tree is created that includes supply chain configuration, security security controls, and templated CICD integration. Additional plugins provide access to vetted IaC reusable modules, AIML pipelines, evaluation metrics, database engines, containerization, and other reusable building blocks. This ensures every project starts from a consistent, policy-compliant baseline, reducing the chance of misconfiguration while improving development velocity.

#### Observability Platform

The Observability Platform module serves as the application and agent-tier monitoring plane. It collects telemetry from the agents, orchestration layer, and operations modules,giving a single vantage point over how the multi-agent system is behaving. Where Network Operations answers whether the infrastructure is healthy, the Observability Platform answers whether the workloads running on it are correct, performant, and behaving as expected.

The Observability Platform also captures application-tier security events: gateway authorization decisions and denials, credential issuance, memory-write rejections, and anomalous or out-of-policy agent activity. Together with the infrastructure-tier security events recorded by Network Operations, these feed a unified audit and correlation view, so security signals from both tiers can be analyzed together rather than in isolation.

#### CICD Platform

The CICD Platform module manages the build, test, and release pipeline for the platform's software projects. Driven by either a human or LLM and triggered by changes to a project, it builds artifacts, runs the project's test and validation suites, and promotes only artifacts that pass into the Artifactory as validated, versioned, signed builds. 

Each pipeline stage is authorized at the gateway and runs with a short-lived, scoped credential issued by the Identity Access Management Module for exactly the resources that stage requires. Build authority is a separate, isolated identity from deploy authority, and no single actor or pipeline stage holds both, to help ensure any compromised build pipeline cannot unilaterally reach production.


### Tool Plugins

#### Skills Gateway

Any skills that may be useful for a particular project are implemented via a gateway protocol. The gateway runs as a separate network service (sidecar) and acts as the single mediation point between the agent and any skill it invokes. Rather than granting skills direct access to the runtime, filesystem, or network, every skill call is issued over the local interface to the sidecar, which authenticates the caller, validates inputs against an expected schema, enforces per-skill capability scoping (i.e., least privilege), executes or proxies the skill in its own isolation boundary, sanitizes outputs before they re-enter the agent context, and logs the full I/O for audit. 

In this implementation, an agent never executes skill code in-process or holds skill credentials. Running out-of-process isolates skill logic from the host and allows a skill be independently sandboxed, resource-limited, swapped, or restarted without changing callers. This also ensures any crashing, hanging, compromised, or misbehaving skill cannot corrupt the agent's memory, inherit its privileges, or reach resources it was never authorized to touch.

#### MCP Server Gateway

Any MCP servers that may be useful for a particular project are implemented via a gateway protocol. This gateway acts as a centralized broker and policy enforcement point between the agent and the set of available MCP servers, presenting a unified interface so the agent does not hold direct connections or credentials to individual servers. 

The agent connects only to the gateway (sidecar) over a local, mutually authenticated channel. The gateway owns all upstream connections, credentials, and transport to the individual servers. It handles connection management, authentication and credential injection, request routing and tool-name namespacing (avoiding collisions across servers), input validation, response filtering, rate limiting, and normalization of transport differences to provide a single chokepoint for authorization decisions, allow/deny lists, and audit logging across all servers. 

Because it is network-isolated from both the agent and the upstream servers, it can sit in its own network segment with tightly scoped egress, terminating the agent's trust boundary at a controlled hop.


#### Experimentation Platform

The Experimentation Platform provides a controlled environment for evaluating software projects, prompts, and models against defined metrics before changes reach production. It supports versioned experiments, side-by-side comparison (A/B and multivariate), and reproducible runs by pinning inputs, configuration, and model/prompt versions to each trial. For evaluation targets where outputs are open-ended and resist exact-match metrics (e.g., prompt, model trials) the platform supports LLM-as-a-Judge scoring. 

Results are captured per run and persisted for regression tracking over time. Experiments execute through the same gateway and capability-scoping controls as production, so a trial reaches only the skills, MCP servers, and data its scope allows, and untrusted experiment definitions cannot acquire broader access than the run was granted.

<br>

---

<h3 id='faq' align='center'>FAQs</h3>


- **Are you using off-the-shelf libraries?** No. I write my own software. I want my SBOM to be lean, my system to be performant and scalable, and my code to be stable and secure. The simplest way to meet these expectations is to own the code. 

- **Are you going to release the software to the public?** No, not right now. Maybe in the future. However, I have released some tools, guides, and example implementations that have been useful (e.g., <a href='https://github.com/kariemoorman/containeraudit/' target='_blank'>ContainerAudit</a>, <a href='https://github.com/kariemoorman/vscode-guard' target='_blank'>VSCode Guard</a>, <a href='https://github.com/kariemoorman/homograph_detect' target='_blank'>Homograph Detect</a>, <a href='https://github.com/kariemoorman/ghostbit' target='_blank'>GH0STB1T</a>, <a href='https://github.com/kariemoorman/github-reusable-workflows' target='_blank'>Github Reusable Workflows</a>, <a href='https://github.com/kariemoorman/devsecops-playbooks/tree/main/artifact-management' target='_blank'>Artifact Management</a>, <a href='https://github.com/kariemoorman/devsecops-playbooks/tree/main/secrets-management' target='_blank'>Secrets Management</a>).

- **What languages is the agent harness built in?** Python, Go, Rust, C++.

- **What is the deployment/infra toolchain?** Terraform, Ansible, k3s, Helm, ArgoCD.
