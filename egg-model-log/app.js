const ModelGenerator = require('./tools/model_generator');
const ModelDiff = require('./utils/model_diff');
const _ = require('lodash');
const path = require('path');
module.exports = async app => {
    app.modelGenerator = new ModelGenerator();
    app.beforeStart(async () => {
        await app.model.sync({ force: app.config.env === 'unittest' });
    });
    app.ready(async () => {
        // for (const model of app.model.modelManager.models) {
        //     logModel(model);
        // }
        // if (['unittest'].includes(app.config.env)) {
        //     try {
        //         for (const model of app.model.modelManager.models) {
        //             const dstPath = path.join(app.baseDir, `/model_log/${_.snakeCase(model.name)}.js`);
        //             const rawAttributes = Object.values(model.rawAttributes);
        //             app.modelGenerator.generateToFile({ dstPath, data: { rawAttributes } });
        //         }
        //     } catch (err) {
        //         app.logger.error(err);
        //     }
        // }
        const models = app.modelGenerator.load({ dir: path.join(app.baseDir, '/model_log') });
        app.logger.info(models);
        app.modelDiff = new ModelDiff({ models });
    });
}

function logModel(model) {
    console.log(model.name);
    // console.log(model.fieldAttributeMap);
    // console.log(model.fieldRawAttributesMap);
    console.log(model.rawAttributes);
    console.log(model.primaryKeyAttribute);
    // console.log(model.primaryKeyField);
    for (const k of Object.keys(model.associations)) {
        console.log(model.associations[k].as);
        console.log(model.associations[k].associationType);
        console.log(model.associations[k].foreignKey);
        console.log(model.associations[k].sourceKey);
        console.log(model.associations[k].targetKey);
        console.log(model.associations[k].isMultiAssociation);
    }

}