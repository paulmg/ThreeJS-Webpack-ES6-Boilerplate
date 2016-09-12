// performance.now() polyfill from https://gist.github.com/paulirish/5438650
'use strict';

( function () {

  // prepare base perf object
  if ( typeof window.performance === 'undefined' ) {
    window.performance = {};
  }

  if ( !window.performance.now ) {

    var nowOffset = Date.now();

    if ( performance.timing && performance.timing.navigationStart ) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now () {
      return Date.now() - nowOffset;
    };

  }

  if( !window.performance.mark ) {
    window.performance.mark = function(){}
  }

  if( !window.performance.measure ) {
    window.performance.measure = function(){}
  }

} )();

window.rStats = function rStats ( settings ) {

  function iterateKeys ( array, callback ) {
    var keys = Object.keys( array );
    for ( var j = 0, l = keys.length; j < l; j++ ) {
      callback( keys[ j ] );
    }
  }

  function importCSS ( url ) {

    var element = document.createElement( 'link' );
    element.href = url;
    element.rel = 'stylesheet';
    element.type = 'text/css';
    document.getElementsByTagName( 'head' )[ 0 ].appendChild( element );

  }

  var _settings = settings || {};
  var _colours = _settings.colours || [ '#850700', '#c74900', '#fcb300', '#284280', '#4c7c0c' ];

  var _cssFont = 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700,300';
  var _cssRStats = ( _settings.CSSPath ? _settings.CSSPath : '' ) + 'rStats.css';

  var _css = _settings.css || [ _cssFont, _cssRStats ];
  _css.forEach(function (uri) {
    importCSS( uri );
  });

  if ( !_settings.values ) _settings.values = {};

  var _base, _div, _elHeight = 10, _elWidth = 200;
  var _perfCounters = {};


  function Graph ( _dom, _id, _defArg ) {

    var _def = _defArg || {};
    var _canvas = document.createElement( 'canvas' ),
        _ctx = _canvas.getContext( '2d' ),
        _max = 0,
        _current = 0;

    var c = _def.color ? _def.color : '#666666';

    var _dotCanvas = document.createElement( 'canvas' ),
        _dotCtx = _dotCanvas.getContext( '2d' );
    _dotCanvas.width = 1;
    _dotCanvas.height = 2 * _elHeight;
    _dotCtx.fillStyle = '#444444';
    _dotCtx.fillRect( 0, 0, 1, 2 * _elHeight );
    _dotCtx.fillStyle = c;
    _dotCtx.fillRect( 0, _elHeight, 1, _elHeight );
    _dotCtx.fillStyle = '#ffffff';
    _dotCtx.globalAlpha = 0.5;
    _dotCtx.fillRect( 0, _elHeight, 1, 1 );
    _dotCtx.globalAlpha = 1;

    var _alarmCanvas = document.createElement( 'canvas' ),
        _alarmCtx = _alarmCanvas.getContext( '2d' );
    _alarmCanvas.width = 1;
    _alarmCanvas.height = 2 * _elHeight;
    _alarmCtx.fillStyle = '#444444';
    _alarmCtx.fillRect( 0, 0, 1, 2 * _elHeight );
    _alarmCtx.fillStyle = '#b70000';
    _alarmCtx.fillRect( 0, _elHeight, 1, _elHeight );
    _alarmCtx.globalAlpha = 0.5;
    _alarmCtx.fillStyle = '#ffffff';
    _alarmCtx.fillRect( 0, _elHeight, 1, 1 );
    _alarmCtx.globalAlpha = 1;

    function _init () {

      _canvas.width = _elWidth;
      _canvas.height = _elHeight;
      _canvas.style.width = _canvas.width + 'px';
      _canvas.style.height = _canvas.height + 'px';
      _canvas.className = 'rs-canvas';
      _dom.appendChild( _canvas );

      _ctx.fillStyle = '#444444';
      _ctx.fillRect( 0, 0, _canvas.width, _canvas.height );

    }

    function _draw ( v, alarm ) {
      _current += ( v - _current ) * 0.1;
      _max *= 0.99;
      if ( _current > _max ) _max = _current;
      _ctx.drawImage( _canvas, 1, 0, _canvas.width - 1, _canvas.height, 0, 0, _canvas.width - 1, _canvas.height );
      if ( alarm ) {
        _ctx.drawImage( _alarmCanvas, _canvas.width - 1, _canvas.height - _current * _canvas.height / _max - _elHeight );
      } else {
        _ctx.drawImage( _dotCanvas, _canvas.width - 1, _canvas.height - _current * _canvas.height / _max - _elHeight );
      }
    }

    _init();

    return {
      draw: _draw
    };

  }

  function StackGraph ( _dom, _num ) {

    var _canvas = document.createElement( 'canvas' ),
        _ctx = _canvas.getContext( '2d' );

    function _init () {

      _canvas.width = _elWidth;
      _canvas.height = _elHeight * _num;
      _canvas.style.width = _canvas.width + 'px';
      _canvas.style.height = _canvas.height + 'px';
      _canvas.className = 'rs-canvas';
      _dom.appendChild( _canvas );

      _ctx.fillStyle = '#444444';
      _ctx.fillRect( 0, 0, _canvas.width, _canvas.height );

    }

    function _draw ( v ) {
      _ctx.drawImage( _canvas, 1, 0, _canvas.width - 1, _canvas.height, 0, 0, _canvas.width - 1, _canvas.height );
      var th = 0;
      iterateKeys( v, function ( j ) {
        var h = v[ j ] * _canvas.height;
        _ctx.fillStyle = _colours[ j ];
        _ctx.fillRect( _canvas.width - 1, th, 1, h );
        th += h;
      } );
    }

    _init();

    return {
      draw: _draw
    };

  }

  function PerfCounter ( id, group ) {

    var _id = id,
        _time,
        _value = 0,
        _total = 0,
        _averageValue = 0,
        _accumValue = 0,
        _accumStart = performance.now(),
        _accumSamples = 0,
        _dom = document.createElement( 'div' ),
        _spanId = document.createElement( 'span' ),
        _spanValue = document.createElement( 'div' ),
        _spanValueText = document.createTextNode( '' ),
        _def = _settings ? _settings.values[ _id.toLowerCase() ] : null,
        _graph = new Graph( _dom, _id, _def ),
        _started = false;

    _dom.className = 'rs-counter-base';

    _spanId.className = 'rs-counter-id';
    _spanId.textContent = ( _def && _def.caption ) ? _def.caption : _id;

    _spanValue.className = 'rs-counter-value';
    _spanValue.appendChild( _spanValueText );

    _dom.appendChild( _spanId );
    _dom.appendChild( _spanValue );
    if ( group ) group.div.appendChild( _dom );
    else _div.appendChild( _dom );

    _time = performance.now();

    function _average ( v ) {
      if ( _def && _def.average ) {
        _accumValue += v;
        _accumSamples++;
        var t = performance.now();
        if ( t - _accumStart >= ( _def.avgMs || 1000 ) ) {
          _averageValue = _accumValue / _accumSamples;
          _accumValue = 0;
          _accumStart = t;
          _accumSamples = 0;
        }
      }
    }

    function _start () {
      _time = performance.now();
      if( _settings.userTimingAPI ) performance.mark( _id + '-start' );
      _started = true;
    }

    function _end () {
      _value = performance.now() - _time;
      if( _settings.userTimingAPI ) {
        performance.mark( _id + '-end' );
        if( _started ) {
          performance.measure( _id, _id + '-start', _id + '-end' );
        }
      }
      _average( _value );
    }

    function _tick () {
      _end();
      _start();
    }

    function _draw () {
      var v = ( _def && _def.average ) ? _averageValue : _value;
      _spanValueText.nodeValue = Math.round( v * 100 ) / 100;
      var a = ( _def && ( ( _def.below && _value < _def.below ) || ( _def.over && _value > _def.over ) ) );
      _graph.draw( _value, a );
      _dom.style.color = a ? '#b70000' : '#ffffff';
    }

    function _frame () {
      var t = performance.now();
      var e = t - _time;
      _total++;
      if ( e > 1000 ) {
        if ( _def && _def.interpolate === false ) {
          _value = _total;
        } else {
          _value = _total * 1000 / e;
        }
        _total = 0;
        _time = t;
        _average( _value );
      }
    }

    function _set ( v ) {
      _value = v;
      _average( _value );
    }

    return {
      set: _set,
      start: _start,
      tick: _tick,
      end: _end,
      frame: _frame,
      value: function () {
        return _value;
      },
      draw: _draw
    };

  }

  function sample () {

    var _value = 0;

    function _set ( v ) {
      _value = v;
    }

    return {
      set: _set,
      value: function () {
        return _value;
      }
    };

  }

  function _perf ( idArg ) {

    var id = idArg.toLowerCase();
    if ( id === undefined ) id = 'default';
    if ( _perfCounters[ id ] ) return _perfCounters[ id ];

    var group = null;
    if ( _settings && _settings.groups ) {
      iterateKeys( _settings.groups, function ( j ) {
        var g = _settings.groups[ parseInt( j, 10 ) ];
        if ( !group && g.values.indexOf( id.toLowerCase() ) !== -1 ) {
          group = g;
        }
      } );
    }

    var p = new PerfCounter( id, group );
    _perfCounters[ id ] = p;
    return p;

  }

  function _init () {

    if ( _settings.plugins ) {
      if ( !_settings.values ) _settings.values = {};
      if ( !_settings.groups ) _settings.groups = [];
      if ( !_settings.fractions ) _settings.fractions = [];
      for ( var j = 0; j < _settings.plugins.length; j++ ) {
        _settings.plugins[ j ].attach( _perf );
        iterateKeys( _settings.plugins[ j ].values, function ( k ) {
          _settings.values[ k ] = _settings.plugins[ j ].values[ k ];
        } );
        _settings.groups = _settings.groups.concat( _settings.plugins[ j ].groups );
        _settings.fractions = _settings.fractions.concat( _settings.plugins[ j ].fractions );
      }
    } else {
      _settings.plugins = {};
    }

    _base = document.createElement( 'div' );
    _base.className = 'rs-base';
    _div = document.createElement( 'div' );
    _div.className = 'rs-container';
    _div.style.height = 'auto';
    _base.appendChild( _div );
    document.body.appendChild( _base );

    if ( !_settings ) return;

    if ( _settings.groups ) {
      iterateKeys( _settings.groups, function ( j ) {
        var g = _settings.groups[ parseInt( j, 10 ) ];
        var div = document.createElement( 'div' );
        div.className = 'rs-group';
        g.div = div;
        var h1 = document.createElement( 'h1' );
        h1.textContent = g.caption;
        h1.addEventListener( 'click', function ( e ) {
          this.classList.toggle( 'hidden' );
          e.preventDefault();
        }.bind( div ) );
        _div.appendChild( h1 );
        _div.appendChild( div );
      } );
    }

    if ( _settings.fractions ) {
      iterateKeys( _settings.fractions, function ( j ) {
        var f = _settings.fractions[ parseInt( j, 10 ) ];
        var div = document.createElement( 'div' );
        div.className = 'rs-fraction';
        var legend = document.createElement( 'div' );
        legend.className = 'rs-legend';

        var h = 0;
        iterateKeys( _settings.fractions[ j ].steps, function ( k ) {
          var p = document.createElement( 'p' );
          p.textContent = _settings.fractions[ j ].steps[ k ];
          p.style.color = _colours[ h ];
          legend.appendChild( p );
          h++;
        } );
        div.appendChild( legend );
        div.style.height = h * _elHeight + 'px';
        f.div = div;
        var graph = new StackGraph( div, h );
        f.graph = graph;
        _div.appendChild( div );
      } );
    }

  }

  function _update () {

    iterateKeys( _settings.plugins, function ( j ) {
      _settings.plugins[ j ].update();
    } );

    iterateKeys( _perfCounters, function ( j ) {
      _perfCounters[ j ].draw();
    } );

    if ( _settings && _settings.fractions ) {
      iterateKeys( _settings.fractions, function ( j ) {
        var f = _settings.fractions[ parseInt( j, 10 ) ];
        var v = [];
        var base = _perfCounters[ f.base.toLowerCase() ];
        if ( base ) {
          base = base.value();
          iterateKeys( _settings.fractions[ j ].steps, function ( k ) {
            var s = _settings.fractions[ j ].steps[ parseInt( k, 10 ) ].toLowerCase();
            var val = _perfCounters[ s ];
            if ( val ) {
              v.push( val.value() / base );
            }
          } );
        }
        f.graph.draw( v );
      } );
    }

    /*if( _height != _div.clientHeight ) {
     _height = _div.clientHeight;
     _base.style.height = _height + 2 * _elHeight + 'px';
     console.log( _base.clientHeight );
     }*/

  }

  _init();

  return function ( id ) {
    if ( id ) return _perf( id );
    return {
      element: _base,
      update: _update
    };
  };

}

if (typeof module === 'object') {
  module.exports = window.rStats;
}

window.glStats = function () {

  var _rS = null;

  var _totalDrawArraysCalls = 0,
      _totalDrawElementsCalls = 0,
      _totalUseProgramCalls = 0,
      _totalFaces = 0,
      _totalVertices = 0,
      _totalPoints = 0,
      _totalBindTexures = 0;

  function _h ( f, c ) {
    return function () {
      c.apply( this, arguments );
      f.apply( this, arguments );
    };
  }

  WebGLRenderingContext.prototype.drawArrays = _h( WebGLRenderingContext.prototype.drawArrays, function () {
    _totalDrawArraysCalls++;
    if ( arguments[ 0 ] == this.POINTS ) _totalPoints += arguments[ 2 ];
    else _totalVertices += arguments[ 2 ];
  } );

  WebGLRenderingContext.prototype.drawElements = _h( WebGLRenderingContext.prototype.drawElements, function () {
    _totalDrawElementsCalls++;
    _totalFaces += arguments[ 1 ] / 3;
    _totalVertices += arguments[ 1 ];
  } );

  WebGLRenderingContext.prototype.useProgram = _h( WebGLRenderingContext.prototype.useProgram, function () {
    _totalUseProgramCalls++;
  } );

  WebGLRenderingContext.prototype.bindTexture = _h( WebGLRenderingContext.prototype.bindTexture, function () {
    _totalBindTexures++;
  } );

  var _values = {
    allcalls: {
      over: 3000,
      caption: 'Calls (hook)'
    },
    drawelements: {
      caption: 'drawElements (hook)'
    },
    drawarrays: {
      caption: 'drawArrays (hook)'
    }
  };

  var _groups = [ {
    caption: 'WebGL',
    values: [ 'allcalls', 'drawelements', 'drawarrays', 'useprogram', 'bindtexture', 'glfaces', 'glvertices', 'glpoints' ]
  } ];

  var _fractions = [ {
    base: 'allcalls',
    steps: [ 'drawelements', 'drawarrays' ]
  } ];

  function _update () {
    _rS( 'allcalls' ).set( _totalDrawArraysCalls + _totalDrawElementsCalls );
    _rS( 'drawElements' ).set( _totalDrawElementsCalls );
    _rS( 'drawArrays' ).set( _totalDrawArraysCalls );
    _rS( 'bindTexture' ).set( _totalBindTexures );
    _rS( 'useProgram' ).set( _totalUseProgramCalls );
    _rS( 'glfaces' ).set( _totalFaces );
    _rS( 'glvertices' ).set( _totalVertices );
    _rS( 'glpoints' ).set( _totalPoints );
  }

  function _start () {
    _totalDrawArraysCalls = 0;
    _totalDrawElementsCalls = 0;
    _totalUseProgramCalls = 0;
    _totalFaces = 0;
    _totalVertices = 0;
    _totalPoints = 0;
    _totalBindTexures = 0;
  }

  function _end () {}

  function _attach ( r ) {
    _rS = r;
  }

  return {
    update: _update,
    start: _start,
    end: _end,
    attach: _attach,
    values: _values,
    groups: _groups,
    fractions: _fractions
  };

};

window.threeStats = function ( renderer ) {

  var _rS = null;

  var _values = {
    'renderer.info.memory.geometries': {
      caption: 'Geometries'
    },
    'renderer.info.memory.textures': {
      caption: 'Textures'
    },
    'renderer.info.programs': {
      caption: 'Programs'
    },
    'renderer.info.render.calls': {
      caption: 'Calls'
    },
    'renderer.info.render.faces': {
      caption: 'Faces',
      over: 1000
    },
    'renderer.info.render.points': {
      caption: 'Points'
    },
    'renderer.info.render.vertices': {
      caption: 'Vertices'
    }
  };

  var _groups = [ {
    caption: 'Three.js - Memory',
    values: [ 'renderer.info.memory.geometries', 'renderer.info.programs', 'renderer.info.memory.textures' ]
  }, {
    caption: 'Three.js - Render',
    values: [ 'renderer.info.render.calls', 'renderer.info.render.faces', 'renderer.info.render.points', 'renderer.info.render.vertices' ]
  } ];

  var _fractions = [];

  function _update () {

    _rS( 'renderer.info.memory.geometries' ).set( renderer.info.memory.geometries );
    //_rS( 'renderer.info.programs' ).set( renderer.info.programs.length );
    _rS( 'renderer.info.memory.textures' ).set( renderer.info.memory.textures );
    _rS( 'renderer.info.render.calls' ).set( renderer.info.render.calls );
    _rS( 'renderer.info.render.faces' ).set( renderer.info.render.faces );
    _rS( 'renderer.info.render.points' ).set( renderer.info.render.points );
    _rS( 'renderer.info.render.vertices' ).set( renderer.info.render.vertices );

  }

  function _start () {}

  function _end () {}

  function _attach ( r ) {
    _rS = r;
  }

  return {
    update: _update,
    start: _start,
    end: _end,
    attach: _attach,
    values: _values,
    groups: _groups,
    fractions: _fractions
  };

};

/*
 *   From https://github.com/paulirish/memory-stats.js
 */

window.BrowserStats = function () {

  var _rS = null;

  var _usedJSHeapSize = 0,
      _totalJSHeapSize = 0;

  var memory = {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0
  };

  if ( window.performance && performance.memory )
    memory = performance.memory;

  if ( memory.totalJSHeapSize === 0 ) {
    console.warn( 'totalJSHeapSize === 0... performance.memory is only available in Chrome .' );
  }

  var _values = {
    memory: {
      caption: 'Used Memory',
      average: true,
      avgMs: 1000,
      over: 22
    },
    total: {
      caption: 'Total Memory'
    }
  };

  var _groups = [ {
    caption: 'Browser',
    values: [ 'memory', 'total' ]
  } ];

  var _fractions = [ {
    base: 'total',
    steps: [ 'memory' ]
  } ];

  var log1024 = Math.log( 1024 );

  function _size ( v ) {

    var precision = 100; //Math.pow(10, 2);
    var i = Math.floor( Math.log( v ) / log1024 );
    if( v === 0 ) i = 1;
    return Math.round( v * precision / Math.pow( 1024, i ) ) / precision; // + ' ' + sizes[i];

  }

  function _update () {
    _usedJSHeapSize = _size( memory.usedJSHeapSize );
    _totalJSHeapSize = _size( memory.totalJSHeapSize );

    _rS( 'memory' ).set( _usedJSHeapSize );
    _rS( 'total' ).set( _totalJSHeapSize );
  }

  function _start () {
    _usedJSHeapSize = 0;
  }

  function _end () {}

  function _attach ( r ) {
    _rS = r;
  }

  return {
    update: _update,
    start: _start,
    end: _end,
    attach: _attach,
    values: _values,
    groups: _groups,
    fractions: _fractions
  };

};

if (typeof module === 'object') {
  module.exports = {
    glStats: window.glStats,
    threeStats: window.threeStats,
    BrowserStats: window.BrowserStats
  };
}
