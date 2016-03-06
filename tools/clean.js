/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import del from 'del';
import fs from './lib/fs';
import path from 'path';
/**
 * Cleans up the output (build) directory.
 */
async function clean() {
	await del([path.join(global.cwd,'.tmp'), path.join(global.cwd,'build/*'), path.join(global.cwd,'!build/.git')], { dot: true ,force:true});
	await fs.makeDir(path.join(global.cwd,'build/assets'));
}

export default clean;
