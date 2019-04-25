
// reduce函数的说明
// reducer 函数接收4个参数:
// Accumulator (acc) (累计器)
// Current Value (cur) (当前值)
// Current Index (idx) (当前索引)
// Source Array (src) (源数组)
// 您的 reducer 函数的返回值分配给累计器，该返回值在数组的每个迭代中被记住，并最后成为最终的单个结果值。

// arr.reduce(callback[, initialValue])
// 回调函数第一次执行时，accumulator 和currentValue的取值有两种情况：如果调用reduce()时提供了initialValue，
// accumulator取值为initialValue，currentValue取数组中的第一个值；
// 如果没有提供 initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值。
// 如果数组为空且没有提供initialValue，会抛出TypeError 。如果数组仅有一个元素（无论位置如何）并且没有提供initialValue，
// 或者有提供initialValue但是数组为空，那么此唯一值将被返回并且callback不会被执行。

/**
 * {
    "contractName": "edit-name",
    "paymentJson": {
        "amountType": 2,
        "balancePayment": {
        "circle": 2
        },
        "balanceTime": 1000
    },
    "contentFiles": {
        "0": {
        "fileName": "edit-file"
        },
        "1": {
        "User": {
            "nickName": "file-user-2"
        }
        }
    },
    "ext": {
        "0": {
        "4": 6
        }
    },
    "files": {
        "0": {
        "1": {
            "fileId": 2,
            "fileName": "filesName2"
        }
        }
    },
    "oneDirection": {
        "0": 4,
        "1": 5,
        "2": 6
    }
    }
*/


var diff = function diff(lhs, rhs) {
    if (lhs === rhs) return {}; // equal return no diff

    // 这里是普通的常量对比，直接返回不同之处即可
    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs; // return updated rhs

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    // 检查左边有的key,如果右边也有的话，不添加，如果没有，添加为[key:undefined],
    // 这里只针对第一层属性，递归的处理在之后的递归中
    var deletedValues = Object.keys(l).reduce(function (acc, key) {
      return r.hasOwnProperty(key) ? acc : _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});

    // 如果其中一个为Date的话，上面是不会有deleteValues
    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    // 以删除的属性作为初始值。递归diff获得次级的diff
    return Object.keys(r).reduce(function (acc, key) {
      if (!l.hasOwnProperty(key)) return _extends({}, acc, _defineProperty({}, key, r[key])); // return added r key

      var difference = diff(l[key], r[key]);

      if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc; // return no diff

      return _extends({}, acc, _defineProperty({}, key, difference)); // return updated key
    }, deletedValues);
  };


  var addedDiff = function addedDiff(lhs, rhs) {

    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(r).reduce(function (acc, key) {
      if (l.hasOwnProperty(key)) {
        var difference = addedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return _extends({}, acc, _defineProperty({}, key, r[key]));
    }, {});
  };

  var myDeletedDiff = function myDeletedDiff(lhs, rhs) {

    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(l).reduce(function (acc, key) {
      if (r.hasOwnProperty(key)) {
        var difference = myDeletedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});
  };

  var deletedDiff = function deletedDiff(lhs, rhs) {
    if (lhs === rhs || !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return {};

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    return Object.keys(l).reduce(function (acc, key) {
      if (r.hasOwnProperty(key)) {
        var difference = deletedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return _extends({}, acc, _defineProperty({}, key, undefined));
    }, {});
  };

  var myUpdatedDiff = function myUpdatedDiff(lhs, rhs) {
    if(lhs === rhs) return {};
    if ( !(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs;

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);
    // if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
    //     if (l.valueOf() == r.valueOf()) return {};
    //     return r;
    // }
    return Object.keys(r).reduce(function (acc, key) {
        // 左右都有才比较
        if (l.hasOwnProperty(key)) {
            var difference = myDeletedDiff(l[key], r[key]);
    
            if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc;
    
            return _extends({}, acc, _defineProperty({}, key, difference));
          }
    
          return acc;
    }, {});
  };

  var updatedDiff = function updatedDiff(lhs, rhs) {

    if (lhs === rhs) return {};

    if (!(0, _utils.isObject)(lhs) || !(0, _utils.isObject)(rhs)) return rhs;

    var l = (0, _utils.properObject)(lhs);
    var r = (0, _utils.properObject)(rhs);

    if ((0, _utils.isDate)(l) || (0, _utils.isDate)(r)) {
      if (l.valueOf() == r.valueOf()) return {};
      return r;
    }

    return Object.keys(r).reduce(function (acc, key) {

      if (l.hasOwnProperty(key)) {
        var difference = updatedDiff(l[key], r[key]);

        if ((0, _utils.isObject)(difference) && (0, _utils.isEmpty)(difference) && !(0, _utils.isDate)(difference)) return acc;

        return _extends({}, acc, _defineProperty({}, key, difference));
      }

      return acc;
    }, {});
  };


