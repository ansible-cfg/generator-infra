const ANSIBLE_SWARM_DIR = 'ansible/swarm';

const ansibleSwarm = {
    base: {
        playbook: `${ANSIBLE_SWARM_DIR}/infra-base-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/infra-base/tasks/main.yml`
            }
        }
    },
    common: {
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/infra-common/tasks/main.yml`
            }
        }
    },
    consul: {
        manager: {
            playbook: `${ANSIBLE_SWARM_DIR}/infra-consul-playbook.yml`,
            roles: {

                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/infra-consult-manager/tasks/main.yml`
                }
            }
        },
        worker: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/infra-consult-worker/tasks/main.yml`
                }
            }
        }
    },
    elk: {
        playbook: `${ANSIBLE_SWARM_DIR}/infra-elk-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/infra-elk/tasks/main.yml`
            },
            files: {
                elasticsearch: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/infra-elk/files/elk/elasticsearch/config/elasticsearch.yml`
                },
                kibana: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/infra-elk/files/elk/kibana/config/kibana.yml`
                },
                logstash: {
                    config: `${ANSIBLE_SWARM_DIR}/roles/infra-elk/files/elk/logstash/config/logstash.yml`,
                    pipeline: `${ANSIBLE_SWARM_DIR}/roles/infra-elk/files/elk/logstash/pipeline/logstash.conf`
                }
            }
        }
    },
    services: {
        playbook: `${ANSIBLE_SWARM_DIR}/infra-services-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/infra-services/tasks/main.yml`
            }
        }
    },
    swarm: {
        manager: {
            playbook: `${ANSIBLE_SWARM_DIR}/infra-swarm-playbook.yml`,
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/infra-swarm-manager/tasks/main.yml`
                }
            }
        },
        network: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/infra-swarm-network/tasks/main.yml`
                }
            }
        },
        worker: {
            roles: {
                tasks: {
                    main: `${ANSIBLE_SWARM_DIR}/roles/infra-swarm-worker/tasks/main.yml`
                }
            }
        }
    },
    traefik: {
        playbook: `${ANSIBLE_SWARM_DIR}/infra-traefik-playbook.yml`,
        roles: {
            tasks: {
                main: `${ANSIBLE_SWARM_DIR}/roles/infra-traefik/tasks/main.yml`
            }
        }
    },
    requirements: {
        default: `${ANSIBLE_SWARM_DIR}/requirements.yml`
    }
};

module.exports = ansibleSwarm;
