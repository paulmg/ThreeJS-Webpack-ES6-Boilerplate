// Global imports
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Paths
const entry = './src/js/app.js';
const includePath = path.join(__dirname, 'src/js');
const nodeModulesPath = path.join(__dirname, 'node_modules');

let outputPath = path.join(__dirname, 'src/public/js');
let publicPath = '/js/';

module.exports = env => {
  // Dev environment
  let devtool = 'inline-source-map';
  let mode = 'development';
  let stats = 'minimal';
  let plugins = [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env.NODE_ENV)
    })
  ];

  // Prod environment
  if (env.NODE_ENV === 'prod') {
    devtool = 'hidden-source-map';
    mode = 'production';
    stats = 'none';
    outputPath = `${__dirname}/build/js`;
    publicPath = 'js/';
  }

  console.log('Webpack build -');
  console.log(`    - ENV: ${env.NODE_ENV}`);
  console.log(`    - outputPath  ${outputPath}`);
  console.log(`    - includePath ${includePath}`);
  console.log(`    - nodeModulesPath: ${nodeModulesPath}`);

  return {
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
      publicPath,
      // the filename template for entry chunks
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
    },

    // Webpack 4 mode helper
    mode,

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
        },
        {
          test: /\.(s*)css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: 'css'
              }
            },
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }
      ]
    },

    // options for resolving module requests
    // (does not apply to resolving to loaders)
    resolve: {
      // directories where to look for modules,
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ],

      // extensions that are used
      extensions: ['.js', '.json'],
    },

    performance: {
      hints: 'warning'
    },

    // lets you precisely control what bundle information gets displayed
    stats,

    // enhance debugging by adding meta info for the browser devtools
    // source-map most detailed at the expense of build speed.
    devtool,

    devServer: {
      static: 'src/public',
    },

    plugins: plugins.concat(
      new HtmlWebpackPlugin({
        title: 'Three.js Webpack ES6 Boilerplate',
        template: path.join(__dirname, 'src/html/index.html'),
        filename: '../index.html',
        env: env.NODE_ENV,
      }),
      new MiniCssExtractPlugin({
        filename: '../css/[name].css',
        chunkFilename: '../css/[id].css'
      })
    ),

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new OptimizeCSSAssetsPlugin()
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\\/]node_modules[\\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  };
};
