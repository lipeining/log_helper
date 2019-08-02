module.exports = app => {
    const db = app.model;
    const DataTypes = app.Sequelize;
    const Model = app.model.define('Log', {
        logId: {
            field: 'log_id',
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            comment: '日志主键',
            autoIncrement: true,
        },
        userId: {
            field: 'user_id',
            type: DataTypes.INTEGER(11),
            allowNull: true,
            comment: '用户ID',
        },
        content: {
            field: 'content',
            type: DataTypes.STRING(1024),
            allowNull: false,
            defaultValue: '',
            comment: '日志内容',
        },
        createTime: {
            field: 'create_time',
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: '创建时间',
        },
    }, {
        tableName: 'tbl_log',
        timestamps: false,
    });
    Model.associate = () => {
        db.Log.belongsTo(db.User, {
            foreignKey: 'userId',
            targetKey: 'userId',
            constraints: false,
        });
    }
    return Model;
}