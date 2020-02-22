const { src, dest, parallel, watch } = require("gulp");
const autoprefixer = require('autoprefixer');
const concat = require("gulp-concat");
const merge = require("merge-stream");
const minifyCSS = require("gulp-csso");
const minimist = require('minimist');
const package = require("./package.json");
const postcss = require('gulp-postcss');
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const path = require("path");

const argv = minimist(process.argv.slice(2));
const env = argv.env || "development";
const writeSourcemap = env === "development";
const destDir = argv.dest || "dist";

const photoSwipeDir = path.dirname(require.resolve("photoswipe"));

const cssSources = [
    "style/**/*.scss",
    "!style/admin/**/*.scss"
];

const jsSources = [
    `${photoSwipeDir}/photoswipe.js`,
    `${photoSwipeDir}/photoswipe-ui-default.js`,
    "js/**/*.js",
    "!js/admin/**/*.js"
];

const phpSources = [
    "src/**/*.php"
];

const assetSources = [
    `${photoSwipeDir}/default-skin/default-skin.png`,
    `${photoSwipeDir}/default-skin/default-skin.svg`,
    `${photoSwipeDir}/default-skin/preloader.gif`
];

function css() {
    let streamCSS = src([
        `${photoSwipeDir}/photoswipe.css`,
        `${photoSwipeDir}/default-skin/default-skin.css`
    ]);

    let streamSCSS = src("style/style.scss");

    if (writeSourcemap) {
        streamCSS = streamCSS.pipe(sourcemaps.init());
        streamSCSS = streamSCSS.pipe(sourcemaps.init());
    }

    streamSCSS = merge(streamCSS, streamSCSS)
        .pipe(sass())
        .pipe(concat("style.css"))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(minifyCSS());
    
    if (writeSourcemap)
        streamSCSS = streamSCSS.pipe(sourcemaps.write("./"));

    return streamSCSS.pipe(dest(destDir));
}

function js() {
    let stream = src(jsSources);

    if (writeSourcemap)
        stream = stream.pipe(sourcemaps.init());

    stream = stream
        .pipe(concat("index.js"))
        .pipe(uglify());

    if (writeSourcemap)
        stream = stream.pipe(sourcemaps.write("./"));

    return stream.pipe(dest(destDir));
}

function php() {
    return src(phpSources)
        .pipe(replace("{{version}}", package.version))
        .pipe(dest(destDir));
}

function assets() {
    return src(assetSources)
        .pipe(dest(destDir));
}

const tasks = [
    { task: css, source: cssSources },
    { task: js, source: jsSources },
    { task: php, source: phpSources },
    { task: assets, source: assetSources }
];

// Export tasks and build global task
const taskFunctions = [];
const watchTaskFunctions = [];

for (let task of tasks) {
    exports[task.task.name] = task.task;
    taskFunctions.push(task.task);

    const watchTask = function () {
        return watch(task.source, task.task);
    };

    Object.defineProperty(watchTask, "name", { value: task.task.name + ":watch" });
    exports[task.task.name + ":watch"] = watchTask;
    watchTaskFunctions.push(watchTask);
}

exports.default = parallel.apply(null, taskFunctions);
exports.watch = parallel.apply(null, watchTaskFunctions);
