
const { readdir, stat } = require('fs-extra');
const { join } = require('path');
const BaseGenerator = require('../base-generator');
const common = require('./base.js');
require('date-util');

class AppGenerator extends BaseGenerator {
    initializing() {
        common.initializing(this);
    }
    async prompting() {
        const path = join(__dirname, '..');
        const contents = await readdir(path);
        const resources = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const name of contents) {
            // eslint-disable-next-line no-await-in-loop
            const stats = await stat(join(path, name));
            if (stats.isDirectory() && name !== 'app') {
                resources.push(name);
            }
        }
        const answers = await this.prompt({
            type: 'checkbox',
            name: 'selected-resources',
            message: '(1/8) Select the desired container cluster manager',
            choices: resources.sort(),
            validate: answers => (answers.length > 0 ? true : 'Please select at least one element.'),
        });

        this.selectedResources = answers['selected-resources'];
    }

    configuring() {
        // eslint-disable-next-line no-restricted-syntax
        for (const resource of this.selectedResources) {
            // eslint-disable-next-line global-require,import/no-dynamic-require
            this.metadata.push(require(`../../resources/${resource}`));
        }
    }

    async defaultAskQuestions() {
        await super.defaultAskQuestions();
    }

    writing() {
        super.writing();
    }
}

module.exports = AppGenerator;
