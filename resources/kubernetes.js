const { exists, statSync } = require('fs');
const { join } = require('path');
const uuidV1 = require('uuid/v1');
const { exec } = require('child_process');

module.exports = {
    write: (gen, answers) => {
        const done = gen.async();
        exists(gen.destinationPath(answers.appName), (exist) => {
            if (exist && statSync(gen.destinationPath(answers.appName)).isDirectory()) {
                gen.log.error(`Directory [${answers.appName}] exists`);
                process.exit(1);
            }
            gen.destinationRoot(join(gen.destinationRoot(), answers.appName));
            done();
        });
        done();
        const defaultIp = '192.168.77';
        const defaultManagerIp = '192.168.77.21';
        const workerToken = uuidV1();

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

        // copy ansible k8s
        copy(
            'ansible/k8s/_infra-base-playbook.yml',
            `ansible/k8s/${answers.appName}-base-playbook.yml`,
            {
                appName: answers.appName,
                os: answers.os,
                defaultIp
            }
        );
        copy(
            'ansible/k8s/_infra-k8s-playbook.yml',
            `ansible/k8s/${answers.appName}-k8s-playbook.yml`,
            {
                appName: answers.appName,
                defaultIp,
                workerToken
            }
        );
        // k8s group_vars
        copy(
            'ansible/k8s/group_vars/_all.yml',
            'ansible/k8s/group_vars/all.yml',
            {
                appName: answers.appName,
                defaultIp,
                workerToken
            }
        );

        // k8s roles
        copy(
            'ansible/k8s/roles/infra-base/handlers/_main.yml',
            `ansible/k8s/roles/${answers.appName}-base/handlers/main.yml`,
            {
                appName: answers.appName,
                os: answers.os
            }
        );
        copy(
            'ansible/k8s/roles/infra-base/tasks/_main.yml',
            `ansible/k8s/roles/${answers.appName}-base/tasks/main.yml`,
            {
                appName: answers.appName,
                os: answers.os
            }
        );
        copy(
            'ansible/k8s/roles/infra-base/tasks/_docker-compose.yml',
            `ansible/k8s/roles/${answers.appName}-base/tasks/docker-compose.yml`,
        );
        copy(
            'ansible/k8s/roles/infra-base/tasks/_docker-users.yml',
            `ansible/k8s/roles/${answers.appName}-base/tasks/docker-users.yml`,
        );
        copy(
            'ansible/k8s/roles/infra-base/tasks/_setup-debian.yml',
            `ansible/k8s/roles/${answers.appName}-base/tasks/setup-debian.yml`,
        );
        copy(
            'ansible/k8s/roles/infra-base/tasks/_setup-redhat.yml',
            `ansible/k8s/roles/${answers.appName}-base/tasks/setup-redhat.yml`,
        );
        copy(
            'ansible/k8s/roles/infra-master/tasks/_main.yml',
            `ansible/k8s/roles/${answers.appName}-master/tasks/main.yml`,
            {
                appName: answers.appName,
                os: answers.os,
                scheduleManager: answers.scheduleManager,
                docker_registry_repository_name: answers.docker_registry_repository_name,
                tools: answers.tools
            }
        );
        copy(
            'ansible/k8s/roles/infra-worker/tasks/_main.yml',
            `ansible/k8s/roles/${answers.appName}-worker/tasks/main.yml`,
            {
                appName: answers.appName
            }
        );
        // k8s networks
        copy(
            'ansible/k8s/roles/infra-master/files/networks/_kube-flannel.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/networks/kube-flannel.yml`,
            {
                appName: answers.appName
            }
        );
        // k8s services
        copy(
            'ansible/k8s/roles/infra-master/files/services/_sonarqube.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/services/sonarqube.yml`,
            {
                appName: answers.appName,
                docker_registry_repository_name: answers.docker_registry_repository_name
            }
        );
        copy(
            'ansible/k8s/roles/infra-master/files/services/_traefik.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/services/traefik.yml`,
            {
                appName: answers.appName
            }
        );
        copy(
            'ansible/k8s/roles/infra-master/files/services/_artifactory.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/services/artifactory.yml`,
            {
                appName: answers.appName,
                docker_registry_repository_name: answers.docker_registry_repository_name
            }
        );
        copy(
            'ansible/k8s/roles/infra-master/files/services/_jenkins.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/services/jenkins.yml`,
            {
                appName: answers.appName,
                docker_registry_repository_name: answers.docker_registry_repository_name,
                defaultMicroService: answers.defaultMicroService,
                defaultIp: defaultManagerIp
            }
        );
        copy(
            'ansible/k8s/roles/infra-master/files/services/_namespace.yml',
            `ansible/k8s/roles/${answers.appName}-master/files/services/namespace.yml`,
            {
                appName: answers.appName
            }
        );

        // create the vm
        if (answers.initVms) {
            gen.spawnCommand('vagrant', ['up']);
            // vagrant dns --install
            // gen.spawnCommand('vagrant', ['dns', '--install']);
            // run the DNS server:
            // gen.spawnCommand('vagrant', ['dns', '--start']);
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
