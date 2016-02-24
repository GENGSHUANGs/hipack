import webpack from 'webpack';
import config from './webpack.config';
import run from './run';
import clean from './clean';
import copy from './copy';
import WebpackDevServer from 'webpack-dev-server';
import webpackDevMiddleware from 'webpack-dev-middleware';

async function start(){
	await run(clean);
	await run(copy.bind(undefined, { watch: true }));

	await new Promise((resolve,reject)=>{
		let compiler = webpack(config);
		let server = new WebpackDevServer(compiler,{
			hot:true,
			stats: { colors: true },
		});
		server.listen(5000,function(){
			console.log(' --------------- ',arguments);
		});
	});
}

export default start;
