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

function vcore() {
  return gulp.src( [
    './app/vcore/src/v/v-config.js',
    './app/vcore/src/state/v-state.js',
    './app/vcore/src/helper/v-translation.js',
    './app/vcore/dependencies/primary/*.js',
    './app/vcore/src/dom/*.js',
    './app/vcore/src/endpoint/*.js',
    './app/vcore/src/helper/v-debugger.js',
    './app/vcore/src/helper/v-description.js',
    './app/vcore/src/helper/v-helper.js',
    './app/vcore/src/ledger/primary/*.js',
    './app/vcore/src/v/v-key.js',
    './app/vcore/src/v/v-launch.js',
  ] )
    .pipe( concat( 'vcore.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false,
      },
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/vcore/builds' ) );
  // .pipe( browsersync.stream() );
}

function vevm() {
  return gulp.src( [
    './app/vcore/dependencies/secondary/web3.min.js',
    './app/vcore/src/ledger/secondary/v-evm-abi.js',
    './app/vcore/src/ledger/secondary/v-evm.js',
  ] )
    .pipe( concat( 'vevm.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false,
      },
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/vcore/builds' ) );
  // .pipe( browsersync.stream() );
}

function vchat() {
  return gulp.src( [
    './app/vcore/dependencies/secondary/firebase-app.js',
    './app/vcore/dependencies/secondary/firebase-database.js',
    './app/vcore/dependencies/secondary/firebase-chat-init.js',
  ] )
    .pipe( concat( 'vchat.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false,
      },
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
        toplevel: false,
      },
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/theme/builds' ) );
  // .pipe( browsersync.stream() );
}

function vplugins() {
  return gulp.src( [
    './app/plugins/dependencies/leaflet.js',
    './app/plugins/dependencies/jquery-3.6.0.slim.min.js',
    './app/plugins/dependencies/leaflet-locationpicker.js',
    './app/plugins/src/**/*.js',
  ] )
    .pipe( concat( 'vplugins.min.js' ) )
    .pipe( terser( {
      mangle: {
        toplevel: false,
      },
    } ) )
    // .pipe( gzip() )
    .pipe( gulp.dest( './app/plugins/builds' ) );
  // .pipe( browsersync.stream() );
}

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

function watchVCore() {
  gulp.watch( './app/vcore/src/**/*.js', vcore );
}

function watchVEvm() {
  gulp.watch( './app/vcore/src/ledger/secondary/*.js', vevm );
}

function watchVChat() {
  gulp.watch( './app/vcore/src/ledger/secondary/*.js', vchat );
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
  gulp.series( css, watchCss ),
  gulp.series( vcore, watchVCore ),
  gulp.series( vchat, watchVChat ),
  gulp.series( vtheme, watchVTheme ),
  gulp.series( vevm, watchVEvm ),
  gulp.series( vplugins, watchVPlugins ),
) );

gulp.task( 'vcore', gulp.series( vcore, watchVCore ) );
gulp.task( 'vevm', gulp.series( vevm, watchVEvm ) );
gulp.task( 'vchat', gulp.series( vchat, watchVChat ) );
gulp.task( 'vtheme', gulp.series( vtheme, watchVTheme ) );
gulp.task( 'vplugins', gulp.series( vplugins, watchVPlugins ) );
gulp.task( 'css', gulp.series( css, watchCss ) );
