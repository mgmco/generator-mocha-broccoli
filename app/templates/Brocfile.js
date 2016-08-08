'use strict';

const Autoprefixer = require('broccoli-autoprefixer');
const browserify = require('broccoli-browserify');
const CssOptimizer = require('broccoli-csso');
const LiveReload = require('broccoli-inject-livereload');
const makeModules = require('broccoli-es6-module-filter');
const Merge = require('broccoli-merge-trees');
const Sass = require('broccoli-sass-source-maps');
const rename = require('broccoli-stew').rename;

let pubFiles = new LiveReload('public');

if (process.env.EMBER_ENV === 'production') {
  pubFiles = 'public';
}

const stylePaths = [
  'styles',
  'node_modules/normalize-css',
  'node_modules/font-awesome/scss',
  'node_modules/yoga-sass/assets',
];

var modules = makeModules('src', {
  moduleType: 'cjs',
  compatFix: true
});

const js = browserify(modules, {
  entries: ['./index.js'],
  outputFile: 'app.js'
});

const compiledSass = new Sass(stylePaths, 'app.scss', 'app.css', {});
const optimizedCSS = new CssOptimizer(compiledSass);
const styles = new Autoprefixer(optimizedCSS);

if (process.env.EMBER_ENV === 'test') {
  const testTree = rename('tests', 'index.html', 'test.html');

  const testJs = Concat(testTree, {
    inputFiles: ['**/*.js'],
    outputFile: '/tests.js',
  });

  const testHTML = new Funnel(testTree, {
    files: ['test.html'],
  });

  module.exports = new Merge([pubFiles, styles, js, testJs, testHTML]);
} else {
  module.exports = new Merge([pubFiles, styles, js]);
}
