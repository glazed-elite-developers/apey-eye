var gulp = require('gulp'),
    babel = require('gulp-babel');


gulp.task('babel', function () {

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
    var includeFolders = [
        "apey-eye",
        "test",
        "example"
    ];

    includeFolders.forEach(function(folder){
        gulp.watch(["./"+folder+"/**/*"], ['babel']);
    })
});

gulp.task('default', ['babel',"watch"]);