/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fetch from './core/fetch';
import Box from './component/Box';
let s = require('./index.scss');

async function run(){
	ReactDOM.render(<Box />,document.getElementById('app'));
	let resp = await fetch('./assets/test.json');
	console.log('test.json >:',await resp.json());
}

if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
	run();
} else {
	document.addEventListener('DOMContentLoaded', run, false);
}
