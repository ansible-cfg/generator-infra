const ANSIBLE_K8S_DIR = 'ansible/k8s';

const ansibleK8s = {
    base: {
        playbook: `${ANSIBLE_K8S_DIR}/infra-base-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/infra-base/tasks/main.yml`
            }
        }
    },
    master: {
        playbook: `${ANSIBLE_K8S_DIR}/infra-k8s-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/infra-master/tasks/main.yml`
            },
            files: {
                networks: {
                    flannel: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/networks/kube-flannel.yml`
                },
                services: {
                    artifactory: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/services/artifactory.yml`,
                    jenkins: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/services/jenkins.yml`,
                    namespace: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/services/namespace.yml`,
                    sonarqube: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/services/sonarqube.yml`,
                    traefik: `${ANSIBLE_K8S_DIR}/roles/infra-master/files/services/traefik.yml`
                }
            }
        }
    },
    worker: {
        roles: {
            tasks: {
                main: `${ANSIBLE_K8S_DIR}/roles/infra-worker/tasks/main.yml`
            }
        }
    }
};

module.exports = ansibleK8s;
