const path = require('path');
const ejs = require('ejs');
const defaultOptions = {
    templatePath: path.join(__dirname, 'model.ejs'),
}
const _ = require('lodash');
const fs = require('fs');
const TEMPLATE = Symbol('template');
/**
 * 用于快速生成 model 定义的帮助工具
 * 原理： 使用 ejs 模板渲染功能，生成对应的 model 定义。
 * 导出到普通的 js 文件，module.exports 就是对应的对象。
 * 使用时，可以将文件 require 从而得到对应的对象实例。
 */
class ModelGenerator {
    constructor(options = {}) {
        this.options = Object.assign({}, defaultOptions, options);
    }
    get teamplte() {
        if (!this[TEMPLATE]) {
            this[TEMPLATE] = fs.readFileSync(this.options.templatePath, { encoding: 'utf8' });
        }
        return this[TEMPLATE];
    }
    generate(options = {}) {
        const { data } = options;
        return ejs.render(this.teamplte, data);
    }
    generateToFile(options = {}) {
        const { dstPath } = options;
        const str = this.generate(options);
        fs.writeFileSync(dstPath, str);
    }
    load(options = {}) {
        const { dir } = options;
        const stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        const fileList = fs.readdirSync(dir);
        const models = {};
        for (const file of fileList) {
            if (file.endsWith('.js')) {
                const filePath = path.join(dir, file);
                const fileName = _.camelCase(file.replace('.js', ''));
                models[fileName] = require(filePath);
            }
        }
        return models;
    }
}

module.exports = ModelGenerator;