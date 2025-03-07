const ansibleSwarm = require('./ansible-swarm');
const ansibleK8s = require('./ansible-k8s');
const ansibleImages = require('./ansible-images');

const ANSIBLE_DIR = 'ansible';

const expectedFiles = {
    ansible: {
        images: ansibleImages,
        k8s: ansibleK8s,
        swarm: ansibleSwarm,
        hosts: {
            default: `${ANSIBLE_DIR}/infra-hosts`
        }
    },
    vagrant: {
        default: '_Vagrantfile'
    }
};

module.exports = expectedFiles;
