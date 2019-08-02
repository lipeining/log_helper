'use strict';

const Controller = require('egg').Controller;
const path = require('path');

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = 'hi, egg';
    }
    async generate() {
        const { app } = this;
        this.ctx.body = 'done';
    }
}

module.exports = HomeController;