# Tomcat 10 Install

## Run scripts below:

```bash
## Create tomcat group and user
sudo groupadd tomcat
sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat
```

## Download and extract Tomcat

```bash
cd /tmp
wget https://dlcdn.apache.org/tomcat/tomcat-10/v10.1.28/bin/apache-tomcat-10.1.28.tar.gz
sudo mkdir /opt/tomcat
sudo tar xzvf apache-tomcat-10.1.28.tar.gz -C /opt/tomcat --strip-components=1
```

## Set permissions
```bash
sudo chmod -R 777 /opt/tomcat \
        && sudo chown -R tomcat:tomcat /opt/tomcat/ \
        && sudo chmod -R g+r /opt/tomcat/conf \
        && sudo chmod +x /opt/tomcat/bin \
        && sudo chmod g+x /opt/tomcat/conf
```


# Create systemd service file
```bash
cat <<EOL | sudo tee /etc/systemd/system/tomcat.service
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking
WorkingDirectory=/opt/tomcat/webapps

Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
Environment=CATALINA_PID=/opt/tomcat/temp/tomcat.pid
Environment=CATALINA_HOME=/opt/tomcat
Environment=CATALINA_BASE=/opt/tomcat
Environment=CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC
Environment=JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/v/urandom

ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh

User=tomcat
Group=tomcat
UMask=0007
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
EOL
```

## Reload systemd and start Tomcat
```bash
sudo systemctl daemon-reload
sudo systemctl enable tomcat
sudo systemctl start tomcat

# Open port 8080 in the firewall
sudo apt install ufw -y
sudo ufw allow 8080

# Add user to tomcat-users.xml
sudo sed -i '/<\/tomcat-users>/i \
<role rolename="tomcat"/>\n\
<role rolename="admin-gui"/>\n\
<role rolename="manager"/>\n\
<role rolename="manager-gui"/>\n\
<role rolename="manager-script"/>\n\
<role rolename="manager-jmx"/>\n\
<role rolename="manager-status"/>\n\
<user username="admin" password="pass123" roles="tomcat,admin-gui,manager,manager-gui,manager-script,manager-jmx,manager-status"/>\
' /opt/tomcat/conf/tomcat-users.xml


# Comment out <Valve> tags in context.xml files
sudo sed -i ':a;N;$!ba;s/<Valve className="org.apache.catalina.valves.RemoteAddrValve"[^>]*\/>/<!-- & -->/g' /opt/tomcat/webapps/manager/META-INF/context.xml
sudo sed -i ':a;N;$!ba;s/<Valve className="org.apache.catalina.valves.RemoteAddrValve"[^>]*\/>/<!-- & -->/g' /opt/tomcat/webapps/host-manager/META-INF/context.xml


# Set additional permissions and restart Tomcat
sudo chown -R tomcat /opt/tomcat/webapps/ /opt/tomcat/work/ /opt/tomcat/temp/ /opt/tomcat/logs/
sudo chmod +x /opt/tomcat/conf/
sudo systemctl restart tomcat
```

## Tomcat change port

```bash
sudo sed -i 's/port="8080"/port="<PORT>"/g' /opt/tomcat/conf/server.xml
sudo sed -i 's/address="127.0.0.1"/address="0.0.0.0"/g' /opt/tomcat/conf/server.xml

sudo ufw allow <PORT>
```


## Increase file upload limit

```bash
sudo nano /opt/tomcat/webapps/manager/WEB-INF/web.xml

#edit this
 <multipart-config>
      <!-- 50 MiB max -->
      <max-file-size><EDIT_HERE></max-file-size>
      <max-request-size><EDIT_HERE></max-request-size>
      <file-size-threshold>0</file-size-threshold>
    </multipart-config>
```