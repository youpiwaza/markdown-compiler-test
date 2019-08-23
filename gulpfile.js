//// Constants

// Plugins ressources
const { dest, parallel, series, src, task, watch } 	= require('gulp'),
  browserSync = require('browser-sync').create(),
  inject      = require('gulp-inject'),
  markdown    = require('gulp-markdown')
;



//// Sub-tasks

// //// With temp html file
// // Convert MD
// task('convert-md', function() {
// 	return src(['src/README.md'])
//     .pipe(markdown())
// 		.pipe(dest('dist/'));
// });
//
// task('update-html', function() {
//   return src('src/index.html')
//     .pipe(inject(src(['dist/README.html']), {
//        starttag: '<!-- inject:mymd -->',
//        transform: function(filepath, file) {
//          return file.contents.toString();
//        }
//     }))
//    .pipe(dest('./dist'))
//    .pipe(browserSync.stream());
// });


// Direct injection, to avoid temp files
task('md-in-html', function() {
  const converted = src(['src/README.md']).pipe(markdown());

  return src('src/index.html')
    .pipe(inject(converted, {
       starttag: '<!-- inject:mymd -->',
       transform: function(filepath, file) {
         return file.contents.toString();
       }
    }))
   .pipe(dest('./dist'))
   .pipe(browserSync.stream());
});


// Create watcher
task('start-watch', function () {
  browserSync.init({
      server: "./dist"
  });

  // Watch every tech
	const watcherMD = watch('src/README.md');

  // Update when necessary
  // watcherMD.on('change', series('convert-md', 'update-html'));
  watcherMD.on('change', parallel('md-in-html'));
});



//// Tasks

// Default tesk, executed when using 'gulp'
//  	Capy all assets to dist
task('default', parallel('md-in-html'));

//  Watch : copy all files, and then update when necessary
task('watch', series('default', 'start-watch'));
