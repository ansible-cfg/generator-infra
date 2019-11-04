const { uniqBy } = require('lodash');
const Generator = require('yeoman-generator');

class BaseGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.metadata = [];
        this.argument('apply', { required: false });
    }

    async defaultAskQuestions() {
        this.log('Gather the information.');
        const answers = await this.prompt(this._getPrompts());
        // eslint-disable-next-line no-restricted-syntax
        for (const transformer of this._getTransformers()) {
            transformer(answers);
        }
        this.answers = answers;
        this.answers.date = new Date().format('mmm d, yyyy');
    }

    configuring() {

    }

    writing() {
        this.log('Write the file content.');

        // eslint-disable-next-line no-restricted-syntax
        for (const write of this._getWriting()) {
            write(this, this.answers);
        }
    }

    end() {
        this.log.ok(`Infrastructure ${this.answers.appName} generated `);

        if (this.answers.initVms) {
            this.log.ok('Installing the virtuals machines...');
        }
    }

    _getPrompts() {
        const prompts = [].concat(...this.metadata.map(data => data.prompts));
        return uniqBy(prompts, 'name');
    }

    _getTransformers() {
        return this.metadata.map(data => data.transformAnswers).filter(Boolean);
    }

    _getWriting() {
        return this.metadata.map(data => data.write);
    }
}

module.exports = BaseGenerator;
