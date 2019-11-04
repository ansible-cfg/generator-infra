const BaseGenerator = require('./base-generator');

module.exports = resource => class extends BaseGenerator {
    configuring() {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        this.metadata.push(require(`../resources/${resource}`));
    }

    async defaultAskQuestions() {
        await super.defaultAskQuestions();
    }

    writing() {
        super.writing();
    }
};
