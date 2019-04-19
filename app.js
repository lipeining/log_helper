const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
const constants = require('./constants');
const strHelper = require('./str_helper');
const ejsHelper = require('./ejs_helper');
const objParseHelper = require('./obj_parse_helper');
const path = require('path');
const viewPath = path.join(__dirname, 'views');
if(!fs.existsSync(viewPath)) {
    fs.mkdirSync(viewPath);
}


app.set('view engine', 'ejs');

app.get('/helper', (req, res) => {
    if(!req.query.id) {
        return res.json({ req});
    }
    if(!req.query.type) {
        return res.json({ req});
    }
    const id = req.query.id;
    const type = req.query.type;
    const types = {'str': strHelper, 'ejs': ejsHelper, 'pug': ''};
    if(!Object.keys(types).includes(type)) {
        return res.json({req});
    }
    if(!constants[id]) {
        return res.json({req});
    }
    const target = constants[id];
    const translate = target.translate;
    const showAttrs = target.showAttrs;
    let targetArr = [];
    let result;
    // console.log(objParseHelper.parseAttr(target, {parent: 'target', depth: 0}));
    if(type === 'str') {
        targetArr = strHelper.genObj(target, {showAttrs, translate}, {padding: '==>', depth: 0});
        result = ejs.render(targetArr.join('\n'));
    } else if(type==='ejs') {
        targetArr = ejsHelper.genObj(target, {showAttrs, translate, _parent: 'target'});
        // console.log(targetArr);
        const _define = objParseHelper.parseAttr(target, {parent: 'target', depth: 0});
        const diffAttrs = _define.filter(d=>{
            return ['target.contentFiles.$.contractFileId', 'target.contentFiles.$.createTime'].indexOf(d._path) === -1;
        }).map(d=>{
            return d._path;
        });
        const before = _.cloneDeep(target);
        const after = _.cloneDeep(target);
        after.contractName = 'edit-name';
        after.paymentJson.amountType = 2;
        after.paymentJson.balancePayment.circle = 2;
        after.contentFiles[0].fileName = 'edit-file';
        const diffArr = ejsHelper.genObjDiff({before, after}, {diffAttrs, translate, _parent: 'target', _define, depth: 0 });
        console.log(JSON.stringify(diffArr, null ,2));
        // console.log(_define);
        result = ejs.render(targetArr.join('\n'), {target});
    }
    
    // const fileName = `str_${id}.ejs`;
    // fs.writeFile(path.join(__dirname, 'views', fileName), targetArr.join('\n'), (err)=>{
    //     if(err) {
    //         return res.json({err});
    //     } else {
    //         return res.render(fileName);
    //     }
    // });

    
    return res.send(result);
    //   res.render('index', {foo: 'FOO'});
});

app.listen(4000, () => console.log('Example app listening on port 4000!'));