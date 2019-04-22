//
// gulpfile js
//
// the gulpfile to autogenerate minimized js
// convery scss to css
//
// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
//
// @license: MIT
//
// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
// variables

const supported = [
  '>0.2%',
  'ie >= 10',
  'not op_mini all',
];

const babelpreset = {
  presets: ['@babel/preset-env'],
  compact: false,
};

const nanoRules = {
  autoprefixer: {
    browsers: supported,
    add: true,
  },
};

// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -

const {
  src, dest, lastRun, series, watch,
} = require('gulp');

const babel = require('gulp-babel');
const cssNano = require('gulp-cssnano');
const del = require('del');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');


const paths = {
  dist: {
    css: './assets/css',
    js: './assets/js',
  },
  build: {
    scss: './aria.accordion.scss',
    js: './aria.accordion.js',
  },
};


// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
// functions

function onError(err) {
  console.log('An error occured:', err.message);
  this.emit('end');
}

function clean() {
  return del(['assets']);
}

function doSass() {
  return src(paths.build.scss, { sourcemaps: true })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssNano(nanoRules))
    .pipe(dest(paths.dist.css, { sourcemaps: '.' }));
}

function doJs() {
  return src(paths.build.js, { sourcemaps: true, since: lastRun(doJs) })
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel(babelpreset))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.dist.js, { sourcemaps: '.' }));
}

function update() {
  watch(paths.build.scss, doSass);
  watch(paths.build.js, doJs);
}

// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
//

const build = series(
  clean,
  doSass,
  doJs,
  update,
);

// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
//

exports.clean = clean;
exports.sass = doSass;
exports.js = doJs;

exports.default = build;

// = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = - = -
// fin
//
