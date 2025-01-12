generate ssl certificates:
```
mkcert -cert-file example.com.crt -key-file example.com.key example.com "*.example.com" localhost 127.0.0.1 ::1
```
add it to hosts file:
```
127.0.0.1 example.com
```

allow implicit flow in keycloak:
