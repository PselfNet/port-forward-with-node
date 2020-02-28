#!/usr/bin/env node
const net = require('net');
function getDateStr() {
    return (new Date()).toLocaleString();
}
function proxyTCP(key, conf) {
    let [bind, server] = [conf.bind, conf.server];
    let tcpServer = net.createServer((c) => {
        console.info(`[${getDateStr()}] [${key}] [INFO] - TCP Client connect ${c.remoteAddress}:${c.remotePort}`);
        let client = net.connect({ port: server[1], host: server[0] }, () => {
            c.pipe(client);
        });
        client.pipe(c);
        client.on('error', (err) => {
            console.error(`[${getDateStr()}] [${key}] [ERROR] - ${err}`);
            c.destroy();
        });
        client.on('end', (err) => {
            console.error(`[${getDateStr()}] [${key}] ${c.remoteAddress}:${c.remotePort} closed`);
            c.destroy();
        });
        c.on('end', (err) => {
            console.error(`[${getDateStr()}] [${key}] ${c.remoteAddress}:${c.remotePort} closed`);
            client.destroy();
        });
        c.on('error', (err) => {
            console.error(`[${getDateStr()}] [${key}] [ERROR] -  ${err}`);
            client.destroy();
        });
    });
    tcpServer.listen({ host: bind[0], port: bind[1], }, () => {
        console.info(`[${getDateStr()}] [${key}] [INFO] - TCP Server start ${bind[0]}:${bind[1]}`);
    });
    return tcpServer;
}
const servers = {};

process.argv[2].split(",").forEach(function(map){
    let [serverPort,clientIP,clientPort] = map.split(":");
    servers[serverPort] = proxyTCP(serverPort, {
        bind: ["0.0.0.0", serverPort],
        server:[clientIP,clientPort]
    });
})