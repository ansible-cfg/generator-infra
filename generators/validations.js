'use strict';
const {
    existsSync,
    statSync
} = require('fs');

// noinspection JSAnnotator
module.exports = {
    isAppName = async (input) => (
    // eslint-disable-next-line no-nested-ternary
    !input ? 'Please enter a value' : !/\w+/.test(input) ? 'Project name should only consist of 0~9, a~z, A~Z, _, .' :
        statSync(this.destinationPath(input)).isDirectory() ? 'Project already exist' : !existsSync(this.destinationPath(input)) ? true : true
    ),
    isString(str) {
        return str ? true : false;
    },
    isNumber (str) {
        return str && !Number.isNaN(str) && Number.isInteger(str) ? true : false;
    },
    parseInteger(str) {
        return parseInt(str);
    }
};
