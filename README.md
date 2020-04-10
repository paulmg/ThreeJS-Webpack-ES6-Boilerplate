# Three.js Webpack ES6 Boilerplate

This is a simplified fork of [Three.js Webpack ES6 Boilerplate](https://github.com/paulmg/ThreeJS-Webpack-ES6-Boilerplate/), a basic boilerplate for a Three.js project including the use of Webpack and ES6 syntax via Babel.

All auto-built files are removed from Git and generated at build time to clean and simplify the folder structures.

A Travis YML configuration is also provided to auto-deploy the static built production site via Github Pages and requires the additional configuration:

 - Create a Personal Access Token with just ```repo``` access in [Github developer settings](https://github.com/settings/tokens)
 - Create an Environmental Variable called ```GITHUB_TOKEN``` on your repo page on the [Travis website](https://travis-ci.com/)
 - Create a new branch ```gh-pages``` and point GitHub Pages there on your repo's settings on Github.
 - If you are using a custom domain, add a file named ```CNAME``` (no extension) to the root of the build folder containing just the URL

Travis will then auto-deploy the latest static production build via Github Pages on each new commit.

## Project Structure
```
──build - Directory for all built files (excluded from Git)
  ├── dev - Webpack builds local dev site here. Used by webpack-dev-server to serve content locally during development.  
  ├── prod - Webpack builds static production site here. Use for serving the static site on a webserver.
──src - Directory for all source files
  ├── assets - Is copied over to build folder with build command. Place external asset & vendor files here.
  ├── css - Contains all SCSS files, that are compiled to `src/public/css`
  ├── js - All the Three.js app files, with `app.js` as entry point. Compiled to `src/public/js` with webpack
  │   ├── app
  │   │   ├── components - Three.js components that get initialized in `main.js`
  │   │   ├── helpers - Classes that provide ideas on how to set up and work with defaults
  │   │   ├── managers - Manage complex tasks such as GUI or input
  │   │   └── model - Classes that set up the model object
  │   ├── data - Any data to be imported into app
  │   └── utils - Various helpers and vendor classes
```

## Getting started
Install dependencies:

```
npm install
```

Then run dev script:

```
npm run dev
```

Spins up a webpack dev server at localhost:8080 and keeps track of all js and sass changes to files.

## Build
```
npm run build
```

Cleans existing build/prod folder while linting js folder and copies over the public assets folder from src. Then sets environment to production and compiles js and css into build.

## Other NPM Scripts
You can run any of these individually if you'd like with the `npm run` command:
* `prebuild` - Cleans up build folder and lints `src/js`
* `clean` - Cleans build folder
* `lint` - Runs lint on the `src/js` folder and uses the `.eslintrc` file in root for linting rules
* `webpack-server` - Start up a  webpack-dev-server with hot-module-replacement
* `webpack-watch` - Run webpack in dev environment with watch
* `dev:dir` - Copy files and folders from `src/assets` to `build/dev`
* `dev:js` - Run webpack in dev environment without watch
* `build:dir` - Copy files and folders from `src/assets` to `build/prod`
* `build:js` - Run webpack in production environment

## Input Controls
* Press H to hide dat.GUI
* Arrow controls will pan
* Mouse left click will rotate/right click will pan
* Scroll wheel zooms in and out
