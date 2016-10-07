# Three.js Webpack ES6 Boilerplate
A basic boilerplate for a Three.js project including the use of Webpack and ES6 syntax via Babel.

## Project Structure
* build - Directory for built and compressed files from the npm build script
* src - Directory for all dev files
* src/css - Contains all SCSS files, that are compiled to `src/public/assets/css`
* src/js - All the Three.js app files, with `app.js` as entry point. Compiled to `src/public/assets/js` with webpack
* src/js/app/components - Three.js components that get initialized in `main.js`
* src/js/app/helpers - Classes that provide ideas on how to set up and work with defaults
* src/js/app/managers - Manage complex tasks such as GUI or input
* src/js/app/model - Classes that set up the model object
* src/js/data - Any data to be imported into app
* src/js/utils - Various helpers and vendor classes
* src/public - Used by webpack-dev-server to serve content and is copied over to build folder with build command. Place external vendor files here.

## Getting started
Install dependencies:

```
npm install
```

Then run dev script:

```
npm run dev
```

Spins up a webpack dev server at localhost:8080 and keeps track of all js and sass changes to files. Only reloads automatically upon save of js files.

## Build
```
npm run build
```

Cleans existing build folder while linting js folder and then copies over the public folder from src. Then sets environment to production and compiles js and css into build.

## Other NPM Scripts
You can run any of these individually if you'd like with the npm run command:
* prebuild - Cleans build folder and lints `src/js`
* clean - Cleans build folder
* lint - Runs lint on `src/js` folder and uses `.eslintrc` file in root as linting rules
* webpack-server - Create webpack-dev-server with hot-module-replacement
* webpack-watch - Run webpack in dev environment with watch
* dev:sass - Run node-sass on `src/css` folder and output to `src/public` and watch for changes
* dev:js - Run webpack in dev environment without watch
* build:dir - Copy files and folders from `src/public` to `build`
* build:sass - Run node-sass on `src/css` and output compressed css to `build` folder
* build:js - Run webpack in production environment

## Input Controls
* Press H to hide dat.GUI
* Arrow controls will pan
* Mouse left click will rotate/right click will pan
* Scrollwheel zooms in and out
