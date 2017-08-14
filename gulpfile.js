var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var del = require('del');
var runSequence = require('run-sequence');

var tsProject = ts.createProject('tsconfig.json');
var configJSON = 'config/config.json';

gulp.task('default', () => {
    return runSequence('lint', 'cleanDist', 'build');
});

gulp.task('lint', () => {
    return tsProject.src()
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report());
});

gulp.task('build', () => {
    return gulp.start('buildProject', 'copyAssets');
});

gulp.task('cleanDist', () => {
    return del(['dist/**'], {
        force: true
    });
});

gulp.task('buildProject', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist/'));
});

gulp.task('copyAssets', () => {
    return gulp
        .start('copyConfigJSON');
});

gulp.task('copyConfigJSON', () => {
    return gulp.src(configJSON)
        .pipe(gulp.dest('dist/config/'));
});