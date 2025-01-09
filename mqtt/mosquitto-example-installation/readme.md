# commands
```
docker-compose up --build --force-recreate -d

mosquitto_sub -h localhost -p 1884 -t "admin/topic" -u "admin" -P "pass"
mosquitto_sub -h localhost -p 1884 -t "user/topic" -u "test" -P "pass"

mosquitto_pub -h localhost -p 1884 -t "admin/topic" -m "ADMIN Message To Admin Topic With Permission" -u "admin" -P "pass"
mosquitto_pub -h localhost -p 1884 -t "admin/topic" -m "User1 Message To Admin Topic Without Permission" -u "user1" -P "pass"
mosquitto_pub -h localhost -p 1884 -t "user/topic" -m "User1 Message To User Topic" -u "user1" -P "pass"
mosquitto_pub -h localhost -p 1884 -t "user/topic" -m "User2 Message To User Topic" -u "user2" -P "pass"

```