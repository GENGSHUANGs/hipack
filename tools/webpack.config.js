/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
const clientConfig = {
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

	entry: path.join(__dirname,'../src/client.js'),
	output: {
		path: path.join(__dirname,'../build/'),
		filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
		publicPath:'./'
	},

	// Choose a developer tool to enhance debugging
	// http://webpack.github.io/docs/configuration.html#devtool
	devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.optimize.OccurenceOrderPlugin(),
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
		new HtmlWebpackPlugin({
			inject:'body',
			showErrors:DEBUG,
			template:'./src/index.html',
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
	],

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},

	module: {
		loaders: [
			{
				test: /\.js?$/,
				include: [
					path.resolve(__dirname, '../node_modules/react-routing/src'),
					path.resolve(__dirname, '../src'),
				],
				loader: 'babel-loader',
			}, {
				test: /\.scss$/,
				loaders: [
					'isomorphic-style-loader',
					`css-loader?${DEBUG ? 'sourceMap&' : 'minimize&'}modules&localIdentName=` +
					`${DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]'}`,
					'postcss-loader?parser=postcss-scss',]
			},{
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.txt$/,
				loader: 'raw-loader',
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'url-loader?limit=10000',
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
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

export default clientConfig;
