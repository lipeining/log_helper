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
/**
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
  }
**/

const Model = {

    userId: {
        _kfmt: '用户主键',
        _kshow: (value, path, parent, root) => {
            return false;
        },
        _vfmt: (value, path, parent, root) => {
            return JSON.stringify(value);
        },
        _vshow: (value, path, parent, root) => {
            return false;
        },
    },

    nickName: {
        _kfmt: '用户昵称',
        _kshow: (value, path, parent, root) => {
            return true;
        },
        _vfmt: (value, path, parent, root) => {
            return JSON.stringify(value);
        },
        _vshow: (value, path, parent, root) => {
            return true;
        },
    },

    userImcode: {
        _kfmt: '用户火星号',
        _kshow: (value, path, parent, root) => {
            return true;
        },
        _vfmt: (value, path, parent, root) => {
            return JSON.stringify(value);
        },
        _vshow: (value, path, parent, root) => {
            return true;
        },
    },

    email: {
        _kfmt: '用户邮箱',
        _kshow: (value, path, parent, root) => {
            return true;
        },
        _vfmt: (value, path, parent, root) => {
            return JSON.stringify(value);
        },
        _vshow: (value, path, parent, root) => {
            return true;
        },
    },

    createTime: {
        _kfmt: '创建时间',
        _kshow: (value, path, parent, root) => {
            return true;
        },
        _vfmt: (value, path, parent, root) => {
            return new Date(value);
        },
        _vshow: (value, path, parent, root) => {
            return true;
        },
    },

};
module.exports = Model;