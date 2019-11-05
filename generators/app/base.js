const chalk = require('chalk');
const version = require('../../package.json').version;

module.exports = {

    initializing(generator) {
        // eslint-disable-line no-use-before-define
        const name =
            '\n    ██╗███╗   ██╗███████╗██████╗  █████╗   ' +
            '\n    ██║████╗  ██║██╔════╝██╔══██╗██╔══██╗  ' +
            '\n    ██║██╔██╗ ██║█████╗  ██████╔╝███████║  ' +
            '\n    ██║██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║  ' +
            '\n    ██║██║ ╚████║██║     ██║  ██║██║  ██║  ' +
            '\n    ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝  ' +
            '\n';
        generator.log(name);
        generator.log(`\nWelcome to the ${chalk.red('Infra')} generator ${chalk.green(`v${version}`)}! \n`);
        generator.log('Documentation for creating an infrastructure: https://github.com/ansible-cfg/generator-infra');
        generator.log(`Infrastructure files will be generated in folder: ${chalk.yellow(process.cwd())}\n`);
    }
};
