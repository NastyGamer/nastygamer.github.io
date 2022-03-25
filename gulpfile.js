const { parallel, task, src, dest, watch } = require("gulp");
const pandoc = require("gulp-pandoc");
const sass = require("gulp-sass")(require("sass"));
const ts = require("gulp-typescript");

task("md", async () => {
	src("src/markdown/*.md")
		.pipe(pandoc({
			from: "markdown+raw_html-markdown_in_html_blocks",
			to: "html5",
			ext: ".html",
			args: ["--mathjax", "--standalone"]
		}).on("error", (error) => { console.log(error); }))
		.pipe(dest("dist/html"));
});

task("scss", async () => {
	src("src/scss/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(dest("dist/css"));
});

task("ts", async () => {
	const project = ts.createProject("tsconfig.json");
	src("src/typescript/*.ts")
		.pipe(project().on("error", (error) => { console.log(error); }))
		.pipe(dest("dist/javascript"));
});

task("watch", () => { 
	watch(["src/scss/*.scss"], task("scss"));
	watch(["src/typescript/*.ts"], task("ts"));
	watch(["src/markdown/*.md"], task("md"));
});

exports.default = parallel(task("scss"), task("ts"), task("md"));