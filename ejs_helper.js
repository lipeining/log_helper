const _ = require('lodash');
const constants = require('./constants');
const contract = constants.contract;
const assert = require('assert');

function _translateK(translate, k) {
    if(!translate.hasOwnProperty(k)) {
        throw new Error(`no translate for ${k}`);
    }
    if(typeof translate[k] === 'string') {
        return translate[k];
    } else if (typeof translate[k] === 'object') {
        // 这里解析format
    } else {
        return '';
    }
}

function _translateV(translate, k, v) {
    if(!translate.hasOwnProperty(k)) {
        throw new Error(`no translate for ${k}`);
    }
    if (typeof translate[k] !== 'object') {
        return v;   
    }
    // 这里解析format
}

function _genObj(values, options={}) {
    assert(_.isObject(values));
    const contentArr = [];
    const {translate, _parent, showAttrs}= options;
    let depth = options.depth || 0;
    for(const k of showAttrs) {
        if(values.hasOwnProperty(k) && showAttrs.includes(k) && translate.hasOwnProperty(k)) {
            if(_.isArray(values[k])) {
                const newOptions = _.assign(_.cloneDeep(options), {_parent: `${_parent}.${k}`, depth: depth + 1});
                const itemArr = _genArr(values[k], newOptions);
                if(itemArr.length) {
                    const trans = _genStrong(_translateK(translate, k), {});
                    const text = _genText(`${trans}[]:`, {});
                    contentArr.push(text);
                }
                for(const item of itemArr) {
                    contentArr.push(item);
                }
            } else if(_.isObject(values[k])) {
                const newOptions = _.assign(_.cloneDeep(options), {_parent: `${_parent}.${k}`, depth: depth + 1});
                const itemArr = _genObj(values[k], newOptions);
                if(itemArr.length) {
                    const trans = _genStrong(_translateK(translate, k), {});
                    const text = _genText(`${trans}{}:`, {});
                    contentArr.push(text);
                }
                for(const item of itemArr) {
                    contentArr.push(item);
                }
            } else {
                // 普通键值对
                // 这里考虑支持k的格式化输出，现在只是普通的字符串
                const trans = _genStrong(_translateK(translate, k), {});
                const text = _genText(`${trans}:<%= ${_parent}.${k}%>`, {});
                contentArr.push(text);
            }
        }
    }
    return contentArr;
}

function _genArr(values, options={}) {
    assert(_.isArray(values));
    const {translate, _parent, showAttrs}= options;
    let depth = options.depth || 0;
    if(!values.length) {
        return [];
    }
    const contentArr = [];
    contentArr.push(`<ul>`);
    contentArr.push(`<% ${_parent}.forEach(function(item_${depth}){ %>`);
    const item = values[0];
    if(_.isArray(item)) {
        // 二维数组
        const newOptions = _.assign(_.cloneDeep(options), {_parent: `item_${depth}`, depth: depth + 1});
        const itemArr = _genArr(item, newOptions);
        const liStart = _genTagStart('li');
        const liEnd = _genTagEnd('li');
        // 前两个和后两个不需要li包裹 ul,forEach
        for(const [index, item] of itemArr.entries()) {
            if([0, 1, itemArr.length-1, itemArr.length - 2].indexOf(index)===-1) {
                contentArr.push(`${liStart}${item}${liEnd}`);
                // contentArr.push(`${item}`);
            } else {
                contentArr.push(item);
            }
        }
    } else if(_.isObject(item)) {
        const newOptions = _.assign(_.cloneDeep(options), {_parent: `item_${depth}`, depth: depth+1});
        const itemArr = _genObj(item, newOptions);
        const liStart = _genTagStart('li');
        const liEnd = _genTagEnd('li');
        for(const item of itemArr) {
            contentArr.push(`${liStart}${item}${liEnd}`);
        }
        // console.log('here has a obj end');
        // contentArr.push('here has a obj end');
        contentArr.push(`${liStart}${_genText(`-------------`, {})}${liEnd}`);
    } else {
        // 普通常量数组
        // 这里考虑支持k的格式化输出，现在只是普通的字符串
        // translate
        const text = _genText(`<%= item_${depth} %>`, {});
        contentArr.push(text);
    }
    contentArr.push(`<% }); %>`);
    contentArr.push(`</ul>`);
    return contentArr;
}

function _genText(values, options={}) {
    assert(_.isString(values));
    const start = _genTagStart('p', {});
    const end = _genTagEnd('p', {});
    const str = `${start}${values}${end}`;
    return str;
}

function _genStrong(values, options={}) {
    assert(_.isString(values));
    const start = _genTagStart('strong', {});
    const end = _genTagEnd('strong', {});
    const str = `${start}${values}${end}`;
    return str;
}

function _genTime(values, options={}) {
    const date = new Date(values)
    assert(_.isDate(date));
    return _genText(date.toTimeString(), options);
}

function _genPandding(values, options={}) {

}

function _genObjDiff(values, options={}) {
    assert(_.isObject(values));
    const contentArr = [];
    const {translate, _parent, diffAttrs, _define}= options;
    let depth = options.depth || 0;
    const {before, after}= values;
    // k: target.paymentJson
    // k: target.paymentJson.amountType
    // k: target.contentFiles
    // k: target.contentFiles.$
    // k: target.contentFiles.$.fileName
    const filterAttrs = _define.filter(d=>{
        return d._depth === depth;
    }).map(d=>{return d._path;});
    for(const kPath of filterAttrs) {
        if( diffAttrs.indexOf(kPath)!== -1) {
            const explain = _define.find(_v=>{return _v._path=== kPath;});
            if(!explain) {
                throw new Error(`show attributes : ${kPath} : no explain`);
            }
            const path = kPath.split('.').slice(depth+1);
            const beforeV = _.get(before, path);
            const afterV = _.get(after, path);
            if (explain._type === 'Array') {
                const newDiffAttrs = diffAttrs.filter(d=>{
                    return d.startsWith(kPath);
                });
                const diffArr = _genArrDiff({before: beforeV, after: afterV}, {depth: depth+1, translate, _parent: kPath, diffAttrs: newDiffAttrs, _define});
                if(diffArr) {
                    contentArr.push({path: kPath, name: explain._name, diffArr});
                }
            } else if(explain._type === 'Object') {
                const newDiffAttrs = diffAttrs.filter(d=>{
                    return d.startsWith(kPath);
                });
                const objArr = _genObjDiff({before: beforeV, after: afterV}, {depth: depth+1, translate, _parent: kPath, diffAttrs: newDiffAttrs, _define});
                if(objArr.length) {
                    contentArr.push({path: kPath, name: explain._name, children: objArr});
                }
            } else {
                if(!_.isEqual(beforeV, afterV)) {
                    contentArr.push({path: kPath, name: explain._name, beforeV, afterV});
                }
                // contentArr.push({path: kPath, name: explain._name, beforeV, afterV});
            }
        }
    }
    return contentArr;
}

function _genArrDiff(values, options={}) {
    assert(_.isObject(values));
    const contentArr = [];
    const {translate, _parent, diffAttrs, _define}= options;
    let depth = options.depth || 0;
    const {before, after}= values;
    // before,after都是一个数组
    // 是否需要判断对象中类别，Array, Object, String
    // 不考虑一个数组多种类型的元素情况
    // 先不考虑主键问题，纯对象对比
    const filterAttr = _define.find(d=>{
        return d._depth === depth && d._path.startsWith(_parent);
    });
    console.log(filterAttr);
    if(filterAttr._type === 'Array') {

    } else if(filterAttr._type === 'Object') {

    } else {
        // 这个是一个单纯的常量堆组对比.
    }
    // 应该是 // k: target.contentFiles.$
    const childKey = _define.filter(d=>{
        return d._depth === depth+1 && d._path.startsWith(filterAttr._path) && d._type === 'String' && diffAttrs.includes(d._path);
    }).map(d=>{        return d._name;    });
    console.log(childKey);
    const add = _.differenceWith(after, before, (a,b)=>{
        if(childKey.length) {
            return _.isEqual(_.pick(a, childKey), _.pick(b, childKey));
        } else {
            return _.isEqual(a,b);
        }
    });
    const edit = _.intersectionWith(before, after, (a,b)=>{
        if(childKey.length) {
            return _.isEqual(_.pick(a, childKey), _.pick(b, childKey));
        } else {
            return _.isEqual(a,b);
        }
    });
    const del = _.differenceWith(before, after, (a,b)=>{
        if(childKey.length) {
            return _.isEqual(_.pick(a, childKey), _.pick(b, childKey));
        } else {
            return _.isEqual(a,b);
        }
    });
    return {add, edit, del};
}

function _genTagStart(tag, options={}) {
    assert(_.isString(tag));
    const attrs = [];
    // options是该标签的属性
    for(const k in options) {
        attrs.push(`${k}="${options[k]}"`);
    }
    return `<${tag} ${attrs.join(' ')}>`;
}

function _genTagEnd(tag, options={}) {
    assert(_.isString(tag));
    return `</${tag}>`;
}

module.exports = {genObj: _genObj, genObjDiff: _genObjDiff};



