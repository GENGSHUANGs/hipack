/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fs from 'fs';
import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import colors from 'colors';
import { port } from './config';
import proxy from 'anyproxy';

const server = global.server = express();

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, '/')));

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
		const needReplace = req.url.indexOf(':3000/api/') !== -1;
		if(!needReplace){
			return false;
		}

		let uri = req.url.substring(req.url.indexOf(':3000/api/') + 10 );
		if(uri.indexOf('?') !== -1){
			uri = uri.substring(0,uri.indexOf('?'));
		}
		uri = './api/' + uri.replace(/\//g,'_') + '.json';
		return uri;
	};

	const options = {
	    type          : "http",
	    port          : 8005,
	    hostname      : "localhost",
	    rule          : {
	    	shouldUseLocalResponse:(req) =>{
	    		return !!getLocalResourcePath(req);
	    	},
	    	dealLocalResponse : function(req,reqBody,callback){
	    		let localPath = getLocalResourcePath(req);
	  			localPath = path.join(process.argv[1],'../../src/' + localPath);
	    		const responseText = JSON.stringify(JSON.parse(fs.readFileSync(localPath)));
	    		console.log('DEV PROXY FOR : ',colors.green(localPath));
	    		console.log(responseText + '\n');
		        callback(200,{"content-type":"text/json"},responseText);
			},
		},
	    dbFile        : null,  // optional, save request data to a specified file, will use in-memory db if not specified
	    webPort       : 8006,  // optional, port for web interface
	    socketPort    : 8007,  // optional, internal port for web socket, replace this when it is conflict with your own service
	    throttle      : 1000000,    // optional, speed limit in kb/s
	    disableWebInterface : false, //optional, set it when you don't want to use the web interface
	    silent        : true, //optional, do not print anything into terminal. do not set it when you are still debugging.
	};
	new proxy.proxyServer(options);
});
