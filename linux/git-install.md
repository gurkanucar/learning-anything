# Git Install
#### run scripts below to install git and configure ssh

```bash
sudo apt install git -y
git --version
git config --global user.name "yourname"
git config --global user.email "yourmail"
git config --list

#create ssh keygen
ssh-keygen -t rsa -b 4096 -C "yourmail"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub
```

