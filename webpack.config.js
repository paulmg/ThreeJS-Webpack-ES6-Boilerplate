// Global imports
var webpack = require('webpack'),
    path    = require('path');

// Paths
var entry           = './src/js/app.js',
    includePath     = path.join(__dirname, 'src/js'),
    nodeModulesPath = path.join(__dirname, 'node_modules'),
    outputPath      = path.join(__dirname, 'src/public/assets/js');

// Environment
var PROD = JSON.parse(process.env.NODE_ENV || 0);

// Dev environment
var env = 'dev',
    time = Date.now(),
    devtool = 'eval',
    mode = 'development',
    stats = 'minimal',
    plugins = [
      //new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(env),
        ___BUILD_TIME___: time
      })
    ];

// Production environment
if(PROD) {
  env = 'prod';
  devtool = 'hidden-source-map';
  mode = 'production';
  stats = 'none';
  outputPath = __dirname + '/build/public/assets/js';
}

console.log('Webpack build - ENV: ' + env + ' V: ' + time);
console.log('    - outputPath ', outputPath);
console.log('    - includePath ', includePath);
console.log('    - nodeModulesPath ', nodeModulesPath);

module.exports = {
  // Here the application starts executing
  // and webpack starts bundling
  entry: [
    entry
  ],

  // options related to how webpack emits results
  output: {
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    path: outputPath,
    // the url to the output directory resolved relative to the HTML page
    publicPath: 'assets/js',
    // the filename template for entry chunks
    filename: 'app.js'
  },

  mode: mode,

  // configuration regarding modules
  module: {
    // rules for modules (configure loaders, parser options, etc.)
    rules: [
      {
        // these are matching conditions, each accepting a regular expression or string
        // test and include have the same behavior, both must be matched
        // exclude must not be matched (takes preference over test and include)
        // Best practices:
        // - Use RegExp only in test and for filename matching
        // - Use arrays of absolute paths in include and exclude
        // - Try to avoid exclude and prefer include
        test: /\.js?$/,
        // the loader which should be applied, it'll be resolved relative to the context
        // -loader suffix is no longer optional in webpack2 for clarity reasons
        // see webpack 1 upgrade guide
        use: {
          loader: 'babel-loader',
        },
        include: includePath,
        exclude: nodeModulesPath,
      }
    ]
  },

  // options for resolving module requests
  // (does not apply to resolving to loaders)
  resolve: {

    // directories where to look for modules,
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],

    // extensions that are used
    extensions: ['.js', '.json', '.css'],
  },

  performance: {
    hints: 'warning' // enum
  },

  // lets you precisely control what bundle information gets displayed
  stats: stats,

  // enhance debugging by adding meta info for the browser devtools
  // source-map most detailed at the expense of build speed.
  devtool: devtool, // enum

  devServer: {
    contentBase: 'src/public'
  },

  plugins: plugins
};
