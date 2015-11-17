var gulp   = require('gulp');
var lambda = require('gulp-awslambda');
var zip    = require('gulp-zip');

gulp.task('default', function() {
  return gulp.src('index.js')
    .pipe(zip('archive.zip'))
    .pipe(lambda('gotandajs-slack', { region: 'ap-northeast-1' }))
    .pipe(gulp.dest('.'));
});
