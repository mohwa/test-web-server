/**
 * Created by sgjeon on 2017. 8. 8..
 */

const _ = require('lodash');
const express = require('express');
const router = express.Router();

const query = require('./query');

// CRUD API
// Create
router.post('/grid/create', _create);

// Read API
router.get('/grid/read', _read.bind(this, 'get'));
router.post('/grid/read', _read.bind(this, 'post'));

// Update API
router.put('/grid/update', _update);
router.post('/grid/update', _update);

// Delete API
router.delete('/grid/delete', _delete);
router.post('/grid/delete', _delete);

// export API
router.get('/grid/export', _export);
router.post('/grid/export', _export);

// import API
router.post('/grid/import', _import);

function _create(req, res){

    const body = req.body;

    query.create(body, (err) => {

        var ret = {ret: 1};

        if (err) ret = err;

        res.send(ret);
    });
}


function _read(method, req, res){

    const body = _getBody(method, req);

    query.select(body, (err, data) => {

        var ret = data;

        if (err) ret = err;

        res.send(ret);
    });
}

function _update(req, res){

    const body = req.body.data;

    query.update(body, (err) => {

        var ret = {ret: 1};

        if (err) ret = err;

        res.send(ret);
    });
}

function _delete(req, res){

    const body = req.body.data;

    query.delete(body, (err) => {

        var ret = {ret: 1};

        if (err) ret = err;

        res.send(ret);
    });
}

function _export(req, res){

    query.export((data) => {

        var ret = data;

        res.send(ret);
    });
}

function _import(req, res){

    query.import(req, (result) => {

        var ret = result;

        res.set('Content-Type', 'text/html');
        res.status(200).send(ret);
    });
}

function _getBody(method, req){
    return method === 'get' ? req.query : req.body.data;
}

module.exports = router;