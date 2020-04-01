/**
 * https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
 *
 */

var gulp = require( 'gulp' ),
  concat = require( 'gulp-concat' ),
  terser = require( 'gulp-terser-js' ),
  cleanCSS = require( 'gulp-clean-css' ),
  browsersync = require( 'browser-sync' ).create();

// BrowserSync
// function browserSync( done ) {
//   browsersync.init( {
//     server: {
//       baseDir: './'
//     },
//     port: 3000
//   } );
//   done();
// }

// BrowserSync Reload
// function browserSyncReload( done ) {
//   browsersync.reload();
//   done();
// }

function styles() {
  return gulp.src( [

    './app/src/css/*.css',

    // './src/css/0_0_variables.css',
    // './src/css/1_0_reset-normalize.css',
    // './src/css/1_1_reset.css',
    // './src/css/2_0_typography.css',
    // './src/css/2_1_spacing.css',
    // './src/css/2_2_color.css',
    // './src/css/3_0_utilities.css',
    // './src/css/4_0_components.css',
    // './src/css/5_0_overrides.css',
    // './src/css/9_0_leaflet.css',

  ] )
    .pipe( concat( 'v.min.css' ) )
    .pipe( cleanCSS() )
    .pipe( gulp.dest( './app/dist' ) )
    .pipe( browsersync.stream() );
}

function scripts() {
  return gulp.src( [
    './app/src/vcore/**/*.js',
    './app/src/theme/**/*.js',
    './app/src/plugins/**/*.js',
  ] )
    .pipe( concat( 'v.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false
      }
    } ) )
    .pipe( gulp.dest( './app/dist' ) )
    .pipe( browsersync.stream() );
}

function watchFiles() {
  gulp.watch( './app/src/vcore/**/*.js', scripts );
  gulp.watch( './app/src/plugins/**/*.js', scripts );
  gulp.watch( './app/src/theme/**/*.js', scripts );
  gulp.watch( './app/src/css/*.css', styles );
}

gulp.task( 'default', gulp.series( scripts, styles, /* watchFiles */ ) );
