const ejs = require('ejs');
const str = "<%=  col.fieldName %> : { \n" +
    "  _kfmt: '<%= col.comments %>' \n" +
    "} \n";
const str2 = "<%=  fieldName %> : { \n" +
    "  _kfmt: '<%= comments %>' \n" +
    "} \n";
const template = ejs.compile(str);
console.log(template({ col: { fieldName: 'nickName', comments: '昵称' } }));
console.log(ejs.render(str, { col: { fieldName: 'nickName', comments: '昵称' } }));
console.log(ejs.render(str2, { fieldName: 'nickName', comments: '昵称' }));