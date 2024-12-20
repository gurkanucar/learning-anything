# NGINX Advanced Configuration Guide

This guide explains the step-by-step installation of NGINX web server, SSL certificate configuration, and advanced features like load balancing, basic authentication, and WebSocket support.

## Table of Contents
- [NGINX Advanced Configuration Guide](#nginx-advanced-configuration-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [NGINX Installation](#nginx-installation)
  - [SSL Certificate Setup](#ssl-certificate-setup)
  - [Load Balancing](#load-balancing)
  - [Basic Authentication](#basic-authentication)
  - [WebSocket Configuration](#websocket-configuration)
  - [Auto Renewal](#auto-renewal)
  - [Troubleshooting](#troubleshooting)
  - [Security Recommendations](#security-recommendations)

## Prerequisites

- Ubuntu/Debian-based operating system
- User with sudo privileges
- Valid domain name
- Open ports 80 and 443

## NGINX Installation

1. Update system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install NGINX:
```bash
sudo apt install nginx -y
```

3. Check NGINX service status:
```bash
sudo systemctl status nginx
```

4. Edit the default configuration file:
```bash
sudo nano /etc/nginx/sites-available/default
```

5. Delete all content and add the following configuration:
```nginx
server {
    listen 80;
    server_name subdomain.your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

6. Check configuration syntax:
```bash
sudo nginx -t
```

7. Restart NGINX:
```bash
sudo systemctl restart nginx
```

## SSL Certificate Setup

1. Install Certbot and NGINX plugin:
```bash
sudo apt install certbot python3-certbot-nginx -y
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d subdomain.your_domain.com
```

3. During installation:
   - Enter your email address
   - Accept terms
   - Choose redirect HTTP to HTTPS (recommended)

## Load Balancing

1. Create a new configuration file:
```bash
sudo nano /etc/nginx/conf.d/load-balancer.conf
```

2. Add the following configuration for round-robin load balancing:
```nginx
upstream backend_servers {
    # Round-robin load balancing (default)
    server backend1.example.com:8080;
    server backend2.example.com:8080;
    server backend3.example.com:8080;
    
    # Optional: Weighted load balancing
    # server backend1.example.com:8080 weight=3;
    # server backend2.example.com:8080 weight=2;
    # server backend3.example.com:8080 weight=1;
}

server {
    listen 80;
    server_name loadbalancer.example.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # Health check
        health_check interval=5s rises=1 fails=3 timeout=5s;
    }
}
```

## Basic Authentication

1. Install apache2-utils to use htpasswd:
```bash
sudo apt install apache2-utils -y
```

2. Create password file:
```bash
sudo htpasswd -c /etc/nginx/.htpasswd user1
```

3. Add authentication to your NGINX configuration:
```nginx
server {
    listen 80;
    server_name secure.example.com;

    location / {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
        
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
    
    # Optional: Exclude certain paths from authentication
    location /public {
        auth_basic off;
        proxy_pass http://backend;
    }
}
```

## WebSocket Configuration

Add WebSocket support to your NGINX configuration:

```nginx
server {
    listen 80;
    server_name websocket.example.com;

    location /ws {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        
        # WebSocket specific settings
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
        proxy_buffer_size 64k;
        proxy_buffers 8 32k;
        proxy_busy_buffers_size 64k;
    }
}
```

## Auto Renewal

1. Test automatic renewal:
```bash
sudo certbot renew --dry-run
```

2. Check automatic renewal cronjob:
```bash
sudo systemctl status certbot.timer
```

## Troubleshooting

- Check NGINX error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

- Check SSL certificate status:
```bash
sudo certbot certificates
```

- Test NGINX configuration:
```bash
sudo nginx -t
```

## Security Recommendations

1. Disable unused HTTP methods
2. Add rate limiting
3. Add SSL/TLS security headers

Example security configuration:
```nginx
server {
    # ... other configurations ...

    # Limit HTTP methods
    if ($request_method !~ ^(GET|HEAD|POST)$ ) {
        return 444;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
    limit_req zone=one burst=10 nodelay;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # SSL configurations (if using HTTPS)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
}
```