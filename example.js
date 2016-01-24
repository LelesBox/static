'use strict';


const serve = require('./');
const koa = require('koa');
const app = koa();

// $ GET /package.json
// $ GET /

var url = '/build/build'
app.use(serve('test/fixtures', {
  url: url,
  //format:false  
  defer: true
}));

app.use(function *(next) {
  yield next;
  if ('/' == this.path) {
    this.body = 'Try `GET /package.json`';
  }
})

app.use(function *(next) {
  yield next;
  if ('/asd.txt' == this.path) {
    this.body = 'Try `GET /package.json`';
  }
})

app.use(function*(next) {
  yield next;
  if ('/aaa' == this.path) {
    this.body = 'Try `GET /package.json`';
  }
})

app.listen(3000);

console.log('listening on port 3000');