var gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    es6Path = 'src/**/*',
    es5Path = 'compiled',
    es5ClearPath = 'compiled/',
    compilePath = 'compiled/**/*.{js,es6}';


gulp.task('clean', function() {
    return gulp.src(es5ClearPath, {read: false})
        .pipe(clean({
            force: true
        }));
});
gulp.task('copy', ['clean'], function() {
    return gulp.src(es6Path)
        // Perform minification tasks, etc here
        .pipe(gulp.dest(es5Path));
});

gulp.task('traceur',['copy'], function () {

    gulp.src([compilePath, '!compiled/node_modules/**'])
        .pipe(babel({ stage:0, optional: ["es7.decorators","es7.asyncFunctions","runtime"] }))
        .pipe(gulp.dest(es5Path));
});

gulp.task('watch', function() {
    gulp.watch([es6Path], ['traceur']);
});

gulp.task('default', ['traceur','watch']);