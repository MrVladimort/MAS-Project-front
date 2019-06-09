const gulp = require("gulp");
const sass = require("gulp-sass");
const minifyCSS = require("gulp-clean-css");
const concat = require("gulp-concat");

const SCSS_SRC = "./src/assets/scss/**/*.scss";
const SCSS_DEST = "./src/assets/css";

gulp.task("compile_scss", () => gulp.src(SCSS_SRC)
  .pipe(sass().on("error", sass.logError))
  .pipe(minifyCSS())
  .pipe(concat("default.min.css"))
  .pipe(gulp.dest(SCSS_DEST)));

gulp.task("watch_scss", () => gulp.watch(SCSS_SRC, ["compile_scss"]));

gulp.task("default", ["watch_scss"]);
