'use strict';

const request = require('supertest');
const serve = require('..');
const koa = require('koa');

describe('serve(root)', function () {
  describe('when defer: false', function () {
    describe('when root = "."', function () {
      it('should serve from cwd', function (done) {
        const app = koa();

        app.use(serve('.'));

        request(app.listen())
          .get('/package.json')
          .expect(200, done);
      })
    })

    describe('when path is not a file', function () {
      it('should 404', function (done) {
        const app = koa();

        app.use(serve('test/fixtures'));

        request(app.listen())
          .get('/something')
          .expect(404, done);
      })
    })

    describe('when upstream middleware responds', function () {
      it('should respond', function (done) {
        const app = koa();

        app.use(serve('test/fixtures'));

        app.use(function *(next) {
          yield next;
          this.body = 'hey';
        });

        request(app.listen())
          .get('/hello.txt')
          .expect(200)
          .expect('world', done);
      })
    })

    describe('the path is valid', function () {
      it('should serve the file', function (done) {
        const app = koa();

        app.use(serve('test/fixtures'));

        request(app.listen())
          .get('/hello.txt')
          .expect(200)
          .expect('world', done);
      })
    })

    describe('.index', function () {
      describe('when present', function () {
        it('should alter the index file supported', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {index: 'index.txt'}));

          request(app.listen())
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('text index', done);
        })
      })

      describe('when omitted', function () {
        it('should use index.html', function (done) {
          const app = koa();

          app.use(serve('test/fixtures'));

          request(app.listen())
            .get('/world/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect('html index', done);
        })
      })

      describe('when disabled', function () {
        it('should not use index.html', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {index: false}));

          request(app.listen())
            .get('/world/')
            .expect(404, done);
        })
      })
    })

    describe('when method is not `GET` or `HEAD`', function () {
      it('should 404', function (done) {
        const app = koa();

        app.use(serve('test/fixtures'));

        request(app.listen())
          .post('/hello.txt')
          .expect(404, done);
      })
    })
  })

  describe('when defer: true', function () {
    describe('when upstream middleware responds', function () {
      it('should do nothing', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        app.use(function *(next) {
          yield next;
          this.body = 'hey';
        });

        request(app.listen())
          .get('/hello.txt')
          .expect(200)
          .expect('hey', done);
      })
    })

    describe('the path is valid', function () {
      it('should serve the file', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        request(app.listen())
          .get('/hello.txt')
          .expect(200)
          .expect('world', done);
      })
    })

    describe('.index', function () {
      describe('when present', function () {
        it('should alter the index file supported', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            index: 'index.txt'
          }));

          request(app.listen())
            .get('/')
            .expect(200)
            .expect('Content-Type', 'text/plain; charset=utf-8')
            .expect('text index', done);
        })
      })

      describe('when omitted', function () {
        it('should use index.html', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true
          }));

          request(app.listen())
            .get('/world/')
            .expect(200)
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect('html index', done);
        })
      })
    })

    describe('when path is not a file', function () {
      it('should 404', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        request(app.listen())
          .get('/something')
          .expect(404, done);
      })
    })

    describe('it should not handle the request', function () {
      it('when status=204', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        app.use(function *(next) {
          this.status = 204;
        })

        request(app.listen())
          .get('/something%%%/')
          .expect(204, done);
      })

      it('when body=""', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        app.use(function *(next) {
          this.body = '';
        })

        request(app.listen())
          .get('/something%%%/')
          .expect(200, done);
      })
    })

    describe('when method is not `GET` or `HEAD`', function () {
      it('should 404', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          defer: true
        }));

        request(app.listen())
          .post('/hello.txt')
          .expect(404, done);
      })
    })
  })

  describe('option - format', function () {
    describe('when format: false', function () {
      it('should 404', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          index: 'index.html',
          format: false
        }));

        request(app.listen())
          .get('/world')
          .expect(404, done);
      })

      it('should 200', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          index: 'index.html',
          format: false
        }));

        request(app.listen())
          .get('/world/')
          .expect(200, done);
      })
    })

    describe('when format: true', function () {
      it('should 200', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          index: 'index.html',
          format: true
        }));

        request(app.listen())
          .get('/world')
          .expect(200, done);
      })

      it('should 200', function (done) {
        const app = koa();

        app.use(serve('test/fixtures', {
          index: 'index.html',
          format: true
        }));

        request(app.listen())
          .get('/world/')
          .expect(200, done);
      })
    })
  })
})
describe("test with custom url", function () {

  describe('serve(root)', function () {
    describe('when defer: false', function () {
      describe('when root = "."', function () {
        it('should serve from cwd', function (done) {
          const app = koa();

          app.use(serve('.', {
            url: "asd"
          }));

          request(app.listen())
            .get('/asd/package.json')
            .expect(200, done);
        })
      })

      describe('when path is not a file', function () {
        it('should 404', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            url: 'zxc'
          }));

          request(app.listen())
            .get('/zxc/something')
            .expect(404, done);
        })
      })

      describe('when upstream middleware responds', function () {
        it('should respond', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            url: 'tj'
          }));

          app.use(function *(next) {
            yield next;
            this.body = 'hey';
          });

          request(app.listen())
            .get('/tj/hello.txt')
            .expect(200)
            .expect('world', done);
        })
      })

      describe('the path is valid', function () {
        it('should serve the file', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            url: 'leebox'
          }));

          request(app.listen())
            .get('/leebox/hello.txt')
            .expect(200)
            .expect('world', done);
        })
      })

      describe('.index', function () {
        describe('when present', function () {
          it('should alter the index file supported', function (done) {
            const app = koa();

            app.use(serve('test/fixtures', {
              index: 'index.txt',
              url: "/qwe"
            }));

            request(app.listen())
              .get('/qwe')
              .expect(200)
              .expect('Content-Type', 'text/plain; charset=utf-8')
              .expect('text index', done);
          })
        })

        describe('when omitted', function () {
          it('should use index.html', function (done) {
            const app = koa();

            app.use(serve('test/fixtures', {
              url: 'jay'
            }));

            request(app.listen())
              .get('/jay/world/')
              .expect(200)
              .expect('Content-Type', 'text/html; charset=utf-8')
              .expect('html index', done);
          })
        })

        describe('when disabled', function () {
          it('should not use index.html', function (done) {
            const app = koa();

            app.use(serve('test/fixtures', {
              index: false,
              url: 'iphone'
            }));

            request(app.listen())
              .get('/iphone/world/')
              .expect(404, done);
          })
        })
      })

      describe('when method is not `GET` or `HEAD`', function () {
        it('should 404', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            url: '/txt'
          }));

          request(app.listen())
            .post('/txt/hello.txt')
            .expect(404, done);
        })
      })
    })

    describe('when defer: true', function () {
      describe('when upstream middleware responds', function () {
        it('should do nothing', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: 'defer/defer'
          }));

          app.use(function *(next) {
            yield next;
            this.body = 'hey';
          });

          request(app.listen())
            .get('/defer/defer/hello.txt')
            .expect(200)
            .expect('hey', done);
        })
      })

      describe('the path is valid', function () {
        it('should serve the file', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: "/dfg"
          }));

          request(app.listen())
            .get('/dfg/hello.txt')
            .expect(200)
            .expect('world', done);
        })
      })

      describe('.index', function () {
        describe('when present', function () {
          it('should alter the index file supported', function (done) {
            const app = koa();

            app.use(serve('test/fixtures', {
              defer: true,
              index: 'index.txt',
              url: "/index"
            }));

            request(app.listen())
              .get('/index')
              .expect(200)
              .expect('Content-Type', 'text/plain; charset=utf-8')
              .expect('text index', done);
          })
        })

        describe('when omitted', function () {
          it('should use index.html', function (done) {
            const app = koa();

            app.use(serve('test/fixtures', {
              defer: true,
              url: "test"
            }));

            request(app.listen())
              .get('/test/world/')
              .expect(200)
              .expect('Content-Type', 'text/html; charset=utf-8')
              .expect('html index', done);
          })
        })
      })

      describe('when path is not a file', function () {
        it('should 404', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: "ooo"
          }));

          request(app.listen())
            .get('/ooo/something')
            .expect(404, done);
        })
      })

      describe('it should not handle the request', function () {
        it('when status=204', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: 'true/false/none'
          }));

          app.use(function *(next) {
            this.status = 204;
          })

          request(app.listen())
            .get('/true/false/none/something%%%/')
            .expect(204, done);
        })

        it('when body=""', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: 'body'
          }));

          app.use(function *(next) {
            this.body = '';
          })

          request(app.listen())
            .get('/body/something%%%/')
            .expect(200, done);
        })
      })

      describe('when method is not `GET` or `HEAD`', function () {
        it('should 404', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            defer: true,
            url: "/fix"
          }));

          request(app.listen())
            .post('/fix/hello.txt')
            .expect(404, done);
        })
      })
    })

    describe('option - format', function () {
      describe('when format: false', function () {
        it('should 404', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            index: 'index.html',
            format: false,
            url: "format"
          }));

          request(app.listen())
            .get('/format/world')
            .expect(404, done);
        })

        it('should 200', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            index: 'index.html',
            format: false,
            url: "digit"
          }));

          request(app.listen())
            .get('/digit/world/')
            .expect(200, done);
        })
      })

      describe('when format: true', function () {
        it('should 200', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            index: 'index.html',
            format: true,
            url: "1110"
          }));

          request(app.listen())
            .get('/1110/world')
            .expect(200, done);
        })

        it('should 200', function (done) {
          const app = koa();

          app.use(serve('test/fixtures', {
            index: 'index.html',
            format: true,
            url: "1s"
          }));

          request(app.listen())
            .get('/1s/world/')
            .expect(200, done);
        })
      })
    })
  })
})

describe("单独测试路径参数", function () {
  it("一级目录", function (done) {
    const app = koa();

    app.use(serve('test/fixtures', {
      index: 'index.html',
      url: "1s"
    }));
    request(app.listen())
      .get('/1s/world/')
      .expect(200, done);
  })
  it("二级目录", function (done) {
    const app = koa();

    app.use(serve('test/fixtures', {
      index: 'index.html',
      url: "1s/2s"
    }));
    request(app.listen())
      .get('/1s/2s/world/')
      .expect(200, done);
  })
  it("三级目录", function (done) {
    const app = koa();

    app.use(serve('test/fixtures', {
      index: 'index.html',
      url: "1s/2s/3s"
    }));
    request(app.listen())
      .get('/1s/2s/3s/world/')
      .expect(200, done);
  })
  it("十级以内随机目录", function (done) {
    const app = koa();
    var random = Math.floor(Math.random() * 10)
    var url = ""
    for (var i = 0; i < random; i++) {
      url += "/" + i
    }
    app.use(serve('test/fixtures', {
      index: 'index.html',
      url: url
    }));
    request(app.listen())
      .get(url + '/world/')
      .expect(200, done);
  })
  it("十级以内随机目录", function (done) {
    const app = koa();
    var random = Math.floor(Math.random() * 10)
    var url = ""
    for (var i = 0; i < random; i++) {
      url += "/" + i
    }
    app.use(serve('test/fixtures', {
      //index: 'index.html',
      url: url,
      //defer:true
    }));
    app.use(function*(next) {
      yield next;
      if ('/aaa' == this.path) {
        this.body = 'Try `GET /package.json`';
      }
    })

    request(app.listen())
      .get('/aaa')
      .expect(200, done);
  })
  it("十级以内随机目录-defer", function (done) {
    const app = koa();
    var random = Math.floor(Math.random() * 10)
    var url = ""
    for (var i = 0; i < random; i++) {
      url += "/" + i
    }
    app.use(serve('test/fixtures', {
      //index: 'index.html',
      url: url,
      defer: true
    }));
    app.use(function*(next) {
      yield next;
      if ('/aaa' == this.path) {
        this.body = 'Try `GET /package.json`';
      }
    })

    request(app.listen())
      .get('/aaa')
      .expect(200, done);
  })

  it("十级以内随机目录-defer", function (done) {
    const app = koa();
    var random = Math.floor(Math.random() * 10)
    var url = ""
    for (var i = 0; i < random; i++) {
      url += "/" + i
    }
    app.use(serve('test/fixtures', {
      url: url,
      defer: true
    }));
    request(app.listen())
      .get('/bbb')
      .expect(404, done);
  })
})