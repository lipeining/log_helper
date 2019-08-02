'use strict';

const Controller = require('egg').Controller;

class LogController extends Controller {
    async list() {
        const { ctx } = this;
        const data = await ctx.model.Log.findAll({ include: [{ model: ctx.model.User }] });
        ctx.body = data;
    }
}

module.exports = LogController;