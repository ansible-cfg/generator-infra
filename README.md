# Infra - Microservices infrastructure generator

<h1>This repo is severely outdated!</h1>

[![npm version](https://badge.fury.io/js/generator-infra.svg)](https://badge.fury.io/js/generator-infra)
[![build](https://travis-ci.org/Chabane/generator-infra.svg?branch=master)](https://travis-ci.org/Chabane/generator-infra)
[![coverage](https://codecov.io/gh/Chabane/generator-infra/branch/master/graph/badge.svg)](https://codecov.io/gh/Chabane/generator-infra)
[![dependency](https://david-dm.org/Chabane/generator-infra.svg?theme=shields.io)](https://david-dm.org/Chabane/generator-infra)

A microservices infrastructure yeoman generator. Infra is inspired from solutions like AWS Cloudformation and Google Cloud Deployment Manager.

It allows developers to load, organize, execute, evolve, administrate and stop microservices using few infra commands lines.

And It takes advantage of the following solutions/technologies (alpha):

- `Vagrant` development mode 
- `Ansible` provisionning
- `Kubernetes/docker swarm` orchestrate and replicate docker containers
- `ELK Stack` log analytics
- `Traefik` HTTP reverse proxy
- `Jenkins 2` CI/CD of microservices using Job DSL and Pipeline Job
- `Aritfactory` artefacts deployment
- `Sonarqube` quality

To prove it efficiency, infra generates 2 default microservices, connected to an event's bus using kafka

1 consumer [NodeJS](https://github.com/Chabane/infra-microservice-nodejs-angular) & 1 consumer [Apache Spark](https://github.com/Chabane/infra-microservice-spark-cassandra) & 1 producer [Java](https://github.com/Chabane/infra-microservice-spring-reactor)

<img src="http://chabanerefes.info/prez_1/images/swarm_diagramme.png"/>

### Prerequisites
You need the following installed to use this generator.
- [`NodeJS`](https://nodejs.org/en/download/), Node 6 or higher, together with NPM 3 or higher.
- [`VirtualBox`](https://www.virtualbox.org/wiki/Downloads) (optional), tested with Version 5.1.14 r112924.
- [`Vagrant`](https://www.vagrantup.com/docs/installation/) (optional), version 1.9.1 or better. Earlier versions of vagrant may not work.
with the Vagrant Ubuntu 16.04 box and network configuration.
- [`Ansible`](http://docs.ansible.com/ansible/intro_installation.html) (optional), tested with Version 2.2.0. 
- `Docker registry` (optional), at least a docker hub account.
- Internet access, this generator pulls Vagrant boxes from the Internet as well
as installs Ubuntu application packages from the Internet.

### Getting started

```
npm install -g yo
npm install -g generator-infra
yo infra
```

The code generated contains a `Vagrantfile` and associated `Ansible` playbook scripts
to provisioning a nodes Kubernetes/Docker Swarm cluster using `VirtualBox` and `Ubuntu
16.04` (CentOS7 & CoreOS soon).

Vagrant will start two machines. Each machine will have a NAT-ed network
interface, through which it can access the Internet, and a `private-network`
interface in the subnet 192.168.77.0/24. The private network is used for
intra-cluster communication.

The machines created are:

| NAME | IP ADDRESS | ROLE |
| --- | --- | --- |
| appname-manager1 | 192.168.77.21 | Cluster Manager |
| appname-worker1 | 192.168.77.31 | Node Worker |
| appname-workern | 192.168.77.3n | Node Worker |

After the `vagrant up` is complete, the following command and output should be
visible on the cluster manager (**appname-manager1**).

For Docker-swarm
```
vagrant ssh appname-manager1
docker service ls 
```
```
ID            NAME            REPLICAS  IMAGE                COMMAND
654jtwzg8n8k  jenkins        replicated  2/2       infra/jenkins:1.0.0-alpha.0
7xrhx2d74b3l  sonarqube      replicated  2/2       infra/sonarqube:1.0.0-alpha.0
9y8ycnri8e3s  kibana         replicated  1/1       kibana:5.2.0
m4n86is529p0  viz            replicated  1/1       manomarks/visualizer:latest
n49nex6feeh8  artifactory    replicated  2/2       infra/artifactory:1.0.0-alpha.0
ncccc0wi7j2l  registry       global      2/2       registry:2
p7znkv9p41sx  portainer      replicated  1/1       portainer/portainer:1.11.3
r8dznb7p4dpj  logstash       replicated  1/1       logstash:5.2.0
vxlnldtnrdlh  traefik        replicated  1/1       traefik:v1.1.2
wmgihhys4z9j  elasticsearch  replicated  1/1       elasticsearch:5.2.0
```
```
docker service inspect --pretty artifactory 
```
```
ID:		3ou58zc7xlrwwegyh40xxcuq0
Name:		artifactory
Mode:		Replicated
 Replicas:	2
Placement:
UpdateConfig:
 Parallelism:	1
 On failure:	pause
ContainerSpec:
 Image:		infra/artifactory:1.0.0-alpha.0
Resources:
Networks: atqmyyz6jctr34t64o69tyolu
Ports:
 Protocol = tcp
 TargetPort = 8080
 PublishedPort = 9999
```

For Kubernetes
```
vagrant ssh appname-manager1
kubectl -n appname get service 
```
```
NAME             CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
artifactory      10.108.148.112   <nodes>       9999:30003/TCP   35m
jenkins          10.105.77.103    <nodes>       8082:30001/TCP   35m
sonarqube        10.102.141.79    <nodes>       9000:30002/TCP   35m
traefik          10.107.95.12     <nodes>       8080:30004/TCP   35m
```
```
kubectl describe svc artifactory -n appname 
```
```
Name:                   artifactory
Namespace:              appname
Labels:                 name=artifactory
Selector:               name=artifactory
Type:                   NodePort
IP:                     10.108.148.112
Port:                   <unset> 8080/TCP
NodePort:               <unset> 9999/TCP
Endpoints:              <none>
Session Affinity:       None
```

### Switch to another orchestrator
```
vagrant destroy -f && vagrant --caas-mode=swarm up // or vagrant --caas-mode=k8s up
```
### Availables soon

Expected for the beta version :
 - Provisioning of a single server (Docker-compose/MiniKube)
 - Deployment on AWS, GCE, OpenStack, CloudStack, etc.
 - Registering/unregistering of micro services `mi create/delete my_microservice.yml`
 - Add security (SSL/TLS, SELinux, etc.)
 - UI Responsiveness Monitoring
 - Serverless infrastructure (sub project : [`serverless-playground`](https://github.com/Chabane/serverless-playground)).
 - Big Data infrastructure (sub project : [`bigdata-playground`](https://github.com/Chabane/bigdata-playground)).
 - Add new default microservices : Rocket (Rust), Iris (Go), Django (Python), iOT (Akka Actors)
 - Add new solutions like : Rancher, Chef, Puppet, Terraform, HAProxy, etc.

### Follow the development
You can follow the development of infra via the public infra board on [`Trello`](https://trello.com/b/TCgfbNXK/infra)

## Contributing
`Pull requests` are welcome;

## License
infra generator is released under version 2.0 of the [Apache License](LICENSE).
