/**
 * @file  gulp文件
 * @author  Torry Lin
 */

/* eslint-env node */
var gulp = require('gulp');

// 引入组件
var less = require('gulp-less');            // less
var minifycss = require('gulp-minify-css'); // CSS压缩
var uglify = require('gulp-uglify');        // js压缩
var concat = require('gulp-concat');        // 合并文件
var rename = require('gulp-rename');        // 重命名
var clean = require('gulp-clean');          // 清空文件夹
var connect = require('gulp-connect');

// 服务器
gulp.task('connect', function () {
    connect.server({
        root: ['app', './'],
        livereload: true,
        port: 9000
    });
});

// 合并、压缩、重命名css
gulp.task('stylesheets', function() {
    // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
    gulp.src(['./app/css/*.css'])
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./app/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./app/css'));
});

// 合并，压缩js文件
gulp.task('javascripts', function() {
    gulp.src('./app/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./app/build/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./javis/static/build/js'));
});

// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src(
        ['./app/css/all.css', './app/css/all.min.css'],
        {read: false}
    ).pipe(clean({force: true}));
});

// 将bower的库文件复制到指定位置
gulp.task('copy',function () {
    gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
        .pipe(gulp.dest('./app/js/lib/'));

    gulp.src('./bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./app/js/lib/'));

    // --------------------------css-------------------------------------å
    gulp.src('./bower_components/bootstrap/fonts/*')
        .pipe(gulp.dest('./app/css/fonts/'));

    gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./app/css/lib/'));

});

gulp.task('watch', function () {
    gulp.watch(['./app/*.html'], ['reload']);
});

gulp.task('reload', function () {
    gulp.src('./app/*.html')
        .pipe(connect.reload());
});

// 定义develop任务在日常开发中使用
gulp.task('develop', ['copy', 'javascripts', 'stylesheets']);

// 定义一个prod任务作为发布或者运行时使用
gulp.task('prod',['copy', 'stylesheets', 'javascripts']);

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default',['clean', 'develop', 'connect', 'watch']);
