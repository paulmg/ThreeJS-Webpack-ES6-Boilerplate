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
var env     = 'dev',
    time    = Date.now(),
    devtool = 'eval',
    debug   = true,
    plugins = [
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(env),
        ___BUILD_TIME___: time
      })
    ];

// Production environment
if(PROD) {
  env = 'prod';
  devtool = 'hidden-source-map';
  debug = false;
  outputPath = __dirname + '/build/public/assets/js';

  uglifyOptions = {
    sourceMap: false,
    mangle: true,
    compress: {
      drop_console: true
    },
    output: {
      comments: false
    }
  };
  plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOptions));
}

console.log('Webpack build - ENV: ' + env + ' V: ' + time);
console.log('    - outputPath ', outputPath);
console.log('    - includePath ', includePath);
console.log('    - nodeModulesPath ', nodeModulesPath);

module.exports = {
  stats: {
    colors: true
  },
  debug: debug,
  devtool: devtool,
  devServer: {
    contentBase: 'src/public'
  },
  entry: [
    entry
  ],
  output: {
    path: outputPath,
    publicPath: 'assets/js',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        include: [
          includePath, nodeModulesPath
        ]
      }
    ]
  },
  plugins: plugins
};
