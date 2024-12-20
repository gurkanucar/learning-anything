# GitHub CI/CD Auto-Deploy Setup Guide 🚀

This guide walks you through setting up automated deployment using GitHub Actions with SSH authentication.

## Table of Contents
- [GitHub CI/CD Auto-Deploy Setup Guide 🚀](#github-cicd-auto-deploy-setup-guide-)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [SSH Key Setup](#ssh-key-setup)
    - [Generate SSH Keys](#generate-ssh-keys)
    - [Configure GitHub](#configure-github)
    - [Server Configuration](#server-configuration)
  - [GitHub Actions Workflow](#github-actions-workflow)
    - [Workflow Configuration](#workflow-configuration)
    - [Environment Variables](#environment-variables)
  - [Security Best Practices](#security-best-practices)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debug Mode](#debug-mode)
  - [Need Help?](#need-help)

## Prerequisites

Before you begin, ensure you have:
- A GitHub repository
- Server access with sudo privileges
- Git installed on your server
- GitHub Actions enabled in your repository

## SSH Key Setup

### Generate SSH Keys

Generate a new ED25519 SSH key pair with enhanced security:

```bash
ssh-keygen -t ed25519 -a 200 -C "your.email@example.com"
```

> 💡 The `-a 200` flag increases the number of KDF (Key Derivation Function) rounds, enhancing security.

### Configure GitHub

1. Copy your public SSH key:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Add the public key to GitHub:
   - Navigate to [GitHub SSH Settings](https://github.com/settings/ssh/new)
   - Paste your public key
   - Give it a descriptive name like `Deploy-Key-Production`

### Server Configuration

1. Open or create the authorized_keys file:
```bash
nano ~/.ssh/authorized_keys
```

2. Append your public SSH key
3. Set proper permissions:
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

4. Copy your private key:
```bash
cat ~/.ssh/id_ed25519
```

## GitHub Actions Workflow

### Workflow Configuration

Create `.github/workflows/deploy.yml`:

```yaml
name: Continuous Deployment

on:
  push:
    branches:
      - dev
      - master
    paths:
      - 'src/**'
      - 'public/**'
      - 'package.json'
      - '.github/workflows/deploy.yml'

jobs:
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: Deploy using SSH
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: |
            cd /home/my_project
            git reset --hard
            git checkout master
            git pull origin master
            mvn clean install -DskipTests
            cd target
            cp my_project.war /opt/tomcat/webapps/
            sudo systemctl restart tomcat
```

### Environment Variables

Set up the following secrets in your GitHub repository:
1. Go to `Settings > Secrets and variables > Actions`
2. Add the following secrets:
   - `SSH_HOST`: Your server's IP or domain
   - `SSH_USER`: SSH username
   - `SSH_PRIVATE_KEY`: The private key generated earlier
   - `SSH_PORT`: SSH port (usually 22)

## Security Best Practices

1. 🔒 **SSH Key Security**:
   - Use strong passphrases for SSH keys
   - Regularly rotate SSH keys
   - Use principle of least privilege

2. 🛡️ **Repository Security**:
   - Enable branch protection rules
   - Require pull request reviews
   - Enable required status checks

3. 🔐 **Server Security**:
   - Keep server packages updated
   - Use UFW or similar firewall
   - Enable SSH key-only authentication

## Troubleshooting

### Common Issues

1. **Permission Denied**:
   ```bash
   # Check SSH key permissions
   ls -la ~/.ssh/
   # Should show:
   # -rw------- (600) for private key
   # -rw-r--r-- (644) for public key
   ```

2. **Connection Issues**:
   ```bash
   # Test SSH connection
   ssh -T git@github.com
   ```

3. **Workflow Failures**:
   - Check workflow logs in GitHub Actions
   - Verify secret values
   - Ensure server firewall allows connections

### Debug Mode

Enable SSH debugging in your workflow:
```yaml
- name: Deploy using SSH
  uses: appleboy/ssh-action@v0.1.10
  with:
    debug: true
    # ... other configurations
```

## Need Help?

- 📚 Check [GitHub Actions documentation](https://docs.github.com/en/actions)
- 🔍 Review [SSH Action documentation](https://github.com/appleboy/ssh-action)
- 🐛 Open an issue in the repository for support

---
*Remember to regularly update your dependencies and security configurations!* 🔄