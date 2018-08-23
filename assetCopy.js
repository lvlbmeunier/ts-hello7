/**
 * This script is to copy asset files (json, yaml, png, etc...) from the src
 * to dist directories at build time, to preserve the functioning of relative
 * paths.
 *
 * ie. the following code would continue to work in a ts file under `src`
 *
 * import * as config from '../config.json'
 */

'use strict';

const fs = require('fs');
const path = require('path');
const base = path.resolve();

const isDirectory = path => fs.statSync(path).isDirectory();

const ensurePath = filepath => {
  const relativeFilepath = filepath.split(base)[1];
  const relativeDirs = relativeFilepath.split(path.sep);
  relativeDirs.shift();
  relativeDirs.pop();

  for (let i = 0; i < relativeDirs.length; i++) {
    const dir = relativeDirs.slice(0, i + 1).join(path.sep);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log('created directory:', dir);
    }
  }
};

const copyAssetsFromPath = pathname => {
  const globalPath = path.resolve(pathname);

  const files = fs.readdirSync(globalPath);

  for (const file of files) {
    const fpath = path.resolve(globalPath, file);

    if (isDirectory(fpath)) {
      copyAssetsFromPath(fpath);
    } else if (!/\.(js|ts|gitkeep)$/.test(file)) {
      const target = fpath.replace(`${path.sep}src${path.sep}`, `${path.sep}dist${path.sep}`);
      ensurePath(target);
      fs.copyFileSync(fpath, target);
      console.log(`copied: .${fpath.split(base)[1]} -> .${target.split(base)[1]}`);
    }
  }
};

copyAssetsFromPath('src');

console.log('\nassets copied successfully\n');
