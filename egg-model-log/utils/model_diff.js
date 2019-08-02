/**
 * 回调函数的参数描述
 * @param {*} value
 * @param {Array} path
 * @param {Object} parent
 * @param {Object} root
 * @returns {String|Boolean}
 * function callback(value, path, parent, root) {
 * 
 * }
 */
// 无法处理 Symbol
// _vfmt 表示的是这个值的format格式 str or function callback
// _kfmt 表示的是这个键的format格式 str or function callback
// _kshow 表示的是这个键是否show    str or function callback 默认 true
// _vshow 表示的是这个值是否show    str or function callback 默认 true
// _vtype 表示的是值的类型 string,number,date,array,object,
const TestModels = {
    user: {
        _kfmt: '用户', // str or function
        _kshow: () => { return true; },
        _vshow: () => { return true; },
        nickName: {
            _vfmt: (value, path, parent, root) => {
                return `昵称前缀${parent.nickName}`;
            },
            _kfmt: '昵称',
            _kshow: () => {
                return false;
            },
            _vshow: () => { return false; }
        },
        userImcode: {
            _kfmt: '用户名',
            _vfmt: (value, path, parent, root) => {
                // return JSON.stringify(root);
                return `${parent.nickName}<${parent.userImcode}>`;
                // return value;
            }
        },
        arr1: {
            // _kshow: () => { return false; },
            // _vshow: () => { return false; },
            _kfmt: 'arr1',
            _vfmt: (value, path, parent, root) => {
                // return JSON.stringify(parent);
                return JSON.stringify(value);
            },
            '0': {
                // _kshow: () => { return false; },
                // _vshow: () => { return false; },
                _kfmt: 'arr1.$',
                _vfmt: (value, path, parent, root) => {
                    // return JSON.stringify(parent);
                    return JSON.stringify(value);
                },
                '0': {
                    _kfmt: 'arr1.$.$',
                    _vfmt: (value, path, parent, root) => {
                        // return parent.join(',');
                        return value;
                    },
                    // _kshow: () => { return false; },
                    // _vshow: () => { return false; }
                }
            }
        },
        arr2: {
            _kfmt: 'arr2',
            _vfmt: (value, path, parent, root) => {
                // return parent.arr2.join(',');
                return JSON.stringify(value);
            },
            _vshow: () => { return true; },
            '0': {
                cost: {
                    _kfmt: 'arr2.$.花费',
                    _vfmt: (value, path, parent, root) => {
                        // return `${parent.cost}`;
                        return value;
                    },
                }
            }
        },
        arr3: {
            _kfmt: 'arr3',
            _vfmt: (value, path, parent, root) => {
                // return parent.arr3.map(c => { return c.cost3; }).join(',');
                return JSON.stringify(value);
            },
            _vshow: () => { return true; },
            '0': {
                cost3: {
                    _kfmt: 'arr3.$.花费3',
                    _vfmt: (value, path, parent, root) => {
                        // return `${parent.cost3}`;
                        return value;
                    },
                }
            }
        },
        arr4: {
            _kfmt: 'arr4',
            _vfmt: (value, path, parent, root) => {
                // return parent.arr4.map(c => { return c.cost4; }).join(',');
                return JSON.stringify(value);
            },
            _vshow: () => { return true; },
            '0': {
                cost4: {
                    _kfmt: 'arr4.$.花费4',
                    _vfmt: (value, path, parent, root) => {
                        // return `${parent.cost4}`;
                        return value;
                    },
                }
            }
        }
    },
};
// 数组元素是否需要加一个 index 参数，表示在第几层，第几个下标
const assert = require('assert');
const _ = require('lodash');
const deepDiff = require('deep-diff');
const defaultShow = () => { return true; };
const debug = console.log();
class ModelDiff {
    constructor(options) {
        assert(options && options.models, 'options.models is required');
        this.models = options.models;
    }
    diff(model, left, right) {
        assert(model && _.isString(model), 'model is required');
        assert(left && _.isObject(left), 'left is required');
        assert(right && _.isObject(right), 'left is required');
        const differences = deepDiff.diff(left, right);
        // debug(JSON.stringify(differences, null));
        const modelDef = this.models[model];
        const arr = differences.map(difference => {
            if (['N', 'D', 'E'].includes(difference.kind)) {
                return this.parseObj(modelDef, difference, left, right);
            } else {
                // type of array
                return this.parseArr(modelDef, difference, left, right);
            }
        }).filter(Boolean);
        return arr.join('\n');
    }
    toFun(input) {
        if (!_.isFunction(input)) {
            return () => { return input; };
        } else {
            return input;
        }
    }
    parseObj(model, difference, left, right) {
        const path = difference.path;
        const arr = [];
        const lhs = difference.lhs;
        const rhs = difference.rhs;
        const key = path[path.length - 1]; // 有可能是下标 数字
        const leftParent = _.get(left, path.slice(0, path.length - 1), left); // 如果 path.length 为 1, 取本身
        const rightParent = _.get(right, path.slice(0, path.length - 1), right); // 如果 path.length 为 1, 取本身
        const leftValue = _.get(leftParent, [key]); // 默认 undefined
        const rightValue = _.get(rightParent, [key]); // 默认 undefined
        const arr2objPath = path.map(k => { if (_.isNumber(k)) { return '0'; } return k; });
        const _kfmt = this.toFun(_.get(model, [...arr2objPath, '_kfmt'], key));
        const _vfmt = this.toFun(_.get(model, [...arr2objPath, '_vfmt'], (value, path, parent, root) => { return parent[key]; }));
        const _kshow = this.toFun(_.get(model, [...arr2objPath, '_kshow'], defaultShow));
        const _vshow = this.toFun(_.get(model, [...arr2objPath, '_vshow'], defaultShow));
        // 构造 parent 传入回调函数中
        // debug(path);
        // debug(arr2objPath);
        // debug(leftParent);
        // debug(rightParent);
        if (difference.kind === 'N') {
            if (_kshow(rightValue, path, rightParent, right)) {
                arr.push(_kfmt(rightValue, path, rightParent, right));
                arr.push('：');
            }
            if (_vshow(rightValue, path, rightParent, right)) {
                arr.push(_vfmt(rightValue, path, rightParent, right));
                arr.unshift('新增：');
            }
        } else if (difference.kind === 'D') {
            if (_kshow(leftValue, path, leftParent, left)) {
                arr.push(_kfmt(leftValue, path, leftParent, left));
                arr.push('：');
            }
            if (_vshow(leftValue, path, leftParent, left)) {
                arr.push(_vfmt(leftValue, path, leftParent, left));
                arr.unshift('删除：');
            }
        } else {
            if (_kshow(leftValue, path, leftParent, left)) {
                arr.push(_kfmt(leftValue, path, leftParent, left));
                arr.push('：');
            }
            if (_vshow(leftValue, path, leftParent, left)) {
                arr.push(_vfmt(leftValue, path, leftParent, left));
                arr.push('->');
                arr.push(_vfmt(rightValue, path, rightParent, right));
                // arr.unshift('编辑：');
            }
        }
        return arr.join('');
    }
    parseArr(model, difference, left, right) {
        const path = difference.path;
        const arr = [];
        const lhs = difference.lhs;
        const rhs = difference.rhs;
        const key = path[path.length - 1]; // 有可能是下标 数字
        const index = difference.index;
        const item = difference.item;
        const leftParent = _.get(left, path, left);
        const rightParent = _.get(right, path, right);
        const leftValue = _.get(leftParent, [index]); // 默认 undefined
        const rightValue = _.get(rightParent, [index]); // 默认 undefined
        const arr2objPath = path.map(k => { if (_.isNumber(k)) { return '0'; } return k; });
        const _kfmt = this.toFun(_.get(model, [...arr2objPath, '_kfmt'], key));
        const _vfmt = this.toFun(_.get(model, [...arr2objPath, '_vfmt'], (value, path, parent, root) => { return parent[key]; }));
        const _kshow = this.toFun(_.get(model, [...arr2objPath, '_kshow'], defaultShow));
        const _vshow = this.toFun(_.get(model, [...arr2objPath, '_vshow'], defaultShow));
        // 构造 parent 传入回调函数中
        // debug(path);
        // debug(arr2objPath);
        // debug(leftParent);
        // debug(rightParent);
        // debug(rightValue);
        if (item.kind === 'N') {
            if (_kshow(rightValue, path, rightParent, right)) {
                arr.push(_kfmt(rightValue, path, rightParent, right));
                arr.push('：');
            }
            if (_vshow(rightValue, path, rightParent, right)) {
                arr.push(_vfmt(rightValue, path, rightParent, right));
                arr.unshift(`新增第${index+1}个元素：`);
            }
        } else {
            if (_kshow(leftValue, path, leftParent, left)) {
                arr.push(_kfmt(leftValue, path, leftParent, left));
                arr.push('：');
            }
            if (_vshow(leftValue, path, leftParent, left)) {
                arr.push(_vfmt(leftValue, path, leftParent, left));
                arr.unshift(`删除第${index+1}个元素：`);
            }
        }
        return arr.join('');
    }
};
ModelDiff.TestModels = TestModels;
module.exports = ModelDiff;