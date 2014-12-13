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