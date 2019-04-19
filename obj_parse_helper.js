const _ = require('lodash');
const delimiter = {
    'Array': '*',
    'Object': '$',
    'String': '#',
};
/**
 * 只解析纯对象，返回对应键的树形描述,对于事件戳型数据可以解析否？
 * 是否可以展开为一维数组
 * @param {Object} values 
 * @param {Object} options 
 */
function parseAttr(values, options={parent : '', depth: 0}) {
    const res = [];
    const keys = Object.keys(values);
    const {parent, depth} = options;
    for(const key of keys) {
        if(_.isArray(values[key])) {
            res.push({_path: `${parent}.${key}`, _name: `${key}`, _depth: depth, _type: 'Array' });
            const objArr = parseArr(values[key], {parent: `${parent}.${key}`, depth: depth+1});
            for(const oa of objArr) {
                res.push(oa);
            }
        } else if (_.isObject(values[key])) {
            res.push({_path: `${parent}.${key}`, _name: `${key}`, _depth: depth, _type: 'Object'});
            const objArr = parseAttr(values[key], {parent: `${parent}.${key}`, depth: depth+1});
            for(const oa of objArr) {
                res.push(oa);
            }
        } else {
            res.push({_path: `${parent}.${key}`, _name: `${key}`, _depth: depth, _type: 'String'});
        }
    }
    return res;
}
function parseArr(values, options = {}) {
    if(!values.length) {
        return [];
    }
    const item = values[0];
    const {parent, depth} = options;
    const res = [];
    if(_.isArray(item)) {
        res.push({_path: `${parent}.${delimiter.Array}`, _name: `${delimiter.Array}`, _depth: depth, _type: 'Array'});
        const objArr = parseArr(item, {parent: `${parent}.${delimiter.Array}`, depth: depth+1});
        for(const oa of objArr) {
            res.push(oa);
        }
    } else if (_.isObject(item)) {
        res.push({_path: `${parent}.${delimiter.Object}`, _name: `${delimiter.Object}`, _depth: depth, _type: 'Object'});
        const objArr = parseAttr(item, {parent: `${parent}.${delimiter.Object}`, depth: depth+1});
        for(const oa of objArr) {
            res.push(oa);
        }
    } else {
        res.push({_path: `${parent}.${delimiter.String}`, _name: `${delimiter.String}`, _depth: depth, _type: 'String'});
        // 或者空
    }
    return res;
}

module.exports = {parseAttr};