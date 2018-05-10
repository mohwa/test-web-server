/**
 * Created by sgjeon on 2017. 8. 8..
 */

const express = require('express');
const router = express.Router();

router.get('/suggest/search', _search);
router.post('/suggest/search', _search);

/**
 *
 * @param req
 * @param res
 * @private
 */
function _search(req, res){

    const body = req.body;

    const items = [
        '가생이닷컴이지롱',
        '가생이닷컴',
        '전성균가생이병신가생이등신',
        '전성균가 이 등신',
        '강형욱',
        'a가새가 기울었어',
        '나진수',
        '강수량',
        '전성균',
        '가상화폐',
        '갓오브워',
        '전모질이',
        '전모질현',
        '문기현',
        '사기꾼',
        'abcsd',
        'abcd1111',
        '2223abcd'
    ];

    console.log(body);

    let ret = items;

    res.send(ret);
}


module.exports = router;