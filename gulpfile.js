var gulp = require('gulp'),
    babel = require('gulp-babel');


gulp.task('traceur', function () {

    var includeFolders = [
        "apey-eye",
        "test",
        "example"
    ];

    includeFolders.forEach(function(folder){
        gulp.src(["./"+folder+"/**/*"])
            .pipe(babel({
                stage: 0,
                optional: ["es7.decorators", "es7.asyncFunctions", "runtime"]
            }))
            .pipe(gulp.dest("build/"+folder));
    })

});

gulp.task('watch', function () {
    gulp.watch([es6Path], ['traceur']);
});

gulp.task('default', ['traceur']);