import fs from 'fs';
import 'babel-core/polyfill';
import {join} from 'path';
import express from 'express';
import colors from 'colors';
import { port } from './config';
import proxy from 'anyproxy';

const server = global.server = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(join(__dirname, '/')));

//
// Register API middleware
// -----------------------------------------------------------------------------
// server.use('/api/content', require('./api/content'));

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
	/* eslint-disable no-console */
	console.log(`The server is running at http://localhost:${port}/`);

	const getLocalResourcePath = (req) => {
		// console.log('>>:',req.headers.host,req.url,req.method,req.port);
		const prefix = `:3000/`;
		const idx = req.url.indexOf(prefix);
		let path = req.url.substring(idx + prefix.length);
		path = join(process.argv[1],'../../src/' + path);
		return fs.existsSync(path) ? path : false ;
	};

	const readJSON = (path) => {
		return JSON.parse(fs.readFileSync(path));
	}

	const options = {
	    type          : "http",
	    port          : 9005,
	    hostname      : "localhost",
	    rule          : {
	    	shouldUseLocalResponse:(req) =>{
	    		return !!getLocalResourcePath(req);
	    	},
	    	dealLocalResponse : function(req,reqBody,callback){
	    		const path = getLocalResourcePath(req);
	    		const responseText = JSON.stringify(readJSON(path));
	    		console.log('DEV PROXY FOR : ',colors.green(path));
	    		console.log(colors.green(responseText) + '\n');
		        callback(200,{"content-type":"text/json"},responseText);
			},
		},
	    dbFile        : null,  // optional, save request data to a specified file, will use in-memory db if not specified
	    webPort       : 9006,  // optional, port for web interface
	    socketPort    : 9007,  // optional, internal port for web socket, replace this when it is conflict with your own service
	    throttle      : 1000000,    // optional, speed limit in kb/s
	    disableWebInterface : false, //optional, set it when you don't want to use the web interface
	    silent        : true, //optional, do not print anything into terminal. do not set it when you are still debugging.
	};
	new proxy.proxyServer(options);
});
