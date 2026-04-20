---
layout: learning
title:  "Agentic RAG"
subtitle: "Intelligence for Autonomous Agents"
summary: "Boosting AI pentesting performance in RedAmon using a hybrid vector and graph-based pentesting knowledge system."
date:   2026-04-10 21:02:01 +0700
categories: ["edu"]
image: "../media/images/agentic_rag/agent_rag.png"
tags: ["ai", "llm", "security", "red-team"]
author: "Karie Moorman"
page_type: pages
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<div class='centered-list'>
<ul>
<li><a href='#intro'>Overview</a></li>
<li><a href='#redamon'>Redamon</a></li>
<li><a href='#architecture'>Architecture</a></li>
<li><a href='#ingest'>Data Ingestion Pipeline</a></li>
<li><a href='#query'>Agent Query Loop</a></li>
<li><a href='#updates'>Continuous Updates</a></li>
<li><a href='#tradeoffs'>Design Tradeoffs</a></li>
<li><a href='#future'>Future Work</a></li>
</ul>
</div>
</div>

--- 

<div class='page-conf'>
<h3 id='intro' align='center'>Overview</h3>

<p><b>Agentic RAG</b></p>

<p>Agentic RAG is a retrieval-augmented generation approach where an LLM is not limited to a single retrieval step. Instead, it acts as an agent that can decide when to retrieve information, refine its queries, and combine results from multiple sources before producing a final answer.</p>

<p>Traditional RAG performs one retrieval pass and immediately generates a response. Agentic RAG introduces iteration and decision making into the loop. The system can re-query a vector database, consult a graph structure, or use external tools depending on what is needed to answer the question. This makes it better suited for complex tasks that require multi-step reasoning or incomplete initial context.</p>

<p>In practice, Agentic RAG improves recall and accuracy by allowing the model to adjust its retrieval strategy during execution rather than relying on a fixed pipeline.</p>

<p><b>Autonomous Agentic RAG</b></p>

<p>Autonomous Agentic RAG extends this idea by removing the need for predefined user guidance at each step of retrieval. The agent independently determines when it has sufficient information, when to expand the search space, and when to switch between different knowledge sources such as vector databases, graph databases, and web search tools.</p>

<p>In an Autonomous Agentic RAG design, the system operates as a self-directed loop. It can repeatedly retrieve, evaluate, and refine results until it reaches a confidence threshold or a stopping condition. This is especially useful in environments like security research or pentesting, where information is fragmented across CVE databases, exploit repositories, and tool documentation.</p>

<p>Autonomous Agentic RAG shifts a system from being a guided retrieval tool to a fully self-managed reasoning and information gathering agent.</p>

</div>

<br>

---

<h3 id='redamon' align='center'><img src="{{ '/media/images/agentic_rag/redamon.png' | relative_url }}" width='25'>RedAmon<img src="{{ '/media/images/agentic_rag/redamon.png' | relative_url }}" width='25' style="transform: scaleX(-1);"></h3>

<p align='center'>Github: <a href='https://github.com/samugit83/redamon/' target='_blank'>RedAmon</a></p>

<p><b>What is RedAmon?</b></p>

RedAmon is an open-source autonomous AI security framework that automates the full offensive and defensive security lifecycle. It runs parallel reconnaissance, exploitation, and post-exploitation using a wide range of security tools, then builds a real-time knowledge graph of all findings.

Upon discovery, AI agents triage and deduplicate vulnerabilities, assess exploitability, and prioritize issues. A remediation system then generates code fixes directly in the target repository and opens GitHub pull requests for review.

The system effectively turns penetration testing into an end-to-end pipeline that moves from attack surface discovery to automated patching, with human oversight at critical decision points.

<p><b>The Problem: External Knowledge Dependency</b></p>

The agent architecture relies on Tavily web search for external knowledge retrieval, which introduces four bottlenecks:

- **Latency**: Web search takes 2–5 seconds per query. Over a long engagement, repeated searches accumulate significant delay.

- **Result Quality**: Search returns a mix of exploit documentation, blog posts, forum threads, and marketing pages. The agent spends additional reasoning cycles filtering irrelevant content.

- **Coverage Gaps**: The LLM has a fixed training cutoff, and newly published CVEs are not reliably indexed. Even when using web search, results for recent vulnerabilities are often fragmented or contradictory.

- **Tooling Accuracy**: The agent infers incorrect syntax for tools like Metasploit, sqlmap, or Hydra, producing invalid commands. Without authoritative structured documentation, these errors persist.


<p><b>The Solution: Local-First Hybrid Retrieval</b></p>

To address this gap, I built a local-first hybrid retrieval system using vector and graph knowledge bases, with a web search fallback mechanism for cases where local context is insufficient. This solution directly addresses each of the bottlenecks described above:

- **Latency**: Frequently accessed security knowledge is stored locally, enabling retrieval in under 100ms and eliminating most runtime web search calls.

- **Result Quality**: The knowledge base is curated from authoritative sources—NVD, ExploitDB, OWASP, and official tool documentation—providing structured, actionable information instead of unfiltered web content.

- **Coverage Gaps**: Continuous ingestion pipelines keep the local database current with newly published vulnerabilities from NVD, closing the gap between LLM training cutoffs and real-world security events.

- **Tooling Accuracy**: Embedding exact tool documentation ensures the agent retrieves correct command structures, significantly reducing execution errors.

The hybrid design prioritizes fast, curated local knowledge while preserving web search for edge cases.

<br> 

---

<h3 id='architecture' align='center'>Architecture</h3>

The Knowledge Base sits between the agent's reasoning loop and external information sources. When the agent needs security knowledge (e.g., tool syntax, exploitation techniques, CVE details), it issues a `web_search` call that first queries the local KB. The KB returns ranked, deduplicated results from curated sources (e.g., GTFOBins, LOLBAS, NVD, ExploitDB, OWASP, Nuclei, internal tool docs). If local results score below a confidence threshold, the query falls through to Tavily web search, with results merged and sanitized before returning to the agent.

Under the hood, the KB is a hybrid retrieval system combining dense vector search (FAISS) with sparse keyword search (Neo4j Lucene BM25) via Reciprocal Rank Fusion (RRF). Vector search handles semantic similarity (e.g., `"how do I escalate privileges on Linux?"`), while BM25 handles exact-match lookups that pentesters do constantly (e.g., CVE IDs, CLI flags, binary names). The KB shares Neo4j with the agent's recon graph, enabling Cypher queries that join live target data—domains, ports, services—with KB knowledge like CVEs affecting detected software versions.

This local-first design reduces latency (sub-200ms vs 2–5 seconds for web search), improves result quality (curated sources vs unfiltered web content), and enables offline operation for lightweight profiles.

#### Design Constraints

**Query Latency < 200ms on CPU**: (no GPU assumed). Achieved by keeping FAISS in-process (mmap'd flat index) and Neo4j fulltext on localhost.

**Profile-Scoped Ingestion**: Four profiles (`cpu-lite`, `lite`, `standard`, `full`) control which sources are ingested. Defined in `kb_config.yaml`, not hardcoded.

**Incremental Updates**: Two-layer deduplication (file-level hash cache + chunk-level content manifest) means a daily `kb-update-nvd` re-embeds only genuinely new or modified content.

**Single Source of Truth**: All KB tunables—embedder model, chunking limits, reranker settings, source boosts, ingestion profiles—are defined in `kb_config.yaml`. Per-deployment overrides via environment variables or CLI arguments are supported, but the YAML file remains authoritative.

<br>

---

<h3 id='ingest' align='center'>Data Ingestion Pipeline</h3>

The ingestion pipeline transforms raw security data (e.g., tarballs, API responses, CSV dumps) into embedded, indexed chunks stored in FAISS and Neo4j. It enforces security boundaries at every external touchpoint, deduplicates at both file and chunk levels to minimize redundant embedding, and writes state atomically to prevent corruption on crash or kill.

<p align='center'><img src="{{ '/media/images/agentic_rag/data_ingestion_pipeline.png' | relative_url }}" height='800px' width='auto'></p>


#### Data Sources

The initial scope of coverage includes seven data sources, each implemented as a `BaseClient` subclass with `fetch()` and `to_chunks()` methods:

<div style="display: flex; justify-content: center;">
<table>
  <thead>
    <tr>
      <th>Source</th>
      <th>Client Class</th>
      <th>Data Origin</th>
      <th>Chunk Granularity</th>
      <th>Ingestion Profiles</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tool_docs</code></td>
      <td><code>ToolDocsClient</code></td>
      <td><code>agentic/skills/**/*.md</code> (local)</td>
      <td>One chunk per skill file</td>
      <td style="padding: 8px 16px;">cpu-lite, lite, standard, full</td>
    </tr>
    <tr>
      <td><code>gtfobins</code></td>
      <td><code>GTFOBinsClient</code></td>
      <td>GitHub tarball</td>
      <td>One chunk per binary per function type</td>
      <td style="padding: 8px 16px;">cpu-lite, lite, standard, full</td>
    </tr>
    <tr>
      <td><code>lolbas</code></td>
      <td><code>LOLBASClient</code></td>
      <td>GitHub tarball</td>
      <td>One chunk per binary per command</td>
      <td style="padding: 8px 16px;">cpu-lite, lite, standard, full</td>
    </tr>
    <tr>
      <td><code>owasp</code></td>
      <td><code>OWASPClient</code></td>
      <td>GitHub tarball</td>
      <td>Section-level markdown chunks</td>
      <td style="padding: 8px 16px;">lite, standard, full</td>
    </tr>
    <tr>
      <td><code>exploitdb</code></td>
      <td><code>ExploitDBClient</code></td>
      <td>GitLab CSV (<code>files_exploits.csv</code>)</td>
      <td>One chunk per exploit ID</td>
      <td style="padding: 8px 16px;">lite, standard, full</td>
    </tr>
    <tr>
      <td><code>nvd</code></td>
      <td><code>NVDClient</code></td>
      <td>NVD REST API v2</td>
      <td>One chunk per CVE</td>
      <td style="padding: 8px 16px;">standard, full</td>
    </tr>
    <tr>
      <td><code>nuclei</code></td>
      <td><code>NucleiClient</code></td>
      <td>GitHub tarball</td>
      <td>One chunk per template</td>
      <td style="padding: 8px 16px;">full</td>
    </tr>
  </tbody>
</table>
</div>

<br>

Four Ingestion Profiles are defined:  `cpu-lite`, `lite`, `standard`, and `full`: 
- `cpu-lite` is a minimal profile for resource-constrained environments: internal tooling docs, GTFOBins, and LOLBAS only.
- `lite` provides a small, well-rounded core set of data sources about which an agent can query: internal tooling docs, GTFOBins, LOLBAS, OWASP, and ExploitDB.
- `standard` builds on `lite` by adding the NVD CVE store with 90-day lookback window as default. 
- `full` builds on `standard` by adding the Nuclei data store, and increasing the NVD lookback window to 2 years as default.

Typical corpus sizes for `lite` profile are ~48,600 chunks, while for `full` profile with 2-year NVD window: ~80,000+ chunks.


#### Security Hardening

The ingestion pipeline handles untrusted external data (tarballs, YAML files, API responses) from sources such as GitHub, GitLab, and NVD. The following defenses mitigate common attack vectors at each ingestion boundary:

<div style="display: flex; justify-content: center;">
<table>
  <thead>
    <tr>
      <th>Finding</th>
      <th>Defense</th>
      <th>Module</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SSRF via upstream redirects</td>
      <td><code>safe_get()</code> validates every redirect hop against a hostname allowlist before sending the request</td>
      <td><code>safe_http.py</code></td>
    </tr>
    <tr>
      <td>Unbounded downloads / memory DoS</td>
      <td><code>safe_get()</code> streams the body with a configurable byte cap (default 200 MB)</td>
      <td><code>safe_http.py</code></td>
    </tr>
    <tr>
      <td>Tarball decompression bomb</td>
      <td><code>bounded_tar_iter()</code> enforces per-member (10 MB) and cumulative (500 MB) decompressed size caps</td>
      <td><code>file_cache.py</code></td>
    </tr>
    <tr>
      <td>YAML billion-laughs / deep nesting</td>
      <td><code>bounded_yaml_load()</code> pre-scans for size, indentation depth, flow-style nesting, anchor count, and alias count before calling <code>yaml.safe_load</code></td>
      <td><code>file_cache.py</code></td>
    </tr>
    <tr>
      <td>Symlink TOCTOU on cache writes</td>
      <td><code>safe_write_text()</code> opens files with <code>O_NOFOLLOW</code> so a concurrent symlink swap between validation and write is rejected with <code>ELOOP</code></td>
      <td><code>file_cache.py</code></td>
    </tr>
    <tr>
      <td>FAISS untrusted deserialization</td>
      <td><code>save()</code> writes a SHA256/HMAC-SHA256 integrity manifest alongside <code>index.faiss</code>; <code>load()</code> verifies the digest before calling <code>faiss.read_index()</code></td>
      <td><code>faiss_indexer.py</code></td>
    </tr>
    <tr>
      <td>NVD API key leakage in logs</td>
      <td>Exception handler scrubs the API key string from any error message before logging</td>
      <td><code>nvd_client.py</code></td>
    </tr>
  </tbody>
</table>
</div>


<br> 

#### Deduplication

**Ingest Lock**: An ingest lock prevents concurrent ingestion processes from corrupting shared state. It ensures index consistency across FAISS and Neo4j, enforces idempotency to prevent duplicate chunk insertion, avoids resource contention during memory-intensive embedding generation, and guarantees atomic checkpoint updates for tracking ingestion progress.

**Layer 1 — File-Level**: (`knowledge_base/curation/file_cache.py`). Each source client maintains a `.file_hashes.json` sidecar in its cache directory. On fetch, every raw file (tar member, CSV row group, markdown file) is hashed and compared against the stored hash. Unchanged files are not re-parsed. This is the coarse filter: it prevents re-downloading and re-parsing ~12,000 nuclei templates when only 3 changed.

**Layer 2 — Chunk-Level**: (`data_ingestion.py:_filter_unchanged`). After `to_chunks()` produces chunk dicts, each chunk's content is hashed and compared against `cache/.manifest.json` (keyed by `chunk_id`). Unchanged chunks skip embedding and Neo4j upsert. This catches the case where a file changed but the relevant chunk content didn't (e.g., a YAML comment was edited but the description field is identical).

Layer 2 also performs **within-batch dedup by chunk_id**. Some upstream sources produce duplicate composite keys (e.g., GTFOBins lists two `sudo` variants for the same binary, both generating the same `chunk_id`). Without dedup, FAISS accumulates one vector per emission while Neo4j's `MERGE` collapses them to one node, causing count drift. The dedup pass keeps the last occurrence (matching `MERGE` + `SET` semantics) and logs a warning with the collision count.

**Ingest Lock Release**: The ingest lock is released automatically on process exit, successful completion, or unhandled exception. For file-based locks using `fcntl.flock()`, the kernel releases the lock when the file descriptor closes. Explicit release occurs in a finally block to guarantee cleanup even on error paths. If a process crashes without releasing, stale lock detection (via PID validation or lock timeout) prevents deadlock on subsequent runs.

#### Database

**Parse/Chunk**

After Layer 1 filters out unchanged files, each source client's `to_chunks()` method parses the raw data and produces chunk dictionaries. Parsing is source-specific: GTFOBins and LOLBAS parse YAML, ExploitDB parses CSV rows, OWASP splits markdown by heading boundaries, and NVD deserializes JSON from the API response. The chunker enforces a 480-token hard cap with a 256-token soft target (a function of the embedder 512 token limit). It splits on semantic boundaries (paragraph breaks, heading transitions) rather than fixed character counts, preserving context within each chunk. Token estimation uses a `chars // 4` heuristic to avoid tokenizer overhead during ingestion. Each Neo4j chunk dict includes chunk_id, source, content, and source-specific metadata (e.g., CVE ID, CVSS score, binary name, function type).

**Batch Embedding**

New and modified chunks from Layer 2 are batched and passed to the embedder (`intfloat/e5-large-v2, 1024 dimensions`). The embedder prepends `"passage: "` to each chunk's content per e5's asymmetric encoding protocol. Batching amortizes model load time and maximizes GPU/CPU throughput—typical batch sizes are 64-128 chunks depending on available memory.
Vectors are L2-normalized before insertion so FAISS inner-product computes cosine similarity. The embedder is instantiated once per ingestion run and reused across all sources to avoid repeated model loads.

**Write to FAISS and Neo4j**

FAISS and Neo4j writes happen in sequence, not in parallel, to simplify error handling and rollback.
- **FAISS**: `index.add()` appends the new vectors to the flat index. A parallel `chunk_ids.json` file maintains the mapping from FAISS vector position to `chunk_id`. Both files are written atomically via `atomic_write_bytes` and `atomic_write_json—write` to a sibling tempfile, then `os.replace()` into place. An integrity manifest (SHA256, or HMAC-SHA256 if `KB_INDEX_HMAC_KEY` is set) is written alongside `index.faiss` and verified on load to detect tampering or corruption.
- **Neo4j**: Each chunk is upserted via `MERGE` on `chunk_id` with a `SET` clause for properties. Per-source sublabels (`:NVDChunk`, `:GTFOBinsChunk`, etc.) are applied for query filtering. Property indexes on `chunk_id`, `source`, and source-specific fields (e.g., `cvss_score` for NVD) enable fast lookups. The `MERGE` + `SET` pattern ensures idempotency—re-running ingestion with identical chunks produces no duplicates and no property drift.

<br> 

---

<h3 id='query' align='center'>Agent Query Loop</h3>

The query pipeline processes every `web_search` call from the agent, routing through three subsystems: knowledge base retrieval, ranking and reranking, and safety hardening. The pipeline prioritizes local KB results and falls back to Tavily web search only when local relevance scores are insufficient.

<p align='center'><img src="{{ '/media/images/agentic_rag/query_retrieval_pipeline.png' | relative_url }}" height='40%'></p>

#### Knowledge Base Retrieval
Retrieval begins with hybrid candidate generation. The query is embedded using `e5-large-v2` model with the `"query: "` prefix (asymmetric encoding) and searched against the FAISS index for the top 30 candidates by cosine similarity (~30ms). In parallel, if fulltext search is enabled, Neo4j's Lucene index performs BM25 keyword matching for another 30 candidates (~5ms). The two ranked lists are merged via Reciprocal Rank Fusion (RRF) with 60 candidates (`k=60`), producing a unified score per chunk that naturally boosts candidates agreed upon by both retrieval methods.

After fusion, Neo4j filters the candidate set based on query parameters: `include_sources`, `exclude_sources`, `min_cvss`, and `severity`. Metadata for surviving chunks is fetched in a single Cypher query. The result is a filtered, metadata-enriched candidate pool ready for ranking.

#### Ranking and Reranking

Ranking proceeds through three stages: source boosts, cross-encoder reranking, and MMR diversity selection.

**Source boosts** compensate for volume bias. ExploitDB contributes ~46,000 chunks while LOLBAS contributes ~450; without adjustment, high-volume sources dominate results for broad queries. Boosts are applied multiplicatively to the RRF score before reranking (tool_docs: 1.20, gtfobins: 1.15, exploitdb: 0.85, etc.).

**Cross-encoder reranking** (if enabled) passes the top 30 candidates through `BAAI/bge-reranker-base`. The cross-encoder attends over the concatenated query and document, capturing fine-grained relevance signals. Raw logits are passed through sigmoid normalization to produce probabilities in (0, 1), then source boosts are applied again post-sigmoid to maintain consistent semantics regardless of logit sign.

**MMR diversity reranking** (if enabled) greedily selects the final `top_k` results, penalizing candidates that are redundant with already-selected chunks. Similarity is computed as a weighted combination of source equality (0.4) and title token Jaccard overlap (0.6). With a default `lambda=0.65`, the system favors relevance but actively diversifies across sources, preventing the failure mode where 4 of 5 results are near-identical entries.

A sufficiency check on the top result's score determines the response path. If the score meets the threshold (default 0.80), KB results are returned directly. Otherwise, Tavily web search is invoked and its results are merged with partial KB results before returning to the agent.

#### Safety Hardening

Query-time safety addresses two concerns: result sanitization and untrusted content framing.

**Result sanitization** scrubs potentially dangerous patterns from retrieved content before delivery to the AI agent. This includes stripping embedded control characters, normalizing Unicode to prevent homoglyph attacks, and truncating excessively long fields that could be used for context stuffing. Sanitization runs on both KB chunks and Tavily web results.

**Untrusted content framing** wraps all KB and web results in a structured envelope that marks the content as external and untrusted. This prevents prompt injection attacks where adversarial content in a retrieved chunk attempts to override agent instructions. The framing is applied before results enter the agent's context window.


<br> 

---

<h3 id='updates' align='center'>Continuous Updates</h3>

The knowledge base is designed to stay current. Security data changes frequently, especially with new CVEs, exploit disclosures, and updates to tooling documentation. To ensure the agent always operates on relevant information, the system supports both scheduled refresh pipelines and manual update triggers.

Sources such as the NVD CVE database are updated on a daily schedule, while ExploitDB and similar repositories are synced on a weekly or periodic basis. Static sources like the OWASP Testing Guide and tool manuals are embedded during image builds but can be reprocessed when updates are released (see [kb-refresh Docker service](https://github.com/samugit83/redamon/blob/master/docker-compose.yml#L436)).

In addition to automated refresh jobs, users can trigger an update manually using [`make kb-update` commands](https://github.com/samugit83/redamon/blob/master/knowledge_base/Makefile). This runs the ingestion pipeline asynchronously, allowing new data to be fetched, embedded, and merged into both the FAISS index and Neo4j graph without blocking agent operation.

Each update follows the same ingestion pipeline used during initial setup. Documents are re-embedded, FAISS indices are refreshed, and graph relationships in Neo4j are updated or merged to prevent duplication. This ensures consistency between semantic retrieval and relational queries.

In the event divergence occurs, the end user can simply rebuild the index and knowledge graph using [`make kb-rebuild` commands](https://github.com/samugit83/redamon/blob/master/knowledge_base/Makefile).

The result is a knowledge base that evolves alongside the security ecosystem. The agent does not rely on static snapshots, but instead operates on a continuously maintained and refreshable representation of vulnerabilities, exploits, and tooling knowledge.

<br> 

---

<h3 id='rationale' align='center'>Design Rationale</h3>


<p><b>Database Selection</b></p>

- **Why hybrid retrieval (FAISS + fulltext) instead of vector-only?** Pure vector search handles semantic similarity well (e.g., `"how do I escalate privileges on Linux?"` matches GTFOBins entries even though they share no keywords) but fails on exact-match lookups that pentesters do constantly, e.g., CVE IDs (`CVE-2021-44228`), tool flags (`--tamper=space2comment`), binary names (`certutil.exe`), WSTG IDs (`WSTG-INPV-05`). These keyword-exact queries are where BM25/Lucene outperforms dense retrieval by a wide margin. Reciprocal Rank Fusion (RRF) gives us both modes in a single query without the user having to choose.

- **Why FAISS flat index instead of HNSW/IVF?** At ~80K vectors and 1024 dimensions, exact brute-force search on `IndexFlatIP` completes in <10 ms on any modern CPU. Approximate indices (HNSW, IVF) add complexity (e.g., training, nprobe tuning, recall degradation) for latency improvements that are negligible at this corpus size. The flat index is also trivially serializable: one file, no training state, no index parameters to tune. If the corpus grows past ~1M vectors, switching to `IndexIVFFlat` or `IndexHNSWFlat` is a one-line change in `faiss_indexer.py`.

- **Why Neo4j instead of a simpler metadata store (SQLite, JSON)?** The agent's primary tool is `query_graph`, a natural-language-to-Cypher interface over a Neo4j graph containing recon data (e.g., domains, subdomains, IPs, ports, services, vulnerabilities). The KB chunks live in the same Neo4j instance as this recon graph. This means a single Cypher query can join KB knowledge with live recon data, e.g., `"show me CVEs for the Apache version running on port 443 of target X."` A separate metadata store would require a cross-system join at the application layer. Additionally, Neo4j provides Lucene fulltext index which is used for the keyword half of hybrid retrieval (i.e., no additional system needed).

<p><b>Knowledge Ingestion</b></p>

- **Why two dedup layers instead of one?** Layer 1 (file-level) deduplication is a coarse, cheap filter: hash the raw file, skip re-parsing if unchanged. This saves the cost of YAML/markdown parsing, which for Nuclei's ~12,000 templates is the dominant ingestion cost. Layer 2 (chunk-level) deduplication is a fine-grained filter: hash the chunk content after parsing, skip re-embedding if the content is byte-identical. This catches the case where a file changed (e.g., a YAML comment was edited) but the chunk content didn't. Neither layer alone is sufficient; Layer 1 misses content-preserving file changes, Layer 2 misses unchanged files that don't need to be parsed at all. So we implement both.

- **Why an ingest lock?** The FAISS index, `chunk_ids.json`, and the dedup manifests are not transactional; they're plain files written sequentially. Two concurrent ingests (e.g., a cron job and a manual rebuild) would race on these files, producing a corrupted index where chunk_ids don't match FAISS vector positions. The `fcntl.flock` lock serializes all ingestion runs at the process level. It's non-blocking by default so a conflicting ingest fails fast with a clear error, rather than silently queueing.

- **Why atomic writes for state files?** A crash or kill mid-write (e.g., OOM during embedding) must not leave a half-written `index.faiss`, `chunk_ids.json`, or `.manifest.json` on disk. Any of these in a corrupt state would break the next load or produce silently wrong results. All critical writes go through `atomic_write_json` / `atomic_write_bytes`, which writes to a sibling tempfile and then `os.replace()` into place. `os.replace()` is atomic on POSIX when source and destination are on the same filesystem. The worst case scenario after a crash is an orphaned tempfile and an untouched previous-version file.

<p><b>Knowledge Retrieval</b></p>

- **Why a cross-encoder reranker on top of the bi-encoder?** Bi-encoders (e.g., e5-large-v2) encode query and document independently and compute similarity via dot product. This is fast (~30 ms for 30 candidates) but limited; the model never sees query and document tokens attending to each other. Cross-encoders (e.g., bge-reranker-base) concatenate query + document and run full self-attention. This captures fine-grained relevance signals (negation, qualifier scope, multi-hop reasoning) that dot-product similarity misses. The cost is ~100x slower per pair, so we use the bi-encoder as a first-pass retriever (30 candidates) and the cross-encoder as a precision filter on the shortlist.

- **Why MMR diversity re-ranking?** Without it, the top-5 results for a broad query like "SSRF" are often 4-5 ExploitDB entries with near-identical titles ("Server-Side Request Forgery in Product X", "SSRF in Product Y"). These are technically relevant but provide no informational diversity; the agent sees five ways to say the same thing. MMR penalizes chunks that are similar to already-selected results, naturally surfacing one ExploitDB entry, one OWASP methodology section, one tool_docs playbook, and one NVD CVE. This ensures the agent receives a more useful result set for its next reasoning step.

- **Why source boosts?** Volume bias. ExploitDB contributes ~46,000 chunks (exploit title + description for every public exploit since 1999). LOLBAS contributes ~450. In unweighted vector search, ExploitDB dominates the top-k purely because it has 100x more embedding vectors in the same space. Source boosts (exploitdb: 0.85, lolbas: 1.15) are a lightweight lever to rebalance without re-architecting the index into per-source shards.


<p><b>General</b></p>

- **Why `kb_config.yaml` as the single source of truth?** The system has three potential configuration surfaces: the YAML file, per-project webapp settings (stored in PostgreSQL), and environment variables. Earlier, `project_settings.py` had hardcoded fallback values for KB knobs (e.g., `KB_MMR_LAMBDA: 0.7`) that silently overrode the YAML on every agent run. The current design uses `None` sentinels in `project_settings.py` — the orchestrator only overwrites a KB attribute when the project setting is non-`None`. This makes `kb_config.yaml` authoritative for all KB tuning, with per-project overrides reserved for when the webapp UI eventually exposes them.

- **Why committed source caches for the lite profile?** The `lite` profile is optimized for developer experience: clone the repo, run `./redamon.sh install`, and have a working KB in ~30 seconds with no internet access. This means the raw source files for GTFOBins (~86 KB), LOLBAS (~1 MB), and OWASP (~2 MB) are committed to git. The tradeoff is ~3 MB of repo size for a fully offline bootstrap. NVD, nuclei, and ExploitDB are excluded from git because they're too large (35-200 MB) and change frequently enough that committed copies would cause constant merge churn.


<br> 

---

<h3 id='future' align='center'>Future Work</h3>

Planned improvements to <a href='https://github.com/samugit83/redamon/' target='_blank'>RedAmon</a> include expanding source coverage, improving agent memory and metacognitive monitoring, and expanding the offensive toolkit.

Follow progress and contribute on <a href='https://github.com/samugit83/redamon/' target='_blank'>GitHub</a>.

