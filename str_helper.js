const _ = require('lodash');
const constants = require('./constants');
const contract = constants.contract;
const assert = require('assert');
const fs = require('fs');

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
    return `format_${v}`;
}

function _genObj(values, options={}, formats = {padding: ' ', depth: 0}) {
    assert(_.isObject(values));
    const contentArr = [];
    const {showAttrs, translate}= options;
    const {depth, padding} = formats;
    for(const k in values) {
        if(values.hasOwnProperty(k) && showAttrs.includes(k) && translate.hasOwnProperty(k)) {
            if(_.isArray(values[k])) {
                const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
                const itemArr = _genArr(values[k], options, newFormats);
                if(itemArr.length) {
                    const trans = _genStrong(_translateK(translate, k), {});
                    const text = _genText(`${padding.repeat(depth)}${trans}[]:`, {});
                    contentArr.push(text);
                }
                for(const item of itemArr) {
                    contentArr.push(item);
                }
            } else if(_.isObject(values[k])) {
                const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
                const itemArr = _genObj(values[k], options, newFormats);
                if(itemArr.length) {
                    const trans = _genStrong(_translateK(translate, k), {});
                    const text = _genText(`${padding.repeat(depth)}${trans}{}:`, {});
                    contentArr.push(text);
                }
                for(const item of itemArr) {
                    contentArr.push(item);
                }
            } else {
                // 普通键值对
                // 这里考虑支持k的格式化输出，现在只是普通的字符串
                const transK = `${_translateK(translate, k)}`;
                const transV = `${_translateV(translate, k, values[k])}`;
                const text = _genText(`${padding.repeat(depth)}${transK}:${transV}`, {});
                contentArr.push(text);
            }
        }
    }
    return contentArr;
}

function _genArr(values, options={}, formats = {padding:' ', depth:0}) {
    assert(_.isArray(values));
    const contentArr = [];
    const {translate}= options;
    const {depth, padding} = formats;
    for(const item of values) {
        if(_.isArray(item)) {
            // 二维数组
            const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
            const itemArr = _genArr(item, options, newFormats);
            for(const item of itemArr) {
                contentArr.push(item);
            }
        } else if(_.isObject(item)) {
            const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
            const itemArr = _genObj(item, options, newFormats);
            for(const item of itemArr) {
                contentArr.push(item);
            }
            contentArr.push(_genText(`${padding.repeat(depth+1)}-------------`, {}));
        } else {
            // 普通常量数组
            // 这里考虑支持k的格式化输出，现在只是普通的字符串
            // translate
            // const transv = `${_translateV(translate, k, values[k])}`;
            const text = _genText(`${padding.repeat(depth)}${item}`, {});
            contentArr.push(text);
        }
    }
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

function _genPadding(values, options={}) {
    return '';
}

function _genDiff(values, options={}) {

}

function _genTagStart(tag, options={}) {
    assert(_.isString(tag));
    const attrs = [`${tag}`];
    // options是该标签的属性
    for(const k in options) {
        attrs.push(`${k}="${options[k]}"`);
    }
    // return `<${tag} ${attrs.join(' ')}>`;
    return `<${attrs.join(' ')}>`;
}

function _genTagEnd(tag, options={}) {
    assert(_.isString(tag));
    return `</${tag}>`;
}
// const translate = contract.translate;
// const contractArr = _genObj(contract, {translate}, {padding: ' ', depth: 0});
// console.log(contractArr);

module.exports = {genObj: _genObj};
// fs.writeFile('str_helper.html', contractArr.join('\n'));
