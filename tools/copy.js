/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import gaze from 'gaze';
import replace from 'replace';
import Promise from 'bluebird';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
async function copy({ watch } = {}) {
	const ncp = Promise.promisify(require('ncp'));

	await Promise.all([
		ncp(path.join(global.cwd,'src/assets/'), path.join(global.cwd,'build/assets/')),
		// ncp('src/content', 'build/content'),
		ncp(path.join(global.cwd,'package.json'), path.join(global.cwd,'build/package.json')),
	]);

	replace({
		regex: '"start".*',
		replacement: '"start": "node server.js"',
		paths: [path.join(global.cwd,'build/package.json')],
		recursive: false,
		silent: false,
	});

	if (watch) {
		const watcher = await new Promise((resolve, reject) => {
			gaze(path.join(global.cwd,'src/assets/**/*.*'), (err, val) => err ? reject(err) : resolve(val));
		});
		watcher.on('changed', async (file) => {
			const relPath = file.substr(path.join(global.cwd, 'src/assets/').length);
			await ncp(path.join(global.cwd,`src/assets/${relPath}`), path.join(global.cwd,`build/assets/${relPath}`));
		});
	}
}

export default copy;
