const { exists, statSync } = require('fs');
const { join } = require('path');
const exec = require('child_process').exec;

module.exports = {
    write: (gen, answers) => {
        const defaultIp = '192.168.77';
        const done = this.async();
        exists(this.destinationPath(this.answers.appName), (exist) => {
            if (exist && statSync(this.destinationPath(this.answers.appName)).isDirectory()) {
                this.log.error(`Directory [${this.answers.appName}] exists`);
                process.exit(1);
            }
            this.destinationRoot(join(this.destinationRoot(), this.answers.appName));
            done();
        });
        done();
        const copy = (src, dest, params) => {
            if (!dest) {
                dest = src;
            }
            try {
                gen.fs.copyTpl(
                    gen.templatePath(src),
                    gen.destinationPath(dest),
                    params
                );
            } catch (err) {
                gen.log(`Error copying template: ${src}`, err);
            }
        };

        // copy vagrantfile
        copy(
            '_Vagrantfile',
            'Vagrantfile',
            {
                appName: answers.appName,
                caasMode: answers.caasMode,
                memoryWorkers: answers.memoryWorkers ? answers.memoryWorkers : 1024,
                memoryManagers: answers.memoryManagers ? answers.memoryManagers : 2048,
                os: answers.os,
                managers: answers.managers ? answers.managers : 1,
                workers: answers.workers ? answers.workers : 2,
                ownRegistry: answers.ownRegistry,
                defaultIp
            }
        );

        // copy ansible hosts
        copy(
            'ansible/_infra-hosts',
            `ansible/${answers.appName}-hosts`,
            {
                appName: answers.appName,
                os: answers.os,
                managers: answers.managers ? answers.managers : 1,
                workers: answers.workers ? answers.workers : 2,
                defaultIp
            }
        );

        copy(
            'ansible/_ansible.cfg',
            'ansible/ansible.cfg',
            { appName: answers.appName }
        );

        // copy ansible images
        copy(
            'ansible/images/_infra-images-playbook.yml',
            `ansible/images/${answers.appName}-images-playbook.yml`,
            {
                appName: answers.appName,
                docker_registry_server: answers.docker_registry_server === 'hub.docker.com' ? '' : answers.docker_registry_server,
                docker_registry_username: answers.docker_registry_username,
                docker_registry_password: answers.docker_registry_password,
                docker_registry_repository_name: answers.docker_registry_repository_name,
                defaultMicroService: answers.defaultMicroService,
                defaultIp,
                ownRegistry: answers.ownRegistry,
                caasMode: answers.caasMode
            }
        );

        // copy ansible images registry
        copy(
            'ansible/images/_infra-registry-playbook.yml',
            `ansible/images/${answers.appName}-registry-playbook.yml`,
            {
                appName: answers.appName,
                defaultMicroService: answers.defaultMicroService,
                defaultIp,
                caasMode: answers.caasMode,
                tools: answers.tools
            }
        );

        // copy ansible swarm
        copy(
            'ansible/swarm/_infra-base-playbook.yml',
            `ansible/swarm/${answers.appName}-base-playbook.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/_infra-swarm-playbook.yml',
            `ansible/swarm/${answers.appName}-swarm-playbook.yml`,
            {
                appName: answers.appName,
                defaultIp
            }
        );
        copy(
            'ansible/swarm/_infra-services-playbook.yml',
            `ansible/swarm/${answers.appName}-services-playbook.yml`,
            {
                appName: answers.appName,
                defaultIp
            }
        );
        copy(
            'ansible/swarm/_infra-traefik-playbook.yml',
            `ansible/swarm/${answers.appName}-traefik-playbook.yml`,
            {
                appName: answers.appName,
                defaultIp
            }
        );
        copy(
            'ansible/swarm/_infra-elk-playbook.yml',
            `ansible/swarm/${answers.appName}-elk-playbook.yml`,
            {
                appName: answers.appName,
                defaultIp
            }
        );
        /** swarm roles */
        copy(
            'ansible/swarm/roles/infra-base/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-base/tasks/main.yml`,
            {
                appName: answers.appName,
                os: answers.os
            }
        );
        copy(
            'ansible/swarm/roles/infra-common/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-common/tasks/main.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/roles/infra-swarm-manager/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-swarm-manager/tasks/main.yml`,
            {
                appName: answers.appName,
                scheduleManager: answers.scheduleManager
            }
        );
        copy(
            'ansible/swarm/roles/infra-swarm-network/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-swarm-network/tasks/main.yml`,
            {
                appName: answers.appName,
                tools: answers.tools,
                defaultMicroService: answers.defaultMicroService
            }
        );
        copy(
            'ansible/swarm/roles/infra-services/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-services/tasks/main.yml`,
            {
                appName: answers.appName,
                docker_registry_repository_name: answers.docker_registry_repository_name,
                defaultMicroService: answers.defaultMicroService,
                tools: answers.tools
            }
        );
        copy(
            'ansible/swarm/roles/infra-traefik/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-traefik/tasks/main.yml`,
            {
                appName: answers.appName,
                tools: answers.tools
            }
        );
        copy(
            'ansible/swarm/roles/infra-elk/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-elk/tasks/main.yml`,
            {
                appName: answers.appName,
                tools: answers.tools
            }
        );
        copy(
            'ansible/swarm/roles/infra-elk/files/elk/elasticsearch/config/_elasticsearch.yml',
            `ansible/swarm/roles/${answers.appName}-elk/files/elk/elasticsearch/config/elasticsearch.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/roles/infra-elk/files/elk/logstash/config/_logstash.yml',
            `ansible/swarm/roles/${answers.appName}-elk/files/elk/logstash/config/logstash.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/roles/infra-elk/files/elk/logstash/pipeline/_logstash.conf',
            `ansible/swarm/roles/${answers.appName}-elk/files/elk/logstash/pipeline/logstash.conf`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/roles/infra-elk/files/elk/kibana/config/_kibana.yml',
            `ansible/swarm/roles/${answers.appName}-elk/files/elk/kibana/config/kibana.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/swarm/roles/infra-swarm-worker/tasks/_main.yml',
            `ansible/swarm/roles/${answers.appName}-swarm-worker/tasks/main.yml`,
            {
                appName: answers.appName
            }
        );

        // create the vm
        if (answers.initVms) {
            gen.spawnCommand('vagrant', ['up']);
            // vagrant dns --install
            // this.spawnCommand('vagrant', ['dns', '--install']);
            // run the DNS server:
            // this.spawnCommand('vagrant', ['dns', '--start']);
        }
    },
    prompts: [
        {
            type: 'input',
            name: 'appName',
            message: '(2/8) Name of my infrastructure',
            // eslint-disable-next-line no-nested-ternary
            validate: input => (!input ? 'Project name cannot be empty' : !/\w+/.test(input) ? 'Project name should only consist of 0~9, a~z, A~Z, _, .' : true),
        },
        {
            type: 'list',
            name: 'os',
            choices: [
                { value: 'ubuntu', name: 'Ubuntu' },
                { value: 'centos', name: 'CentOS' }
            ],
            message: '(3/8) Operating System of my infrastructure',
            default: 'ubuntu'
        },
        {
            type: 'checkbox',
            name: 'tools',
            choices: [
                { value: 'jenkins', name: 'Jenkins (Recommended)', checked: true },
                { value: 'artifactory', name: 'Artifactory', checked: true },
                { value: 'sonarqube', name: 'Sonarqube', checked: true },
                { value: 'viz', name: 'Viz', checked: false },
                { value: 'portainer', name: 'Portainer', checked: false },
                { value: 'elk', name: 'Elastic Stack (Elastic search, Logstash, Kibana)', checked: true },
                { value: 'traefik', name: 'Traefik', checked: true },
                { value: 'registry', name: 'Local private Docker registry', checked: false }
            ],
            message: '(4/8) I want to install',
        },
        {
            type: 'confirm',
            name: 'scheduleManager',
            message: '(5/8) Schedule the manager',
            default: true
        },
        {
            type: 'confirm',
            name: 'ownRegistry',
            message: '(6/8) Push the images to my own docker registry',
            default: false
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_server',
            message: 'Docker registry server',
            default: 'hub.docker.com'
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_username',
            message: 'Username of docker registry',
            validate: input => (!input ? 'Username cannot be empty' : true),
        },
        {
            when: response => response.ownRegistry,
            type: 'password',
            name: 'docker_registry_password',
            message: 'Password of docker registry',
            validate: input => (!input ? 'Password cannot be empty' : true),
        },
        {
            when: response => response.ownRegistry,
            type: 'input',
            name: 'docker_registry_repository_name',
            message: 'Docker repository name',
            validate: input => (!input ? 'Repository name cannot be empty' : true),
        },
        {
            when: response => response.tools.indexOf('jenkins') > -1,
            type: 'confirm',
            name: 'defaultMicroService',
            message: '(7/8) Deploy the defaults micro-services',
            default: true
        },
        {
            when: (response) => {
                // check if virtualbox is installed
                let virtualBoxInstalled = true;
                exec('vboxmanage --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Virtualbox is not found on your computer. Download and install : https://www.virtualbox.org/wiki/Downloads');
                        virtualBoxInstalled = false;
                    }
                });

                // check if vagrant is installed
                let vagrantInstalled = true;
                exec('vagrant --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Vagrant is not found on your computer. Download and install: https://www.vagrantup.com/docs/installation/');
                        vagrantInstalled = false;
                    }
                });

                // check if ansible is installed
                let ansibleInstalled = true;
                exec('ansible --version', (err, stdout, stderr) => {
                    if (err) {
                        // this.log.error('Ansible is not found on your computer. Download and install : http://docs.ansible.com/ansible/intro_installation.html');
                        ansibleInstalled = false;
                    }
                });

                // if all installed then suggest the question
                return virtualBoxInstalled && vagrantInstalled && ansibleInstalled;
            },
            type: 'confirm',
            name: 'initVms',
            message: '(8/8) Test my infrastructure locally in a virtual machines',
            default: false,
        },
        {
            type: 'input',
            name: 'managers',
            message: 'Number of managers',
            default: 1,
            when: response => response.initVms,
            validate: input => (input && !/\d+/.test(input) ? 'Manager number should only consist of 0~9' : true),
        },
        {
            type: 'input',
            name: 'workers',
            message: 'Number of workers',
            default: 1,
            when: response => response.initVms,
            validate: input => (input && !/\d+/.test(input) ? 'Worker number should only consist of 0~9' : true),
        },
        {
            type: 'input',
            name: 'memoryWorkers',
            message: 'Memory of worker node (Mo)',
            default: 1024,
            when: response => response.initVms,
            validate: input => (input && !/\d+/.test(input) ? 'Memory should only consist of 0~9' : true),
        },
        {
            type: 'input',
            name: 'memoryManagers',
            message: 'Memory of cluster manager (Mo)',
            default: 2048,
            when: response => response.initVms,
            validate: input => (input && !/\d+/.test(input) ? 'Memory should only consist of 0~9' : true),
        }
    ],
    transformAnswers(data) {
        if (typeof data.appName === 'string') {
            data.appName = data.appName.trim();
        }
        if (typeof data.os === 'string') {
            data.os = data.os.trim();
        }
        /**
        if (!data['config-values']) {
            data['config-values'] = ['CONFIG: DATA'];
        } else if (typeof data['config-values'] === 'string') {
            data['config-values'] = data['config-values']
                .split('\n')
                .filter(Boolean)
                .filter(line => !line.trim().startsWith('#'));
        }
        * */
    },
};
