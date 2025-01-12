generate ssl certificates:
```
mkcert -cert-file example.com.crt -key-file example.com.key example.com "*.example.com" localhost 127.0.0.1 ::1
```
add it to hosts file:
```
127.0.0.1 example.com
```


mkcert -cert-file local-dev.crt -key-file local-dev.key "*.dev.com" localhost 127.0.0.1 ::1

127.0.0.1 keycloak.dev.com
127.0.0.1 frontend.dev.com
127.0.0.1 backend.dev.com


allow implicit flow in keycloak

docker-compose down && docker-compose up -d