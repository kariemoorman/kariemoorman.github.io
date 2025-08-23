---
layout: learning
title:  "RESTful API in Flask"
subtitle: "Database Interactions via HTTP(S)"
summary: "Proof-of-Concept REST API design and implementation using Flask."
date:   2023-08-17 21:03:01 +0700
categories: ["edu"]
image: "/media/images/api.png"
tags: ["api", "http", "flask"]
author: "Karie Moorman"
---

<h3 align='center'>Table of Contents</h3>
<div class='tbl' style='margin-left:10px;'>
<ul style='display: flex; flex-wrap: row; gap: 25px; margin-left: 10px; justify-content: center;'>
<li><a href='#api'>API Protocols Overview</a></li>
<li><a href='#wsgi'>Why Choose Flask?</a></li>
<li><a href='#http'>HTTP Requests Explained</a></li>
<li><a href='#flask'>Building a Flask App</a></li>
<li><a href='#ssl'>Secure Deployment & Scaling</a></li>
</ul>
</div>

--- 

<h3 id='api' align='center'>API Protocols Overview</h3>

<div>
<p>There are four categories of API protocols or architectures: SOAP (Simple Object Access Protocol), RPC (Remote Procedural Calls), GraphQL, and REST (Representational State Transfer).</p>
</div>

<div style='padding-bottom: 20px; overflow-x: auto;'>
<table align='center'>
<tr><th>API</th><th>Definition</th><th>Data Format</th><th>Complexity</th><th>Transport Protocols</th><th>Error Handling</th><th>Security</th></tr>
<tr><td align='center'>SOAP</td><td>Protocol for structured information exchange between network applications, independent of platform or language.</td><td>XML</td><td>High; strict standards and multiple-layer security.</td><td>HTTP, SMTP, JMS, MQ, TCP</td><td>Built-in error handling via standardized fault elements in XML</td><td>WS-Security, TLS, SSL, SAML</td></tr>
<tr><td align='center'>RPC</td><td>Protocol for executing remote functions or procedures as if they were local.</td><td>XML-RPC, JSON-RPC, gRCP</td><td>Medium; focus on invoking remote methods.</td><td>HTTP, TCP, MQ, CORBA</td><td>Varied; error codes or messages</td><td>Varies based on implementation</td></tr>
<tr><td align='center'>GraphQL</td><td>Query language for APIs that enables clients to request only the data they need.</td><td>JSON</td><td>Medium; flexible data retrieval but may require more complex server-side logic.</td><td>HTTP</td><td>Varied; error codes or messages</td><td>Varies; HTTPS, OAuth, JWT, API keys, CORS</td></tr>
<tr><td align='center'>REST</td><td>Stateless client-server architecture model for creating web services using URLs and HTTP methods.</td><td>JSON, CSV, XML</td><td>Low; focus on utilizing existing HTTP methods.</td><td>HTTP</td><td>HTTP status codes</td><td>HTTPS, JWT, OAuth, API keys, CORS</td></tr>
</table>
</div>

<div>
<p>SOAP is more complex and heavyweight due to its built-in features, while RPC and REST tend to be simpler and lightweight. SOAP has a strict data format, while REST and RPC are much more flexible. SOAP has built-in error handling and security features, whereas REST and RPC rely on various add-on security mechanisms. SOAP is a communication protocol system, while RPC and REST are architectural styles. GraphQL is a query language often used with RPC and REST to enhance data fetching and manipulation capabilities. SOAP is more focused on sensitive data transfers, making it suitable for private APIs and enterprise services with strict, complex security requirements. RPC is more focused on method invocation, making it suitable for distributed systems where remote functionality needs to be accessed. GraphQL reduces over-fetching and allowing for efficient data retrieval, making it optimal for scenarios where the data needs are dynamic and change frequently (e.g., media streaming, mobile applications, messaging platforms, analytics dashboards). REST emphasizes resource-based interactions, making it well-suited for web applications.</p>
<p>Given its low complexity and its suitability for web-based applications and public APIs, we'll choose REST API protocol for practice.</p>
</div>

--- 

<h3 id='wsgi' align='center'>Why Choose Flask?</h3>

<div>
<p>Three popular web frameworks are used for building web applications in Python: Django, FastAPI, and Flask.</p>
</div>

- Django: Used when building complex, feature-rich web applications, content management systems (CMS), e-commerce platforms, and any application that requires a wide range of features out of the box.
- FastAPI: Used when building APIs that require high performance, scalability, and automatic documentation. Its asynchronous capabilities make it well-suited for handling high levels of concurrent requests efficiently, making it a popular choice when building larger-scale microservices and real-time applications.
- Flask: Used when building small to medium-sized applications, prototypes, and applications where customization and control over components are important. Its modular nature and minimal overhead make it well-suited for smaller-scale microservices and RESTful APIs.

<div>
<p>For this tutorial we'll assume a smaller application size, and choose Flask for building a REST API.</p>
</div>

--- 

<h3 id='http' align='center'>HTTP Requests Explained</h3>

<div>
<p>Because REST APIs use HTTP transport protocol, we'll want to refresh our understanding of HTTP request methods and status codes prior to building the app.</p>
</div>


<h4>HTTP Request Methods</h4>

- GET: Read or retrieve a resource
- POST: Create a new resource.
- PUT: Modify a resource.
- PATCH: Modify a part of a resource.
- DELETE: Delete a resource.

<h4>HTTP Status Codes</h4>

<div style='padding-bottom: 20px;'>
<table align='center'>
<tr><th colspan="3"><strong>1xx Informational Responses</strong></th></tr>
<tr><th>Code</th><th>Definition</th><th>Description</th></tr>
<tr><td align='center'>100</td><td>Continue</td><td>Initial portion of the request has been received. Client should proceed to send the remainder of the request.</td></tr>
<tr><td align='center'>101</td><td>Switching Protocols</td><td>Used with 'Upgrade' header to indicate the server is willing to switch protocols as requested by the client. </td></tr>

<tr><th colspan="3"><strong>2xx Success Responses</strong></th></tr>
<tr><th>Code</th><th>Definition</th><th>Description</th></tr>
<tr><td align='center'>200</td><td>OK</td><td>Request has succeeded.</td></tr>
<tr><td align='center'>201</td><td>Created</td><td>Request has been fulfilled, resulting in the creation of a new resource.</td></tr>
<tr><td align='center'>202</td><td>Accepted</td><td>Request has been accepted for processing, but the processing may not be completed yet.</td></tr>
<tr><td align='center'>204</td><td>No Content</td><td>Server has successfully processed the request, but there's no content to send in the response.</td></tr>
<tr><td align='center'>206</td><td>Partial Content</td><td>Used with the 'Range' header to indicate the server successfully served only a portion of the client resource request.</td></tr>

<tr><th colspan="3"><strong>3xx Redirect Responses</strong></th></tr>
<tr><th>Code</th><th>Definition</th><th>Description</th></tr>
<tr><td align='center'>300</td><td>Multiple Choices</td><td>Requested resource has multiple representations, each with its own specific location.</td></tr>
<tr><td align='center'>301</td><td>Moved Permanently</td><td>Requested resource has been permanently moved to a new location.</td></tr>
<tr><td align='center'>302</td><td>Found (Moved Temporarily)</td><td>Requested resource is temporarily located at a different URL.</td></tr>
<tr><td align='center'>304</td><td>Not Modified</td><td>Used for conditional GET or HEAD requests to indicate that a resource has not been modified since last access. Allows clients to use cached versions of the resource.</td></tr>

<tr><th colspan="3"><strong>4xx Client Error Responses</strong></th></tr>
<tr><th>Code</th><th>Definition</th><th>Description</th></tr>
<tr><td align='center'>400</td><td>Bad Request</td><td>Server cannot understand the request due to client error, e.g., malformed syntax or invalid request parameters.</td></tr>
<tr><td align='center'>401</td><td>Unauthorized</td><td>Client must authenticate itself to get the requested response. Used when authentication is required, and the provided credentials are invalid or missing.</td></tr>
<tr><td align='center'>403</td><td>Forbidden</td><td>Client does not have necessary permissions to access the requested resource. Authentication will not help.</td></tr>
<tr><td align='center'>404</td><td>Not Found</td><td>Server cannot find the requested resource; Resource does not exist on the server.</td></tr>
<tr><td align='center'>405</td><td>Method Not Allowed</td><td>The requested HTTP method is not allowed for the resource. E.g., trying to use a POST request on a resource that only supports GET requests.</td></tr>
<tr><td align='center'>406</td><td>Not Acceptable</td><td>Server cannot produce a response matching the list of acceptable values defined in the request's headers.</td></tr>
<tr><td align='center'>409</td><td>Conflict</td><td>Request could not be completed due to a conflict with the current state of the target resource, e.g., conflicting updates from multiple clients.</td></tr>
<tr><td align='center'>410</td><td>Gone</td><td>The requested resource is no longer available at the server and there is no forwarding address.</td></tr>
<tr><td align='center'>429</td><td>Too Many Requests</td><td>Too many requests in a given amount of time. Often used in rate limiting scenarios to prevent abuse.</td></tr>

<tr><th colspan="3"><strong>5xx Server Error Responses</strong></th></tr>
<tr><th>Code</th><th>Definition</th><th>Description</th></tr>
<tr><td align='center' width='10%'>500</td><td width='35%'>Internal Server Error</td><td>Server encountered an unexpected condition that prevented it from fulfilling the request.</td></tr>
<tr><td align='center'>501</td><td>Not Implemented</td><td>Server does not support the functionality required to fulfill the request. This is usually seen when the server lacks the ability to handle a certain request method.</td></tr>
<tr><td align='center'>502</td><td>Bad Gateway</td><td>Server, while acting as a gateway or proxy, receives an invalid response from an upstream server it accessed to fulfill the request.</td></tr>
<tr><td align='center'>503</td><td>Service Unavailable</td><td>Server is currently unable to handle the request due to temporary overloading or maintenance of the server.</td></tr>
<tr><td align='center'>504</td><td>Gateway Timeout</td><td>Server, while acting as a gateway or proxy, does not receive a timely response from an upstream/auxiliary server.</td></tr>
<tr><td align='center'>505</td><td>HTTP Version Not Supported</td><td>Server does not support the HTTP protocol version that was used in the request.</td></tr>
</table>
</div>
--- 

<h3 id='flask' align='center'>Building a Flask App</h3>

<div>
<p>We've outlined the basic architecture of a RESTful API. We've chosen a lightweight web application framework (Flask). We've defined the HTTP request methods and status codes used to transfer resources and communicate server and resource status with human and non-human clients interacting with the API. Let's build the basic Flask app.</p>
</div>

<h4>Build Steps</h4>
(1) Install Flask framework.
<div>
<p>Create and activate a Python virtual environment, and install Flask.
</p>
</div>

```python
mkdir ~/Projects && cd ~/Projects;

python3 -m venv flask_api;
source flask_api/bin/activate;

cd flask_api;
pip install Flask;
```

(2) Create a Flask App.

<div>
<p>Inside the flask_api directory, create a python file called "restful_api.py," and write the app specifications.
</p>
</div>

```python
nano restful_api.py
```

```python
#!/usr/bin/python3
from flask import Flask, request, jsonify

# Create app
app = Flask(__name__)

# Sample data (in-memory database)
tasks = []

# Define an API endpoint for POST request
@app.route('/tasks', methods=['POST'])
# Create a new task using POST
def create_task():
    data = request.get_json()
    task = {'id': len(tasks) + 1, 'title': data['title'], 'done': False}
    tasks.append(task)
    return jsonify({'message': 'Task created successfully', 'task': task}), 201

# Define an API endpoint for PUT request
@app.route('/tasks/<int:task_id>', methods=['PUT'])
# Update a task using PUT
def update_task(task_id):
	data = request.get_json()
	for task in tasks:
	    if task['id'] == task_id:
	        task['title'] = data.get('title', task['title'])
	        task['done'] = data.get('done', task['done'])
	        return jsonify({'message': 'Task updated successfully', 'task': task})
	return jsonify({'message': 'Task not found'}), 404

# Define an API endpoint for PATCH request
@app.route('/tasks/<int:task_id>', methods=['PATCH'])
# Update a task using PATCH
def update_task_patch(task_id):
    data = request.get_json()
    for task in tasks:
        if task['id'] == task_id:
            if 'title' in data:
                task['title'] = data['title']
            if 'done' in data:
                task['done'] = data['done']
            return jsonify({'message': 'Task updated successfully', 'task': task})
    return jsonify({'message': 'Task not found'}), 404

# Define an API endpoint for DELETE request
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
# Delete a task using DELETE
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'message': 'Task deleted successfully'}), 200

# Define an API endpoint for GET request
@app.route('/tasks', methods=['GET'])
# Get all tasks using GET
def get_tasks():
    return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(debug=True)
```


(3) Run the app.

```python
python restful_api.py
```
or 

```python 
export FLASK_APP=restful_api.py
flask --app restful_api run
```

or 

```python
export FLASK_APP=restful_api.py
python -m flask -app restful_api run
```

We see a local host appear in command line (http://127.0.0.1:5000):

<img src='/media/images/api/basic_flask_rest_api_test.png' >


We can visualize the "tasks" database in browser using the local host + database name (http://127.0.0.1:5000/tasks):

<img src='/media/images/api/basic_flask_rest_api_http_tasks.png' >


(4) Test API to confirm functionality using POST, PUT, PATCH, GET, and DELETE HTTP requests.

- POST request

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy ice cream"}' \
  http://127.0.0.1:5000/tasks

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy chips"}' \
  http://127.0.0.1:5000/tasks
```

- PUT request

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy fruit", "done": true}' \
  http://127.0.0.1:5000/tasks/1
```

- PATCH request

```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"done": true}' \
  http://127.0.0.1:5000/tasks/2
```

- GET request

```bash
curl -X GET http://127.0.0.1:5000/tasks
```

- DELETE request

```bash
curl -X DELETE http://127.0.0.1:5000/tasks/1
```


<div style='padding: 20px 0px;'>
<div>
<p>
Results of each POST, PUT, PATCH, and DELETE request are displayed below:
</p>
</div>

<div class="carousel-container">
    <div class="carousel-main">
        <div class="image-title">POST: 'Buy ice cream'</div>
        <img src="/media/images/api/basic_flask_rest_api_post_1.png" alt="POST: 'Buy ice cream'" class='main-image'>
    </div>
    <div class="carousel-images">
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_post_1.png" alt="POST: 'Buy ice cream'"></div>
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_post_2.png" alt="POST: 'Buy chips'"></div>
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_put.png" alt="PUT: Change Task 1 to 'fruit', mark 'complete'"></div>
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_put_patch.png" alt="PATCH: Mark 'Buy chips' 'complete'"></div>
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_delete.png" alt="DELETE: Delete Task 1"></div>
        <div class="image"><img src="/media/images/api/basic_flask_rest_api_terminal.png" alt="TERMINAL: Display HTTP activity"></div>
    </div>
</div>
</div>

--- 

<h3 id='ssl' align='center'>Secure Deployment & Scaling</h3>

<div>
<p>
A production-ready REST API in Flask requires improvements across two areas: server and security.
</p> 
<p>
While Flask provides a built-in development server, it is not secure, stable, or efficient for production use. To productionize the app, we can choose from either a local, self-hosted WSGI server or a cloud-based hosting platform. Options for self-hosting include Gunicorn (Green Unicorn), uWSGI, Nginx, and Apache. Options for cloud hosting include AWS, Google Cloud, Azure, Heroku, DigitalOcean, and PythonAnywhere. 
</p>
<p> 
For this tutorial we'll choose to self-host a WSGI server using Gunicorn.
</p>
<p>
Securing a web application prototypically involves appyling the following protocols: encryption (HTTPS; TLS/SSL), authentication (e.g., OAuth, JWT, API keys), authorization (i.e., secure session management), rate limits and throttling, reverse proxies, firewalls, content security policies, activity logging and monitoring. Additional considerations include adding input validation and santization mechanisms to prevent injection attacks.
</p>

<p>
<ul>
<li><strong>HTTPS (TLS/SSL):</strong> Encrypts communication between the server and clients, ensuring confidentiality and data integrity.</li>
<li><strong>Authentication (JWT, OAuth, API Keys):</strong> Ensures only authorized users can access specific resources by validating their identity through mechanisms like JSON Web Tokens (JWT), OAuth, or API keys.</li>
<li><strong>Authorization (Secure Session Management, Secure Cookies):</strong> Enhances security using secure and HttpOnly cookies to help prevent session hijacking and cross-site scripting (XSS) attacks. It enforces timeout, inactivity, and proper logout policies to prevent session fixation attacks and cross-site request Forgery (CSRF) attacks.</li>
<li><strong>Rate Limiting and Throttling:</strong> Helps prevent abuse and denial-of-service (DoS) attacks by limiting the number of requests from a single source or user over a specific time period.</li>
<li><strong>Reverse Proxy:</strong> Enhances security by acting as an intermediary server between the client and the application server, in addition to handling tasks such as load balancing, SSL termination, caching, and security-related functions.</li>
<li><strong>Firewalls:</strong> Uses a set of security policices to monitor and control incoming and outgoing network traffic to prevent attacks, e.g., distributed-denial-of-service (DDoS), intrusion attempts, and unauthorized access.</li>
<li><strong>Content Security Policies (CSP):</strong> Helps prevent cross-site scripting (XSS) attacks by controlling which sources of content can be loaded and executed on a web page.</li>
<li><strong>Logging and Monitoring:</strong> Enables ability to monitor server health, and to detect and respond to potential security incidents in real-time.</li>
<li><strong>Input Validation and Sanitization:</strong> Helps prevent injection attacks and malicious code execution.</li>
</ul>
</p>
<p> 
For this tutorial, we'll implement SSL certification, API keys, rate limiting, and logging.
</p>
</div>

<h4>Build Steps</h4>
(1) Install additional libraries to support server and security improvements.

```python
pip install gunicorn Flask-SSLify certbot Flask-Limiter;
brew install redis nginx;
```

(2) Create key and certificate permissions, valid for 30 days.

Answering every question ensures a valid SSL certificate. 

```python
mkdir credentials;

openssl req -x509 -newkey rsa:4096 -keyout ./credentials/key.pem -out ./credentials/cert.pem -days 30;
```

(3) Add logging subdirectory to store API activity logs.

```python
mkdir logs;
```

- Confirm the resultant nested file structure: 

```python
cd ~/Projects;
tree -I __pycache__;
```

```python
~/Projects
└── flask_api
    ├── rest_api.py
    ├── credentials
    │   ├── cert.pem
    │   └── key.pem
    └── logs
        └── restful_api.log (to be created when testing the app)
```

(4) Set Redis password and start server. 

- Locate the current Redis password in the redis.config file. Uncomment the line and set the password:

```python
cat /opt/homebrew/etc/redis.conf | grep "requirepass";
```
- Start the Redis server: 

```python 
brew services start redis
```

(5) Update restful_api.py script to incorporate security changes: SSL certification, API keys, rate limiting (by IP address), logging.

```python
#!/usr/bin/python3
from flask import Flask, request, jsonify
from flask_sslify import SSLify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import redis
import logging
from logging.handlers import RotatingFileHandler

# Create app
app = Flask(__name__)
# Sample data (in-memory database)
tasks = []

# Enforce HTTPS on all requests
sslify = SSLify(app) 
# Add logging
logging.basicConfig(level=logging.DEBUG) 
# Configuration to write logs to a file
## Specify the path and filename for the log file
log_file = './logs/restful_api.log'
## Create a rotating file handler
handler = RotatingFileHandler(log_file, maxBytes=1024*1024, backupCount=10)  
## Set the logging level for the handler
handler.setLevel(logging.DEBUG)  
## Specify the log message format
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
## Apply the formatter to the handler  
handler.setFormatter(formatter)  
## Add the handler to the Flask logger
app.logger.addHandler(handler)  

# Set up Redis connection for rate limit storage
redis_client = redis.StrictRedis(host='127.0.0.1', port=6379, db=0, password='your_password')
# Add rate limiting to the app, define default limits, set redis storage endpoint
limiter = Limiter(app=app,key_func=get_remote_address,default_limits=["200 per day", "50 per hour", "5 per minute", "1 per second"],storage_uri="redis://127.0.0.1:6379/0")

# Create Rate Limit Exception log function
def rate_limit_exceeded():
    ip_address = get_remote_address()
    app.logger.warning(f'Rate limit exceeded: {ip_address}')
    return jsonify({'message': 'Rate limit exceeded', 'status_code': 429}), 429
# Add Rate Limit Exception logging
limiter.request_filter(rate_limit_exceeded)

# Add API keys
valid_api_keys = ['your_api_key_1', 'your_api_key_2']
# Create API key requirement
def require_api_key():
    api_key = request.headers.get('API-Key')
    if api_key and api_key in valid_api_keys:
        return True
    else:
        return False
# Define API key check before processing HTTP requests
@app.before_request
def check_api_key():
    if not require_api_key():
        return jsonify({'message': 'Unauthorized'}), 401

# Optional: Add basic logging test to check functionality
@app.route('/')
def index():
    app.logger.debug('This is a debug message')
    app.logger.info('This is an info message')
    app.logger.warning('This is a warning message')
    app.logger.error('This is an error message')
    app.logger.critical('This is a critical message')
    return "Hello, Flask!"

# Define an API endpoint for POST request
@app.route('/tasks', methods=['POST'])
# Set rate limit
@limiter.limit("2 per minute",override_defaults = True)
# Create a new task using POST
def create_task():
    try:
        data = request.get_json()
        # Info log for POST event
        app.logger.info({'event': 'create_task', 'message': f'Creating task: {data.get("title")}'})
        # Warning log for missing 'title'
        if 'title' not in data:
            app.logger.warning({'event': 'create_task', 'message': 'Task creation without title'})
        # Error log if 'title' is missing
        if 'title' not in data:
            app.logger.error({'event': 'create_task', 'message': 'Task creation failed due to missing title'})
            return jsonify({'error': 'Task creation failed due to missing title'}), 400    
        task = {'id': len(tasks) + 1, 'title': data['title'], 'done': False}
        tasks.append(task)
        # Task completion log
        app.logger.info({'event': 'create_task', 'message': f'Task created successfully: {task}'})   
        return jsonify({'message': 'Task created successfully', 'task': task}), 201
    except Exception as e:
        # Error log for exceptions
        app.logger.error({'event': 'create_task', 'message': f'Error creating task: {str(e)}'})
        return jsonify({'error': 'Error creating task'}), 500

# Define an API endpoint for GET request
@app.route('/tasks', methods=['GET'])
# Set rate limit
@limiter.limit("2 per minute",override_defaults = True)
# Get all tasks using GET
def get_tasks():
    try:
        # Info log for GET event
        app.logger.info({'event': 'get_tasks', 'message': f'Accessing /tasks route - Method: {request.method}'})
        return jsonify({'tasks': tasks})
    except Exception as e:
        # Error log for exceptions
        app.logger.error({'event': 'get_tasks', 'message': f'Error retrieving tasks: {str(e)}'})
        return jsonify({'error': 'Error retrieving tasks'}), 500

# Define an API endpoint for PUT request
@app.route('/tasks/<int:task_id>', methods=['PUT'])
# Update a task using PUT
def update_task(task_id):
    try:
        data = request.get_json()
        # Info log for PUT event
        app.logger.info({'event': 'update_task', 'message': f'Updating Task: {task_id}'})
        old_task = None
        updated_task = None
        for task in tasks:
            if task['id'] == task_id:
                old_task = task.copy()
                task['title'] = data.get('title', task['title'])
                task['done'] = data.get('done', task['done'])
                updated_task = task
                break
        if old_task:
            # Log old task data
            app.logger.info({'event': 'update_task', 'message': f'Task {task_id}', 'old_task': old_task})
        if updated_task:
            # Task update completion log
            app.logger.info({'event': 'update_task', 'message': f'Task {task_id} updated successfully: {updated_task}'})
            return jsonify({'message': f'Task updated successfully', 'task': updated_task})
        else:
            # Task not found error log
            app.logger.error({'event': 'update_task', 'message': f'Task {task_id} not found'})
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        # Error log for exceptions
        app.logger.error({'event': 'update_task', 'message': f'Error updating task: {str(e)}'})
        return jsonify({'error': 'Error updating task'}), 500

# Define an API endpoint for PATCH request
@app.route('/tasks/<int:task_id>', methods=['PATCH'])
# Update a task using PATCH
def update_task_patch(task_id):
    try:
        data = request.get_json()
        # Info log for PATCH event
        app.logger.info({'event': 'update_task_patch', 'message': f'Updating task (PATCH): {task_id}'})
        old_task = None
        updated_task = None
        for task in tasks:
            old_task = task.copy()
            if task['id'] == task_id:
                if 'title' in data:
                    task['title'] = data['title']
                if 'done' in data:
                    task['done'] = data['done']
                updated_task = task
                break
        if old_task:
            # Log old task data
            app.logger.info({'event': 'update_task_patch', 'message': f'Task {task_id}', 'old_task': old_task})
        if updated_task:
            # Task update completion log
            app.logger.info({'event': 'update_task_patch', 'message': f'Task {task_id} updated successfully: {updated_task}'})
            return jsonify({'message': 'Task updated successfully', 'task': updated_task})
        else:
            # Task not found error log
            app.logger.error({'event': 'update_task_patch', 'message': f'Task {task_id} not found'})
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        # Error log for exceptions
        app.logger.error({'event': 'update_task_patch', 'message': f'Error updating task (PATCH): {str(e)}'})
        return jsonify({'error': 'Error updating task'}), 500

# Define an API endpoint for DELETE request
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
# Set rate limit
@limiter.limit("1 per minute",override_defaults = True)
# Delete a task using DELETE
def delete_task(task_id):
    # Info log for PATCH event
    app.logger.info({'event': 'delete_task', 'message': f'Deleting Task: {task_id}'})
    try: 
        global tasks
        old_tasks = tasks.copy()
        tasks = [task for task in tasks if task['id'] != task_id]
        if old_tasks != tasks:
            app.logger.info({'event': 'delete_task', 'message': f'Task {task_id} deleted successfully', 'old_tasks': old_tasks, 'remaining_tasks': tasks})
            return jsonify({'message': 'Task deleted successfully'}), 200
        else:
            app.logger.error({'event': 'delete_task', 'message': f'Task {task_id} not found'})
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        app.logger.error({'event': 'delete_task', 'message': f'An error occurred: {str(e)}'})
        return jsonify({'message': 'An error occurred'}), 500

# Log app starttime
app.logger.info({'event': 'app_start', 'message': 'Flask app started'})

if __name__ == '__main__':
    app.run(ssl_context=('./credentials/cert.pem', './credentials/key.pem'), debug=True)
```


(6) Verify logging configuration.

```python
python restful_api.py
```
or 
```python
flask run --cert=./credentials/cert.pem --key=./credentials/key.pem
```

We see a secure local host appear in command line (https://127.0.0.1:5000):

<img src='/media/images/api/basic_flask_rest_api_test2.png' alt='HTTPS_test2' />

We can visualize the “tasks” database in browser using the secure local host + database name (https://127.0.0.1:5000/tasks):

<img src='/media/images/api/basic_flask_rest_api_https_tasks.png' alt='HTTPS_tasks' />

Execute the series of CURL requests, adding API Key and SSL certification information, e.g., 

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "API-Key: your_api_key_here" \
  -d '{"title": "Buy chips"}' \
  --cacert ./credentials/cert.pem \
  -k https://127.0.0.1:5000/tasks
```

Verify HTTPS request activity appears in the application logs: 

<img src='/media/images/api/basic_flask_rest_api_logs.png' alt='application logs' />


(8) Configure and run production server.

```python
gunicorn restful_api:app -w 2 --certfile=./credentials/cert.pem --keyfile=./credentials/key.pem 
```

Note: Gunicorn is often used with [Nginx](https://docs.gunicorn.org/en/stable/deploy.html#nginx-configuration). Gunicorn WSGI HTTP server acts as a backend server responsible for handling the actual application logic, request processing, and serving dynamic content, while Nginx is used as a frontend server to handle tasks such as serving static files, load balancing incoming requests to multiple application server instances, managing SSL/TLS certificates, and acting as a reverse proxy to pass requests to the appropriate backend server (like Gunicorn). Before deploying to production environment, first install and configure the Nginx.



---

<h3>Resources</h3>
<div>
<ul>
<li>Flask: <a href='https://flask.palletsprojects.com/'>https://flask.palletsprojects.com/</a></li>
<li>Flask Limiter: <a href='https://flask-limiter.readthedocs.io/en/stable/#rate-limit-key-functions'>https://flask-limiter.readthedocs.io</a></li>
<li>Gunicorn: <a href='https://gunicorn.org/'>https://gunicorn.org/</a></li>
<li>WSGI: <a href='https://wsgi.readthedocs.io/'>https://wsgi.readthedocs.io/</a></li>
</ul>
</div>
