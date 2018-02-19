﻿
//gulp
let 
	gulp = require('gulp'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	header = require("gulp-header"),
	gzip = require('gulp-gzip'),
	clean = require('gulp-clean'),
	dateFormat = require('dateformat'),
	pkgInfo = require(pkgFile = './package'),
	sass = require('gulp-sass'),
	consolidate = require('gulp-consolidate'),
	iconfont = require('gulp-iconfont')
;

//gulp common config options
let gulpCfg = {
	scssDestRoot: "../../src/scss/",
	scssDest: "../../src/scss/matrioshka.css",
	distFileName:"matrioshka.min.css",
	distFileDestination:"../../dist/css/",
	distTarBallDestinationPrefix:"tar/",
	distMinDestinationPrefix:"min/",
	descriptionHeader:`
	/*
	Matrioshka. 
	${pkgInfo.description}
	Source code: https://github.com/rus-bit/Matrioshka
	Home: https://rus-bit.com/matrioshka/
	Version: ${ pkgInfo.version }
	Build date ${dateFormat(new Date(), "yyyy.mm.dd hh:MM")}
	License:Apache License Version 2.0
	Copyright (c) 2018 RusBit LTD
	Author: ${ pkgInfo.author }
	*/
	`,
	sourceFilesOrig:['*.css','*.css.map'],
};

console.log('\x1Bc');

gulp.task('clean', ()=> {
	return gulp.src(`${gulpCfg.distFileDestination}*`)
		.pipe(clean({force: true}));
});

gulp.task('copy_orig', ()=> {
	return gulp.src(`../../src/scss/${gulpCfg.sourceFilesOrig[0]}`).pipe(gulp.dest(`${gulpCfg.distFileDestination}`));
});

gulp.task('sass', () => {
	return gulp.src(`${gulpCfg.scssDestRoot}*.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(`${gulpCfg.scssDestRoot}`))
	;
});

gulp.task('css', () => {
	return gulp.src(gulpCfg.scssDest)
		.pipe(cleanCSS())
		.pipe(header(gulpCfg.descriptionHeader))
		.pipe(rename(gulpCfg.distFileName))
		.pipe(gulp.dest(`${gulpCfg.distFileDestination}${gulpCfg.distMinDestinationPrefix}`));
});

gulp.task('css-colors', () => {
	return gulp.src("../../src/scss/matrioshka.colors.css")
		.pipe(cleanCSS())
		.pipe(header(gulpCfg.descriptionHeader))
		.pipe(rename("matrioshka.colors.min.css"))
		.pipe(gulp.dest(`${gulpCfg.distFileDestination}${gulpCfg.distMinDestinationPrefix}`));
});

gulp.task('tarball', () => {

	gzip({ 
		append: true,
		gzipOptions: { level: 9 }
	});

	return gulp.src(`${gulpCfg.distFileDestination}${gulpCfg.distMinDestinationPrefix}${gulpCfg.distFileName}`)
		.pipe(gzip())
		.pipe(gulp.dest(`${gulpCfg.distFileDestination}${gulpCfg.distTarBallDestinationPrefix}`));
});

gulp.task('tarball-colors', () => {

	gzip({ 
		append: true,
		gzipOptions: { level: 9 }
	});

	return gulp.src(`${gulpCfg.distFileDestination}${gulpCfg.distMinDestinationPrefix}matrioshka.colors.min.css`)
		.pipe(gzip())
		.pipe(gulp.dest(`${gulpCfg.distFileDestination}${gulpCfg.distTarBallDestinationPrefix}`));
});

gulp.task('iconfont', function () {
	
	return gulp.src('../../src/icons/svg/*.svg')
		 .pipe(iconfont({
			 fontName: 'iconfont',
			 formats: ['ttf', 'eot', 'woff', 'woff2','svg'],
			 appendCodepoints: true,
			 appendUnicode: false,
			 normalize: true,
			 fontHeight: 1001,
			 centerHorizontally: true
		 }))
		 .on('glyphs', function (glyphs, options) {
			 gulp.src('../../dist/icons/css/iconfont.css')
				 .pipe(consolidate('underscore', {
					 glyphs: glyphs,
					 fontName: options.fontName,
					 fontDate: new Date().getTime()
				 }))
				 .pipe(gulp.dest('../../dist/icons/css/'));
 
			 gulp.src('../../dist/icons/index.html')
				 .pipe(consolidate('underscore', {
					 glyphs: glyphs,
					 fontName: options.fontName
				 }))
				 .pipe(gulp.dest('../../dist/icons/'));
		 })
		 .pipe(gulp.dest('../../dist/icons/fonts/'));
 });


gulp.task('default', gulp.series([
	'clean', 
	'sass',
	'css',
	'css-colors',
	'tarball',
	'tarball-colors',
	'copy_orig'
]));
