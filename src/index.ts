import { Proxy } from 'http-mitm-proxy';

var proxy: Proxy = new Proxy();
proxy.onError(function(_ctx, err) {
    console.error('proxy error:', err);
});

proxy.onRequest(function(ctx, callback) {

    console.log("Resquest handled");

    // Google search ?
    const condition: boolean = ctx.clientToProxyRequest.headers.host == 'www.google.com'
        && ctx.clientToProxyRequest.url.indexOf('/search') == 0;

    if (condition) {
        ctx.use(Proxy.gunzip);
        ctx.onResponseData(function(ctx, chunk, callback) {
            chunk = Buffer.from(chunk.toString().replace(/<h3.*?<\/h3>/g, '<h3>Pwned!</h3>'));
            return callback(null, chunk);
        });
    }
    return callback();
});

console.log('begin listening on 8081');
proxy.listen({port: 8081});