// const sass = require('node-sass');
// const scssPath = '../scss/style.scss';
// const cssPath = '../css/style.css';

// sass.render({ file: scssPath }, (err, result) => {

// });




// // Requirements
// const sass = require('node-sass');
// const fs = require('fs');
// const path = require('path');
// const mkdirp = require('mkdirp');
// const getDirName = require('path').dirname;

// function compileSass(options = {}) {
//     options = Object.assign({ style: 'expanded' }, options);

//     const result = sass.renderSync({
//       file: options.src,
//       outputStyle: options.style
//     });

//     mkdirp(getDirName(options.dest), function(err) {
//       if (err) return cb(err);
//       fs.writeFile(options.dest, result.css);
//     });

//     console.log(' ' + options.dest + ' built.');
// };

// // Expanded
// compileSass({
//   src : '../scss/style.scss',
//   dest: '../css/style.css'
// });

// // Minified
// compileSass({
//   src : '../scss/style.scss',
//   dest: '../css/style.min.css',
//   style: 'compressed'
// });