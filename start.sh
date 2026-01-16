tailscaled --tun=userspace-networking --socks5-server=localhost:1055 &
tailscale up --auth-key=${TAILSCALE_AUTH_KEY} --hostname=${TAILSCALE_HOSTNAME}
exec adventure-routes-v3