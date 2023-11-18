const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

const terser = require("gulp-terser-js");

function css(done) {
  //identificar el archivo de entrada sass
  src("src/scss/**/*app.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) //compilar el archivo sass
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(".")) //guardar el archivo css compilado
    .pipe(dest("build/css")); //guardar el archivo css compilado
  done(); //callback
}

function versionWebp(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{jpg,png}").pipe(webp(opciones)).pipe(dest("build/img"));

  done();
}

function versionAvif(done) {
  const opciones = {
    quality: 50,
  };
  src("src/img/**/*.{jpg,png}").pipe(avif(opciones)).pipe(dest("build/img"));

  done();
}

function imagenes(done) {
  const opciones = {
    optimizationLevel: 3,
  };

  src("src/img/**/*.{jpg,png}")
    .pipe(cache(imagemin(opciones)))
    .pipe(dest("build/img"));

  done();
}

function javascript(done) {
  src("src/js/**/*.js")
  .pipe(sourcemaps.init())
  .pipe(terser())
  .pipe(sourcemaps.write("."))
  .pipe(dest("build/js"));

  done();
}

function dev(done) {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);

  done();
}

exports.css = css; //exportar la funcion css
exports.js = javascript; //exportar la funcion css
exports.imagenes = imagenes; //exportar la funcion imagenes
exports.versionWebp = versionWebp; //exportar la funcion versionWebp
exports.versionWebp = versionAvif; //exportar la funcion versionWebp
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev); //exportar la funcion dev
