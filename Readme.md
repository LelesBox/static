# koa-static

基于koa-static,添加prefix和suffix选项,为链接添加前缀后缀

Koa static file serving middleware, wrapper for [`koa-send`](https://github.com/koajs/send).

## Installation

```bash
$ npm install lb-koa-static
```

## API

```js
var koa = require('koa');
var app = koa();
app.use(require('koa-static')(root, opts));
```

* `root` root directory string. nothing above this root directory can be served
* `opts` options object.

### Options

 - `maxage` Browser cache max-age in milliseconds. defaults to 0
 - `hidden` Allow transfer of hidden files. defaults to false
 - `index` Default file name, defaults to 'index.html'
 - `defer` If true, serves after `yield next`, allowing any downstream middleware to respond first.
 - `gzip`  Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true.
 - `prefix` prefix the url,default /
 -  `suffix` suffix the url

## Example

```js
var serve = require('koa-static');
var koa = require('koa');
var app = koa();

// $ GET /package.json
app.use(serve('.'));

// $ GET /hello.txt
app.use(serve('test/fixtures'));

app.use(serve('test/fixtures',{prefix:'/build/'}));

app.use(serve('test/fixtures',{prefix:'/sf/',suffix:'.html'}));

// or use absolute paths
app.use(serve(__dirname + '/test/fixtures'));

app.listen(3000);

console.log('listening on port 3000');
```

### See also

 - [koajs/conditional-get](https://github.com/koajs/conditional-get) Conditional GET support for koa
 - [koajs/compress](https://github.com/koajs/compress) Compress middleware for koa
 - [koajs/mount](https://github.com/koajs/mount) Mount `koa-static` to a specific path

## License

  MIT
