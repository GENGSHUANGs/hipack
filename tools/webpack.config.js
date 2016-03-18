/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import merge from 'lodash.merge';
import AssetsPlugin from 'assets-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import colors from 'colors';

const modulePath = path.resolve(global.cwd, 'node_modules/');
let symbolicLinks = fs.readdirSync(modulePath)
.map(name => path.join(modulePath,name))
.filter((fpath) => fs.lstatSync(fpath).isSymbolicLink())
.map(fpath => fs.realpathSync(fpath));
console.log(colors.green('symbolic links in node_mobules are :'));
symbolicLinks.forEach(fpath => console.log(colors.green(fpath)));


const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1',
];
const GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	__DEV__: DEBUG,
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {
	output: {
		publicPath: '',
		sourcePrefix: '  ',
	},

	cache: DEBUG,
	debug: DEBUG,

	stats: {
		colors: true,
		reasons: DEBUG,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
	],

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: [
					path.resolve(global.cwd, 'node_modules/react-routing/src/'),
					path.resolve(global.cwd, 'src/'),
					... symbolicLinks,
				],
				loader: 'babel-loader'
			}, {
				test: /\.scss$/,
				include:[path.resolve(global.cwd, 'src/'),...symbolicLinks],
				// loader: ExtractTextPlugin.extract(
				// 	'isomorphic-style-loader',
				// 	'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') + ('modules&localIdentName=' + (DEBUG ? '[name]_[local]_[hash:base64:3]' : 'c[hash:base64:3]')),
				// 	'postcss-loader',
				// 	'style-loader',
				// ),
				loaders: [
					'isomorphic-style-loader',
					'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') + ('modules&localIdentName=' + (DEBUG ? '[name]_[local]_[hash:base64:3]' : 'hi[hash:base64:3]')),
					'postcss-loader',
				],
			}, {
				test: /\.json$/,
				include:[path.resolve(global.cwd, 'src/'),...symbolicLinks],
				loader: 'json-loader',
			}, {
				test: /\.txt$/,
				include:[path.resolve(global.cwd, 'src/'),...symbolicLinks],
				loader: 'raw-loader',
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				include:[path.resolve(global.cwd, 'src/'),...symbolicLinks],
				loader: 'url-loader?limit=10000',
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
				include:[path.resolve(global.cwd, 'src/'),...symbolicLinks],
				loader: 'file-loader',
			},
		],
	},

	postcss: function plugins(bundler) {
		return [
			require('postcss-import')({ addDependencyTo: bundler }),
			require('precss')(),
			require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
		];
	},
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = merge({}, config, {
	entry: [path.join(global.cwd,'src/client.js')],
	output: {
		path: path.join(global.cwd, 'build/'),
		filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
	},

	// Choose a developer tool to enhance debugging
	// http://webpack.github.io/docs/configuration.html#devtool
	devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new ExtractTextPlugin(DEBUG ? '[name].css?[hash]' : '[name].[hash].css',{
			remove:true
		}),
		new AssetsPlugin({
			path: path.join(global.cwd, 'build/'),
			filename: 'assets.js',
			processOutput: x => `module.exports = ${JSON.stringify(x)};`,
		}),
		new HtmlWebpackPlugin({
			inject:'body',
			showErrors:DEBUG,
			template:path.join(global.cwd,'src/index.html'),
			minify:{
				removeComments:!DEBUG,
				removeCommentsFromCDATA:!DEBUG,
				removeCDATASectionsFromCDATA:!DEBUG,
				collapseWhitespace:true,
				conservativeCollapse:true,
				preserveLineBreaks:DEBUG,
				collapseBooleanAttributes:true,
				removeTagWhitespace:true,
				removeAttributeQuotes:true,
				removeRedundantAttributes:true,
				preventAttributesEscaping:true,
				useShortDoctype:true,
				removeEmptyAttributes:false,
				removeScriptTypeAttributes:true,
				removeStyleLinkTypeAttributes:true,
				removeOptionalTags:false,
				removeEmptyElements:false,
				caseSensitive:true,
				minifyJS:!DEBUG,
				minifyCSS:!DEBUG,
				minifyURLs:true,
			},
		}),
		...(!DEBUG ? [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
					screw_ie8: true,

					// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
					warnings: VERBOSE,
				},
			}),
			new webpack.optimize.AggressiveMergingPlugin(),
		] : []),
	],
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
	entry: path.join(global.cwd,'src/server.js'),
	output: {
		path: path.join(global.cwd,'build/'),
		filename: 'server.js',
		libraryTarget: 'commonjs2',
	},
	target: 'node',
	externals: [
		/^\.\/assets$/,
		function filter(context, request, cb) {
			const isExternal =
				request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
				!request.match(/^react-routing/) &&
				!context.match(/[\\/]react-routing/);
			cb(null, Boolean(isExternal));
		},
	],
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.BannerPlugin('require("source-map-support").install();',
			{ raw: true, entryOnly: false }),
	],
});

export default [clientConfig, serverConfig];
