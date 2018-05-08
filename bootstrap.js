/**
 * Created by sgjeon on 2017. 8. 8..
 */

const express = require('express');

const fs = require('fs');
const path = require('path');

const glob = require('glob');
const _ = require('lodash');

module.exports = function(app){

    const routers = glob.sync(__dirname + '/src/app/routers/*');
    const _views = glob.sync(__dirname + '/src/app/views/**/*');

    const views = [];

    // 전체 라우트를 등록한다.
    _.forEach(routers, v => {

        var state = fs.lstatSync(v);

        if (state.isDirectory()){
            app.use(require(path.join(v, 'router')));
        }
    });


    // 전체 뷰를 등록한다.
    _.forEach(_views, v => {

        var state = fs.lstatSync(v);

        if (state.isDirectory()){
            views.push(v);
        }
    });

    // view 디렉토리를 설정한다.
    app.set('views', views);

    // view 엔진을 설정한다.
    app.set('view engine', 'pug');
};


