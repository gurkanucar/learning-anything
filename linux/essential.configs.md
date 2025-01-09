# Essential Configs

```bash
# Update the package lists and upgrade the system
sudo apt-get update
sudo apt upgrade -y

# Install basic utilities
sudo apt install ufw -y
sudo apt-get install lsof

# Enable the Uncomplicated Firewall
sudo ufw enable
sudo ufw allow ssh

mkdir -p /opt/apps/{dev,test}/{go,java,javascript}


# Add some useful aliases
echo "
alias ll='ls -al'     # Adds alias for ll to show all files and folders
alias lll='ls -alh'   # Adds alias for lll to show all files and folders with size in human readable format
alias cls='clear'     # Adds alias for cls to clear the screen
alias yep='sudo apt install'  # Simplified installation command
alias nop='sudo apt remove'   # Simplified removal command
alias whatsup='service --status-all'  # Check the status of all services
alias lt='ls --human-readable --size -1 -S --classify'  # Sort resources by file size
alias grep='grep --color=auto'  # Colorize grep output for better readability
alias update='sudo apt update && sudo apt upgrade -y'  # Update and upgrade system with a single command

## a quick way to get out of current directory ##
alias ..='cd ..'
alias ...='cd ../../../'
alias ....='cd ../../../../'

alias path='echo -e ${PATH//:/\\n}'
alias now='date +"%T"'
alias nowtime=now
alias nowdate='date +"%d-%m-%Y"'

# reboot / halt / poweroff
alias reboot='sudo /sbin/reboot'
alias poweroff='sudo /sbin/poweroff'
alias halt='sudo /sbin/halt'
alias shutdown='sudo /sbin/shutdown'

alias iftop='iftop -i eth1'

## pass options to free ##
alias meminfo='free -m -l -t'
 
## get top process eating memory
alias psmem='ps auxf | sort -nr -k 4'
alias psmem10='ps auxf | sort -nr -k 4 | head -10'

## get top process eating cpu ##
alias pscpu='ps auxf | sort -nr -k 3'
alias pscpu10='ps auxf | sort -nr -k 3 | head -10'
 
## Get server cpu info ##
alias cpuinfo='lscpu'
 
## older system use /proc/cpuinfo ##
##alias cpuinfo='less /proc/cpuinfo' ##
 
## get GPU ram on desktop / laptop##
alias gpumeminfo='grep -i --color memory /var/log/Xorg.0.log'

" >> /etc/bash.bashrc

# Update aliases in the current session
source ~/.bashrc
```