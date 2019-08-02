'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async list() {
        const { ctx } = this;
        const data = await ctx.model.User.findAll({ include: [{ model: ctx.model.Log }] });
        // ctx.logger.info(data.get({ plain: true }));
        ctx.body = data;
    }
    async add() {
        const { app, ctx } = this;
        const { body, query } = ctx.request;
        const user = await ctx.model.User.create(Object.assign({ createTime: Date.now() }, body));
        ctx.logger.info(user.get({ plain: true }));
        const content = app.modelDiff.diff('user', {}, user.get({ plain: true }));
        ctx.logger.info(content);
        await ctx.model.Log.create(Object.assign({ createTime: Date.now() }, { content }));
        ctx.body = user.get({ plain: true });
    }
    async edit() {
        const { app, ctx } = this;
        const params = ctx.params;
        const { body, query } = ctx.request;
        const oldUser = await ctx.model.User.findOne({ where: params });
        await ctx.model.User.update(body, { where: params });
        const newUser = await ctx.model.User.findOne({ where: params });
        ctx.logger.info(oldUser.get({ plain: true }));
        ctx.logger.info(newUser.get({ plain: true }));
        const content = app.modelDiff.diff('user', oldUser.get({ plain: true }), newUser.get({ plain: true }));
        ctx.logger.info(content);
        await ctx.model.Log.create(Object.assign({ createTime: Date.now() }, { content }));
        ctx.body = newUser.get({ plain: true });
    }
}

module.exports = UserController;