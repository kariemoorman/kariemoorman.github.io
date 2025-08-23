---
layout: learning
title:  "Chromium on Linux"
subtitle: "Install Brave Browser on Debian"
summary: "Instructions for installing Brave Browser on Debian-based distros (e.g., Kali & Parrot OS)."
date:   2023-10-03 19:05:31 +0700
categories: ["edu"]
image: "../media/images/brave-logo.png"
tags: ["linux", "brave"]
author: "Karie Moorman"
page_type: pages
---


<h4 align='center'>Install Brave on Kali Linux + ParrotOS</h4>

<p>1. In Terminal, install the curl package and dependencies.</p>

```bash
sudo apt install curl -y

sudo apt install apt-transport-https
```

<p>2. Use the curl command to import the Brave GPG key.</p>

```bash
curl -s https://brave-browser-apt-release.s3.brave.com/brave-core.asc | sudo apt-key --keyring /etc/apt/trusted.gpg.d/brave-browser-release.gpg add -
```

<p>3. Add the Brave repository to the system's sources.list.d directory.</p>

```bash
echo "deb [arch=arm64] https://brave-browser-apt-release.s3.brave.com/ stable main" | sudo tee /etc/apt/sources.list.d/brave-browser-release.list
```

<p>4. Update the system repository list. </p>

```bash
sudo apt update
```

<p>5. Install Brave.</p>

```bash
sudo apt install brave-keyring brave-browser 
```

<p>6. Launch Brave browser.</p>

```bash
brave-browser 
```
<br>

---


<h4 style='padding-top: 15px;' align='center'>Create a Brave Browser Launch Shortcut for the Panel</h4>
<div style='margin-left: 5px;'>
<h4>Parrot OS</h4>
<p>1. Right-click the Panel at the top of the UI (where Firefox and VS Cadmium Icons are located).</p>
<p>2. Select ‘Custom Application Launcher.’</p> 
<ul>
<li>Name: Brave</li>
<li>Command: brave-browser</li>
</ul>
<p>3. Select ‘OK’.</p>
<div class="post-container-grid-2">
<div class='p-item1' style='padding-right: 10px;'><a href='/media/images/brave/parrotos_brave.png' target="_blank"><img src='/media/images/brave/parrotos_brave.png'/></a></div>
<div class='p-item2' style='padding-left: 10px;'><a href='/media/images/brave/parrotos_brave_2.png' target="_blank"><img src='/media/images/brave/parrotos_brave_2.png'/></a></div>
</div>
</div>

<div style='margin-left: 5px;'>      
<h4 style='padding-top: 25px;'>Kali Linux</h4>

<p>1. Select Applications.</p>
<p>2. Right-click Brave Browser.</p>
<p>3. Select ‘+ Add to Panel.’ </p>
<div><a href='/media/images/brave/kali_linux_brave_1.png' target="_blank"><img src='/media/images/brave/kali_linux_brave_1.png'/></a></div>
</div>
