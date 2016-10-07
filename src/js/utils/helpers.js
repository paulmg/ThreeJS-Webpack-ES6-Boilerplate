export default class Helpers {
  static throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    let last, deferTimer;

    return function() {
      const context = scope || this;

      const now  = +new Date,
          args = arguments;

      if(last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      }
      else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  static logProgress() {
    return function(xhr) {
      if(xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;

        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    }
  }

  static logError() {
    return function(xhr) {
      console.error(xhr);
    }
  }
}
