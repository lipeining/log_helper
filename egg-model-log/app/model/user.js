module.exports = app => {
    const db = app.model;
    const DataTypes = app.Sequelize;
    const Model = app.model.define('User', {
        userId: {
            field: 'user_id',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            comment: '用户主键',
            autoIncrement: true,
        },
        nickName: {
            field: 'nick_name',
            type: DataTypes.STRING(80),
            allowNull: false,
            defaultValue: '',
            comment: '用户昵称',
        },
        userImcode: {
            field: 'user_imcode',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
            comment: '用户火星号',
        },
        email: {
            field: 'email',
            type: DataTypes.STRING(80),
            allowNull: false,
            defaultValue: '',
            comment: '用户邮箱',
        },
        createTime: {
            field: 'create_time',
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: '创建时间',
        },
    }, {
        tableName: 'tbl_user',
        timestamps: false,
    });
    Model.associate = () => {
        db.User.hasMany(db.Log, {
            foreignKey: 'userId',
            sourceKey: 'userId',
            constraints: false,
        });
    };
    return Model;
}