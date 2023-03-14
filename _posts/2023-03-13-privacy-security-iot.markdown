---
layout: post
title:  "Privacy, Security, & The Internet of Things"
subtitle: "Apps, services, & other tools I find helpful"
date: 2023-03-13 15:45:31 +0530
categories: ["tech", "privacy", "security", "password", "mfa", "vpn", "adblock"]
author: "Karie Moorman"
---
<div class='content-pad'>
<article class="drop-cap"><p>Using the internet can be a real drag. Big tech spies tracking our every move, 

malware landmines planted in every search query, hackers ready to pounce on every website we select. It's 2023: We internet users endure less privacy, less security, and more surveillance than ever before. Yet we continue to receive little to no warning when vulnerabilities arise, and we are offered little to no compensation for all our data. The risk, while it's become the norm, is hardly worth the reward.</p>
<p>Below are some simple tips we can use to reduce the impact of big tech spies in our day-to-day lives.</p>
</article>
</div>

---
<h3>Table of Contents</h3>
<div>
<ul>
<li><a href='#email'>Email Applications</a></li>
<li><a href='#browser'>Web Browsers</a></li>
<li><a href='#search'>Search Engines</a></li>
<li><a href='#adblock'>Ad & Tracking Blockers</a></li>
<li><a href='#mfa'>Multi-Factor Authentication</a></li>
<li><a href='#password'>Password Managers</a></li>
<li><a href='#vpn'>VPNs</a></li>
<li><a href='#faq'>FAQs</a></li>
</ul>
</div>

---
<h3 id='email'>Email Applications</h3>
<div class='content-pad' style='padding-bottom: 12px;'>
<div class='brand'><a href='https://proton.me/mail'>ProtonMail</a></div>
<div>
<p>ProtonMail is a private email service developed and maintained by <a href='https://proton.me'>Proton</a>. Proton is an open-source company created by former scientists at <a href='https://home.cern/'>CERN</a> who believe that trust is earned through transparency. All the source code used in Proton's applications is public and freely available for inspection. For Proton, privacy and security come first.</p>

<p>ProtonMail uses open source, independently audited end-to-end and zero-access encryption to secure email communications at rest and in-transit. Even Proton itself can't read your emails. Learn more about Proton's privacy and security promise <a href='https://proton.me/mail/security'>here</a>. </p>

<p>ProtonMail offers both free and paid service tiers. For free, users are afforded an email address with MFA, up to 150 messages per day, encrypted file share via ProtonDrive, a medium-speed VPN connection via ProtonVPN, a privacy-preserving calendar via ProtonCalendar, and 1GB of total storage space. For a $4 USD per month, Proton affords users 10 email addresses, each with unlimited messages, a custom email domain, 20 calendars with calendar sharing, and 15 GB total storage. If needed, Proton offers at $10 USD per month an even broader service plan. Learn more about ProtonMail pricing options <a href='https://proton.me/mail/pricing'>here</a>.</p>
</div>

<div style='padding-top: 10px;'>
<h4>Other Notable Options:</h4>
<div id='link'><a href='https://www.hushmail.com/'>HushMail</a></div> 
<div id='link'><a href='https://www.fastmail.com/'>FastMail</a></div>
</div>

<br>

<h4>Quick Comparison</h4>
<div>
<p>A quick comparison with the status quo shows ProtonMail outperforming Gmail in privacy and security measures, from the most basic to the advanced. ProtonMail has suffered only one reported CVE (Common Vulnerabilities and Exposures), while Google Gmail has suffered more than 15 publicly reported vulnerabilities. Proton has endured no Antitrust investigations, while Google has commanded an astounding 10+ Antitrust lawsuits across the US, the UK, and the EU, related to Advertising (learn more <a href='https://www.investopedia.com/terms/a/antitrust.asp'>here</a>).</p>
</div>
<div style=" margin: 30px 0 30px 0px;">
<center><table>
   <thead>
      <tr>
         <th></th>
         <th>ProtonMail</th>
         <th>Google Gmail</th>
      </tr>
   </thead>
   <tbody>
      <tr>
        <td><strong>Total Storage</strong></td>
        <td><center><a href='https://proton.me/mail/pricing'>1 GB**</a></center></td>
        <td><center><a href='https://support.google.com/mail/answer/9312312?hl=en'>15 GB**</a></center></td>
      </tr>
      <tr>
        <td><strong>Calendar</strong></td>
        <td><center>Yes</center></td>
        <td><center>Yes</center></td>
      </tr>
      <tr>
        <td><strong>VPN</strong></td>
        <td><center>Yes</center></td>
        <td><center>No</center></td>
      </tr>
      <tr>
        <td><strong>Encryption</strong><i><br/>At-Rest<br/>In-Transit</i></td>
        <td><center><br/><a href='https://proton.me/mail/security'>Yes</a><br/><a href='https://proton.me/mail/security'>Yes</a></center></td>
        <td><center><br/><a href='https://support.google.com/mail/answer/6330403?hl=en'>No</a><br/><a href='https://support.google.com/mail/answer/6330403?hl=en'>Depends</a></center></td>
      </tr>
      <tr>
        <td><strong>Privacy</strong></td>
        <td><center><a href='https://proton.me/mail/security'>Yes</a></center></td>
        <td><center><a href='https://safety.google/gmail/'>Not Exactly</a></center></td>
      </tr>
      <tr>
        <td><strong>CVEs</strong></td>
        <td><center><a href='https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=protonmail'>1</a></center></td>
        <td><center><a href='https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=gmail'>16</a></center></td>
      </tr>
      <tr>
        <td><strong>Antitrust Lawsuits</strong></td>
        <td><center>0</center></td>
        <td><center><a href='https://www.theverge.com/2023/1/25/23570753/google-antitrust-lawsuit-doj-ad-business'>10+</a></center></td>
      </tr>
      <tr>
        <td><strong>Cost</strong></td>
        <td><center>free**</center></td>
        <td><center>free**</center></td>
      </tr>
   </tbody>
</table></center>
</div>
<div>
<p>Companies such as Proton, FastMail, and HushMail ensure our private identities and electronic communications stay private. In contrast, companies such as Google and Microsoft amplify their profits and our personal risk by mining our personal email data (learn more <a href='https://www.theguardian.com/technology/2021/may/09/how-private-is-your-gmail-and-should-you-switch'>here</a> and <a href='https://www.lifewire.com/find-out-who-or-what-is-accessing-your-gmail-1171930'>here</a>).</p>
<p>In the United States there exists no mandatory reporting regiment for CVEs today; only "good-faith." It is up to the company and/or the discoverer to make public any discovered vulnerabilites and exposures. When companies such as Google and Microsoft choose not to announce a vulnerability (let's say, it's ongoing and they are still trying to identify the root-cause and push a fix), we end-users don't know we are exposed. For the company this amounts to a trouble ticket and an escalation. For end-users this amounts to identity theft.</p>
</div>
</div>
<br>

----

<h3 id='browser'>Web Browsers</h3>

<i>DO NOT use Google Chrome (see [FAQs](#faq)).</i>
<div class='content-pad'>
<div class='brand'><a href='https://www.mozilla.org/en-US/firefox/new/'>Mozilla Firefox</a></div>
<p>Mozilla Firefox is a fast, private & safe web browser suitable for Windows, MacOS and Linux operating systems. Firefox is developed and maintained by the Mozilla Foundation, an actual non-profit organization that actively supports online privacy & security, trustworthy artificial intelligence (AI), and accountability for big tech corporations. Mozilla puts people before profit; they create products, technologies and programs that make the internet healthier for everyone. Firefox is ethical, open-source, and customizable. And, it's free.</p>

<div class='brand'><a href='https://brave.com/'>Brave</a></div>
<p>Brave is a privacy-focused, open source web browser based on Chromium (under Mozilla Licence), suitable for Windows, MacOS, Linux, Android and iOS operating systems. Brave is developed and maintained by Brave Software, Inc.. Brave is one of two Chromium-based browsers offering true user privacy protection via out-of-the-box Firewall, VPN, Ad and Tracker Shields, and Tor integration. Brave is highly customizable both in its privacy and security settings and search engine optimization. Brave is also the first browser to offer its users compensation for ads viewership, in the form of BAT (Basic Attention Tokens). And, it's free.</p>

<div class='brand'><a href='https://vivaldi.com/'>Vivaldi</a></div>
<p>Vivaldi is an open source web browser based on Chromium, suitable for Windows, MacOS, Linux, and Android operating systems. Vivaldi is developed by Vivaldi Technologies, a Norwegan company founded by Tatsuki Tomita and Jon Stephenson von Tetzchner (co-founder and CEO of Opera Software). Vivaldi is the second of two Chromium-based browsers offering true user privacy protection via out-of-the-box Ad, Pop-Up and Tracker blocking integration. Vivaldi is highly customizable and privacy-focused: Vivaldi doesn’t profile or track you, collect or sell your data, it can’t see which sites you visit, what you search for, or what you download. Your data is either encrypted or stored just on your machine. And, it's free.</p>
</div>
<br>

---

<h3 id='search'>Search Engines</h3>

<i>DO NOT use Google Chrome (see [FAQs](#faq)).</i>
<div class='content-pad'>
<div class='brand'><a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a></div>
<div>
<p>Firefox supports addition of multiple search engines, <a href='https://support.mozilla.org/en-US/kb/change-your-default-search-settings-firefox#w_one-click-search-alternatives'>custom search Engines</a>, ranking of search suggestions in relation to browsing history, and more. Learn more about search customization in Firefox web browser <a href='https://support.mozilla.org/en-US/kb/search-firefox-address-bar'>here</a>.</p>
</div>

<div class='brand'><a href='https://duckduckgo.com/'>DuckDuckGo</a></div>
<div>
<p>DuckDuckGo offers a privacy-focused search experience. DuckDuckGo is perhaps most well-known for its privacy feature called "untracked search." While privacy-preserving, DuckDuckGo SEO suffers in terms of relevance and robustness, such that it becomes increasingly burdensome to find exactly what one is actually looking for when (re-)forming a search query. One may find themselves re-indexing the internet in hopes of landing a meaningful result. Maybe that's a good thing, for those with time to spare. Learn more about search integration and customization in DuckDuckGo <a href='https://help.duckduckgo.com/duckduckgo-help-pages/results/syntax/'>here</a>.</p>
</div>

<div class='brand'><a href='https://search.brave.com/'>Brave</a></div>
<div>
<p>Brave search engine offers users ability to customize and refine search performance via user-defined search engine shortcuts and re-ranking optimization functions.</p>
</div>
<h4>Custom SearchEngines</h4>
<div>
<p><a href='brave://settings/searchEngines'>Custom searchEngines</a> enable users to create shortcuts for quicklinking to personal email accounts, executing queries across specific news sites, retail sites, and more. For example, let's define a shortcut for querying HackerNews:</p>
</div>
<div style='margin: 10px 15px 10px 15px;'>
<p>1. In the address bar, enter <code>brave://settings/searchEngines</code>.</p>
<p>2. Under "Site Search," select "Add" to create a shortcut. Define the custom search engine name (e.g., <code>HackerNews Query</code>) and the shortcut (e.g., <code>hnq</code>). In the URL, substitute <code >%s</code> in place of the query item (e.g., <code>query=%s</code>), and "Save." </p>
<pre><code>Search Engine: HackerNews Query
Shortcut: hnq
URL: https://hn.algolia.com/?dateRange=all&page=0&prefix=false&query=%s&sort=byDate&type=story</code></pre>
<p>3. Navigate to the address bar, enter the shortcut <code>hnq</code> + [spacebar].</p>
<p><img id='shortcut-hnq' src="/../media/images/shortcut-hnq.png" height="auto;" width="80%;"/></p>
<p>4. Type a query item (e.g., 'crypto'), and press [enter].</p>
<p><img id='shortcut-hnq-crypto' src="/../media/images/shortcut-hnq-crypto.png" height="auto;" width="80%;"></p>
<p>5. A search query is executed in HackerNews, and results are displayed. Pretty nice!</p>
<p><img id='crypto-results' src="/../media/images/crypto-results.png" height="220px;" width="80%;"></p>
</div>

<div style='padding-top: 15px;'>
<h4>Custom Search Re-Ranking</h4>
<div>
<p> For personalized search optimization, <a href='https://search.brave.com/help/goggles'>Brave Goggles</a> enables users to define and customize re-ranking preferences on top of Brave’s Search index using a set of instructions (i.e., rules and filters). Anyone can create, apply, and/or extend a Brave Goggle for both public or private use. With Goggles, Brave Search offers users an almost limitless number of ranking options, as defined by the user.</p>
<p>For example, let's say we want to omit specific websites from our search results: </p>
</div>
<div style='margin: 5px 15px;'>
<p>The "<a href='https://search.brave.com/goggles/discover?goggles_id=https%3A%2F%2Fraw.githubusercontent.com%2Fariscae%2Fbrave-goggles%2Fmain%2Fretail_goggles%2Famazon_excluded_search.goggle'>Amazon-Excluded Search</a>" Goggle refines the results of any search query performed using Brave Search such that it discards Amazon-owned companies from appearing altogether.</p>

<div class='post-container-grid-2' style='margin-right: 5px;'>
<div class='p-item1'  style='text-align: center;'>
<p><i>Before applying the filter:</i></p>
<img id='amzn-before' src='/media/images/amazon-exclude-before.png' height="300px;" width="80%;"/>
</div>
<div class='p-item2'  style='text-align: center;'>
<p><i>After applying the filter:</i></p>
<img id='amzn-after' src='/media/images/amazon-exclude-after.png' height="300px;" width="80%;"/>
</div>
</div>
<br>

<p>Similarly, the "<a href='https://search.brave.com/goggles/discover?goggles_id=https%3A%2F%2Fraw.githubusercontent.com%2Fbrave%2Fgoggles-quickstart%2Fmain%2Fgoggles%2Fno_pinterest.goggle'>No Pinterest</a>" Goggle refines the results of any Brave search query such that it removes pages and threads hosted on Pinterest from appearing in the search results.</p>

<div class='post-container-grid-2' style='margin-right: 5px;'>
<div class='p-item1' style='text-align: center;'>
<p><i>Before applying the filter:</i></p>
<img id='pnt-before' src='/../media/images/pinterest-before.png' height="300px;" width="80%;"/>
</div>
<div class='p-item2' style='text-align: center;'>
<p><i>After applying the filter:</i></p>
<img id='pnt-after' src='/../media/images/pinterest-after.png' height="300px;" width="80%;"/>
</div>
</div>
</div>
</div>
<br>

<p>How simple! Discover more Brave Goggles offerings <a href='https://search.brave.com/goggles/discover?nav=site'>here</a>.</p>
</div>
<br>

---

<h3 id='adblock'>Ad & Tracking Blockers</h3>
<div class='content-pad'>
<p>With a web browser and search engine selected, it's important to configure an Adblocker that will help protect us against big tech spies and other malware. Across both Firefox and Chromium-based web browsers, one well-known and widely respected Adblocker browser extension is called <a href='https://ublockorigin.com/'>uBlock Origin</a>. One relatively new and upcoming Adblocker gaining notoriety is called DuckDuckGo Privacy Essentials. </p>
<div style='padding-top: 10px;'>
<h4>FireFox Web Browser</h4>
<p>For <a href='https://www.mozilla.org/en-US/firefox/new/'>Firefox</a>, Adblock browser extensions are 
<a href='https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search'>uBlock Origin (Mozilla)</a> and 
<a href='https://addons.mozilla.org/en-US/firefox/addon/duckduckgo-for-firefox/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search'>DuckDuckGo Privacy Essentials (Mozilla)</a>.</p>
</div>
<div style='padding-top: 10px;'>
<h4>Chromium-based Web Browsers</h4>
<p>Both <a href='https://vivaldi.com/features/privacy-security/'>Vivaldi</a> and
<a href='https://brave.com/firewall-vpn/'>Brave</a> offer users a built-in, highly customizable Ad and Tracking blocker extension. For Brave, the default Adblocker extension is called "Shield," with uBlock Origin configured as the default Adblocker setting. Shield customizations I've found useful include the following:</p>

<div style='margin: 5px;'>
<div class='post-container-grid-2'>
<div class='p-item1'>  
<div style='margin: 5px;'>
<p><i>Filter lists:</i></p>
<p><input type="radio" checked/> Fanboy Annoyances List</p>
<p><input type="radio" checked/> Fanboy Social List</p>
<p><input type="radio" checked/> Fanboy's Anti-chat apps List</p>
<p><input type="radio" checked/> uBlock Annoyances List</p>
</div>
</div>
<div class='p-item2'>
<div style='margin-top: 5px;'>
<p><i>Custom lists</i><small> (Licence: Mozilla)</small>:</p>
<div style='margin: 5px;'>
<p><a href='https://o0.pages.dev/Pro/adblock.txt'>https://o0.pages.dev/Pro/adblock.txt</a></p>
<p><a href='https://o0.pages.dev/mini/adblock.txt'>https://o0.pages.dev/mini/adblock.txt</a></p>
</div>
</div>
</div>
</div>
</div>

<p>In addition to Shield customization, I've added the browser extension <a href='https://chrome.google.com/webstore/detail/duckduckgo-privacy-essent/bkdgflcldnnnapblkhphbgpggdiikppg'>DuckDuckGo Privacy Essentials (Chrome)</a>. As new trackers and ad services are detected by DuckDuckGo Privacy Essentials, I add them to the custom filter list in Shield.</p>
</div>
</div>
<br>

---

<h3 id='mfa'>Multi-Factor Authentication</h3>
<div class='content-pad'>
<p>Multi-factor authentication (MFA) (i.e., 2FA or 2-step authentication) is a way to enhance password security by requiring more than one method (i.e., factor) for successful authentication. Without a form of MFA, anybody who guesses, steals, or hacks your password can access your account from anywhere. When MFA is enabled, account access requires another, more unique factor to prove you are who you say you are; something (hopefully) only you can provide.</p>

<p>MFA can take the form of SMS (text message), a software application (e.g., an authenticator app), and/or a hardware device (e.g., a yubikey). 2FA via SMS is prone to security issues, as text messages are unencrypted and able to be intercepted with little to no effort. Because the objective is to increase our online security, is not advised to use SMS as the 2FA solution. Instead, we will choose as our MFA mechanism either the authenticator app or hardware authentication solution.</p> 


<div class='brand'><a href='https://authy.com/'>Authy</a></div>
<div>
<p>Authy is a free two-factor authentication application developed by Twilio. For a given account, Authy generates time-sensitive codes locally, on your device, based on a secret key. Authy is available for use on both mobile and desktop devices: iOS, Android, Windows, Mac, and Linux.</p>

<p>Authy supports 2FA for many <a href='https://authy.com/guides/'>applications/services</a> including: </p>

<pre>
<code>LinkedIn | PayPal | Reddit | Binance | Uber | Grammarly | MailChimp
Bitwarden | Amazon | Facebook | Instagram | Dropbox | Box | Cloudflare
Slack | Twitter | FastMail | ProtonMail | Gmail | GitHub | Microsoft
SnapChat | Teamviewer | Twitch | Pinterest | Apple | EverNote | Discord</code>
</pre>

<p>Learn more about Authy <a href='https://www.nytimes.com/wirecutter/reviews/best-two-factor-authentication-app/'>here</a>.</p>
</div>

<div class='brand'><a href='https://www.yubico.com/'>Yubikey</a></div>
<div>
<p>Yubikey is a hardware authentication device developed and manufactured by Yubico. It is used to protect access to user accounts on computers, networks, and online services. Yubikeys are personal USB security keys; they plug into your computer and/or phone and are used alongside your primary password to complete the second half of a MFA web login authentication process. Each Yubikey device has a unique code built on to it which is used to generate codes that help confirm your unique identity.</p>

<p>2FA via apps and SMS, while an improvement to the alternative (single-authentication), remain vulnerable to time-delay attacks. Yubikey offers an additional level of robustness, as it can protect users from phishing and advanced man-in-the-middle attacks, e.g., attacks in which a person or maligning process attempts to intercept the two-factor authentication as it is entered and processed. Yubikeys are tech industry standard.</p>

<p>Yubikey supports 2FA for many <a href='https://www.yubico.com/quiz/'>applications/services</a> including:</p>

<pre>
<code>AWS (IAM) | Google | Microsoft | Apple | Brave | Oracle
Dropbox | 1Password | Bitwarden | Duo | Cloudflare | Linux
ProtonMail | FastMail | GitHub | GitLab | Reddit | Drupal
Binance | Kraken | Facebook | Twitter | Instagram | Twitch
Teamviewer | Ebay |  DocuSign | Tesla | Salesforce | Shopify</code>
</pre>


<p>Learn more about Yubikey <a href='https://zapier.com/blog/what-is-a-yubikey/'>here</a>.</p>
</div>
</div>
<br>

---

<h3 id='password'>Password Managers</h3>
<div class='content-pad'>
<div>
<p>Password theft is a serious problem. Websites and applications we use are under constant attack. When security breaches occur, they expose sensitive and unique identifying information about us (e.g., username, email address, password, phone number, physical address) to the world. Using a password manager helps protect us against password theft occurrences, and limits our exposure when security breaches happen.</p>
</div>

<div class='brand'><a href='https://bitwarden.com/'>Bitwarden</a></div>
<div>
<p>Bitwarden is an open source password management service that stores sensitive information (i.e., usernames, passwords, metadata) in an encrypted vault. At present Bitwarden is one of the safest ways to store all logins and passwords while also keeping them synced between all of your devices, and secure via MFA.</p>

<p>Bitwarden offers native desktop applications for macOS, Windows, and Linux, and native mobile applications for Android and iOS. Bitwarden also offers browser extension support for Chrome, Edge, Firefox, Opera, Safari, Vivaldi, Brave, and Tor Browsers. Users can leverage Bitwarden web interface, desktop/mobile application, and/or browser extension to create and edit entries in their password vault.</p>

<p>Bitwarden offers both free and paid service tiers. The Free tier includes a password generator, credential sharing, and the option to self-host. With the Free tier users can sync an unlimited number of password vault items across multiple devices. For most users, the free service tier is sufficient.</p>
</div>
<div style='padding-top: 10px;'>
<h4>Other Notable Options:</h4>
<div id='link'><a href='https://1password.com/'>1Password</a></div>
</div>
</div>
<br>


---

<h3 id='vpn'>VPNs</h3>
<div class='content-pad'>
<div>
<p>Virtual Private Networks (VPNs) help our data remain private and secure. VPNs work by creating a encrypted tunnel between our device and our VPN provider, protecting us in two key ways:</p>
<ul>
<li>Concealing our IP address, which protects our identity and geolocation.</li>
<li>Encrypting our traffic between us and our VPN provider, so that no one on our local network can decipher or modify it.</li>
</ul>
<p>VPNs protect us when connecting to public WiFi networks (e.g., Starbucks, the airport, by accident when our smartphones are set to WiFi -> ON + Autoconnect). VPNs also limit the amount of data our internet service provider (ISP) can reliably gather (and sell) about our internet usage.</p> 

<p>Note: VPNs are not free.</p>
</div>
<div style='padding-top: 10px;'>
<h4>Notable VPN Service Options:</h4>
<div id='link'><a href='https://protonvpn.com/'>ProtonVPN</a></div>
<div id='link'><a href='https://www.expressvpn.com/'>ExpressVPN</a></div>
<div id='link'><a href='https://nordvpn.com/'>NordVPN</a></div>
<div id='link'><a href='https://www.mozilla.org/en-US/products/vpn/'>MozillaVPN</a></div>
</div>
<div style='padding-top: 10px;'>
<p>Learn more about VPN options <a href='https://www.pcmag.com/picks/the-best-vpn-services'>here</a>.</p>
</div>
</div>
<br>

---

<h3 id='faq'>FAQs</h3>
<div style='padding-bottom: 10px;'>
<details closed>
<summary> <strong>Why suggest internet users avoid Google Chrome?</strong> </summary>

<strong>Why?</strong>
  <p>Malware in Google Ads and Search results.</p>
<strong>What do you mean?</strong>
<p>Ads dominate Google search results; it's how they make so much money every  year. Many of those ads contain malware.</p>
<strong>Okay, but... How?</strong>
  <p>Google Search results contain Malicious Ads with links to phishing sites<a href='https://www.bleepingcomputer.com/news/security/malicious-google-ads-sneak-aws-phishing-sites-into-search-results/'>[1]</a><a href='https://www.bleepingcomputer.com/news/security/hackers-push-malware-via-google-search-ads-for-vlc-7-zip-ccleaner/'>[2]</a><a href='https://www.bleepingcomputer.com/news/security/ransomware-access-brokers-use-google-ads-to-breach-your-network/'>[3]</a><a href='https://www.bleepingcomputer.com/news/security/hackers-abuse-google-ads-to-spread-malware-in-legit-software/'>[4]</a><a href='https://www.bleepingcomputer.com/news/security/bitwarden-password-vaults-targeted-in-google-ads-phishing-attack/'>[5]</a>. The end user can't differentiate good links from bad, malicious links. This results in lots of innocent users falling victim to repeated phishing attacks; attacks which could be prevented.</p>
<strong>That's super risky to all users of Google products. Why wouldn't Google do something to improve customer experience?</strong>
<p>Like filter out those malicious items before surfacing search results to the end user? Great question. I asked Google the same question when I reported the ongoing malicious activity, beginning December 2022.</p>
<strong>You actually contacted Google? What did Google say?</strong>
<p>Google referred me to their privacy and security URLs, and suggested I have my lawyer contact them if needed.</p>
<strong>Wow, that's extremely unhelpful, and doesn't really address your credible concern. Did Google ever fix the issues?</strong>
<p>Unfortunately, no. As of March 2023, the vulnerability is still ongoing.</p>
<strong>What?! How scary! Do you know how many people use Google Chrome?</strong>
<p>As a matter of fact, Google itself estimates 2.65 billion internet users use Chrome as their primary web browser in 2022 <a href='https://backlinko.com/chrome-users#chrome-stats'>[1]</a>.</p>
<strong>That is a huge number of impacted people to leave vulnerable. Is anyone taking action?!</strong>
<p>Yes, sort of. The SEC and DOJ have a couple of Antitrust Lawsuits that appear helpful for us non-billionaire internet users <a href='https://www.vox.com/recode/2023/1/24/23569609/google-antitrust-lawsuit-digital-ads'>[1]</a>. Hopefully we'll win the justice we need to improve privacy and security for all users of the internet.</p>
<strong>Is there anything we can do to help?</strong>
<p>Definitely. Suggestions include:
<ul>
  <li>Improve your internet privacy and security footprint using the tips described above.</li>
  <li>Share these tips with your friends and family.</li>
  <li>If you have improvements on and/or additions to these tips, please share them with me, and with each other.</li>
  <li>Contact your <a href='https://www.house.gov/representatives/find-your-representative'>local representatives</a> and <a href='https://www.senate.gov/senators/'>senators</a>. Let them know this antitrust case against Google is important to you as a user of the internet, and your privacy and security matters.</li>
  <li>Stay informed. Keep learning about and fighting for internet privacy and security.</li>
</ul></p>
</details>

<details closed>
<summary> <strong>How much will all this cost?</strong> </summary>

<p>The only items that cost money are Yubikey and VPN. This means if you forgo Yubikey and VPN, nothing; it's all FREE. Can't beat that. </p>
<p>Including Yubikey and VPN, one can spend ~$200 USD, which includes the "fancy" Yubikey (USB-C + Lightning ports) and 1 year of VPN service.</p>
</details>

<details closed>
<summary> <strong>Who are "big tech spies"?</strong> </summary>

<strong>Who?</strong>
<p>Glad you asked. Big tech spies include, but are not limited to, Google, Meta (Facebook), Amazon, Twitter, Microsoft and Apple.</p>

<strong>How do you know?</strong>
<p>These companies appear most often in Ad & Tracking Blocklists and in privacy/ad agreements with 3rd Party services (e.g., Plex, Spotify). A few examples are provided below:</p>
<ul>
<li>graph.facebook.com</li>
<li>pixel.facebook.com</li>
<li>connect.facebook.com</li>
<li>graph.instagram.com</li>
<li>google-analytics.com</li>
<li>googleads.g.doubleclick.net</li>
<li>pagead2.googlesyndication.com</li>
<li>adservice.google.com</li>
<li>amazon-adsystem.com</li>
<li>unagi.amazon.com</li>
<li>device-metrics-us.amazon.com</li>
<li>analytics.twitter.com</li>
<li>syndication.twitter.com</li>
<li>ads-twitter.com</li>
<li>ads-api.twitter.com</li>
<li>ads-bidder-api.twitter.com</li>
<li>stats.microsoft.com</li>
<li>telemetry.urs.microsoft.com</li>
<li>microsoftadvertising.com</li>
<li>bing-ads-display-ads-cdn.afd.azureedge.net</li>
<li>smetric.ads.microsoft.com</li>
<li>adservices.apple.com</li>
<li>advp.apple.com</li>
<li>searchads.apple.com</li>
</ul>
<strong>Are there others?</strong>
<p>Yes, there are many (e.g., Stripe: js.stripe.com). It is safe to assume everywhere we go on the internet, there are tracking objects (e.g., session cookie and/or json web token (JWT)) actively attempting to connect to our device(s) for the purpose of harvesting our user interaction data, along with all our activity across our browser(s) and any open apps. This is why it is important to make use of Adblocker software as soon as possible, on all devices (e.g., smartphones, computers).</p>
</details>

</div>
