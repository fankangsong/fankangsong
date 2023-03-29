1. `git clone https://github.com/fankangsong/v2rayDocker.git`
2. `docker build -t v2ray-ws-tls:0.1 ./`
3. 生成一个 uuid：`cat /proc/sys/kernel/random/uuid`
4. 执行下面的脚本：

```shell
#!/bin/sh

sudo docker run -d --rm --name v2ray \
  -p 443:443 -p 80:80 \
  -v $HOME/.caddy:/root/.caddy \
  v2ray-ws-tls:0.1 {域名} V2RAY_WS {uuid}

sleep 3s

docker logs v2ray
```