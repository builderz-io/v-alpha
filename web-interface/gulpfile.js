/**
 * https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
 *
 */

const gulp = require( 'gulp' ),
  concat = require( 'gulp-concat' ),
  terser = require( 'gulp-terser-js' ),
  cleanCSS = require( 'gulp-clean-css' );
// const gzip = require( 'gulp-gzip' ),
// const browsersync = require( 'browser-sync' ).create();

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

function css() {
  return gulp.src( [

    './app/css/src/*.css',

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
    .pipe( gulp.dest( './app/css/builds' ) );
  // .pipe( browsersync.stream() );
}

// function scripts() {
//   return gulp.src( [
//     './app/src/vcore/**/*.js',
//   //  './app/src/theme/**/*.js',
//   //  './app/src/plugins/**/*.js',
//   ] )
//     .pipe( concat( 'vcore.min.js' ) )
//     .pipe( terser( {
//       mangle: {
//         toplevel: false
//       }
//     } ) )
//     .pipe( gzip() )
//     .pipe( gulp.dest( './app/dist' ) )
//     .pipe( browsersync.stream() );
// }

function vcore() {
  return gulp.src( [
    './app/vcore/dependencies/primary/*.js',
    './app/vcore/src/dom/*.js',
    './app/vcore/src/endpoint/*.js',
    './app/vcore/src/helper/*.js',
    './app/vcore/src/ledger/primary/*.js',
    './app/vcore/src/state/*.js',
    './app/vcore/src/v/*.js',
  ] )
    .pipe( concat( 'vcore.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false
      }
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/vcore/builds' ) );
  // .pipe( browsersync.stream() );
}

function vtheme() {
  return gulp.src( [
    './app/theme/src/**/*.js',
  ] )
    .pipe( concat( 'vtheme.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false
      }
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/theme/builds' ) );
  // .pipe( browsersync.stream() );
}

function vplugins() {
  return gulp.src( [
    './app/plugins/src/**/*.js',
  ] )
    .pipe( concat( 'vplugins.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false
      }
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/plugins/builds' ) );
  // .pipe( browsersync.stream() );
}

function vevm() {
  return gulp.src( [
    './app/vcore/dependencies/secondary/web3.min.js',
    './app/vcore/src/ledger/secondary/v-evm.js',
    './app/vcore/src/ledger/secondary/v-evm-abi.js',
  ] )
    .pipe( concat( 'vevm.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false
      }
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/vcore/builds' ) );
  // .pipe( browsersync.stream() );
}

// function watchFiles() {
//   gulp.watch( './app/src/vcore/**/*.js', scripts );
//   gulp.watch( './app/src/plugins/**/*.js', scripts );
//   gulp.watch( './app/src/theme/**/*.js', scripts );
//   gulp.watch( './app/src/css/*.css', css );
// }

function watchVCore() {
  gulp.watch( './app/vcore/src/**/*.js', vcore );
}

function watchVEvm() {
  gulp.watch( './app/vcore/src/ledger/**/*.js', vtheme );
}

function watchVTheme() {
  gulp.watch( './app/theme/src/**/*.js', vtheme );
}

function watchVPlugins() {
  gulp.watch( './app/plugins/src/**/*.js', vplugins );
}

function watchCss() {
  gulp.watch( './app/css/src/*.css', css );
}

gulp.task( 'default', gulp.parallel(
  gulp.series( vcore, watchVCore ),
  gulp.series( vevm, watchVEvm ),
  gulp.series( vtheme, watchVTheme ),
  gulp.series( vplugins, watchVPlugins ),
  gulp.series( css, watchCss ),
) );

gulp.task( 'css', gulp.series( css, watchCss ) );
gulp.task( 'vcore', gulp.series( vcore, watchVCore ) );
gulp.task( 'vtheme', gulp.series( vtheme, watchVTheme ) );
gulp.task( 'vplugins', gulp.series( vplugins, watchVPlugins ) );
gulp.task( 'vevm', gulp.series( vevm, watchVEvm ) );
