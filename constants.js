const contract = {
    contractId: 1,
    contractName: 'one contract',
    createTime: 22222222222,
    paymentJson: {
        amountType: 3,
        balanceAmount: 32432.00,
        balancePayment: {
            circle: 3,
            type: 2,
        },
        prePaid: 1,
        prePaidAmount: 34324,
    },
    contentFiles: [
        {
            contractFileId: 1,
            fileName: 'dfdadf.doc',
            filePath: 'dfdadfs.doc',
            createTime: 32434324324,
            deleteTime: 0,
            User: {
                userId: 1,
                nickName: 'useress',
                userImcode: 1111,
            },
        },
        {
            contractFileId: 2,
            fileName: 'df222.doc',
            filePath: 'dfd222.doc',
            createTime: 324343243323,
            deleteTime: 0,
            User: {
                userId: 1,
                nickName: 'user2',
                userImcode: 2222,
            },
        },
    ],
    ConFirst: {
        conFirstId: 1,
        typeNumber: 1,
        typeName: '1级分类',
        createTime: 2334324342,
        disable: 0,
    },
    // ext: [
    //     [1,2,3,4,5],
    //     [6,7,8,9,10],
    // ],
    // files: [
    //     [
    //         {fileId: 1, fileName: 'filesName'}
    //     ]
    // ],
    showAttrs: ['contractName', 'createTime', 'paymentJson', 'ConFirst', 'contentFiles'],
    translate : {
        contractName: '合同名称',
        createTime: '创建时间',
        paymentJson: '付款信息',
        amountType: '金额类型',
        balanceAmount: '余款金额',
        contentFiles: '合同正文',
        // files: '[[{}]]文件', // 都会展开为1维
        // ext: '[[]]二维数组',// 都会展开为1维
        fileName: '文件名称',
        filePath: '文件路径',
        User: '用户',
        nickName: '姓名',
        userImcode: '火星号',
        ConFirst: '一级分类',
        typeName: '分类名称',
        typeNumber: '分类编号',
        disable: '启用禁用'
    },
};
contract.showAttrs = Object.keys(contract.translate);
module.exports = {
    contract
};


// [ { _path: 'target.contractId',
//     _name: 'contractId',
//     _depth: 0,
//     _type: 'String' },
//   { _path: 'target.contractName',
//     _name: 'contractName',
//     _depth: 0,
//     _type: 'String' },
//   { _path: 'target.createTime',
//     _name: 'createTime',
//     _depth: 0,
//     _type: 'String' },
//   { _path: 'target.paymentJson',
//     _name: 'paymentJson',
//     _depth: 0,
//     _type: 'Object' },
//   { _path: 'target.paymentJson.amountType',
//     _name: 'amountType',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.paymentJson.balanceAmount',
//     _name: 'balanceAmount',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.paymentJson.balancePayment',
//     _name: 'balancePayment',
//     _depth: 1,
//     _type: 'Object' },
//   { _path: 'target.paymentJson.balancePayment.circle',
//     _name: 'circle',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.paymentJson.balancePayment.type',
//     _name: 'type',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.paymentJson.prePaid',
//     _name: 'prePaid',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.paymentJson.prePaidAmount',
//     _name: 'prePaidAmount',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.contentFiles',
//     _name: 'contentFiles',
//     _depth: 0,
//     _type: 'Array' },
//   { _path: 'target.contentFiles.$',
//     _name: '$',
//     _depth: 1,
//     _type: 'Object' },
//   { _path: 'target.contentFiles.$.contractFileId',
//     _name: 'contractFileId',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.fileName',
//     _name: 'fileName',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.filePath',
//     _name: 'filePath',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.createTime',
//     _name: 'createTime',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.deleteTime',
//     _name: 'deleteTime',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.User',
//     _name: 'User',
//     _depth: 2,
//     _type: 'Object' },
//   { _path: 'target.contentFiles.$.User.userId',
//     _name: 'userId',
//     _depth: 3,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.User.nickName',
//     _name: 'nickName',
//     _depth: 3,
//     _type: 'String' },
//   { _path: 'target.contentFiles.$.User.userImcode',
//     _name: 'userImcode',
//     _depth: 3,
//     _type: 'String' },
//   { _path: 'target.ConFirst',
//     _name: 'ConFirst',
//     _depth: 0,
//     _type: 'Object' },
//   { _path: 'target.ConFirst.conFirstId',
//     _name: 'conFirstId',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.ConFirst.typeNumber',
//     _name: 'typeNumber',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.ConFirst.typeName',
//     _name: 'typeName',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.ConFirst.createTime',
//     _name: 'createTime',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.ConFirst.disable',
//     _name: 'disable',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.ext', _name: 'ext', _depth: 0, _type: 'Array' },
//   { _path: 'target.ext.*', _name: '*', _depth: 1, _type: 'Array' },
//   { _path: 'target.ext.*.#',
//     _name: '#',
//     _depth: 2,
//     _type: 'String' },
//   { _path: 'target.files',
//     _name: 'files',
//     _depth: 0,
//     _type: 'Array' },
//   { _path: 'target.files.*', _name: '*', _depth: 1, _type: 'Array' },
//   { _path: 'target.files.*.$',
//     _name: '$',
//     _depth: 2,
//     _type: 'Object' },
//   { _path: 'target.files.*.$.fileId',
//     _name: 'fileId',
//     _depth: 3,
//     _type: 'String' },
//   { _path: 'target.files.*.$.fileName',
//     _name: 'fileName',
//     _depth: 3,
//     _type: 'String' },
//   { _path: 'target.showAttrs',
//     _name: 'showAttrs',
//     _depth: 0,
//     _type: 'Array' },
//   { _path: 'target.showAttrs.#',
//     _name: '#',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate',
//     _name: 'translate',
//     _depth: 0,
//     _type: 'Object' },
//   { _path: 'target.translate.contractName',
//     _name: 'contractName',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.createTime',
//     _name: 'createTime',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.paymentJson',
//     _name: 'paymentJson',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.amountType',
//     _name: 'amountType',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.balanceAmount',
//     _name: 'balanceAmount',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.contentFiles',
//     _name: 'contentFiles',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.files',
//     _name: 'files',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.ext',
//     _name: 'ext',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.fileName',
//     _name: 'fileName',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.filePath',
//     _name: 'filePath',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.User',
//     _name: 'User',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.nickName',
//     _name: 'nickName',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.userImcode',
//     _name: 'userImcode',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.ConFirst',
//     _name: 'ConFirst',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.typeName',
//     _name: 'typeName',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.typeNumber',
//     _name: 'typeNumber',
//     _depth: 1,
//     _type: 'String' },
//   { _path: 'target.translate.disable',
//     _name: 'disable',
//     _depth: 1,
//     _type: 'String' } ]