root@archlinux ~# docker run -d -p  443:443  --restart always  alpine sh -c "apk add nodejs-npm && npm i -dg @pself.net/port-forward-with-node && port-forward 443:<ip>:8"
