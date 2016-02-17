'use strict';

/**
 * Module dependencies.
 */
const fs = require('fs')
const resolve = require('path').resolve;
const assert = require('assert');
const debug = require('debug')('koa-static');
const send = require('koa-send');

/**
 * Expose `serve()`.
 */

module.exports = serve;

/**
 * Serve static files from `root`.
 *
 * @param {String} root
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

function serve(root, opts) {
    opts = opts || {};

    assert(root, 'root directory is required to serve files');

    // options
    debug('static "%s" %j', root, opts);
    opts.root = resolve(root);
    if (opts.index !== false) opts.index = opts.index || 'index.html';
    var url = opts.prefix || opts.url || "/"
    //prefix url
    if (url.substr(0, 1) !== "/")
        url = "/" + url
    if (url.substr(-1) !== "/")
        url += "/"
    if (!opts.defer) {
        return function *serve(next) {
            if (this.method != 'HEAD' && this.method != 'GET') return;
            var pathUrl = this.path
            if (url.replace(/^\//, "").replace(/\/$/, "") === pathUrl.replace(/^\//, "").replace(/\/$/, "")) {
                yield send(this, "/", opts);
            } else if (pathUrl.substr(0, url.length) === url) {
                console.log(pathUrl)
                console.log("url:" + url)
                var sub = pathUrl.replace(url, "")
                //如果有后缀 则添加后缀
                yield send(this, sub + (opts.suffix || ""), opts)
            } else {
                yield* next
            }
        }
    }

    return function *serve(next) {
        yield* next;

        if (this.method != 'HEAD' && this.method != 'GET') return;
        // response is already handled
        if (this.body != null || this.status != 404) return;

        var pathUrl = this.path
        if (url.replace(/^\//, "").replace(/\/$/, "") === pathUrl.replace(/^\//, "").replace(/\/$/, "")) {
            yield send(this, "/", opts);
        } else if (pathUrl.substr(0, url.length) === url) {
            var sub = pathUrl.replace(url, "")
            yield send(this, sub + (opts.suffix || ""), opts)
        }
    }
}
