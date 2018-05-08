const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 절대 경로 사용해야한다.
const db = new sqlite3.Database(path.join(__dirname, 'board.db'));

const _ = require('lodash');
const fs = require('fs');
const multiparty = require('multiparty');
const xlsx = require('xlsx');

const tableName = 'PAGE';

const query = {

    select(params, callback){

        const pageNo = params.pageNo;
        const pageSize = params.rowNum;

        const searchName = params.search;

        const sortValues = params.sort;
        const orderValues = params.order;

        const startIdx = (pageNo - 1) * pageSize;

        const sql1 = [];
        const sql2 = [];

        sql1.push(`select * from ${tableName}`);

        if (!_.isEmpty(searchName)) {
            sql1.push(` where name like \'%${searchName}%\'`);
        }

        const sortQuery = [];

        if (!_.isEmpty(sortValues)){

            const sorts = sortValues.split(',');
            const orders = orderValues.split(',');

            sql1.push(` order by ${sortQuery.join(',')}`);

            _.forEach(sorts, (v, k) => {
                sortQuery.push(`${v} ${orders[k]}`);
            });
        }

        if (pageSize) {
            sql1.push(` limit ${startIdx}, ${pageSize}`);
        }

        sql2.push(`select count(*) as total from ${tableName}`);

        if (!_.isEmpty(searchName)) {
            sql2.push(` where name like \'%${searchName}%\'`);
        }

        // 데이터 추출
        db.all(sql1.join(''), (err, datas) => {

            // totalcount 추출
            db.all(sql2.join(''), (err, rows) => {

                callback(err, {
                    "datas": datas,
                    "totalCount": rows[0].total
                });
            });
        });
    },

    create(params, callback){

        const sql = [];

        const items = _.isArray(params.items) ? params.items : [params];

        sql.push(`insert into ${tableName} (name, logCode, logCodeName, salary, stateCode, stateCodeName, testCode, testCodeName) `);
        sql.push('values ');

        const valueQuery = [];

        items.forEach(v => {

            const name = v.name || '';
            const logCode = v.logCode || '';
            const logCodeName = v.logCodeName || '';
            const salary = v.salary || '';
            const stateCode = v.stateCode || '';
            const stateCodeName = v.stateCodeName || '';
            const testCode = v.testCode || '';
            const testCodeName = v.testCodeName || '';

            valueQuery.push(`('${name}','${logCode}','${logCodeName}', '${salary}','${stateCode}','${stateCodeName}','${testCode}','${testCodeName}')`);
        });

        sql.push(valueQuery.join(','));

        db.run(sql.join(''), err => {
            callback(err);
        });
    },

    update(params, callback){

        const sql = [];

        const idx = params.idx || '';
        const name = params.name || '';
        const logCode = params.logCode || '';
        const logCodeName = params.logCodeName || '';
        const salary = params.salary || '';
        const stateCode = params.stateCode || '';
        const stateCodeName = params.stateCodeName || '';
        const testCode = params.testCode || '';
        const testCodeName = params.testCodeName || '';

        sql.push(`update ${tableName} `);
        sql.push(`set name='${name}',`);
        sql.push(` logCode='${logCode}',`);
        sql.push(` logCodeName='${logCodeName}',`);
        sql.push(` salary='${salary}',`);
        sql.push(` stateCode='${stateCode}',`);
        sql.push(` stateCodeName='${stateCodeName}',`);
        sql.push(` testCode='${testCode}',`);
        sql.push(` testCodeName='${testCodeName}' `);
        sql.push(`where idx=${idx}`);

        db.run(sql.join(''), err => {
            callback(err);
        });
    },

    delete(params, callback){

        const sql = [];
        const idxs = [];

        const items = params.items;

        sql.push(`delete from ${tableName} `);
        sql.push(`where idx in (`);

        _.forEach(items, v => {
            idxs.push(`'${v.idx}'`);
        });

        sql.push(idxs.join(','));
        sql.push(`)`);

        db.run(sql.join(''), err => {
            callback(err)
        });
    },

    export(callback){

        const datas = [
            {"Name":"ERNSH3", "logCode":"CODE001", "logCodeName": "BLUE", "date": "20150320181818", "Salary":"112356846.0600", "tel":"029998888", "bzno": "1112233333", "pid": "9010011091296", "card":"1111222233334444", "stateCode": "400", "stateCodeName": "NOT FOUND", "testCode": "1", "testCodeName": "APPLE"},
            {"Name":"FOLKO3", "logCode":"CODE201", "logCodeName": "YELLOW", "date": "20150830191919", "Salary":"3123689.6700", "tel":"029998888", "bzno": "1112233333", "pid": "9010011091296", "card":"1111222233334444", "stateCode": "500", "stateCodeName": "ERROR", "testCode": "3", "testCodeName": "ORANGE"},
            {"Name":"BLONP3", "logCode":"CODE201", "logCodeName": "YELLOW", "date": "20151101202020", "Salary":"5125775.2800", "tel":"029998888", "bzno": "1112233333", "pid": "9010011091296", "card":"1111222233334444", "stateCode": "200", "stateCodeName": "OK", "testCode": "2", "testCodeName": "BANANA"},
            {"Name":"WARTH3", "logCode":"CODE002", "logCodeName": "RED", "date": "20151212212121", "Salary":"258888.7300", "tel":"029998888", "bzno": "1112233333", "pid": "9010011091296", "card":"1111222233334444", "stateCode": "200", "stateCodeName": "OK", "testCode": "1", "testCodeName": "APPLE"},
            {"Name":"FRANK3", "logCode":"CODE001", "logCodeName": "BLUE", "date": "20150801222222", "Salary":"20535778.5800", "tel":"029998888", "bzno": "1112233333", "pid": "9010011091296", "card":"1111222233334444", "stateCode": "500", "stateCodeName": "ERROR", "testCode": "2", "testCodeName": "BANANA"}
        ];

        const result = {
            "datas": datas
        };

        callback(result);
    },

    import(req, callback){

        var form = new multiparty.Form();
        var filename;
        var colModel = {};
        var writeStream;

        form.on('field', function(name, value){

            if (name === 'colModel') {
                colModel = JSON.parse(value);
            }
        });

        form.on('part', function(part){

            var size;

            if (part.filename){

                if (part.filename === 'undefined') part.resume();

                filename = part.filename;
                size = part.byteCount;
            }
            else {
                part.resume();
            }

            console.log('Write Streaming file :' + filename);

            writeStream = fs.createWriteStream( __dirname + '/' + filename);

            writeStream.filename = filename;

            part.pipe(writeStream);

            part.on('data', function(chunk){
                console.log(filename+' read ' + chunk.length + 'bytes');
            });

            part.on('end', function(){
                writeStream.end();
                writeStream.close();
                console.log(filename + ' part read complate');

            });
        });

        form.on('close', function(){

            writeStream.on('close', function () {

                var path = __dirname + '/' + filename;
                var workbook = xlsx.readFile(path);

                var result = toJSON(workbook);

                _.forEach(result, (obj) => {

                    _.map(colModel, (v, k) => {

                        var data = obj[k];

                        if (data){

                            obj[v] = data;

                            if (k !== v){
                                delete obj[k];
                            }
                        }
                    });
                });

                result = {
                    "datas": result
                };

                callback(result);
            });
        });

        form.on('progress', function(byteRead, byteExpected){
            console.log(' Reading total  ' + byteRead + '/' + byteExpected);
        });

        form.on('finish', function(){
            console.log('file downloaded to ', '/tmp/imageresize/');
        });

        form.parse(req);

        function toJSON(workbook) {

            workbook.SheetNames.forEach(function(sheetName) {
                var roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if(roa.length) result = roa;
            });

            return result;
        }
    }
};

module.exports = query;