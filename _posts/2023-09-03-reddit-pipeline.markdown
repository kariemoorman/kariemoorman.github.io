---
layout: learning
title:  "Building a Data Pipeline"
subtitle: "ETL Workflow for Reddit"
summary: "Proof-of-Concept data pipeline using Reddit APIs and local storage."
date:   2023-09-03 15:45:31 +0700
categories: ["edu"]
image: "/media/images/datapipeline.png"
tags: ["dataeng", "etl", "reddit"]
author: "Karie Moorman"
---

<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<div class='centered-list'>
<ul>
<li><a href='#overview'>Overview Statement</a></li>
<li><a href='#project'>Project Summary</a></li>
<li><a href='#pipeline'>Data Pipeline Design</a></li>
<ul>
<li><a href='#extract'>Extract</a></li>
<li><a href='#transform'>Transform</a></li>
<li><a href='#load'>Load</a></li>
<li><a href='#visual'>Visualization</a></li>
<li><a href='#automate'>Automation</a></li>
</ul>
</ul>
</div>
</div>

---
<h3 align='center' id='overview'>Overview Statement</h3>


Data pipelines and ETL workflows play a vital role in modern data management and analytics, empowering individuals and organizations to efficiently collect, process, and analyze data. Data pipelines serve as the backbone for moving data from diverse sources such as databases, web APIs, and log files, to destinations such as data warehouses, data lakes, or analytics platforms. 

ETL workflows typically encompass three stages: Extract (data collection), Transform (data cleaning, aggregation, and enrichment), and Load (writing transformed data to storage). Well-designed and implemented ETL workflows offer numerous advantages including enhanced data quality, generation of valuable insights, and faster decision-making. They also come with challenges, e.g., ensuring data integrity and integration across different sources, addressing scalability concerns as data volumes grow, and establishing robust data governance practices. 

Individuals and organizations have the flexibility to construct ETL workflows using local infrastructure, cloud-based services (e.g., AWS, GCP, Azure), or a hybrid approach. The choice in architecture generally depends on a project's specific needs, resources, and goals.

Common parameters to consider when constructing a data pipeline: 
- <b>GDPR Compliance</b>: <i>Is any of the data I wish to extract classified as PII/PHI? </i>
- <b>Cost</b>: <i>How much am I willing to spend to maintain each step of the data pipeline? </i>
- <b>SLA</b>: <i>How fast do I need the data to be transformed and loaded for visualization? </i>
- <b>Data Storage Location</b>: <i>Where do I want my data to be stored: local/on-premises, cloud, or hybrid? </i>
- <b>Data Throughput</b>: <i>How much data needs to be transmitted in each READ/WRITE request (i.e., do I need distributed/batch compute capabilities)? </i>
- <b>Data Visualization</b>: <i>What types of analysis are meaningful for this dataset, what tools are best for visualizing those analyses, who do I want to have view access? </i>
- <b>ETL vs. ELT</b>: <i>Which option is best for my use case? </i>
- <b>Automation</b>: <i>How can I automate all tasks within the workflow? </i>

---

<h3 align='center' id='project'>Project Summary</h3>

For this project, the goal is to select and extract data for a subset of subreddits and/or Reddit users, day-over-day, 
transform and execute a series of NLP and ML tasks on the extracted data, and load that transformed data into a dashboard for visualization, for little to no monetary cost. This means I am prioritizing monetary cost over time cost, and I assume the risk of encountering time delays in order to maintain low monetary cost strategy. The workflow should permit both on-demand and automated/scheduled executions.

I want to construct an automated data pipeline that adheres to the following constraints:
- Extracted data is not classified as PHI/PII. While usernames are extracted, no additional uniquely identifying information is included (e.g., profile metadata such as About description, social media links).
- Low to No Cost.
- SLA on data extraction and transformation tasks is end-of-day (EOD).
- Data, both extracted and tranformed, is stored locally and is available to end users. 
- Data extraction, transformation, and load steps READ/WRITE is small (between 2-10 MB of data per request).
- Data visualization incorporates analyses of NER, topic modeling, sentiment, and user behaviors, and can be surfaced using a python-friendly dashboard application for view by anyone.
- ELT, as it allows for fast turnaround of transformation step and for external validation of processes within data transformation step.

See also: [didactic-diy: Reddit](https://github.com/kariemoorman/didactic-diy/tree/main/reddit)

---

<h3 align='center' id='pipeline'>Data Pipeline Design</h3>
<p align='center'><img src="/media/images/pipeline/data_pipelines-reddit_local_pipeline.drawio.png"  height='700px;'/></p>


Example Scripts: [__scripts](https://github.com/kariemoorman/didactic-diy/tree/main/reddit/__scripts)

---
<h3 align='center' id='extract'>Extract</h3>

<p align='center'><img src="/media/images/pipeline/reddit_local_datapipline-extract.png" height="180" /></p>

After [registering a Reddit developer application](https://www.reddit.com/prefs/apps/) and [receiving an access token](https://praw.readthedocs.io/en/stable/getting_started/authentication.html), use [PRAW API](https://praw.readthedocs.io/en/stable/index.html) to extract data for a particular subreddit or Reddit user.
Write that data, in whatever format (e.g., JSON, Parquet, CSV), to local storage. Load that data to a local repository (e.g., SQL database; local subdirectory). Make that data accessible to end users. 

Example scripts: [reddit_scraper](https://github.com/kariemoorman/didactic-diy/tree/main/reddit/__scripts/reddit_scraper)

---
<h3 align='center' id='transform'>Transform</h3>

<p align='center'><img src="/media/images/pipeline/reddit_local_datapipline-transform.png" height="200"/></p>

Using raw datasets, execute a series of NLP and ML tasks. Write output as new dataset, in whatever format (e.g., JSON, Parquet, CSV), to local storage. Append the new dataset to the existing datasets in local repository (e.g., SQL database; local subdirectory). Make that data accessible to end users. 

Example scripts: [reddit_nlp](https://github.com/kariemoorman/didactic-diy/tree/main/reddit/__scripts/reddit_nlp)

---
<h3 align='center' id='load'>Load</h3>

A database is a structured collection of data organized for efficient retrieval and management. Common relational database systems include MySQL, PostgreSQL, Oracle, Microsoft SQL Server, and SQLite. Common nonrelational database systems include Redis, MongoDB, ElasticSearch, Neo4J, Cassandra, and AWS DynamoDB. For this project I chose a relational database system. 

Database management involves designing and defining user roles, tables, relationships, and constraints (e.g., security, read/write access) to ensure data integrity and efficient querying. Database design, user/group role creation, and table schema declaration is executed before loading any data into the database.

Load raw datasets from the Extract and Transform steps into the SQL database for analysis. Perform data validation checks to ensure accuracy and integrity of datasets prior to executing data analysis and visualization steps.

Example Scripts: [reddit_sql](https://github.com/kariemoorman/didactic-diy/tree/main/reddit/__scripts/reddit_sql)

---
<h3 align='center' id='visual'>Visualization</h3>
  
<p align='center'><img src="/media/images/pipeline/reddit_local_datapipline-visualize.png" height="180"/></p>

Using the compiled dataset from the transformation step, surface the analyses in the form of interactive dashboards via Dash. 


---
<h3 align='center' id='automate'>Automation</h3>

Workflow automation is accomplished using [crontab](https://www.geekbitzone.com/posts/macos/crontab/macos-schedule-tasks-with-crontab/) on MacOS.

To schedule a cronjob in macOS, simply follow these steps:

<p>1. In Terminal:</p>
```
crontab -e
```

<p>2. Choose an editor (nano, vim, emacs).</p>

<p>3. In the crontab file, specify the schedule for running the workflow script(s) using the following format:</p>

```
0 10 * * * /path/to/your/script.py
```

- The first * represents the minute (0-59).
- The second * represents the hour (0-23).
- The third * represents the day of the month (1-31).
- The fourth * represents the month (1-12).
- The fifth * represents the day of the week (0-7, where both 0 and 7 represent Sunday).

<p>In this example, the script is scheduled to execute everyday at 10am local time.</p>

<p>4. Save and exit the crontab editor.</p>

<p>5. In Terminal, check current list of cronjobs:</p>
```
crontab -l
```