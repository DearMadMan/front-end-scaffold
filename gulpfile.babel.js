import gulp from 'gulp'
import browserSync from 'browser-sync'
import gulpLoadPlugins from 'gulp-load-plugins'
import config from './config.json'
import gih from 'gulp-include-html'
import del from 'del'

const $ = gulpLoadPlugins()
const bs = browserSync.create()
const reload = bs.reload;

gulp.task('js', () => {
    return gulp.src(config.dirs.src.js + "/**/*.js")
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(config.dirs.build.js))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('scss', () => {
    return gulp.src(config.dirs.src.scss + "/**/*.scss")
               .pipe($.plumber())
               .pipe($.sourcemaps.init())
               .pipe($.sass.sync().on('error',$.sass.logError))
               .pipe($.autoprefixer({
                    browsers: ['last 3 versions']
                }))
               .pipe($.sourcemaps.write())
               .pipe(gulp.dest(config.dirs.build.css))
               .pipe(reload({
                stream: true
                }))
})

gulp.task('jsx', () => {
    return gulp.src(config.dirs.src.components + "/**/*.jsx")
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest(config.dirs.build.components))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('html', () => {
    return gulp.src(config.dirs.src.target + "/*.html")
        .pipe($.plumber())
        .pipe(gih({
            baseDir: config.dirs.src.templates + "/common"
        }))
        .pipe(gulp.dest(config.dirs.build.target))
})

gulp.task('template', () => {
    return gulp.src(config.dirs.src.templates + "/**/*.tpl")
        .pipe($.plumber())
        .pipe($.tmod({
            base: config.dirs.src.templates,
            combo: true,
            output: config.dirs.build.target
        }))
        .pipe(reload({
            stream: true
        }))
})

gulp.task('serve', ['move', 'template', 'html', 'scss', 'jsx', 'js'], () => {
    bs.init({
        port: 9000,
        index: 'home.html',
        server: {
            baseDir: config.dirs.build.target
        }
    })
    gulp.watch(config.dirs.src.js + "/**/*.js", ['js'])
    gulp.watch(config.dirs.src.components + "/**/*.jsx", ['jsx'])
    gulp.watch(config.dirs.src.templates + "/**/*.tpl", ['template'])

    gulp.watch(config.dirs.build.target + "/**/*.js").on('change', reload)
})

gulp.task('move', () => {

})

gulp.task('default', ['serve'], () => {


})

gulp.task('clean', () => {
    del.sync(config.dirs.build.target)
})
