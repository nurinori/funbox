"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    minify = require("gulp-csso"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    webp = require("gulp-webp"),
    posthtml = require("gulp-posthtml"),
    del = require("del"),
    server = require("browser-sync").create(),
    run = require("run-sequence"),
    uglify = require('gulp-uglifyjs'),
    reporter = require('postcss-reporter'),
    syntax_scss = require('postcss-scss');

gulp.task("scss-lint", function() {
  var stylelintConfig = {
    "extends": "stylelint-config-htmlacademy",
  }
  var processors = [
    stylelint(stylelintConfig),
    reporter({
     })
  ];

  return gulp.src(
      ["source/sass/**/*.scss"]
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
  });

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe((imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
      loops: 4,
      min: 65,
      max: 85,
      quality:'high'
      })
      ], {
      verbose: true
      })))
    .pipe(gulp.dest("build/img"));
});

gulp.task("scripts", function() {
  return gulp.src(["source/js/*.js"])
    .pipe(uglify())
    .pipe(rename("build.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/js/*.js", ["scripts"]);
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/**/*.html"
  ], {
    base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", function (done) {
  run("clean", "copy", "style", "webp", "images", "scripts", "html", done);
});
