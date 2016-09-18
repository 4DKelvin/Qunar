var walk = require('./gulp-walk'),
    gulp = require('gulp'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    html = require('gulp-htmlmin'),
    string = require('gulp-inject-string'),
    base64 = require('gulp-base64'),
    sass = require('gulp-sass'),
    nodemon = require("gulp-nodemon"),
    del = require('del'),
    gulpif = require('gulp-if'),
    build = process.argv[process.argv.length - 1] != 'serve',
    dir = {
        source: './assets',
        dist: build ? './dist' : './serve'
    },
    buildHtml = function () {
        walk(path.join(dir.source + '/views')).then(function (results) {
            results.forEach(function (file) {
                var key = file.replace(path.join(dir.source + '/views'), '');

                if (key.indexOf('.html') != -1) {
                    gulp.src([
                        path.join(dir.source + '/header.html'),
                        path.join(dir.source + '/views' + key),
                        path.join(dir.source + '/footer.html'),
                        path.join(dir.source + '/views' + key.replace('.html', '.js'))
                    ])
                        .pipe(concat(key))
                        .pipe(string.after('<!-- inject:js --><!-- endinject -->', '<script type="text/javascript">'))
                        .pipe(string.append('</script></body></html>'))
                        .pipe(inject(gulp.src([path.join(dir.dist + '/js/*.js'), path.join(dir.dist + '/css/*.css')], {read: false}), {baseDir: path.join(dir.dist)}))
                        .pipe(string.replace('/' + path.join(dir.dist) + '/', ''))
                        .pipe(gulpif(build, html({
                            removeComments: true,  //清除HTML注释
                            collapseWhitespace: true,  //压缩HTML
                            collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
                            removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
                            removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
                            removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
                            minifyJS: true,  //压缩页面JS
                            minifyCSS: true  //压缩页面CSS
                        })))
                        .pipe(gulp.dest(path.join(dir.dist)))
                }
            });
        });
    };


gulp.task('serve', ['default'], function () {
    gulp.watch(path.join(dir.source + '/stylesheets/*.scss'), ['graphics', 'html']);
    gulp.watch(path.join(dir.source + '/javascripts/*.js'), ['structure', 'html']);
    gulp.watch(path.join(dir.source + '/libraries/*.js'), ['scripts', 'html']);
    gulp.watch(path.join(dir.source + '/libraries/*.css'), ['styles', 'html']);
    gulp.watch(path.join(dir.source + '/**/*.html'), ['html']);
    gulp.watch(path.join(dir.source + '/**/*.js'), ['html']);
    return nodemon({
        script: 'gulp-serve.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('clean', function () {
    return del(path.join(dir.dist + '/*'));
});

gulp.task('graphics', function () {
    return gulp.src(path.join(dir.source + '/stylesheets/*.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(base64({baseDir: path.join(dir.source)}))
        .pipe(gulpif(build, concat('dingding.css')))
        .pipe(gulpif(build, minify()))
        .pipe(gulpif(build, rev()))
        .pipe(gulp.dest(path.join(dir.dist + '/css')));
});
gulp.task('structure', function () {
    return gulp.src(path.join(dir.source + '/javascripts/*.js'))
        .pipe(gulpif(build, concat('dingding.js')))
        .pipe(gulpif(build, uglify()))
        .pipe(gulpif(build, rev()))
        .pipe(gulp.dest(path.join(dir.dist + '/js')));
});

//gulp.task('scripts', function () {
//    return gulp.src(path.join(dir.source + '/libraries/*.js'))
//        .pipe(gulpif(build, concat('app-library.js')))
//        .pipe(gulpif(build, uglify()))
//        .pipe(gulpif(build, rev()))
//        .pipe(gulp.dest(path.join(dir.dist + '/js')));
//});
//gulp.task('styles', function () {
//    return gulp.src(path.join(dir.source + '/libraries/*.css'))
//        .pipe(gulpif(build, concat('app-library.css')))
//        .pipe(gulpif(build, minify()))
//        .pipe(gulpif(build, rev()))
//        .pipe(gulp.dest(path.join(dir.dist + '/css')));
//});

gulp.task('html', buildHtml);

gulp.task('default', ['clean', 'structure', 'graphics'/*, 'scripts', 'styles'*/], buildHtml);
