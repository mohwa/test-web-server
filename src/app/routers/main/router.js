/**
 * Created by sgjeon on 2017. 8. 8..
 */

const express = require('express');
const router = express.Router();

router.get('/', main);

// main render
function main(req, res){
    res.render('main');
}


module.exports = router;