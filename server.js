#!/usr/bin/env node

// 가이드 문서
// http://expressjs.com/ko/

// 템플릿 엔진 문서
// https://pugjs.org/api/getting-started.html

// 로그 라이브러리
// https://github.com/expressjs/morgan

const path = require('path');

const bodyParser = require('body-parser');

const express = require('express');

const app = express();

const _console = require('./src/app/lib/console');

const logger = require('morgan');

const host = 'localhost';
const port = 3000;

// 로그 모듈을 app 과 연결한다.
app.use(logger('dev'));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// for parsing application/json
app.use(bodyParser.json({type: 'application/json'}));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.text({type: 'type/html'}));

// 웹 서버 정적 파일 경로 설정
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

app.use((req, res, next) => {

    // next 지역 변수는 `다음 미들웨어 함수`를 가리킨다.(현재는 다음 미들웨어 함수가 정의되어 있지않다)
    // http://expressjs.com/ko/guide/writing-middleware.html
    // 다음 미들웨어 함수를 호출한다.
    next();
});

// server bootstrap
require('./bootstrap')(app);

app.listen(port, host, (err) => {

  if (err) process.exit(1);

  _console.log('Start Web Server!!');

  _console.log(`host:${host}`);
  _console.log(`port:${port}`);

});
