const ModelDiff = require('./utils/model_diff');


const app = {
    modelDiff: new ModelDiff({ models: ModelDiff.TestModels })
};
const ASym = Symbol.for('User#A');
const left = {
    nickName: '小张',
    userImcode: 1111,
    arr1: [
        [0],
        [1],
        [3],
        [4, [44]]
    ],
    [ASym]: 100,
    arr2: [{ id: 1, cost: 10 }],
    arr3: [{ id: 1, cost3: 33 }]
};
const right = {
    nickName: '小明',
    userImcode: 1211,
    arr1: [
        [1],
        [2],
        [3],
        [4],
        [
            [
                [5]
            ]
        ]
    ],
    arr2: [{ id: 1, cost: 11 }],
    arr4: [{ id: 1, cost4: 44 }]
};
const resEdit = app.modelDiff.diff('user', left, right);
console.log(resEdit);
// const resAdd = app.modelDiff.diff('user', {}, right);
// console.log(resAdd);
// const resDel = app.modelDiff.diff('user', left, {});
// console.log(resDel);