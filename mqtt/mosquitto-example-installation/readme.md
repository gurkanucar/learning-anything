# commands
```
docker-compose up --build --force-recreate -d

mosquitto_sub -h localhost -p 1884 -t "admin/topic" -u "admin" -P "pass"
mosquitto_pub -h localhost -p 1884 -t "admin/topic" -m "Admin Message" -u "admin" -
P "pass"
```