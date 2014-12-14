(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function capitalise(e){return e.replace(/\b[a-z]/g,function(){return arguments[0].toUpperCase()})}function check(e,t){var n=!1,i=e.toLowerCase()+t.toLowerCase(),o=capitalise(e.toLowerCase())+capitalise(t.toLowerCase());return state[i]?state[i]:("on"+i in window?n=i:"onwebkit"+i in window?n="webkit"+o:"ono"+i in document.documentElement&&(n="o"+o),n)}function bindEvents(){on(window,"resize",function(){clearTimeout(timeout.resize),timeout.resize=setTimeout(emitResizeEnd,200)})}function emitResizeEnd(){emit(window,"resizeend"),"undefined"!=typeof $&&$(window).trigger("resizeend")}function on(e,t,n){var i=browserSpecificEvents[t.toLowerCase()];t=i||t,e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent(t,n)}function off(e,t,n){var i=browserSpecificEvents[t.toLowerCase()];t=i||t,e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)}function emit(e,t){var n;document.createEvent?(n=document.createEvent("CustomEvent"),n.initCustomEvent(t,!1,!1,null),e.dispatchEvent(n)):(n=document.createEventObject(),e.fireEvent("on"+t,n))}function ready(e){/in/.test(document.readyState)?setTimeout(function(){ready(e)},9):e()}var timeout={resize:null},state={},browserSpecificEvents={transitionend:check("transition","end"),animationend:check("animation","end")};bindEvents(),module.exports={on:on,off:off,emit:emit,ready:ready};
},{}],2:[function(require,module,exports){
var event = require('../../bower_components/bskyb-event/dist/js/events/event');

var state = {
    css: {}
};

var html = document.documentElement;
var toolkitClasses = ["no-touch", "touch-device", "mobile-view", "desktop-view", "landscape", "portrait"];
var vendorPrefix = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

var touchClasses = { hasNot: toolkitClasses[0], has: toolkitClasses[1] };
var viewClasses = { mobile: toolkitClasses[2], desktop: toolkitClasses[3] };
var orientationClasses = { landscape: toolkitClasses[4], portrait: toolkitClasses[5] };

function bindEvents() {
    event.on(window, 'resize', updateDetectionStates);
}


function updateDetectionStates() {
    removeClasses();
    attachClasses();
}

function removeClasses() {
    var arrClasses = html.className.split(' ');
    for (var i in toolkitClasses) {
        var indexToRemove = arrClasses.indexOf(toolkitClasses[i]);
        if (indexToRemove > -1) {
            arrClasses.splice(indexToRemove, 1);
        }
    }
    html.className = arrClasses.join(' ');
}

function attachClasses() {
    var arrClasses = html.className.split(' ');
    arrClasses.push(touch() ? touchClasses.has : touchClasses.hasNot);
    arrClasses.push(view('mobile') ? viewClasses.mobile : viewClasses.desktop);
    arrClasses.push(orientation('landscape') ? orientationClasses.landscape : orientationClasses.portrait);
    html.className = arrClasses.join(' ');
}

function support3D() {
    var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        },
        body = document.body || document.documentElement,
        has3d,
        div = document.createElement('div'),
        t;
    body.insertBefore(div, null);
    for (t in transforms) {
        if (transforms.hasOwnProperty(t)) {
            if (div.style[t] !== undefined) {
                div.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(div).getPropertyValue(transforms[t]);
            }
        }
    }
    body.removeChild(div);
    state.css.support3D = (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    return state.css.support3D;
}

function supportsPseudo() {
//        if (state.css.pseudo){ return state.css.pseudo; }
    var body = document.body || document.documentElement,
        paraBefore = document.createElement('p'),
        styleBefore = document.createElement('style'),
        heightBefore,
        selectorsBefore = '#testbefore:before { content: "before"; }';
    styleBefore.type = 'text\/css';
    paraBefore.id = 'testbefore';

    if (styleBefore.styleSheet) {
        styleBefore.styleSheet.cssText = selectorsBefore;
    } else {
        styleBefore.appendChild(document.createTextNode(selectorsBefore));
    }

    body.appendChild(styleBefore);
    body.appendChild(paraBefore);
    heightBefore = document.getElementById('testbefore').offsetHeight;
    body.removeChild(styleBefore);
    body.removeChild(paraBefore);

    state.css.pseudo = (heightBefore >= 1);
    return state.css.pseudo;
}

function pseudo(el, pos, property) {
    if (!el) {
        return supportsPseudo();
    }
    if (!window.getComputedStyle) {
        return false;
    }
    var css = window.getComputedStyle(el, ':' + pos);
    var str = css.getPropertyValue(property);
    if (str && (str.indexOf("'") === 0 || str.indexOf('"') === 0)) {
        str = str.substring(1, str.length - 1);
    }
    return str;
}

function getHtmlPseudo(pos) {
    var content = pseudo(html, pos, 'content');
    var fontFamily = pseudo(html, pos, 'font-family');
    return (content && content != 'normal') ? content : fontFamily;
}

function supportsCSS(property) {
    if (state.css[property]) {
        return state.css[property];
    }
    if (property === 'support3D') {
        return support3D(property);
    }
    var style = html.style;
    if (typeof style[property] == 'string') {
        state.css[property] = true;
        return true;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    for (var i = 0; i < vendorPrefix.length; i++) {
        if (typeof style[vendorPrefix[i] + property] == 'string') {
            state.css[property] = true;
            return state.css[property];
        }
    }
    state.css[property] = false;
    return state.css[property];
}

function css(el, property) {
    if (!property) {
        return supportsCSS(el);
    }
    var strValue = "";
    if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(el, "").getPropertyValue(property);
    } else if (el.currentStyle) {
        property = property.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = el.currentStyle[property];
    }
    return strValue;
}

function view(type) {
    state.view = getHtmlPseudo('after') || 'desktop';
    return (type) ? state.view == type : state.view;
}

function orientation(type) {
    state.orientation = getHtmlPseudo('before') || 'landscape';
    return (type) ? state.orientation == type : state.orientation;
}

function touch() {
    state.touch = (typeof window.ontouchstart !== "undefined");
    return state.touch;
}

function getElementOffset(el) {
    return {
        top: el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop,
        left: el.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft
    };
}

function elementVisibleBottom(el) {
    if (el.length < 1)
        return;

    var elementOffset = getElementOffset(el);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    return (elementOffset.top + el.offsetHeight <= scrollTop + document.documentElement.clientHeight);
}

function elementVisibleRight(el) {
    if (el.length < 1)
        return;
    var elementOffset = getElementOffset(el);
    return (elementOffset.left + el.offsetWidth <= document.documentElement.clientWidth);
}

attachClasses();
bindEvents();

module.exports = {
    css: css,
    touch: touch,
    orientation: orientation,
    view: view,
    pseudo: pseudo,
    state: state,
    elementVisibleBottom: elementVisibleBottom,
    elementVisibleRight: elementVisibleRight,
    updateDetectionStates: updateDetectionStates //just expose this while phantomJS doesnt understand event.emit(window,'resize');
};
},{"../../bower_components/bskyb-event/dist/js/events/event":1}],3:[function(require,module,exports){
var detect = require('./detect');

if (typeof toolkit === "undefined") window.toolkit = {};
if (typeof window.define === "function" && window.define.amd) {
    define('bower_components/bskyb-detect/dist/js/detect.toolkit', [], function() {
        'use strict';
        return detect;
    });
} else {
    toolkit.detect = detect;
}
},{"./detect":2}]},{},[3]);
