const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const http = require('http');
const http2 = require('http2');
const spdy = require('spdy');
const routeStatic = require('./lib/route-static');
const redirectIndices = require('./lib/redirect-indices');
const serverPushAssets = require('./lib/server-push-assets');
const { HTTP2_HEADER_PATH } = http2.constants
const PUBLIC_PATH = path.join( __dirname, './src' )
const helper = require('./helper')
const publicFiles = helper.getFiles( PUBLIC_PATH )
const fs = require( 'fs' )
const tls = require( 'tls' )
const netjet = require('netjet')

const app = express();
const baseDir = 'src';
const port = process.env.PORT || 8005;

const config = {
	baseDir: 'src/',
	cacheDir: 'cache/',
	ports: {
		http1: process.env.PORT || 8005,        // T9 for "Performance MasterClass http1"
		http2: process.env.HTTP2_PORT || 6522,  // T9 for "Performance MasterClass http2"
		spdy: process.env.SPDY_PORT || 6523,    // T9 for "Performance MasterClass SPDY(3)"
	},
        ssl: {
	        key: fs.readFileSync(`${__dirname}/config/server.key`),
	        cert: fs.readFileSync(`${__dirname}/config/server.crt`),
	}
}

const serverH1 = http.createServer(app);
//const serverH2 = http2.createSecureServer(config.ssl, app );
//const serverSpdy = spdy.createServer(config.ssl, app);

///serverH2.on( 'error', err => console.error( 'err:', err ) )

app.set('etag', false);
app.use((req, res, next) => { res.removeHeader('X-Powered-By'); next(); });
app.use( netjet( {
        cache: {
		max: 100
	}
} ) )

// static routes
app.use(routeStatic);
app.use('/static', express.static(path.join(__dirname, baseDir), { etag: false, lastModified: false }));

// dynamic pages
app.use(redirectIndices);
nunjucks.configure(baseDir, {
    autoescape: true,
    express: app,
    watch: true
});

app.get('*', (req, res, next) => {
    res.render(path.join('./', req.url, 'index.html'), {});
});

/*function push (stream, path) {

	const file = publicFiles.get(path)

	if (!file) {
		return
	}

	stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (pushStream) => {
		pushStream.respondWithFD(file.fileDescriptor, file.headers)
	})

}

function onRequest (req, res) {

	const reqPath = req.path === '/' ? '/index.html' : req.path
	const file = publicFiles.get(reqPath)

	// File not found
	if ( !file ) {

		res.statusCode = 404
		res.end()
		return

	}

	// Push with index.html
	if (reqPath === '/index.html') {

		push(res.stream, '/bundle1.js')
		push(res.stream, '/bundle2.js')

	}

	// Serve file
	res.stream.respondWithFD(file.fileDescriptor, file.headers)

}*/

serverH1.listen(config.ports.http1, (err) => {
	    err ? console.error(err) : console.log(`App served over HTTP/1 on http://localhost:${config.ports.http1}`);
});
/*serverH2.listen(config.ports.http2, (err) => {
	    err ? console.error(err) : console.log(`App served over HTTP/2 on https://localhost:${config.ports.http2}`);
});
serverSpdy.listen(config.ports.spdy, (err) => {
	    err ? console.error(err) : console.log(`App served over SPDY/H2 on https://localhost:${config.ports.spdy}`);
});*/
