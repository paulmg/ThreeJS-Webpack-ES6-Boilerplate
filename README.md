# Three.js Webpack ES6 Boilerplate
A basic boilerplate for a Three.js project including the use of Webpack and ES6 syntax via Babel.

## Getting started
```
npm install
```

Then

```
npm run dev
```

Spins up a webpack dev server at localhost:8080 and keeps track of all js and sass changes to files and reloads upon save.

## Build
```
npm run build
```

Cleans existing build folder while linting js and copies over the public folder from src. Then sets environment to production and compiles js and css into build.
