import Config from './data/config';
import Detector from './utils/detector';
import Main from './app/main';

// verify environment.
if(__ENV__ == 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----');

  Config.isDev = true;
}

function init() {
  if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
  } else {
    const container = document.getElementById('appContainer');
    new Main(container);
  }
}

window.onload = init;
