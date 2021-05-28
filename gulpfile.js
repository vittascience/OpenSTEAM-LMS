const gulp = require('gulp');
const clean = require('gulp-clean');
const tasks = require('require-dir')('./gulp');

gulp.task('build', gulp.series(
    tasks.classroomTasks.autoBuild
));