---
layout: learning
title:  "Supply Chain Security"
subtitle: "Artifact Management using Gitlab"
summary: "Using GitLab to build a cost-effective, easy-to-implement, and scalable artifact management solution."
date:   2026-03-24 21:03:01 +0700
categories: ["edu"]
image: "../media/images/supplychain.png"
tags: ["devsecops", "supplychain"]
author: "Karie Moorman"
page_type: pages
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<div class='centered-list'>
<ul>
<li><a href='#intro'>Overview</a></li>
<li><a href='#architecture'>The Architecture</a></li>
<li><a href='#devchange'>What Changes for Developers</a></li>
<li><a href='#sec'>Security: The Whole Point</a></li>
<li><a href='#ir'>When Things Go Wrong: Incident Response</a></li>
<li><a href='#tradeoffs'>Trade-Offs: Gitlab vs. JFrog/Nexus</a></li>
<li><a href='#getstarted'>Getting Started</a></li>
</ul>
</div>
</div>

--- 

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>
<p>Every <code>pip install</code>, <code>uv add</code>, <code>npm install</code>, and <code>docker pull</code> is a trust decision.</p> 
<p>Development builds oftentimes pull from public infrastructure we don't control. Attackers know this. Techniques like typosquatting, dependency confusion, account takeovers, and build pipeline compromises have impacted organizations from startups to industry leaders such as Okta, Microsoft, Apple, and Cisco. Recent high-profile incidents underscore the scale of the risk, including the March 2026 Trivy supply chain attack against Aqua Security. In that case, a widely used open-source vulnerability scanner was compromised and used to distribute malicious Docker Hub images, ultimately affecting more than 1,000 cloud environments, dozens of npm packages, and over 10,000 GitHub workflow files.</p>

<p>Tools such as JFrog Artifactory and Sonatype Nexus address this by acting as a controlled gateway between developers and the public internet: caching dependencies, enforcing policies, and auditing every package that enters the development environment. But they come at a cost. JFrog Platform starts at $150/month for a small team and scales into six-figure enterprise contracts. Nexus Pro carries similar per-seat licensing. For independent developers, small teams, and organizations already running GitLab, that spend is hard to justify when the core capability (i.e., caching packages, hosting private artifacts, and scanning for vulnerabilities) can be assembled from tools you already have or can deploy for free.</p>

<p>That's the premise of this guide.</p>

<p>GitLab's Package Registry, Container Registry, and Dependency Proxy are available on the Free tier for both GitLab.com (SaaS) and self-hosted GitLab CE. Paired with open-source caching proxies (e.g., devpi, Verdaccio) and free scanning tools (e.g., Trivy, Snyk, Gitleaks, Semgrep), teams can achieve a comparable supply chain security posture without licensing overhead. Any business or independent developer can set this up today.</p>

<p align='center'>Github: <a href='https://github.com/kariemoorman/devsecops-playbooks/tree/main/artifact-management' target='_blank'>devsecops-playbooks/artifact-management</a></p>


</div>

---

<h3 id='architecture' align='center'>The Architecture</h3>


<img src="{{ '/media/images/architecture-diagram.svg' | relative_url }}">


GitLab's Package Registry is a **storage registry**, not a caching proxy. This distinction matters. It hosts packages you explicitly publish to it, but it won't transparently mirror upstream package managers like PyPI or npm on demand. 

To get the full JFrog-style experience, pair GitLab with lightweight caching proxies (e.g., devpi for Python; Verdaccio for Javascript):

- **[devpi](https://devpi.net)** sits in front of PyPI, as a remote repository. A developer runs `pip install flask` or `uv add flask`, and `devpi` fetches it from upstream on first request, caches it, and serves from cache on every subsequent request. No synchronization pipelines or manual intervention are required. 
- **[Verdaccio](https://verdaccio.org)** provides the same caching layer for npm, proxying the public registry, storing packages locally, and serving repeat installs directly from cache.
- **GitLab's own [Dependency Proxy](https://docs.gitlab.com/ee/user/packages/dependency_proxy/)** acts as a pull-through cache for Docker Hub images. Popular images like `python`, `node`, `neo4j`, `postgres`, and `nginx` are cached automatically on first pull—no extra infrastructure required. For images hosted on other registries (e.g., GHCR, Quay, GCR), a scheduled CI/CD pipeline can mirror them into your GitLab Container Registry for the same caching benefits.

In this way, access to packages and versions can be tightly controlled, allowing teams to filter, pin, or restrict what gets pulled into their environments, improving both reproducibility and security.

GitLab then handles what it's built for: hosting your private packages and your own Docker images, with built-in CI/CD, access controls, and audit logging.

The result is a layered system where public packages are cached on demand through proxies, private packages live in GitLab, and developer machines point to internal URLs for everything.


<br> 

---

<h3 id='devchange' align='center'>What Changes for Developers</h3>

Client configuration is straightforward. A `pip.conf` (or `pyproject.toml` for [uv](https://docs.astral.sh/uv/)) routes Python installs through devpi, with GitLab as a secondary index for private packages. An `.npmrc` routes public packages through Verdaccio and scoped `@myorg/*` packages to GitLab. Docker pulls use the Dependency Proxy URL instead of pulling directly from Docker Hub.

Both `pip` and `uv` respect the same `index-url` and `extra-index-url` configuration, so the switch is transparent regardless of which tool your team uses.

A single setup script can configure all of this on a developer machine in under a minute.

<br> 

---

<h3 id='sec' align='center'>Security: The Whole Point</h3>

The reason to run any of this is supply chain security. An intermediate registry gives you five things you don't get when pulling directly from public sources:

<ol>
  <li><strong>Availability</strong> – Builds succeed even when upstream registries are down.</li>
  <li><strong>Speed</strong> – Cached packages are served locally, reducing download times.</li>
  <li><strong>Auditability</strong> – Every package consumed is logged for visibility and compliance.</li>
  <li><strong>Control</strong> – You decide which versions enter your environment through allowlists enforced in CI/CD.</li>
  <li><strong>Isolation</strong> – Internal packages never touch public registries, eliminating dependency confusion attacks.</li>
</ol>

CI/CD pipelines enforce this with automated dependency scanning (Trivy, Snyk, Safety, pip-audit, npm audit), container scanning, SAST via Semgrep, secret detection via Gitleaks, and package allowlist checks that block unapproved dependencies before they reach a build.

Docker images get signed with [Cosign](https://docs.sigstore.dev/cosign/overview/) and ship with SBOMs generated by [Syft](https://github.com/anchore/syft), so you can verify provenance and audit contents at any point in the pipeline.

<br> 

---

<h3 id='ir' align='center'>When Things Go Wrong: Incident Response</h3>

Incidents happen. Plan for it.

An Incident Response Plan (IRP) is a set of documented procedures and policies designed to guide an organization in identifying, responding to, managing, and recovering from security incidents or cyberattacks. The goal of an incident response plan is to minimize damage, restore normal operations as quickly as possible, and prevent future incidents.

A example incident response plan is provided in the procedural guide available on Github: [INCIDENT-RESPONSE](https://github.com/kariemoorman/devsecops-playbooks/blob/main/artifact-management/docs/INCIDENT-RESPONSE.md). It
 follows the [NIST SP 800-61r2](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final) lifecycle across six phases:

<ol>
  <li><strong>Preparation</strong> – Define roles, deploy detection tooling, establish allowlists and policies, and run quarterly tabletop exercises.</li>
  <li><strong>Identification</strong> – Detect via automated scanners, upstream advisories, or user reports. Triage, confirm, and assign severity.</li>
  <li><strong>Containment</strong> – Remove the compromised artifact from all registries and caches. Block at the network level and preserve forensic evidence before cleanup.</li>
  <li><strong>Eradication</strong> – Pin to known-good versions with hash verification. Rotate any exposed credentials and close the attack vector.</li>
  <li><strong>Recovery</strong> – Rebuild all affected images with <code>--no-cache</code>. Redeploy through staging, canary, then production. Validate with scans and signature verification, and monitor at increased intensity for 30 days.</li>
  <li><strong>Post-Incident Activity</strong> – Conduct a blameless review within 48 hours. Document root cause and timeline, update the IRP, scanning rules, and allowlists, and track MTTD, MTTC, and MTTR.</li>
</ol>

Defining and rigorously reviewing an incident response plan is crucial when working with agentic, autonomous AI. With systems that can act independently, security incidents can escalate quickly. Proactive planning ensures we can respond decisively, minimize damage, and maintain control when things go wrong.

<br> 

---

<h3 id='tradeoffs' align='center'>Trade-Offs: Gitlab vs. JFrog/Nexus</h3>

GitLab is not a drop-in replacement for JFrog or Nexus.

JFrog and Nexus provide built-in remote repositories that proxy and cache upstream registries transparently; essentially, a single tool handling everything. With GitLab, the same functionality is assembled from multiple components: devpi for PyPI, Verdaccio for npm, the Dependency Proxy for Docker, and GitLab’s own registries for private artifacts.

The benefits of the GitLab approach include fewer licenses, tighter integration with existing CI/CD pipelines, and flexibility to swap or update individual components. The trade-off is a more complex setup, with additional moving parts to deploy and maintain.

For teams already invested in GitLab, this strategy avoids introducing another platform while still achieving comparable security, caching, and dependency management outcomes.

<br> 

---


<h3 id='getstarted' align='center'>Getting Started</h3>

A procedural guide on how to get started can be found here: <a href='https://github.com/kariemoorman/devsecops-playbooks/tree/main/artifact-management' target='_blank'>devsecops-playbooks/artifact-management</a>.

The full guide includes ready-to-use CI/CD pipeline templates, client configuration examples, a Docker Compose file for deploying devpi and Verdaccio, an automated client setup script, and a complete NIST-aligned incident response plan with scenario-specific runbooks.

The repository is structured for immediate use:

```
artifact-management/
  README.md                              # Full procedural guide
  docs/INCIDENT-RESPONSE.md              # 6-phase incident response plan
  cicd/                                  # Pipeline templates (sync, publish, scan, sign)
  config/                                # Client configs, allowlists, proxy configs
  scripts/setup-client.sh                # Automated developer machine setup
```

Clone it, replace `gitlab.example.com` with your instance, and you have a working supply chain security layer built on tools you likely already run.

<br>