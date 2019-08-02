User
{ userId:
   { field: 'user_id',
     type:
      INTEGER {
        options: [Object],
        _length: 11,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: false,
     primaryKey: true,
     comment: '用户主键',
     autoIncrement: true,
     Model: User,
     fieldName: 'userId',
     _modelAttribute: true },
  nickName:
   { field: 'nick_name',
     type: STRING { options: [Object], _binary: undefined, _length: 80 },
     allowNull: false,
     defaultValue: '',
     comment: '用户昵称',
     Model: User,
     fieldName: 'nickName',
     _modelAttribute: true },
  userImcode:
   { field: 'user_imcode',
     type:
      INTEGER {
        options: [Object],
        _length: 11,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: false,
     defaultValue: 0,
     comment: '用户火星号',
     Model: User,
     fieldName: 'userImcode',
     _modelAttribute: true },
  email:
   { field: 'email',
     type: STRING { options: [Object], _binary: undefined, _length: 80 },
     allowNull: false,
     defaultValue: '',
     comment: '用户邮箱',
     Model: User,
     fieldName: 'email',
     _modelAttribute: true },
  createTime:
   { field: 'create_time',
     type:
      BIGINT {
        options: {},
        _length: undefined,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: false,
     defaultValue: 0,
     comment: '创建时间',
     Model: User,
     fieldName: 'createTime',
     _modelAttribute: true } }
userId
Logs
HasMany
userId
userId
undefined
true
=======================================
Log
{ logId:
   { field: 'log_id',
     type:
      INTEGER {
        options: [Object],
        _length: 11,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: false,
     primaryKey: true,
     comment: '日志主键',
     autoIncrement: true,
     Model: Log,
     fieldName: 'logId',
     _modelAttribute: true },
  userId:
   { field: 'user_id',
     type:
      INTEGER {
        options: [Object],
        _length: 11,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: true,
     comment: '用户ID',
     Model: Log,
     fieldName: 'userId',
     _modelAttribute: true },
  content:
   { field: 'content',
     type: STRING { options: [Object], _binary: undefined, _length: 1024 },
     allowNull: false,
     defaultValue: '',
     comment: '日志内容',
     Model: Log,
     fieldName: 'content',
     _modelAttribute: true },
  createTime:
   { field: 'create_time',
     type:
      BIGINT {
        options: {},
        _length: undefined,
        _zerofill: undefined,
        _decimals: undefined,
        _precision: undefined,
        _scale: undefined,
        _unsigned: undefined },
     allowNull: false,
     defaultValue: 0,
     comment: '创建时间',
     Model: Log,
     fieldName: 'createTime',
     _modelAttribute: true } }
logId
User
BelongsTo
userId
undefined
userId
undefined