/**
 * Created by sgjeon on 2017. 8. 8..
 */

const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

router.post('/formSubmit', (req, res) => {
    res.send(JSON.stringify(req.body));
});


module.exports = router;