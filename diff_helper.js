const _ = require('lodash');


// 现在只支持普通的translate,arrKeys
// 是否需要考虑symbol
/**
 * 
 * @param {*} left 
 * @param {*} right 
 * @param {*} options translate,arrKeys
 * @param {*} formats depth, padding
 */
function diffObject(left, right, options={}, formats = {depth: 0, padding: '  '}) {
    const details = [];
    _.map(left, function (value, key){
        if(!right.hasOwnProperty(key)) {
            details.push({key, type: 'remove', before: value, after: null});
        }
        if(right.hasOwnProperty(key)&&!_.isEqual(value, right[key])) {
            details.push({key, type: 'edit', before: value, after: right[key]});
        }
    });
    _.map(right, function (value, key){
        if(!left.hasOwnProperty(key)) {
            details.push({key, type: 'add', before: null, after: right[key]});
        }
    });
    const {translate} = options;
    const {depth, padding} = formats;
    const contentArr = [];
    for(const detail of details) {
        // 如果想要翻译一个子数据，必须传入父数据
        if(translate.hasOwnProperty(detail.key)) {
            if(detail.type==='remove') {
                if(_.isArray(detail.before)) {
                    const str = flattenArray(detail.before, options);
                    if(str) {
                        contentArr.push(`${padding.repeat(depth)}删除数组[${translate[detail.key]}] \n${str}`);
                    }
                } else if(_.isObject(detail.before)) {
                    const str = flattenObject(detail.before, options);
                    if(str) {
                        contentArr.push(`${padding.repeat(depth)}删除[${translate[detail.key]}] \n${str}`);
                    }
                } else {
                    contentArr.push(`${padding.repeat(depth)}删除[${translate[detail.key]}]: ${detail.before}`);
                }
            } else if(detail.type==='add') {
                if(_.isArray(detail.after)) {
                    const str = flattenArray(detail.after, options);
                    if(str) {
                        contentArr.push(`${padding.repeat(depth)}添加数组[${translate[detail.key]}] \n${str}`);
                    }
                } else if(_.isObject(detail.after)) {
                    const str = flattenObject(detail.after, options);
                    if(str) {
                        contentArr.push(`${padding.repeat(depth)}添加[${translate[detail.key]}] \n${str}`);
                    }
                } else {
                    contentArr.push(`${padding.repeat(depth)}添加[${translate[detail.key]}]: ${detail.after}`);
                }
            } else {
                if(_.isArray(detail.after)) {
                    const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
                    const str = diffArray(detail.before, detail.after, options, newFormats);
                    if(str) {
                        contentArr.push(`\n${padding.repeat(depth)}编辑数组[${translate[detail.key]}] \n${str}`);
                    }
                } else if(_.isObject(detail.after)) {
                    const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
                    const str = diffObject(detail.before, detail.after, options, newFormats);
                    if(str) {
                        contentArr.push(`\n${padding.repeat(depth)}[${translate[detail.key]}] \n${str}`);
                    }
                } else {
                    contentArr.push(`\n${padding.repeat(depth)}[${translate[detail.key]}]: ${detail.before} -> ${detail.after}`);
                }
            }
        }
    }
    return contentArr.join('\n');
}

// 不考虑二维数组的添加删除编辑
/**
 * 
 * @param {*} left 
 * @param {*} right 
 * @param {*} options translate,arrKeys
 * @param {*} formats depth, padding
 */
function diffArray(left, right, options= {}, formats = {depth: 0, padding: '  '}) {
    const {translate, arrKeys} = options;
    const {depth, padding} = formats;
    const keys = _.union(_.keys(left[0]||{}), _.keys(right[0]||{}));
    const inters = _.intersection(arrKeys, keys);
    const add = _.differenceWith(right, left, function(a, b){
        if(inters.length) {
            return _.isEqual(_.pick(a, inters), _.pick(b, inters));
        } else {
            return _.isEqual(a, b);
        }
    });
    const edit = _.intersectionWith(left, right, function(a, b){
        if(inters.length) {
            return _.isEqual(_.pick(a, inters), _.pick(b, inters)) && !_.isEqual(a, b);
        } else {
            return _.isEqual(a, b);
        }
    });
    const del = _.differenceWith(left, right, function(a, b){
        if(inters.length) {
            return _.isEqual(_.pick(a, inters), _.pick(b, inters));
        } else {
            return _.isEqual(a, b);
        }
    });
    const contentArr = [];
    for(const item of add) {
        if(inters.length) {
            const str = flattenObject(item, options);
            if(str) {
                contentArr.push(`${padding.repeat(depth)}添加 ${str}`);
            }
        } else if(translate.hasOwnProperty(item)){
            contentArr.push(`${padding.repeat(depth)}添加 ${translate[item]}`);
        } else {
            contentArr.push(`${padding.repeat(depth)}添加 ${item}`);
        }
    }
    for(const item of del) {
        if(inters.length) {
            const str = flattenObject(item, options);
            if(str) {
                contentArr.push(`${padding.repeat(depth)}删除 ${str}`);
            }
        } else if(translate.hasOwnProperty(item)){
            contentArr.push(`${padding.repeat(depth)}删除 ${translate[item]}`);
        } else {
            contentArr.push(`${padding.repeat(depth)}删除 ${item}`);
        }
    }
    for(const item of edit) {
        if(inters.length) {
            const newItem = right.find(function (o){
                return _.isEqual(_.pick(o, inters), _.pick(item, inters));
            });
            const newFormats = _.assign(_.cloneDeep(formats), {depth: depth+1});
            const diff = diffObject(item, newItem, options, newFormats);
            if(diff) {
                const keyName = inters.map(function(key) {
                    return translate[key];
                }).join(',');
                contentArr.push(`${keyName ? `${padding.repeat(depth)}编辑[${keyName}]`: '编辑'} ${diff}`);
            }
        } else {
            // 常量的edit，不会出现
        }
    }
    return contentArr.join(';');
}
/**
 * 
 * @param {*} obj 
 * @param {*} options translate
 */
function flattenObject(obj, options={}) {
    const {translate} = options;
    const contentArr = [];
    for(const key in obj) {
        if(obj.hasOwnProperty(key)) {
            if(_.isArray(obj[key])) {
                const str = flattenArray(obj[key], options);
                if(str) {
                    contentArr.push(`${translate[key] ? `数组[${translate[key]}]:`: ''}${str}`);
                }
            } else if(_.isObject(obj[key])) {
                const str = flattenObject(obj[key], options);
                if(str) {
                    contentArr.push(str);
                }
            } else {
                // 普通的键值对
                if(translate.hasOwnProperty(key)) {
                    contentArr.push(`${translate[key]}:${obj[key]}`);
                }
            }
        }
    }
    return contentArr.join(';');
}

/**
 * 
 * @param {*} arr 
 * @param {*} options translate
 */
function flattenArray(arr,options={}) {
    const {translate} = options;
    const contentArr = [];
    for(const item of arr) {
        if(_.isArray(item)) {
            const str = flattenArray(item, options);
            if(str) {
                contentArr.push(str);
            }
        } else if(_.isObject(item)) {
            const str = flattenObject(item, options);
            if(str) {
                contentArr.push(str);
            }
        } else {
            // 单纯的常量，考虑枚举
            if(translate.hasOwnProperty(item)) {
                contentArr.push(`${translate[item]}`);
            } else {
                contentArr.push(`${item}`);
            }
        }
    }
    return contentArr.join(';');
}


module.exports = {diffObject, flattenObject};
