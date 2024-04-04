// import { URL } from "url";
// import path from "path";
// import forge from "node-forge";
// import fs from "fs-extra";
// import { fileURLToPath } from "node:url";
// import { spawn } from "child_process";
// import https from "https";
// import dns from "dns";

import { Proxy } from 'http-mitm-proxy';

// import { sleep } from "./utils.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const CERTS_PATH = path.join(__dirname, "..", ".http-mitm-proxy", "certs");

var proxy: Proxy = new Proxy();


proxy.onError(function(_ctx, _err) {
    console.error("Proxy error!");
    console.error("Error message: ", _err.message);
    console.error("URL: ", _ctx.clientToProxyRequest.url);
});

proxy.onConnect(function (_req, _socket, _head, _callback) {
    console.log(_req.url);
    return _callback();
});

proxy.onRequest(function(ctx, callback) {
    // Google search ?
    const condition: boolean = ctx.clientToProxyRequest.headers.host == 'www.google.com'
        && ctx.clientToProxyRequest.url.indexOf('/search') == 0;

    if (condition) {
        ctx.use(Proxy.gunzip);
        ctx.onResponseData(function(_ctx, chunk, callback) {
            chunk = Buffer.from(chunk.toString().replace(/<h3.*?<\/h3>/g, '<h3>Pwned!</h3>'));
            return callback(null, chunk);
        });
    }

    return callback();
});

console.log('begin listening on 8080');

// const dnsResolver = new dns.Resolver();
proxy.listen({
    //host: "192.168.1.13",
    port: 8080,
    // httpsAgent:
    //     process.platform == 'win32' ?
    //     new https.Agent({
    //         keepAlive: false,
    //         lookup: (_hostname, _options, _callback) => {
    //             dnsResolver.resolve4(_hostname, (err, result) => {
    //                 _callback(err, result[0], 4);
    //             });
    //         },
    //     })

    //     : undefined,
});

//await sleep(1000);

//const pathToPkcs12 = await convertPemToPkcs12();


//proxy.close();

// async function convertPemToPkcs12(): Promise<string> {
//     const pathToCaPem = path.join(CERTS_PATH, "ca.pem");
//     const pathToPkcs12 = path.join(CERTS_PATH, "cert_windows.p12");

//     const pemInBytes = await fs.readFile(pathToCaPem, "ascii");

//     const cert = forge.pki.certificateFromPem(pemInBytes);
//     const asn1 = forge.pkcs12.toPkcs12Asn1(null, cert, null);

//     const pkcs12InBytes = forge.asn1.toDer(asn1).getBytes();
//     await fs.writeFile(pathToPkcs12, pkcs12InBytes, "binary");

//     return pathToPkcs12;
// }